"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Save } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  documentChecklistStatusOptions,
  summarizeChecklist,
  type DocumentChecklistItem,
  type DocumentChecklistStatus,
} from "@/lib/local/documentChecklist";

interface LocalDocumentChecklistPanelProps {
  proposalId: string;
  initialChecklist: DocumentChecklistItem[];
}

export function LocalDocumentChecklistPanel({
  proposalId,
  initialChecklist,
}: LocalDocumentChecklistPanelProps) {
  const router = useRouter();
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>(initialChecklist);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => summarizeChecklist(checklist), [checklist]);

  function updateItem(id: string, patch: Partial<DocumentChecklistItem>) {
    setChecklist((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch(`/api/local/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentChecklist: checklist }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar el checklist documental.");
        return;
      }
      setChecklist(data.proposal.documentChecklist);
      setFeedback("Checklist documental guardado en el entorno local.");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el entorno local de desarrollo.");
    } finally {
      setIsSaving(false);
    }
  }

  const nivelVariant =
    summary.nivelPreparacion === "Alto"
      ? "text-gawer-green"
      : summary.nivelPreparacion === "Medio"
      ? "text-amber-600"
      : "text-red-600";

  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileCheck2 className="h-4 w-4 text-gawer-petrol" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
          Checklist documental
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Requeridos</p>
          <p className="text-lg font-semibold text-gawer-charcoal">{summary.totalRequeridos}</p>
        </div>
        <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Recibidos</p>
          <p className="text-lg font-semibold text-gawer-charcoal">{summary.recibidos}</p>
        </div>
        <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Pendientes</p>
          <p className="text-lg font-semibold text-gawer-charcoal">{summary.pendientes}</p>
        </div>
        <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Con inconsistencia</p>
          <p className="text-lg font-semibold text-gawer-charcoal">{summary.conInconsistencia}</p>
        </div>
      </div>

      <div className="mb-5 rounded-md border border-gawer-gray-100 bg-gawer-gray-50 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gawer-gray-600">Nivel de preparación documental</span>
        <span className={`text-sm font-semibold ${nivelVariant}`}>{summary.nivelPreparacion}</span>
      </div>

      <div className="space-y-2 mb-5">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 rounded-md border border-gawer-gray-200 p-3"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gawer-charcoal">{item.nombre}</p>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                    item.requerido
                      ? "bg-gawer-petrol/10 text-gawer-petrol"
                      : "bg-gawer-gray-100 text-gawer-gray-500"
                  }`}
                >
                  {item.requerido ? "Requerido" : "Opcional"}
                </span>
                {item.actualizadoAt && (
                  <span className="text-[10px] text-gawer-gray-400">
                    Actualizado: {new Date(item.actualizadoAt).toLocaleString("es-AR")}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={item.observacion}
                onChange={(e) => updateItem(item.id, { observacion: e.target.value })}
                placeholder="Observación interna (opcional)"
                className="mt-2 w-full rounded-md border border-gawer-gray-200 px-2.5 py-1.5 text-xs focus:border-gawer-petrol focus:outline-none"
              />
            </div>
            <div className="flex items-start sm:items-center gap-2">
              <StatusBadge status={item.estado} />
              <select
                value={item.estado}
                onChange={(e) =>
                  updateItem(item.id, { estado: e.target.value as DocumentChecklistStatus })
                }
                className="h-8 rounded-md border border-gawer-gray-200 bg-white px-2 text-xs text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
              >
                {documentChecklistStatusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gawer-gray-500 italic mb-4">
        Ningún documento aislado valida una operación. La evaluación considera el conjunto documental
        y el contexto específico.
      </p>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {feedback && <p className="text-sm text-gawer-green mb-3">{feedback}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-gawer-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Guardando..." : "Guardar checklist documental"}
      </button>
    </section>
  );
}
