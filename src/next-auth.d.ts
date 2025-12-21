import { type DefaultSession } from "next-auth";
import { role, sexValues } from "@/db/schema/users";
import { AdapterUser as BaseAdapterUser } from "@auth/core/adapters";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        email: string | null;
        image?: string;
        id: string;
        role: (typeof role.enumValues)[number];
        firstName?: string;
        lastName?: string;
        sex: (typeof sexValues)[number];
        dateOfBirth?: string;
        accessToken?: string;
        photoUrl?: string;
    }
    interface Session {
        user: {
            email: string | null;
            image?: string;
            id: string;
            role: (typeof role.enumvalues)[number];
            firstname?: string;
            lastname?: string;
            sex: (typeof sexvalues)[number];
            dateofbirth?: string;
            accesstoken?: string;
            photourl?: string;
        } & DefaultSession["user"]; // Keeps default fields
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email: string | null;
        id: string;
        accessToken?: string;
        image?: string;
        role: (typeof role.enumValues)[number];
        firstName?: string;
        lastName?: string;
        sex: (typeof sexValues)[number];
        dateOfBirth?: string;
        photoUrl?: string;
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        email: string | null;
        image?: string;
        id: string;
        role: (typeof role.enumValues)[number];
        firstName?: string;
        lastName?: string;
        sex: (typeof sexValues)[number];
        dateOfBirth?: string;
        accessToken?: string;
        photoUrl?: string;
    }
}
