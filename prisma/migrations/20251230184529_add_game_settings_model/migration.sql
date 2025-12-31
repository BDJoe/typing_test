-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('TIME', 'WORDS');

-- CreateTable
CREATE TABLE "game_settings" (
    "id" SERIAL NOT NULL,
    "mode" "GameMode" NOT NULL DEFAULT 'TIME',
    "capitalsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "punctuationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "roundTime" INTEGER NOT NULL DEFAULT 60,
    "quoteLength" TEXT NOT NULL DEFAULT 'medium',
    "userId" TEXT NOT NULL,

    CONSTRAINT "game_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_settings_userId_key" ON "game_settings"("userId");

-- CreateIndex
CREATE INDEX "game_settings_userId_idx" ON "game_settings"("userId");

-- AddForeignKey
ALTER TABLE "game_settings" ADD CONSTRAINT "game_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
