import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

// Enums (재사용)
export const difficultyEnum = pgEnum('difficulty_math', [
  'LEVEL_1',
  'LEVEL_2',
  'LEVEL_3',
  'LEVEL_4',
  'LEVEL_5',
]);
export const questionTypeEnum = pgEnum('question_type_math', [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
]);
export const testTypeEnum = pgEnum('test_type_math', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'MIDTERM',
  'FINAL',
  'MOCK',
]);
export const schoolLevelEnum = pgEnum('school_level_math', ['MIDDLE', 'HIGH']);

// 1. Math Chapters (수학 단원) - 학년 정보는 gradeLevel로 직접 저장
export const mathChapters = pgTable('math_chapters', {
  id: serial('id').primaryKey(),
  gradeLevel: integer('grade_level').notNull(), // 1(중1), 2(중2), 3(중3)
  name: varchar('name', { length: 200 }).notNull(),
  parentId: integer('parent_id').references((): any => mathChapters.id), // 계층 구조 지원
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Math Problems (수학 문제) - questions 테이블과 동일한 구조
export const mathProblems = pgTable('math_problems', {
  id: serial('id').primaryKey(),

  // 문제 내용
  title: varchar('title', { length: 300 }), // 문제 제목 (선택)
  passage: text('passage'), // 독해 지문 (영어 독해에만 사용)
  scriptData: jsonb('script_data'), // 채팅 스크립트 JSON (대화형 문제용)
  questionText: text('question_text').notNull(), // 문제 본문

  // 선택지 (객관식)
  options: jsonb('options'), // ["A", "B", "C", "D"] 형태
  correctAnswer: varchar('correct_answer', { length: 500 }).notNull(), // 정답

  // 추가 정보
  explanation: text('explanation'), // 해설
  difficulty: difficultyEnum('difficulty'), // 난이도
  tags: text('tags'), // 태그 (콤마 구분)

  // 수학 문제용
  formula: text('formula'), // LaTeX 수식

  // 메타 정보
  isActive: boolean('is_active').default(true).notNull(),
  orderIndex: integer('order_index').notNull().default(0), // 시험지 내 정렬
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Math Test Sets (수학 시험지)
export const mathTestSets = pgTable('math_test_sets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  gradeLevel: integer('grade_level'), // 1(중1), 2(중2), 3(중3)
  testType: testTypeEnum('test_type'),
  totalQuestions: integer('total_questions').notNull().default(0),
  timeLimit: integer('time_limit'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Math Test Set Problems (수학 시험지-문제 연결)
export const mathTestSetProblems = pgTable('math_test_set_problems', {
  id: serial('id').primaryKey(),
  testSetId: integer('test_set_id')
    .references(() => mathTestSets.id, { onDelete: 'cascade' })
    .notNull(),
  problemId: integer('problem_id')
    .references(() => mathProblems.id, { onDelete: 'cascade' })
    .notNull(),
  orderIndex: integer('order_index').notNull(),
  score: integer('score').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Math Test Sessions (수학 시험 세션) - 사용자의 시험 응시 기록
export const mathTestSessions = pgTable('math_test_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  testSetId: integer('test_set_id')
    .references(() => mathTestSets.id)
    .notNull(),
  status: varchar('status', { length: 20 }).notNull().default('IN_PROGRESS'), // IN_PROGRESS, COMPLETED
  currentQuestionIndex: integer('current_question_index').default(0).notNull(),
  totalScore: integer('total_score').default(0).notNull(),
  correctAnswers: integer('correct_answers').default(0).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Math User Answers (수학 답안 기록)
export const mathUserAnswers = pgTable('math_user_answers', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id')
    .references(() => mathTestSessions.id)
    .notNull(),
  problemId: integer('problem_id')
    .references(() => mathProblems.id)
    .notNull(),
  userAnswer: varchar('user_answer', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  responseTimeSeconds: integer('response_time_seconds'),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
});
