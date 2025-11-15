-- Migration: Refactor chat scripts into questions table
-- 1. Add script_data column to questions table
-- 2. Drop chat_script_id foreign key
-- 3. Drop chat_scripts table

-- Step 1: Add script_data column to questions table
ALTER TABLE "questions" ADD COLUMN "script_data" jsonb;

-- Step 2: Drop foreign key constraint
ALTER TABLE "questions" DROP CONSTRAINT IF EXISTS "questions_chat_script_id_chat_scripts_id_fk";

-- Step 3: Drop chat_script_id column
ALTER TABLE "questions" DROP COLUMN IF EXISTS "chat_script_id";

-- Step 4: Drop chat_scripts table
DROP TABLE IF EXISTS "chat_scripts";
