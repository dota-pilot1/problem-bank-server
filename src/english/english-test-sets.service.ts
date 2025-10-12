import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-english';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';

export interface CreateEnglishTestSetDto {
  title: string;
  description?: string;
  gradeLevel: number;
  testType: 'MIDTERM' | 'MOCK' | 'FINAL';
  totalQuestions: number;
  timeLimit?: number;
  isActive?: boolean;
}

@Injectable()
export class EnglishTestSetsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateEnglishTestSetDto) {
    const [testSet] = await this.db
      .insert(schema.englishTestSets)
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
        .from(schema.englishTestSets)
        .where(eq(schema.englishTestSets.gradeLevel, gradeLevel));
    }

    return this.db.select().from(schema.englishTestSets);
  }

  async findOne(id: number) {
    const [testSet] = await this.db
      .select()
      .from(schema.englishTestSets)
      .where(eq(schema.englishTestSets.id, id));

    return testSet;
  }

  async update(id: number, dto: Partial<CreateEnglishTestSetDto>) {
    const [updated] = await this.db
      .update(schema.englishTestSets)
      .set(dto)
      .where(eq(schema.englishTestSets.id, id))
      .returning();

    return updated;
  }

  async remove(id: number) {
    await this.db
      .delete(schema.englishTestSets)
      .where(eq(schema.englishTestSets.id, id));

    return { message: 'Test set deleted successfully' };
  }

  async getTestSetProblems(testSetId: number) {
    return this.db
      .select({
        problem: schema.englishProblems,
        orderIndex: schema.englishTestSetProblems.orderIndex,
        score: schema.englishTestSetProblems.score,
      })
      .from(schema.englishTestSetProblems)
      .innerJoin(
        schema.englishProblems,
        eq(schema.englishTestSetProblems.problemId, schema.englishProblems.id),
      )
      .where(eq(schema.englishTestSetProblems.testSetId, testSetId));
  }
}
