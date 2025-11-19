/*
  Warnings:

  - You are about to drop the column `albumType` on the `albums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albums" DROP COLUMN "albumType",
ADD COLUMN     "type" "AlbumType" NOT NULL DEFAULT 'SINGLE';
