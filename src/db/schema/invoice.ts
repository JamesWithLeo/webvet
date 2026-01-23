import {
    pgEnum,
    pgTable,
    boolean,
    timestamp,
    uuid,
    varchar,
    integer,
} from "drizzle-orm/pg-core";

export const paymentStatusTypeValues = ["UNPAID", "PAID", "VOID"] as const;
export const paymentStatusType = pgEnum(
    "payment_status",
    paymentStatusTypeValues
);

export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    totalAmount: integer("total_amount").notNull(), // Total in cents
    status: paymentStatusType("status").default("UNPAID"),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
