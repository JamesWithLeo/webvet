import {
    date,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sex_enum", ["MALE", "FEMALE", "UNKNOWN"]);
export type SexType = (typeof sexEnum.enumValues)[number];
export const sexValues = sexEnum.enumValues;

export const role = pgEnum("role", ["client", "doctor", "admin"]);
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    googleId: varchar("google_id", { length: 100 }).unique(),
    role: role("role").default("client"),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    dateOfBirth: date(),
    sex: sexEnum("sex").default("UNKNOWN").notNull(),
});
