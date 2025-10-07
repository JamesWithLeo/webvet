import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const appointmentTypeValues = [
    "CHECK_UP",
    "GROOMING",
    "VACCINATION",
    "CONSULTATION",
] as const;

export const appointmentType = pgEnum(
    "appointment_type",
    appointmentTypeValues
);

export const appointments = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }),
    event_datetime: timestamp("event_datetime").notNull(),
    type: appointmentType("type").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
