CREATE TYPE "public"."species" AS ENUM('dog', 'cat');--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"reason" varchar(255) NOT NULL,
	"blocked_by" uuid
);
--> statement-breakpoint
CREATE TABLE "medical_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"appointment_id" uuid,
	"title" varchar(100) NOT NULL,
	"administered_at" timestamp DEFAULT now() NOT NULL,
	"next_due_date" timestamp,
	"notes" text,
	"weight_at_time" double precision,
	"brand" varchar(50),
	"batch_number" varchar(50),
	"dosage" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "pet_types" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "pet_types" CASCADE;--> statement-breakpoint
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_pet_type_id_pet_types_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "weight" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD COLUMN "serviceId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "breeds" ADD COLUMN "species" "species" NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "species" "species" NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "gapInDays" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "annualInterval" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "species" "species" NOT NULL;--> statement-breakpoint
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_blocked_by_users_id_fk" FOREIGN KEY ("blocked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD CONSTRAINT "appointments_to_pets_serviceId_services_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "breeds" DROP COLUMN "pet_type_id";