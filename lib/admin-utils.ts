import "server-only";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schema";

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ isAdmin: user.isAdmin })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return result[0]?.isAdmin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function makeUserAdmin(email: string): Promise<boolean> {
  try {
    await db.update(user).set({ isAdmin: true }).where(eq(user.email, email));
    console.log(`✅ User ${email} is now an admin`);
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
}
