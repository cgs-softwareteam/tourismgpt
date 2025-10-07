import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { isUserAdmin } from "./admin-utils";

export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const isAdmin = await isUserAdmin(session.user.id as string);

  if (!isAdmin) {
    redirect("/"); // Redirect to home if not admin
  }

  return session;
}
