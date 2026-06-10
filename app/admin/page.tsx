import {
  Activity,
  DollarSign,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import { count, eq, like, notLike, sql } from "drizzle-orm";
import { StatsCard } from "@/components/admin/stats-card";
import { db } from "@/lib/db";
import { chat, openaiUsage, recommendationClick, user } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getStats() {
  // Registered users only (exclude auto-generated guest accounts)
  const totalUsers = await db
    .select({ count: count() })
    .from(user)
    .where(notLike(user.email, "guest-%"));

  // Guest users that actually started at least one conversation.
  // A new guest row is created on every visit, so we only count guests
  // who have at least one chat (deduplicated by user id).
  const guestUsers = await db
    .select({ count: sql<number>`count(distinct ${user.id})::int` })
    .from(user)
    .innerJoin(chat, eq(chat.userId, user.id))
    .where(like(user.email, "guest-%"));

  // Total chats
  const totalChats = await db.select({ count: count() }).from(chat);

  // Total recommendation clicks
  const totalClicks = await db
    .select({ count: count() })
    .from(recommendationClick);

  // OpenAI usage stats
  const aiUsage = await db
    .select({
      totalCalls: sql<number>`count(*)::int`,
      totalTokens: sql<number>`sum(${openaiUsage.totalTokens})::int`,
      totalCost: sql<number>`sum(${openaiUsage.estimatedCost})::float`,
    })
    .from(openaiUsage);

  return {
    totalUsers: totalUsers[0]?.count || 0,
    guestUsers: guestUsers[0]?.count || 0,
    totalChats: totalChats[0]?.count || 0,
    totalClicks: totalClicks[0]?.count || 0,
    aiUsage: aiUsage[0] || { totalCalls: 0, totalTokens: 0, totalCost: 0 },
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Dashboard</h1>
        <p className="mt-2 text-base text-foreground/70">
          Overview of your tourism platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
        />

        <StatsCard
          title="Guest Users"
          value={stats.guestUsers}
          icon={UserPlus}
          description="Guests with a conversation"
        />

        <StatsCard
          title="Total Chats"
          value={stats.totalChats}
          icon={MessageSquare}
          description="Conversations"
        />

        <StatsCard
          title="Recommendation Clicks"
          value={stats.totalClicks}
          icon={Activity}
          description="User engagement"
        />

        <StatsCard
          title="OpenAI Cost"
          value={`$${stats.aiUsage.totalCost?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          description={`${stats.aiUsage.totalCalls} API calls`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 p-6 shadow-lg">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <a
              href="/admin/analytics"
              className="block rounded-lg border-2 border-secondary/20 p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10 hover:shadow-md hover:scale-105 hover:border-secondary/40"
            >
              <p className="font-semibold text-base">View Detailed Analytics</p>
              <p className="text-sm text-foreground/60">
                See top attractions, dining options, and usage trends
              </p>
            </a>
            <a
              href="/admin/filters"
              className="block rounded-lg border-2 border-accent/20 p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:shadow-md hover:scale-105 hover:border-accent/40"
            >
              <p className="font-semibold text-base">Manage Filters</p>
              <p className="text-sm text-foreground/60">
                Add, edit, or remove preference filters
              </p>
            </a>
            <a
              href="/admin/users"
              className="block rounded-lg border-2 border-chart-4/20 p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-chart-4/10 hover:to-chart-5/10 hover:shadow-md hover:scale-105 hover:border-chart-4/40"
            >
              <p className="font-semibold text-base">User Management</p>
              <p className="text-sm text-foreground/60">
                View and manage registered users
              </p>
            </a>
          </div>
        </div>

        <div className="rounded-xl border-2 border-secondary/20 bg-gradient-to-br from-white via-purple-50/30 to-teal-50/30 dark:from-slate-800 dark:via-purple-900/10 dark:to-teal-900/10 p-6 shadow-lg">
          <h2 className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">OpenAI Usage</h2>
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-primary/20">
              <p className="text-sm font-semibold text-foreground/70">Total API Calls</p>
              <p className="text-3xl font-bold text-primary mt-1">{stats.aiUsage.totalCalls}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-secondary/20">
              <p className="text-sm font-semibold text-foreground/70">Total Tokens</p>
              <p className="text-3xl font-bold text-secondary mt-1">
                {stats.aiUsage.totalTokens?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-accent/20">
              <p className="text-sm font-semibold text-foreground/70">Estimated Cost</p>
              <p className="text-3xl font-bold text-accent mt-1">
                ${stats.aiUsage.totalCost?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
