"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, X as XIcon, ClipboardList } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useConsultorActual, useAccesoSuscripcion } from "@/lib/hooks";
import { cn, formatFecha, ESTADO_ENCARGO_LABEL, ESTADO_ENCARGO_ESTILO } from "@/lib/utils";
import { GuardaConsultor } from "@/components/GuardaConsultor";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RatingStars } from "@/components/RatingStars";

type Pestana = "solicitudes" | "en_curso" | "historial";

export default function EncargosConsultorPage() {
  return (
    <GuardaConsultor>
      <ContenidoEncargos />
    </GuardaConsultor>
  );
}

function ContenidoEncargos() {
  const { consultorId } = useConsultorActual();
  const { tieneAcceso } = useAccesoSuscripcion();
  const todosLosEncargos = useAppStore((s) => s.encargos);
  const encargos = todosLosEncargos.filter((e) => e.consultorId === consultorId);
  const proyectos = useAppStore((s) => s.proyectos);
  const calificaciones = useAppStore((s) => s.calificaciones);
  const aceptarEncargo = useAppStore((s) => s.aceptarEncargo);
  const rechazarEncargoConsultor = useAppStore((s) => s.rechazarEncargoConsultor);
  const agregarAvanceEncargo = useAppStore((s) => s.agregarAvanceEncargo);
  const completarEncargo = useAppStore((s) => s.completarEncargo);

  const [pestana, setPestana] = useState<Pestana>("solicitudes");
  const [notas, setNotas] = useState<Record<string, string>>({});

  const solicitudes = encargos.filter((e) => e.estado === "pendiente");
  const enCurso = encargos.filter((e) => e.estado === "en_curso");
  const historial = encargos.filter((e) =>
    ["completado", "calificado", "rechazado", "cancelado"].includes(e.estado)
  );

  const pestanas: Array<{ valor: Pestana; etiqueta: string; total: number }> = [
    { valor: "solicitudes", etiqueta: "Solicitudes", total: solicitudes.length },
    { valor: "en_curso", etiqueta: "En curso", total: enCurso.length },
    { valor: "historial", etiqueta: "Historial", total: historial.length },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Mis encargos</h1>
        <p className="text-sm text-ink-soft">Gestiona las tareas que las empresas te asignan.</p>
      </div>

      {!tieneAcceso && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-700">
            Tu suscripción está vencida: puedes terminar tus encargos en curso, pero no puedes aceptar nuevas solicitudes.
          </p>
        </div>
      )}

      <div className="mb-6 flex gap-2 border-b border-line-soft">
        {pestanas.map((p) => (
          <button
            key={p.valor}
            onClick={() => setPestana(p.valor)}
            className={cn(
              "border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors",
              pestana === p.valor ? "border-brick-500 text-brick-600" : "border-transparent text-ink-soft hover:text-ink"
            )}
          >
            {p.etiqueta} ({p.total})
          </button>
        ))}
      </div>

      {pestana === "solicitudes" &&
        (solicitudes.length === 0 ? (
          <EmptyState icon={ClipboardList} titulo="No tienes solicitudes pendientes" descripcion="Cuando una empresa te solicite, aparecerá aquí." />
        ) : (
          <div className="space-y-4">
            {solicitudes.map((e) => {
              const proyecto = proyectos.find((p) => p.id === e.proyectoId);
              return (
                <div key={e.id} className="rounded-2xl border border-line p-5">
                  <p className="text-xs text-ink-faint">
                    Proyecto: <span className="font-medium text-ink-soft">{proyecto?.nombre ?? "No disponible"}</span>
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-ink">{e.tituloTarea}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{e.descripcionTarea}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => aceptarEncargo(e.id)} disabled={!tieneAcceso}>
                      <Check className="h-3.5 w-3.5" /> Aceptar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => rechazarEncargoConsultor(e.id)}
                      className="text-danger hover:bg-danger-bg"
                    >
                      <XIcon className="h-3.5 w-3.5" /> Rechazar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {pestana === "en_curso" &&
        (enCurso.length === 0 ? (
          <EmptyState icon={ClipboardList} titulo="No tienes encargos en curso" descripcion="Los encargos que aceptes aparecerán aquí." />
        ) : (
          <div className="space-y-4">
            {enCurso.map((e) => {
              const proyecto = proyectos.find((p) => p.id === e.proyectoId);
              return (
                <div key={e.id} className="rounded-2xl border border-line p-5">
                  <p className="text-xs text-ink-faint">
                    Proyecto: <span className="font-medium text-ink-soft">{proyecto?.nombre ?? "No disponible"}</span>
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-ink">{e.tituloTarea}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{e.descripcionTarea}</p>

                  {e.avances.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-line-soft pt-3">
                      {e.avances.map((a) => (
                        <li key={a.id} className="text-xs text-ink-soft">
                          <span className="font-medium text-ink-faint">{formatFecha(a.fecha)}:</span> {a.nota}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3 flex gap-2">
                    <input
                      value={notas[e.id] ?? ""}
                      onChange={(ev) => setNotas((n) => ({ ...n, [e.id]: ev.target.value }))}
                      placeholder="Escribe una nota de avance..."
                      className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        agregarAvanceEncargo(e.id, notas[e.id] ?? "");
                        setNotas((n) => ({ ...n, [e.id]: "" }));
                      }}
                    >
                      Agregar avance
                    </Button>
                  </div>

                  <Button variant="primary" size="sm" className="mt-3" onClick={() => completarEncargo(e.id)}>
                    Marcar como completado
                  </Button>
                </div>
              );
            })}
          </div>
        ))}

      {pestana === "historial" &&
        (historial.length === 0 ? (
          <EmptyState icon={ClipboardList} titulo="Aún no tienes historial" descripcion="Tus encargos completados o cerrados aparecerán aquí." />
        ) : (
          <div className="space-y-4">
            {historial.map((e) => {
              const proyecto = proyectos.find((p) => p.id === e.proyectoId);
              const calificacion = calificaciones.find((c) => c.encargoId === e.id);
              return (
                <div key={e.id} className="rounded-2xl border border-line p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-ink-faint">
                        Proyecto:{" "}
                        <Link href={`/proyectos/${e.proyectoId}`} className="font-medium text-primary-700 hover:underline">
                          {proyecto?.nombre ?? "No disponible"}
                        </Link>
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold text-ink">{e.tituloTarea}</h3>
                    </div>
                    <Badge className={ESTADO_ENCARGO_ESTILO[e.estado]}>{ESTADO_ENCARGO_LABEL[e.estado]}</Badge>
                  </div>
                  {calificacion && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3">
                      <RatingStars valor={calificacion.estrellas} />
                      {calificacion.comentario && <p className="mt-1.5 text-xs text-ink-soft">{calificacion.comentario}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
