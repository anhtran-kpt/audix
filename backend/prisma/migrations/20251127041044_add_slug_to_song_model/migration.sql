/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `songs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "songs_slug_key" ON "songs"("slug");

-- CreateIndex
CREATE INDEX "songs_slug_idx" ON "songs"("slug");
