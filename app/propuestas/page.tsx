"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { proposals, formatCurrency, commercialStates } from "@/lib/mock/gawerData";
import type { RiskLevel } from "@/lib/mock/gawerData";

const areas = [...new Set(proposals.map((p) => p.areaNegocio))];
const riesgos: RiskLevel[] = ["Bajo", "Medio", "Alto", "Crítico"];

export default function PropuestasPage() {
  const [showModal, setShowModal] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [filterRiesgo, setFilterRiesgo] = useState<string>("");
  const [filterScoreMin, setFilterScoreMin] = useState<string>("");

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (filterEstado && p.estado !== filterEstado) return false;
      if (filterArea && p.areaNegocio !== filterArea) return false;
      if (filterRiesgo && p.riesgo !== filterRiesgo) return false;
      if (filterScoreMin && p.score < Number(filterScoreMin)) return false;
      return true;
    });
  }, [filterEstado, filterArea, filterRiesgo, filterScoreMin]);

  return (
    <AppShell topbarTitle="Gestión comercial">
      <SectionHeader
        title="Propuestas"
        description="Listado de propuestas comerciales recibidas y en evaluación"
        action={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-4 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva propuesta
          </button>
        }
      />

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
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
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

        <select
          value={filterScoreMin}
          onChange={(e) => setFilterScoreMin(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          <option value="">Score mínimo</option>
          <option value="85">85+ Prioritaria</option>
          <option value="70">70+ Interesante</option>
          <option value="50">50+ Requiere info</option>
          <option value="30">30+ Débil</option>
        </select>
      </div>

      <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Empresa</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Área</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Monto</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Score</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Riesgo</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gawer-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gawer-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gawer-charcoal">{p.empresa}</p>
                    <p className="text-xs text-gawer-gray-500">{p.proponente}</p>
                  </td>
                  <td className="px-4 py-3 text-gawer-gray-700">{p.areaNegocio}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.montoEstimado, p.moneda)}</td>
                  <td className="px-4 py-3"><ScoreBadge score={p.score} size="sm" /></td>
                  <td className="px-4 py-3"><RiskBadge level={p.riesgo} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.estado} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/propuestas/${p.id}`} className="text-sm font-medium text-gawer-petrol hover:text-gawer-green">
                      Ver análisis
                    </Link>
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
            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Nombre completo", type: "text" },
                  { label: "Empresa", type: "text" },
                  { label: "Email", type: "email" },
                  { label: "Teléfono", type: "tel" },
                  { label: "País", type: "text" },
                  { label: "Rol en la operación", type: "text" },
                  { label: "Monto estimado", type: "number" },
                  { label: "Moneda", type: "text", placeholder: "USD" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gawer-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Área de negocio</label>
                <select className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm" disabled>
                  <option>Seleccionar área...</option>
                  {areas.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Descripción de la propuesta</label>
                <textarea rows={3} className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Documentos disponibles</label>
                <input type="text" placeholder="LOI, CIS, KYC..." className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm" readOnly />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Urgencia</label>
                  <select className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm" disabled>
                    <option>Baja</option><option>Media</option><option>Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gawer-gray-700 mb-1">Qué necesita de GAWER</label>
                  <input type="text" className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm" readOnly />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gawer-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md bg-gawer-green px-6 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light"
                >
                  Enviar propuesta (mock)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
