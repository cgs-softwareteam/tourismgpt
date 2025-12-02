import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { openaiUsage, recommendationClick } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  // Most clicked attractions - group by name only to avoid duplicates
  const topAttractions = await db
    .select({
      name: recommendationClick.recommendationName,
      clicks: sql<number>`count(*)::int`,
      locations: sql<string>`string_agg(DISTINCT CASE WHEN ${recommendationClick.location} NOT IN ('the location', 'Unknown') THEN ${recommendationClick.location} END, ', ')`,
    })
    .from(recommendationClick)
    .where(eq(recommendationClick.category, "attraction"))
    .groupBy(recommendationClick.recommendationName)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Most clicked dining options - group by name only to avoid duplicates
  const topDining = await db
    .select({
      name: recommendationClick.recommendationName,
      clicks: sql<number>`count(*)::int`,
      locations: sql<string>`string_agg(DISTINCT CASE WHEN ${recommendationClick.location} NOT IN ('the location', 'Unknown') THEN ${recommendationClick.location} END, ', ')`,
    })
    .from(recommendationClick)
    .where(eq(recommendationClick.category, "dining"))
    .groupBy(recommendationClick.recommendationName)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // OpenAI usage summary
  const usageSummary = await db
    .select({
      totalCalls: sql<number>`count(*)::int`,
      totalTokens: sql<number>`sum(${openaiUsage.totalTokens})::int`,
      totalCost: sql<number>`sum(${openaiUsage.estimatedCost})::float`,
    })
    .from(openaiUsage);

  return {
    topAttractions,
    topDining,
    openaiUsage: usageSummary[0] || {
      totalCalls: 0,
      totalTokens: 0,
      totalCost: 0,
    },
  };
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Analytics</h1>
        <p className="mt-2 text-base text-foreground/70">
          Detailed insights into user engagement
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Attractions */}
        <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 shadow-lg">
          <div className="border-b border-primary/20 p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Top Clicked Attractions</h2>
                <p className="text-sm text-foreground/60">
                  Most popular tourist attractions
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {analytics.topAttractions.length === 0 ? (
              <p className="text-sm text-foreground/60">
                No attraction data yet
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.topAttractions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-primary/10 hover:shadow-md hover:scale-102 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 font-bold text-primary text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base">{item.name}</p>
                        {item.locations && item.locations.trim() && (
                          <p className="text-sm text-foreground/60">
                            📍 {item.locations}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-sm font-bold text-white shadow-md">
                      {item.clicks} clicks
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Dining */}
        <div className="rounded-xl border-2 border-secondary/20 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800 dark:via-purple-900/10 dark:to-pink-900/10 shadow-lg">
          <div className="border-b border-secondary/20 p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Top Dining Options</h2>
                <p className="text-sm text-foreground/60">
                  Most popular restaurants & cafes
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {analytics.topDining.length === 0 ? (
              <p className="text-sm text-foreground/60">
                No dining data yet
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.topDining.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-secondary/10 hover:shadow-md hover:scale-102 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 font-bold text-secondary text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base">{item.name}</p>
                        {item.locations && item.locations.trim() && (
                          <p className="text-sm text-foreground/60">
                            📍 {item.locations}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-secondary to-accent px-4 py-1.5 text-sm font-bold text-white shadow-md">
                      {item.clicks} clicks
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OpenAI Usage */}
      <div className="mt-6 rounded-xl border-2 border-accent/20 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/30 dark:from-slate-800 dark:via-teal-900/10 dark:to-blue-900/10 shadow-lg">
        <div className="border-b border-accent/20 p-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">OpenAI Usage</h2>
              <p className="text-sm text-foreground/60">
                API calls, tokens, and costs
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-foreground/70">
                Total API Calls
              </p>
              <p className="mt-2 text-4xl font-bold text-primary">
                {analytics.openaiUsage.totalCalls}
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/20 hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-foreground/70">
                Total Tokens Used
              </p>
              <p className="mt-2 text-4xl font-bold text-secondary">
                {analytics.openaiUsage.totalTokens?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20 hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-semibold text-foreground/70">
                Estimated Cost (USD)
              </p>
              <p className="mt-2 text-4xl font-bold text-accent">
                ${analytics.openaiUsage.totalCost?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
