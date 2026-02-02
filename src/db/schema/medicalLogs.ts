import {
    doublePrecision,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { pets } from "./pets";

export const medicalLogs = pgTable("medical_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    petId: uuid("pet_id")
        .references(() => pets.id, { onDelete: "cascade" })
        .notNull(),
    appointmentId: uuid("appointment_id").references(() => appointments.id, {
        onDelete: "set null",
    }),

    title: varchar("title", { length: 100 }).notNull(), // e.g., "5-in-1 Vaccine"
    administeredAt: timestamp("administered_at").defaultNow().notNull(),
    // The "Smart" part: When should they come back?
    nextDueDate: timestamp("next_due_date"),

    notes: text("notes"),
    weightAtTime: doublePrecision("weight_at_time"), // Useful for deworming dosage tracking

    // --- Medical Specifics ---
    brand: varchar("brand", { length: 50 }),
    batchNumber: varchar("batch_number", { length: 50 }),
    dosage: varchar("dosage", { length: 50 }),
});
