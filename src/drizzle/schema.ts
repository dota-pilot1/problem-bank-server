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

// Enums
export const difficultyEnum = pgEnum('difficulty', ['EASY', 'MEDIUM', 'HARD']);
export const questionTypeEnum = pgEnum('question_type', [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
]);
export const testTypeEnum = pgEnum('test_type', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'MIDTERM',
  'FINAL',
  'MOCK',
]);

// 1. Subjects (과목)
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Chapters (단원)
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Problems (문제)
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  chapterId: integer('chapter_id').references(() => chapters.id),
  questionType: questionTypeEnum('question_type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  questionText: text('question_text').notNull(),
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

// 4. Test Sets (시험지)
export const testSets = pgTable('test_sets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  subjectId: integer('subject_id').references(() => subjects.id),
  testType: testTypeEnum('test_type'),
  totalQuestions: integer('total_questions').notNull().default(0),
  timeLimit: integer('time_limit'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Test Set Problems (N:M 연결)
export const testSetProblems = pgTable('test_set_problems', {
  id: serial('id').primaryKey(),
  testSetId: integer('test_set_id')
    .references(() => testSets.id)
    .notNull(),
  problemId: integer('problem_id')
    .references(() => problems.id)
    .notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. User Attempts (풀이 응답 + 채점 데이터)
export const userAttempts = pgTable('user_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  testSetId: integer('test_set_id').references(() => testSets.id),
  problemId: integer('problem_id')
    .references(() => problems.id)
    .notNull(),
  userAnswer: varchar('user_answer', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  responseTimeSeconds: integer('response_time_seconds'),
  attemptedAt: timestamp('attempted_at').defaultNow().notNull(),
});
