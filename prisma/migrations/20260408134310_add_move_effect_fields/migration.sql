-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "effectChance" INTEGER,
ADD COLUMN     "effectCode" TEXT,
ADD COLUMN     "effectData" JSONB,
ADD COLUMN     "effectTarget" TEXT;
