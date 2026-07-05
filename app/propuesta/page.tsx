"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Siren,
  CheckCircle2,
  UploadCloud,
  Building2,
  Users2,
  FileText,
  AlertTriangle,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  proposerTypeOptions,
  accessDirectoOptions,
  mandateOptions,
  intermediaryCountOptions,
  publicFormAreaOptions,
  urgencyOptions,
  documentChecklistOptions,
  mtnHsbcLtnOptions,
} from "@/lib/mock/gawerData";
import type { LocalProposal } from "@/lib/local/proposalsStore";

const initialForm = {
  nombreCompleto: "",
  empresa: "",
  cargo: "",
  pais: "",
  ciudad: "",
  email: "",
  telefono: "",
  sitioWeb: "",
  linkedin: "",
  tipoProponente: "",
  accesoDirecto: "",
  mandato: "",
  relacionTitular: "",
  cantidadIntermediarios: "",
  areaNegocio: "",
  descripcionOperacion: "",
  montoEstimado: "",
  moneda: "USD",
  jurisdiccionPrincipal: "",
  paisOrigen: "",
  paisDestino: "",
  urgencia: "",
  necesitaDeGawer: "",
  documentos: {} as Record<string, boolean>,
  mtnHsbcLtn: "",
  declaracionVeracidad: false,
  declaracionSinCompromiso: false,
};

type FormState = typeof initialForm;

function Field({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gawer-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {helper && <p className="mt-1 text-xs text-gawer-gray-500">{helper}</p>}
    </div>
  );
}

function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none focus:ring-1 focus:ring-gawer-petrol"
    />
  );
}

