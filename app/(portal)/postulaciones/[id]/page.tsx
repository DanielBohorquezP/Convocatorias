"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Wallet, CheckSquare, Square } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { EstadoPostulacion } from "@/lib/types";
import {
  formatCOP,
  formatFecha,
  ESTADO_POSTULACION_LABEL,
  ESTADO_POSTULACION_ESTILO,
  ESTADO_POSTULACION_ORDEN,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DetallePostulacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postulacion = useAppStore((s) => s.postulaciones.find((p) => p.id === id));
  const convocatoria = useAppStore((s) =>
    postulacion ? s.convocatorias.find((c) => c.id === postulacion.convocatoriaId) : undefined
  );
  const proyecto = useAppStore((s) =>
    postulacion?.proyectoId ? s.proyectos.find((p) => p.id === postulacion.proyectoId) : undefined
  );
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const cambiarEstadoPostulacion = useAppStore((s) => s.cambiarEstadoPostulacion);

  if (!postulacion) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos esta postulación.</p>
        <Link href="/postulaciones" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver a mis postulaciones
        </Link>
      </div>
    );
  }

  const total = postulacion.checklist.length;
  const completados = postulacion.checklist.filter((i) => i.completado).length;
  const porcentaje = total ? Math.round((completados / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/postulaciones"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis postulaciones
      </Link>

      <div className="rounded-2xl border border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className={ESTADO_POSTULACION_ESTILO[postulacion.estado]}>
              {ESTADO_POSTULACION_LABEL[postulacion.estado]}
            </Badge>
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-ink">
              {convocatoria?.nombre ?? "Convocatoria no disponible"}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {proyecto ? `Proyecto: ${proyecto.nombre}` : "Sin proyecto asociado"}
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Cambiar estado
            </label>
            <select
              value={postulacion.estado}
              onChange={(e) => cambiarEstadoPostulacion(postulacion.id, e.target.value as EstadoPostulacion)}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
            >
              {ESTADO_POSTULACION_ORDEN.map((estado) => (
                <option key={estado} value={estado}>
                  {ESTADO_POSTULACION_LABEL[estado]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {convocatoria && (
          <div className="mt-6 flex flex-wrap gap-6 border-y border-line-soft py-4 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              <span className="font-tabular">
                {formatCOP(convocatoria.montoMin)} – {formatCOP(convocatoria.montoMax)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {convocatoria.ubicacion}
            </span>
            <span>Cierra el {formatFecha(convocatoria.fechaCierre)}</span>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Checklist de la postulación</h2>
            <span className="font-tabular text-sm font-semibold text-primary-800">
              {completados}/{total} · {porcentaje}%
            </span>
          </div>
          <ProgressBar porcentaje={porcentaje} className="mb-4" />
          <ul className="space-y-2">
            {postulacion.checklist.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggleChecklistItem(postulacion.id, item.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-line-soft px-4 py-3 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/30"
                >
                  {item.completado ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                  )}
                  <span>
                    <span className={item.completado ? "text-sm text-ink-faint line-through" : "text-sm text-ink"}>
                      {item.descripcion}
                    </span>
                    {item.obligatorio && (
                      <span className="ml-2 text-xs font-medium text-gold-700">obligatorio</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Línea de tiempo</h2>
          <ol className="mt-4 space-y-0">
            {postulacion.historial.map((h, idx) => (
              <li key={h.id} className="relative flex gap-4 pb-6 last:pb-0">
                {idx !== postulacion.historial.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
                )}
                <span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary-700 bg-white" />
                <div>
                  <p className="text-sm font-medium text-ink">
                    {h.estadoAnterior ? (
                      <>
                        {ESTADO_POSTULACION_LABEL[h.estadoAnterior]} → {ESTADO_POSTULACION_LABEL[h.estadoNuevo]}
                      </>
                    ) : (
                      <>Postulación creada · {ESTADO_POSTULACION_LABEL[h.estadoNuevo]}</>
                    )}
                  </p>
                  <p className="text-xs text-ink-faint">{formatFecha(h.fecha)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
