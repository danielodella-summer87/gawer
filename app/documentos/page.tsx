import { Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { documents } from "@/lib/mock/gawerData";

const docTypes = [
  "CIS", "LOI", "Evidencia bancaria", "Bloqueo de fondos", "SBLC", "RWA",
  "Evidencia verificable de fondos", "Documentación específica de garantías",
  "Documentos bancarios inconsistentes", "Documentos alterados",
  "Mandato / autorización de representación",
];

export default function DocumentosPage() {
  return (
    <AppShell topbarTitle="Documentos">
      <SectionHeader
        title="Documentos"
        description="Documentación recibida asociada a propuestas comerciales. El CIS / Hoja de Información Corporativa es obligatorio para toda operación."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {docTypes.map((tipo) => (
          <span
            key={tipo}
            className="rounded-full border border-gawer-gray-200 bg-white px-3 py-1 text-xs text-gawer-gray-600"
          >
            {tipo}
          </span>
        ))}
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-4">
        <Info className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal">
          Ningún documento aislado valida una operación. La evaluación considera el conjunto documental y el contexto específico.
        </p>
      </div>

      <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Documento</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Obligatorio</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Propuesta</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Fecha recepción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gawer-gray-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gawer-gray-50/50">
                <td className="px-4 py-3 font-medium text-gawer-charcoal">{doc.nombre}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600">
                    {doc.tipo}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {doc.obligatorio ? (
                    <span className="text-xs font-medium text-gawer-petrol">Sí</span>
                  ) : (
                    <span className="text-xs text-gawer-gray-400">Según operación</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gawer-gray-700">{doc.propuestaNombre}</td>
                <td className="px-4 py-3"><StatusBadge status={doc.estado} /></td>
                <td className="px-4 py-3 text-gawer-gray-500">{doc.fechaRecepcion || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
