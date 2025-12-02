import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const client = postgres(process.env.POSTGRES_URL, {
  prepare: false, // Required for pgbouncer in transaction mode
});
export const db = drizzle(client);
