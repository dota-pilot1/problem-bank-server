import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../drizzle/schema-english';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateEnglishChapterDto } from './dto/create-english-chapter.dto';

@Injectable()
export class EnglishChaptersService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createDto: CreateEnglishChapterDto) {
    const [chapter] = await this.db
      .insert(schema.englishChapters)
      .values(createDto)
      .returning();
    return chapter;
  }

  async findAll(gradeLevel?: number) {
    if (gradeLevel) {
      return await this.db
        .select()
        .from(schema.englishChapters)
        .where(eq(schema.englishChapters.gradeLevel, gradeLevel))
        .orderBy(schema.englishChapters.orderIndex);
    }
    return await this.db
      .select()
      .from(schema.englishChapters)
      .orderBy(schema.englishChapters.orderIndex);
  }

  async findOne(id: number) {
    const [chapter] = await this.db
      .select()
      .from(schema.englishChapters)
      .where(eq(schema.englishChapters.id, id));
    return chapter;
  }

  async update(id: number, updateDto: Partial<CreateEnglishChapterDto>) {
    const [chapter] = await this.db
      .update(schema.englishChapters)
      .set(updateDto)
      .where(eq(schema.englishChapters.id, id))
      .returning();
    return chapter;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.englishChapters)
      .where(eq(schema.englishChapters.id, id));
    return { deleted: true };
  }

  async getOrCreateTestSetChapter(gradeLevel: number) {
    // "시험지 문제" 단원이 이미 있는지 확인
    const [existingChapter] = await this.db
      .select()
      .from(schema.englishChapters)
      .where(
        and(
          eq(schema.englishChapters.gradeLevel, gradeLevel),
          eq(schema.englishChapters.name, '시험지 문제'),
        ),
      );

    if (existingChapter) {
      return existingChapter;
    }

    // 없으면 생성
    const [newChapter] = await this.db
      .insert(schema.englishChapters)
      .values({
        gradeLevel,
        name: '시험지 문제',
        orderIndex: 999, // 맨 마지막에 배치
      })
      .returning();

    return newChapter;
  }
}
