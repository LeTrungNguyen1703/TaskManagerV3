/*
  Warnings:

  - Made the column `task_id` on table `task_assignments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `task_assignments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."task_assignments" ALTER COLUMN "task_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;
