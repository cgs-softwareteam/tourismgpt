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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/20 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10 relative z-10 shadow-xl">
        <div className="p-6 border-b border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">🌍</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TourismGPT</h1>
          </div>
          <p className="text-sm font-semibold text-foreground/70">Admin Dashboard</p>
        </div>

        <nav className="space-y-2 px-3 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md hover:scale-105 group"
          >
            <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-primary transition-colors">Dashboard</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10 hover:shadow-md hover:scale-105 group"
          >
            <BarChart3 className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-secondary transition-colors">Analytics</span>
          </Link>

          <Link
            href="/admin/filters"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:shadow-md hover:scale-105 group"
          >
            <Filter className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-accent transition-colors">Filters</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-chart-4/10 hover:to-chart-5/10 hover:shadow-md hover:scale-105 group"
          >
            <Users className="h-5 w-5 text-chart-4 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-chart-4 transition-colors">Users</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-primary/10 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <Link
            href="/"
            className="text-sm text-foreground/70 hover:text-primary font-medium transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
