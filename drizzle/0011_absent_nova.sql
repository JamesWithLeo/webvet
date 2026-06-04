CREATE TYPE "public"."refundMethodEnum" AS ENUM('CASH', 'DIGITAL');--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "amount_refunded" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "refundMethod" "refundMethodEnum";