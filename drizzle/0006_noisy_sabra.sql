CREATE TYPE "public"."item_status" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'vet';--> statement-breakpoint
CREATE TABLE "verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_invoice_id_invoices_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "medical_logs" DROP CONSTRAINT "medical_logs_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_items" ALTER COLUMN "invoice_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_items" ALTER COLUMN "pet_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_items" ALTER COLUMN "service_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ALTER COLUMN "weight" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "medical_logs" ALTER COLUMN "weight" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ALTER COLUMN "prescription" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ALTER COLUMN "temperature" SET DATA TYPE numeric(3, 1);--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "item_status" "item_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD COLUMN "service_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "photoKey" varchar(255);--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "medical_logs_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" DROP COLUMN "appointment_to_pets_status";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "total_amount";--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "unique_pet_service_invoice" UNIQUE("invoice_id","pet_id","service_id");--> statement-breakpoint
ALTER TABLE "medical_logs" ADD CONSTRAINT "unique_task_log" UNIQUE("appointment_id","pet_id","service_id");