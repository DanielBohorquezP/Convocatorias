"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Rss, X, ExternalLink } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Fuente } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

type Formulario = {
  nombre: string;
  tipoEntidad: string;
  url: string;
  activa: boolean;
};

const vacio: Formulario = { nombre: "", tipoEntidad: "", url: "", activa: true };

export default function AdminFuentesPage() {
  const fuentes = useAppStore((s) => s.fuentes);
  const agregarFuente = useAppStore((s) => s.agregarFuente);
  const actualizarFuente = useAppStore((s) => s.actualizarFuente);
  const eliminarFuente = useAppStore((s) => s.eliminarFuente);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Formulario>(vacio);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(vacio);
    setModalAbierto(true);
  };

  const abrirEditar = (f: Fuente) => {
    setEditandoId(f.id);
    setForm({ nombre: f.nombre, tipoEntidad: f.tipoEntidad, url: f.url, activa: f.activa });
    setModalAbierto(true);
  };

  const guardar = () => {
    if (!form.nombre.trim() || !form.url.trim()) return;
    if (editandoId) {
      actualizarFuente(editandoId, form);
    } else {
      agregarFuente(form);
    }
    setModalAbierto(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Fuentes</h1>
          <p className="text-sm text-ink-soft">
            Entidades desde donde el equipo administrador carga convocatorias manualmente.
          </p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus className="h-4 w-4" /> Nueva fuente
        </Button>
      </div>

      {fuentes.length === 0 ? (
        <EmptyState
          icon={Rss}
          titulo="No hay fuentes registradas"
          descripcion="Registra las entidades de donde se cargarán convocatorias periódicamente."
          accion={
            <Button variant="primary" onClick={abrirCrear}>
              <Plus className="h-4 w-4" /> Registrar fuente
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Tipo de entidad</th>
                <th className="px-5 py-3">URL</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {fuentes.map((f) => (
                <tr key={f.id}>
                  <td className="px-5 py-3 font-medium text-ink">{f.nombre}</td>
                  <td className="px-5 py-3 text-ink-soft">{f.tipoEntidad}</td>
                  <td className="px-5 py-3">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary-700 hover:underline"
                    >
                      {f.url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      className={
                        f.activa
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                      }
                    >
                      {f.activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => abrirEditar(f)} aria-label="Editar fuente">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarFuente(f.id)}
                        aria-label="Eliminar fuente"
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

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {editandoId ? "Editar fuente" : "Nueva fuente"}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Nombre
                </label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ej. Cámara de Comercio de Barranquilla"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Tipo de entidad
                </label>
                <input
                  value={form.tipoEntidad}
                  onChange={(e) => setForm({ ...form, tipoEntidad: e.target.value })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ej. Cámara de comercio"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  URL
                </label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="https://..."
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                  className="h-4 w-4 rounded border-line text-primary-700 focus:ring-primary-500"
                />
                Fuente activa
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardar}>
                {editandoId ? "Guardar cambios" : "Crear fuente"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
