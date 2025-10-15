"use server";

import { auth } from "@/app/(auth)/auth";
import { getUser, deleteMessagesByChatIdAfterTimestamp } from "@/lib/db/queries";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();

  if (!session || !session.user?.email) {
    return null;
  }

  try {
    const users = await getUser(session.user.email);
    if (users.length > 0) {
      return users[0].id;
    }
  } catch (error) {
    console.error("Error getting user ID:", error);
  }

  return null;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteMessagesByChatIdAfterTimestamp({
      chatId: id,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error deleting trailing messages:", error);
    throw error;
  }
}
