CREATE TYPE "public"."creator_type" AS ENUM('SYSTEM', 'USER');--> statement-breakpoint
CREATE TYPE "public"."subject" AS ENUM('ENGLISH', 'MATH');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"name" varchar(200) NOT NULL,
	"subject" "subject" NOT NULL,
	"creator_type" "creator_type" DEFAULT 'SYSTEM' NOT NULL,
	"creator_id" bigint,
	"order_index" integer DEFAULT 0 NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"user_id" bigint NOT NULL,
	"user_answer" varchar(500) NOT NULL,
	"is_correct" boolean NOT NULL,
	"response_time_seconds" integer,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"creator_type" "creator_type" DEFAULT 'SYSTEM' NOT NULL,
	"creator_id" bigint,
	"title" varchar(300),
	"passage" text,
	"question_text" text NOT NULL,
	"options" jsonb,
	"correct_answer" varchar(500) NOT NULL,
	"explanation" text,
	"difficulty" "difficulty",
	"tags" text,
	"audio_text" text,
	"formula" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_test_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_set_id" integer NOT NULL,
	"user_id" integer,
	"guest_id" varchar(36),
	"user_name" varchar(100),
	"total_score" integer NOT NULL,
	"earned_score" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"time_spent_seconds" integer,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_hall_bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"test_set_id" integer NOT NULL,
	"subject" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;