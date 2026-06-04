CREATE TYPE "public"."appointment_status" AS ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('CHECK_UP', 'GROOMING', 'VACCINATION', 'CONSULTATION', 'DEWORMING');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('UNPAID', 'PAID', 'VOID');--> statement-breakpoint
CREATE TYPE "public"."life_enum" AS ENUM('alive', 'deceased', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."ownership_status" AS ENUM('OWNED', 'STRAY', 'RESCUED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."pet_gender" AS ENUM('male', 'female', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."reproductive_status" AS ENUM('INTACT', 'SPAYED', 'NEUTERED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."servicePricesType" AS ENUM('SMALL', 'MEDIUM', 'LARGE', 'FLAT');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('client', 'staff', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50),
	"event_datetime" timestamp with time zone NOT NULL,
	"type" "appointment_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expired_notification" boolean DEFAULT false NOT NULL,
	"incoming_notification" boolean DEFAULT false NOT NULL,
	"invoice_id" uuid
);
--> statement-breakpoint
CREATE TABLE "appointments_to_pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_amount" integer NOT NULL,
	"status" "payment_status" DEFAULT 'UNPAID',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pet_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"breed_id" integer NOT NULL,
	"breed_specification" text NOT NULL,
	"owner_id" uuid,
	"gender" "pet_gender" DEFAULT 'unknown' NOT NULL,
	"color" text,
	"distinguishingMarks" jsonb DEFAULT '[]'::jsonb,
	"month_of_birth" integer,
	"date_of_birth" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"diet" jsonb DEFAULT '[]'::jsonb,
	"allergies" jsonb DEFAULT '[]'::jsonb,
	"weight" numeric(5, 2),
	"height" numeric(5, 2),
	"life" "life_enum" DEFAULT 'alive' NOT NULL,
	"isEstimatedDOB" boolean DEFAULT false,
	"isVerified" boolean DEFAULT false,
	"isLike" boolean DEFAULT false,
	"isMissing" boolean DEFAULT false,
	"photo_url" varchar(255) NOT NULL,
	"reproductive_status" "reproductive_status" DEFAULT 'UNKNOWN' NOT NULL,
	"ownership_status" "ownership_status" DEFAULT 'UNKNOWN' NOT NULL,
	CONSTRAINT "valid_reproductive_status" CHECK (("pets"."reproductive_status" != 'SPAYED' OR "pets"."gender" = 'female')
            AND ("pets"."reproductive_status" != 'NEUTERED' OR "pets"."gender" = 'male')),
	CONSTRAINT "ownership_consistency" CHECK (("pets"."owner_id" IS NOT NULL AND "pets"."ownership_status" = 'OWNED') 
            OR ("pets"."owner_id" IS NULL AND "pets"."ownership_status" != 'OWNED'))
);
--> statement-breakpoint
CREATE TABLE "pet_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pet_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "service_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"variant" "servicePricesType" DEFAULT 'FLAT' NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"isAvailable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"type" "appointment_type" NOT NULL,
	"description" text NOT NULL,
	"reminder" text NOT NULL,
	"inclusions" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"photo_url" varchar(255),
	"google_id" varchar(255),
	"facebook_id" varchar(255),
	"githubId" varchar(255),
	"role" "role" DEFAULT 'client' NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"dateOfBirth" date,
	"gender" "user_gender" DEFAULT 'other' NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_facebook_id_unique" UNIQUE("facebook_id"),
	CONSTRAINT "users_githubId_unique" UNIQUE("githubId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD CONSTRAINT "appointments_to_pets_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD CONSTRAINT "appointments_to_pets_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_pet_type_id_pet_types_id_fk" FOREIGN KEY ("pet_type_id") REFERENCES "public"."pet_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;