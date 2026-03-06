import {
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    decimal,
    unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { services } from "./services";
import { appointments } from "./appointments";
import { pets } from "./pets";

export const invoiceStatus = pgEnum("invoiceStatus", [
    "PENDING",
    "ARRIVED",
    "COMPLETED",
    "CANCELLED",
    "MISSED",
    "IN_PROGRESS",
]);

export const paymentStatusTypeValues = ["UNPAID", "PAID", "VOID"] as const;
export const paymentStatusType = pgEnum(
    "payment_status",
    paymentStatusTypeValues
);

export const invoices = pgTable("invoices", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    appointmentId: uuid("appointment_id")
        .references(() => appointments.id, {
            onDelete: "set null",
        })
        .unique(),
    status: invoiceStatus("invoice_status").default("PENDING"),
    // totalAmount: decimal("total_amount", { scale: 2, precision: 10 })
    //     .notNull()
    //     .default("0.00"),
    paymentStatus: paymentStatusType("status").default("UNPAID"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdById: uuid("created_by_id").references(() => users.id, {
        onDelete: "set null",
    }),
});

export type InvoiceTypeModel = typeof invoices.$inferSelect;

export const itemStatusEnum = pgEnum("item_status", [
    "PENDING",
    "COMPLETED",
    "CANCELLED",
]);

export const invoiceItems = pgTable(
    "invoice_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        invoiceId: uuid("invoice_id")
            .references(() => invoices.id, {
                onDelete: "restrict",
            })
            .notNull(),
        petId: uuid("pet_id")
            .references(() => pets.id, { onDelete: "restrict" })
            .notNull(),
        serviceId: uuid("service_id")
            .references(() => services.id, {
                onDelete: "restrict",
            })
            .notNull(),
        itemStatus: itemStatusEnum("item_status").default("PENDING").notNull(),
        priceAtInvoice: decimal("price_at_booking", {
            scale: 2,
            precision: 10,
        }).notNull(),
    },
    (table) => {
        return {
            uniquePetServicePerInvoice: unique("unique_pet_service_invoice").on(
                table.invoiceId,
                table.petId,
                table.serviceId
            ),
        };
    }
);

export type InvoiceItemsTypeModel = typeof invoiceItems.$inferSelect;
