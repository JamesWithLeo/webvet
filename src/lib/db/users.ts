import { db } from "@/db";
import { sexValues, users } from "@/db/schema/users";
import { and, eq } from "drizzle-orm";
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
    providerId,
    email,
}: {
    providerType:
        | "oidc"
        | "oauth"
        | "email"
        | "credentials"
        | "webauthn"
        | undefined;
    providerId: string | undefined;
    email: string | null | undefined;
}) => {
    switch (providerType) {
        case "oidc":
            // google
            return;
        case "oauth":
            return;
        case "email":
            if (!email) return false;
            const user = await getUserEmail(email);

            if (Array.isArray(user) && user.length && isUser(user[0])) {
                console.log("Acount existing!");
                console.log(user[0]);
                return user[0];
            } else {
                console.log("Account doesn't exist!");
                console.log("is user type:", isUser(user[0]));
                return;
            }
        case "credentials":
            return;
        default:
            return;
    }
};

export const saveSetupInDb = async (
    id: string,
    userData: Partial<typeof users.$inferInsert>
) => {
    return await db
        .update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning({
            firstName: users.firstName,
            lastName: users.lastName,
            sex: users.sex,
            dateOfBirth: users.dateOfBirth,
        });
};

export const getUserById = async (id: string) => {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
    // .then((result) => result[0]);
};
