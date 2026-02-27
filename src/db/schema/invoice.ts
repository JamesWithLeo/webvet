import {
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    integer,
    decimal,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const paymentStatusTypeValues = ["UNPAID", "PAID", "VOID"] as const;
export const paymentStatusType = pgEnum(
    "payment_status",
    paymentStatusTypeValues
);

export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    totalAmount: decimal("total_amount", { scale: 2, precision: 10 }).notNull(),
    status: paymentStatusType("status").default("PAID"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdById: uuid("created_by_id").references(() => users.id, {
        onDelete: "set null",
    }),
});

export type InvoiceTypeModel = typeof invoices.$inferSelect;

export const invoiceItems = pgTable("invoice_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").references(() => invoices.id, {
        onDelete: "cascade",
    }),
    petId: uuid("pet_id").notNull(),
    priceAtInvoice: decimal("price_at_booking", {
        scale: 2,
        precision: 10,
    }).notNull(), // 800
});
