import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { isUserAdmin } from "@/lib/admin-utils";
import { db } from "@/lib/db";
import { preferenceFilter } from "@/lib/db/schema";
import { generateUUID } from "@/lib/utils";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const filters = await db
      .select()
      .from(preferenceFilter)
      .orderBy(preferenceFilter.orderIndex);

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { label, icon, value, orderIndex, isActive } = body;

    // Validate required fields
    if (!label || !value) {
      return NextResponse.json(
        { error: "Label and value are required" },
        { status: 400 }
      );
    }

    // Check if value already exists
    const existingFilter = await db
      .select()
      .from(preferenceFilter)
      .where(eq(preferenceFilter.value, value))
      .limit(1);

    if (existingFilter.length > 0) {
      return NextResponse.json(
        { error: "Filter with this value already exists" },
        { status: 400 }
      );
    }

    const newFilter = await db
      .insert(preferenceFilter)
      .values({
        id: generateUUID(),
        label,
        icon: icon || "🏷️",
        value,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ filter: newFilter[0] });
  } catch (error) {
    console.error("Error creating filter:", error);
    return NextResponse.json(
      { error: "Failed to create filter" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, label, icon, value, orderIndex, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Filter ID is required" },
        { status: 400 }
      );
    }

    // Check if value already exists for a different filter
    if (value) {
      const existingFilter = await db
        .select()
        .from(preferenceFilter)
        .where(eq(preferenceFilter.value, value))
        .limit(1);

      if (existingFilter.length > 0 && existingFilter[0].id !== id) {
        return NextResponse.json(
          { error: "Filter with this value already exists" },
          { status: 400 }
        );
      }
    }

    const updatedFilter = await db
      .update(preferenceFilter)
      .set({
        ...(label && { label }),
        ...(icon && { icon }),
        ...(value && { value }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(preferenceFilter.id, id))
      .returning();

    if (updatedFilter.length === 0) {
      return NextResponse.json(
        { error: "Filter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ filter: updatedFilter[0] });
  } catch (error) {
    console.error("Error updating filter:", error);
    return NextResponse.json(
      { error: "Failed to update filter" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Filter ID is required" },
        { status: 400 }
      );
    }

    const deletedFilter = await db
      .delete(preferenceFilter)
      .where(eq(preferenceFilter.id, id))
      .returning();

    if (deletedFilter.length === 0) {
      return NextResponse.json(
        { error: "Filter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting filter:", error);
    return NextResponse.json(
      { error: "Failed to delete filter" },
      { status: 500 }
    );
  }
}
