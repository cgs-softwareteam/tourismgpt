import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteVisit } from "@/lib/db/schema";

// Public endpoint — records one row per page load for the "Visitors"
// (total page visits) metric. No auth so anonymous visitors are counted too.
export async function POST(request: NextRequest) {
  try {
    let path: string | null = null;
    try {
      const body = await request.json();
      if (typeof body?.path === "string") {
        path = body.path.slice(0, 1024);
      }
    } catch {
      // No/invalid body is fine — we still record the visit.
    }

    await db.insert(siteVisit).values({ path });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
