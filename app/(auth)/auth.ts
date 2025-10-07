import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { createGuestUser, getUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession["user"];
  }

  // biome-ignore lint/nursery/useConsistentTypeDefinitions: "Required"
  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
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

        return { ...user, type: "regular" };
      },
    }),
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest" };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && user.email) {
        const existingUsers = await getUser(user.email);

        if (existingUsers.length === 0) {
          // Create new user for Google OAuth (no password needed)
          const { drizzle } = await import("drizzle-orm/postgres-js");
          const postgres = (await import("postgres")).default;
          const { user: userTable } = await import("@/lib/db/schema");

          const client = postgres(process.env.POSTGRES_URL!);
          const db = drizzle(client);

          await db.insert(userTable).values({
            email: user.email,
            password: null  // Google OAuth users don't have a password
          });
        }
      }
      return true;
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        // Google OAuth users are "regular" type
        token.type = account?.provider === "google" ? "regular" : (user.type || "regular");
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;

        // For Google OAuth users, fetch their user ID from database
        if (!token.id && session.user.email) {
          const users = await getUser(session.user.email);
          if (users.length > 0) {
            session.user.id = users[0].id;
          }
        }
      }

      return session;
    },
  },
});
