-- CreateTable
CREATE TABLE "round_stat" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL,
    "errors" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "round_stat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "round_stat_testId_idx" ON "round_stat"("testId");

-- AddForeignKey
ALTER TABLE "round_stat" ADD CONSTRAINT "round_stat_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
