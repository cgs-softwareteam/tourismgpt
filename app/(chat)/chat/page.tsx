import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { auth } from "../../(auth)/auth";
import { getCurrentUserId } from "../actions";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Get user ID using server action
  const userId = (await getCurrentUserId()) ?? undefined;

  const id = generateUUID();

  // Initial welcome message asking for location
  const initialMessages = [
    {
      id: generateUUID(),
      role: "assistant" as const,
      parts: [
        {
          type: "text" as const,
          text: "🌍 Welcome to TourismSpot GPT!\n\nI'm your AI-powered travel companion, ready to help you discover amazing destinations around the world. Whether you're planning your next vacation, looking for hidden gems, or need personalized recommendations, I'm here to help!\n\n**Here's what I can do for you:**\n- 📍 Provide detailed information about any city or destination\n- 🎯 Suggest tourist attractions, restaurants, and activities based on your preferences\n- 🗺️ Create personalized itineraries tailored to your interests\n- 💡 Share insider tips and local insights\n- 🏨 Recommend accommodations and dining options\n\n**To get started, simply:**\n- Type a city or destination name (e.g., \"Paris\", \"Bali\", \"New York\")",
        },
      ],
    },
  ];

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          autoResume={false}
          id={id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={initialMessages}
          isReadonly={false}
          userId={userId}
          key={id}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie.value}
        initialMessages={initialMessages}
        isReadonly={false}
        userId={userId}
        key={id}
      />
      <DataStreamHandler />
    </>
  );
}
