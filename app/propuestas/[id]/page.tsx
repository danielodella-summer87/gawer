import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Brain, FileText, MessageSquare, History } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getProposalById,
  formatCurrency,
  getScoreCategory,
  documents,
} from "@/lib/mock/gawerData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropuestaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = getProposalById(id);

  if (!proposal) notFound();

  const proposalDocs = documents.filter((d) => d.propuestaId === proposal.id);

  return (
    <AppShell topbarTitle="Ficha de oportunidad">
      <div className="mb-6">
        <Link
          href="/propuestas"
          className="inline-flex items-center gap-1 text-sm text-gawer-gray-500 hover:text-gawer-petrol transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a propuestas
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gawer-charcoal">{proposal.empresa}</h1>
          <p className="text-sm text-gawer-gray-500 mt-1">{proposal.proponente} · {proposal.pais}</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBadge score={proposal.score} size="lg" showCategory />
          <RiskBadge level={proposal.riesgo} />
          <StatusBadge status={proposal.estado} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Resumen ejecutivo
            </h2>
            <p className="text-sm text-gawer-gray-700 leading-relaxed">{proposal.resumenEjecutivo}</p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Descripción
            </h2>
            <p className="text-sm text-gawer-gray-700 leading-relaxed">{proposal.descripcion}</p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Análisis IA (mock)
              </h2>
            </div>
            <p className="text-sm text-gawer-gray-700 leading-relaxed mb-3">{proposal.recomendacionIA}</p>
            <div className="rounded-md bg-gawer-green/5 border border-gawer-green/20 p-3">
              <p className="text-xs font-medium text-gawer-green mb-1">Decisión recomendada</p>
              <p className="text-sm text-gawer-charcoal">{proposal.decisionRecomendada}</p>
            </div>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Documentación
              </h2>
            </div>
            {proposalDocs.length > 0 ? (
              <ul className="space-y-2">
                {proposalDocs.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between rounded-md border border-gawer-gray-100 px-3 py-2">
                    <span className="text-sm text-gawer-charcoal">{doc.nombre}</span>
                    <StatusBadge status={doc.estado} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gawer-gray-500">Sin documentos registrados.</p>
            )}
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Historial
              </h2>
            </div>
            <ul className="space-y-3">
              {proposal.historial.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-gawer-gray-400 shrink-0 w-24">{h.fecha}</span>
                  <span className="text-gawer-charcoal">{h.evento}</span>
                  <span className="text-gawer-gray-500 ml-auto">{h.responsable}</span>
                </li>
              ))}
            </ul>
          </section>

          {proposal.comentariosEjecutivos.length > 0 && (
            <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-gawer-petrol" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                  Comentarios ejecutivos
                </h2>
              </div>
              {proposal.comentariosEjecutivos.map((c, i) => (
                <div key={i} className="rounded-md bg-gawer-gray-50 p-3 mb-2 last:mb-0">
                  <p className="text-xs text-gawer-gray-500 mb-1">{c.autor} · {c.fecha}</p>
                  <p className="text-sm text-gawer-charcoal">{c.texto}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Datos del proponente
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Email", proposal.email],
                ["Teléfono", proposal.telefono],
                ["País", proposal.pais],
                ["Rol", proposal.rol],
                ["Área", proposal.areaNegocio],
                ["Monto", formatCurrency(proposal.montoEstimado, proposal.moneda)],
                ["Urgencia", proposal.urgencia],
                ["Recibida", proposal.fechaRecepcion],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-gawer-gray-500">{label}</dt>
                  <dd className="font-medium text-gawer-charcoal text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Scores
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Score GAWER", proposal.score],
                ["Comercial", proposal.scoreComercial],
                ["Documental", proposal.scoreDocumental],
                ["Riesgo", proposal.scoreRiesgo],
                ["Viabilidad", proposal.scoreViabilidad],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-center">
                  <dt className="text-gawer-gray-500">{label}</dt>
                  <dd><ScoreBadge score={value as number} size="sm" /></dd>
                </div>
              ))}
              <div className="pt-2 border-t border-gawer-gray-100">
                <p className="text-xs text-gawer-gray-500">Categoría</p>
                <p className="text-sm font-medium text-gawer-charcoal">{getScoreCategory(proposal.score)}</p>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-6">
            <h2 className="text-sm font-semibold text-gawer-petrol mb-2">Próxima acción</h2>
            <p className="text-sm text-gawer-charcoal">{proposal.proximaAccion}</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
