import { Shield, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { knowledgeItems } from "@/lib/mock/gawerData";

export default function BaseConocimientoPage() {
  return (
    <AppShell topbarTitle="Base de conocimiento">
      <SectionHeader
        title="Base de conocimiento"
        description="Repositorio central de criterios, procedimientos y referencias de GAWER"
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gawer-gray-400" />
            <input
              type="text"
              placeholder="Buscar en base de conocimiento..."
              className="h-9 w-72 rounded-md border border-gawer-gray-200 bg-white pl-9 pr-4 text-sm"
              readOnly
            />
          </div>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gawer-green/30 bg-gawer-green/5 p-4">
        <Shield className="h-5 w-5 text-gawer-green shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal">
          <span className="font-semibold">Importante:</span> La IA solo debe usar como criterio fuerte información marcada como{" "}
          <span className="font-semibold text-gawer-green">Validada por GAWER</span>.
        </p>
      </div>

      <div className="rounded-lg border border-gawer-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gawer-gray-200 bg-gawer-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Título</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Categoría</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Responsable</th>
              <th className="px-4 py-3 text-left font-medium text-gawer-gray-600">Última actualización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gawer-gray-100">
            {knowledgeItems.map((item) => (
              <tr key={item.id} className="hover:bg-gawer-gray-50/50">
                <td className="px-4 py-3 font-medium text-gawer-charcoal">{item.titulo}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs text-gawer-gray-600">
                    {item.categoria}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={item.estado} /></td>
                <td className="px-4 py-3 text-gawer-gray-600">{item.responsable}</td>
                <td className="px-4 py-3 text-gawer-gray-500">{item.ultimaActualizacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
