"use client";

import { Sparkles, X, Package, ArrowUpCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useCreditos } from "@/lib/hooks";
import { PAQUETE_CREDITOS_CANTIDAD, PAQUETE_CREDITOS_PRECIO } from "@/lib/mock-data";
import { formatCOP } from "@/lib/utils";
import { Button } from "./ui/Button";
import { ProgressBar } from "./ui/ProgressBar";

export function ModalCreditos() {
  const abierto = useAppStore((s) => s.modalCreditosAbierto);
  const motivo = useAppStore((s) => s.motivoModalCreditos);
  const cerrar = useAppStore((s) => s.cerrarModalCreditos);
  const comprarPaqueteCreditos = useAppStore((s) => s.comprarPaqueteCreditos);
  const abrirModalSuscripcion = useAppStore((s) => s.abrirModalSuscripcion);
  const { usuarioId, disponibles, incluidos, extra } = useCreditos();

  if (!abierto) return null;

  const verPlanes = () => {
    cerrar();
    abrirModalSuscripcion("obtener más créditos de IA");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Sin créditos de IA</h2>
              <p className="text-sm text-ink-soft">No te quedan créditos para {motivo || "generar el documento"}.</p>
            </div>
          </div>
          <button onClick={cerrar} className="text-ink-faint hover:text-ink" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Créditos disponibles</span>
            <span className="font-tabular font-bold text-ink">{disponibles}</span>
          </div>
          <ProgressBar porcentaje={0} tono="teal" className="mt-2" />
          <p className="mt-2 text-xs text-ink-faint">
            Plan incluye {incluidos} créditos/mes {extra > 0 && `+ ${extra} extra sin expirar`}.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={() => comprarPaqueteCreditos(usuarioId)}
            className="flex w-full items-center gap-4 rounded-xl border border-teal-200 bg-teal-50/40 p-4 text-left transition-colors hover:bg-teal-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Package className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">
                Comprar paquete adicional (+{PAQUETE_CREDITOS_CANTIDAD} créditos)
              </span>
              <span className="block text-xs text-ink-faint">{formatCOP(PAQUETE_CREDITOS_PRECIO)} · no expiran</span>
            </span>
          </button>

          <button
            onClick={verPlanes}
            className="flex w-full items-center gap-4 rounded-xl border border-line p-4 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <ArrowUpCircle className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Mejorar de plan</span>
              <span className="block text-xs text-ink-faint">Los planes superiores incluyen más créditos mensuales.</span>
            </span>
          </button>
        </div>

        <Button variant="ghost" className="mt-4 w-full" onClick={cerrar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
