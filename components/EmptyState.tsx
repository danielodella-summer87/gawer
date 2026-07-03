import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gawer-gray-300 bg-white py-16 px-6 text-center">
      <div className="rounded-full bg-gawer-gray-100 p-3 mb-4">
        <FileQuestion className="h-6 w-6 text-gawer-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gawer-charcoal">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gawer-gray-500 max-w-sm">{description}</p>
      )}
    </div>
  );
}
