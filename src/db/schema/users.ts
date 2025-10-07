import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["client", "doctor", "admin"]);
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    google_id: varchar("google_id", { length: 100 }).unique(),
    role: role("role").default("client"),
    first_name: varchar("first_name", { length: 50 }),
    last_name: varchar("last_name", { length: 50 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
