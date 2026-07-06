"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, X, Siren, FlaskConical, Trash2, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { proposals, formatCurrency, commercialStates, documentChecklistOptions } from "@/lib/mock/gawerData";
import type { RiskLevel, AccesoPrincipal, NivelIntermediacion, CisEstado } from "@/lib/mock/gawerData";
import type { LocalProposal } from "@/lib/local/proposalsStore";
import { summarizeChecklist } from "@/lib/local/documentChecklist";
import { generateExecutiveBriefing } from "@/lib/local/executiveBriefing";

const riesgos: RiskLevel[] = ["Bajo", "Medio", "Alto", "Crítico"];
const accesos: AccesoPrincipal[] = ["Confirmado", "No confirmado", "Desconocido"];
const cadenas: NivelIntermediacion[] = ["Baja", "Media", "Alta", "Crítica"];
const cisOpciones: CisEstado[] = ["Recibido", "Pendiente"];

const CIS_KEY = documentChecklistOptions[0];

interface DisplayRow {
  id: string;
  esLocal: boolean;
  empresa: string;
  proponente: string;
  areaNegocio: string;
  montoEstimado: number;
  moneda: string;
  cis: CisEstado;
  accesoDirectoPrincipal: AccesoPrincipal;
  cadenaIntermediacion: NivelIntermediacion;
  score: number;
  riesgo: RiskLevel;
  estado: string;
  alertaCritica: boolean;
  recomendacionPreliminar?: string;
  responsable?: string;
  proximaAccion?: string;
  documentacionNivel?: string;
  briefingReadiness?: string;
}

function mapAccesoDirecto(v: string): AccesoPrincipal {
  if (v === "Sí") return "Confirmado";
  if (v === "No" || v === "Parcial") return "No confirmado";
  return "Desconocido";
}

function mapCadenaIntermediacion(v: string): NivelIntermediacion {
  if (v === "Ninguno" || v === "1") return "Baja";
  if (v === "2") return "Media";
  if (v === "3 o más") return "Alta";
  return "Crítica";
}

const mockRows: DisplayRow[] = proposals.map((p) => ({
  id: p.id,
  esLocal: false,
  empresa: p.empresa,
  proponente: p.proponente,
  areaNegocio: p.areaNegocio,
  montoEstimado: p.montoEstimado,
  moneda: p.moneda,
  cis: p.cis,
  accesoDirectoPrincipal: p.accesoDirectoPrincipal,
  cadenaIntermediacion: p.cadenaIntermediacion,
  score: p.score,
  riesgo: p.riesgo,
  estado: p.estado,
  alertaCritica: p.alertaCritica,
}));

function cisEstadoDesdeChecklist(lp: LocalProposal): CisEstado {
  const cisItem = lp.documentChecklist?.find((i) => i.id === "cis");
  if (!cisItem) return lp.input.documentos?.[CIS_KEY] ? "Recibido" : "Pendiente";
  return cisItem.estado === "Recibido" || cisItem.estado === "Validado preliminarmente"
    ? "Recibido"
    : "Pendiente";
}

function localToRow(lp: LocalProposal): DisplayRow {
  const input = lp.input;
  const checklistSummary = summarizeChecklist(lp.documentChecklist ?? []);
  return {
    id: lp.id,
    esLocal: true,
    empresa: input.empresa?.trim() || input.nombreCompleto || "Sin empresa",
    proponente: input.nombreCompleto || "Sin nombre",
    areaNegocio: input.areaNegocio || "Sin especificar",
    montoEstimado: Number(input.montoEstimado) || 0,
    moneda: input.moneda || "USD",
    cis: cisEstadoDesdeChecklist(lp),
    accesoDirectoPrincipal: mapAccesoDirecto(input.accesoDirecto),
    cadenaIntermediacion: mapCadenaIntermediacion(input.cantidadIntermediarios),
    score: lp.assessment.score,
    riesgo: lp.assessment.riesgo,
    estado: lp.seguimiento.estadoComercial,
    alertaCritica: input.mtnHsbcLtn === "Sí",
    recomendacionPreliminar: lp.assessment.estadoSugerido,
    responsable: lp.seguimiento.responsableInterno || undefined,
    proximaAccion: lp.seguimiento.proximaAccion || undefined,
    documentacionNivel: checklistSummary.nivelPreparacion,
    briefingReadiness: generateExecutiveBriefing(lp).readinessLevel,
  };
}

