import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Users,
  Sliders,
  GitBranch,
  Settings2,
  Building2,
  Shield,
} from "lucide-react";

const configSections = [
  {
    icon: Users,
    title: "Usuarios y roles",
    description: "Gestión de accesos, permisos y roles del equipo GAWER.",
    status: "Próximamente",
  },
  {
    icon: Sliders,
    title: "Criterios de scoring",
    description: "Pesos y umbrales para score comercial, documental, riesgo y viabilidad.",
    status: "Próximamente",
  },
  {
    icon: GitBranch,
    title: "Estados comerciales",
    description: "Flujo de estados del proceso comercial y reglas de transición.",
    status: "Próximamente",
  },
  {
    icon: Settings2,
    title: "Parámetros generales",
    description: "Configuración global del sistema, notificaciones y preferencias.",
    status: "Próximamente",
  },
  {
    icon: Building2,
    title: "Áreas activas",
    description: "Activar o desactivar líneas de negocio y sus criterios asociados.",
    status: "Próximamente",
  },
  {
    icon: Shield,
    title: "Permisos",
    description: "Matriz de permisos por módulo, rol y nivel de acceso.",
    status: "Próximamente",
  },
];

export default function ConfiguracionPage() {
  return (
    <AppShell topbarTitle="Configuración">
      <SectionHeader
        title="Configuración"
        description="Parámetros del sistema — disponible en fases posteriores al discovery"
      />

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          Esta sección es un placeholder para la fase de discovery. La configuración real se implementará tras validar el concepto con el equipo directivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-lg border border-gawer-gray-200 bg-white p-5 shadow-sm opacity-75"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-gawer-gray-100 p-2">
                  <Icon className="h-5 w-5 text-gawer-gray-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gawer-charcoal">{section.title}</h3>
                  <p className="text-xs text-gawer-gray-500 mt-1 leading-relaxed">{section.description}</p>
                  <span className="inline-block mt-3 rounded-full bg-gawer-gray-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gawer-gray-500">
                    {section.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
