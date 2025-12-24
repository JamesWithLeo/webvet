import {
    date,
    pgEnum,
    pgTable,
    timestamp,
    text,
    varchar,
    uuid,
} from "drizzle-orm/pg-core";

export const sexValuesTuple = ["MALE", "FEMALE", "UNKNOWN"] as const;
export const sex = pgEnum("sex_enum", sexValuesTuple);
export type Sex = (typeof sex.enumValues)[number];
export type USERTYPE = typeof users.$inferSelect;
export const sexValues = sex.enumValues;

export const role = pgEnum("role", ["client", "staff", "admin"]);
export const users = pgTable("users", {
    photoUrl: varchar("photo_url", { length: 255 }),
    googleId: varchar("google_id", { length: 255 }).unique(),
    facebookId: varchar("facebook_id", { length: 255 }).unique(),
    githubId: varchar("githubId", { length: 255 }).unique(),
    role: role("role").default("client").notNull(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    dateOfBirth: date(),
    sex: sex("sex").default("UNKNOWN").notNull(),

    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});
