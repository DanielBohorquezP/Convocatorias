"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, Pencil, Trash2, MapPin, Wallet, Sparkles, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categorias, categoriaPorId } from "@/lib/mock-data";
import type { Proyecto } from "@/lib/types";
import { formatCOP } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";

type FormularioProyecto = {
  nombre: string;
  descripcion: string;
  montoBuscado: string;
  ubicacion: string;
  categorias: string[];
};

const formularioVacio: FormularioProyecto = {
  nombre: "",
  descripcion: "",
  montoBuscado: "",
  ubicacion: "",
  categorias: [],
};

export default function ProyectosPage() {
  const proyectos = useAppStore((s) => s.proyectos);
  const agregarProyecto = useAppStore((s) => s.agregarProyecto);
  const actualizarProyecto = useAppStore((s) => s.actualizarProyecto);
  const eliminarProyecto = useAppStore((s) => s.eliminarProyecto);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormularioProyecto>(formularioVacio);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(formularioVacio);
    setModalAbierto(true);
  };

  const abrirEditar = (p: Proyecto) => {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      montoBuscado: String(p.montoBuscado),
      ubicacion: p.ubicacion,
      categorias: p.categorias,
    });
    setModalAbierto(true);
  };

  const toggleCategoria = (id: string) => {
    setForm((f) => ({
      ...f,
      categorias: f.categorias.includes(id)
        ? f.categorias.filter((c) => c !== id)
        : [...f.categorias, id],
    }));
  };

  const guardar = () => {
    if (!form.nombre.trim()) return;
    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      montoBuscado: Number(form.montoBuscado) || 0,
      ubicacion: form.ubicacion.trim(),
      categorias: form.categorias,
    };
    if (editandoId) {
      actualizarProyecto(editandoId, datos);
    } else {
      agregarProyecto(datos);
    }
    setModalAbierto(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Mis proyectos</h1>
          <p className="text-sm text-ink-soft">
            Registra los proyectos de tu empresa para cruzarlos con convocatorias.
          </p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus className="h-4 w-4" /> Nuevo proyecto
        </Button>
      </div>

      {proyectos.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          titulo="Aún no tienes proyectos"
          descripcion="Crea tu primer proyecto para empezar a recibir sugerencias de convocatorias que encajan con él."
          accion={
            <Button variant="primary" onClick={abrirCrear}>
              <Plus className="h-4 w-4" /> Crear proyecto
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {proyectos.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-line p-5">
              <h3 className="font-display text-base font-semibold text-ink">{p.nombre}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{p.descripcion}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.categorias.map((cid) => {
                  const cat = categoriaPorId(cid);
                  return cat ? (
                    <Chip key={cid} tono={cat.tipo}>
                      {cat.nombre}
                    </Chip>
                  ) : null;
                })}
              </div>

              <div className="mt-4 space-y-1.5 border-t border-line-soft pt-4 text-sm">
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <Wallet className="h-3.5 w-3.5" />
                  <span className="font-tabular font-medium text-ink">{formatCOP(p.montoBuscado)}</span>
                </p>
                <p className="flex items-center gap-1.5 text-ink-soft">
                  <MapPin className="h-3.5 w-3.5" /> {p.ubicacion || "Sin ubicación"}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link href={`/proyectos/${p.id}/sugerencias`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Sparkles className="h-3.5 w-3.5" /> Ver sugerencias
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => abrirEditar(p)} aria-label="Editar proyecto">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarProyecto(p.id)}
                  aria-label="Eliminar proyecto"
                  className="text-danger hover:bg-danger-bg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {editandoId ? "Editar proyecto" : "Nuevo proyecto"}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Campo etiqueta="Nombre del proyecto">
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ej. EcoEmpaques Andinos"
                />
              </Campo>

              <Campo etiqueta="Descripción">
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Describe brevemente el proyecto"
                />
              </Campo>

              <div className="grid grid-cols-2 gap-4">
                <Campo etiqueta="Monto buscado (COP)">
                  <input
                    type="number"
                    value={form.montoBuscado}
                    onChange={(e) => setForm({ ...form, montoBuscado: e.target.value })}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                    placeholder="Ej. 100000000"
                  />
                </Campo>
                <Campo etiqueta="Ubicación">
                  <input
                    value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                    placeholder="Ej. Bogotá D.C."
                  />
                </Campo>
              </div>

              <Campo etiqueta="Categorías">
                <div className="max-h-48 space-y-3 overflow-y-auto rounded-lg border border-line-soft p-3">
                  {(["tipo_proyecto", "sector", "tipo_entidad"] as const).map((tipo) => (
                    <div key={tipo}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        {tipo === "tipo_proyecto" ? "Tipo de proyecto" : tipo === "sector" ? "Sector" : "Tipo de entidad"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {categorias
                          .filter((c) => c.tipo === tipo)
                          .map((c) => {
                            const activo = form.categorias.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => toggleCategoria(c.id)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                                  activo
                                    ? "bg-primary-800 text-white ring-primary-800"
                                    : "bg-white text-ink-soft ring-line hover:bg-slate-50"
                                }`}
                              >
                                {c.nombre}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </Campo>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardar}>
                {editandoId ? "Guardar cambios" : "Crear proyecto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {etiqueta}
      </label>
      {children}
    </div>
  );
}
