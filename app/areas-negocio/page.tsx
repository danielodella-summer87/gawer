import { AlertTriangle, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { businessAreasOficiales, businessSubAreas } from "@/lib/mock/gawerData";

export default function AreasNegocioPage() {
  return (
    <AppShell topbarTitle="Áreas de negocio">
      <SectionHeader
        title="Áreas de negocio"
        description="GAWER tiene dos áreas oficiales. Todas las áreas y subáreas pueden comunicarse públicamente."
      />

      <div className="space-y-10">
        {businessAreasOficiales.map((area) => {
          const subAreas = businessSubAreas.filter((s) => s.areaOficialId === area.id);
          return (
            <div key={area.id}>
              <div className="mb-4 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-5">
                <p className="text-[10px] uppercase tracking-wider text-gawer-petrol font-semibold mb-1">
                  Área oficial
                </p>
                <h2 className="text-lg font-semibold text-gawer-charcoal">{area.nombre}</h2>
                <p className="text-sm text-gawer-gray-600 mt-1">{area.descripcion}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-0 lg:pl-4">
                {subAreas.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-gawer-gray-400 mb-2">
                      <ArrowRight className="h-3 w-3" />
                      Subárea operativa
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base font-semibold text-gawer-charcoal">{sub.nombre}</h3>
                      <StatusBadge status={sub.estado === "activa" ? "activo" : "en revisión"} />
                    </div>

                    <p className="text-sm text-gawer-gray-600 mb-5 leading-relaxed">{sub.descripcion}</p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="h-3.5 w-3.5 text-gawer-petrol" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                            Documentos comunes
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.documentosComunes.map((d) => (
                            <span key={d} className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="h-3.5 w-3.5 text-gawer-petrol" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                            Documentos específicos
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.documentosEspecificos.map((d) => (
                            <span key={d} className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gawer-green" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                            Señales de oportunidad real
                          </p>
                        </div>
                        <ul className="space-y-1">
                          {sub.senalesOportunidadReal.map((s, i) => (
                            <li key={i} className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-green">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
                            Señales de alerta
                          </p>
                        </div>
                        <ul className="space-y-1">
                          {sub.senalesAlerta.map((s, i) => (
                            <li key={i} className="text-sm text-amber-800 pl-4 relative before:content-['⚠'] before:absolute before:left-0 before:text-xs">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">Criterio de avance</p>
                        <p className="text-sm text-gawer-charcoal">{sub.criterioAvance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
