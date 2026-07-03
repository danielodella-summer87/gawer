import {
  Inbox,
  Eye,
  Star,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { OpportunityTable } from "@/components/OpportunityTable";
import { dashboardStats, proposals } from "@/lib/mock/gawerData";

export default function DashboardPage() {
  const recentProposals = proposals.slice(0, 4);

  return (
    <AppShell topbarTitle="Panel ejecutivo">
      <SectionHeader
        title="Dashboard"
        description="Sistema inteligente para evaluación, ranking y gestión de oportunidades estratégicas"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Propuestas recibidas"
          value={dashboardStats.propuestasRecibidas}
          icon={Inbox}
        />
        <StatCard
          title="Propuestas en revisión"
          value={dashboardStats.propuestasEnRevision}
          icon={Eye}
          variant="warning"
        />
        <StatCard
          title="Oportunidades prioritarias"
          value={dashboardStats.oportunidadesPrioritarias}
          icon={Star}
          variant="success"
        />
        <StatCard
          title="Propuestas descartadas"
          value={dashboardStats.propuestasDescartadas}
          icon={Trash2}
        />
        <StatCard
          title="Riesgo alto detectado"
          value={dashboardStats.riesgoAltoDetectado}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Tiempo ejecutivo ahorrado"
          value={dashboardStats.tiempoEjecutivoAhorrado}
          subtitle="Estimado acumulado"
          icon={Clock}
          variant="success"
          trend="+18% vs mes anterior"
        />
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
