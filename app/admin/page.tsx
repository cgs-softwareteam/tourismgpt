import { Activity, DollarSign, MessageSquare, Users } from "lucide-react";
import { count, sql } from "drizzle-orm";
import { StatsCard } from "@/components/admin/stats-card";
import { db } from "@/lib/db";
import { chat, openaiUsage, recommendationClick, user } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getStats() {
  // Total users
  const totalUsers = await db.select({ count: count() }).from(user);

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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your tourism platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
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
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <a
              href="/admin/analytics"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">View Detailed Analytics</p>
              <p className="text-sm text-muted-foreground">
                See top attractions, dining options, and usage trends
              </p>
            </a>
            <a
              href="/admin/filters"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">Manage Filters</p>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove preference filters
              </p>
            </a>
            <a
              href="/admin/users"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">User Management</p>
              <p className="text-sm text-muted-foreground">
                View and manage registered users
              </p>
            </a>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">OpenAI Usage</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total API Calls</p>
              <p className="text-2xl font-bold">{stats.aiUsage.totalCalls}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tokens</p>
              <p className="text-2xl font-bold">
                {stats.aiUsage.totalTokens?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold">
                ${stats.aiUsage.totalCost?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
