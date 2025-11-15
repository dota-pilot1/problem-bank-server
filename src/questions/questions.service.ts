import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema-tree';
import { CreateQuestionDto, UpdateQuestionDto } from './questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * 모든 문제 조회
   */
  async findAll(categoryId?: number, creatorType?: string) {
    let query = this.db.select().from(schema.questions).$dynamic();

    if (categoryId && creatorType) {
      query = query.where(
        and(
          eq(schema.questions.categoryId, categoryId),
          eq(schema.questions.creatorType, creatorType as any),
        ),
      );
    } else if (categoryId) {
      query = query.where(eq(schema.questions.categoryId, categoryId));
    } else if (creatorType) {
      query = query.where(eq(schema.questions.creatorType, creatorType as any));
    }

    const result = await query.orderBy(schema.questions.orderIndex);

    return result;
  }

  /**
   * 특정 문제 조회
   */
  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, id))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return result[0];
  }

  /**
   * 문제 생성
   */
  async create(dto: CreateQuestionDto) {
    const result = await this.db
      .insert(schema.questions)
      .values({
        categoryId: dto.categoryId,
        creatorType: dto.creatorType || 'SYSTEM',
        creatorId: dto.creatorId || null,
        title: dto.title || null,
        passage: dto.passage || null,
        questionText: dto.questionText,
        options: dto.options || null,
        correctAnswer: dto.correctAnswer,
        explanation: dto.explanation || null,
        difficulty: dto.difficulty || null,
        tags: dto.tags || null,
        formula: dto.formula || null,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        orderIndex: dto.orderIndex || 0,
      })
      .returning();

    return result[0];
  }

  /**
   * 문제 수정
   */
  async update(id: number, dto: UpdateQuestionDto) {
    await this.findOne(id); // 존재 확인

    const result = await this.db
      .update(schema.questions)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.questions.id, id))
      .returning();

    return result[0];
  }

  /**
   * 문제 삭제
   */
  async remove(id: number) {
    await this.findOne(id); // 존재 확인

    await this.db.delete(schema.questions).where(eq(schema.questions.id, id));

    return { deleted: true };
  }

  /**
   * 특정 카테고리의 문제 목록
   */
  async findByCategory(categoryId: number) {
    const result = await this.db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.categoryId, categoryId))
      .orderBy(schema.questions.orderIndex);

    return result;
  }

  /**
   * 특정 사용자의 문제 목록
   */
  async findByCreator(creatorId: number) {
    const result = await this.db
      .select()
      .from(schema.questions)
      .where(
        and(
          eq(schema.questions.creatorType, 'USER'),
          eq(schema.questions.creatorId, creatorId),
        ),
      )
      .orderBy(desc(schema.questions.createdAt));

    return result;
  }

  /**
   * 문제 이동 (카테고리 변경)
   */
  async moveToCategory(questionId: number, newCategoryId: number) {
    return this.update(questionId, { categoryId: newCategoryId });
  }
}
