-- CreateTable
CREATE TABLE "test_result" (
    "id" SERIAL NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "totalChars" INTEGER NOT NULL,
    "timeElapsed" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "test_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_result_userId_idx" ON "test_result"("userId");

-- AddForeignKey
ALTER TABLE "test_result" ADD CONSTRAINT "test_result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
