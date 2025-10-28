import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

// Enum for script style types
export const scriptStyleEnum = pgEnum('script_style_type', [
  'TOEIC',
  'KOREAN_SAT',
  'TEXTBOOK',
  'AMERICAN_SCHOOL',
  'INTERVIEW',
  'NEWS',
]);

// Enum for listening types
export const listeningTypeEnum = pgEnum('listening_type', ['text', 'script']);

// 1. Listening Script Categories (카테고리)
export const listeningScriptCategories = pgTable(
  'listening_script_categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    emoji: varchar('emoji', { length: 10 }),
    displayOrder: integer('display_order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
);

// 2. Listening Script Examples (예제)
export const listeningScriptExamples = pgTable('listening_script_examples', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => listeningScriptCategories.id)
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  styleType: scriptStyleEnum('style_type').notNull(),
  displayOrder: integer('display_order'),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Listening Script Example Messages (대화 메시지)
export const listeningScriptExampleMessages = pgTable(
  'listening_script_example_messages',
  {
    id: serial('id').primaryKey(),
    exampleId: integer('example_id')
      .references(() => listeningScriptExamples.id)
      .notNull(),
    role: varchar('role', { length: 20 }).notNull(), // "USER" or "CHATBOT"
    message: text('message').notNull(),
    displayOrder: integer('display_order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
);

// 4. Listening Questions (듣기 문제)
export const listeningQuestions = pgTable('listening_questions', {
  id: serial('id').primaryKey(),
  subject: varchar('subject', { length: 50 }).notNull(), // "영어", "수학", "과학" 등
  questionText: text('question_text').notNull(), // 문제 텍스트
  listeningType: listeningTypeEnum('listening_type').notNull(), // "text" or "script"
  listeningText: text('listening_text'), // 일반 TTS용 텍스트
  script: jsonb('script').$type<{
    // 대화형 스크립트 (JSONB)
    title: string;
    messages: Array<{
      role: 'USER' | 'CHATBOT';
      message: string;
    }>;
  }>(),
  choices: jsonb('choices').$type<string[]>().notNull(), // 선택지 ["A", "B", "C", "D"]
  correctAnswer: varchar('correct_answer', { length: 1 }).notNull(), // 정답
  difficulty: integer('difficulty').notNull(), // 난이도 1-5
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
