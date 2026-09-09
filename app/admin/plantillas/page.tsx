"use client";

import { useState } from "react";
import { Sparkles, Check, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatFecha, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminPlantillasPage() {
  const promptVersiones = useAppStore((s) => s.promptVersiones);
  const agregarVersionPrompt = useAppStore((s) => s.agregarVersionPrompt);
  const activarVersionPrompt = useAppStore((s) => s.activarVersionPrompt);

  const ordenadas = [...promptVersiones].sort((a, b) => b.version - a.version);
  const [seleccionadaId, setSeleccionadaId] = useState(ordenadas[0]?.id ?? "");
  const seleccionada = promptVersiones.find((p) => p.id === seleccionadaId);
  const [borrador, setBorrador] = useState(seleccionada?.contenido ?? "");

  const elegir = (id: string) => {
    setSeleccionadaId(id);
    setBorrador(promptVersiones.find((p) => p.id === id)?.contenido ?? "");
  };

  const guardarComoNueva = () => {
    if (!borrador.trim()) return;
    agregarVersionPrompt(borrador.trim());
  };

  return (
    <div>
      <div className="mb-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
          <Sparkles className="h-3.5 w-3.5" /> Módulo de IA
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">Plantillas de generación</h1>
        <p className="text-sm text-ink-soft">
          Controla el prompt que guía la generación de documentos con IA.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-line-soft bg-slate-50 px-4 py-3 text-xs text-ink-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Cada documento generado registra con qué versión de la plantilla fue creado, así que puedes cambiar de
        versión sin afectar los documentos ya generados.
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {ordenadas.map((p) => (
            <button
              key={p.id}
              onClick={() => elegir(p.id)}
              className={cn(
                "block w-full rounded-xl border p-4 text-left transition-colors",
                seleccionadaId === p.id ? "border-teal-400 bg-teal-50/40" : "border-line hover:border-teal-200"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-ink">Versión {p.version}</span>
                {p.activa && <Badge className="bg-teal-50 text-teal-700 ring-teal-200">Activa</Badge>}
              </div>
              <p className="mt-1 text-xs text-ink-faint">{formatFecha(p.fechaCreacion)}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Contenido del prompt {seleccionada && `(versión ${seleccionada.version})`}
          </label>
          <textarea
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            rows={14}
            placeholder="Aquí se cargará el prompt de generación"
            className="w-full resize-y rounded-lg border border-line px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-teal-500"
          />
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {seleccionada && !seleccionada.activa && (
              <Button variant="secondary" onClick={() => activarVersionPrompt(seleccionada.id)}>
                <Check className="h-4 w-4" /> Activar esta versión
              </Button>
            )}
            <Button variant="teal" onClick={guardarComoNueva}>
              Guardar como nueva versión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
