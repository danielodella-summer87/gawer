import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  // Estados comerciales de propuestas
  "Nueva propuesta recibida": "bg-blue-50 text-blue-800 border-blue-200",
  "Revisión comercial inicial": "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Solicitud de CIS": "bg-amber-50 text-amber-800 border-amber-200",
  "Solicitud de documentación específica": "bg-amber-50 text-amber-800 border-amber-200",
  "Análisis documental preliminar": "bg-cyan-50 text-cyan-800 border-cyan-200",
  "Revisión de acceso al principal": "bg-cyan-50 text-cyan-800 border-cyan-200",
  "Revisión ejecutiva Fernando/Liliana": "bg-purple-50 text-purple-800 border-purple-200",
  "Estructuración / negociación": "bg-gawer-green/10 text-gawer-green border-gawer-green/30",
  Ganado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Perdido: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  Descartado: "bg-red-50 text-red-700 border-red-200",
  "Descarte sugerido": "bg-red-50 text-red-700 border-red-200",

  // Estados documentales
  Recibido: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Pendiente: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  Incompleto: "bg-amber-50 text-amber-800 border-amber-200",
  Inconsistente: "bg-orange-50 text-orange-800 border-orange-200",
  "Requiere revisión humana": "bg-purple-50 text-purple-800 border-purple-200",
  "Validado preliminarmente": "bg-cyan-50 text-cyan-800 border-cyan-200",
  "No suficiente por sí solo": "bg-red-50 text-red-700 border-red-200",
  "No aplica": "bg-gawer-gray-100 text-gawer-gray-500 border-gawer-gray-300",

  // Base de conocimiento
  Borrador: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  "En revisión": "bg-amber-50 text-amber-800 border-amber-200",
  "Validado por Fernando": "bg-emerald-50 text-emerald-800 border-emerald-200",

  // Motores IA
  activo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "en prueba": "bg-amber-50 text-amber-800 border-amber-200",
  pausado: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",

  // Mesa de ayuda
  Nuevo: "bg-blue-50 text-blue-800 border-blue-200",
  "En análisis": "bg-amber-50 text-amber-800 border-amber-200",
  Aprobado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "En desarrollo": "bg-indigo-50 text-indigo-800 border-indigo-200",
  Resuelto: "bg-gawer-green/10 text-gawer-green border-gawer-green/30",
  Rechazado: "bg-red-50 text-red-700 border-red-200",
  Pausado: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",

  // Categorías de ranking (sugeridas, no vinculantes)
  "Lista para revisión ejecutiva": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Requiere documentación adicional": "bg-amber-50 text-amber-800 border-amber-200",
  "Riesgo documental elevado": "bg-orange-50 text-orange-800 border-orange-200",
  "Intermediación no verificable": "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  "Descarte sugerido por inconsistencia crítica": "bg-red-50 text-red-700 border-red-200",

  // Acceso directo / capacidades
  Confirmado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "No confirmado": "bg-amber-50 text-amber-800 border-amber-200",
  Desconocido: "bg-gawer-gray-100 text-gawer-gray-600 border-gawer-gray-300",
  Demostrada: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Parcial: "bg-amber-50 text-amber-800 border-amber-200",
  "No demostrada": "bg-red-50 text-red-700 border-red-200",

  // Cadena de intermediación
  Baja: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Media: "bg-amber-50 text-amber-800 border-amber-200",
  Alta: "bg-orange-50 text-orange-800 border-orange-200",
  Crítica: "bg-red-50 text-red-700 border-red-200",
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
