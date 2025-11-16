import {
    pgTable,
    check,
    varchar,
    integer,
    uuid,
    timestamp,
    serial,
    text,
    date,
    pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users, sex } from "./users";

export const reproductiveStatusEnum = pgEnum("reproductive_status", [
    "INTACT", // not spayed or neutered
    "SPAYED", // female sterilized
    "NEUTERED", // male sterilized
    "UNKNOWN", // unknown status
]);

export const ownershipStatusEnum = pgEnum("ownership_status", [
    "OWNED", // confirmed owner
    "MISSING", // owner known, but pet is lost
    "STRAY", // no owner found
    "RESCUED", // taken in by shelter or rescuer
    "SHELTERED", // under care of a shelter
    "UNKNOWN", // no info yet
]);

export const petTypes = pgTable("pet_types", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const breeds = pgTable("breeds", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    petTypeId: integer("pet_type_id")
        .notNull()
        .references(() => petTypes.id, { onDelete: "cascade" }),
});

export const pets = pgTable(
    "pets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: varchar("name", { length: 100 }).notNull(),
        breedId: integer("breed_id")
            .notNull()
            .references(() => breeds.id, { onDelete: "restrict" }),
        ownerId: uuid("owner_id").references(() => users.id, {
            onDelete: "set null",
        }),
        age: integer("age").notNull(),
        created_at: timestamp("created_at").defaultNow().notNull(),
        sex: sex("sex").default("UNKNOWN").notNull(),
        color: text(),
        marks: varchar().array(),
        yearOfBirth: integer("year_of_birth"),
        monthOfBirth: integer("month_of_birth"),
        dayOfBirth: integer("day_of_birth"),
        dateOfBirth: date("date_of_birth"),
        createdAt: timestamp("created_at").defaultNow().notNull(),

        reproductiveStatus: reproductiveStatusEnum("reproductive_status")
            .notNull()
            .default("UNKNOWN"),
        ownershipStatus: ownershipStatusEnum("ownership_status")
            .default("UNKNOWN")
            .notNull(),
    },
    (table) => [
        check("age_check", sql`${table.age} >= 0 AND ${table.age} <= 100`),
        check(
            "valid_reproductive_status",
            sql`(${table.reproductiveStatus} != 'SPAYED' OR ${table.sex} = 'FEMALE')
            AND (${table.reproductiveStatus} != 'NEUTERED' OR ${table.sex} = 'MALE')`
        ),
        check(
            "ownership_owner_check",
            sql`(${table.ownershipStatus} != 'OWNED' OR ${table.ownerId} IS NOT NULL)`
        ),
    ]
);
