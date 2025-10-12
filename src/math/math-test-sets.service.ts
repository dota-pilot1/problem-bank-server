import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-math';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';

export interface CreateMathTestSetDto {
  title: string;
  description?: string;
  gradeLevel: number;
  testType: 'MIDTERM' | 'MOCK' | 'FINAL';
  totalQuestions: number;
  timeLimit?: number;
  isActive?: boolean;
}

@Injectable()
export class MathTestSetsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateMathTestSetDto) {
    const [testSet] = await this.db
      .insert(schema.mathTestSets)
      .values({
        title: dto.title,
        description: dto.description,
        gradeLevel: dto.gradeLevel,
        testType: dto.testType,
        totalQuestions: dto.totalQuestions,
        timeLimit: dto.timeLimit,
        isActive: dto.isActive ?? true,
      })
      .returning();

    return testSet;
  }

  async findAll(gradeLevel?: number) {
    if (gradeLevel) {
      return this.db
        .select()
        .from(schema.mathTestSets)
        .where(eq(schema.mathTestSets.gradeLevel, gradeLevel));
    }

    return this.db.select().from(schema.mathTestSets);
  }

  async findOne(id: number) {
    const [testSet] = await this.db
      .select()
      .from(schema.mathTestSets)
      .where(eq(schema.mathTestSets.id, id));

    return testSet;
  }

  async update(id: number, dto: Partial<CreateMathTestSetDto>) {
    const [updated] = await this.db
      .update(schema.mathTestSets)
      .set(dto)
      .where(eq(schema.mathTestSets.id, id))
      .returning();

    return updated;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.mathTestSets)
      .where(eq(schema.mathTestSets.id, id));

    return { message: 'Test set deleted successfully' };
  }

  async getTestSetProblems(testSetId: number) {
    return this.db
      .select({
        problem: schema.mathProblems,
        orderIndex: schema.mathTestSetProblems.orderIndex,
        score: schema.mathTestSetProblems.score,
      })
      .from(schema.mathTestSetProblems)
      .innerJoin(
        schema.mathProblems,
        eq(schema.mathTestSetProblems.problemId, schema.mathProblems.id),
      )
      .where(eq(schema.mathTestSetProblems.testSetId, testSetId));
  }
}
