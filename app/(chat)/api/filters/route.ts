import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { preferenceFilter } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filters = await db
      .select()
      .from(preferenceFilter)
      .where(eq(preferenceFilter.isActive, true))
      .orderBy(asc(preferenceFilter.orderIndex));

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
