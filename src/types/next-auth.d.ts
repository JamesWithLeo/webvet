// @/types/next-auth.d.ts
import { type DefaultSession } from "next-auth";
import { role, userGenderValue } from "@/db/schema/users";

declare module "next-auth" {
    interface User {
        id: string;
        email: string | null;
        emailVerified: Date | (Date & string) | null;
        role: (typeof role.enumValues)[number];
        firstName?: string | null;
        lastName?: string | null;
        gender?: (typeof userGenderValue.enumValues)[number] | null;
        dateOfBirth?: string | null;
        photoUrl?: string | null;
        accessToken?: string | null; // Allow null here too
        image: string | null;
    }

    interface Session {
        user: {
            id: string;
            email?: string | null;
            emailVerified: Date | (Date & string) | null;
            role: (typeof role.enumValues)[number];
            firstName?: string | null;
            lastName?: string | null;
            gender?: (typeof userGenderValue.enumValues)[number] | null;
            dateOfBirth?: string | null;
            photoUrl?: string | null;
            accessToken?: string | null;
            image: string | null;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string | null;
        emailVerified: Date | (Date & string) | null;
        role: (typeof role.enumValues)[number];
        firstName?: string | null;
        lastName?: string | null;
        gender?: (typeof userGenderValue.enumValues)[number] | null;
        dateOfBirth?: string | null;
        photoUrl?: string | null;
        accessToken?: string | null;
        image: string | null;
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        id: string;
        email: string | null;
        emailVerified: Date | string | null;
        role: (typeof role.enumValues)[number];
        firstName?: string | null;
        lastName?: string | null;
        gender?: (typeof userGenderValue.enumValues)[number] | null;
        dateOfBirth?: string | null;
        photoUrl?: string | null;
        accessToken?: string | null;
        image: string | null;
    }
}
