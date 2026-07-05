"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, ShieldAlert, Send } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ExecutiveBriefing } from "@/lib/local/executiveBriefing";

interface LocalExecutiveBriefingPanelProps {
  proposalId: string;
  briefing: ExecutiveBriefing;
  estadoComercialActual: string;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1.5">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-gray-400"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LocalExecutiveBriefingPanel({
  proposalId,
  briefing,
  estadoComercialActual,
}: LocalExecutiveBriefingPanelProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const yaEscalada = estadoComercialActual === "Revisión ejecutiva Fernando/Liliana";
  const puedeEscalar = briefing.readinessLevel === "Lista para revisión ejecutiva" && !yaEscalada;

  async function handleEscalate() {
    setIsSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch(`/api/local/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_for_executive_review" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo marcar la propuesta para revisión ejecutiva.");
        return;
      }
      setFeedback("Propuesta marcada para revisión Fernando/Liliana.");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el entorno local de desarrollo.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-gawer-petrol" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
            Briefing ejecutivo
          </h2>
        </div>
        <StatusBadge status={briefing.readinessLevel} />
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-gawer-petrol/30 bg-gawer-petrol/5 p-3">
        <ShieldAlert className="h-3.5 w-3.5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Este briefing es una síntesis preliminar generada por reglas locales. No reemplaza revisión
          humana ni implica aprobación de la operación.
        </p>
      </div>

      <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3 mb-5">
        <p className="text-sm text-gawer-charcoal leading-relaxed">{briefing.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <section className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1.5">
              Perfil del proponente
            </p>
            <dl className="space-y-1 text-sm">
              {[
                ["Nombre", briefing.clientProfile.nombre],
                ["Empresa", briefing.clientProfile.empresa],
                ["País", briefing.clientProfile.pais],
                ["Rol", briefing.clientProfile.rol],
                ["Acceso al principal", briefing.clientProfile.accesoPrincipal],
                ["Mandato/autorización", briefing.clientProfile.mandato],
                ["Cadena de intermediación", briefing.clientProfile.cadenaIntermediacion],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-gawer-gray-500">{label}</dt>
                  <dd className="font-medium text-gawer-charcoal text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1.5">
              Operación
            </p>
            <p className="text-sm text-gawer-gray-700 leading-relaxed">{briefing.operationSummary}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1.5">
              Documentación y evidencias
            </p>
            <dl className="space-y-1 text-sm mb-2">
              <div className="flex justify-between gap-3">
                <dt className="text-gawer-gray-500">CIS</dt>
                <dd className="font-medium text-gawer-charcoal text-right">
                  {briefing.documentationSummary.cis}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gawer-gray-500">Nivel de preparación documental</dt>
                <dd className="font-medium text-gawer-charcoal text-right">
                  {briefing.documentationSummary.nivelPreparacionDocumental}
                </dd>
              </div>
            </dl>
            <ListBlock title="Recibidos" items={briefing.documentationSummary.documentosRecibidos} />
            <ListBlock title="Pendientes" items={briefing.documentationSummary.documentosPendientes} />
            <ListBlock title="Con revisión humana" items={briefing.documentationSummary.documentosRevisionHumana} />
            <ListBlock title="Inconsistentes" items={briefing.documentationSummary.documentosInconsistentes} />
          </div>
        </section>

        <section className="space-y-4">
          <ListBlock title="Riesgos y alertas" items={briefing.riskSummary} />
          <ListBlock title="Información faltante" items={briefing.missingInformation} />
          <ListBlock title="Preguntas sugeridas antes de avanzar" items={briefing.suggestedQuestions} />
          <ListBlock title="Alternativas de estructuración" items={briefing.viableStructuringOptions} />
          <ListBlock title="Plan de trabajo sugerido" items={briefing.suggestedWorkPlan} />
          <ListBlock title="Responsabilidades sugeridas" items={briefing.suggestedResponsibilities} />
        </section>
      </div>

      {(briefing.blockingReasons.length > 0 || briefing.cautionSignals.length > 0 || briefing.positiveSignals.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {briefing.blockingReasons.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 mb-1.5">
                Razones de bloqueo
              </p>
              <ul className="space-y-1">
                {briefing.blockingReasons.map((r, i) => (
                  <li key={i} className="text-xs text-red-800">• {r}</li>
                ))}
              </ul>
            </div>
          )}
          {briefing.cautionSignals.length > 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5">
                Señales de precaución
              </p>
              <ul className="space-y-1">
                {briefing.cautionSignals.map((r, i) => (
                  <li key={i} className="text-xs text-amber-800">• {r}</li>
                ))}
              </ul>
            </div>
          )}
          {briefing.positiveSignals.length > 0 && (
            <div className="rounded-md border border-gawer-green/30 bg-gawer-green/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-green mb-1.5">
                Señales positivas
              </p>
              <ul className="space-y-1">
                {briefing.positiveSignals.map((r, i) => (
                  <li key={i} className="text-xs text-gawer-charcoal">• {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-md bg-gawer-petrol/5 border border-gawer-petrol/20 p-3 mb-4">
        <p className="text-xs font-medium text-gawer-petrol mb-1">Recomendación de escalamiento</p>
        <p className="text-sm text-gawer-charcoal">{briefing.escalationRecommendation}</p>
      </div>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {feedback && <p className="text-sm text-gawer-green mb-3">{feedback}</p>}

      {yaEscalada ? (
        <p className="text-sm text-gawer-gray-500">
          Esta propuesta ya está marcada para revisión Fernando/Liliana.
        </p>
      ) : (
        <div className="flex flex-col items-start gap-1.5">
          <button
            type="button"
            onClick={handleEscalate}
            disabled={!puedeEscalar || isSaving}
            className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-gawer-green-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
            {isSaving ? "Guardando..." : "Marcar para revisión Fernando/Liliana"}
          </button>
          {!puedeEscalar && (
            <p className="text-xs text-gawer-gray-500">Complete requisitos mínimos antes de escalar.</p>
          )}
        </div>
      )}
    </section>
  );
}
