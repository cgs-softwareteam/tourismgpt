import { BarChart3, Filter, Home, Users } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TourismGPT Admin</h1>
          <p className="text-sm text-muted-foreground">Management Dashboard</p>
        </div>

        <nav className="space-y-1 px-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>

          <Link
            href="/admin/filters"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 border-t p-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
