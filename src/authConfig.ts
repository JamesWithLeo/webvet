import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import type { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { AdapterUser, AdapterSession } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { verificationTokens } from "./db/schema/verificationToken";
import { users } from "./db/schema/users";
import { accounts } from "./db/schema/accounts";
import Resend from "next-auth/providers/resend";
import { render } from "@react-email/render";
import otp from "./components/emails/otp";
import { getUserById } from "./lib/db/users";
import { refreshAccessToken } from "./lib/refreshAccessToken";
import { createHash, randomInt } from "crypto";
import { and, eq, ne, not } from "drizzle-orm";
import { checkAuthLimit } from "./actions/rateLimit";
import { CredentialsSignin } from "next-auth";

class RateError extends CredentialsSignin {
    code = "RATE_LIMIT_EXCEEDED";
}
class ExpiredError extends CredentialsSignin {
    code = "PIN_EXPIRED";
}
class WrongPinError extends CredentialsSignin {
    code = "WRONG_PIN";
}

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
                    scope: "openid email profile https://www.googleapis.com/auth/calendar.events.owned",
                    access_type: "offline", // Essential to get a refresh_token
                    prompt: "consent ",
                },
            },
            checks: ["pkce", "state"],
            allowDangerousEmailAccountLinking: true,
        }),

        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: "Joseph and Mary Clinic <auth@updates.josephmary.me>",

            maxAge: 5 * 60,
            generateVerificationToken: () => {
                return randomInt(100_000, 999_999).toString();
            },
            sendVerificationRequest: async ({
                expires,
                identifier: email,
                request,
                url,
                provider,
                theme,
                token,
            }) => {
                const emailHtml = await render(
                    otp({
                        name: email.split("@")[0],
                        otp: token,
                    })
                );

                const response = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to: email,
                        subject: `Sign in to Joseph and Mary Vet Clinic`,
                        html: emailHtml,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Resend API Error:", errorData);
                    throw new Error(
                        `Resend error: ${JSON.stringify(errorData)}`
                    );
                }
            },
        }),

        CredentialsProvider({
            id: "otp-verify",
            name: "OTP Verification",
            credentials: {
                email: { label: "Email", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.otp) return null;
                const email = credentials?.email as string;
                const otp = credentials?.otp as string;

                const limit = await checkAuthLimit(email);
                if (!limit.success) {
                    throw new RateError();
                }

                const hashedToken = createHash("sha256")
                    .update(`${otp}${process.env.NEXTAUTH_SECRET}`)
                    .digest("hex");

                const [verificationToken] = await db
                    .select()
                    .from(verificationTokens)
                    .where(
                        and(
                            eq(verificationTokens.identifier, email),
                            eq(verificationTokens.token, hashedToken)
                        )
                    );

                if (!verificationToken) throw new WrongPinError();

                const now = new Date().getTime();
                const expiry = new Date(verificationToken.expires).getTime();
                if (expiry < now) {
                    await db
                        .delete(verificationTokens)
                        .where(eq(verificationTokens.token, hashedToken));
                    throw new ExpiredError();
                }

                let [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email as string))
                    .limit(1);

                await db
                    .delete(verificationTokens)
                    .where(
                        eq(
                            verificationTokens.identifier,
                            credentials.email as string
                        )
                    );

                return user || null;
            },
        }),
    ],

    callbacks: {
        async redirect({ baseUrl, url }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },

        async jwt({ token, user, account, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.gender = user.gender;
                token.dateOfBirth = user.dateOfBirth;
                token.email = user.email;
                token.emailVerified = user.emailVerified;
                token.photoUrl = user.photoUrl;
                token.image = user.image;
                token.accessToken = account?.access_token;
                token.refreshToken = account?.refresh_token;
                token.expiresAt =
                    account?.expires_at ??
                    Date.now() / 1000 + (account?.expires_in || 3600);
            }
            if (trigger === "update" && session) {
                const [dbUser] = await getUserById(token.id);

                if (dbUser) {
                    token.firstName = dbUser.firstName;
                    token.lastName = dbUser.lastName;
                    token.gender = dbUser.gender;
                    token.dateOfBirth = dbUser.dateOfBirth;
                    token.photoUrl = dbUser.photoUrl;
                }
                return token;
            }

            if (Date.now() < (token.expiresAt as number) * 1000) {
                return token;
            }

            return await refreshAccessToken(token);
        },

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
                session.user.gender = token.gender;
                session.user.dateOfBirth = token.dateOfBirth;
                session.user.emailVerified = token.emailVerified;
                session.user.photoUrl = token.photoUrl;
                session.user.image = token.image;
                session.user.accessToken = token.accessToken as string;
                session.error = token.error;
            }
            return session;
        },
    },

    pages: {
        signIn: "/v1/auth/signup",
        verifyRequest: "/v1/auth/verify-request",
        signOut: "/",
    },

    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
