import {
  Sliders,
  ShieldOff,
  Brain,
  FileCheck2,
  Users,
  GitBranch,
  MessageCircle,
  Siren,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { commercialStates } from "@/lib/mock/gawerData";

const configSections = [
  {
    icon: Sliders,
    title: "Reglas de scoring",
    estado: "Validado por Fernando",
    items: [
      "Grado de preparación",
      "Calidad documental",
      "Riesgo documental",
      "Probabilidad de cierre",
      "El score es una recomendación, nunca una decisión final",
    ],
  },
  {
    icon: ShieldOff,
    title: "Reglas de descarte",
    estado: "Validado por Fernando",
    items: [
      "Cadena excesiva de intermediación",
      "Ausencia de acceso directo al principal",
      "Falta de información esencial sobre la operación",
      "Documentación falsa o alterada",
      "El descarte siempre se presenta como sugerido, sujeto a confirmación del equipo comercial",
    ],
  },
  {
    icon: Brain,
    title: "Gobierno IA",
    estado: "Validado por Fernando",
    items: [
      "La IA nunca aprueba, rechaza ni descarta una negociación de forma autónoma",
      "Toda decisión definitiva la toma el equipo de GAWER",
      "Cambios en prompts, reglas o criterios requieren aprobación de Fernando y consenso del equipo",
    ],
  },
  {
    icon: FileCheck2,
    title: "Documentos obligatorios",
    estado: "Validado por Fernando",
    items: [
      "CIS / Corporate Information Sheet / Hoja de Información Corporativa — obligatorio para toda operación",
      "LOI, evidencia bancaria, SBLC, RWA o evidencia verificable de fondos según el tipo de operación",
      "Ningún documento aislado se acepta como prueba suficiente",
    ],
  },
  {
    icon: Users,
    title: "Intervención Fernando/Liliana",
    estado: "Validado por Fernando",
    items: [
      "La primera consulta la recibe siempre el equipo comercial",
      "Fernando o Liliana intervienen cuando el cliente cumplió requisitos básicos y hay indicios razonables de viabilidad",
      "El contacto con el proponente puede hacerlo cualquier integrante con mayor experiencia en esa operación",
    ],
  },
  {
    icon: GitBranch,
    title: "Estados comerciales",
    estado: "Validado por Fernando",
    items: commercialStates,
  },
  {
    icon: MessageCircle,
    title: "Tono de respuestas automáticas",
    estado: "Validado por Fernando",
    items: [
      "Cordial, profesional, claro e instructivo",
      "Transmite confianza sin generar expectativas que no puedan cumplirse",
      "Toda respuesta pasa por revisión humana antes de enviarse",
    ],
  },
  {
    icon: Siren,
    title: "Reglas críticas validadas",
    estado: "Validado por Fernando",
    items: [
      "MTNs del HSBC respaldadas en LTNs brasileras: instrumento excluido — se han verificado como falsas de forma consistente",
      "Toda operación con este instrumento se marca como alerta crítica y descarte sugerido, sin excepción",
    ],
  },
];

export default function ConfiguracionPage() {
  return (
    <AppShell topbarTitle="Configuración">
      <SectionHeader
        title="Configuración"
        description="Reglas y criterios operativos validados con Fernando — vista de solo lectura sobre datos mock"
      />

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          Esta sección presenta las reglas y criterios ya validados con Fernando en formato de solo lectura. La edición
          real de estas reglas se habilitará en una fase posterior, siempre con su aprobación y el consenso del equipo GAWER.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-lg border border-gawer-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-md bg-gawer-gray-100 p-2">
                  <Icon className="h-5 w-5 text-gawer-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gawer-charcoal">{section.title}</h3>
                    <StatusBadge status={section.estado} />
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-gray-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
