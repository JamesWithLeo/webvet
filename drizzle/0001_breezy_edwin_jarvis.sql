CREATE TABLE "appointment_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointmentType" "appointment_type" NOT NULL,
	"available_days" integer[] NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "appointment_schedules_appointmentType_unique" UNIQUE("appointmentType")
);
--> statement-breakpoint
ALTER TABLE "appointment_schedules" ALTER COLUMN "appointmentType" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."appointment_type";--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('CHECK_UP', 'GROOMING', 'VACCINATION', 'DEWORMING');--> statement-breakpoint
ALTER TABLE "appointment_schedules" ALTER COLUMN "appointmentType" SET DATA TYPE "public"."appointment_type" USING "appointmentType"::"public"."appointment_type";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DATA TYPE "public"."appointment_type" USING "type"::"public"."appointment_type";--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "type" SET DATA TYPE "public"."appointment_type" USING "type"::"public"."appointment_type";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "contact_number" varchar(20);