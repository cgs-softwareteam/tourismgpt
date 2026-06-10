import { config } from "dotenv";
import postgres from "postgres";

config({
  path: ".env.local",
});

/**
 * Deletes "orphan" guest users: rows whose email looks like `guest-...` and
 * that have NO references in any table (no chats, documents, suggestions,
 * recommendation clicks, OpenAI usage, or saved recommendations). These are
 * the empty guests created on every visit. The NOT EXISTS guards make the
 * delete safe against foreign-key violations.
 *
 * Usage:
 *   npx tsx scripts/purge-orphan-guests.ts            # dry run (counts only)
 *   npx tsx scripts/purge-orphan-guests.ts --apply    # actually delete
 */
async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const apply = process.argv.includes("--apply");
  const sql = postgres(process.env.POSTGRES_URL, { prepare: false });

  try {
    const [{ count: orphanCount }] = await sql<{ count: number }[]>`
      SELECT count(*)::int AS count
      FROM "User" u
      WHERE u.email LIKE 'guest-%'
        AND NOT EXISTS (SELECT 1 FROM "Chat" c WHERE c."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Suggestion" s WHERE s."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "RecommendationClick" rc WHERE rc."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "OpenAIUsage" o WHERE o."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "SavedRecommendation" sr WHERE sr."userId" = u.id)
    `;

    console.log(`Found ${orphanCount} orphan guest user(s) with no activity.`);

    if (!apply) {
      console.log("Dry run only — re-run with --apply to delete them.");
      return;
    }

    if (orphanCount === 0) {
      console.log("Nothing to delete.");
      return;
    }

    const deleted = await sql`
      DELETE FROM "User" u
      WHERE u.email LIKE 'guest-%'
        AND NOT EXISTS (SELECT 1 FROM "Chat" c WHERE c."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "Suggestion" s WHERE s."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "RecommendationClick" rc WHERE rc."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "OpenAIUsage" o WHERE o."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "SavedRecommendation" sr WHERE sr."userId" = u.id)
    `;

    console.log(`🗑️  Deleted ${deleted.count} orphan guest user(s).`);
  } finally {
    await sql.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to purge orphan guests:", error);
    process.exit(1);
  });
