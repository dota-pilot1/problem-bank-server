import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums (영어 전용)
export const difficultyEnum = pgEnum('difficulty_english', [
  'LEVEL_1',
  'LEVEL_2',
  'LEVEL_3',
  'LEVEL_4',
  'LEVEL_5',
]);
export const questionTypeEnum = pgEnum('question_type_english', [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
]);
export const testTypeEnum = pgEnum('test_type_english', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'MIDTERM',
  'FINAL',
  'MOCK',
]);
export const schoolLevelEnum = pgEnum('school_level_english', [
  'MIDDLE',
  'HIGH',
]);

// 1. English Chapters (영어 단원) - 학년 정보는 gradeLevel로 직접 저장
export const englishChapters = pgTable('english_chapters', {
  id: serial('id').primaryKey(),
  gradeLevel: integer('grade_level').notNull(), // 1(중1), 2(중2), 3(중3)
  name: varchar('name', { length: 200 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. English Problems (영어 문제)
export const englishProblems = pgTable('english_problems', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id')
    .references(() => englishChapters.id)
    .notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  questionText: text('question_text').notNull(),
  listeningText: text('listening_text'), // 듣기 문제용 TTS 텍스트 (선택)
  questionImageUrl: varchar('question_image_url', { length: 500 }), // 문제 이미지 URL (S3)
  option1: varchar('option1', { length: 500 }),
  option2: varchar('option2', { length: 500 }),
  option3: varchar('option3', { length: 500 }),
  option4: varchar('option4', { length: 500 }),
  correctAnswer: varchar('correct_answer', { length: 500 }).notNull(),
  explanation: text('explanation'),
  tags: text('tags'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. English Test Sets (영어 시험지)
export const englishTestSets = pgTable('english_test_sets', {
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

// 4. English Test Set Problems (영어 시험지-문제 연결)
export const englishTestSetProblems = pgTable('english_test_set_problems', {
  id: serial('id').primaryKey(),
  testSetId: integer('test_set_id')
    .references(() => englishTestSets.id)
    .notNull(),
  problemId: integer('problem_id')
    .references(() => englishProblems.id)
    .notNull(),
  orderIndex: integer('order_index').notNull(),
  score: integer('score').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. English Test Sessions (영어 시험 세션) - 사용자의 시험 응시 기록
export const englishTestSessions = pgTable('english_test_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  testSetId: integer('test_set_id')
    .references(() => englishTestSets.id)
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

// 6. English User Answers (영어 답안 기록)
export const englishUserAnswers = pgTable('english_user_answers', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id')
    .references(() => englishTestSessions.id)
    .notNull(),
  problemId: integer('problem_id')
    .references(() => englishProblems.id)
    .notNull(),
  userAnswer: varchar('user_answer', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  responseTimeSeconds: integer('response_time_seconds'),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
});
