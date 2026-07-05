import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { RiskBadge } from "@/components/RiskBadge";
import { reportData } from "@/lib/mock/gawerData";
import { readAllProposals } from "@/lib/data/proposalsRepository";
import { buildLocalReports } from "@/lib/local/localReports";

// Lee .local-data/gawer/proposals.json en cada request — no debe quedar congelado
// como página estática generada en build time.
export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  const maxAreaCount = Math.max(...reportData.propuestasPorArea.map((a) => a.count));
  const maxDescarteCount = Math.max(...reportData.motivosDescarte.map((m) => m.count));
  const maxEstadoCount = Math.max(...reportData.oportunidadesPorEstado.map((e) => e.count));

  const localProposals = await readAllProposals();
  const local = buildLocalReports(localProposals);
  const maxAreaLocal = Math.max(1, ...local.byArea.map((a) => a.count));
  const maxEstadoLocal = Math.max(1, ...local.byEstado.map((e) => e.count));
  const maxMotivoLocal = Math.max(
    1,
    ...Object.values(local.blockingReasons)
  );

  const motivoLabels: Record<keyof typeof local.blockingReasons, string> = {
    faltaCis: "Falta CIS",
    faltaAccesoDirecto: "Falta acceso directo al principal",
    faltaMandato: "Falta mandato/autorización",
    documentacionInsuficiente: "Documentación insuficiente",
    riesgoCritico: "Riesgo crítico",
    mtnHsbcLtn: "MTNs HSBC / LTNs brasileras",
    cadenaIntermediacionAlta: "Cadena de intermediación alta/crítica",
    informacionEsencialIncompleta: "Información esencial incompleta",
  };

  return (
    <AppShell topbarTitle="Reportes">
      <SectionHeader
        title="Reportes"
        description="Indicadores de rendimiento y análisis del pipeline comercial"
      />

      {/* ───────────── Reportes locales ───────────── */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gawer-charcoal">Reportes locales</h2>
      </div>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-gold/30 bg-gawer-gold/10 p-4">
        <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Estos indicadores corresponden únicamente a propuestas guardadas en el entorno local de
          desarrollo (.local-data/gawer/proposals.json). No se mezclan con los datos mock ni con datos
          productivos.
        </p>
      </div>

      {localProposals.length === 0 ? (
        <div className="mb-12">
          <EmptyState
            title="No hay datos locales para reportar todavía."
            description="Complete una propuesta desde el formulario público para ver indicadores operativos."
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
        </div>
      ) : (
        <div className="mb-12 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Panorama general
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard title="Propuestas locales" value={local.kpis.totalPropuestasLocales} />
              <StatCard title="Listas para Fernando/Liliana" value={local.kpis.listasFernandoLiliana} variant="success" />
              <StatCard title="En preparación" value={local.kpis.enPreparacion} variant="warning" />
              <StatCard title="No listas" value={local.kpis.noListas} variant="danger" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Documentación
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard title="Pendientes de CIS" value={local.kpis.pendientesCis} />
              <StatCard title="Documentación baja" value={local.kpis.documentacionBaja} variant="danger" />
              <StatCard title="Documentación media" value={local.kpis.documentacionMedia} variant="warning" />
              <StatCard title="Documentación alta" value={local.kpis.documentacionAlta} variant="success" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Acceso y riesgo
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard title="Con acceso directo confirmado" value={local.kpis.conAccesoDirectoConfirmado} variant="success" />
              <StatCard title="Sin acceso directo ni mandato" value={local.kpis.sinAccesoNiMandato} />
              <StatCard title="Riesgo crítico" value={local.kpis.riesgoCritico} variant="danger" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
              Seguimiento operativo
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard title="Con próxima acción" value={local.kpis.conProximaAccion} />
              <StatCard title="Sin responsable" value={local.kpis.sinResponsable} />
              <StatCard title="Marcadas revisión ejecutiva" value={local.kpis.marcadasRevisionEjecutiva} variant="success" />
              <StatCard title="Respuestas sugeridas copiadas" value={local.kpis.respuestasSugeridasCopiadas} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Principales motivos de bloqueo</h3>
              <div className="space-y-3">
                {(Object.keys(local.blockingReasons) as (keyof typeof local.blockingReasons)[]).map((key) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gawer-gray-700">{motivoLabels[key]}</span>
                      <span className="font-medium text-gawer-charcoal">{local.blockingReasons[key]}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gawer-gray-100">
                      <div
                        className="h-2 rounded-full bg-red-400"
                        style={{ width: `${(local.blockingReasons[key] / maxMotivoLocal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Distribución por área de negocio</h3>
              <div className="space-y-3">
                {local.byArea.map((item) => (
                  <div key={item.area}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gawer-gray-700">{item.area}</span>
                      <span className="font-medium text-gawer-charcoal">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gawer-gray-100">
                      <div
                        className="h-2 rounded-full bg-gawer-petrol"
                        style={{ width: `${(item.count / maxAreaLocal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Estado comercial</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {local.byEstado.map((item) => (
                  <div key={item.estado}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gawer-gray-700">{item.estado}</span>
                      <span className="font-medium text-gawer-charcoal">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gawer-gray-100">
                      <div
                        className="h-2 rounded-full bg-gawer-green"
                        style={{ width: `${(item.count / maxEstadoLocal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-6">
            <h3 className="text-sm font-semibold text-gawer-petrol mb-1">
              Tiempo ejecutivo potencialmente ahorrado
            </h3>
            <p className="text-xs text-gawer-gray-500 mb-3">
              Estimación local orientativa — no constituye una promesa de resultados.
            </p>
            <p className="text-2xl font-semibold text-gawer-charcoal mb-3">
              {local.timeSaved.horasTotales} horas ({local.timeSaved.minutosTotales} min)
            </p>
            {local.timeSaved.detalle.length > 0 ? (
              <ul className="space-y-1">
                {local.timeSaved.detalle.map((linea, i) => (
                  <li key={i} className="text-xs text-gawer-gray-600">• {linea}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gawer-gray-500">Sin bloqueos ni riesgos detectados todavía.</p>
            )}
            <p className="text-xs text-gawer-gray-500 mt-3">
              Fórmula: 30 min por propuesta bloqueada/no lista, 60 min por propuesta de riesgo crítico,
              20 min por propuesta con CIS pendiente o sin acceso directo. Las reglas se suman de forma
              independiente por propuesta.
            </p>
          </section>

          <section className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-sm font-semibold text-gawer-charcoal mb-1">Propuestas que requieren atención</h3>
              <p className="text-xs text-gawer-gray-500 mb-4">
                Listas para revisión ejecutiva, con próxima acción vencida u hoy, riesgo crítico, sin
                responsable, o con CIS pendiente.
              </p>
            </div>
            {local.attentionItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Empresa</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Área</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Briefing</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Riesgo</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Documentación</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Responsable</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Próxima acción</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Motivo de atención</th>
                      <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gawer-gray-100">
                    {local.attentionItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gawer-gray-50/50 align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gawer-charcoal">{item.empresa}</p>
                          <p className="text-xs text-gawer-gray-500">{item.proponente}</p>
                        </td>
                        <td className="px-4 py-3 text-gawer-gray-700">{item.areaNegocio}</td>
                        <td className="px-4 py-3"><StatusBadge status={item.estadoComercial} /></td>
                        <td className="px-4 py-3"><StatusBadge status={item.briefingReadiness} /></td>
                        <td className="px-4 py-3"><RiskBadge level={item.riesgo} /></td>
                        <td className="px-4 py-3">{item.nivelDocumental}</td>
                        <td className="px-4 py-3 text-gawer-gray-700">{item.responsable || "Sin asignar"}</td>
                        <td className="px-4 py-3 text-gawer-gray-700">
                          {item.proximaAccion || "—"}
                          {item.fechaProximaAccion && (
                            <span className="block text-xs text-gawer-gray-400">{item.fechaProximaAccion}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.motivos.map((m, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-gawer-gray-100 px-1.5 py-0.5 text-[10px] text-gawer-gray-600 whitespace-nowrap"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/propuestas/${item.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-gawer-petrol hover:text-gawer-green whitespace-nowrap"
                          >
                            Abrir ficha <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-6 pb-6 text-sm text-gawer-gray-500">Ninguna propuesta local requiere atención en este momento.</p>
            )}
          </section>
        </div>
      )}

      {/* ───────────── Reportes mock (vista demo base) ───────────── */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gawer-charcoal">Reportes mock (vista demo base)</h2>
        <p className="text-sm text-gawer-gray-500">
          Datos de demostración originales de la maqueta, sin relación con las propuestas locales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Score promedio" value={reportData.scorePromedio} subtitle="Pipeline activo" />
        <StatCard
          title="Tiempo ahorrado"
          value={reportData.tiempoAhorradoEstimado}
          subtitle="Estimado acumulado"
          variant="success"
        />
        <StatCard
          title="Riesgos críticos"
          value={reportData.riesgosDetectados.critico}
          subtitle="Requieren atención inmediata"
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Descartes por intermediación sin acceso"
          value={reportData.indicadoresClave.descartesPorIntermediacionSinAcceso}
        />
        <StatCard title="Propuestas sin CIS" value={reportData.indicadoresClave.propuestasSinCIS} />
        <StatCard
          title="Documentación incompleta"
          value={reportData.indicadoresClave.propuestasConDocumentacionIncompleta}
        />
        <StatCard
          title="Inconsistencias documentales"
          value={reportData.indicadoresClave.propuestasConInconsistenciasDocumentales}
          variant="warning"
        />
        <StatCard
          title="Listas para Fernando/Liliana"
          value={reportData.indicadoresClave.oportunidadesListasParaFernandoLiliana}
          variant="success"
        />
        <StatCard
          title="Ganadas — remuneración percibida"
          value={reportData.indicadoresClave.operacionesGanadasConRemuneracionPercibida}
          subtitle="Solo cuenta si GAWER cobró"
          variant="success"
        />
        <StatCard
          title="Perdidas por requisitos mínimos"
          value={reportData.indicadoresClave.operacionesPerdidasPorRequisitosMinimos}
        />
        <StatCard
          title="Descartadas — falsedad o falta de info"
          value={reportData.indicadoresClave.operacionesDescartadasPorFalsedadOFaltaInfo}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Propuestas por subárea</h3>
          <div className="space-y-3">
            {reportData.propuestasPorArea.map((item) => (
              <div key={item.area}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gawer-gray-700">{item.area}</span>
                  <span className="font-medium text-gawer-charcoal">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gawer-gray-100">
                  <div
                    className="h-2 rounded-full bg-gawer-petrol"
                    style={{ width: `${(item.count / maxAreaCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Motivos de descarte</h3>
          <div className="space-y-3">
            {reportData.motivosDescarte.map((item) => (
              <div key={item.motivo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gawer-gray-700">{item.motivo}</span>
                  <span className="font-medium text-gawer-charcoal">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gawer-gray-100">
                  <div
                    className="h-2 rounded-full bg-red-400"
                    style={{ width: `${(item.count / maxDescarteCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Riesgos detectados</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(reportData.riesgosDetectados).map(([level, count]) => (
              <div key={level} className="rounded-md bg-gawer-gray-50 p-4 text-center">
                <p className="text-2xl font-semibold text-gawer-charcoal">{count}</p>
                <p className="text-xs text-gawer-gray-500 capitalize mt-1">{level}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gawer-charcoal mb-4">Oportunidades por estado</h3>
          <div className="space-y-3">
            {reportData.oportunidadesPorEstado.map((item) => (
              <div key={item.estado}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gawer-gray-700">{item.estado}</span>
                  <span className="font-medium text-gawer-charcoal">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gawer-gray-100">
                  <div
                    className="h-2 rounded-full bg-gawer-green"
                    style={{ width: `${(item.count / maxEstadoCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
