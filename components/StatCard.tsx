import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: "border-gawer-gray-200",
  success: "border-gawer-green/30 bg-gawer-green/5",
  warning: "border-amber-200 bg-amber-50/50",
  danger: "border-red-200 bg-red-50/50",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-5 shadow-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gawer-gray-500">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-gawer-charcoal">{value}</p>
          {subtitle && <p className="text-xs text-gawer-gray-500">{subtitle}</p>}
          {trend && <p className="text-xs text-gawer-green font-medium">{trend}</p>}
        </div>
        {Icon && (
          <div className="rounded-md bg-gawer-gray-100 p-2">
            <Icon className="h-5 w-5 text-gawer-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}
