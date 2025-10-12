import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-math';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateMathProblemDto } from './dto/create-math-problem.dto';

@Injectable()
export class MathProblemsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createDto: CreateMathProblemDto) {
    const [problem] = await this.db
      .insert(schema.mathProblems)
      .values(createDto)
      .returning();
    return problem;
  }

  async findAll(chapterId?: number) {
    if (chapterId) {
      return await this.db
        .select()
        .from(schema.mathProblems)
        .where(eq(schema.mathProblems.chapterId, chapterId));
    }
    return await this.db.select().from(schema.mathProblems);
  }

  async findOne(id: number) {
    const [problem] = await this.db
      .select()
      .from(schema.mathProblems)
      .where(eq(schema.mathProblems.id, id));
    return problem;
  }

  async update(id: number, updateDto: Partial<CreateMathProblemDto>) {
    const [problem] = await this.db
      .update(schema.mathProblems)
      .set(updateDto)
      .where(eq(schema.mathProblems.id, id))
      .returning();
    return problem;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.mathProblems)
      .where(eq(schema.mathProblems.id, id));
    return { deleted: true };
  }
}
