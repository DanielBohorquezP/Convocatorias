"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileStack } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { EstadoConvocatoria } from "@/lib/types";
import { formatCOP, formatFecha, ESTADO_CONVOCATORIA_LABEL, ESTADO_CONVOCATORIA_ESTILO, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const filtros: Array<{ valor: EstadoConvocatoria | "todas"; etiqueta: string }> = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "borrador", etiqueta: "Borrador" },
  { valor: "publicada", etiqueta: "Publicada" },
  { valor: "despublicada", etiqueta: "Despublicada" },
  { valor: "cerrada", etiqueta: "Cerrada" },
];

export default function AdminConvocatoriasPage() {
  const convocatorias = useAppStore((s) => s.convocatorias);
  const actualizarConvocatoria = useAppStore((s) => s.actualizarConvocatoria);
  const eliminarConvocatoria = useAppStore((s) => s.eliminarConvocatoria);
  const agregarConvocatoria = useAppStore((s) => s.agregarConvocatoria);
  const [filtro, setFiltro] = useState<EstadoConvocatoria | "todas">("todas");
  const router = useRouter();

  const filtradas = useMemo(
    () => (filtro === "todas" ? convocatorias : convocatorias.filter((c) => c.estado === filtro)),
    [convocatorias, filtro]
  );

  const crearNueva = () => {
    const nueva = agregarConvocatoria({
      nombre: "Nueva convocatoria sin título",
      entidadConvocante: "",
      descripcion: "",
      montoMin: 0,
      montoMax: 0,
      ubicacion: "",
      fechaApertura: new Date().toISOString().slice(0, 10),
      fechaCierre: new Date().toISOString().slice(0, 10),
      estado: "borrador",
      categorias: [],
      documentos: [],
      requisitos: [],
    });
    router.push(`/admin/convocatorias/${nueva.id}`);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Convocatorias</h1>
          <p className="text-sm text-ink-soft">Administra el ciclo de vida de cada convocatoria.</p>
        </div>
        <Button variant="primary" onClick={crearNueva}>
          <Plus className="h-4 w-4" /> Nueva convocatoria
        </Button>
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
                ({convocatorias.filter((c) => c.estado === f.valor).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <EmptyState
          icon={FileStack}
          titulo="No hay convocatorias en este estado"
          descripcion="Cambia el filtro o crea una nueva convocatoria para empezar."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Convocatoria</th>
                <th className="px-5 py-3">Entidad</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Cierre</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filtradas.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="max-w-xs px-5 py-3">
                    <Link href={`/admin/convocatorias/${c.id}`} className="font-medium text-ink hover:text-primary-800">
                      {c.nombre}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{c.entidadConvocante || "—"}</td>
                  <td className="px-5 py-3 font-tabular text-ink-soft">
                    {c.montoMax ? `${formatCOP(c.montoMin)} – ${formatCOP(c.montoMax)}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{formatFecha(c.fechaCierre)}</td>
                  <td className="px-5 py-3">
                    <Badge className={ESTADO_CONVOCATORIA_ESTILO[c.estado]}>
                      {ESTADO_CONVOCATORIA_LABEL[c.estado]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <LinkButton href={`/admin/convocatorias/${c.id}`} variant="ghost" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                      </LinkButton>
                      {c.estado === "publicada" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actualizarConvocatoria(c.id, { estado: "despublicada" })}
                          aria-label="Despublicar"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </Button>
                      ) : c.estado === "despublicada" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actualizarConvocatoria(c.id, { estado: "publicada" })}
                          aria-label="Publicar"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarConvocatoria(c.id)}
                        aria-label="Eliminar"
                        className="text-danger hover:bg-danger-bg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
