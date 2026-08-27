"use client";

import { useState } from "react";
import { UserCheck, Check, X, FileText, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categoriaPorId } from "@/lib/mock-data";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RevisionConsultoresPage() {
  const todosLosConsultores = useAppStore((s) => s.consultores);
  const consultores = todosLosConsultores.filter((c) => c.estadoPerfil === "en_revision");
  const aprobarPerfil = useAppStore((s) => s.aprobarPerfil);
  const rechazarPerfil = useAppStore((s) => s.rechazarPerfil);

  const [rechazandoId, setRechazandoId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");

  const confirmarRechazo = () => {
    if (!rechazandoId || !motivo.trim()) return;
    rechazarPerfil(rechazandoId, motivo.trim());
    setRechazandoId(null);
    setMotivo("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Perfiles en revisión</h1>
        <p className="text-sm text-ink-soft">Aprueba o rechaza los perfiles que los consultores enviaron.</p>
      </div>

      {consultores.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          titulo="No hay perfiles pendientes"
          descripcion="Cuando un consultor envíe su perfil a revisión aparecerá aquí."
        />
      ) : (
        <div className="space-y-6">
          {consultores.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={c.fotoUrl} alt="" className="h-16 w-16 rounded-full ring-1 ring-line" />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{c.nombreProfesional}</h2>
                    {c.sitioWeb && (
                      <a
                        href={c.sitioWeb}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-primary-700 hover:underline"
                      >
                        <Globe className="h-3 w-3" /> {c.sitioWeb}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => aprobarPerfil(c.id)}>
                    <Check className="h-3.5 w-3.5" /> Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setRechazandoId(c.id);
                      setMotivo("");
                    }}
                  >
                    <X className="h-3.5 w-3.5" /> Rechazar
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-sm text-ink-soft">{c.descripcion}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.especialidades.map((id) => {
                  const cat = categoriaPorId(id);
                  return cat ? (
                    <Chip key={id} tono={cat.tipo}>
                      {cat.nombre}
                    </Chip>
                  ) : null;
                })}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Portafolio</p>
                {c.portafolio.length === 0 ? (
                  <p className="text-sm text-ink-faint">Sin proyectos en el portafolio.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {c.portafolio.map((item) => (
                      <div key={item.id} className="rounded-xl border border-line-soft p-3">
                        <p className="text-sm font-semibold text-ink">
                          {item.nombreProyecto} <span className="font-normal text-ink-faint">· {item.anio}</span>
                        </p>
                        <p className="text-xs text-ink-faint">{item.entidad}</p>
                        <p className="mt-1 text-sm text-ink-soft">{item.descripcion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg border border-line-soft px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <FileText className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium text-ink">{c.cvNombre}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {rechazandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">Rechazar perfil</h3>
              <button onClick={() => setRechazandoId(null)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Motivo del rechazo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              placeholder="Explica al consultor qué debe corregir..."
              className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setRechazandoId(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarRechazo} disabled={!motivo.trim()}>
                Confirmar rechazo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
