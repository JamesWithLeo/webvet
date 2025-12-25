import type { Account, NextAuthConfig, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserByProvider, getUserByProviderType } from "./lib/db/users";
import { JWT } from "next-auth/jwt";
import { db } from "./db";
import { verificationTokens } from "./db/schema/verificationToken";
import { users } from "./db/schema/users";
import { accounts } from "./db/schema/accounts";
import Nodemailer from "next-auth/providers/nodemailer";
import { render } from "@react-email/render";
import { MagicLinkEmail } from "./components/MagicLinkEmail";
import { createTransport } from "nodemailer";

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET as string,
    adapter: DrizzleAdapter(db, {
        accountsTable: accounts,
        usersTable: users,
        verificationTokensTable: verificationTokens,
    }),
    debug: true,
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
        Nodemailer({
            server: {
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS, // The 16-character App Password
                },
            },
            from: "Joseph and Mary Clinic <ocampojamesleo04@gmail.com>",
            sendVerificationRequest: async ({
                provider,
                url,
                identifier: email,
                token,
            }) => {
                const transport = createTransport(provider.server);
                const baseUrl = "https://cap1-webvet.vercel.app";
                const emailHtml = await render(
                    MagicLinkEmail({ baseUrl, identifier: email, token })
                );
                const response = await transport.sendMail({
                    to: email,
                    from: provider.from,
                    subject: "Sign in to Joseph and Mary Vet Clinic",

                    text: `Sign in to your account: ${url}`,
                    html: emailHtml,
                });
                if (response.rejected.length > 0) {
                    throw new Error(
                        `Email(s) (${response.rejected.join(", ")}) were rejected`
                    );
                }
            },
        }),
        // Resend({
        //     apiKey: process.env.AUTH_RESEND_KEY,
        //     from: "webvet.js.org",
        //     sendVerificationRequest: async ({
        //         expires,
        //         identifier: email,
        //         request,
        //         url,
        //         provider,
        //         theme,
        //         token,
        //     }) => {
        //         const emailHtml = await render(MagicLinkEmail({ url }));
        //         const response = await fetch("https://api.resend.com/emails", {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `Bearer ${provider.apiKey}`,
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({
        //                 from: provider.from,
        //                 to: email,
        //                 subject: "Sign in to Joseph and Mary Vet Clinic",
        //                 html: emailHtml,
        //             }),
        //         });
        //         if (!response.ok) throw new Error("Failed to send magic link");
        //     },
        // }),
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
        async redirect({ baseUrl, url }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
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
        verifyRequest: "/v1/auth/verify-request",
        // todo:
        //error:
        signOut: "/",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
