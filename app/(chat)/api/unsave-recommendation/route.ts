import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { unsaveRecommendation } from "@/lib/db/queries";

export async function DELETE(request: NextRequest) {
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

    const deleted = await unsaveRecommendation({
      userId: session.user.id,
      recommendationName,
      location,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recommendation unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving recommendation:", error);
    return NextResponse.json(
      { error: "Failed to unsave recommendation" },
      { status: 500 }
    );
  }
}
