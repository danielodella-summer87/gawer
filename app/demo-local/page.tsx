"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  GitBranch,
  Save,
  Cloud,
  Database,
  Brain,
  Send,
  CheckCircle2,
  Circle,
  RotateCcw,
  Siren,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

interface TourStep {
  n: number;
  title: string;
  route?: string;
  objetivo: string;
  detalle?: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    n: 1,
    title: "Abrir formulario público local",
    route: "/propuesta",
    objetivo: "Cargar una propuesta como potencial cliente.",
  },
  {
    n: 2,
    title: "Completar caso normal",
    objetivo: "Ejemplo sugerido para el recorrido.",
    detalle: [
      "Empresa: Demo Gold Direct",
      "Área: Compra de oro doré",
      "CIS disponible",
      "LOI disponible",
      "Acceso directo al principal: Sí",
      "Mandato/autorización: Sí",
      "Monto estimado: USD 5.000.000",
    ],
  },
  {
    n: 3,
    title: "Ver propuesta en listado",
    route: "/propuestas",
    objetivo: "Confirmar que la propuesta ingresada aparece en el panel interno.",
  },
  {
    n: 4,
    title: "Abrir ficha",
    route: "/propuestas/[id]",
    objetivo: "Ver datos, score, riesgo, estado comercial y seguimiento.",
  },
  {
    n: 5,
    title: "Actualizar seguimiento interno",
    objetivo: "Asignar responsable, próxima acción y nota.",
  },
  {
    n: 6,
    title: "Completar checklist documental",
    objetivo: "Marcar CIS, LOI y evidencia bancaria como recibidos o en revisión.",
  },
  {
    n: 7,
    title: "Revisar briefing ejecutivo",
    objetivo: "Ver si la propuesta está lista, en preparación o no lista para Fernando/Liliana.",
  },
  {
    n: 8,
    title: "Generar respuesta al proponente",
    objetivo: "Copiar borrador de solicitud de información o siguiente paso.",
  },
  {
    n: 9,
    title: "Ver bandeja operativa",
    route: "/bandeja",
    objetivo: "Ver prioridades, propuestas listas, pendientes y bloqueadas.",
  },
  {
    n: 10,
    title: "Ver reportes locales",
    route: "/reportes",
    objetivo: "Ver KPIs, motivos de bloqueo, ahorro de tiempo estimado y atención requerida.",
  },
];

interface TestCase {
  title: string;
  config: string[];
  resultado: string;
  critico?: boolean;
}

const TEST_CASES: TestCase[] = [
  {
    title: "Caso 1 — Oportunidad viable",
    config: ["Acceso directo: Sí", "Mandato: Sí", "CIS: recibido", "Documentación suficiente"],
    resultado: "Briefing \"Lista para revisión ejecutiva\".",
  },
  {
    title: "Caso 2 — Falta CIS",
    config: ["CIS pendiente"],
    resultado: "Respuesta sugerida \"Solicitud de CIS\".",
  },
  {
    title: "Caso 3 — Intermediario débil",
    config: ["Sin acceso directo", "Sin mandato", "3 o más intermediarios"],
    resultado: "Riesgo alto / no lista / pedir mandato o acceso al principal.",
  },
  {
    title: "Caso 4 — Regla crítica MTN/LTN",
    config: ["Marcar \"Sí\" en la pregunta sobre MTNs del HSBC respaldadas en LTNs brasileras"],
    resultado:
      "Riesgo Crítico, briefing \"No lista\", respuesta sugerida \"No avance por alerta crítica\".",
    critico: true,
  },
];

const ESTADO_TECNICO = [
  { icon: GitBranch, label: "Rama esperada", value: "operativo-local" },
  { icon: Save, label: "Persistencia", value: ".local-data/gawer/proposals.json" },
  { icon: Cloud, label: "Producción/Vercel", value: "Congelada en main" },
  { icon: Database, label: "Base de datos externa", value: "No activa" },
  { icon: Brain, label: "IA real", value: "No activa" },
  { icon: Send, label: "Envíos reales", value: "No activos" },
];

