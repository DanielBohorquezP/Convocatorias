"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatFecha } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminEncargosPage() {
  const todosLosEncargos = useAppStore((s) => s.encargos);
  const encargos = todosLosEncargos.filter((e) => e.estado === "esperando_asignacion");
  const proyectos = useAppStore((s) => s.proyectos);
  const todosLosConsultores = useAppStore((s) => s.consultores);
  const consultoresInternos = todosLosConsultores.filter((c) => c.esEquipoInterno && c.estadoPerfil === "aprobado");
  const asignarConsultorInterno = useAppStore((s) => s.asignarConsultorInterno);

  const [seleccion, setSeleccion] = useState<Record<string, string>>({});

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Encargos por asignar</h1>
        <p className="text-sm text-ink-soft">
          Empresas que pidieron que les asignáramos un consultor del equipo interno.
        </p>
      </div>

      {encargos.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          titulo="No hay encargos esperando asignación"
          descripcion="Cuando una empresa pida que le asignemos un consultor, aparecerá aquí."
        />
      ) : (
        <div className="space-y-4">
          {encargos.map((e) => {
            const proyecto = proyectos.find((p) => p.id === e.proyectoId);
            return (
              <div key={e.id} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-xs text-ink-faint">
                  Proyecto: <span className="font-medium text-ink-soft">{proyecto?.nombre ?? "No disponible"}</span> ·
                  Creado el {formatFecha(e.fechas.creada)}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">{e.tituloTarea}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{e.descripcionTarea}</p>

                <div className="mt-4 flex items-center gap-2">
                  <select
                    value={seleccion[e.id] ?? ""}
                    onChange={(ev) => setSeleccion((s) => ({ ...s, [e.id]: ev.target.value }))}
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  >
                    <option value="">Selecciona un consultor del equipo interno</option>
                    {consultoresInternos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombreProfesional}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="primary"
                    disabled={!seleccion[e.id]}
                    onClick={() => asignarConsultorInterno(e.id, seleccion[e.id])}
                  >
                    Asignar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
