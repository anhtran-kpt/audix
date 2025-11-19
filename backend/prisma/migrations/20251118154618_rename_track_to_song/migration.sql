/*
  Warnings:

  - The values [TRACK] on the enum `PlaybackContextType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalTracks` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `play_history` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `playback_queue_items` table. All the data in the column will be lost.
  - You are about to drop the column `currentTrackId` on the `playback_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `playlist_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalTracks` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the `playback_snapshot_tracks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_credits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tracks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playlistId,songId]` on the table `playlist_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `songId` to the `play_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songId` to the `playback_queue_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSongId` to the `playback_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songId` to the `playlist_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlaybackContextType_new" AS ENUM ('PLAYLIST', 'ALBUM', 'ARTIST', 'SONG', 'HISTORY', 'SEARCH');
ALTER TABLE "playback_snapshots" ALTER COLUMN "contextType" TYPE "PlaybackContextType_new" USING ("contextType"::text::"PlaybackContextType_new");
ALTER TYPE "PlaybackContextType" RENAME TO "PlaybackContextType_old";
ALTER TYPE "PlaybackContextType_new" RENAME TO "PlaybackContextType";
DROP TYPE "public"."PlaybackContextType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "play_history" DROP CONSTRAINT "play_history_trackId_fkey";

-- DropForeignKey
ALTER TABLE "playback_queue_items" DROP CONSTRAINT "playback_queue_items_trackId_fkey";

-- DropForeignKey
ALTER TABLE "playback_sessions" DROP CONSTRAINT "playback_sessions_currentTrackId_fkey";

-- DropForeignKey
ALTER TABLE "playback_snapshot_tracks" DROP CONSTRAINT "playback_snapshot_tracks_snapshotId_fkey";

-- DropForeignKey
ALTER TABLE "playback_snapshot_tracks" DROP CONSTRAINT "playback_snapshot_tracks_trackId_fkey";

-- DropForeignKey
ALTER TABLE "playlist_items" DROP CONSTRAINT "playlist_items_trackId_fkey";

-- DropForeignKey
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_trackId_fkey";

-- DropForeignKey
ALTER TABLE "track_credits" DROP CONSTRAINT "track_credits_artistId_fkey";

-- DropForeignKey
ALTER TABLE "track_credits" DROP CONSTRAINT "track_credits_trackId_fkey";

-- DropForeignKey
ALTER TABLE "track_genres" DROP CONSTRAINT "track_genres_genreId_fkey";

-- DropForeignKey
ALTER TABLE "track_genres" DROP CONSTRAINT "track_genres_trackId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_albumId_fkey";

-- DropIndex
DROP INDEX "play_history_trackId_playedAt_idx";

-- DropIndex
DROP INDEX "playlist_items_playlistId_trackId_key";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "totalTracks",
ADD COLUMN     "totalSongs" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "play_history" DROP COLUMN "trackId",
ADD COLUMN     "songId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "playback_queue_items" DROP COLUMN "trackId",
ADD COLUMN     "songId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "playback_sessions" DROP COLUMN "currentTrackId",
ADD COLUMN     "currentSongId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "playlist_items" DROP COLUMN "trackId",
ADD COLUMN     "songId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "playlists" DROP COLUMN "totalTracks",
ADD COLUMN     "totalSongs" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "playback_snapshot_tracks";

-- DropTable
DROP TABLE "track_artists";

-- DropTable
DROP TABLE "track_credits";

-- DropTable
DROP TABLE "track_genres";

-- DropTable
DROP TABLE "tracks";

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "songNumber" INTEGER NOT NULL,
    "lyrics" TEXT,
    "isExplicit" BOOLEAN NOT NULL DEFAULT false,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_artists" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" "ArtistRole" NOT NULL DEFAULT 'MAIN_ARTIST',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "song_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_credits" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "artistId" TEXT,
    "name" TEXT NOT NULL,
    "role" "CreditRole" NOT NULL,
    "details" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "song_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_genres" (
    "songId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "song_genres_pkey" PRIMARY KEY ("songId","genreId")
);

-- CreateTable
CREATE TABLE "playback_snapshot_songs" (
    "snapshotId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "playback_snapshot_songs_pkey" PRIMARY KEY ("snapshotId","index")
);

-- CreateIndex
CREATE INDEX "song_artists_songId_order_idx" ON "song_artists"("songId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "song_artists_songId_artistId_role_key" ON "song_artists"("songId", "artistId", "role");

-- CreateIndex
CREATE INDEX "song_credits_songId_role_idx" ON "song_credits"("songId", "role");

-- CreateIndex
CREATE INDEX "song_credits_songId_order_idx" ON "song_credits"("songId", "order");

-- CreateIndex
CREATE INDEX "song_credits_songId_artistId_idx" ON "song_credits"("songId", "artistId");

-- CreateIndex
CREATE INDEX "playback_snapshot_songs_snapshotId_songId_idx" ON "playback_snapshot_songs"("snapshotId", "songId");

-- CreateIndex
CREATE INDEX "play_history_songId_playedAt_idx" ON "play_history"("songId", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_items_playlistId_songId_key" ON "playlist_items"("playlistId", "songId");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_artists" ADD CONSTRAINT "song_artists_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_artists" ADD CONSTRAINT "song_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_credits" ADD CONSTRAINT "song_credits_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_credits" ADD CONSTRAINT "song_credits_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_genres" ADD CONSTRAINT "song_genres_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_genres" ADD CONSTRAINT "song_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_sessions" ADD CONSTRAINT "playback_sessions_currentSongId_fkey" FOREIGN KEY ("currentSongId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_snapshot_songs" ADD CONSTRAINT "playback_snapshot_songs_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "playback_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_snapshot_songs" ADD CONSTRAINT "playback_snapshot_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_history" ADD CONSTRAINT "play_history_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_queue_items" ADD CONSTRAINT "playback_queue_items_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
