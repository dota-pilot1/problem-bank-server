import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import { CreateTestSetDto } from './dto/create-test-set.dto';
import { AddProblemDto } from './dto/add-problem.dto';

@Injectable()
export class TestSetsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createTestSetDto: CreateTestSetDto) {
    const [testSet] = await this.db
      .insert(schema.testSets)
      .values(createTestSetDto)
      .returning();
    return testSet;
  }

  async findAll(gradeId?: number) {
    if (gradeId) {
      return await this.db
        .select()
        .from(schema.testSets)
        .where(eq(schema.testSets.gradeId, gradeId));
    }
    return await this.db.select().from(schema.testSets);
  }

  async findOne(id: number) {
    const [testSet] = await this.db
      .select()
      .from(schema.testSets)
      .where(eq(schema.testSets.id, id));
    return testSet;
  }

  async findProblems(testSetId: number) {
    return await this.db
      .select({
        id: schema.problems.id,
        questionText: schema.problems.questionText,
        difficulty: schema.problems.difficulty,
        orderIndex: schema.testSetProblems.orderIndex,
      })
      .from(schema.testSetProblems)
      .where(eq(schema.testSetProblems.testSetId, testSetId))
      .innerJoin(
        schema.problems,
        eq(schema.testSetProblems.problemId, schema.problems.id),
      )
      .orderBy(schema.testSetProblems.orderIndex);
  }

  async addProblem(testSetId: number, addProblemDto: AddProblemDto) {
    const [result] = await this.db
      .insert(schema.testSetProblems)
      .values({
        testSetId,
        problemId: addProblemDto.problemId,
        orderIndex: addProblemDto.orderIndex,
      })
      .returning();
    return result;
  }

  async removeProblem(testSetId: number, problemId: number) {
    await this.db
      .delete(schema.testSetProblems)
      .where(
        eq(schema.testSetProblems.testSetId, testSetId) &&
          eq(schema.testSetProblems.problemId, problemId),
      );
    return { deleted: true };
  }

  async update(id: number, updateTestSetDto: Partial<CreateTestSetDto>) {
    const [testSet] = await this.db
      .update(schema.testSets)
      .set(updateTestSetDto)
      .where(eq(schema.testSets.id, id))
      .returning();
    return testSet;
  }

  async remove(id: number) {
    await this.db.delete(schema.testSets).where(eq(schema.testSets.id, id));
    return { deleted: true };
  }
}
