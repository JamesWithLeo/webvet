import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pets } from "./pets";

export const appointmentTypeValues = [
    "CHECK_UP",
    "GROOMING",
    "VACCINATION",
    "CONSULTATION",
    "DEWORMING",
] as const;

export const appointmentType = pgEnum(
    "appointment_type",
    appointmentTypeValues
);

export const appointments = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 50 }),
    petId: uuid("pet_id")
        .notNull()
        .references(() => pets.id, { onDelete: "cascade" }),
    event_datetime: timestamp("event_datetime", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    type: appointmentType("type").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
