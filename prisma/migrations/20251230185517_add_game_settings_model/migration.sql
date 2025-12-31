/*
  Warnings:

  - The `mode` column on the `game_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "game_settings" DROP COLUMN "mode",
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'words';

-- DropEnum
DROP TYPE "GameMode";
