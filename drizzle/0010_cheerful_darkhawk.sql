ALTER TABLE "invoices" ADD COLUMN "refund_reason" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "updated_by" text;