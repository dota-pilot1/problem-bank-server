import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-math';
import * as mainSchema from '../drizzle/schema';
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
    // 먼저 연결된 문제들 삭제
    await this.db
      .delete(schema.mathTestSetProblems)
      .where(eq(schema.mathTestSetProblems.testSetId, id));

    // 시험지 삭제
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

  async addProblemToTestSet(
    testSetId: number,
    problemId: number,
    score: number = 1,
  ) {
    const existingProblems = await this.db
      .select()
      .from(schema.mathTestSetProblems)
      .where(eq(schema.mathTestSetProblems.testSetId, testSetId));

    const orderIndex = existingProblems.length;

    const [result] = await this.db
      .insert(schema.mathTestSetProblems)
      .values({
        testSetId,
        problemId,
        orderIndex,
        score,
      })
      .returning();

    await this.db
      .update(schema.mathTestSets)
      .set({ totalQuestions: existingProblems.length + 1 })
      .where(eq(schema.mathTestSets.id, testSetId));

    return result;
  }

  async removeProblemFromTestSet(testSetId: number, problemId: number) {
    await this.db
      .delete(schema.mathTestSetProblems)
      .where(
        eq(schema.mathTestSetProblems.testSetId, testSetId) &&
          eq(schema.mathTestSetProblems.problemId, problemId),
      );

    const remainingProblems = await this.db
      .select()
      .from(schema.mathTestSetProblems)
      .where(eq(schema.mathTestSetProblems.testSetId, testSetId));

    await this.db
      .update(schema.mathTestSets)
      .set({ totalQuestions: remainingProblems.length })
      .where(eq(schema.mathTestSets.id, testSetId));

    return { message: 'Problem removed successfully' };
  }

  async publish(id: number) {
    const [testSet] = await this.db
      .update(schema.mathTestSets)
      .set({
        isPublished: true,
        publishedAt: new Date(),
      })
      .where(eq(schema.mathTestSets.id, id))
      .returning();
    return testSet;
  }

  async unpublish(id: number) {
    // 1. 해당 시험의 결과(성적/오답) 삭제
    await this.db
      .delete(mainSchema.sharedMathTestResults)
      .where(eq(mainSchema.sharedMathTestResults.testSetId, id));

    // 2. 배포 상태 취소
    const [testSet] = await this.db
      .update(schema.mathTestSets)
      .set({
        isPublished: false,
        publishedAt: null,
      })
      .where(eq(schema.mathTestSets.id, id))
      .returning();
    return testSet;
  }

  async createTestData() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateStr = `${month}월 ${day}일`;

    // 1. 수학 문제 4개 생성 (정답 분포: 1번, 2번, 3번, 4번)
    const [problem1] = await this.db
      .insert(schema.mathProblems)
      .values({
        questionText: '다음 이차방정식의 해를 구하시오: x² - 5x + 6 = 0',
        options: ['x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = 1, 5'],
        correctAnswer: '1',
        explanation: 'x² - 5x + 6 = (x - 2)(x - 3) = 0 이므로 x = 2 또는 x = 3',
        difficulty: 'LEVEL_2',
        formula: 'x² - 5x + 6 = 0',
        tags: 'algebra,quadratic',
        isActive: true,
        orderIndex: 0,
      })
      .returning();

    const [problem2] = await this.db
      .insert(schema.mathProblems)
      .values({
        questionText: '반지름이 5cm인 원의 넓이를 구하시오. (π = 3.14)',
        options: ['31.4 cm²', '78.5 cm²', '157 cm²', '15.7 cm²'],
        correctAnswer: '2',
        explanation: '원의 넓이 = πr² = 3.14 × 5² = 3.14 × 25 = 78.5 cm²',
        difficulty: 'LEVEL_1',
        formula: 'S = πr²',
        tags: 'geometry,circle',
        isActive: true,
        orderIndex: 1,
      })
      .returning();

    const [problem3] = await this.db
      .insert(schema.mathProblems)
      .values({
        questionText:
          '직각삼각형에서 두 변의 길이가 3과 4일 때, 빗변의 길이는?',
        options: ['6', '7', '5', '8'],
        correctAnswer: '3',
        explanation: '피타고라스 정리: c² = a² + b² = 9 + 16 = 25, c = 5',
        difficulty: 'LEVEL_2',
        formula: 'a² + b² = c²',
        tags: 'geometry,pythagorean',
        isActive: true,
        orderIndex: 2,
      })
      .returning();

    const [problem4] = await this.db
      .insert(schema.mathProblems)
      .values({
        questionText: '2x + 3 = 11일 때, x의 값은?',
        options: ['2', '3', '5', '4'],
        correctAnswer: '4',
        explanation: '2x = 11 - 3 = 8, x = 4',
        difficulty: 'LEVEL_1',
        formula: '2x + 3 = 11',
        tags: 'algebra,linear',
        isActive: true,
        orderIndex: 3,
      })
      .returning();

    // 2. 시험지 생성
    const [testSet] = await this.db
      .insert(schema.mathTestSets)
      .values({
        title: `${dateStr} 수학 실력 평가`,
        description: '수학 기초 실력을 평가하는 테스트입니다.',
        gradeLevel: 1,
        testType: 'MIDTERM',
        totalQuestions: 4,
        timeLimit: 30,
        isActive: true,
      })
      .returning();

    // 3. 시험지에 문제 추가
    await this.db.insert(schema.mathTestSetProblems).values([
      {
        testSetId: testSet.id,
        problemId: problem1.id,
        orderIndex: 0,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: problem2.id,
        orderIndex: 1,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: problem3.id,
        orderIndex: 2,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: problem4.id,
        orderIndex: 3,
        score: 25,
      },
    ]);

    return {
      message: '수학 시험지 테스트 데이터가 생성되었습니다',
      testSetId: testSet.id,
      testSetTitle: testSet.title,
      problemsCreated: 4,
    };
  }
}
