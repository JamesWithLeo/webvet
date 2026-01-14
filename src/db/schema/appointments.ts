import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { InferSelectModel } from "drizzle-orm";

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

export type AppointmentType = (typeof appointmentType.enumValues)[number];

export type AppointmentPetMergeType = {
    breed: string;
    event_datetime: string;
    id: string;
    name: string;
    petId: string;
    photoUrl: string | null;
    title: string | null;
    type: string;
};

export const appointments = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 50 }),
    event_datetime: timestamp("event_datetime", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    type: appointmentType("type").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export const appointmentsToPets = pgTable("appointments_to_pets", {
    id: uuid("id").defaultRandom().primaryKey(),
    appointmentId: uuid("appointment_id")
        .notNull()
        .references(() => appointments.id, { onDelete: "cascade" }),

    petId: uuid("pet_id")
        .notNull()
        .references(() => pets.id, { onDelete: "cascade" }),
});

export type AppointmentTypeModel = InferSelectModel<typeof appointments>;
