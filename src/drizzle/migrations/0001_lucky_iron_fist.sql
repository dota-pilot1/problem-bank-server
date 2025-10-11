CREATE TYPE "public"."school_level" AS ENUM('MIDDLE', 'HIGH');--> statement-breakpoint
CREATE TABLE "grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"display_order" integer NOT NULL,
	"school_level" "school_level" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "grade_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "test_set_problems" ADD COLUMN "score" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "test_sets" ADD COLUMN "grade_id" integer;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_sets" ADD CONSTRAINT "test_sets_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;