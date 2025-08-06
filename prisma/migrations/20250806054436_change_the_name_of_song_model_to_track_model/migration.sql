/*
  Warnings:

  - You are about to drop the column `songId` on the `play_history` table. All the data in the column will be lost.
  - You are about to drop the column `songId` on the `playlist_items` table. All the data in the column will be lost.
  - You are about to drop the column `songId` on the `user_queue` table. All the data in the column will be lost.
  - You are about to drop the `song_artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `song_credits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `song_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `songs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_liked_songs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playlistId,trackId]` on the table `playlist_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackId` to the `play_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `playlist_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `user_queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."play_history" DROP CONSTRAINT "play_history_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."playlist_items" DROP CONSTRAINT "playlist_items_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_artists" DROP CONSTRAINT "song_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_artists" DROP CONSTRAINT "song_artists_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_credits" DROP CONSTRAINT "song_credits_artistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_credits" DROP CONSTRAINT "song_credits_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_genres" DROP CONSTRAINT "song_genres_genreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."song_genres" DROP CONSTRAINT "song_genres_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."songs" DROP CONSTRAINT "songs_albumId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_liked_songs" DROP CONSTRAINT "user_liked_songs_songId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_liked_songs" DROP CONSTRAINT "user_liked_songs_userId_fkey";

-- DropIndex
DROP INDEX "public"."play_history_songId_playedAt_idx";

-- DropIndex
DROP INDEX "public"."playlist_items_playlistId_songId_key";

-- AlterTable
ALTER TABLE "public"."play_history" DROP COLUMN "songId",
ADD COLUMN     "trackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."playlist_items" DROP COLUMN "songId",
ADD COLUMN     "trackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_queue" DROP COLUMN "songId",
ADD COLUMN     "trackId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."song_artists";

-- DropTable
DROP TABLE "public"."song_credits";

-- DropTable
DROP TABLE "public"."song_genres";

-- DropTable
DROP TABLE "public"."songs";

-- DropTable
DROP TABLE "public"."user_liked_songs";

-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audioId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "lyrics" TEXT,
    "isExplicit" BOOLEAN NOT NULL DEFAULT false,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."track_artists" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" "public"."ArtistRole" NOT NULL DEFAULT 'MAIN_ARTIST',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."track_credits" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT,
    "name" TEXT NOT NULL,
    "role" "public"."CreditRole" NOT NULL,
    "details" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "track_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."track_genres" (
    "trackId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "track_genres_pkey" PRIMARY KEY ("trackId","genreId")
);

-- CreateTable
CREATE TABLE "public"."user_liked_tracks" (
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_liked_tracks_pkey" PRIMARY KEY ("userId","trackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_slug_key" ON "public"."tracks"("slug");

-- CreateIndex
CREATE INDEX "track_artists_trackId_order_idx" ON "public"."track_artists"("trackId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "track_artists_trackId_artistId_role_key" ON "public"."track_artists"("trackId", "artistId", "role");

-- CreateIndex
CREATE INDEX "track_credits_trackId_role_idx" ON "public"."track_credits"("trackId", "role");

-- CreateIndex
CREATE INDEX "play_history_trackId_playedAt_idx" ON "public"."play_history"("trackId", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_items_playlistId_trackId_key" ON "public"."playlist_items"("playlistId", "trackId");

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_artists" ADD CONSTRAINT "track_artists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_artists" ADD CONSTRAINT "track_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_credits" ADD CONSTRAINT "track_credits_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_credits" ADD CONSTRAINT "track_credits_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_genres" ADD CONSTRAINT "track_genres_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_genres" ADD CONSTRAINT "track_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_items" ADD CONSTRAINT "playlist_items_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_liked_tracks" ADD CONSTRAINT "user_liked_tracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_liked_tracks" ADD CONSTRAINT "user_liked_tracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."play_history" ADD CONSTRAINT "play_history_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
