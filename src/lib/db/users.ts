import { db } from "@/db";
import { sexValues, users } from "@/db/schema/users";
import { and, eq } from "drizzle-orm";
import { string } from "zod";
import isUser from "../isUser";

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
    providerId: string | undefined | null;
}) => {
    if (!providerId || !provider) return;

    const conditions = [];
    if (provider === "email") {
        console.log("resend!");
        return;
    } else if (provider === "google") {
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
const getUserEmail = async (email: string) => {
    return await db.select().from(users).where(eq(users.email, email));
};
export const getUserByProviderType = async ({
    providerType,
    email,
}: {
    providerType:
        | "oidc"
        | "oauth"
        | "email"
        | "credentials"
        | "webauthn"
        | undefined;
    email: string | null | undefined;
}) => {
    switch (providerType) {
        case "oidc":
            // google
            break;
        case "oauth":
            return;
        case "email":
            if (!email) return;
            const user = await getUserEmail(email);

            if (Array.isArray(user) && user.length && isUser(user[0])) {
                // user existed
                console.log("Acount existing!");
                console.log(user[0]);
            } else {
                // create user
                console.log("Account doesn't exist!");
                console.log("is user type:", isUser(user[0]));
            }
            break;
        case "credentials":
            return;
        default:
            return;
    }
};

export const createUser = async ({
    email,
    provider,
    id,
}: {
    email: string | undefined | null;
    provider: string | undefined;
    id: string | undefined | null;
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
