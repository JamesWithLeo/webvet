CREATE TYPE "public"."booking_source" AS ENUM('client', 'staff', 'admin');--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid,
	"pet_id" uuid,
	"service_id" uuid,
	"price_at_booking" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_invoice_id_invoices_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "appointment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "appointment_status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('PENDING', 'ARRIVED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "appointment_status" SET DEFAULT 'PENDING'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "appointment_status" SET DATA TYPE "public"."appointment_status" USING "appointment_status"::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "total_amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "distinguishingMarks" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "distinguishingMarks" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "diet" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "diet" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "species" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD COLUMN "priceAtBooking" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments_to_pets" ADD COLUMN "source" "booking_source" DEFAULT 'client' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "appointment_id" uuid;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "appointment_status" "appointment_status" DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "created_by_id" uuid;--> statement-breakpoint
ALTER TABLE "breeds" ADD COLUMN "species" "species" NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_pet_service_per_appointment" ON "appointments_to_pets" USING btree ("appointment_id","pet_id","serviceId");--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "invoice_id";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "paid_at";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "month_of_birth";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "height";--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointment_id_unique" UNIQUE("appointment_id");