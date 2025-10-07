import { config } from "dotenv";
import { eq } from "drizzle-orm";
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

  console.log("🔄 Recalculating OpenAI usage costs...\n");

  const records = await db.select().from(openaiUsage);

  for (const record of records) {
    const { id, promptTokens, completionTokens, totalTokens } = record;

    let estimatedCost = 0;

    if (promptTokens > 0 || completionTokens > 0) {
      // We have breakdown, use it
      const inputCost = (promptTokens / 1_000_000) * 2.5;
      const outputCost = (completionTokens / 1_000_000) * 10;
      estimatedCost = inputCost + outputCost;
    } else if (totalTokens > 0) {
      // No breakdown available, estimate with typical split (30% input, 70% output)
      const estimatedInput = totalTokens * 0.3;
      const estimatedOutput = totalTokens * 0.7;
      const inputCost = (estimatedInput / 1_000_000) * 2.5;
      const outputCost = (estimatedOutput / 1_000_000) * 10;
      estimatedCost = inputCost + outputCost;
    }

    await db
      .update(openaiUsage)
      .set({ estimatedCost })
      .where(eq(openaiUsage.id, id));

    console.log(
      `✅ Updated record ${id}: ${totalTokens} tokens → $${estimatedCost.toFixed(4)}`
    );
  }

  console.log(`\n✅ Updated ${records.length} records`);

  await client.end();
}

main();
