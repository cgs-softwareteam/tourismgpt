import { count, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { chat, user } from "@/lib/db/schema";
import { auth } from "@/app/(auth)/auth";
import { UserRoleToggle } from "@/components/admin/user-role-toggle";

export const dynamic = "force-dynamic";

async function getUsers() {
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      chatCount: sql<number>`count(${chat.id})::int`,
    })
    .from(user)
    .leftJoin(chat, sql`${user.id} = ${chat.userId}`)
    .groupBy(user.id, user.email, user.isAdmin, user.createdAt)
    .orderBy(desc(user.createdAt));

  const totalUsers = await db.select({ count: count() }).from(user);

  return {
    users,
    totalUsers: totalUsers[0]?.count || 0,
  };
}

export default async function UsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id || "";
  const { users, totalUsers } = await getUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Users</h1>
        <p className="mt-2 text-base text-foreground/70">
          Manage registered users ({totalUsers} total)
        </p>
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Chats
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary text-sm">
                        {user.email[0].toUpperCase()}
                      </div>
                      <p className="font-semibold text-base">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        👑 Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        👤 User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground/70">
                      📅 {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💬</span>
                      <p className="text-sm font-semibold text-foreground/70">
                        {user.chatCount} conversations
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleToggle
                      userId={user.id}
                      userEmail={user.email}
                      initialIsAdmin={user.isAdmin}
                      currentUserId={currentUserId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border-2 border-accent/20 bg-gradient-to-br from-white via-teal-50/30 to-blue-50/30 dark:from-slate-800 dark:via-teal-900/10 dark:to-blue-900/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Role Management</h2>
            <p className="mt-2 text-sm text-foreground/70">
              Use the toggle switch in the Actions column to change user roles between Admin and User.
            </p>
            <p className="mt-2 text-xs text-foreground/60 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              ⚠️ Note: You cannot remove your own admin privileges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
