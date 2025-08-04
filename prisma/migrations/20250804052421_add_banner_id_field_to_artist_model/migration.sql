/*
  Warnings:

  - You are about to drop the column `verified` on the `artists` table. All the data in the column will be lost.
  - Added the required column `bannerId` to the `artists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."artists" DROP COLUMN "verified",
ADD COLUMN     "bannerId" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
