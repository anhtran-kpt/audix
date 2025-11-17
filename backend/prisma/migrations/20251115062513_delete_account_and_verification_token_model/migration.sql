/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_liked_artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_liked_artists" DROP CONSTRAINT "user_liked_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "user_liked_artists" DROP CONSTRAINT "user_liked_artists_userId_fkey";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "user_liked_artists";

-- DropTable
DROP TABLE "verification_tokens";

-- CreateTable
CREATE TABLE "user_followed_artists" (
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_followed_artists_pkey" PRIMARY KEY ("userId","artistId")
);

-- AddForeignKey
ALTER TABLE "user_followed_artists" ADD CONSTRAINT "user_followed_artists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_followed_artists" ADD CONSTRAINT "user_followed_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