export default function DemoLocalPage() {
  const [completados, setCompletados] = useState<Set<number>>(new Set());

  function toggle(n: number) {
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  return (
    <AppShell topbarTitle="Demo local">
      <SectionHeader
        title="Demo local"
        description="Recorrido guiado para validar la versión operativa local completa con Fernando."
      />

      {/* A. Aviso superior */}
      <section className="mb-8 flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-4">
        <ShieldAlert className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
        <p className="text-sm text-gawer-charcoal">
          Esta demo trabaja únicamente en entorno local. No envía datos reales, no usa Supabase, no toca
          Vercel y no representa almacenamiento productivo.
        </p>
      </section>

      {/* B. Estado técnico actual */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
          Estado técnico actual
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ESTADO_TECNICO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border border-gawer-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="rounded-md bg-gawer-gray-100 p-2">
                  <Icon className="h-4 w-4 text-gawer-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gawer-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gawer-charcoal">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* C. Recorrido recomendado */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
            Recorrido recomendado para Fernando
          </h2>
          {completados.size > 0 && (
            <button
              type="button"
              onClick={() => setCompletados(new Set())}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gawer-gray-500 hover:text-gawer-charcoal"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar recorrido
            </button>
          )}
        </div>
        <p className="text-xs text-gawer-gray-500 mb-4">
          El progreso de este checklist es solo visual para guiar la demo — no se guarda ni persiste.
          {" "}({completados.size}/{TOUR_STEPS.length} pasos marcados)
        </p>

        <div className="space-y-2">
          {TOUR_STEPS.map((step) => {
            const done = completados.has(step.n);
            return (
              <div
                key={step.n}
                className={`rounded-lg border p-4 transition-colors ${
                  done ? "border-gawer-green/30 bg-gawer-green/5" : "border-gawer-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(step.n)}
                    aria-label={done ? `Marcar paso ${step.n} como pendiente` : `Marcar paso ${step.n} como completado`}
                    className="mt-0.5 shrink-0"
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-gawer-green" />
                    ) : (
                      <Circle className="h-5 w-5 text-gawer-gray-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gawer-gray-400">Paso {step.n}</span>
                      <h3 className="text-sm font-medium text-gawer-charcoal">{step.title}</h3>
                      {step.route && (
                        step.route.includes("[id]") ? (
                          <span className="rounded-md bg-gawer-gray-100 px-2 py-0.5 text-xs font-mono text-gawer-gray-600">
                            {step.route}
                          </span>
                        ) : (
                          <Link
                            href={step.route}
                            target="_blank"
                            className="rounded-md bg-gawer-petrol/10 px-2 py-0.5 text-xs font-mono text-gawer-petrol hover:bg-gawer-petrol/20 transition-colors"
                          >
                            {step.route}
                          </Link>
                        )
                      )}
                    </div>
                    <p className="text-sm text-gawer-gray-600 mt-1">{step.objetivo}</p>
                    {step.detalle && (
                      <ul className="mt-2 space-y-0.5">
                        {step.detalle.map((d, i) => (
                          <li
                            key={i}
                            className="text-xs text-gawer-gray-500 pl-4 relative before:content-['•'] before:absolute before:left-0"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. Casos de prueba sugeridos */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400 mb-3">
          Casos de prueba sugeridos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TEST_CASES.map((tc) => (
            <div
              key={tc.title}
              className={`rounded-lg border p-5 shadow-sm ${
                tc.critico ? "border-red-200 bg-red-50" : "border-gawer-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {tc.critico && <Siren className="h-4 w-4 text-red-600 shrink-0" />}
                <h3 className="text-sm font-semibold text-gawer-charcoal">{tc.title}</h3>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1.5">
                Configuración
              </p>
              <ul className="space-y-1 mb-3">
                {tc.config.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-gray-400"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <div
                className={`rounded-md border p-3 ${
                  tc.critico ? "border-red-200 bg-white" : "border-gawer-gray-100 bg-gawer-gray-50"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1">
                  Resultado esperado
                </p>
                <p className="text-sm text-gawer-charcoal">{tc.resultado}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
