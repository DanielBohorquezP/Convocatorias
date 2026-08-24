"use client";

import { useState } from "react";
import { Plus, Trash2, Tags } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { TipoCategoria } from "@/lib/types";
import { TIPO_CATEGORIA_LABEL } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const tipos: TipoCategoria[] = ["tipo_proyecto", "sector", "tipo_entidad"];

export default function AdminCategoriasPage() {
  const categorias = useAppStore((s) => s.categorias);
  const agregarCategoria = useAppStore((s) => s.agregarCategoria);
  const eliminarCategoria = useAppStore((s) => s.eliminarCategoria);

  const [nuevoNombre, setNuevoNombre] = useState<Record<TipoCategoria, string>>({
    tipo_proyecto: "",
    sector: "",
    tipo_entidad: "",
  });

  const agregar = (tipo: TipoCategoria) => {
    const nombre = nuevoNombre[tipo].trim();
    if (!nombre) return;
    agregarCategoria({ tipo, nombre });
    setNuevoNombre((prev) => ({ ...prev, [tipo]: "" }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Tags className="h-5 w-5 text-primary-700" />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categorías</h1>
          <p className="text-sm text-ink-soft">
            Catálogo usado para clasificar convocatorias y proyectos, agrupado por tipo.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {tipos.map((tipo) => {
          const items = categorias.filter((c) => c.tipo === tipo);
          return (
            <div key={tipo} className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-display text-sm font-semibold text-ink">{TIPO_CATEGORIA_LABEL[tipo]}</h2>
              <p className="mb-4 text-xs text-ink-faint">{items.length} categorías</p>

              <ul className="space-y-1.5">
                {items.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-line-soft px-3 py-2"
                  >
                    <Chip tono={c.tipo}>{c.nombre}</Chip>
                    <button
                      onClick={() => eliminarCategoria(c.id)}
                      className="text-ink-faint hover:text-danger"
                      aria-label={`Eliminar ${c.nombre}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2 border-t border-line-soft pt-4">
                <input
                  value={nuevoNombre[tipo]}
                  onChange={(e) => setNuevoNombre((prev) => ({ ...prev, [tipo]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && agregar(tipo)}
                  placeholder="Nueva categoría..."
                  className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary-500"
                />
                <Button variant="secondary" size="sm" onClick={() => agregar(tipo)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
