import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { openaiUsage } from "../lib/db/schema";

config({
  path: ".env.local",
});

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const client = postgres(process.env.POSTGRES_URL);
  const db = drizzle(client);

  const usage = await db.select().from(openaiUsage).limit(10);

  console.log("OpenAI Usage Records:");
  console.log("====================");

  usage.forEach((record, idx) => {
    console.log(`\nRecord ${idx + 1}:`);
    console.log(`  Model: ${record.model}`);
    console.log(`  Prompt Tokens: ${record.promptTokens}`);
    console.log(`  Completion Tokens: ${record.completionTokens}`);
    console.log(`  Total Tokens: ${record.totalTokens}`);
    console.log(`  Estimated Cost: $${record.estimatedCost}`);
    console.log(`  Cost Type: ${typeof record.estimatedCost}`);
  });

  await client.end();
}

main();
