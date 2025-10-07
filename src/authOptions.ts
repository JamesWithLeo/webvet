import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            // let email: string | undefined = undefined;
            // let googleId: string | undefined = undefined;
            // let facebookId: string | undefined = undefined;
            // let githubId: string | undefined = undefined;
            // let existingUser;
            return true;
            //     googleId = profile.sub; // Google UID
            //     email = profile.email;
            //     existingUser = await db
            //       .select()
            //       .from(users)
            //       .where(eq(users.googleId, googleId));
            //   } else if (account?.provider === "facebook" && profile?.sub) {
            //     facebookId = profile.sub; // Facebook UID
            //     email = profile.email;
            //     console.log("profile:", profile);
            //     existingUser = await db
            //       .select()
            //       .from(users)
            //       .where(eq(users.facebookId, facebookId));
            //   } else if (account?.provider === "github" && profile?.sub) {
            //     githubId = profile.sub; // GitHub UID
            //     email = profile.email;
            //     existingUser = await db
            //       .select()
            //       .from(users)
            //       .where(eq(users.githubId, githubId));
            //   } else {
            //     return false;
            //   }

            //   // create account
            //   if (!existingUser.length) {
            //     await db
            //       .insert(users)
            //       .values({ googleId, githubId, facebookId, email })
            //       .returning();
            //     return true;
            //   } else {
            //     console.log(existingUser);
            //     return true;
            //   }
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, account, user }) {
            //   let dbUser:
            //     | {
            //         id?: string;
            //         firstName?: string | null;
            //         lastName?: string | null;
            //       }
            //     | undefined = undefined;
            //   if (account) {
            //     if (account.provider === "google") {
            //       dbUser = await getUsersByProvider(user.id, "googleId");
            //     } else if (account.provider === "facebook") {
            //       dbUser = await getUsersByProvider(user.id, "facebookId");
            //     }

            //     token.accessToken = account.access_token;
            //     token.id = dbUser?.id;
            //   }
            return token;
        },
        async session({ session, token }) {
            //   session.user.accessToken = token.accessToken;
            //   session.user.id = token.id;
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
