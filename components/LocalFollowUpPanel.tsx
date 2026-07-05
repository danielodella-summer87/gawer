"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Save, History as HistoryIcon } from "lucide-react";
import { commercialStates } from "@/lib/mock/gawerData";
import type { ProposalStatus } from "@/lib/mock/gawerData";
import type {
  LocalProposalSeguimiento,
  LocalProposalHistorialEvento,
} from "@/lib/local/proposalsStore";

interface LocalFollowUpPanelProps {
  proposalId: string;
  initialSeguimiento: LocalProposalSeguimiento;
  initialHistorial: LocalProposalHistorialEvento[];
}

export function LocalFollowUpPanel({
  proposalId,
  initialSeguimiento,
  initialHistorial,
}: LocalFollowUpPanelProps) {
  const router = useRouter();
  const [estadoComercial, setEstadoComercial] = useState<ProposalStatus>(
    initialSeguimiento.estadoComercial
  );
  const [responsableInterno, setResponsableInterno] = useState(initialSeguimiento.responsableInterno);
  const [proximaAccion, setProximaAccion] = useState(initialSeguimiento.proximaAccion);
  const [fechaProximaAccion, setFechaProximaAccion] = useState(initialSeguimiento.fechaProximaAccion);
  const [notaInterna, setNotaInterna] = useState(initialSeguimiento.notaInterna);

  const [historial, setHistorial] = useState<LocalProposalHistorialEvento[]>(initialHistorial);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mantiene el historial y el estado comercial al día cuando otro bloque de la ficha
  // (checklist documental, briefing ejecutivo) guarda cambios y refresca vía router.refresh().
  useEffect(() => {
    setHistorial(initialHistorial);
  }, [initialHistorial]);

  useEffect(() => {
    setEstadoComercial(initialSeguimiento.estadoComercial);
  }, [initialSeguimiento.estadoComercial]);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch(`/api/local/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estadoComercial,
          responsableInterno,
          proximaAccion,
          fechaProximaAccion,
          notaInterna,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar el seguimiento.");
        return;
      }
      setHistorial(data.proposal.historial);
      setFeedback("Seguimiento guardado en el entorno local.");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el entorno local de desarrollo.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-2">
        Gestión interna — seguimiento local
      </h2>

      <div className="flex items-start gap-2 mb-4 rounded-md border border-gawer-gold/30 bg-gawer-gold/10 p-3">
        <FlaskConical className="h-3.5 w-3.5 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Seguimiento local de desarrollo. Estos cambios se guardan únicamente en este entorno local.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Estado comercial</label>
          <select
            value={estadoComercial}
            onChange={(e) => setEstadoComercial(e.target.value as ProposalStatus)}
            className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
          >
            {commercialStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Responsable interno</label>
          <input
            type="text"
            value={responsableInterno}
            onChange={(e) => setResponsableInterno(e.target.value)}
            placeholder="Ej: Fernando, Liliana, equipo comercial"
            className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Próxima acción</label>
          <input
            type="text"
            value={proximaAccion}
            onChange={(e) => setProximaAccion(e.target.value)}
            placeholder="Ej: Solicitar CIS actualizado"
            className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Fecha de próxima acción</label>
          <input
            type="date"
            value={fechaProximaAccion}
            onChange={(e) => setFechaProximaAccion(e.target.value)}
            className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Nota interna</label>
        <textarea
          rows={3}
          value={notaInterna}
          onChange={(e) => setNotaInterna(e.target.value)}
          className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {feedback && <p className="text-sm text-gawer-green mb-3">{feedback}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-gawer-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Guardando..." : "Guardar seguimiento"}
      </button>

      <div className="mt-6 pt-4 border-t border-gawer-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <HistoryIcon className="h-4 w-4 text-gawer-petrol" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400">
            Historial de seguimiento
          </h3>
        </div>
        {historial.length > 0 ? (
          <ul className="space-y-2">
            {historial.map((h) => (
              <li key={h.id} className="flex gap-3 text-sm">
                <span className="text-gawer-gray-400 shrink-0 w-40 text-xs">
                  {new Date(h.at).toLocaleString("es-AR")}
                </span>
                <div>
                  <p className="text-gawer-charcoal">{h.label}</p>
                  {h.details && <p className="text-xs text-gawer-gray-500">{h.details}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gawer-gray-500">Sin eventos registrados todavía.</p>
        )}
      </div>
    </section>
  );
}
