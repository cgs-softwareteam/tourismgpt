import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getSavedRecommendations } from "@/lib/db/queries";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const savedRecommendations = await getSavedRecommendations(session.user.id);
    return NextResponse.json({ savedRecommendations });
  } catch (error) {
    console.error("Error fetching saved recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recommendations" },
      { status: 500 }
    );
  }
}
