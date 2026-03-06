import {
    decimal,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { pets } from "./pets";
import { users } from "./users";
import { services } from "./services";

export const medicalLogs = pgTable(
    "medical_logs",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        appointmentId: uuid("appointment_id").references(
            () => appointments.id,
            {
                onDelete: "restrict",
            }
        ),
        serviceId: uuid("service_id")
            .references(() => services.id, {
                onDelete: "restrict",
            })
            .notNull(),

        // Link to the specific pet (from appointments_to_pets)
        petId: uuid("pet_id")
            .references(() => pets.id, { onDelete: "cascade" })
            .notNull(),

        // Clinical Data
        weight: decimal("weight", { precision: 4, scale: 2 }).notNull(),
        symptoms: text("symptoms"),
        diagnosis: text("diagnosis"),
        prescription: text("prescription"),
        notes: text("clinical_notes").notNull(),
        temperature: decimal("temperature", { precision: 3, scale: 1 }),
        // Staff tracking
        veterinarianId: uuid("veterinarian_id").references(() => users.id),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },

    (table) => ({
        oneLogPerTask: unique("unique_task_log").on(
            table.appointmentId,
            table.petId,
            table.serviceId
        ),
    })
);

export type MedicalLogsTypeModel = typeof medicalLogs.$inferSelect;