export default function PropuestasPage() {
  const [showModal, setShowModal] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [filterRiesgo, setFilterRiesgo] = useState<string>("");
  const [filterCis, setFilterCis] = useState<string>("");
  const [filterAcceso, setFilterAcceso] = useState<string>("");
  const [filterCadena, setFilterCadena] = useState<string>("");
  const [filterAlertaCritica, setFilterAlertaCritica] = useState(false);

  const [localProposals, setLocalProposals] = useState<LocalProposal[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [mode, setMode] = useState<"local" | "supabase">("local");

  const fetchLocalProposals = useCallback(async () => {
    try {
      const res = await fetch("/api/local/proposals");
      const data = await res.json();
      setLocalProposals(Array.isArray(data.proposals) ? data.proposals : []);
      setMode(data.mode === "supabase" ? "supabase" : "local");
    } catch {
      setLocalProposals([]);
    }
  }, []);

  useEffect(() => {
    fetchLocalProposals();
  }, [fetchLocalProposals]);

  async function handleClearLocal() {
    // Defensa en profundidad: el botón ya está deshabilitado/oculto en modo Supabase, y el
    // endpoint también rechaza el DELETE masivo — este chequeo evita además cualquier llamada
    // accidental desde acá si el estado de "mode" quedara desactualizado.
    if (mode === "supabase") return;
    const confirmado = window.confirm(
      "¿Confirmás que querés eliminar todas las propuestas guardadas localmente? Esta acción no afecta los datos mock."
    );
    if (!confirmado) return;
    setIsClearing(true);
    try {
      await fetch("/api/local/proposals", { method: "DELETE" });
      await fetchLocalProposals();
    } finally {
      setIsClearing(false);
    }
  }

  const allRows = useMemo(
    () => [...localProposals.map(localToRow), ...mockRows],
    [localProposals]
  );

  const areas = useMemo(() => [...new Set(allRows.map((r) => r.areaNegocio))], [allRows]);

  const filtered = useMemo(() => {
    return allRows.filter((p) => {
      if (filterEstado && p.estado !== filterEstado) return false;
      if (filterArea && p.areaNegocio !== filterArea) return false;
      if (filterRiesgo && p.riesgo !== filterRiesgo) return false;
      if (filterCis && p.cis !== filterCis) return false;
      if (filterAcceso && p.accesoDirectoPrincipal !== filterAcceso) return false;
      if (filterCadena && p.cadenaIntermediacion !== filterCadena) return false;
      if (filterAlertaCritica && !p.alertaCritica) return false;
      return true;
    });
  }, [allRows, filterEstado, filterArea, filterRiesgo, filterCis, filterAcceso, filterCadena, filterAlertaCritica]);

  return (
    <AppShell topbarTitle="Gestión comercial">
      <SectionHeader
        title="Propuestas"
        description="GAWER descarta aproximadamente el 90% de las propuestas recibidas, principalmente por intermediarios sin acceso directo al titular del negocio."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {mode === "supabase" ? (
              <button
                type="button"
                disabled
                title="La limpieza masiva está deshabilitada en modo Supabase para proteger propuestas reales."
                className="inline-flex items-center gap-2 rounded-md border border-gawer-gray-200 bg-gawer-gray-50 px-4 py-2.5 text-sm font-medium text-gawer-gray-400 cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar propuestas locales
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClearLocal}
                disabled={isClearing || localProposals.length === 0}
                className="inline-flex items-center gap-2 rounded-md border border-gawer-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gawer-gray-700 hover:bg-gawer-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar propuestas locales
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-4 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nueva propuesta
            </button>
          </div>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-gold/30 bg-gawer-gold/10 p-4">
        <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Esta vista combina propuestas mock con propuestas guardadas localmente para validar el flujo
          operativo antes de activar una base de datos real. Las propuestas locales se leen desde el
          entorno de desarrollo (localhost) y no representan datos de producción.
        </p>
      </div>

      {mode === "supabase" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-4">
          <ShieldAlert className="h-4 w-4 text-gawer-petrol shrink-0 mt-0.5" />
          <p className="text-xs text-gawer-gray-700">
            La limpieza masiva está deshabilitada en modo Supabase para proteger propuestas reales.
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {commercialStates.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Todas las subáreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          value={filterCis}
          onChange={(e) => setFilterCis(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">CIS: todos</option>
          {cisOpciones.map((c) => (
            <option key={c} value={c}>CIS {c.toLowerCase()}</option>
          ))}
        </select>

        <select
          value={filterAcceso}
          onChange={(e) => setFilterAcceso(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Acceso directo: todos</option>
          {accesos.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          value={filterCadena}
          onChange={(e) => setFilterCadena(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Cadena de intermediación: todas</option>
          {cadenas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterRiesgo}
          onChange={(e) => setFilterRiesgo(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Todos los riesgos</option>
          {riesgos.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setFilterAlertaCritica((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 h-9 text-sm font-medium transition-colors ${
            filterAlertaCritica
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-gawer-gray-200 bg-white text-gawer-gray-600 hover:bg-gawer-gray-50"
          }`}
        >
          <Siren className="h-4 w-4" />
          Solo alertas críticas
        </button>
      </div>

      <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Empresa</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Subárea</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Monto</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">CIS</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Acceso directo</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Cadena interm.</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Score</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Riesgo</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gawer-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gawer-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/propuestas/${p.id}`}
                        className="font-medium text-gawer-charcoal hover:text-gawer-petrol hover:underline"
                      >
                        {p.empresa}
                      </Link>
                      {p.alertaCritica && <Siren className="h-3.5 w-3.5 text-red-600" />}
                      {p.esLocal && (
                        <span
                          title="Ingresada desde formulario público local"
                          className="rounded-md border border-gawer-gold/40 bg-gawer-gold/10 px-1.5 py-0.5 text-[10px] font-medium text-gawer-gold whitespace-nowrap"
                        >
                          Propuesta local
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gawer-gray-500">{p.proponente}</p>
                    {p.esLocal && p.responsable && (
                      <p className="text-[10px] text-gawer-gray-400 mt-0.5">Responsable: {p.responsable}</p>
                    )}
                    {p.esLocal && p.proximaAccion && (
                      <p className="text-[10px] text-gawer-gray-400">Próxima acción: {p.proximaAccion}</p>
                    )}
                    <Link
                      href={`/propuestas/${p.id}`}
                      className="mt-1 inline-block text-xs font-medium text-gawer-petrol hover:text-gawer-green hover:underline"
                    >
                      Abrir ficha →
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gawer-gray-700">{p.areaNegocio}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.montoEstimado, p.moneda)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.cis} />
                    {p.esLocal && p.documentacionNivel && (
                      <p className="mt-1 text-[10px] text-gawer-gray-400 whitespace-nowrap">
                        Documentación: {p.documentacionNivel}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.accesoDirectoPrincipal} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.cadenaIntermediacion} /></td>
                  <td className="px-4 py-3"><ScoreBadge score={p.score} size="sm" /></td>
                  <td className="px-4 py-3"><RiskBadge level={p.riesgo} /></td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.estado} />
                    {p.esLocal && p.recomendacionPreliminar && (
                      <p className="mt-1 text-[10px] text-gawer-gray-400 whitespace-nowrap">
                        Sugerido: {p.recomendacionPreliminar}
                      </p>
                    )}
                    {p.esLocal && p.briefingReadiness && (
                      <p className="mt-0.5 text-[10px] text-gawer-gray-400 whitespace-nowrap">
                        Briefing: {p.briefingReadiness}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gawer-gray-500">
            No hay propuestas que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gawer-gray-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-gawer-charcoal">Nueva propuesta</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-md p-1 hover:bg-gawer-gray-100">
                <X className="h-5 w-5 text-gawer-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gawer-gray-600">
                Para dar de alta una propuesta real en el entorno local, usá el{" "}
                <Link href="/propuesta" target="_blank" className="font-medium text-gawer-petrol hover:text-gawer-green">
                  formulario público
                </Link>{" "}
                — queda guardada automáticamente y aparece en este listado.
              </p>
              <div className="flex justify-end pt-4 border-t border-gawer-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md bg-gawer-green px-6 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
