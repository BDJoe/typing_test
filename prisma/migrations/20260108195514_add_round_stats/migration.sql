/*
  Warnings:

  - You are about to drop the `round_stat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "round_stat" DROP CONSTRAINT "round_stat_testId_fkey";

-- AlterTable
ALTER TABLE "test_result" ADD COLUMN     "statErrors" INTEGER[],
ADD COLUMN     "statTimes" INTEGER[],
ADD COLUMN     "statWPM" INTEGER[];

-- DropTable
DROP TABLE "round_stat";
