-- AlterTable
ALTER TABLE "public"."play_history" ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT;

-- CreateIndex
CREATE INDEX "play_history_userId_sourceType_sourceId_playedAt_idx" ON "public"."play_history"("userId", "sourceType", "sourceId", "playedAt");
