import { sexEnum } from "@/db/schema/pets";
import { role } from "@/db/schema/users";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string;
            email?: string;
            image?: string;
            id?: string;
            role?: (typeof role.enumValues)[number];
            firstName?: string;
            lastName?: string;
            sex?: (typeof sexEnum.enumValues)[number];
            dateOfBirth?: string;
            accessToken?: string;
        } & DefaultSession["user"]; // Keeps default fields
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
    }
}
