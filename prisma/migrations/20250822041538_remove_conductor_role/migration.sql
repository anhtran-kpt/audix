/*
  Warnings:

  - The values [CONDUCTOR] on the enum `CreditRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CreditRole_new" AS ENUM ('LEAD_VOCALS', 'BACKING_VOCALS', 'RAP', 'SONGWRITER', 'COMPOSER', 'LYRICIST', 'PRODUCER', 'EXECUTIVE_PRODUCER', 'CO_PRODUCER', 'VOCAL_PRODUCER', 'MIXING_ENGINEER', 'MASTERING_ENGINEER', 'RECORDING_ENGINEER', 'ASSISTANT_ENGINEER', 'GUITAR', 'BASS', 'DRUMS', 'PIANO', 'KEYBOARD', 'VIOLIN', 'SAXOPHONE', 'TRUMPET', 'OTHER_INSTRUMENT', 'ARRANGER', 'PROGRAMMER', 'ADDITIONAL_PRODUCTION', 'PUBLISHER', 'RECORD_LABEL', 'MANAGEMENT');
ALTER TABLE "public"."track_credits" ALTER COLUMN "role" TYPE "public"."CreditRole_new" USING ("role"::text::"public"."CreditRole_new");
ALTER TYPE "public"."CreditRole" RENAME TO "CreditRole_old";
ALTER TYPE "public"."CreditRole_new" RENAME TO "CreditRole";
DROP TYPE "public"."CreditRole_old";
COMMIT;
