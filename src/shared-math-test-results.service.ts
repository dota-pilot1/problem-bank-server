import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './drizzle/schema';
import * as mathSchema from './drizzle/schema-math';
import { eq, desc, and, sql } from 'drizzle-orm';
import { DRIZZLE_ORM } from './drizzle/drizzle.module';
import {
  SubmitTestDto,
  TestResultResponse,
  QuestionResultDto,
  RankingResponse,
  RankEntryDto,
} from './shared-test-results.dto';

@Injectable()
export class SharedMathTestResultsService {
  constructor(@Inject(DRIZZLE_ORM) private db: NodePgDatabase<typeof schema>) {}

  async submitTest(dto: SubmitTestDto): Promise<TestResultResponse> {
    // 1. 시험지 문제 조회 (수학 시험지)
    const testSetProblems = await this.db
      .select({
        problemId: mathSchema.mathTestSetProblems.problemId,
        orderIndex: mathSchema.mathTestSetProblems.orderIndex,
        score: mathSchema.mathTestSetProblems.score,
        questionText: mathSchema.mathProblems.questionText,
        correctAnswer: mathSchema.mathProblems.correctAnswer,
        options: mathSchema.mathProblems.options,
      })
      .from(mathSchema.mathTestSetProblems)
      .innerJoin(
        mathSchema.mathProblems,
        eq(
          mathSchema.mathTestSetProblems.problemId,
          mathSchema.mathProblems.id,
        ),
      )
      .where(eq(mathSchema.mathTestSetProblems.testSetId, dto.testSetId))
      .orderBy(mathSchema.mathTestSetProblems.orderIndex);

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

    // 3. 결과 저장 (수학 전용 테이블)
    const [result] = await this.db
      .insert(schema.sharedMathTestResults)
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
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.testSetId, dto.testSetId))
      .orderBy(desc(schema.sharedMathTestResults.earnedScore));

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
    // 1. 시험지 정보 조회 (수학 시험지)
    const [testSet] = await this.db
      .select()
      .from(mathSchema.mathTestSets)
      .where(eq(mathSchema.mathTestSets.id, testSetId))
      .limit(1);

    if (!testSet) {
      throw new Error('시험지를 찾을 수 없습니다');
    }

    // 2. 결과 조회 및 정렬
    const results = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.testSetId, testSetId))
      .orderBy(desc(schema.sharedMathTestResults.earnedScore));

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
      .delete(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.testSetId, testSetId))
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
        .select({ testSetId: schema.sharedMathTestResults.testSetId })
        .from(schema.sharedMathTestResults)
        .where(eq(schema.sharedMathTestResults.userId, userId));
    } else if (guestId) {
      results = await this.db
        .select({ testSetId: schema.sharedMathTestResults.testSetId })
        .from(schema.sharedMathTestResults)
        .where(eq(schema.sharedMathTestResults.guestId, guestId));
    } else {
      return [];
    }

    // 중복 제거
    const testSetIds = [
      ...new Set(results.map((r) => r.testSetId)),
    ] as number[];
    return testSetIds;
  }

  async getScoreReportSummary(userId: number): Promise<{
    totalTests: number;
    averageScore: number;
    highestScore: number;
    recentScore: number | null;
    correctRate: number;
  }> {
    const results = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.userId, userId))
      .orderBy(desc(schema.sharedMathTestResults.completedAt));

    if (results.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        highestScore: 0,
        recentScore: null,
        correctRate: 0,
      };
    }

    const totalTests = results.length;
    const totalEarned = results.reduce((sum, r) => sum + r.earnedScore, 0);
    const totalPossible = results.reduce((sum, r) => sum + r.totalScore, 0);
    const averageScore = Math.round((totalEarned / totalTests) * 10) / 10;
    const highestScore = Math.max(...results.map((r) => r.earnedScore));
    const recentScore = results[0].earnedScore;
    const correctRate =
      totalPossible > 0
        ? Math.round((totalEarned / totalPossible) * 1000) / 10
        : 0;

    return {
      totalTests,
      averageScore,
      highestScore,
      recentScore,
      correctRate,
    };
  }

  async getScoreReportHistory(userId: number): Promise<
    Array<{
      id: number;
      testSetId: number;
      testTitle: string;
      earnedScore: number;
      totalScore: number;
      correctRate: number;
      completedAt: Date;
    }>
  > {
    const results = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.userId, userId))
      .orderBy(desc(schema.sharedMathTestResults.completedAt));

    const historyItems: Array<{
      id: number;
      testSetId: number;
      testTitle: string;
      earnedScore: number;
      totalScore: number;
      correctRate: number;
      completedAt: Date;
    }> = [];

    for (const result of results) {
      const [testSet] = await this.db
        .select({ title: mathSchema.mathTestSets.title })
        .from(mathSchema.mathTestSets)
        .where(eq(mathSchema.mathTestSets.id, result.testSetId))
        .limit(1);

      historyItems.push({
        id: result.id,
        testSetId: result.testSetId,
        testTitle: testSet?.title || `시험 #${result.testSetId}`,
        earnedScore: result.earnedScore,
        totalScore: result.totalScore,
        correctRate:
          result.totalScore > 0
            ? Math.round((result.earnedScore / result.totalScore) * 1000) / 10
            : 0,
        completedAt: result.completedAt,
      });
    }

    return historyItems;
  }

  async getWrongAnswers(userId: number): Promise<
    Array<{
      problemId: number;
      questionText: string;
      options: unknown;
      correctAnswer: string;
      selectedAnswer: string;
      wrongCount: number;
      lastAttemptedAt: Date;
    }>
  > {
    const results = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.userId, userId))
      .orderBy(desc(schema.sharedMathTestResults.completedAt));

    const wrongAnswersMap = new Map<
      number,
      {
        problemId: number;
        questionText: string;
        options: unknown;
        correctAnswer: string;
        selectedAnswer: string;
        wrongCount: number;
        lastAttemptedAt: Date;
      }
    >();

    for (const result of results) {
      const answers = result.answers as Array<{
        problemId: number;
        selectedAnswer: string;
      }>;

      for (const answer of answers) {
        const [problem] = await this.db
          .select()
          .from(mathSchema.mathProblems)
          .where(eq(mathSchema.mathProblems.id, answer.problemId))
          .limit(1);

        if (problem && answer.selectedAnswer !== problem.correctAnswer) {
          if (wrongAnswersMap.has(answer.problemId)) {
            const existing = wrongAnswersMap.get(answer.problemId)!;
            wrongAnswersMap.set(answer.problemId, {
              ...existing,
              wrongCount: existing.wrongCount + 1,
            });
          } else {
            wrongAnswersMap.set(answer.problemId, {
              problemId: answer.problemId,
              questionText: problem.questionText,
              options: problem.options,
              correctAnswer: problem.correctAnswer,
              selectedAnswer: answer.selectedAnswer,
              wrongCount: 1,
              lastAttemptedAt: result.completedAt,
            });
          }
        }
      }
    }

    return Array.from(wrongAnswersMap.values());
  }

  async getWrongAnswerDetail(
    userId: number,
    problemId: number,
  ): Promise<{
    problemId: number;
    questionText: string;
    options: unknown;
    correctAnswer: string;
    selectedAnswer: string;
    explanation: string | null;
    formula: string | null;
  } | null> {
    const results = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.userId, userId))
      .orderBy(desc(schema.sharedMathTestResults.completedAt));

    for (const result of results) {
      const answers = result.answers as Array<{
        problemId: number;
        selectedAnswer: string;
      }>;

      const wrongAnswer = answers.find((a) => a.problemId === problemId);
      if (wrongAnswer) {
        const [problem] = await this.db
          .select()
          .from(mathSchema.mathProblems)
          .where(eq(mathSchema.mathProblems.id, problemId))
          .limit(1);

        if (problem && wrongAnswer.selectedAnswer !== problem.correctAnswer) {
          return {
            problemId: problem.id,
            questionText: problem.questionText,
            options: problem.options,
            correctAnswer: problem.correctAnswer,
            selectedAnswer: wrongAnswer.selectedAnswer,
            explanation: problem.explanation,
            formula: problem.formula,
          };
        }
      }
    }

    return null;
  }

  async getWrongAnswersByResultId(
    userId: number,
    resultId: number,
  ): Promise<{
    testTitle: string;
    completedAt: Date;
    earnedScore: number;
    totalScore: number;
    wrongAnswers: Array<{
      problemId: number;
      questionText: string;
      options: unknown;
      correctAnswer: string;
      selectedAnswer: string;
      explanation: string | null;
      formula: string | null;
    }>;
  } | null> {
    const [result] = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.id, resultId))
      .limit(1);

    if (!result || result.userId !== userId) {
      return null;
    }

    const [testSet] = await this.db
      .select({ title: mathSchema.mathTestSets.title })
      .from(mathSchema.mathTestSets)
      .where(eq(mathSchema.mathTestSets.id, result.testSetId))
      .limit(1);

    const answers = result.answers as Array<{
      problemId: number;
      selectedAnswer: string;
    }>;

    const wrongAnswers: Array<{
      problemId: number;
      questionText: string;
      options: unknown;
      correctAnswer: string;
      selectedAnswer: string;
      explanation: string | null;
      formula: string | null;
    }> = [];

    for (const answer of answers) {
      const [problem] = await this.db
        .select()
        .from(mathSchema.mathProblems)
        .where(eq(mathSchema.mathProblems.id, answer.problemId))
        .limit(1);

      if (problem && answer.selectedAnswer !== problem.correctAnswer) {
        wrongAnswers.push({
          problemId: problem.id,
          questionText: problem.questionText,
          options: problem.options,
          correctAnswer: problem.correctAnswer,
          selectedAnswer: answer.selectedAnswer,
          explanation: problem.explanation,
          formula: problem.formula,
        });
      }
    }

    return {
      testTitle: testSet?.title || `시험 #${result.testSetId}`,
      completedAt: result.completedAt,
      earnedScore: result.earnedScore,
      totalScore: result.totalScore,
      wrongAnswers,
    };
  }

  async deleteResult(
    resultId: number,
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.db
      .delete(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.id, resultId))
      .returning();

    return {
      success: deleted.length > 0,
      message:
        deleted.length > 0
          ? '성적이 삭제되었습니다.'
          : '삭제할 성적을 찾을 수 없습니다.',
    };
  }

  async deleteAllUserResults(
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.db
      .delete(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.userId, userId))
      .returning();

    return {
      success: true,
      message: `${deleted.length}개의 성적이 삭제되었습니다.`,
    };
  }

  async getTestResultDetail(
    userId: number,
    resultId: number,
  ): Promise<{
    testTitle: string;
    completedAt: Date;
    earnedScore: number;
    totalScore: number;
    totalQuestions: number;
    correctCount: number;
    wrongCount: number;
    questions: Array<{
      problemId: number;
      questionText: string;
      options: unknown;
      correctAnswer: string;
      selectedAnswer: string;
      isCorrect: boolean;
      explanation: string | null;
      formula: string | null;
    }>;
  } | null> {
    const [result] = await this.db
      .select()
      .from(schema.sharedMathTestResults)
      .where(eq(schema.sharedMathTestResults.id, resultId))
      .limit(1);

    if (!result || result.userId !== userId) {
      return null;
    }

    const [testSet] = await this.db
      .select({ title: mathSchema.mathTestSets.title })
      .from(mathSchema.mathTestSets)
      .where(eq(mathSchema.mathTestSets.id, result.testSetId))
      .limit(1);

    const answers = result.answers as Array<{
      problemId: number;
      selectedAnswer: string;
    }>;

    const questions: Array<{
      problemId: number;
      questionText: string;
      options: unknown;
      correctAnswer: string;
      selectedAnswer: string;
      isCorrect: boolean;
      explanation: string | null;
      formula: string | null;
    }> = [];

    let correctCount = 0;

    for (const answer of answers) {
      const [problem] = await this.db
        .select()
        .from(mathSchema.mathProblems)
        .where(eq(mathSchema.mathProblems.id, answer.problemId))
        .limit(1);

      if (problem) {
        const isCorrect = answer.selectedAnswer === problem.correctAnswer;
        if (isCorrect) correctCount++;

        questions.push({
          problemId: problem.id,
          questionText: problem.questionText,
          options: problem.options,
          correctAnswer: problem.correctAnswer,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          explanation: problem.explanation,
          formula: problem.formula,
        });
      }
    }

    return {
      testTitle: testSet?.title || `시험 #${result.testSetId}`,
      completedAt: result.completedAt,
      earnedScore: result.earnedScore,
      totalScore: result.totalScore,
      totalQuestions: questions.length,
      correctCount,
      wrongCount: questions.length - correctCount,
      questions,
    };
  }
}