function RadioPills({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="peer sr-only"
          />
          <span className="inline-flex items-center rounded-full border border-gawer-gray-200 bg-white px-3 py-1.5 text-sm text-gawer-gray-600 transition-colors peer-checked:border-gawer-green peer-checked:bg-gawer-green peer-checked:text-white hover:bg-gawer-gray-50">
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gawer-petrol/10 text-sm font-semibold text-gawer-petrol">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-gawer-charcoal">{title}</h2>
          {description && <p className="text-sm text-gawer-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4 pl-10">{children}</div>
    </section>
  );
}

export default function PropuestaPublicaPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submittedProposal, setSubmittedProposal] = useState<LocalProposal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mode, setMode] = useState<"local" | "supabase">("local");
  const [submittedMode, setSubmittedMode] = useState<"local" | "supabase">("local");

  useEffect(() => {
    fetch("/api/local/proposals")
      .then((res) => res.json())
      .then((data) => setMode(data?.mode === "supabase" ? "supabase" : "local"))
      .catch(() => {});
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDoc(doc: string) {
    setForm((f) => ({ ...f, documentos: { ...f.documentos, [doc]: !f.documentos[doc] } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/local/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error ?? "No se pudo guardar la propuesta. Intente nuevamente.");
        return;
      }
      setSubmittedProposal(data.proposal as LocalProposal);
      setSubmittedMode(data?.mode === "supabase" ? "supabase" : "local");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("No se pudo conectar con el servidor. Verifique la conexión e intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setSubmittedProposal(null);
    setSubmitError(null);
  }

  return (
    <div className="min-h-screen bg-gawer-gray-50">
      <header className="bg-gawer-charcoal text-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-gawer-green font-bold">
              G
            </div>
            <div>
              <p className="text-sm font-semibold">GAWER Intelligence</p>
              <p className="text-[11px] text-white/50">Estructuración e intermediación financiera</p>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Presentar propuesta a GAWER</h1>
          <p className="mt-2 text-sm text-white/90 max-w-xl leading-relaxed">
            Complete la información inicial para que el equipo de GAWER pueda evaluar si la operación
            reúne las condiciones mínimas para avanzar.
          </p>
          <p className="mt-3 text-xs text-white/60 max-w-xl">
            Completar este formulario no implica aprobación, aceptación ni compromiso comercial por parte de GAWER.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gawer-gray-700 leading-relaxed">
            GAWER analiza propuestas vinculadas a estructuración e intermediación en negocios financieros y
            comerciales. Para que una operación pueda ser evaluada, es necesario contar con información
            clara, documentación básica y evidencia objetiva sobre la capacidad jurídica, financiera y
            operativa del proponente.
          </p>
        </section>

        <section className="flex items-start gap-3 rounded-lg border border-gawer-petrol/30 bg-gawer-petrol/5 p-5">
          <ShieldAlert className="h-5 w-5 text-gawer-petrol shrink-0 mt-0.5" />
          <p className="text-sm text-gawer-charcoal">
            La información enviada será utilizada únicamente para una evaluación preliminar. La IA no
            aprueba, rechaza ni descarta operaciones de forma autónoma. Toda decisión queda sujeta a
            revisión del equipo de GAWER.
          </p>
        </section>

        {mode === "supabase" ? (
          <section className="flex items-start gap-3 rounded-lg border border-gawer-green/30 bg-gawer-green/5 p-4">
            <ShieldAlert className="h-4 w-4 text-gawer-green shrink-0 mt-0.5" />
            <p className="text-xs text-gawer-gray-700">
              Persistencia real activa. Las propuestas enviadas desde este formulario quedan registradas en
              la base de datos de GAWER para evaluación preliminar.
            </p>
          </section>
        ) : (
          <section className="flex items-start gap-3 rounded-lg border border-gawer-gold/30 bg-gawer-gold/10 p-4">
            <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
            <p className="text-xs text-gawer-gray-700">
              Persistencia local de desarrollo. Esta propuesta se guarda únicamente en el entorno local de
              GAWER Intelligence para validar el flujo — no usar como almacenamiento productivo.
            </p>
          </section>
        )}

        {submitError && (
          <section className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{submitError}</p>
          </section>
        )}

        {submittedProposal ? (
          <section className="rounded-lg border border-gawer-green/30 bg-gawer-green/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gawer-green" />
              <h2 className="text-lg font-semibold text-gawer-charcoal">
                {submittedMode === "supabase"
                  ? "Propuesta recibida correctamente"
                  : "Propuesta guardada en entorno local"}
              </h2>
            </div>
            <p className="text-sm text-gawer-charcoal mb-1 leading-relaxed">
              {submittedMode === "supabase"
                ? "La información fue enviada al equipo de GAWER para evaluación preliminar."
                : "Propuesta guardada en entorno local. En esta fase la información se almacena únicamente en el entorno de desarrollo para validar el flujo con GAWER."}
            </p>
            <p className="text-xs text-gawer-gray-500 mb-5">
              {submittedMode === "supabase" ? "ID de propuesta: " : "ID de propuesta local: "}
              <span className="font-mono font-medium text-gawer-charcoal">{submittedProposal.id}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Tipo de operación</p>
                <p className="font-medium text-gawer-charcoal mt-0.5">{submittedProposal.input.areaNegocio || "No especificado"}</p>
              </div>
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Acceso al principal</p>
                <p className="font-medium text-gawer-charcoal mt-0.5">{submittedProposal.input.accesoDirecto || "No especificado"}</p>
              </div>
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">CIS</p>
                <p className="font-medium text-gawer-charcoal mt-0.5">
                  {submittedProposal.input.documentos[documentChecklistOptions[0]] ? "Disponible" : "Pendiente"}
                </p>
              </div>
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">
                  Documentación inicial disponible
                </p>
                <p className="font-medium text-gawer-charcoal mt-0.5">
                  {Object.values(submittedProposal.input.documentos).filter(Boolean).length} de{" "}
                  {documentChecklistOptions.length} ítems marcados
                </p>
              </div>
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Riesgo preliminar sugerido</p>
                <p className="font-medium text-gawer-charcoal mt-0.5">{submittedProposal.assessment.riesgo}</p>
                <p className="text-xs text-gawer-gray-500 mt-1">Score: {submittedProposal.assessment.score}/100</p>
              </div>
              <div className="rounded-md bg-white border border-gawer-gray-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400">Estado sugerido</p>
                <p className="font-medium text-gawer-charcoal mt-0.5">{submittedProposal.assessment.estadoSugerido}</p>
              </div>
            </div>
            <div className="mt-3 rounded-md bg-white border border-gawer-gray-100 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gawer-gray-400 mb-1">Razones del score (explicable, sin IA)</p>
              <ul className="space-y-0.5">
                {submittedProposal.assessment.razones.map((r, i) => (
                  <li key={i} className="text-xs text-gawer-gray-600">• {r}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href={`/propuestas/${submittedProposal.id}`}
                className="text-sm font-medium text-gawer-petrol hover:text-gawer-green"
              >
                Ver ficha de esta propuesta →
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-gawer-gray-500 hover:text-gawer-charcoal"
              >
                ← Completar otra propuesta
              </button>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <SectionCard step={1} title="Datos del proponente">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" required>
                  <TextInput
                    required
                    value={form.nombreCompleto}
                    onChange={(e) => set("nombreCompleto", e.target.value)}
                  />
                </Field>
                <Field label="Empresa" required>
                  <TextInput required value={form.empresa} onChange={(e) => set("empresa", e.target.value)} />
                </Field>
                <Field label="Cargo / rol">
                  <TextInput value={form.cargo} onChange={(e) => set("cargo", e.target.value)} />
                </Field>
                <Field label="País">
                  <TextInput value={form.pais} onChange={(e) => set("pais", e.target.value)} />
                </Field>
                <Field label="Ciudad">
                  <TextInput value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
                </Field>
                <Field label="Email" required>
                  <TextInput
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
                <Field label="Teléfono / WhatsApp">
                  <TextInput value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
                </Field>
                <Field label="Sitio web">
                  <TextInput value={form.sitioWeb} onChange={(e) => set("sitioWeb", e.target.value)} />
                </Field>
                <Field label="LinkedIn">
                  <TextInput value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
                </Field>
              </div>
              <Field
                label="Tipo de proponente"
                helper="Ayuda a GAWER a entender rápidamente su rol en la operación."
              >
                <RadioPills
                  name="tipoProponente"
                  options={proposerTypeOptions}
                  value={form.tipoProponente}
                  onChange={(v) => set("tipoProponente", v)}
                />
              </Field>
            </SectionCard>

            <SectionCard
              step={2}
              title="Acceso al principal"
              description="La principal causa de descarte de GAWER es la intermediación sin acceso directo al titular del negocio."
            >
              <Field label="¿Tiene acceso directo al titular principal de la operación?">
                <RadioPills
                  name="accesoDirecto"
                  options={accessDirectoOptions}
                  value={form.accesoDirecto}
                  onChange={(v) => set("accesoDirecto", v)}
                />
              </Field>
              <Field label="¿Cuenta con mandato, autorización o documento que acredite representación?">
                <RadioPills
                  name="mandato"
                  options={mandateOptions}
                  value={form.mandato}
                  onChange={(v) => set("mandato", v)}
                />
              </Field>
              <Field
                label="Describa la relación con el titular de la operación"
                helper="Ejemplo: soy el titular, represento a la empresa X con mandato firmado, fui contactado por un tercero, etc."
              >
                <textarea
                  rows={3}
                  value={form.relacionTitular}
                  onChange={(e) => set("relacionTitular", e.target.value)}
                  className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none focus:ring-1 focus:ring-gawer-petrol"
                />
              </Field>
              <Field label="Cantidad estimada de intermediarios entre usted y el titular principal">
                <RadioPills
                  name="cantidadIntermediarios"
                  options={intermediaryCountOptions}
                  value={form.cantidadIntermediarios}
                  onChange={(v) => set("cantidadIntermediarios", v)}
                />
              </Field>
            </SectionCard>

            <SectionCard step={3} title="Tipo de operación">
              <Field label="Área de negocio" required>
                <select
                  required
                  value={form.areaNegocio}
                  onChange={(e) => set("areaNegocio", e.target.value)}
                  className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none"
                >
                  <option value="">Seleccionar área...</option>
                  {publicFormAreaOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Descripción breve de la operación" required>
                <textarea
                  required
                  rows={3}
                  value={form.descripcionOperacion}
                  onChange={(e) => set("descripcionOperacion", e.target.value)}
                  className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none focus:ring-1 focus:ring-gawer-petrol"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Monto estimado">
                  <TextInput
                    type="number"
                    value={form.montoEstimado}
                    onChange={(e) => set("montoEstimado", e.target.value)}
                  />
                </Field>
                <Field label="Moneda">
                  <TextInput
                    placeholder="USD"
                    value={form.moneda}
                    onChange={(e) => set("moneda", e.target.value)}
                  />
                </Field>
                <Field label="Jurisdicción principal">
                  <TextInput
                    value={form.jurisdiccionPrincipal}
                    onChange={(e) => set("jurisdiccionPrincipal", e.target.value)}
                  />
                </Field>
                <Field label="País de origen de la operación">
                  <TextInput value={form.paisOrigen} onChange={(e) => set("paisOrigen", e.target.value)} />
                </Field>
                <Field label="País de destino, si aplica">
                  <TextInput value={form.paisDestino} onChange={(e) => set("paisDestino", e.target.value)} />
                </Field>
              </div>
              <Field label="Urgencia">
                <RadioPills
                  name="urgencia"
                  options={urgencyOptions}
                  value={form.urgencia}
                  onChange={(v) => set("urgencia", v)}
                />
              </Field>
              <Field label="¿Qué necesita concretamente de GAWER?">
                <textarea
                  rows={2}
                  value={form.necesitaDeGawer}
                  onChange={(e) => set("necesitaDeGawer", e.target.value)}
                  className="w-full rounded-md border border-gawer-gray-200 px-3 py-2 text-sm focus:border-gawer-petrol focus:outline-none focus:ring-1 focus:ring-gawer-petrol"
                />
              </Field>
            </SectionCard>

            <SectionCard
              step={4}
              title="Documentación inicial"
              description="Ningún documento aislado valida una operación, pero ayuda a acelerar la evaluación preliminar."
            >
              <div className="space-y-2">
                {documentChecklistOptions.map((doc) => (
                  <label
                    key={doc}
                    className="flex items-center gap-3 rounded-md border border-gawer-gray-200 px-3 py-2.5 text-sm cursor-pointer hover:bg-gawer-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={!!form.documentos[doc]}
                      onChange={() => toggleDoc(doc)}
                      className="h-4 w-4 rounded border-gawer-gray-300 text-gawer-green focus:ring-gawer-green"
                    />
                    <span className="text-gawer-gray-700">{doc}</span>
                    <span
                      className={cn(
                        "ml-auto text-xs font-medium",
                        form.documentos[doc] ? "text-gawer-green" : "text-gawer-gray-400"
                      )}
                    >
                      {form.documentos[doc] ? "Disponible" : "No disponible"}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-md border border-dashed border-gawer-gray-300 bg-gawer-gray-50 px-4 py-4 text-sm text-gawer-gray-500">
                <UploadCloud className="h-5 w-5 shrink-0 text-gawer-gray-400" />
                <span>
                  Carga documental disponible en una fase posterior. Por ahora, indique qué documentos tiene
                  disponibles marcando el checklist de arriba.
                </span>
              </div>
            </SectionCard>

            <SectionCard step={5} title="Reglas críticas">
              <Field label="¿La operación involucra MTNs del HSBC respaldadas en LTNs brasileras?">
                <RadioPills
                  name="mtnHsbcLtn"
                  options={mtnHsbcLtnOptions}
                  value={form.mtnHsbcLtn}
                  onChange={(v) => set("mtnHsbcLtn", v)}
                />
              </Field>
              {form.mtnHsbcLtn === "Sí" && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                  <Siren className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    Según criterio validado por GAWER, este tipo de operación se considera crítica y no
                    viable para avanzar.
                  </p>
                </div>
              )}
            </SectionCard>

            <SectionCard step={6} title="Declaración">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={form.declaracionVeracidad}
                  onChange={(e) => set("declaracionVeracidad", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gawer-gray-300 text-gawer-green focus:ring-gawer-green"
                />
                <span className="text-sm text-gawer-gray-700">
                  <span className="text-red-500 font-semibold mr-1">*</span>
                  Declaro que la información presentada es correcta según mi conocimiento y que cuento con
                  autorización para compartirla con GAWER.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={form.declaracionSinCompromiso}
                  onChange={(e) => set("declaracionSinCompromiso", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gawer-gray-300 text-gawer-green focus:ring-gawer-green"
                />
                <span className="text-sm text-gawer-gray-700">
                  <span className="text-red-500 font-semibold mr-1">*</span>
                  Entiendo que el envío de esta propuesta no implica aceptación, aprobación ni compromiso
                  comercial por parte de GAWER.
                </span>
              </label>
            </SectionCard>

            <div className="flex flex-col items-start gap-2">
              <button
                type="submit"
                disabled={!form.declaracionVeracidad || !form.declaracionSinCompromiso || isSubmitting}
                className="w-full sm:w-auto rounded-md bg-gawer-green px-6 py-3 text-sm font-semibold text-white hover:bg-gawer-green-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Guardando..." : "Enviar propuesta para evaluación preliminar"}
              </button>
              <p className="text-xs text-gawer-gray-500">
                {mode === "supabase"
                  ? "Este formulario guarda la propuesta en la base de datos real de GAWER. No se envía a ningún sistema externo ni servicio de terceros."
                  : "Este formulario guarda la propuesta en la persistencia local de desarrollo (entorno localhost). No se envía a ningún sistema externo ni servicio de terceros."}
              </p>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-gawer-gray-400">
            <Building2 className="h-3.5 w-3.5" /> Confidencial
          </div>
          <div className="flex items-center gap-2 text-xs text-gawer-gray-400">
            <Users2 className="h-3.5 w-3.5" /> Revisión por equipo comercial
          </div>
          <div className="flex items-center gap-2 text-xs text-gawer-gray-400">
            <FileText className="h-3.5 w-3.5" /> Evaluación basada en evidencia documental
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-3xl px-6 pb-10 text-center">
        <Link href="/" className="text-xs text-gawer-gray-400 hover:text-gawer-petrol">
          Acceso interno GAWER Intelligence →
        </Link>
      </footer>
    </div>
  );
}
