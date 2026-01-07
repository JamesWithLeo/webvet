CREATE TABLE "account" (
	"userId" text NOT NULL,
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
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "sex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "sex" SET DEFAULT 'UNKNOWN'::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET DEFAULT 'UNKNOWN'::text;--> statement-breakpoint
DROP TYPE "public"."sex_enum";--> statement-breakpoint
CREATE TYPE "public"."sex_enum" AS ENUM('MALE', 'FEMALE', 'UNKNOWN');--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "sex" SET DEFAULT 'UNKNOWN'::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "sex" SET DATA TYPE "public"."sex_enum" USING "sex"::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET DEFAULT 'UNKNOWN'::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET DATA TYPE "public"."sex_enum" USING "sex"::"public"."sex_enum";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "event_datetime" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "google_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "photo_url" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facebook_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "githubId" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" "sex_enum" DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_facebook_id_unique" UNIQUE("facebook_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_githubId_unique" UNIQUE("githubId");