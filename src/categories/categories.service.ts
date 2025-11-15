import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema-tree';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryTreeDto,
} from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * 모든 카테고리 조회 (플랫 리스트)
   */
  async findAll(subject?: string, creatorType?: string) {
    let query = this.db.select().from(schema.categories).$dynamic();

    if (subject && creatorType) {
      query = query.where(
        and(
          eq(schema.categories.subject, subject as any),
          eq(schema.categories.creatorType, creatorType as any),
        ),
      );
    } else if (subject) {
      query = query.where(eq(schema.categories.subject, subject as any));
    } else if (creatorType) {
      query = query.where(
        eq(schema.categories.creatorType, creatorType as any),
      );
    }

    const result = await query.orderBy(schema.categories.orderIndex);

    return result;
  }

  /**
   * 트리 구조로 카테고리 조회
   */
  async findTree(
    subject?: string,
    creatorType?: string,
  ): Promise<CategoryTreeDto[]> {
    const allCategories = await this.findAll(subject, creatorType);

    // 각 카테고리별 문제 개수 조회
    const questionCounts = await this.db
      .select({
        categoryId: schema.questions.categoryId,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.questions)
      .groupBy(schema.questions.categoryId);

    const countMap = new Map(
      questionCounts.map((item) => [item.categoryId, item.count]),
    );

    // 트리 구조 빌드
    const buildTree = (parentId: number | null): CategoryTreeDto[] => {
      return allCategories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => {
          return {
            ...cat,
            children: buildTree(cat.id),
            questionCount: countMap.get(cat.id) || 0,
          } as CategoryTreeDto;
        })
        .sort((a, b) => a.orderIndex - b.orderIndex);
    };

    return buildTree(null);
  }

  /**
   * 특정 카테고리 조회
   */
  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return result[0];
  }

  /**
   * 카테고리 생성
   */
  async create(dto: CreateCategoryDto) {
    const result = await this.db
      .insert(schema.categories)
      .values({
        parentId: dto.parentId || null,
        name: dto.name,
        subject: dto.subject,
        creatorType: dto.creatorType || 'SYSTEM',
        creatorId: dto.creatorId || null,
        orderIndex: dto.orderIndex || 0,
        description: dto.description || null,
      })
      .returning();

    return result[0];
  }

  /**
   * 카테고리 수정
   */
  async update(id: number, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id);

    const result = await this.db
      .update(schema.categories)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.categories.id, id))
      .returning();

    return result[0];
  }

  /**
   * 카테고리 삭제 (cascade로 하위 카테고리도 삭제됨)
   */
  async remove(id: number) {
    await this.findOne(id); // 존재 확인

    await this.db.delete(schema.categories).where(eq(schema.categories.id, id));

    return { deleted: true };
  }

  /**
   * 특정 부모의 자식 카테고리 조회
   */
  async findChildren(parentId: number) {
    const result = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.parentId, parentId))
      .orderBy(schema.categories.orderIndex);

    return result;
  }

  /**
   * 루트 카테고리 조회 (parentId = null)
   */
  async findRoots(subject?: string) {
    const conditions = [isNull(schema.categories.parentId)];

    if (subject) {
      conditions.push(eq(schema.categories.subject, subject as any));
    }

    const result = await this.db
      .select()
      .from(schema.categories)
      .where(and(...conditions))
      .orderBy(schema.categories.orderIndex);

    return result;
  }
}
