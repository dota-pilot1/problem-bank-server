import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './drizzle/schema';
import * as englishSchema from './drizzle/schema-english';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from './drizzle/drizzle.module';
import {
  SubmitTestDto,
  TestResultResponse,
  QuestionResultDto,
  RankingResponse,
  RankEntryDto,
} from './shared-test-results.dto';

@Injectable()
export class SharedTestResultsService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async submitTest(dto: SubmitTestDto): Promise<TestResultResponse> {
    // 1. 시험지 문제 조회 (영어 시험지)
    const testSetProblems = await this.db
      .select({
        problemId: englishSchema.englishTestSetProblems.problemId,
        orderIndex: englishSchema.englishTestSetProblems.orderIndex,
        score: englishSchema.englishTestSetProblems.score,
        questionText: englishSchema.englishProblems.questionText,
        correctAnswer: englishSchema.englishProblems.correctAnswer,
        options: englishSchema.englishProblems.options,
      })
      .from(englishSchema.englishTestSetProblems)
      .innerJoin(
        englishSchema.englishProblems,
        eq(
          englishSchema.englishTestSetProblems.problemId,
          englishSchema.englishProblems.id,
        ),
      )
      .where(eq(englishSchema.englishTestSetProblems.testSetId, dto.testSetId))
      .orderBy(englishSchema.englishTestSetProblems.orderIndex);

    if (testSetProblems.length === 0) {
      throw new Error('문제를 찾을 수 없습니다');
    }

    // 2. 채점
    let totalScore = 0;
    let earnedScore = 0;
    const questionResults: QuestionResultDto[] = [];

    const userAnswersMap = new Map(
      dto.answers.map((a) => [a.problemId, a.selectedAnswer]),
    );

    for (const problem of testSetProblems) {
      totalScore += problem.score;

      const selectedAnswer = userAnswersMap.get(problem.problemId);
      const isCorrect = selectedAnswer === problem.correctAnswer;
      const score = isCorrect ? problem.score : 0;
      earnedScore += score;

      questionResults.push({
        problemId: problem.problemId,
        questionText: problem.questionText,
        selectedAnswer: selectedAnswer || undefined,
        correctAnswer: problem.correctAnswer,
        isCorrect,
        score,
      });
    }

    // 3. 결과 저장
    const [result] = await this.db
      .insert(schema.sharedTestResults)
      .values({
        testSetId: dto.testSetId,
        userId: dto.userId || null,
        guestId: dto.guestId || null,
        userName: dto.userName,
        totalScore,
        earnedScore,
        answers: dto.answers,
        timeSpentSeconds: dto.timeSpentSeconds || null,
      })
      .returning();

    // 4. 랭킹 계산
    const allResults = await this.db
      .select()
      .from(schema.sharedTestResults)
      .where(eq(schema.sharedTestResults.testSetId, dto.testSetId))
      .orderBy(desc(schema.sharedTestResults.earnedScore));

    const rank = allResults.findIndex((r) => r.id === result.id) + 1;

    return {
      id: result.id,
      testSetId: result.testSetId,
      userName: result.userName || '익명사용자',
      totalScore: result.totalScore,
      earnedScore: result.earnedScore,
      percentage:
        result.totalScore > 0
          ? Math.round((result.earnedScore / result.totalScore) * 100)
          : 0,
      rank,
      totalParticipants: allResults.length,
      timeSpentSeconds: result.timeSpentSeconds ?? undefined,
      completedAt: result.completedAt,
      questionResults,
      isGuest: !dto.userId,
    };
  }

  async getRanking(
    testSetId: number,
    userId?: number,
    guestId?: string,
  ): Promise<RankingResponse> {
    // 1. 시험지 정보 조회 (영어 시험지)
    const [testSet] = await this.db
      .select()
      .from(englishSchema.englishTestSets)
      .where(eq(englishSchema.englishTestSets.id, testSetId))
      .limit(1);

    if (!testSet) {
      throw new Error('시험지를 찾을 수 없습니다');
    }

    // 2. 결과 조회 및 정렬
    const results = await this.db
      .select()
      .from(schema.sharedTestResults)
      .where(eq(schema.sharedTestResults.testSetId, testSetId))
      .orderBy(desc(schema.sharedTestResults.earnedScore));

    // 3. 랭킹 생성
    const rankings: RankEntryDto[] = results.map((result, index) => {
      const isMe =
        (userId && result.userId === userId) ||
        (guestId && result.guestId === guestId);

      return {
        rank: index + 1,
        userName: result.userName || '익명사용자',
        earnedScore: result.earnedScore,
        totalScore: result.totalScore,
        percentage:
          result.totalScore > 0
            ? Math.round((result.earnedScore / result.totalScore) * 100)
            : 0,
        completedAt: result.completedAt,
        isMe: !!isMe,
      };
    });

    return {
      testSetId,
      testTitle: testSet.title,
      totalParticipants: results.length,
      rankings,
    };
  }

  async resetRanking(
    testSetId: number,
  ): Promise<{ success: boolean; message: string }> {
    // 해당 시험지의 모든 결과 삭제
    const deleted = await this.db
      .delete(schema.sharedTestResults)
      .where(eq(schema.sharedTestResults.testSetId, testSetId))
      .returning();

    return {
      success: true,
      message: `${deleted.length}개의 결과가 삭제되었습니다.`,
    };
  }

  async getSubmittedTestIds(
    userId?: number,
    guestId?: string,
  ): Promise<number[]> {
    let results;

    if (userId) {
      results = await this.db
        .select({ testSetId: schema.sharedTestResults.testSetId })
        .from(schema.sharedTestResults)
        .where(eq(schema.sharedTestResults.userId, userId));
    } else if (guestId) {
      results = await this.db
        .select({ testSetId: schema.sharedTestResults.testSetId })
        .from(schema.sharedTestResults)
        .where(eq(schema.sharedTestResults.guestId, guestId));
    } else {
      return [];
    }

    // 중복 제거
    const testSetIds = [
      ...new Set(results.map((r) => r.testSetId)),
    ] as number[];
    return testSetIds;
  }
}
