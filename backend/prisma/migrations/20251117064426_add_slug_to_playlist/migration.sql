/*
  Warnings:

  - You are about to drop the column `slug` on the `tracks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `playlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `playlists` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tracks_slug_idx";

-- DropIndex
DROP INDEX "tracks_slug_key";

-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "playlists_slug_key" ON "playlists"("slug");

-- CreateIndex
CREATE INDEX "playlists_slug_idx" ON "playlists"("slug");
