import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../drizzle/drizzle.module';
import * as schema from '../drizzle/schema-math';

@Injectable()
export class MathTestSessionsService {
  constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // 시험 시작 - 새로운 세션 생성
  async startTest(userId: number, testSetId: number) {
    // 시험지 존재 여부 확인
    const testSet = await this.db
      .select()
      .from(schema.mathTestSets)
      .where(eq(schema.mathTestSets.id, testSetId))
      .limit(1);

    if (testSet.length === 0) {
      throw new NotFoundException(`Test set with ID ${testSetId} not found`);
    }

    // 새 세션 생성
    const [session] = await this.db
      .insert(schema.mathTestSessions)
      .values({
        userId,
        testSetId,
        status: 'IN_PROGRESS',
        currentQuestionIndex: 0,
        totalScore: 0,
        correctAnswers: 0,
      })
      .returning();

    // 시험지의 문제 목록 가져오기
    const problems = await this.db
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
      .where(eq(schema.mathTestSetProblems.testSetId, testSetId))
      .orderBy(schema.mathTestSetProblems.orderIndex);

    return {
      session,
      testSet: testSet[0],
      problems: problems.map((p) => ({
        ...p.problem,
        orderIndex: p.orderIndex,
        score: p.score,
      })),
    };
  }

  // 현재 세션 조회
  async getSession(sessionId: number) {
    const [session] = await this.db
      .select()
      .from(schema.mathTestSessions)
      .where(eq(schema.mathTestSessions.id, sessionId))
      .limit(1);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    return session;
  }

  // 현재 문제 조회
  async getCurrentQuestion(sessionId: number) {
    const session = await this.getSession(sessionId);

    // 시험지의 문제 목록 가져오기
    const problems = await this.db
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
      .where(eq(schema.mathTestSetProblems.testSetId, session.testSetId))
      .orderBy(schema.mathTestSetProblems.orderIndex);

    if (problems.length === 0) {
      throw new NotFoundException('No problems found for this test set');
    }

    const currentProblem = problems[session.currentQuestionIndex];
    if (!currentProblem) {
      return {
        session,
        currentQuestion: null,
        isCompleted: true,
      };
    }

    // 이미 답한 문제인지 확인
    const existingAnswer = await this.db
      .select()
      .from(schema.mathUserAnswers)
      .where(
        and(
          eq(schema.mathUserAnswers.sessionId, sessionId),
          eq(schema.mathUserAnswers.problemId, currentProblem.problem.id),
        ),
      )
      .limit(1);

    return {
      session,
      currentQuestion: {
        ...currentProblem.problem,
        orderIndex: currentProblem.orderIndex,
        score: currentProblem.score,
        questionNumber: session.currentQuestionIndex + 1,
        totalQuestions: problems.length,
        userAnswer: existingAnswer[0]?.userAnswer || null,
      },
      isCompleted: false,
    };
  }

  // 답안 제출
  async submitAnswer(
    sessionId: number,
    problemId: number,
    userAnswer: string,
    responseTimeSeconds?: number,
  ) {
    const session = await this.getSession(sessionId);

    if (session.status === 'COMPLETED') {
      throw new Error('This session is already completed');
    }

    // 문제 정보 가져오기
    const [problem] = await this.db
      .select()
      .from(schema.mathProblems)
      .where(eq(schema.mathProblems.id, problemId))
      .limit(1);

    if (!problem) {
      throw new NotFoundException(`Problem with ID ${problemId} not found`);
    }

    // 정답 확인
    const isCorrect = userAnswer.trim() === problem.correctAnswer.trim();

    // 기존 답안이 있는지 확인
    const existingAnswer = await this.db
      .select()
      .from(schema.mathUserAnswers)
      .where(
        and(
          eq(schema.mathUserAnswers.sessionId, sessionId),
          eq(schema.mathUserAnswers.problemId, problemId),
        ),
      )
      .limit(1);

    if (existingAnswer.length > 0) {
      // 답안 업데이트
      await this.db
        .update(schema.mathUserAnswers)
        .set({
          userAnswer,
          isCorrect,
          responseTimeSeconds,
          answeredAt: new Date(),
        })
        .where(eq(schema.mathUserAnswers.id, existingAnswer[0].id));
    } else {
      // 새 답안 저장
      await this.db.insert(schema.mathUserAnswers).values({
        sessionId,
        problemId,
        userAnswer,
        isCorrect,
        responseTimeSeconds,
      });
    }

    // 세션 업데이트 (다음 문제로 이동)
    const nextQuestionIndex = session.currentQuestionIndex + 1;

    // 전체 문제 수 확인
    const totalProblems = await this.db
      .select()
      .from(schema.mathTestSetProblems)
      .where(eq(schema.mathTestSetProblems.testSetId, session.testSetId));

    const isLastQuestion = nextQuestionIndex >= totalProblems.length;

    // 점수 계산
    const allAnswers = await this.db
      .select()
      .from(schema.mathUserAnswers)
      .where(eq(schema.mathUserAnswers.sessionId, sessionId));

    const correctAnswers = allAnswers.filter((a) => a.isCorrect).length;
    const totalScore = Math.round((correctAnswers / totalProblems.length) * 100);

    await this.db
      .update(schema.mathTestSessions)
      .set({
        currentQuestionIndex: nextQuestionIndex,
        correctAnswers,
        totalScore,
        status: isLastQuestion ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isLastQuestion ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(schema.mathTestSessions.id, sessionId));

    return {
      isCorrect,
      correctAnswer: problem.correctAnswer,
      explanation: problem.explanation,
      isLastQuestion,
      nextQuestionIndex,
    };
  }

  // 시험 결과 조회
  async getResult(sessionId: number) {
    const session = await this.getSession(sessionId);

    // 시험지 정보
    const [testSet] = await this.db
      .select()
      .from(schema.mathTestSets)
      .where(eq(schema.mathTestSets.id, session.testSetId))
      .limit(1);

    // 모든 답안
    const answers = await this.db
      .select({
        answer: schema.mathUserAnswers,
        problem: schema.mathProblems,
      })
      .from(schema.mathUserAnswers)
      .innerJoin(
        schema.mathProblems,
        eq(schema.mathUserAnswers.problemId, schema.mathProblems.id),
      )
      .where(eq(schema.mathUserAnswers.sessionId, sessionId));

    return {
      session,
      testSet,
      answers: answers.map((a) => ({
        problem: a.problem,
        userAnswer: a.answer.userAnswer,
        isCorrect: a.answer.isCorrect,
        responseTimeSeconds: a.answer.responseTimeSeconds,
      })),
    };
  }

  // 사용자의 이전 시험 기록 조회
  async getUserTestHistory(userId: number, testSetId?: number) {
    let query = this.db
      .select()
      .from(schema.mathTestSessions)
      .where(eq(schema.mathTestSessions.userId, userId))
      .orderBy(desc(schema.mathTestSessions.createdAt));

    if (testSetId) {
      query = this.db
        .select()
        .from(schema.mathTestSessions)
        .where(
          and(
            eq(schema.mathTestSessions.userId, userId),
            eq(schema.mathTestSessions.testSetId, testSetId),
          ),
        )
        .orderBy(desc(schema.mathTestSessions.createdAt));
    }

    return await query;
  }
}
