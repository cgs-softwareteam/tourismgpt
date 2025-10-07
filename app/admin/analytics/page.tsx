import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { openaiUsage, recommendationClick } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  // Most clicked attractions
  const topAttractions = await db
    .select({
      name: recommendationClick.recommendationName,
      clicks: sql<number>`count(*)::int`,
      location: recommendationClick.location,
    })
    .from(recommendationClick)
    .where(eq(recommendationClick.category, "attraction"))
    .groupBy(
      recommendationClick.recommendationName,
      recommendationClick.location
    )
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Most clicked dining options
  const topDining = await db
    .select({
      name: recommendationClick.recommendationName,
      clicks: sql<number>`count(*)::int`,
      location: recommendationClick.location,
    })
    .from(recommendationClick)
    .where(eq(recommendationClick.category, "dining"))
    .groupBy(
      recommendationClick.recommendationName,
      recommendationClick.location
    )
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
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Detailed insights into user engagement
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Attractions */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Top Clicked Attractions</h2>
            <p className="text-sm text-muted-foreground">
              Most popular tourist attractions
            </p>
          </div>
          <div className="p-6">
            {analytics.topAttractions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attraction data yet
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topAttractions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {item.clicks} clicks
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Dining */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Top Dining Options</h2>
            <p className="text-sm text-muted-foreground">
              Most popular restaurants & cafes
            </p>
          </div>
          <div className="p-6">
            {analytics.topDining.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No dining data yet
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topDining.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
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
      <div className="mt-6 rounded-lg border bg-card">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">OpenAI Usage</h2>
          <p className="text-sm text-muted-foreground">
            API calls, tokens, and costs
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total API Calls
              </p>
              <p className="mt-2 text-3xl font-bold">
                {analytics.openaiUsage.totalCalls}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Tokens Used
              </p>
              <p className="mt-2 text-3xl font-bold">
                {analytics.openaiUsage.totalTokens?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estimated Cost (USD)
              </p>
              <p className="mt-2 text-3xl font-bold">
                ${analytics.openaiUsage.totalCost?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
