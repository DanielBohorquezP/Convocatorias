"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck, Lock, Unlock, Filter } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TipoEventoSeguridad } from "@/lib/types";
import {
  TIPO_EVENTO_SEGURIDAD_LABEL,
  TIPO_EVENTO_SEGURIDAD_ESTILO,
  formatFechaHora,
  cn,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const filtros: Array<{ valor: TipoEventoSeguridad | "todos"; etiqueta: string }> = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "login_fallido", etiqueta: "Login fallido" },
  { valor: "acceso_denegado", etiqueta: "Acceso denegado" },
  { valor: "limite_tasa", etiqueta: "Límite de tasa" },
  { valor: "mfa_activado", etiqueta: "MFA" },
];

export default function SeguridadAdminPage() {
  const eventos = useAppStore((s) => s.eventosSeguridad);
  const liberarBloqueoSeguridad = useAppStore((s) => s.liberarBloqueoSeguridad);
  const [filtro, setFiltro] = useState<TipoEventoSeguridad | "todos">("todos");

  const ahora = Date.now();
  const bloqueosActivos = eventos.filter(
    (e) => e.tipo === "limite_tasa" && e.bloqueadoHasta && new Date(e.bloqueadoHasta).getTime() > ahora
  );

  const eventosFiltrados = (filtro === "todos" ? eventos : eventos.filter((e) => e.tipo === filtro)).sort((a, b) =>
    a.fecha < b.fecha ? 1 : -1
  );

  return (
    <div>
      <div className="mb-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
          <ShieldAlert className="h-3.5 w-3.5" /> Seguridad y auditoría
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">Eventos de seguridad</h1>
        <p className="text-sm text-ink-soft">
          Logins fallidos, accesos denegados y bloqueos por límite de tasa (CU-39, RNF-25..27).
        </p>
      </div>

      {/* Bloqueos activos (CU-40) */}
      <div className="mb-8 rounded-2xl border border-line p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
          <Lock className="h-4 w-4 text-brick-600" /> Bloqueos activos por límite de tasa
        </h2>
        {bloqueosActivos.length === 0 ? (
          <p className="mt-3 text-sm text-ink-faint">No hay bloqueos activos en este momento.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {bloqueosActivos.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brick-100 bg-brick-50/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {e.usuarioNombre ?? "Sin usuario resuelto"} · {e.ip}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {e.ruta} — {e.detalle}
                  </p>
                  <p className="mt-0.5 text-xs text-brick-700">
                    Bloqueado hasta {e.bloqueadoHasta ? formatFechaHora(e.bloqueadoHasta) : "—"}
                  </p>
                </div>
                <Button variant="outline-gold" size="sm" onClick={() => liberarBloqueoSeguridad(e.id)}>
                  <Unlock className="h-3.5 w-3.5" /> Liberar ahora
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bitácora de eventos (CU-39) */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-ink-faint" />
        {filtros.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              filtro === f.valor
                ? "bg-primary-800 text-white"
                : "bg-white text-ink-soft ring-1 ring-inset ring-line hover:bg-slate-50"
            )}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {eventosFiltrados.length === 0 ? (
        <EmptyState icon={ShieldCheck} titulo="Sin eventos" descripcion="No hay eventos de seguridad para este filtro." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3">IP</th>
                <th className="px-5 py-3">Ruta</th>
                <th className="px-5 py-3">Detalle</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {eventosFiltrados.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <Badge className={TIPO_EVENTO_SEGURIDAD_ESTILO[e.tipo]}>{TIPO_EVENTO_SEGURIDAD_LABEL[e.tipo]}</Badge>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{e.usuarioNombre ?? "—"}</td>
                  <td className="px-5 py-3 font-tabular text-ink-soft">{e.ip}</td>
                  <td className="px-5 py-3 text-ink-soft">{e.ruta}</td>
                  <td className="max-w-xs px-5 py-3 text-ink-soft">{e.detalle}</td>
                  <td className="px-5 py-3 font-tabular text-xs text-ink-faint">{formatFechaHora(e.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
