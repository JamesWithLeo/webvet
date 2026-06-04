CREATE TYPE "public"."appointment_to_pets_status" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."invoiceStatus" AS ENUM('PENDING', 'ARRIVED', 'COMPLETED', 'CANCELLED', 'MISSED', 'IN_PROGRESS');--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "total_amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD COLUMN "appointment_to_pets_status" "appointment_to_pets_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_status" "invoiceStatus" DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "weight" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "symptoms" text;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "diagnosis" text;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "prescription" text NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "clinical_notes" text NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "temperature" numeric(4, 1);--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "veterinarian_id" uuid;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_veterinarian_id_users_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "appointment_status";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "administered_at";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "next_due_date";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "weight_at_time";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "batch_number";--> statement-breakpoint
ALTER TABLE "medical_logs" DROP COLUMN "dosage";