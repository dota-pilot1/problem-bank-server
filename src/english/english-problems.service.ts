import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, SQL } from 'drizzle-orm';
import * as schema from '../drizzle/schema-english';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateEnglishProblemDto } from './dto/create-english-problem.dto';

@Injectable()
export class EnglishProblemsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createDto: CreateEnglishProblemDto) {
    const [problem] = await this.db
      .insert(schema.englishProblems)
      .values(createDto)
      .returning();
    return problem;
  }

  async findAll(chapterId?: number, difficulty?: string) {
    const conditions: SQL[] = [];

    if (difficulty) {
      conditions.push(eq(schema.englishProblems.difficulty, difficulty as any));
    }

    if (conditions.length > 0) {
      return await this.db
        .select()
        .from(schema.englishProblems)
        .where(and(...conditions));
    }

    return await this.db.select().from(schema.englishProblems);
  }

  async findOne(id: number) {
    const [problem] = await this.db
      .select()
      .from(schema.englishProblems)
      .where(eq(schema.englishProblems.id, id));
    return problem;
  }

  async update(id: number, updateDto: Partial<CreateEnglishProblemDto>) {
    const [problem] = await this.db
      .update(schema.englishProblems)
      .set(updateDto)
      .where(eq(schema.englishProblems.id, id))
      .returning();
    return problem;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.englishProblems)
      .where(eq(schema.englishProblems.id, id));
    return { deleted: true };
  }
}
