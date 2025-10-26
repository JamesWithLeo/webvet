import { role, sexValues } from "@/db/schema/users";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            email?: string;
            image?: string;
            id: string;
            role: (typeof role.enumValues)[number];
            firstName?: string;
            lastName?: string;
            sex: (typeof sexValues)[number];
            dateOfBirth?: string;
            accessToken?: string;
            photoUrl?: string;
        } & DefaultSession["user"]; // Keeps default fields
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email?: string;
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
