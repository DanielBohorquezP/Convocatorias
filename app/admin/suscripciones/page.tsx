"use client";

import { useMemo, useState } from "react";
import { CreditCard, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { empresaPorId, consultorPorId } from "@/lib/mock-data";
import type { EstadoSuscripcion, Suscripcion } from "@/lib/types";
import {
  cn,
  formatCOP,
  formatFecha,
  ESTADO_SUSCRIPCION_LABEL,
  ESTADO_SUSCRIPCION_ESTILO,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

function nombreUsuario(usuarioId: string): string {
  if (usuarioId.startsWith("empresa-")) return empresaPorId(usuarioId)?.nombre ?? usuarioId;
  if (usuarioId.startsWith("consultor-")) return consultorPorId(usuarioId)?.nombreProfesional ?? usuarioId;
  return usuarioId;
}

const filtros: Array<{ valor: EstadoSuscripcion | "todas"; etiqueta: string }> = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "trial", etiqueta: "Trial" },
  { valor: "activa", etiqueta: "Activa" },
  { valor: "en_gracia", etiqueta: "En gracia" },
  { valor: "vencida", etiqueta: "Vencida" },
  { valor: "suspendida", etiqueta: "Suspendida" },
];

export default function AdminSuscripcionesPage() {
  const suscripciones = useAppStore((s) => s.suscripciones);
  const planes = useAppStore((s) => s.planes);
  const registrarPago = useAppStore((s) => s.registrarPago);

  const [filtro, setFiltro] = useState<EstadoSuscripcion | "todas">("todas");
  const [pagoDe, setPagoDe] = useState<Suscripcion | null>(null);
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const filtradas = useMemo(
    () => (filtro === "todas" ? suscripciones : suscripciones.filter((s) => s.estado === filtro)),
    [suscripciones, filtro]
  );

  const abrirPago = (sub: Suscripcion) => {
    const plan = planes.find((p) => p.id === sub.planId);
    const sugerido = sub.modalidad === "anual" ? plan?.precioAnual : plan?.precioMensual;
    setPagoDe(sub);
    setMonto(sugerido ? String(sugerido) : "");
    setFecha(new Date().toISOString().slice(0, 10));
  };

  const confirmarPago = () => {
    if (!pagoDe || !Number(monto)) return;
    registrarPago(pagoDe.id, Number(monto), fecha);
    setPagoDe(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Suscripciones</h1>
        <p className="text-sm text-ink-soft">Suscripciones de empresas y consultores en la plataforma.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
              filtro === f.valor ? "bg-primary-800 text-white" : "bg-white text-ink-soft ring-1 ring-inset ring-line hover:bg-slate-50"
            )}
          >
            {f.etiqueta}
            {f.valor !== "todas" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({suscripciones.filter((s) => s.estado === f.valor).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <EmptyState icon={CreditCard} titulo="No hay suscripciones en este estado" descripcion="Cambia el filtro para ver otras suscripciones." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Modalidad</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Vencimiento</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filtradas.map((sub) => {
                const plan = planes.find((p) => p.id === sub.planId);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-ink">{nombreUsuario(sub.usuarioId)}</td>
                    <td className="px-5 py-3 text-ink-soft">{plan?.nombre ?? "—"}</td>
                    <td className="px-5 py-3 text-ink-soft capitalize">{sub.modalidad}</td>
                    <td className="px-5 py-3">
                      <Badge className={ESTADO_SUSCRIPCION_ESTILO[sub.estado]}>{ESTADO_SUSCRIPCION_LABEL[sub.estado]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{formatFecha(sub.fechaVencimiento)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <Button variant="secondary" size="sm" onClick={() => abrirPago(sub)}>
                          Registrar pago / activar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagoDe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">Registrar pago</h3>
              <button onClick={() => setPagoDe(null)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink-soft">
              Usuario: <strong>{nombreUsuario(pagoDe.usuarioId)}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Monto (COP)
                </label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
                {Number(monto) > 0 && (
                  <p className="mt-1 font-tabular text-xs text-ink-faint">{formatCOP(Number(monto))}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Fecha del pago
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setPagoDe(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={confirmarPago} disabled={!Number(monto)}>
                Registrar y activar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
