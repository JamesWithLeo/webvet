import { pgEnum, pgTable, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const paymentStatusTypeValues = ["UNPAID", "PAID", "VOID"] as const;
export const paymentStatusType = pgEnum(
    "payment_status",
    paymentStatusTypeValues
);

export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    totalAmount: integer("total_amount").notNull(),
    status: paymentStatusType("status").default("PAID"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoiceItems = pgTable("invoice_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id").references(() => invoices.id, {
        onDelete: "cascade",
    }),
    petId: uuid("pet_id").notNull(),
    priceAtInvoice: integer("price_at_booking").notNull(), // 800
});
