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

// Enums
export const difficultyEnum = pgEnum('difficulty', [
  'LEVEL_1',
  'LEVEL_2',
  'LEVEL_3',
  'LEVEL_4',
  'LEVEL_5',
]);
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
export const schoolLevelEnum = pgEnum('school_level', ['MIDDLE', 'HIGH']);

// 1. Subjects (과목)
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Grades (학년)
export const grades = pgTable('grades', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  displayOrder: integer('display_order').notNull(),
  schoolLevel: schoolLevelEnum('school_level').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Chapters (단원)
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  gradeId: integer('grade_id')
    .references(() => grades.id)
    .notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Problems (문제) - Questions 테이블
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id')
    .references(() => subjects.id)
    .notNull(),
  chapterId: integer('chapter_id').references(() => chapters.id),

  // 문제 내용
  title: varchar('title', { length: 300 }), // 문제 제목 (선택)
  passage: text('passage'), // 독해 지문
  scriptData: jsonb('script_data'), // 채팅 스크립트 JSON
  questionText: text('question_text').notNull(), // 문제 본문

  // 선택지 (객관식)
  options: jsonb('options'), // ["A", "B", "C", "D"] 형태
  correctAnswer: varchar('correct_answer', { length: 500 }).notNull(), // 정답

  // 추가 정보
  explanation: text('explanation'), // 해설
  difficulty: difficultyEnum('difficulty').notNull(), // 난이도
  tags: text('tags'), // 태그

  // 수학 문제용
  formula: text('formula'), // LaTeX 수식

  // 메타 정보
  isActive: boolean('is_active').default(true).notNull(),
  orderIndex: integer('order_index').notNull().default(0), // 정렬 순서
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Test Sets (시험지)
export const testSets = pgTable('test_sets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  subjectId: integer('subject_id').references(() => subjects.id),
  gradeId: integer('grade_id').references(() => grades.id),
  testType: testTypeEnum('test_type'),
  totalQuestions: integer('total_questions').notNull().default(0),
  timeLimit: integer('time_limit'),
  isActive: boolean('is_active').default(true).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
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
  score: integer('score').default(1).notNull(),
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

// 7. Shared Test Results (공유 시험 결과)
// 주의: testSetId는 foreign key 없음 (math/english 시험지 모두 지원)
export const sharedTestResults = pgTable('shared_test_results', {
  id: serial('id').primaryKey(),
  testSetId: integer('test_set_id').notNull(), // foreign key 제거 (영어/수학 시험지 모두 지원)
  userId: integer('user_id'), // nullable (로그인 사용자)
  guestId: varchar('guest_id', { length: 36 }), // nullable (비로그인 사용자 UUID)
  userName: varchar('user_name', { length: 100 }), // 사용자 이름 (로그인: username, 비로그인: "익명사용자")
  totalScore: integer('total_score').notNull(),
  earnedScore: integer('earned_score').notNull(),
  answers: jsonb('answers').notNull(), // 답안 배열 JSON
  timeSpentSeconds: integer('time_spent_seconds'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

// 8. Exam Hall Bookmarks (시험장 북마크)
export const examHallBookmarks = pgTable(
  'exam_hall_bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(), // Spring Boot 사용자 ID
    testSetId: integer('test_set_id').notNull(),
    subject: varchar('subject', { length: 20 }).notNull(), // 'ENGLISH' or 'MATH'
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // unique constraint: 한 사용자가 동일 시험을 중복 북마크할 수 없음
    uniqueUserTestSubject: {
      columns: [table.userId, table.testSetId, table.subject],
      name: 'unique_user_test_subject',
    },
  }),
);
