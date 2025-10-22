import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
    CheckExistingUserByEmail,
    CreateUser,
    GetUserByProvider,
} from "./lib/db/users";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent select_account",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            let googleId: string | undefined = undefined;
            let facebookId: string | undefined = undefined;
            let githubId: string | undefined = undefined;
            const email = profile?.email;

            CheckExistingUserByEmail({ email });
            const user = await GetUserByProvider({
                provider: account?.provider,
                providerId: profile?.sub,
            });
            if (user) return true;

            const newUser = await CreateUser({
                provider: account?.provider,
                email,
                googleId,
                githubId,
                facebookId,
            });
            if (newUser) return true;
            return false;
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, account, user: jwtUser }) {
            const user = await GetUserByProvider({
                provider: account?.provider,
                providerId: jwtUser.id,
            });
            if (!user) return token;

            token.accessToken = account?.access_token;
            token.firstName = user.firstName ?? undefined;
            token.lastName = user.lastName ?? undefined;
            token.id = user.id;
            token.role = user.role ?? undefined;
            token.sex = user.sex ?? "UNKNOWN";
            token.dateOfbirth = user.dateOfBirth ?? undefined;
            token.email = user.email;
            token.photoUrl = user.photoUrl ?? undefined;

            return token;
        },
        async session({ session, token }) {
            const {
                accessToken,
                id,
                email,
                firstName,
                lastName,
                role,
                sex,
                dateOfBirth,
                photoUrl,
            } = token;
            session.user = {
                accessToken,
                id,
                email,
                firstName,
                lastName,
                role,
                sex,
                dateOfBirth,
                photoUrl,
            };
            return session;
        },
    },
    pages: {
        signIn: "/signup",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
    },
};
