CREATE TYPE "public"."listening_type" AS ENUM('text', 'script');--> statement-breakpoint
CREATE TYPE "public"."script_style_type" AS ENUM('TOEIC', 'KOREAN_SAT', 'TEXTBOOK', 'AMERICAN_SCHOOL', 'INTERVIEW', 'NEWS');--> statement-breakpoint
CREATE TABLE "listening_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" varchar(50) NOT NULL,
	"question_text" text NOT NULL,
	"listening_type" "listening_type" NOT NULL,
	"listening_text" text,
	"script" jsonb,
	"choices" jsonb NOT NULL,
	"correct_answer" varchar(1) NOT NULL,
	"difficulty" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_script_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"emoji" varchar(10),
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_script_example_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"example_id" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_script_examples" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"style_type" "script_style_type" NOT NULL,
	"display_order" integer,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "english_test_set_problems" DROP CONSTRAINT "english_test_set_problems_test_set_id_english_test_sets_id_fk";
--> statement-breakpoint
ALTER TABLE "english_test_set_problems" DROP CONSTRAINT "english_test_set_problems_problem_id_english_problems_id_fk";
--> statement-breakpoint
ALTER TABLE "listening_script_example_messages" ADD CONSTRAINT "listening_script_example_messages_example_id_listening_script_examples_id_fk" FOREIGN KEY ("example_id") REFERENCES "public"."listening_script_examples"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_script_examples" ADD CONSTRAINT "listening_script_examples_category_id_listening_script_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."listening_script_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_test_set_problems" ADD CONSTRAINT "english_test_set_problems_test_set_id_english_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."english_test_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_test_set_problems" ADD CONSTRAINT "english_test_set_problems_problem_id_english_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."english_problems"("id") ON DELETE cascade ON UPDATE no action;