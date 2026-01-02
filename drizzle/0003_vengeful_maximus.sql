CREATE TYPE "public"."pet_gender" AS ENUM('male', 'female', 'unknown');--> statement-breakpoint
ALTER TABLE "pets" RENAME COLUMN "sex" TO "gender";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "sex" TO "gender";--> statement-breakpoint
ALTER TABLE "pets" DROP CONSTRAINT "ownership_owner_check";--> statement-breakpoint
ALTER TABLE "pets" DROP CONSTRAINT "valid_reproductive_status";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "ownership_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "ownership_status" SET DEFAULT 'UNKNOWN'::text;--> statement-breakpoint
DROP TYPE "public"."ownership_status";--> statement-breakpoint
CREATE TYPE "public"."ownership_status" AS ENUM('OWNED', 'STRAY', 'RESCUED', 'UNKNOWN');--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "ownership_status" SET DEFAULT 'UNKNOWN'::"public"."ownership_status";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "ownership_status" SET DATA TYPE "public"."ownership_status" USING "ownership_status"::"public"."ownership_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('client', 'staff', 'admin');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'other'::text;--> statement-breakpoint
DROP TYPE "public"."sex_enum";--> statement-breakpoint
CREATE TYPE "public"."sex_enum" AS ENUM('male', 'female', 'other');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'other'::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "gender" SET DATA TYPE "public"."sex_enum" USING "gender"::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "breed_specification" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "isLike" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "diet" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "allergies" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "uniqueIdentification" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "isMissing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "photo_url" varchar(255);--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "ownership_consistency" CHECK (("pets"."owner_id" IS NOT NULL AND "pets"."ownership_status" = 'OWNED') 
            OR ("pets"."owner_id" IS NULL AND "pets"."ownership_status" != 'OWNED'));--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "valid_reproductive_status" CHECK (("pets"."reproductive_status" != 'SPAYED' OR "pets"."gender" = 'female')
            AND ("pets"."reproductive_status" != 'NEUTERED' OR "pets"."gender" = 'male'));