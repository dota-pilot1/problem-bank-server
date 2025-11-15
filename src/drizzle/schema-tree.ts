import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  bigint,
  jsonb,
} from 'drizzle-orm/pg-core';

// Enums
export const difficultyEnum = pgEnum('difficulty', ['EASY', 'MEDIUM', 'HARD']);
export const creatorTypeEnum = pgEnum('creator_type', ['SYSTEM', 'USER']);
export const subjectEnum = pgEnum('subject', ['ENGLISH', 'MATH']);

/**
 * Categories (카테고리 트리 구조)
 *
 * 트리 구조 예시:
 * 영어 (subject=ENGLISH, parent_id=NULL)
 *   └─ 중1 (parent_id=1)
 *        └─ 1단원 (parent_id=2)
 *             └─ 문제 모음 (parent_id=3)
 *
 * 나의 문제 (subject=ENGLISH, parent_id=NULL, creator_type=USER)
 *   ├─ 독해 (parent_id=5, creator_type=USER)
 *   │    ├─ 일상생활 (parent_id=6)
 *   │    └─ 학교생활 (parent_id=6)
 *   └─ 듣기 (parent_id=5, creator_type=USER)
 *        └─ 상황극 (parent_id=9)
 */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').references(() => categories.id, {
    onDelete: 'cascade',
  }), // NULL이면 루트 노드
  name: varchar('name', { length: 200 }).notNull(),
  subject: subjectEnum('subject').notNull(), // ENGLISH | MATH
  creatorType: creatorTypeEnum('creator_type').notNull().default('SYSTEM'), // SYSTEM | USER
  creatorId: bigint('creator_id', { mode: 'number' }), // USER일 경우 Spring Boot 유저 ID
  orderIndex: integer('order_index').notNull().default(0), // 같은 depth 내 정렬 순서
  description: text('description'), // 카테고리 설명
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Chat Scripts (채팅 스크립트)
 *
 * 독립적인 채팅 대화 데이터
 * 여러 문제에서 재사용 가능
 */
export const chatScripts = pgTable('chat_scripts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  scriptData: jsonb('script_data').notNull(), // 채팅 대화 JSON
  subject: subjectEnum('subject').notNull(), // ENGLISH | MATH
  creatorType: creatorTypeEnum('creator_type').notNull().default('SYSTEM'),
  creatorId: bigint('creator_id', { mode: 'number' }),
  displayOrder: integer('display_order').default(0).notNull(), // 정렬 순서
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Questions (문제)
 *
 * 모든 문제는 하나의 카테고리에 소속됨
 * 영어, 수학 구분 없이 단일 테이블 사용
 */
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(),
  chatScriptId: integer('chat_script_id').references(() => chatScripts.id, {
    onDelete: 'set null',
  }), // 채팅 스크립트 참조 (선택)
  creatorType: creatorTypeEnum('creator_type').notNull().default('SYSTEM'),
  creatorId: bigint('creator_id', { mode: 'number' }), // USER일 경우 Spring Boot 유저 ID

  // 문제 내용
  title: varchar('title', { length: 300 }), // 문제 제목 (선택)
  passage: text('passage'), // 독해 지문 (영어 독해에만 사용)
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
  orderIndex: integer('order_index').notNull().default(0), // 카테고리 내 정렬
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Question Attempts (문제 풀이 기록)
 *
 * 사용자가 문제를 풀 때마다 기록
 */
export const questionAttempts = pgTable('question_attempts', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id')
    .references(() => questions.id, { onDelete: 'cascade' })
    .notNull(),
  userId: bigint('user_id', { mode: 'number' }).notNull(), // Spring Boot 유저 ID
  userAnswer: varchar('user_answer', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  responseTimeSeconds: integer('response_time_seconds'),
  attemptedAt: timestamp('attempted_at').defaultNow().notNull(),
});

/**
 * Shared Test Results (공유 시험 결과)
 *
 * 카테고리 단위로 시험 결과 공유
 */
export const sharedTestResults = pgTable('shared_test_results', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(), // 시험지 역할을 하는 카테고리
  userId: bigint('user_id', { mode: 'number' }), // nullable (로그인 사용자)
  guestId: varchar('guest_id', { length: 36 }), // nullable (비로그인 UUID)
  userName: varchar('user_name', { length: 100 }),
  totalScore: integer('total_score').notNull(),
  earnedScore: integer('earned_score').notNull(),
  answers: jsonb('answers').notNull(), // 답안 배열 JSON
  timeSpentSeconds: integer('time_spent_seconds'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});
