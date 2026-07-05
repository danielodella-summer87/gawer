import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  FileText,
  MessageSquare,
  History,
  ShieldAlert,
  ScaleIcon,
  Landmark,
  Cog,
  Siren,
  UserCheck,
  FlaskConical,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getProposalById,
  formatCurrency,
  getRankingCategory,
  documents,
  documentChecklistOptions,
} from "@/lib/mock/gawerData";
import { getLocalProposalById, type LocalProposal } from "@/lib/local/proposalsStore";
import { generateExecutiveBriefing } from "@/lib/local/executiveBriefing";
import { LocalFollowUpPanel } from "@/components/LocalFollowUpPanel";
import { LocalDocumentChecklistPanel } from "@/components/LocalDocumentChecklistPanel";
import { LocalExecutiveBriefingPanel } from "@/components/LocalExecutiveBriefingPanel";

interface PageProps {
  params: Promise<{ id: string }>;
}

function LocalProposalDetail({ proposal }: { proposal: LocalProposal }) {
  const { input, assessment } = proposal;
  const documentosMarcados = documentChecklistOptions.filter((d) => input.documentos?.[d]);
  const briefing = generateExecutiveBriefing(proposal);

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

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-gold/30 bg-gawer-gold/10 p-4">
        <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-gray-700">
          <span className="font-semibold">Propuesta local — entorno de desarrollo.</span> Ingresada desde
          el formulario público local. No usar como dato productivo.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold text-gawer-charcoal">
              {input.empresa?.trim() || input.nombreCompleto || "Sin empresa"}
            </h1>
            {input.mtnHsbcLtn === "Sí" && (
              <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <Siren className="h-3.5 w-3.5" /> Alerta crítica
              </span>
            )}
          </div>
          <p className="text-sm text-gawer-gray-500 mt-1">
            {input.nombreCompleto} · {input.pais || "País no informado"} · {input.areaNegocio}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-4">
            <ScoreBadge score={assessment.score} size="lg" />
            <RiskBadge level={assessment.riesgo} />
            <StatusBadge status={proposal.seguimiento.estadoComercial} />
          </div>
          <p className="text-[10px] text-gawer-gray-400">
            Recomendación preliminar del sistema: {assessment.estadoSugerido}
          </p>
        </div>
      </div>

      {input.mtnHsbcLtn === "Sí" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span className="font-semibold">Regla crítica validada por Fernando:</span> MTNs del HSBC
          respaldadas en LTNs brasileras — GAWER no opera este instrumento.
        </div>
      )}

      <div className="mb-8 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-4">
        <ShieldAlert className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal">
          La IA no aprueba, rechaza ni descarta operaciones de forma autónoma. Toda decisión definitiva
          corresponde al equipo de GAWER.
        </p>
      </div>

      <div className="mb-8">
        <LocalExecutiveBriefingPanel
          proposalId={proposal.id}
          briefing={briefing}
          estadoComercialActual={proposal.seguimiento.estadoComercial}
        />
      </div>

      <div className="mb-8">
        <LocalFollowUpPanel
          proposalId={proposal.id}
          initialSeguimiento={proposal.seguimiento}
          initialHistorial={proposal.historial}
        />
      </div>

      <div className="mb-8">
        <LocalDocumentChecklistPanel
          proposalId={proposal.id}
          initialChecklist={proposal.documentChecklist}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Descripción
            </h2>
            <p className="text-sm text-gawer-gray-700 leading-relaxed">
              {input.descripcionOperacion || "Sin descripción."}
            </p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Acceso al principal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <UserCheck className="h-3.5 w-3.5 text-gawer-gray-500" />
                  <p className="text-xs text-gawer-gray-500">Acceso directo al principal</p>
                </div>
                <p className="text-sm font-medium text-gawer-charcoal">{input.accesoDirecto || "No especificado"}</p>
              </div>
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <p className="text-xs text-gawer-gray-500 mb-2">Mandato / autorización</p>
                <p className="text-sm font-medium text-gawer-charcoal">{input.mandato || "No especificado"}</p>
              </div>
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <p className="text-xs text-gawer-gray-500 mb-2">Cantidad de intermediarios</p>
                <p className="text-sm font-medium text-gawer-charcoal">{input.cantidadIntermediarios || "No especificado"}</p>
              </div>
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <p className="text-xs text-gawer-gray-500 mb-2">Tipo de proponente</p>
                <p className="text-sm font-medium text-gawer-charcoal">{input.tipoProponente || "No especificado"}</p>
              </div>
            </div>
            {input.relacionTitular && (
              <p className="text-sm text-gawer-gray-600 italic">“{input.relacionTitular}”</p>
            )}
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Documentación marcada por el proponente
              </h2>
            </div>
            {documentosMarcados.length > 0 ? (
              <ul className="space-y-1">
                {documentosMarcados.map((d) => (
                  <li key={d} className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-green">
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gawer-gray-500">Sin documentos marcados como disponibles.</p>
            )}
            <p className="mt-4 text-xs text-gawer-gray-500 italic">
              Ningún documento aislado valida una operación. La evaluación considera el conjunto documental y el contexto específico.
            </p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Evaluación preliminar (determinística, sin IA)
              </h2>
            </div>
            <p className="text-xs text-gawer-gray-500 mb-2">Razones del score</p>
            <ul className="space-y-1 mb-4">
              {assessment.razones.map((r, i) => (
                <li key={i} className="text-sm text-gawer-gray-700">• {r}</li>
              ))}
            </ul>
            <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-200 p-3">
              <p className="text-xs font-medium text-gawer-charcoal mb-1">Revisión humana obligatoria</p>
              <p className="text-xs text-gawer-gray-600">
                Esta evaluación es una sugerencia preliminar. Toda decisión definitiva corresponde al equipo de GAWER.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Datos del proponente
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Email", input.email],
                ["Teléfono", input.telefono || "—"],
                ["País", input.pais || "—"],
                ["Ciudad", input.ciudad || "—"],
                ["Cargo", input.cargo || "—"],
                ["Subárea", input.areaNegocio],
                ["Monto", input.montoEstimado ? formatCurrency(Number(input.montoEstimado) || 0, input.moneda || "USD") : "—"],
                ["Urgencia", input.urgencia || "—"],
                ["Creada", new Date(proposal.createdAt).toLocaleString("es-AR")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-gawer-gray-500">{label}</dt>
                  <dd className="font-medium text-gawer-charcoal text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-6">
            <h2 className="text-sm font-semibold text-gawer-petrol mb-2">Recomendación preliminar del sistema</h2>
            <p className="text-sm text-gawer-charcoal">{assessment.estadoSugerido}</p>
            <p className="text-xs text-gawer-gray-500 mt-1">
              No vinculante. El estado comercial oficial se gestiona en el bloque de seguimiento.
            </p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">ID local</p>
            <p className="text-xs font-mono text-gawer-gray-600 break-all">{proposal.id}</p>
            <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mt-3 mb-1">Origen</p>
            <p className="text-xs text-gawer-gray-600">{proposal.source}</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

export default async function PropuestaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = getProposalById(id);

  if (!proposal) {
    const localProposal = await getLocalProposalById(id);
    if (localProposal) {
      return <LocalProposalDetail proposal={localProposal} />;
    }
    notFound();
  }

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

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold text-gawer-charcoal">{proposal.empresa}</h1>
            {proposal.alertaCritica && (
              <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <Siren className="h-3.5 w-3.5" /> Alerta crítica
              </span>
            )}
          </div>
          <p className="text-sm text-gawer-gray-500 mt-1">{proposal.proponente} · {proposal.pais} · {proposal.areaNegocio}</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreBadge score={proposal.score} size="lg" showCategory />
          <RiskBadge level={proposal.riesgo} />
          <StatusBadge status={proposal.estado} />
        </div>
      </div>

      {proposal.alertaCritica && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span className="font-semibold">Regla crítica validada por Fernando:</span> {proposal.alertaCriticaMotivo}
        </div>
      )}

      <div className="mb-8 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-4">
        <ShieldAlert className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal">
          La IA no aprueba, rechaza ni descarta operaciones de forma autónoma. Toda decisión definitiva corresponde al equipo de GAWER.
        </p>
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Capacidad demostrada
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Capacidad jurídica", value: proposal.capacidadJuridica, icon: ScaleIcon },
                { label: "Capacidad financiera", value: proposal.capacidadFinanciera, icon: Landmark },
                { label: "Capacidad operativa", value: proposal.capacidadOperativa, icon: Cog },
              ].map((c) => (
                <div key={c.label} className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <c.icon className="h-3.5 w-3.5 text-gawer-gray-500" />
                    <p className="text-xs text-gawer-gray-500">{c.label}</p>
                  </div>
                  <StatusBadge status={c.value} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-4">
              Acceso directo e intermediación
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <p className="text-xs text-gawer-gray-500 mb-2">CIS / Hoja de Información Corporativa</p>
                <StatusBadge status={proposal.cis} />
              </div>
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <UserCheck className="h-3.5 w-3.5 text-gawer-gray-500" />
                  <p className="text-xs text-gawer-gray-500">Acceso directo al principal</p>
                </div>
                <StatusBadge status={proposal.accesoDirectoPrincipal} />
              </div>
              <div className="rounded-md border border-gawer-gray-100 bg-gawer-gray-50 p-3">
                <p className="text-xs text-gawer-gray-500 mb-2">Cadena de intermediación</p>
                <StatusBadge status={proposal.cadenaIntermediacion} />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Documentación
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-2">Documentos recibidos</p>
                {proposal.documentosRecibidos.length > 0 ? (
                  <ul className="space-y-1">
                    {proposal.documentosRecibidos.map((d, i) => (
                      <li key={i} className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-green">
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gawer-gray-500">Sin documentos recibidos.</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-2">Documentos faltantes</p>
                {proposal.documentosFaltantes.length > 0 ? (
                  <ul className="space-y-1">
                    {proposal.documentosFaltantes.map((d, i) => (
                      <li key={i} className="text-sm text-amber-800 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-amber-600">
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gawer-gray-500">Ninguno registrado.</p>
                )}
              </div>
            </div>

            {proposal.inconsistenciasDetectadas.length > 0 && (
              <div className="mb-4 rounded-md border border-orange-200 bg-orange-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 mb-2">Inconsistencias detectadas</p>
                <ul className="space-y-1">
                  {proposal.inconsistenciasDetectadas.map((d, i) => (
                    <li key={i} className="text-sm text-orange-800 pl-4 relative before:content-['⚠'] before:absolute before:left-0 before:text-xs">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
              <p className="text-sm text-gawer-gray-500">Sin documentos registrados en el repositorio.</p>
            )}
            <p className="mt-4 text-xs text-gawer-gray-500 italic">
              Ningún documento aislado valida una operación. La evaluación considera el conjunto documental y el contexto específico.
            </p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-gawer-petrol" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
                Decisión IA sugerida (no vinculante)
              </h2>
            </div>
            <p className="text-sm text-gawer-gray-700 leading-relaxed mb-3">{proposal.recomendacionIA}</p>
            <div className="rounded-md bg-gawer-green/5 border border-gawer-green/20 p-3 mb-3">
              <p className="text-xs font-medium text-gawer-green mb-1">Sugerencia (pendiente de validación GAWER)</p>
              <p className="text-sm text-gawer-charcoal">{proposal.decisionSugerida}</p>
            </div>
            <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-200 p-3">
              <p className="text-xs font-medium text-gawer-charcoal mb-1">Revisión humana obligatoria</p>
              <p className="text-xs text-gawer-gray-600">
                {proposal.requiereRevisionFernandoLiliana
                  ? proposal.motivoRevisionFernandoLiliana ??
                    "El cliente cumplió requisitos básicos y la operación muestra indicios razonables de viabilidad."
                  : "Continúa en evaluación del equipo comercial. Fernando o Liliana intervienen cuando se cumplan los requisitos básicos y existan indicios razonables de viabilidad."}
              </p>
            </div>
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
                ["Subárea", proposal.areaNegocio],
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
              Dimensiones de ranking
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Grado de preparación", proposal.gradoPreparacion],
                ["Calidad documental", proposal.calidadDocumental],
                ["Riesgo documental", proposal.riesgoDocumental],
                ["Probabilidad de cierre", proposal.probabilidadCierre],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between items-center">
                  <dt className="text-gawer-gray-500">{label}</dt>
                  <dd><ScoreBadge score={value as number} size="sm" /></dd>
                </div>
              ))}
              <div className="pt-2 border-t border-gawer-gray-100">
                <p className="text-xs text-gawer-gray-500">Categoría sugerida (no vinculante)</p>
                <p className="text-sm font-medium text-gawer-charcoal">{getRankingCategory(proposal)}</p>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-6">
            <h2 className="text-sm font-semibold text-gawer-petrol mb-2">Próxima acción sugerida</h2>
            <p className="text-sm text-gawer-charcoal">{proposal.proximaAccion}</p>
          </section>

          <section className="rounded-lg border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-sm font-semibold text-purple-800 mb-2">¿Cuándo interviene Fernando/Liliana?</h2>
            <p className="text-sm text-purple-900">
              {proposal.requiereRevisionFernandoLiliana
                ? "Sí — el cliente cumplió requisitos básicos y la operación muestra indicios razonables de viabilidad."
                : "Aún no — la primera consulta la gestiona el equipo comercial hasta cumplir requisitos básicos."}
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
