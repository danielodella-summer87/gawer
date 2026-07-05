import {
  ClipboardList,
  ListChecks,
  LayoutGrid,
  Siren,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { discoveryStats, discoveryTraceability } from "@/lib/mock/gawerData";

export default function DiscoveryPage() {
  return (
    <AppShell topbarTitle="Discovery GAWER">
      <SectionHeader
        title="Discovery GAWER"
        description="Trazabilidad entre las respuestas validadas por Fernando y los criterios aplicados en la maqueta."
      />

      <section className="mb-8 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-5">
        <Compass className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal leading-relaxed">
          Esta pantalla permite verificar cómo las respuestas de Fernando fueron transformadas en reglas
          operativas, criterios de evaluación, alertas, estados comerciales y módulos de la plataforma.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Respuestas analizadas"
          value={discoveryStats.respuestasAnalizadas}
          icon={ClipboardList}
        />
        <StatCard
          title="Reglas incorporadas"
          value={discoveryStats.reglasIncorporadas}
          icon={ListChecks}
          variant="success"
        />
        <StatCard
          title="Módulos impactados"
          value={discoveryStats.modulosImpactados}
          icon={LayoutGrid}
        />
        <StatCard
          title="Regla crítica validada"
          value={discoveryStats.reglasCriticasValidadas}
          subtitle="MTNs HSBC / LTNs brasileras"
          icon={Siren}
          variant="danger"
        />
        <StatCard
          title="Decisiones autónomas por IA"
          value={discoveryStats.decisionesAutonomasIA}
          subtitle="Toda decisión final es humana"
          icon={ShieldCheck}
          variant="success"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gawer-charcoal mb-1">
          Respuesta → Aplicación en el sistema
        </h2>
        <p className="text-sm text-gawer-gray-500 mb-4">
          Cada fila conecta un criterio validado por Fernando con su implementación concreta en la maqueta.
        </p>

        <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Tema</th>
                  <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Criterio validado por Fernando</th>
                  <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Aplicación en GAWER Intelligence</th>
                  <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Pantallas impactadas</th>
                  <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gawer-gray-100">
                {discoveryTraceability.map((item) => (
                  <tr key={item.id} className="hover:bg-gawer-gray-50/50 align-top">
                    <td className="px-4 py-4 font-medium text-gawer-charcoal whitespace-nowrap">
                      {item.tema}
                    </td>
                    <td className="px-4 py-4 text-gawer-gray-700 max-w-xs leading-relaxed">
                      {item.criterio}
                    </td>
                    <td className="px-4 py-4 text-gawer-gray-700 max-w-xs leading-relaxed">
                      {item.aplicacion}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {item.pantallas.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600 whitespace-nowrap"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md border border-gawer-green/30 bg-gawer-green/10 px-2 py-0.5 text-xs font-medium text-gawer-green whitespace-nowrap">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
