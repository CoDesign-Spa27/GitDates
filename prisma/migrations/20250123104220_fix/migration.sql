/*
  Warnings:

  - You are about to drop the column `company` on the `github_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "github_profiles" DROP COLUMN "company",
ADD COLUMN     "image" TEXT;
