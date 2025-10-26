import { db } from "@/db";
import { role, sexValues, users } from "@/db/schema/users";
import { and, eq } from "drizzle-orm";

export const checkExistingUserByEmail = async ({
    email,
}: {
    email: string | undefined;
}) => {
    if (email)
        return await db.select().from(users).where(eq(users.email, email));
};

export const getUserByProvider = async ({
    provider,
    providerId,
}: {
    provider: string | undefined;
    providerId: string | undefined;
}) => {
    if (!providerId || !provider) return;

    const conditions = [];
    if (provider === "google") {
        conditions.push(eq(users.googleId, providerId));
    } else if (provider === "facebook") {
        conditions.push(eq(users.facebookId, providerId));
    } else if (provider === "github") {
        conditions.push(eq(users.githubId, providerId));
    } else {
        return;
    }
    return await db
        .select()
        .from(users)
        .where(and(...conditions))
        .then((result) => result[0]);
};

export const createUser = async ({
    email,
    provider,
    id,
}: {
    email: string | undefined;
    provider: string | undefined;
    id: string | undefined;
}) => {
    if (!provider || !email) return;
    let conditions;

    if (provider === "google") {
        conditions = { googleId: id, email };
    } else if (provider === "facebook") {
        conditions = { facebookId: id, email };
    } else if (provider === "github") {
        conditions = { githubId: id, email };
    } else {
        return;
    }

    return await db
        .insert(users)
        .values(conditions)
        .returning()
        .then((result) => result[0]);
};

export const saveSetupInDb = async ({
    firstName,
    lastName,
    sex,
    dateOfBirth,
    id,
}: {
    firstName: string;
    lastName: string;
    sex: (typeof sexValues)[number];
    dateOfBirth: string;
    id: string;
}) => {
    return await db
        .update(users)
        .set({ firstName, lastName, sex, dateOfBirth })
        .where(eq(users.id, id))
        .returning({
            firstName: users.firstName,
            lastName: users.lastName,
            sex: users.sex,
            dateOfBirth: users.dateOfBirth,
        });
};
