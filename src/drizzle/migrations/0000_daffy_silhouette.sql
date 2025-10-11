CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');--> statement-breakpoint
CREATE TYPE "public"."test_type" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'MIDTERM', 'FINAL', 'MOCK');--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"chapter_id" integer,
	"question_type" "question_type" NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"question_text" text NOT NULL,
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
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "test_set_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_set_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"subject_id" integer,
	"test_type" "test_type",
	"total_questions" integer DEFAULT 0 NOT NULL,
	"time_limit" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_set_id" integer,
	"problem_id" integer NOT NULL,
	"user_answer" varchar(500) NOT NULL,
	"is_correct" boolean NOT NULL,
	"response_time_seconds" integer,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_problems" ADD CONSTRAINT "test_set_problems_test_set_id_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_problems" ADD CONSTRAINT "test_set_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_sets" ADD CONSTRAINT "test_sets_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_attempts" ADD CONSTRAINT "user_attempts_test_set_id_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_attempts" ADD CONSTRAINT "user_attempts_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;