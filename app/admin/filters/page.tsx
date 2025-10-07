import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { preferenceFilter } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getFilters() {
  return await db
    .select()
    .from(preferenceFilter)
    .orderBy(asc(preferenceFilter.orderIndex));
}

export default async function FiltersPage() {
  const filters = await getFilters();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Preference Filters</h1>
        <p className="mt-1 text-muted-foreground">
          Manage user preference filters
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filters.map((filter) => (
                <tr key={filter.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <span className="text-2xl">{filter.icon}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{filter.label}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      {filter.value}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {filter.orderIndex}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {filter.isActive ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-dashed bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Filter add/edit/delete functionality coming soon
        </p>
      </div>
    </div>
  );
}
