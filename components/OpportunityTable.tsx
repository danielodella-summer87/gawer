import Link from "next/link";
import type { Proposal } from "@/lib/mock/gawerData";
import { formatCurrency } from "@/lib/mock/gawerData";
import { RiskBadge } from "./RiskBadge";
import { ScoreBadge } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";

interface OpportunityTableProps {
  proposals: Proposal[];
  showActions?: boolean;
}

export function OpportunityTable({ proposals, showActions = true }: OpportunityTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gawer-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Proponente</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Área de negocio</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Monto estimado</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Score GAWER</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Riesgo</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
            <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Próxima acción</th>
            {showActions && (
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Acción</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gawer-gray-100">
          {proposals.map((proposal) => (
            <tr key={proposal.id} className="hover:bg-gawer-gray-50/50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gawer-charcoal">{proposal.empresa}</p>
                  <p className="text-xs text-gawer-gray-500">{proposal.proponente}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-gawer-gray-700">{proposal.areaNegocio}</td>
              <td className="px-4 py-3 font-medium text-gawer-charcoal">
                {formatCurrency(proposal.montoEstimado, proposal.moneda)}
              </td>
              <td className="px-4 py-3">
                <ScoreBadge score={proposal.score} size="sm" />
              </td>
              <td className="px-4 py-3">
                <RiskBadge level={proposal.riesgo} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={proposal.estado} />
              </td>
              <td className="px-4 py-3 text-gawer-gray-600 max-w-[200px] truncate">
                {proposal.proximaAccion}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  <Link
                    href={`/propuestas/${proposal.id}`}
                    className="text-sm font-medium text-gawer-petrol hover:text-gawer-green transition-colors"
                  >
                    Ver análisis
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
