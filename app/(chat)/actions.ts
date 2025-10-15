"use server";

import { cookies } from "next/headers";
import { auth } from "@/app/(auth)/auth";
import {
  getUser,
  deleteMessagesByChatIdAfterTimestamp,
  updateChatVisiblityById
} from "@/lib/db/queries";
import type { ChatMessage } from "@/lib/types";

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

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: ChatMessage;
}): Promise<string> {
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();

  // Return first 100 characters or "New Chat" if empty
  return text.slice(0, 100) || "New Chat";
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "public" | "private";
}) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await updateChatVisiblityById({ chatId, visibility });
  } catch (error) {
    console.error("Error updating chat visibility:", error);
    throw error;
  }
}
