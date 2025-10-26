import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByProvider } from "./lib/db/users";

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
            const email = profile?.email;

            const user = await getUserByProvider({
                provider: account?.provider,
                providerId: profile?.sub,
            });
            if (user) return true;

            const newUser = await createUser({
                provider: account?.provider,
                email,
                id: profile?.sub,
            });
            if (newUser) return true;
            return false;
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, account, user: jwtUser, trigger, session }) {
            if (trigger === "update") {
                token.firstName = session.firstName ?? undefined;
                token.lastName = session.lastName ?? undefined;
                token.sex = session.sex ?? "UNKNOWN";
                token.dateOfBirth = session.dateOfBirth ?? undefined;
                return token;
            }

            if (account && jwtUser) {
                const user = await getUserByProvider({
                    provider: account.provider,
                    providerId: jwtUser.id,
                });

                if (user) {
                    token.accessToken = account.access_token;
                    token.firstName = user.firstName ?? undefined;
                    token.lastName = user.lastName ?? undefined;
                    token.id = user.id;
                    token.role = user.role;
                    token.sex = user.sex;
                    token.dateOfBirth = user.dateOfBirth ?? undefined;
                    token.email = user.email;
                    token.photoUrl = user.photoUrl ?? undefined;
                }
                console.log(user);
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.sex = token.sex;
                session.user.dateOfBirth = token.dateOfBirth;
                session.user.email = token.email;
                session.user.photoUrl = token.photoUrl;
                session.user.accessToken = token.accessToken;
            }

            console.log("Session generated:", session);
            return session;
        },
    },
    pages: {
        signIn: "/v1/auth/signup",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
    },
};
