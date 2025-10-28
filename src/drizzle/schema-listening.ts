import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
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
