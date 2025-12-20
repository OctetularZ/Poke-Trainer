/*
  Warnings:

  - The `gender` column on the `Pokemon` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Pokemon" DROP COLUMN "gender",
ADD COLUMN     "gender" JSONB;
