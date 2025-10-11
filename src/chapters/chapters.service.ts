import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const [chapter] = await this.db
      .insert(schema.chapters)
      .values(createChapterDto)
      .returning();
    return chapter;
  }

  async findAll(gradeId?: number) {
    if (gradeId) {
      return await this.db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.gradeId, gradeId))
        .orderBy(schema.chapters.orderIndex);
    }
    return await this.db.select().from(schema.chapters);
  }

  async findBySubject(subjectId: number) {
    return await this.db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.subjectId, subjectId))
      .orderBy(schema.chapters.orderIndex);
  }

  async findByGrade(gradeId: number) {
    return await this.db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.gradeId, gradeId))
      .orderBy(schema.chapters.orderIndex);
  }

  async findOne(id: number) {
    const [chapter] = await this.db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, id));
    return chapter;
  }

  async update(id: number, updateChapterDto: Partial<CreateChapterDto>) {
    const [chapter] = await this.db
      .update(schema.chapters)
      .set(updateChapterDto)
      .where(eq(schema.chapters.id, id))
      .returning();
    return chapter;
  }

  async remove(id: number) {
    await this.db.delete(schema.chapters).where(eq(schema.chapters.id, id));
    return { deleted: true };
  }
}
