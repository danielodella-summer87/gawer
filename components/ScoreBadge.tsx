import { cn } from "@/lib/utils";
import { getScoreCategory } from "@/lib/mock/gawerData";

interface ScoreBadgeProps {
  score: number;
  showCategory?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 85) return "bg-gawer-green text-white";
  if (score >= 70) return "bg-gawer-petrol text-white";
  if (score >= 50) return "bg-gawer-gray-600 text-white";
  if (score >= 30) return "bg-amber-600 text-white";
  return "bg-red-700 text-white";
}

export function ScoreBadge({ score, showCategory = false, size = "md", className }: ScoreBadgeProps) {
  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-lg font-semibold",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          getScoreColor(score),
          sizes[size]
        )}
      >
        {score}
      </span>
      {showCategory && (
        <span className="text-xs text-gawer-gray-600">{getScoreCategory(score)}</span>
      )}
    </div>
  );
}
