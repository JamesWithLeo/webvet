import type { Account, NextAuthConfig, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { AdapterUser } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserByProvider, getUserByProviderType } from "./lib/db/users";
import { JWT } from "next-auth/jwt";
import { db } from "./db";
import { verificationTokens } from "./db/schema/verificationToken";
import { users } from "./db/schema/users";
import { accounts } from "./db/schema/accounts";
import { render } from "@react-email/render";
import { MagicLinkEmail } from "./components/MagicLinkEmail";

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET as string,
    adapter: DrizzleAdapter(db, {
        accountsTable: accounts,
        usersTable: users,
        verificationTokensTable: verificationTokens,
    }),
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
        Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: "onboarding@resend.dev",
            sendVerificationRequest: async ({
                expires,
                identifier: email,
                request,
                url,
                provider,
                theme,
                token,
            }) => {
                const emailHtml = await render(MagicLinkEmail({ url }));
                const response = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${provider.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to: email,
                        subject: "Sign in to Joseph and Mary Vet Clinic",
                        html: emailHtml,
                    }),
                });

                if (!response.ok) throw new Error("Failed to send magic link");
            },
        }),
    ],

    callbacks: {
        async signIn({ account, profile }) {
            const email = profile?.email;
            console.log("Provider type: ", account?.type);

            const user = await getUserByProviderType({
                email: profile?.email,
                providerType: account?.type,
            });
            // const user = await getUserByProvider({
            //     provider: account?.provider,
            //     providerId: profile?.sub,
            // });
            // if (user) return true;

            // const newUser = await createUser({
            //     provider: account?.provider,
            //     email,
            //     id: profile?.sub,
            // });
            // if (newUser) return true;
            return true;
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
        async jwt({
            token,
            account,
            user: jwtUser,
            trigger,
            session,
        }: {
            token: JWT;
            user: User | AdapterUser;
            account?: Account | null;
            profile?: Profile;
            trigger?: "signIn" | "signUp" | "update";
            isNewUser?: boolean;
            session?: any;
        }) {
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
            }

            return token;
        },
        async session({ session, token }) {
            console.log("--> session: ", session);
            return {
                ...session,
                user: {
                    ...session,
                    id: token.id,
                    role: token.role,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    sex: token.sex,
                    dateOfBirth: token.dateOfBirth,
                    email: token.email,
                    photoUrl: token.photoUrl,
                    accessToken: token.accessToken,
                },
            };
        },
    },
    pages: {
        signIn: "/v1/auth/signup",
        // todo
        verifyRequest: "/",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
