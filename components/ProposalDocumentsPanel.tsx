"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, UploadCloud, Trash2, Download, FlaskConical } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { documentChecklistOptions } from "@/lib/mock/gawerData";
import { documentChecklistStatusOptions, type DocumentChecklistStatus } from "@/lib/local/documentChecklist";
import type { ProposalDocumentMeta } from "@/lib/supabase/proposalDocuments";

interface ProposalDocumentsPanelProps {
  proposalId: string;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProposalDocumentsPanel({ proposalId }: ProposalDocumentsPanelProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<ProposalDocumentMeta[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [uploadType, setUploadType] = useState(documentChecklistOptions[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/documents`);
      const data = await res.json();
      if (!res.ok) {
        // Supabase está configurado pero la consulta falló (por ejemplo, la migración SQL de
        // OPERATIVO-REAL-2 todavía no fue aplicada) — no es lo mismo que "modo local".
        setError(data?.error ?? "No se pudieron cargar los documentos.");
        setConfigured(true);
        setDocuments([]);
        return;
      }
      setDocuments(Array.isArray(data.documents) ? data.documents : []);
      setConfigured(Boolean(data.configured));
    } catch {
      setError("No se pudo conectar con el servidor.");
      setDocuments([]);
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) {
      setError("Seleccioná un archivo para subir.");
      return;
    }
    setError(null);
    setFeedback(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("documentType", uploadType);
      const res = await fetch(`/api/proposals/${proposalId}/documents`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo subir el documento.");
        return;
      }
      setFeedback(`Documento "${uploadType}" cargado correctamente.`);
      setUploadFile(null);
      await fetchDocuments();
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleStatusChange(doc: ProposalDocumentMeta, status: DocumentChecklistStatus) {
    setSavingId(doc.id);
    setError(null);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/documents/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo actualizar el estado del documento.");
        return;
      }
      await fetchDocuments();
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(doc: ProposalDocumentMeta) {
    const confirmado = window.confirm(`¿Eliminar el documento "${doc.originalFilename}"?`);
    if (!confirmado) return;
    setSavingId(doc.id);
    setError(null);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/documents/${doc.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo eliminar el documento.");
        return;
      }
      await fetchDocuments();
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gawer-gray-500">Cargando documentos...</p>
      </section>
    );
  }

  if (!configured) {
    return (
      <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-gawer-petrol" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
            Documentos reales
          </h2>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-gawer-gold/30 bg-gawer-gold/10 p-3">
          <FlaskConical className="h-4 w-4 text-gawer-gold shrink-0 mt-0.5" />
          <p className="text-xs text-gawer-gray-700">
            Los documentos reales (Supabase Storage) no están disponibles en modo local. Esta
            propuesta usa la persistencia local de desarrollo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gawer-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-gawer-petrol" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gawer-gray-400">
          Documentos reales
        </h2>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-2 mb-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 rounded-md border border-gawer-gray-200 p-3"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gawer-charcoal">{doc.documentType}</p>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="text-xs text-gawer-gray-500 mt-0.5">
                  {doc.originalFilename} · {formatBytes(doc.fileSizeBytes)} ·{" "}
                  {new Date(doc.createdAt).toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={doc.status}
                  disabled={savingId === doc.id}
                  onChange={(e) => handleStatusChange(doc, e.target.value as DocumentChecklistStatus)}
                  className="h-8 rounded-md border border-gawer-gray-200 bg-white px-2 text-xs text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none disabled:opacity-50"
                >
                  {documentChecklistStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <a
                  href={`/api/proposals/${proposalId}/documents/${doc.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Descargar documento"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gawer-gray-200 text-gawer-gray-600 hover:bg-gawer-gray-50"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  disabled={savingId === doc.id}
                  onClick={() => handleDelete(doc)}
                  title="Eliminar documento"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gawer-gray-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gawer-gray-500 mb-5">Sin documentos reales cargados todavía.</p>
      )}

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <select
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
          className="h-9 rounded-md border border-gawer-gray-200 bg-white px-3 text-sm text-gawer-gray-700 focus:border-gawer-petrol focus:outline-none"
        >
          {documentChecklistOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
          className="text-xs text-gawer-gray-600"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-md bg-gawer-green px-4 py-2 text-sm font-medium text-white hover:bg-gawer-green-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          {isUploading ? "Subiendo..." : "Subir documento"}
        </button>
      </form>

      {error && <p className="text-sm text-red-700 mt-3">{error}</p>}
      {feedback && <p className="text-sm text-gawer-green mt-3">{feedback}</p>}
    </section>
  );
}
