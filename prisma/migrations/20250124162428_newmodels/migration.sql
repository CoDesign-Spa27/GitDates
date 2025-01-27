/*
  Warnings:

  - You are about to drop the column `maxDistance` on the `match_preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_preferences" DROP COLUMN "maxDistance",
ADD COLUMN     "gender" TEXT;
