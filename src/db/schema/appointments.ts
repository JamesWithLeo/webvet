import {
    pgEnum,
    pgTable,
    boolean,
    timestamp,
    uuid,
    varchar,
    integer,
    text,
} from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { InferSelectModel } from "drizzle-orm";
import { invoices } from "./invoice";

export const appointmentStatusValues = [
    "SCHEDULED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
] as const;
export const appointmentStatusType = pgEnum(
    "appointment_status",
    appointmentStatusValues
);
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
export type JoinedAppointmentType = {
    id: string;
    title: string | null;
    event_datetime: string;
    type: AppointmentType;
    created_at: Date;
    expiredNotification: boolean;
    incomingNotification: boolean;
    pets: { id: string; name: string; photoUrl: string | null }[];
};
export const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const appointments = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 50 }),
    event_datetime: timestamp("event_datetime", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    type: appointmentType("type").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),

    expiredNotification: boolean("expired_notification")
        .default(false)
        .notNull(),
    incomingNotification: boolean("incoming_notification")
        .default(false)
        .notNull(),

    // payment
    // priceAtBooking: integer("price_at_booking"),
    invoiceId: uuid("invoice_id").references(() => invoices.id, {
        onDelete: "set null",
    }),

    // todo
    // status: appointmentStatusType().default("SCHEDULED").notNull(),
    // cancelledAt: timestamp("cancelled_at"),
    // cancellationReason: text("cancellation_reason"),
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
