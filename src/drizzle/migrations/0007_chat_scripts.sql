-- Create chat_scripts table
CREATE TABLE "chat_scripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"script_data" jsonb NOT NULL,
	"subject" "subject" NOT NULL,
	"creator_type" "creator_type" DEFAULT 'SYSTEM' NOT NULL,
	"creator_id" bigint,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Add chat_script_id to questions table
ALTER TABLE "questions" ADD COLUMN "chat_script_id" integer;
--> statement-breakpoint

-- Add foreign key constraint
ALTER TABLE "questions" ADD CONSTRAINT "questions_chat_script_id_chat_scripts_id_fk" FOREIGN KEY ("chat_script_id") REFERENCES "public"."chat_scripts"("id") ON DELETE set null ON UPDATE no action;
