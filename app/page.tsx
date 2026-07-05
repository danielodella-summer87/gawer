import {
  Inbox,
  ShieldAlert,
  FileCheck2,
  UserCheck,
  AlertTriangle,
  Clock,
  Siren,
  Globe,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { OpportunityTable } from "@/components/OpportunityTable";
import { dashboardStats, proposals } from "@/lib/mock/gawerData";

export default function DashboardPage() {
  const casosParaRevisionEjecutiva = proposals.filter(
    (p) => p.requiereRevisionFernandoLiliana
  );
  const casosConAlertaCritica = proposals.filter((p) => p.alertaCritica);
  const casosConCadenaAlta = proposals.filter(
    (p) => p.cadenaIntermediacion === "Alta" || p.cadenaIntermediacion === "Crítica"
  );
  const casosSinCIS = proposals.filter((p) => p.cis === "Pendiente");
  const recentProposals = proposals.slice(0, 5);

  return (
    <AppShell topbarTitle="Panel ejecutivo">
      <SectionHeader
        title="Dashboard"
        description="Foco en documentación y evidencia objetiva. Filtra intermediarios sin acceso directo y prioriza únicamente oportunidades con indicios reales de viabilidad."
        action={
          <a
            href="/propuesta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gawer-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gawer-gray-700 hover:bg-gawer-gray-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            Ver formulario público
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          title="Propuestas recibidas"
          value={dashboardStats.propuestasRecibidas}
          icon={Inbox}
        />
        <StatCard
          title="Descartadas por intermediación débil"
          value={dashboardStats.propuestasDescartadasIntermediacion}
          subtitle="Sin acceso directo al titular del negocio"
          icon={ShieldAlert}
        />
        <StatCard
          title="Oportunidades con CIS recibido"
          value={dashboardStats.oportunidadesConCIS}
          subtitle="Requisito documental común a toda operación"
          icon={FileCheck2}
          variant="success"
        />
        <StatCard
          title="Acceso directo al principal confirmado"
          value={dashboardStats.oportunidadesAccesoDirectoConfirmado}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Riesgo documental alto"
          value={dashboardStats.riesgoDocumentalAlto}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Listos para revisión Fernando/Liliana"
          value={dashboardStats.casosListosRevisionFernandoLiliana}
          subtitle="Con indicios razonables de viabilidad"
          icon={Clock}
          variant="warning"
        />
      </div>

      {casosConAlertaCritica.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <Siren className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <span className="font-semibold">
              {dashboardStats.alertasCriticasMTN} caso(s) con alerta crítica activa —
            </span>{" "}
            MTNs del HSBC respaldadas en LTNs brasileras. Regla validada por Fernando: GAWER no opera
            este instrumento. Descarte sugerido — pendiente de confirmación humana.
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-gawer-gray-200 bg-white p-4">
          <p className="text-gawer-gray-500">Alertas por ausencia de CIS</p>
          <p className="text-lg font-semibold text-gawer-charcoal mt-1">{casosSinCIS.length} casos activos</p>
        </div>
        <div className="rounded-lg border border-gawer-gray-200 bg-white p-4">
          <p className="text-gawer-gray-500">Cadenas de intermediación alta o crítica</p>
          <p className="text-lg font-semibold text-gawer-charcoal mt-1">{casosConCadenaAlta.length} casos activos</p>
        </div>
        <div className="rounded-lg border border-gawer-gray-200 bg-white p-4">
          <p className="text-gawer-gray-500">Tiempo ejecutivo ahorrado</p>
          <p className="text-lg font-semibold text-gawer-charcoal mt-1">{dashboardStats.tiempoEjecutivoAhorrado}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gawer-charcoal mb-1">
          Revisión ejecutiva Fernando/Liliana
        </h2>
        <p className="text-sm text-gawer-gray-500 mb-4">
          Solo pasan a esta etapa las oportunidades que cumplieron requisitos básicos y muestran indicios razonables de viabilidad.
        </p>
        <OpportunityTable proposals={casosParaRevisionEjecutiva} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gawer-charcoal mb-4">
          Oportunidades recientes
        </h2>
        <OpportunityTable proposals={recentProposals} />
      </div>
    </AppShell>
  );
}
