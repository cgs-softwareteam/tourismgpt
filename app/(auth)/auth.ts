import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { getUser } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { authConfig } from "./auth.config";

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  // biome-ignore lint/nursery/useConsistentTypeDefinitions: "Required"
  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
    isAdmin: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return { ...user, type: "regular", isAdmin: user.isAdmin };
      },
    }),
    Credentials({
      id: "guest",
      credentials: {},
      authorize() {
        // No DB row yet — the guest is persisted lazily on their first
        // message (see ensureGuestUser in the chat route). The id generated
        // here lives in the JWT and becomes the User.id if/when persisted.
        const id = generateUUID();
        return { id, email: `guest-${id}`, type: "guest", isAdmin: false };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-in (Google or Facebook)
      if ((account?.provider === "google" || account?.provider === "facebook") && user.email) {
        const existingUsers = await getUser(user.email);

        if (existingUsers.length === 0) {
          // Create new user for OAuth (no password needed)
          const { drizzle } = await import("drizzle-orm/postgres-js");
          const postgres = (await import("postgres")).default;
          const { user: userTable } = await import("@/lib/db/schema");

          const client = postgres(process.env.POSTGRES_URL!, {
            prepare: false, // Required for pgbouncer in transaction mode
          });
          const db = drizzle(client);

          try {
            await db.insert(userTable).values({
              email: user.email,
              password: null  // OAuth users don't have a password
            });
            console.log("Created new OAuth user:", user.email);
          } catch (error) {
            console.error("Error creating OAuth user:", error);
            // Continue anyway - user might already exist due to race condition
          } finally {
            await client.end();
          }
        }
      }
      return true;
    },
    jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id as string;
          // OAuth users (Google/Facebook) are "regular" type
          token.type = (account?.provider === "google" || account?.provider === "facebook") ? "regular" : (user.type || "regular");
          token.isAdmin = user.isAdmin || false;
        }
      } catch (error) {
        console.error("Error in JWT callback:", error);
      }

      return token;
    },
    async session({ session, token }) {
      try {
        console.log("Session callback - session:", session);
        console.log("Session callback - token:", token);

        if (session.user) {
          // Always fetch user from database to ensure correct ID and isAdmin status
          if (session.user.email) {
            console.log("Looking up user by email:", session.user.email);
            const users = await getUser(session.user.email);
            console.log("Found users:", users);
            if (users.length > 0) {
              session.user.id = users[0].id;
              session.user.type = token.type || "regular";
              session.user.isAdmin = users[0].isAdmin;
              console.log("Set session.user.id to:", session.user.id);
              console.log("Set session.user.isAdmin to:", session.user.isAdmin);
            } else {
              console.log("No user found in database for email:", session.user.email);
              // Fallback to token values if user not found in database
              session.user.id = token.id;
              session.user.type = token.type || "regular";
              session.user.isAdmin = token.isAdmin || false;
            }
          } else {
            // Fallback to token values if no email (shouldn't happen)
            console.log("No email in session.user, using token.id:", token.id);
            session.user.id = token.id;
            session.user.type = token.type;
            session.user.isAdmin = token.isAdmin || false;
          }
        }

        console.log("Final session:", session);
        console.log("Final session.user:", session.user);
        console.log("Final session.user.id:", session.user?.id);
        console.log("Final session.user.isAdmin:", session.user?.isAdmin);
      } catch (error) {
        console.error("Error in session callback:", error);
      }

      return session;
    },
  },
});
