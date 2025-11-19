/*
  Warnings:

  - You are about to drop the column `imageId` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `artists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albums" DROP COLUMN "imageId",
ADD COLUMN     "thumbnailId" TEXT;

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "imageId",
ADD COLUMN     "avatarColor" TEXT,
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "bannerColor" TEXT,
ALTER COLUMN "bannerId" DROP NOT NULL;
