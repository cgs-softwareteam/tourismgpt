import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/chat";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // Already authenticated (guest or regular) — go straight to the app
  if (token) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
