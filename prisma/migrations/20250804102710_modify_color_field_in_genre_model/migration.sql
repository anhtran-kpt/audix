/*
  Warnings:

  - Made the column `color` on table `genres` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."genres" ALTER COLUMN "color" SET NOT NULL;
