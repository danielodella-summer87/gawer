import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { reportData } from "@/lib/mock/gawerData";

export default function ReportesPage() {
  const maxAreaCount = Math.max(...reportData.propuestasPorArea.map((a) => a.count));
  const maxDescarteCount = Math.max(...reportData.motivosDescarte.map((m) => m.count));
  const maxEstadoCount = Math.max(...reportData.oportunidadesPorEstado.map((e) => e.count));

  return (
    <AppShell topbarTitle="Reportes">
      <SectionHeader
        title="Reportes"
        description="Indicadores de rendimiento y análisis del pipeline comercial"
      />

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
          <h2 className="text-sm font-semibold text-gawer-charcoal mb-4">Propuestas por subárea</h2>
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
          <h2 className="text-sm font-semibold text-gawer-charcoal mb-4">Motivos de descarte</h2>
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
          <h2 className="text-sm font-semibold text-gawer-charcoal mb-4">Riesgos detectados</h2>
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
          <h2 className="text-sm font-semibold text-gawer-charcoal mb-4">Oportunidades por estado</h2>
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
