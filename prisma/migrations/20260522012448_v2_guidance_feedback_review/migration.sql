-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PracticeType" ADD VALUE 'ACUPOINT';
ALTER TYPE "PracticeType" ADD VALUE 'WRITING';

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "bodyDirectionTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "guidanceId" TEXT,
ADD COLUMN     "guidanceReflection" TEXT;

-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "acupointName" TEXT,
ADD COLUMN     "observationPrompt" TEXT,
ADD COLUMN     "side" TEXT;

-- CreateTable
CREATE TABLE "Guidance" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guidance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyGuidanceAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guidanceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "assignedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyGuidanceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryFeedback" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "EntryFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "bodyReminder" TEXT,
    "holdingMoment" TEXT,
    "earlierAwareness" TEXT,
    "nextPractice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyGuidanceAssignment_userId_date_idx" ON "DailyGuidanceAssignment"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyGuidanceAssignment_userId_date_key" ON "DailyGuidanceAssignment"("userId", "date");

-- CreateIndex
CREATE INDEX "EntryFeedback_entryId_idx" ON "EntryFeedback"("entryId");

-- CreateIndex
CREATE INDEX "WeeklyReview_userId_weekStart_idx" ON "WeeklyReview"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReview_userId_weekStart_key" ON "WeeklyReview"("userId", "weekStart");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_guidanceId_fkey" FOREIGN KEY ("guidanceId") REFERENCES "Guidance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGuidanceAssignment" ADD CONSTRAINT "DailyGuidanceAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGuidanceAssignment" ADD CONSTRAINT "DailyGuidanceAssignment_guidanceId_fkey" FOREIGN KEY ("guidanceId") REFERENCES "Guidance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGuidanceAssignment" ADD CONSTRAINT "DailyGuidanceAssignment_assignedByAdminId_fkey" FOREIGN KEY ("assignedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryFeedback" ADD CONSTRAINT "EntryFeedback_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryFeedback" ADD CONSTRAINT "EntryFeedback_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReview" ADD CONSTRAINT "WeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
