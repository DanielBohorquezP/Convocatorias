"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Layers, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Plan, RolPlan } from "@/lib/types";
import { formatCOP } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type Formulario = {
  nombre: string;
  rol: RolPlan;
  precioMensual: string;
  precioAnual: string;
};

const vacio: Formulario = { nombre: "", rol: "empresa", precioMensual: "", precioAnual: "" };

export default function AdminPlanesPage() {
  const planes = useAppStore((s) => s.planes);
  const agregarPlan = useAppStore((s) => s.agregarPlan);
  const actualizarPlan = useAppStore((s) => s.actualizarPlan);
  const eliminarPlan = useAppStore((s) => s.eliminarPlan);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Formulario>(vacio);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(vacio);
    setModalAbierto(true);
  };

  const abrirEditar = (p: Plan) => {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre,
      rol: p.rol,
      precioMensual: String(p.precioMensual),
      precioAnual: String(p.precioAnual),
    });
    setModalAbierto(true);
  };

  const guardar = () => {
    if (!form.nombre.trim()) return;
    const datos = {
      nombre: form.nombre.trim(),
      rol: form.rol,
      precioMensual: Number(form.precioMensual) || 0,
      precioAnual: Number(form.precioAnual) || 0,
    };
    if (editandoId) {
      actualizarPlan(editandoId, datos);
    } else {
      agregarPlan(datos);
    }
    setModalAbierto(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Planes</h1>
          <p className="text-sm text-ink-soft">Planes de suscripción para empresas y consultores.</p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus className="h-4 w-4" /> Nuevo plan
        </Button>
      </div>

      {planes.length === 0 ? (
        <EmptyState icon={Layers} titulo="No hay planes" descripcion="Crea el primer plan de suscripción." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Precio mensual</th>
                <th className="px-5 py-3">Precio anual</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {planes.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-medium text-ink">{p.nombre}</td>
                  <td className="px-5 py-3">
                    <Badge
                      className={
                        p.rol === "empresa"
                          ? "bg-primary-50 text-primary-800 ring-primary-100"
                          : "bg-brick-50 text-brick-700 ring-brick-100"
                      }
                    >
                      {p.rol === "empresa" ? "Empresa" : "Consultor"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 font-tabular text-ink-soft">{formatCOP(p.precioMensual)}</td>
                  <td className="px-5 py-3 font-tabular text-ink-soft">{formatCOP(p.precioAnual)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => abrirEditar(p)} aria-label="Editar plan">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarPlan(p.id)}
                        aria-label="Eliminar plan"
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
                {editandoId ? "Editar plan" : "Nuevo plan"}
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
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Rol
                </label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value as RolPlan })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                >
                  <option value="empresa">Empresa</option>
                  <option value="consultor">Consultor</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Precio mensual (COP)
                  </label>
                  <input
                    type="number"
                    value={form.precioMensual}
                    onChange={(e) => setForm({ ...form, precioMensual: e.target.value })}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Precio anual (COP)
                  </label>
                  <input
                    type="number"
                    value={form.precioAnual}
                    onChange={(e) => setForm({ ...form, precioAnual: e.target.value })}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardar}>
                {editandoId ? "Guardar cambios" : "Crear plan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
