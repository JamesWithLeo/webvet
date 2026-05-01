import {
    pgTable,
    boolean,
    timestamp,
    uuid,
    varchar,
    integer,
    serial,
    date,
    decimal,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { InferSelectModel } from "drizzle-orm";
import { invoiceStatus } from "./invoice";
import { users } from "./users";
import { appointmentType } from "./enums";
import { services } from "./services";

export type AppointmentType = (typeof appointmentType.enumValues)[number];

export type AppointmentPetMergeType = {
    breed: string;
    event_datetime: string;
    id: string;
    name: string;
    petId: string;
    photoUrl: string | null;
    title: string | null;
};

export type JoinedAppointmentType = {
    invoiceStatus: "UNPAID" | "PAID" | "VOID" | null;
    invoiceId: string | null;
    pets: {
        id: string;
        name: string;
        photoUrl: string | null;
        priceAtBooking: string;
    }[];
    id: string;
    title: string;
    event_datetime: string;
    created_at: Date;
    expiredNotification: boolean;
    incomingNotification: boolean;
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

    title: varchar("title", { length: 50 }).notNull(),

    event_datetime: timestamp("event_datetime", {
        withTimezone: true,
        mode: "string",
    }).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),

    expiredNotification: boolean("expired_notification")
        .default(false)
        .notNull(),

    incomingNotification: boolean("incoming_notification")
        .default(false)
        .notNull(),
});

export const bookingSourceEnum = pgEnum("booking_source", [
    "client",
    "staff",
    "admin",
]);
export type BookingSourceType = (typeof bookingSourceEnum.enumValues)[number];

export const appointmentToPetsStatus = pgEnum("appointment_to_pets_status", [
    "PENDING",
    "COMPLETED",
    "CANCELLED",
]);
export type AppointmentToPetsStatus =
    (typeof appointmentToPetsStatus.enumValues)[number];

export const appointmentsToPets = pgTable(
    "appointments_to_pets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        appointmentId: uuid("appointment_id")
            .notNull()
            .references(() => appointments.id, { onDelete: "cascade" }),
        petId: uuid("pet_id")
            .notNull()
            .references(() => pets.id, { onDelete: "cascade" }),
        serviceId: uuid("serviceId")
            .notNull()
            .references(() => services.id),
        priceAtBooking: decimal({ precision: 10, scale: 2 }).notNull(),
        source: bookingSourceEnum("source").default("client").notNull(),
    },
    (table) => {
        return {
            // This ensures that for a specific appointment,
            // a pet cannot have the same service assigned twice.
            uniquePetServicePerAppointment: uniqueIndex(
                "unique_pet_service_per_appointment"
            ).on(table.appointmentId, table.petId, table.serviceId),
        };
    }
);

export type AppointmentToPetsTypeModel = InferSelectModel<
    typeof appointmentsToPets
>;

export const appointmentSchedules = pgTable("appointment_schedules", {
    id: serial("id").primaryKey(),
    appointmentType: appointmentType().notNull().unique(),
    availableDays: integer("available_days").array().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AppointmentSchedulesTypeModel = InferSelectModel<
    typeof appointmentSchedules
>;

export type AppointmentTypeModel = InferSelectModel<typeof appointments>;

export const blockedDates = pgTable("blocked_dates", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date").notNull(),
    startTime: timestamp("start_time", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    endTime: timestamp("end_time", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    blockedBy: uuid("blocked_by").references(() => users.id, {
        onDelete: "set null",
    }),
});

export type BlockDatesTypeModel = InferSelectModel<typeof blockedDates>;

export type AdminAppointment = {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        photoUrl: string;
        contactNumber: string;
        email: string | null;
    };
    id: string;
    title: string;
    event_datetime: string;
    created_at: Date;
    expiredNotification: boolean;
    incomingNotification: boolean;
    invoice: {
        id: string;
        totalAmount: string;
        paymentStatus: "UNPAID" | "PAID" | "VOID" | "REFUNDED" | null;
        createdAt: Date;
        status: (typeof invoiceStatus.enumValues)[number];
    } | null;
};
