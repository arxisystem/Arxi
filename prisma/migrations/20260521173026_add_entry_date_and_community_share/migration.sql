-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "entryDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shareWithCommunity" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Entry_entryDate_idx" ON "Entry"("entryDate");

-- CreateIndex
CREATE INDEX "Entry_shareWithCommunity_entryDate_idx" ON "Entry"("shareWithCommunity", "entryDate");
