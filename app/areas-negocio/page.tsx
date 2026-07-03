import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { businessAreas } from "@/lib/mock/gawerData";

export default function AreasNegocioPage() {
  return (
    <AppShell topbarTitle="Áreas de negocio">
      <SectionHeader
        title="Áreas de negocio"
        description="Criterios, documentos y señales de alerta por línea de negocio"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {businessAreas.map((area) => (
          <div
            key={area.id}
            className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gawer-charcoal">{area.nombre}</h3>
              <StatusBadge status={area.estado === "activa" ? "activo" : "en revisión"} />
            </div>

            <p className="text-sm text-gawer-gray-600 mb-5 leading-relaxed">{area.descripcion}</p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gawer-green" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                    Criterios mínimos
                  </p>
                </div>
                <ul className="space-y-1">
                  {area.criteriosMinimos.map((c, i) => (
                    <li key={i} className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-gray-400">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="h-3.5 w-3.5 text-gawer-petrol" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                    Documentos esperados
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {area.documentosEsperados.map((d) => (
                    <span key={d} className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                    Señales de alerta
                  </p>
                </div>
                <ul className="space-y-1">
                  {area.senalesAlerta.map((s, i) => (
                    <li key={i} className="text-sm text-amber-800 pl-4 relative before:content-['⚠'] before:absolute before:left-0 before:text-xs">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
