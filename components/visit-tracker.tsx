"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fires a lightweight beacon on every page load / client-side navigation so
 * each visit is recorded in the database (powers the admin "Visitors" card).
 * Admin pages are excluded so internal dashboard browsing isn't counted.
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Tracking is best-effort; ignore failures.
    });
  }, [pathname]);

  return null;
}
