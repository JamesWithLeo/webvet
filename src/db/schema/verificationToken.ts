import {
    text,
    pgTable,
    timestamp,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", {
            mode: "date",
            withTimezone: true,
        }).notNull(),
        attempts: integer("attempts").default(0).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [
                    verificationToken.identifier,
                    verificationToken.token,
                ],
            }),
        },
    ]
);
