import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { openaiUsage, recommendationClick } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json({
      topAttractions,
      topDining,
      openaiUsage: usageSummary[0] || {
        totalCalls: 0,
        totalTokens: 0,
        totalCost: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
