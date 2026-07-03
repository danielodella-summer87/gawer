import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  proposals,
  getScoreCategory,
  formatCurrency,
} from "@/lib/mock/gawerData";

const sorted = [...proposals].sort((a, b) => b.score - a.score);

export default function RankingPage() {
  return (
    <AppShell topbarTitle="Ranking de oportunidades">
      <SectionHeader
        title="Ranking"
        description="Oportunidades ordenadas por Score GAWER consolidado"
      />

      <div className="mb-6 rounded-lg border border-gawer-gold-muted/40 bg-gawer-gold-muted/10 p-4">
        <p className="text-sm text-gawer-gray-700">
          <span className="font-medium">Categorías:</span>{" "}
          85–100 Oportunidad prioritaria · 70–84 Interesante · 50–69 Requiere más info · 30–49 Débil · 0–29 Descartar sugerido
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
                  <RiskBadge level={p.riesgo} />
                  <StatusBadge status={p.estado} />
                </div>
                <p className="text-sm text-gawer-gray-500 mt-0.5">
                  {p.areaNegocio} · {formatCurrency(p.montoEstimado, p.moneda)}
                </p>
                <p className="text-xs font-medium text-gawer-green mt-1">
                  {getScoreCategory(p.score)}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Comercial", value: p.scoreComercial },
                  { label: "Documental", value: p.scoreDocumental },
                  { label: "Riesgo", value: p.scoreRiesgo },
                  { label: "Viabilidad", value: p.scoreViabilidad },
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
                Ver análisis →
              </Link>
            </div>

            <div className="mt-4 rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">
                Recomendación IA (mock)
              </p>
              <p className="text-sm text-gawer-gray-700">{p.recomendacionIA}</p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
