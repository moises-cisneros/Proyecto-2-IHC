/*
  Warnings:

  - You are about to drop the column `code` on the `Plan` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Plan_userId_code_key";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "code";
