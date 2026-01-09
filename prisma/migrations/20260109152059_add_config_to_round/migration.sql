/*
  Warnings:

  - You are about to drop the column `statErrors` on the `test_result` table. All the data in the column will be lost.
  - You are about to drop the column `statTimes` on the `test_result` table. All the data in the column will be lost.
  - You are about to drop the column `statWPM` on the `test_result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "test_result" DROP COLUMN "statErrors",
DROP COLUMN "statTimes",
DROP COLUMN "statWPM",
ADD COLUMN     "errorsPerSecond" INTEGER[],
ADD COLUMN     "gameConfig" JSONB,
ADD COLUMN     "roundTimePerSecond" INTEGER[],
ADD COLUMN     "wpmPerSecond" INTEGER[];
