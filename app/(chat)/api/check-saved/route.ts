import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { isRecommendationSaved } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const recommendationName = searchParams.get("name");
    const location = searchParams.get("location");

    if (!recommendationName || !location) {
      return NextResponse.json(
        { error: "Recommendation name and location are required" },
        { status: 400 }
      );
    }

    const isSaved = await isRecommendationSaved({
      userId: session.user.id,
      recommendationName,
      location,
    });

    return NextResponse.json({ isSaved });
  } catch (error) {
    console.error("Error checking saved status:", error);
    return NextResponse.json(
      { error: "Failed to check saved status" },
      { status: 500 }
    );
  }
}
