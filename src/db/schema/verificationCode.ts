import {
    text,
    pgTable,
    timestamp,
    primaryKey,
    serial,
} from "drizzle-orm/pg-core";

export const verificationCodes = pgTable(
    "verification_codes",
    {
        id: serial("id").primaryKey(),
        email: text("email").notNull(),
        code: text("code").notNull(), // The 6-digit OTP
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (verificationCodes) => [
        {
            compositePk: primaryKey({
                columns: [verificationCodes.email, verificationCodes.code],
            }),
        },
    ]
);
