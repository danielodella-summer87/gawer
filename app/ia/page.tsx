import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { aiEngines } from "@/lib/mock/gawerData";

export default function IAPage() {
  return (
    <AppShell topbarTitle="Motores inteligentes">
      <SectionHeader
        title="IA — Motores inteligentes"
        description="Gestión de motores de asistencia documental, comercial y de comunicación (mock — sin IA real)"
      />

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-petrol/40 bg-gawer-petrol/5 p-4">
        <ShieldAlert className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <div className="text-sm text-gawer-charcoal">
          <p className="font-semibold mb-1">Gobierno IA</p>
          <p>
            Los prompts, reglas y criterios de estos motores solo pueden modificarse con aprobación de Fernando y consenso
            del equipo GAWER. Ningún motor aprueba, rechaza ni descarta una negociación de forma autónoma.
          </p>
        </div>
      </div>

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

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Qué sugiere</p>
                <p className="text-gawer-gray-700">{engine.queSugiere}</p>
              </div>
              <div className="rounded-md bg-red-50 border border-red-100 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-red-500">Qué NO puede decidir</p>
                <p className="text-red-800 text-sm">{engine.queNoPuedeDecidir}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Información que usa</p>
                <p className="text-gawer-gray-700">{engine.informacionQueUsa}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Salida esperada</p>
                <p className="text-gawer-gray-700">{engine.salidaEsperada}</p>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Responsable de aprobación</p>
                <p className="text-xs font-medium text-gawer-charcoal">{engine.responsableAprobacion}</p>
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
