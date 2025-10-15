import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { updateUserRole } from "@/lib/db/queries";

export async function PATCH(request: NextRequest) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the current user is an admin
  if (!session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, isAdmin } = body;

    if (!userId || typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: userId and isAdmin" },
        { status: 400 }
      );
    }

    // Prevent users from removing their own admin status
    if (session.user.id === userId && !isAdmin) {
      return NextResponse.json(
        { error: "Cannot remove your own admin privileges" },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserRole({ userId, isAdmin });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
