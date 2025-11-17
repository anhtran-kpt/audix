/*
  Warnings:

  - The values [COMPILATION] on the enum `AlbumType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `user_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlbumType_new" AS ENUM ('SINGLE', 'EP', 'ALBUM');
ALTER TABLE "public"."albums" ALTER COLUMN "albumType" DROP DEFAULT;
ALTER TABLE "albums" ALTER COLUMN "albumType" TYPE "AlbumType_new" USING ("albumType"::text::"AlbumType_new");
ALTER TYPE "AlbumType" RENAME TO "AlbumType_old";
ALTER TYPE "AlbumType_new" RENAME TO "AlbumType";
DROP TYPE "public"."AlbumType_old";
ALTER TABLE "albums" ALTER COLUMN "albumType" SET DEFAULT 'SINGLE';
COMMIT;

-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_userId_fkey";

-- DropTable
DROP TABLE "user_subscriptions";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "SubscriptionType";

-- CreateIndex
CREATE INDEX "albums_slug_idx" ON "albums"("slug");

-- CreateIndex
CREATE INDEX "artists_slug_idx" ON "artists"("slug");

-- CreateIndex
CREATE INDEX "genres_slug_idx" ON "genres"("slug");

-- CreateIndex
CREATE INDEX "tracks_slug_idx" ON "tracks"("slug");
