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
      chatCount: sql<number>`count(${chat.id})::int`,
    })
    .from(user)
    .leftJoin(chat, sql`${user.id} = ${chat.userId}`)
    .groupBy(user.id, user.email, user.isAdmin)
    .orderBy(desc(sql`count(${chat.id})`));

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
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Manage registered users ({totalUsers} total)
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Chats
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {user.chatCount} conversations
                    </p>
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

      <div className="mt-6 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Role Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the toggle switch in the Actions column to change user roles between Admin and User.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Note: You cannot remove your own admin privileges.
        </p>
      </div>
    </div>
  );
}
