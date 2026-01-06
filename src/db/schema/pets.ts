import {
    pgTable,
    check,
    varchar,
    integer,
    decimal,
    timestamp,
    serial,
    text,
    date,
    pgEnum,
    uuid,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";
import { InferSelectModel, sql } from "drizzle-orm";
import { users } from "./users";

export const reproductiveStatusEnum = pgEnum("reproductive_status", [
    "INTACT", // not spayed or neutered
    "SPAYED", // female sterilized
    "NEUTERED", // male sterilized
    "UNKNOWN", // unknown status
]);

export const OWNERSHIP_STATUS = {
    OWNED: "OWNED", // confirmed owner
    STRAY: "STRAY", // no owner found
    RESCUED: "RESCUED", // taken in by shelter or rescuer
    UNKNOWN: "UNKNOWN", // no info yet
} as const; // 'as const' makes the values read-only strings

export const ownershipStatusEnum = pgEnum("ownership_status", [
    OWNERSHIP_STATUS.OWNED,
    OWNERSHIP_STATUS.STRAY,
    OWNERSHIP_STATUS.RESCUED,
    OWNERSHIP_STATUS.UNKNOWN,
]);
export const LIFE_STATUS = {
    alived: "alive",
    deceased: "deceased",
    unknown: "unknown",
} as const;

export const lifeStatusEnum = pgEnum("life_enum", [
    LIFE_STATUS.alived,
    LIFE_STATUS.deceased,
    LIFE_STATUS.unknown,
]);
export type LifeStatus = (typeof lifeStatusEnum.enumValues)[number];

export const petGenderValueTuple = ["male", "female", "unknown"] as const;
export const petGender = pgEnum("pet_gender", petGenderValueTuple);
export type PetGender = (typeof petGender.enumValues)[number];
export const petGenderValues = petGender.enumValues;

export const species = pgTable("pet_types", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const breeds = pgTable("breeds", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    petTypeId: integer("pet_type_id")
        .notNull()
        .references(() => species.id, { onDelete: "cascade" }),
});

export const pets = pgTable(
    "pets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: varchar("name", { length: 100 }).notNull(),
        breedId: integer("breed_id")
            .notNull()
            .references(() => breeds.id, { onDelete: "restrict" }),
        breedSpecification: text("breed_specification").notNull(),
        ownerId: uuid("owner_id").references(() => users.id, {
            onDelete: "set null",
        }),
        gender: petGender("gender").default("unknown").notNull(),
        color: text(),
        distinguishingMarks: jsonb().$type<string[]>().default([]),
        monthOfBirth: integer("month_of_birth"),
        dateOfBirth: date("date_of_birth").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        diet: jsonb().$type<string[]>().default([]),
        allergies: jsonb().$type<string[]>().default([]),
        weight: decimal("weight", { precision: 5, scale: 2, mode: "number" }),
        height: decimal("height", { precision: 5, scale: 2, mode: "number" }),
        life: lifeStatusEnum().default("alive").notNull(),

        isEstimatedDOB: boolean().default(false),
        isVerified: boolean().default(false),
        isLike: boolean().default(false),
        isMissing: boolean().default(false),

        photoUrl: varchar("photo_url", { length: 255 }),
        reproductiveStatus: reproductiveStatusEnum("reproductive_status")
            .notNull()
            .default("UNKNOWN"),
        ownershipStatus: ownershipStatusEnum("ownership_status")
            .default("UNKNOWN")
            .notNull(),
    },
    (table) => [
        check(
            "valid_reproductive_status",
            sql`(${table.reproductiveStatus} != 'SPAYED' OR ${table.gender} = 'female')
            AND (${table.reproductiveStatus} != 'NEUTERED' OR ${table.gender} = 'male')`
        ),
        // If ownerId is NULL, status CANNOT be 'OWNED'
        check(
            "ownership_consistency",
            sql`(${table.ownerId} IS NOT NULL AND ${table.ownershipStatus} = 'OWNED') 
            OR (${table.ownerId} IS NULL AND ${table.ownershipStatus} != 'OWNED')`
        ),
    ]
);

export type PetTypeModel = InferSelectModel<typeof pets>;
