"use client";

import { useState } from "react";
import { Sparkles, Package, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useCreditos } from "@/lib/hooks";
import { PAQUETE_CREDITOS_CANTIDAD, PAQUETE_CREDITOS_PRECIO } from "@/lib/mock-data";
import { formatCOP, formatFecha } from "@/lib/utils";
import { Button } from "./ui/Button";
import { ProgressBar } from "./ui/ProgressBar";

export function BloqueCreditos() {
  const { usuarioId, suscripcion, disponibles, usados, incluidos, extra, fechaReinicio } = useCreditos();
  const comprarPaqueteCreditos = useAppStore((s) => s.comprarPaqueteCreditos);
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!suscripcion) return null;

  const cupoTotal = incluidos + extra;
  const porcentajeUsado = cupoTotal > 0 ? Math.round((usados / cupoTotal) * 100) : 0;

  const confirmarCompra = () => {
    comprarPaqueteCreditos(usuarioId);
    setModalAbierto(false);
  };

  return (
    <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/20 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
          <Sparkles className="h-4 w-4 text-teal-600" /> Créditos de IA
        </h2>
        <Button variant="teal" size="sm" onClick={() => setModalAbierto(true)}>
          <Package className="h-3.5 w-3.5" /> Comprar paquete adicional
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-soft">Disponibles este periodo</span>
        <span className="font-tabular text-lg font-bold text-ink">{disponibles}</span>
      </div>
      <ProgressBar porcentaje={porcentajeUsado} tono="teal" className="mt-2" />

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="font-tabular text-sm font-semibold text-ink">{usados}</p>
          <p className="text-xs text-ink-faint">Usados</p>
        </div>
        <div>
          <p className="font-tabular text-sm font-semibold text-ink">{incluidos}</p>
          <p className="text-xs text-ink-faint">Cupo incluido</p>
        </div>
        <div>
          <p className="font-tabular text-sm font-semibold text-ink">{extra}</p>
          <p className="text-xs text-ink-faint">Extra (no expiran)</p>
        </div>
        <div>
          <p className="font-tabular text-sm font-semibold text-ink">{fechaReinicio ? formatFecha(fechaReinicio) : "—"}</p>
          <p className="text-xs text-ink-faint">Fecha de reinicio</p>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">Comprar paquete adicional</h3>
              <button onClick={() => setModalAbierto(false)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-ink-soft">
              Vas a agregar <strong>{PAQUETE_CREDITOS_CANTIDAD} créditos</strong> que no expiran por{" "}
              <strong>{formatCOP(PAQUETE_CREDITOS_PRECIO)}</strong>.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button variant="teal" onClick={confirmarCompra}>
                Confirmar compra
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
