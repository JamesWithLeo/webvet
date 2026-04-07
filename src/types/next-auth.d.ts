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
        gender: (typeof userGenderValue)[number];
        contactNumber: string | null;
        dateOfBirth?: string | null;
        photoUrl?: string | null;
        accessToken?: string | null;
        image: string | null;
    }

    interface Session {
        error?: "RefreshAccessTokenError";
        user: {
            id: string;
            email?: string | null;
            emailVerified: Date | (Date & string) | null;
            role: (typeof role.enumValues)[number];
            firstName?: string | null;
            lastName?: string | null;
            gender: (typeof userGenderValue)[number];
            dateOfBirth?: string | null;
            photoUrl?: string | null;
            accessToken?: string | null;
            image: string | null;
            contactNumber: string | null;
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
        gender: (typeof userGenderValue)[number];
        dateOfBirth?: string | null;
        photoUrl?: string | null;
        image: string | null;
        accessToken?: string | null;
        refreshToken?: string | null;
        contactNumber: string | null;
        error?: "RefreshAccessTokenError";
        expiresAt: number;
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
        gender: (typeof userGenderValue)[number];
        dateOfBirth?: string | null;
        contactNumber: string | null;
        photoUrl?: string | null;
        accessToken?: string | null;
        image: string | null;
    }
}
