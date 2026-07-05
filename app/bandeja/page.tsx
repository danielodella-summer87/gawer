"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Inbox,
  Send,
  FileWarning,
  ShieldAlert,
  UserX,
  Clock,
  Copy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RiskBadge } from "@/components/RiskBadge";
import type { LocalProposal } from "@/lib/local/proposalsStore";
import {
  buildOperationalInboxRow,
  getOperationalInboxSummary,
  type OperationalBucket,
  type OperationalInboxRow,
} from "@/lib/local/operationalInbox";

const SECCIONES: { bucket: OperationalBucket; title: string; description: string; icon: typeof Send }[] = [
  {
    bucket: "listas_fernando_liliana",
    title: "Listas para Fernando/Liliana",
    description: "Briefing en \"Lista para revisión ejecutiva\" o ya marcadas para revisión ejecutiva.",
    icon: Send,
  },
  {
    bucket: "requieren_accion_comercial",
    title: "Requieren acción comercial",
    description: "Tienen próxima acción, fecha y responsable definidos, con estado comercial activo.",
    icon: Clock,
  },
  {
    bucket: "pendientes_documentacion",
    title: "Pendientes de documentación",
    description: "CIS pendiente, documentos requeridos sin recibir, nivel documental bajo/medio, o revisión humana abierta.",
    icon: FileWarning,
  },
  {
    bucket: "bloqueadas_no_listas",
    title: "Bloqueadas / no listas",
    description: "Riesgo crítico, MTN/LTN, sin acceso ni mandato, cadena de intermediación alta, o briefing \"No lista\".",
    icon: ShieldAlert,
  },
  {
    bucket: "sin_responsable",
    title: "Sin responsable",
    description: "Propuestas locales sin responsable interno asignado todavía.",
    icon: UserX,
  },
];

function BandejaRow({ row }: { row: OperationalInboxRow }) {
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");

  async function handleCopy() {
    setCopyState("copying");
    try {
      const text = `Asunto: ${row.recommendedDraftSubject}\n\n${row.recommendedDraftBody}`;
      await navigator.clipboard.writeText(text);
      await fetch(`/api/local/proposals/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log_response_draft_copy", draftTitle: row.recommendedDraftTitle }),
      });
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="rounded-lg border border-gawer-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gawer-charcoal truncate">{row.empresa}</p>
          <p className="text-xs text-gawer-gray-500">{row.proponente} · {row.areaNegocio}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ScoreBadge score={row.score} size="sm" />
          <RiskBadge level={row.riesgo} />
          <StatusBadge status={row.estadoComercial} />
          <StatusBadge status={row.briefingReadiness} />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gawer-gray-500">
          <span>Doc: <span className="font-medium text-gawer-charcoal">{row.nivelDocumental}</span></span>
          <span>Resp: <span className="font-medium text-gawer-charcoal">{row.responsable || "Sin asignar"}</span></span>
          {row.proximaAccion && <StatusBadge status={row.nextActionStatus} />}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title={`Copiar borrador sugerido: ${row.recommendedDraftTitle}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-gawer-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gawer-gray-600 hover:bg-gawer-gray-50 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            {copyState === "copied" ? "Copiado" : copyState === "copying" ? "..." : "Copiar respuesta sugerida"}
          </button>
          <Link
            href={`/propuestas/${row.id}`}
            className="text-sm font-medium text-gawer-petrol hover:text-gawer-green whitespace-nowrap"
          >
            Abrir ficha →
          </Link>
        </div>
      </div>
      {row.proximaAccion && (
        <p className="mt-2 text-xs text-gawer-gray-500">
          Próxima acción: <span className="text-gawer-charcoal">{row.proximaAccion}</span>
          {row.fechaProximaAccion && ` — ${row.fechaProximaAccion}`}
        </p>
      )}
    </div>
  );
}

export default function BandejaOperativaPage() {
  const [rows, setRows] = useState<OperationalInboxRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      const res = await fetch("/api/local/proposals");
      const data = await res.json();
      const proposals: LocalProposal[] = Array.isArray(data.proposals) ? data.proposals : [];
      setRows(proposals.map(buildOperationalInboxRow));
    } catch {
      setRows([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const summary = getOperationalInboxSummary(rows);

  return (
    <AppShell topbarTitle="Bandeja operativa">
      <SectionHeader
        title="Bandeja operativa"
        description="Vista operativa de propuestas locales agrupadas por prioridad de acción, sin necesidad de abrir cada ficha."
      />

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-gold/30 bg-gawer-gold/10 p-4">
        <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Esta bandeja muestra únicamente propuestas guardadas en el entorno local de desarrollo. No
          representa datos productivos ni almacenamiento operativo definitivo.
        </p>
      </div>

      {!loaded ? (
        <p className="text-sm text-gawer-gray-500">Cargando propuestas locales…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No hay propuestas locales todavía."
          description="Complete el formulario público en localhost para probar el flujo operativo."
          action={
            <Link
              href="/propuesta"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-4 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light transition-colors"
            >
              Ir al formulario público
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard title="Propuestas locales" value={summary.totalPropuestasLocales} icon={Inbox} />
            <StatCard
              title="Listas para Fernando/Liliana"
              value={summary.listasFernandoLiliana}
              icon={Send}
              variant="success"
            />
            <StatCard
              title="Pendientes de documentación"
              value={summary.pendientesDocumentacion}
              icon={FileWarning}
              variant="warning"
            />
            <StatCard title="Riesgo crítico" value={summary.riesgoCritico} icon={ShieldAlert} variant="danger" />
            <StatCard title="Sin responsable" value={summary.sinResponsable} icon={UserX} />
            <StatCard
              title="Próximas acciones vencidas o pendientes hoy"
              value={summary.proximasAccionesVencidasOPendientes}
              icon={Clock}
              variant="warning"
            />
          </div>

          <div className="space-y-8">
            {SECCIONES.map((seccion) => {
              const seccionRows = rows.filter((r) => r.buckets.includes(seccion.bucket));
              const Icon = seccion.icon;
              return (
                <div key={seccion.bucket}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-gawer-petrol" />
                    <h2 className="text-base font-semibold text-gawer-charcoal">
                      {seccion.title} <span className="text-gawer-gray-400 font-normal">({seccionRows.length})</span>
                    </h2>
                  </div>
                  <p className="text-xs text-gawer-gray-500 mb-3">{seccion.description}</p>
                  {seccionRows.length > 0 ? (
                    <div className="space-y-2">
                      {seccionRows.map((row) => (
                        <BandejaRow key={row.id} row={row} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gawer-gray-400 italic">Sin propuestas en esta categoría.</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
