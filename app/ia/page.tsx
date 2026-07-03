import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { aiEngines } from "@/lib/mock/gawerData";

export default function IAPage() {
  return (
    <AppShell topbarTitle="Motores inteligentes">
      <SectionHeader
        title="IA — Motores inteligentes"
        description="Gestión de motores de evaluación, clasificación y generación (mock — sin IA real)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {aiEngines.map((engine) => (
          <div
            key={engine.id}
            className="rounded-lg border border-gawer-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gawer-charcoal">{engine.nombre}</h3>
                <p className="text-xs text-gawer-gray-500 mt-0.5">Etapa: {engine.etapa}</p>
              </div>
              <StatusBadge status={engine.estado} />
            </div>

            <p className="text-sm text-gawer-gray-600 mb-3">{engine.objetivo}</p>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Salida esperada</p>
                <p className="text-gawer-gray-700">{engine.salidaEsperada}</p>
              </div>
              <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">Prompt mock</p>
                <p className="text-xs text-gawer-gray-600 font-mono leading-relaxed">{engine.promptMock}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gawer-gray-100">
              <button
                type="button"
                className="text-sm font-medium text-gawer-petrol hover:text-gawer-green transition-colors"
              >
                Ver configuración →
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
