import {
    date,
    pgEnum,
    pgTable,
    timestamp,
    text,
    varchar,
    uuid,
} from "drizzle-orm/pg-core";

export const userGenderValueTuple = ["male", "female", "other"] as const;
export const userGender = pgEnum("user_gender", userGenderValueTuple);
export type UserGender = (typeof userGender.enumValues)[number];
export type USERTYPE = typeof users.$inferSelect;
export const userGenderValue = userGender.enumValues;

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
    gender: userGender("gender").default("other").notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    contactNumber: varchar("contact_number", { length: 20 }),
});
