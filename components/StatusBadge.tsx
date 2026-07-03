import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Nueva propuesta recibida": "bg-blue-50 text-blue-800 border-blue-200",
  "Precalificación automática": "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Solicitud de información adicional": "bg-amber-50 text-amber-800 border-amber-200",
  "Revisión ejecutiva": "bg-purple-50 text-purple-800 border-purple-200",
  "Validación documental / compliance": "bg-cyan-50 text-cyan-800 border-cyan-200",
  "Negociación / estructuración": "bg-gawer-green/10 text-gawer-green border-gawer-green/30",
  Ganado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Perdido: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  Descartado: "bg-red-50 text-red-700 border-red-200",
  recibido: "bg-emerald-50 text-emerald-800 border-emerald-200",
  pendiente: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  incompleto: "bg-amber-50 text-amber-800 border-amber-200",
  inconsistente: "bg-orange-50 text-orange-800 border-orange-200",
  "requiere revisión humana": "bg-purple-50 text-purple-800 border-purple-200",
  borrador: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  "en revisión": "bg-amber-50 text-amber-800 border-amber-200",
  validado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  obsoleto: "bg-red-50 text-red-700 border-red-200",
  activo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "en prueba": "bg-amber-50 text-amber-800 border-amber-200",
  pausado: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  Nuevo: "bg-blue-50 text-blue-800 border-blue-200",
  "En análisis": "bg-amber-50 text-amber-800 border-amber-200",
  Aprobado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "En desarrollo": "bg-indigo-50 text-indigo-800 border-indigo-200",
  Resuelto: "bg-gawer-green/10 text-gawer-green border-gawer-green/30",
  Rechazado: "bg-red-50 text-red-700 border-red-200",
  Pausado: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        statusColors[status] ?? "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
        className
      )}
    >
      {status}
    </span>
  );
}
