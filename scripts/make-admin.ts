import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from "../lib/db/schema";

config({
  path: ".env.local",
});

async function makeUserAdmin(email: string) {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const client = postgres(process.env.POSTGRES_URL);
  const db = drizzle(client);

  try {
    await db.update(user).set({ isAdmin: true }).where(eq(user.email, email));
    console.log(`✅ User ${email} is now an admin`);
    await client.end();
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    await client.end();
    return false;
  }
}

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <user-email>");
    process.exit(1);
  }

  await makeUserAdmin(email);
  process.exit(0);
}

main();
