-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultShareWithAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "defaultShareWithCommunity" BOOLEAN NOT NULL DEFAULT false;
