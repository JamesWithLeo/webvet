import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import type { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { AdapterUser, AdapterSession } from "next-auth/adapters";
import { verificationTokens } from "./db/schema/verificationToken";
import { users } from "./db/schema/users";
import { accounts } from "./db/schema/accounts";
import Nodemailer from "next-auth/providers/nodemailer";
import { render } from "@react-email/render";
import { MagicLinkEmail } from "./components/MagicLinkEmail";
import { createTransport } from "nodemailer";

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET as string,

    // drizzle will handle the signIn
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
            allowDangerousEmailAccountLinking: true,
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
    ],

    callbacks: {
        async redirect({ baseUrl, url }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.sex = user.sex;
                token.dateOfBirth = user.dateOfBirth;
                token.email = user.email;
                token.emailVerified = user.emailVerified;
                token.photoUrl = user.photoUrl;
                token.image = user.image;
            }
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }
            return token;
        },

        // async session({ session, token }) {
        async session({
            session,
            token,
        }: {
            session: {
                user: AdapterUser;
            } & AdapterSession &
                Session;
            token: JWT;
        }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.sex = token.sex;
                session.user.dateOfBirth = token.dateOfBirth;
                session.user.emailVerified = token.emailVerified;
                session.user.photoUrl = token.photoUrl;
                session.user.image = token.image;
            }
            return session;
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
