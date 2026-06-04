CREATE TYPE "public"."ownership_status" AS ENUM('OWNED', 'MISSING', 'STRAY', 'RESCUED', 'SHELTERED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."reproductive_status" AS ENUM('INTACT', 'SPAYED', 'NEUTERED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."sex_enum" AS ENUM('FEMALE', 'MALE', 'UNKNOWN');--> statement-breakpoint
ALTER TABLE "appointments" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "pet_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "owner_id" uuid;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "sex" "sex_enum" DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "marks" varchar[];--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "year_of_birth" integer;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "month_of_birth" integer;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "day_of_birth" integer;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "reproductive_status" "reproductive_status" DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "ownership_status" "ownership_status" DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dateOfBirth" date;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "valid_reproductive_status" CHECK (("pets"."reproductive_status" != 'SPAYED' OR "pets"."sex" = 'FEMALE')
            AND ("pets"."reproductive_status" != 'NEUTERED' OR "pets"."sex" = 'MALE'));--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "ownership_owner_check" CHECK (("pets"."ownership_status" != 'OWNED' OR "pets"."owner_id" IS NOT NULL));



DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex_enum') THEN
    CREATE TYPE sex_enum AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
  END IF;
END$$;

-- Alter the column type, casting boolean to enum as text
ALTER TABLE your_table_name
  ALTER COLUMN sex TYPE sex_enum
  USING CASE
    WHEN sex = true THEN 'MALE'::sex_enum
    WHEN sex = false THEN 'FEMALE'::sex_enum
    ELSE 'UNKNOWN'::sex_enum
  END;

-- Set default value of enum if needed
ALTER TABLE your_table_name ALTER COLUMN sex SET DEFAULT 'UNKNOWN';