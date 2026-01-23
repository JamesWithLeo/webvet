import {
    boolean,
    decimal,
    pgEnum,
    pgTable,
    text,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { appointmentType } from "./appointments";

export const services = pgTable("services", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 50 }).notNull(),
    type: appointmentType().notNull(),
    description: text(),
    reminder: text(),
    inclusions: text("inclusions").array().notNull().default([]),
});

export const servicePriceVariant = [
    "SMALL",
    "MEDIUM",
    "LARGE",
    "FLAT",
] as const;
export const servicePricesType = pgEnum(
    "servicePricesType",
    servicePriceVariant
);

export const servicePrices = pgTable("service_prices", {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceId: uuid("service_id")
        .notNull()
        .references(() => services.id, { onDelete: "cascade" }),
    variant: servicePricesType().notNull().default("FLAT"),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean().default(true).notNull(),
});

export type ServiceTypeModel = InferSelectModel<typeof services>;
