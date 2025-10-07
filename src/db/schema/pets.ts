import {
    pgTable,
    check,
    varchar,
    integer,
    uuid,
    timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pets = pgTable(
    "pets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: varchar("name", { length: 100 }).notNull(),
        age: integer("age").notNull(),
        created_at: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        check("age_check", sql`${table.age} >= 0 AND ${table.age} <= 100`),
    ]
);
