/*
  Warnings:

  - You are about to drop the column `duration` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `totalSongs` on the `albums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albums" DROP COLUMN "duration",
DROP COLUMN "totalSongs",
ADD COLUMN     "songsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalDuration" INTEGER NOT NULL DEFAULT 0;
