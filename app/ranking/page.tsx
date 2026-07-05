import Link from "next/link";
import { Siren } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  proposals,
  getRankingCategory,
  formatCurrency,
} from "@/lib/mock/gawerData";

const sorted = [...proposals].sort((a, b) => b.score - a.score);

export default function RankingPage() {
  return (
    <AppShell topbarTitle="Ranking de oportunidades">
      <SectionHeader
        title="Ranking"
        description="Oportunidades ordenadas por score GAWER consolidado — grado de preparación, calidad documental, riesgo documental y probabilidad de cierre."
      />

      <div className="mb-4 rounded-lg border border-gawer-gold-muted/40 bg-gawer-gold-muted/10 p-4">
        <p className="text-sm text-gawer-gray-700">
          <span className="font-medium">Categorías sugeridas (no vinculantes):</span>{" "}
          Lista para revisión ejecutiva · Requiere documentación adicional · Riesgo documental elevado · Intermediación no verificable · Descarte sugerido por inconsistencia crítica.
        </p>
        <p className="text-xs text-gawer-gray-500 mt-2">
          El score y la categoría son una recomendación del sistema. La decisión final siempre corresponde al equipo de GAWER.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <Siren className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800">
          Regla especial validada por Fernando: toda operación con MTNs del HSBC respaldadas en LTNs brasileras se muestra como
          alerta crítica y descarte sugerido por inconsistencia crítica, sin excepción.
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((p, index) => (
          <div
            key={p.id}
            className="rounded-lg border border-gawer-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-4 min-w-[60px]">
                <span className="text-2xl font-bold text-gawer-gray-300">#{index + 1}</span>
                <ScoreBadge score={p.score} size="lg" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-gawer-charcoal">{p.empresa}</h3>
                  {p.alertaCritica && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      <Siren className="h-3 w-3" /> Alerta crítica
                    </span>
                  )}
                  <RiskBadge level={p.riesgo} />
                  <StatusBadge status={p.estado} />
                </div>
                <p className="text-sm text-gawer-gray-500 mt-0.5">
                  {p.areaNegocio} · {formatCurrency(p.montoEstimado, p.moneda)}
                </p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <StatusBadge status={getRankingCategory(p)} />
                  <span className="text-[11px] text-gawer-gray-400">Sugerido, no vinculante</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Preparación", value: p.gradoPreparacion },
                  { label: "Doc. calidad", value: p.calidadDocumental },
                  { label: "Riesgo doc.", value: p.riesgoDocumental },
                  { label: "Prob. cierre", value: p.probabilidadCierre },
                ].map((s) => (
                  <div key={s.label} className="rounded-md bg-gawer-gray-50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">{s.label}</p>
                    <p className="text-lg font-semibold text-gawer-charcoal">{s.value}</p>
                  </div>
                ))}
              </div>

              <Link
                href={`/propuestas/${p.id}`}
                className="shrink-0 text-sm font-medium text-gawer-petrol hover:text-gawer-green"
              >
                Ver ficha →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">CIS</p>
                <StatusBadge status={p.cis} className="mt-1" />
              </div>
              <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Acceso directo</p>
                <StatusBadge status={p.accesoDirectoPrincipal} className="mt-1" />
              </div>
              <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Cadena de intermediación</p>
                <StatusBadge status={p.cadenaIntermediacion} className="mt-1" />
              </div>
            </div>

            <div className="mt-3 rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">
                Recomendación IA — sugerida, requiere revisión humana
              </p>
              <p className="text-sm text-gawer-gray-700">{p.recomendacionIA}</p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
