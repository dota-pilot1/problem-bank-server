CREATE TYPE "public"."difficulty_math" AS ENUM('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5');--> statement-breakpoint
CREATE TYPE "public"."question_type_math" AS ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');--> statement-breakpoint
CREATE TYPE "public"."school_level_math" AS ENUM('MIDDLE', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."test_type_math" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'MIDTERM', 'FINAL', 'MOCK');--> statement-breakpoint
CREATE TYPE "public"."difficulty_english" AS ENUM('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5');--> statement-breakpoint
CREATE TYPE "public"."question_type_english" AS ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');--> statement-breakpoint
CREATE TYPE "public"."school_level_english" AS ENUM('MIDDLE', 'HIGH');--> statement-breakpoint
CREATE TYPE "public"."test_type_english" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'MIDTERM', 'FINAL', 'MOCK');--> statement-breakpoint
CREATE TABLE "math_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"grade_level" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "math_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"question_type" "question_type_math" NOT NULL,
	"difficulty" "difficulty_math" NOT NULL,
	"question_text" text NOT NULL,
	"listening_text" text,
	"option1" varchar(500),
	"option2" varchar(500),
	"option3" varchar(500),
	"option4" varchar(500),
	"correct_answer" varchar(500) NOT NULL,
	"explanation" text,
	"tags" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "math_test_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_set_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'IN_PROGRESS' NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "math_test_set_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_set_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"order_index" integer NOT NULL,
	"score" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "math_test_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"grade_level" integer,
	"test_type" "test_type_math",
	"total_questions" integer DEFAULT 0 NOT NULL,
	"time_limit" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "math_user_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"user_answer" varchar(500) NOT NULL,
	"is_correct" boolean NOT NULL,
	"response_time_seconds" integer,
	"answered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"grade_level" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"question_type" "question_type_english" NOT NULL,
	"difficulty" "difficulty_english" NOT NULL,
	"question_text" text NOT NULL,
	"listening_text" text,
	"option1" varchar(500),
	"option2" varchar(500),
	"option3" varchar(500),
	"option4" varchar(500),
	"correct_answer" varchar(500) NOT NULL,
	"explanation" text,
	"tags" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_test_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_set_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'IN_PROGRESS' NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_test_set_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_set_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"order_index" integer NOT NULL,
	"score" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_test_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"grade_level" integer,
	"test_type" "test_type_english",
	"total_questions" integer DEFAULT 0 NOT NULL,
	"time_limit" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "english_user_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"user_answer" varchar(500) NOT NULL,
	"is_correct" boolean NOT NULL,
	"response_time_seconds" integer,
	"answered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "math_problems" ADD CONSTRAINT "math_problems_chapter_id_math_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."math_chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "math_test_sessions" ADD CONSTRAINT "math_test_sessions_test_set_id_math_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."math_test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "math_test_set_problems" ADD CONSTRAINT "math_test_set_problems_test_set_id_math_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."math_test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "math_test_set_problems" ADD CONSTRAINT "math_test_set_problems_problem_id_math_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."math_problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "math_user_answers" ADD CONSTRAINT "math_user_answers_session_id_math_test_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."math_test_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "math_user_answers" ADD CONSTRAINT "math_user_answers_problem_id_math_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."math_problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_problems" ADD CONSTRAINT "english_problems_chapter_id_english_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."english_chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_test_sessions" ADD CONSTRAINT "english_test_sessions_test_set_id_english_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."english_test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_test_set_problems" ADD CONSTRAINT "english_test_set_problems_test_set_id_english_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."english_test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_test_set_problems" ADD CONSTRAINT "english_test_set_problems_problem_id_english_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."english_problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_user_answers" ADD CONSTRAINT "english_user_answers_session_id_english_test_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."english_test_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_user_answers" ADD CONSTRAINT "english_user_answers_problem_id_english_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."english_problems"("id") ON DELETE no action ON UPDATE no action;