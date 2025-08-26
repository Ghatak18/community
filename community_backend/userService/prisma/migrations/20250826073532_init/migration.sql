-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "gasAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "waterAmount" INTEGER NOT NULL DEFAULT 0;
