import { db } from "@/db";
import { users } from "@/db/schema/users";
import { and, eq } from "drizzle-orm";

export const CheckExistingUserByEmail = async ({
    email,
}: {
    email: string | undefined;
}) => {
    if (email)
        return await db.select().from(users).where(eq(users.email, email));
};

export const GetUserByProvider = async ({
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

export const CreateUser = async ({
    googleId,
    githubId,
    facebookId,
    email,
    provider,
}: {
    googleId: string | undefined;
    githubId: string | undefined;
    facebookId: string | undefined;
    email: string | undefined;
    provider: string | undefined;
}) => {
    if (!provider || !email) return;
    let conditions;

    if (provider === "google") {
        conditions = { googleId: googleId, email };
    } else if (provider === "facebook") {
        conditions = { facebookId: facebookId, email };
    } else if (provider === "github") {
        conditions = { githubId: githubId, email };
    } else {
        return;
    }

    return await db
        .insert(users)
        .values(conditions)
        .returning()
        .then((result) => result[0]);
};
