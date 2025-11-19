/*
  Warnings:

  - You are about to drop the column `avatarColor` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarColor",
DROP COLUMN "avatarId",
ADD COLUMN     "image" TEXT;
