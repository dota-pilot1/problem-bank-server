import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema-english';
import * as mainSchema from '../drizzle/schema';
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

  async publish(id: number) {
    const [testSet] = await this.db
      .update(schema.englishTestSets)
      .set({
        isPublished: true,
        publishedAt: new Date(),
      })
      .where(eq(schema.englishTestSets.id, id))
      .returning();
    return testSet;
  }

  async unpublish(id: number) {
    // 1. 해당 시험의 결과 삭제
    await this.db
      .delete(mainSchema.sharedTestResults)
      .where(eq(mainSchema.sharedTestResults.testSetId, id));

    // 2. 배포 상태 취소
    const [testSet] = await this.db
      .update(schema.englishTestSets)
      .set({
        isPublished: false,
        publishedAt: null,
      })
      .where(eq(schema.englishTestSets.id, id))
      .returning();
    return testSet;
  }

  async createTestData() {
    // 오늘 날짜 포맷
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateStr = `${month}월 ${day}일`;

    // 1. 스크립트형 문제 생성 (정답: 2번)
    const [scriptProblem1] = await this.db
      .insert(schema.englishProblems)
      .values({
        title: '카페 주문 대화',
        passage: null,
        scriptData: {
          characters: [
            { role: 'Sarah', avatar: 'Sarah', gender: 'female' },
            { role: 'Brandon', avatar: 'Brandon', gender: 'male' },
          ],
          dialogues: [
            {
              speaker: 'Sarah',
              text: 'Hi, can I get a large latte please?',
            },
            {
              speaker: 'Brandon',
              text: 'Sure! Would you like that hot or iced?',
            },
            {
              speaker: 'Sarah',
              text: 'Iced, please. And can I add an extra shot?',
            },
            { speaker: 'Brandon', text: 'Of course! That will be $5.50.' },
          ],
        },
        questionText: 'What did Sarah order?',
        options: [
          'A small coffee',
          'A large iced latte with an extra shot',
          'A hot cappuccino',
          'A medium tea',
        ],
        correctAnswer: '2',
        explanation:
          'Sarah가 large latte를 iced로 주문하고 extra shot을 추가했습니다.',
        difficulty: 'LEVEL_1',
        tags: 'listening,conversation',
        isActive: true,
        orderIndex: 0,
      })
      .returning();

    // 2. 지문형 문제 생성 (정답: 3번)
    const [passageProblem] = await this.db
      .insert(schema.englishProblems)
      .values({
        title: '자기소개 독해',
        passage: `Hello! My name is Emily. I am 15 years old and I live in Seoul. I go to Hansung Middle School. My favorite subject is English because I want to travel around the world someday. In my free time, I like to read books and play the piano.`,
        scriptData: null,
        questionText: "What is Emily's favorite subject?",
        options: ['Math', 'Science', 'English', 'Music'],
        correctAnswer: '3',
        explanation: 'Emily는 "My favorite subject is English"라고 말했습니다.',
        difficulty: 'LEVEL_2',
        tags: 'reading,introduction',
        isActive: true,
        orderIndex: 1,
      })
      .returning();

    // 3. 스크립트형 문제 생성 (정답: 1번)
    const [scriptProblem2] = await this.db
      .insert(schema.englishProblems)
      .values({
        title: '학교 대화',
        passage: null,
        scriptData: {
          characters: [
            { role: 'Katie', avatar: 'Katie', gender: 'female' },
            { role: 'Ronald', avatar: 'Ronald', gender: 'male' },
          ],
          dialogues: [
            {
              speaker: 'Katie',
              text: 'What time does the math class start?',
            },
            {
              speaker: 'Ronald',
              text: "It starts at 9 o'clock.",
            },
            {
              speaker: 'Katie',
              text: "Oh no, I'm going to be late!",
            },
            { speaker: 'Ronald', text: 'Hurry up! You have 5 minutes.' },
          ],
        },
        questionText: 'What time does the math class start?',
        options: ["9 o'clock", "10 o'clock", "8 o'clock", "11 o'clock"],
        correctAnswer: '1',
        explanation: 'Ronald이 "It starts at 9 o\'clock"이라고 말했습니다.',
        difficulty: 'LEVEL_1',
        tags: 'listening,school',
        isActive: true,
        orderIndex: 2,
      })
      .returning();

    // 4. 지문형 문제 생성 (정답: 4번)
    const [passageProblem2] = await this.db
      .insert(schema.englishProblems)
      .values({
        title: '일상 독해',
        passage: `Tom wakes up at 7 AM every day. He eats breakfast with his family and then walks to school. After school, he plays soccer with his friends. He usually does his homework after dinner and goes to bed at 10 PM.`,
        scriptData: null,
        questionText: 'What does Tom do after school?',
        options: [
          'He does homework',
          'He watches TV',
          'He reads books',
          'He plays soccer',
        ],
        correctAnswer: '4',
        explanation: 'Tom은 방과 후에 친구들과 축구를 합니다.',
        difficulty: 'LEVEL_2',
        tags: 'reading,daily-life',
        isActive: true,
        orderIndex: 3,
      })
      .returning();

    // 5. 시험지 생성
    const [testSet] = await this.db
      .insert(schema.englishTestSets)
      .values({
        title: `${dateStr} 영어 실력 평가`,
        description: '영어 듣기와 독해 능력을 평가하는 테스트입니다.',
        gradeLevel: 1,
        testType: 'DAILY',
        totalQuestions: 4,
        timeLimit: 30,
        isActive: true,
      })
      .returning();

    // 6. 시험지에 문제 추가 (스크립트, 지문 섞어서)
    await this.db.insert(schema.englishTestSetProblems).values([
      {
        testSetId: testSet.id,
        problemId: scriptProblem1.id,
        orderIndex: 0,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: passageProblem.id,
        orderIndex: 1,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: scriptProblem2.id,
        orderIndex: 2,
        score: 25,
      },
      {
        testSetId: testSet.id,
        problemId: passageProblem2.id,
        orderIndex: 3,
        score: 25,
      },
    ]);

    return {
      message: '영어 시험지 테스트 데이터가 생성되었습니다',
      testSetId: testSet.id,
      testSetTitle: testSet.title,
      problemsCreated: 4,
    };
  }
}
