/*
  Warnings:

  - The values [LEAD_VOCALS,BACKING_VOCALS,RAP,SONGWRITER,LYRICIST,EXECUTIVE_PRODUCER,CO_PRODUCER,VOCAL_PRODUCER,MIXING_ENGINEER,MASTERING_ENGINEER,RECORDING_ENGINEER,ASSISTANT_ENGINEER,GUITAR,BASS,DRUMS,PIANO,KEYBOARD,VIOLIN,SAXOPHONE,TRUMPET,OTHER_INSTRUMENT,PROGRAMMER,ADDITIONAL_PRODUCTION,PUBLISHER,RECORD_LABEL,MANAGEMENT] on the enum `CreditRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `role` on the `song_artists` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `song_credits` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `song_credits` table. All the data in the column will be lost.
  - You are about to drop the column `songNumber` on the `songs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[songId,artistId]` on the table `song_artists` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ArtistType" AS ENUM ('MAIN', 'FEATURED');

-- AlterEnum
BEGIN;
CREATE TYPE "CreditRole_new" AS ENUM ('PRODUCER', 'COMPOSER', 'WRITER', 'ARRANGER', 'ENGINEER', 'BACKGROUND_VOCAL');
ALTER TABLE "song_credits" ALTER COLUMN "role" TYPE "CreditRole_new" USING ("role"::text::"CreditRole_new");
ALTER TYPE "CreditRole" RENAME TO "CreditRole_old";
ALTER TYPE "CreditRole_new" RENAME TO "CreditRole";
DROP TYPE "public"."CreditRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "song_credits" DROP CONSTRAINT "song_credits_artistId_fkey";

-- DropIndex
DROP INDEX "song_artists_songId_artistId_role_key";

-- DropIndex
DROP INDEX "song_artists_songId_order_idx";

-- DropIndex
DROP INDEX "song_credits_songId_artistId_idx";

-- DropIndex
DROP INDEX "song_credits_songId_order_idx";

-- DropIndex
DROP INDEX "song_credits_songId_role_idx";

-- AlterTable
ALTER TABLE "song_artists" DROP COLUMN "role",
ADD COLUMN     "type" "ArtistType" NOT NULL DEFAULT 'MAIN';

-- AlterTable
ALTER TABLE "song_credits" DROP COLUMN "details",
DROP COLUMN "order",
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "songNumber",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "ArtistRole";

-- CreateIndex
CREATE UNIQUE INDEX "song_artists_songId_artistId_key" ON "song_artists"("songId", "artistId");

-- AddForeignKey
ALTER TABLE "song_credits" ADD CONSTRAINT "song_credits_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
