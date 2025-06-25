/*
  Warnings:

  - You are about to drop the column `metadata` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `referralCode` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `referredBy` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `waitlist` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `waitlist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "waitlist_referralCode_key";

-- AlterTable
ALTER TABLE "waitlist" DROP COLUMN "metadata",
DROP COLUMN "name",
DROP COLUMN "position",
DROP COLUMN "referralCode",
DROP COLUMN "referredBy",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "WaitlistStatus";
