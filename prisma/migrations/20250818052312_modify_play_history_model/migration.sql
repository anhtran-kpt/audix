/*
  Warnings:

  - Added the required column `sourceType` to the `play_history` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SourceType" AS ENUM ('PLAYLIST', 'ALBUM', 'ARTIST', 'LIKED', 'QUEUE');

-- AlterTable
ALTER TABLE "public"."play_history" DROP COLUMN "sourceType",
ADD COLUMN     "sourceType" "public"."SourceType" NOT NULL;

-- CreateIndex
CREATE INDEX "play_history_userId_sourceType_sourceId_playedAt_idx" ON "public"."play_history"("userId", "sourceType", "sourceId", "playedAt");
