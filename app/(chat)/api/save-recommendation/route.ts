import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { saveRecommendation } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      chatId,
      recommendationName,
      category,
      location,
      description,
      price,
      rating,
      hours,
      address,
      bestFor,
      tips,
    } = body;

    if (!chatId || !recommendationName || !category || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const saved = await saveRecommendation({
      userId: session.user.id,
      chatId,
      recommendationName,
      category,
      location,
      description,
      price,
      rating,
      hours,
      address,
      bestFor,
      tips,
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    console.error("Error saving recommendation:", error);
    return NextResponse.json(
      { error: "Failed to save recommendation" },
      { status: 500 }
    );
  }
}
