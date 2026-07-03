"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { tickets } from "@/lib/mock/gawerData";

const ticketTypes = [
  "Error", "Mejora", "Problema de IA", "Solicitud de nuevos campos",
  "Ajustes de scoring", "Cambios en base de conocimiento",
];

export default function MesaAyudaPage() {
  const [filterTipo, setFilterTipo] = useState("");

  const filtered = filterTipo
    ? tickets.filter((t) => t.tipo === filterTipo)
    : tickets;

  return (
    <AppShell topbarTitle="Mesa de ayuda">
      <SectionHeader
        title="Mesa de ayuda"
        description="Tickets internos para errores, mejoras y ajustes del sistema"
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-4 py-2.5 text-sm font-medium text-white hover:bg-gawer-green-light transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo ticket
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterTipo("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !filterTipo ? "bg-gawer-charcoal text-white" : "bg-white border border-gawer-gray-200 text-gawer-gray-600 hover:bg-gawer-gray-50"
          }`}
        >
          Todos
        </button>
        {ticketTypes.map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => setFilterTipo(tipo)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterTipo === tipo ? "bg-gawer-charcoal text-white" : "bg-white border border-gawer-gray-200 text-gawer-gray-600 hover:bg-gawer-gray-50"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Título</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Módulo</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Importancia</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Urgencia</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Responsable</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gawer-gray-100">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gawer-gray-50/50">
                <td className="px-4 py-3 font-medium text-gawer-charcoal">{ticket.titulo}</td>
                <td className="px-4 py-3 text-gawer-gray-600">{ticket.tipo}</td>
                <td className="px-4 py-3 text-gawer-gray-600">{ticket.moduloAfectado}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    ticket.importancia === "Alta" ? "text-red-600" :
                    ticket.importancia === "Media" ? "text-amber-600" : "text-gawer-gray-500"
                  }`}>
                    {ticket.importancia}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    ticket.urgencia === "Alta" ? "text-red-600" :
                    ticket.urgencia === "Media" ? "text-amber-600" : "text-gawer-gray-500"
                  }`}>
                    {ticket.urgencia}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={ticket.estado} /></td>
                <td className="px-4 py-3 text-gawer-gray-600">{ticket.responsable}</td>
                <td className="px-4 py-3 text-gawer-gray-500">{ticket.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
