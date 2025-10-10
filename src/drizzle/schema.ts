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

// Subjects Table (과목: 수학 개념, 수학 기본, 영어 듣기 등)
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Problems Table
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
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

// User Attempts Table (풀이 응답 + 채점 데이터)
export const userAttempts = pgTable('user_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  problemId: integer('problem_id')
    .references(() => problems.id)
    .notNull(),
  userAnswer: varchar('user_answer', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  responseTimeSeconds: integer('response_time_seconds'),
  attemptedAt: timestamp('attempted_at').defaultNow().notNull(),
});
