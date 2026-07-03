import { cn } from "@/lib/utils";

const variants = {
  Bajo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Medio: "bg-amber-50 text-amber-800 border-amber-200",
  Alto: "bg-orange-50 text-orange-800 border-orange-200",
  Crítico: "bg-red-50 text-red-800 border-red-200",
};

interface RiskBadgeProps {
  level: keyof typeof variants;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[level],
        className
      )}
    >
      {level}
    </span>
  );
}
