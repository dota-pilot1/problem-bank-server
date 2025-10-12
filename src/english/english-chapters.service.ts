import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
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
}
