import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-blue-900/10 dark:to-purple-900/10 p-6 shadow-lg shadow-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground/70">{title}</p>
          <p className="mt-2 text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-foreground/60">{description}</p>
          )}
          {trend && (
            <p
              className={`mt-2 text-sm font-semibold flex items-center gap-1 ${
                trend.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              <span className="text-lg">{trend.positive ? "↑" : "↓"}</span> {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-4 shadow-md">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </div>
    </div>
  );
}
