import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";

export async function requireAdmin() {
  const session = await auth();

  console.log("requireAdmin - session:", session);
  console.log("requireAdmin - session.user:", session?.user);
  console.log("requireAdmin - session.user.isAdmin:", session?.user?.isAdmin);

  if (!session || !session.user?.id) {
    console.log("No session or user ID, redirecting to login");
    redirect("/login");
  }

  // Use isAdmin from session (fetched from DB in session callback)
  if (!session.user.isAdmin) {
    console.log("User is not admin, redirecting to chat");
    redirect("/chat"); // Redirect to chat if not admin
  }

  console.log("User is admin, allowing access");
  return session;
}
