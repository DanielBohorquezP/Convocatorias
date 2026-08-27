"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X as XIcon, MapPin, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Convocatoria, Proyecto } from "@/lib/types";
import { diasRestantes, formatCOP, ESTADO_CONVOCATORIA_LABEL, ESTADO_CONVOCATORIA_ESTILO } from "@/lib/utils";
import { useAccesoSuscripcion } from "@/lib/hooks";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Lock, Sparkles } from "lucide-react";

type Criterio = {
  clave: string;
  etiqueta: string;
  cumple: boolean;
};

function evaluarCriterios(proyecto: Proyecto, convocatoria: Convocatoria): Criterio[] {
  const catsProyecto = new Set(proyecto.categorias);

  const sectorProyecto = proyecto.categorias.filter((c) => c.startsWith("sec-"));
  const tipoProyectoProyecto = proyecto.categorias.filter((c) => c.startsWith("tp-"));
  const tipoEntidadProyecto = proyecto.categorias.filter((c) => c.startsWith("te-"));

  const sectorMatch = sectorProyecto.some((c) => convocatoria.categorias.includes(c));
  const tipoProyectoMatch = tipoProyectoProyecto.some((c) => convocatoria.categorias.includes(c));
  const tipoEntidadMatch = tipoEntidadProyecto.some((c) => convocatoria.categorias.includes(c));
  const montoMatch =
    proyecto.montoBuscado >= convocatoria.montoMin && proyecto.montoBuscado <= convocatoria.montoMax;
  const ubicacionMatch =
    convocatoria.ubicacion.toLowerCase().includes("nacional") ||
    convocatoria.ubicacion.toLowerCase().includes(proyecto.ubicacion.toLowerCase()) ||
    proyecto.ubicacion.toLowerCase().includes(convocatoria.ubicacion.toLowerCase());

  void catsProyecto;

  return [
    { clave: "sector", etiqueta: "Sector", cumple: sectorMatch },
    { clave: "tipo_proyecto", etiqueta: "Tipo de proyecto", cumple: tipoProyectoMatch },
    { clave: "tipo_entidad", etiqueta: "Tipo de entidad", cumple: tipoEntidadMatch },
    { clave: "monto", etiqueta: "Monto dentro del rango", cumple: montoMatch },
    { clave: "ubicacion", etiqueta: "Ubicación", cumple: ubicacionMatch },
  ];
}

export default function SugerenciasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const proyecto = useAppStore((s) => s.proyectos.find((p) => p.id === id));
  const convocatorias = useAppStore((s) => s.convocatorias);
  const { tieneAcceso, requerirAcceso } = useAccesoSuscripcion();

  const sugerencias = useMemo(() => {
    if (!proyecto) return [];
    return convocatorias
      .filter((c) => c.estado === "publicada")
      .map((c) => {
        const criterios = evaluarCriterios(proyecto, c);
        const coincidencias = criterios.filter((cr) => cr.cumple).length;
        return { convocatoria: c, criterios, coincidencias };
      })
      .filter((s) => s.coincidencias > 0)
      .sort((a, b) => b.coincidencias - a.coincidencias);
  }, [proyecto, convocatorias]);

  if (!proyecto) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos este proyecto.</p>
        <Link href="/proyectos" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver a mis proyectos
        </Link>
      </div>
    );
  }

  if (!tieneAcceso) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link
          href="/proyectos"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a mis proyectos
        </Link>
        <EmptyState
          icon={Lock}
          titulo="Suscríbete para ver sugerencias"
          descripcion="Tu suscripción está vencida. Renuévala para ver qué convocatorias coinciden con este proyecto."
          accion={
            <Button variant="primary" onClick={() => requerirAcceso("ver sugerencias de convocatorias")}>
              Ver planes
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/proyectos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis proyectos
      </Link>

      <div className="mb-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
          <Sparkles className="h-3.5 w-3.5" /> Sugerencias para
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">{proyecto.nombre}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Comparamos las categorías, el monto y la ubicación de tu proyecto contra cada convocatoria publicada.
        </p>
      </div>

      {sugerencias.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          titulo="Sin coincidencias por ahora"
          descripcion="Ninguna convocatoria publicada comparte categorías, monto o ubicación con este proyecto. Revisa las categorías del proyecto o vuelve más adelante."
        />
      ) : (
        <div className="space-y-4">
          {sugerencias.map(({ convocatoria, criterios, coincidencias }) => {
            const dias = diasRestantes(convocatoria.fechaCierre);
            return (
              <Link
                key={convocatoria.id}
                href={`/convocatorias/${convocatoria.id}`}
                className="block rounded-2xl border border-line p-5 transition-colors hover:border-primary-200 hover:bg-primary-50/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={ESTADO_CONVOCATORIA_ESTILO[convocatoria.estado]}>
                        {ESTADO_CONVOCATORIA_LABEL[convocatoria.estado]}
                      </Badge>
                      {dias >= 0 && dias < 15 && (
                        <Badge className="bg-gold-50 text-gold-700 ring-gold-200">
                          Cierra en {dias} {dias === 1 ? "día" : "días"}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-base font-semibold text-ink">
                      {convocatoria.nombre}
                    </h3>
                    <p className="text-sm text-ink-soft">{convocatoria.entidadConvocante}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-display text-2xl font-bold text-primary-800">
                      {coincidencias}/5
                    </span>
                    <span className="text-xs text-ink-faint">criterios cumplidos</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line-soft pt-4 sm:grid-cols-5">
                  {criterios.map((c) => (
                    <div key={c.clave} className="flex items-center gap-1.5 text-xs">
                      {c.cumple ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                      ) : (
                        <XIcon className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                      )}
                      <span className={c.cumple ? "text-ink" : "text-ink-faint"}>{c.etiqueta}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-ink-faint">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" />
                    <span className="font-tabular">
                      {formatCOP(convocatoria.montoMin)} – {formatCOP(convocatoria.montoMax)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {convocatoria.ubicacion}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
