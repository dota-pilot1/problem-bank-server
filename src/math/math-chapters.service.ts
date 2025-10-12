import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-math';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateMathChapterDto } from './dto/create-math-chapter.dto';

@Injectable()
export class MathChaptersService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createDto: CreateMathChapterDto) {
    const [chapter] = await this.db
      .insert(schema.mathChapters)
      .values(createDto)
      .returning();
    return chapter;
  }

  async findAll(gradeLevel?: number) {
    if (gradeLevel) {
      return await this.db
        .select()
        .from(schema.mathChapters)
        .where(eq(schema.mathChapters.gradeLevel, gradeLevel))
        .orderBy(schema.mathChapters.orderIndex);
    }
    return await this.db
      .select()
      .from(schema.mathChapters)
      .orderBy(schema.mathChapters.orderIndex);
  }

  async findOne(id: number) {
    const [chapter] = await this.db
      .select()
      .from(schema.mathChapters)
      .where(eq(schema.mathChapters.id, id));
    return chapter;
  }

  async update(id: number, updateDto: Partial<CreateMathChapterDto>) {
    const [chapter] = await this.db
      .update(schema.mathChapters)
      .set(updateDto)
      .where(eq(schema.mathChapters.id, id))
      .returning();
    return chapter;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.mathChapters)
      .where(eq(schema.mathChapters.id, id));
    return { deleted: true };
  }
}
