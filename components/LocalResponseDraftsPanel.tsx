"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, Copy, FlaskConical } from "lucide-react";
import type { ProposalResponseDraft } from "@/lib/local/proposalResponseDrafts";

interface LocalResponseDraftsPanelProps {
  proposalId: string;
  drafts: ProposalResponseDraft[];
}

export function LocalResponseDraftsPanel({ proposalId, drafts }: LocalResponseDraftsPanelProps) {
  const router = useRouter();
  const recommended = useMemo(() => drafts.find((d) => d.recommended) ?? drafts[0], [drafts]);
  const [selectedId, setSelectedId] = useState(recommended.id);
  const [isCopying, setIsCopying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = drafts.find((d) => d.id === selectedId) ?? recommended;

  async function handleCopy() {
    setIsCopying(true);
    setError(null);
    setFeedback(null);
    try {
      const text = `Asunto: ${selected.subject}\n\n${selected.body}`;
      await navigator.clipboard.writeText(text);

      const res = await fetch(`/api/local/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log_response_draft_copy", draftTitle: selected.title }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo registrar la copia en el historial.");
        return;
      }
      setFeedback("Respuesta copiada al portapapeles. No se envió ningún mensaje.");
      router.refresh();
    } catch {
      setError("No se pudo copiar al portapapeles en este navegador.");
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareText className="h-4 w-4 text-gawer-petrol" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
          Respuesta al proponente
        </h2>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-gawer-gold/30 bg-gawer-gold/10 p-3">
        <FlaskConical className="h-3.5 w-3.5 text-gawer-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gawer-gray-700">
          Borradores generados con plantillas locales, sin IA. Ningún mensaje se envía desde acá — solo se
          copia al portapapeles para enviarlo manualmente por el canal que corresponda.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {drafts.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedId(d.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedId === d.id
                ? "border-gawer-green bg-gawer-green text-white"
                : "border-gawer-gray-200 bg-white text-gawer-gray-600 hover:bg-gawer-gray-50"
            }`}
          >
            {d.title}
            {d.recommended && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                  selectedId === d.id ? "bg-white/20 text-white" : "bg-gawer-green/10 text-gawer-green"
                }`}
              >
                Recomendado
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-md bg-gawer-gray-50 border border-gawer-gray-100 p-3 mb-4">
        <p className="text-xs text-gawer-gray-500 mb-1">Motivo de la recomendación</p>
        <p className="text-sm text-gawer-charcoal">{selected.reason}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1">Asunto</p>
          <p className="text-sm font-medium text-gawer-charcoal">{selected.subject}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1">Cuerpo del mensaje</p>
          <pre className="whitespace-pre-wrap rounded-md border border-gawer-gray-200 bg-white p-3 text-sm text-gawer-gray-700 font-sans leading-relaxed">
            {selected.body}
          </pre>
        </div>
      </div>

      {selected.missingItems.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gawer-gray-400 mb-1">
            Elementos referidos en este borrador
          </p>
          <ul className="space-y-1">
            {selected.missingItems.map((item, i) => (
              <li key={i} className="text-sm text-gawer-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gawer-gray-400">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-md bg-gawer-petrol/5 border border-gawer-petrol/20 p-3 mb-5">
        <p className="text-xs font-medium text-gawer-petrol mb-1">Acción interna sugerida</p>
        <p className="text-sm text-gawer-charcoal">{selected.nextInternalAction}</p>
      </div>

      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {feedback && <p className="text-sm text-gawer-green mb-3">{feedback}</p>}

      <button
        type="button"
        onClick={handleCopy}
        disabled={isCopying}
        className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-gawer-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Copy className="h-4 w-4" />
        {isCopying ? "Copiando..." : "Copiar respuesta"}
      </button>
    </section>
  );
}
