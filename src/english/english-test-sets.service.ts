import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-english';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';

export interface CreateEnglishTestSetDto {
  title: string;
  description?: string;
  gradeLevel: number;
  testType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MIDTERM' | 'FINAL' | 'MOCK';
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

  async addProblemToTestSet(
    testSetId: number,
    problemId: number,
    score: number = 1,
  ) {
    // 현재 문제 개수 조회하여 orderIndex 결정
    const existingProblems = await this.db
      .select()
      .from(schema.englishTestSetProblems)
      .where(eq(schema.englishTestSetProblems.testSetId, testSetId));

    const orderIndex = existingProblems.length;

    const [result] = await this.db
      .insert(schema.englishTestSetProblems)
      .values({
        testSetId,
        problemId,
        orderIndex,
        score,
      })
      .returning();

    // totalQuestions 업데이트
    await this.db
      .update(schema.englishTestSets)
      .set({ totalQuestions: existingProblems.length + 1 })
      .where(eq(schema.englishTestSets.id, testSetId));

    return result;
  }

  async removeProblemFromTestSet(testSetId: number, problemId: number) {
    await this.db
      .delete(schema.englishTestSetProblems)
      .where(
        eq(schema.englishTestSetProblems.testSetId, testSetId) &&
          eq(schema.englishTestSetProblems.problemId, problemId),
      );

    // totalQuestions 업데이트
    const remainingProblems = await this.db
      .select()
      .from(schema.englishTestSetProblems)
      .where(eq(schema.englishTestSetProblems.testSetId, testSetId));

    await this.db
      .update(schema.englishTestSets)
      .set({ totalQuestions: remainingProblems.length })
      .where(eq(schema.englishTestSets.id, testSetId));

    return { message: 'Problem removed successfully' };
  }

  async createTestData() {
    // 오늘 날짜 포맷
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateStr = `${month}월 ${day}일`;

    // 1. 스크립트형 문제 생성
    const [scriptProblem] = await this.db
      .insert(schema.englishProblems)
      .values({
        title: '카페 주문 대화',
        passage: null,
        scriptData: {
          characters: [
            { role: 'Customer', avatar: '👤', gender: 'male' },
            { role: 'Barista', avatar: '☕', gender: 'female' },
          ],
          dialogues: [
            {
              speaker: 'Customer',
              text: 'Hi, can I get a large latte please?',
            },
            {
              speaker: 'Barista',
              text: 'Sure! Would you like that hot or iced?',
            },
            {
              speaker: 'Customer',
              text: 'Iced, please. And can I add an extra shot?',
            },
            { speaker: 'Barista', text: 'Of course! That will be $5.50.' },
          ],
        },
        questionText: 'What did the customer order?',
        options: [
          'A small coffee',
          'A large iced latte with an extra shot',
          'A hot cappuccino',
          'A medium tea',
        ],
        correctAnswer: '2',
        explanation:
          '고객이 large latte를 iced로 주문하고 extra shot을 추가했습니다.',
        difficulty: 'LEVEL_1',
        tags: 'listening,conversation',
        isActive: true,
        orderIndex: 0,
      })
      .returning();

    // 2. 시험지 생성
    const [testSet] = await this.db
      .insert(schema.englishTestSets)
      .values({
        title: `${dateStr} 영어 듣기 평가`,
        description: '영어 대화 듣기 능력을 평가하는 테스트입니다.',
        gradeLevel: 1,
        testType: 'DAILY',
        totalQuestions: 1,
        timeLimit: 30,
        isActive: true,
      })
      .returning();

    // 3. 시험지에 문제 추가
    await this.db.insert(schema.englishTestSetProblems).values({
      testSetId: testSet.id,
      problemId: scriptProblem.id,
      orderIndex: 0,
      score: 100,
    });

    return {
      message: '영어 시험지 테스트 데이터가 생성되었습니다',
      testSetId: testSet.id,
      testSetTitle: testSet.title,
      problemsCreated: 1,
    };
  }
}
