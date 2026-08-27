"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, Briefcase } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categorias, categoriaPorId } from "@/lib/mock-data";
import { RatingStars } from "@/components/RatingStars";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DirectorioConsultoresPage() {
  const consultores = useAppStore((s) => s.consultores);
  const solicitud = useAppStore((s) => s.solicitudConsultorEnCurso);
  const cancelarSolicitud = useAppStore((s) => s.cancelarSolicitudConsultor);

  const [busqueda, setBusqueda] = useState("");
  const [especialidadSel, setEspecialidadSel] = useState<string[]>([]);
  const [ratingMin, setRatingMin] = useState(0);

  const disponibles = useMemo(
    () => consultores.filter((c) => c.estadoPerfil === "aprobado" && !c.esEquipoInterno),
    [consultores]
  );

  const toggleEspecialidad = (id: string) => {
    setEspecialidadSel((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const resultados = useMemo(() => {
    return disponibles
      .filter((c) =>
        busqueda.trim() ? c.nombreProfesional.toLowerCase().includes(busqueda.toLowerCase()) : true
      )
      .filter((c) => (especialidadSel.length ? especialidadSel.some((id) => c.especialidades.includes(id)) : true))
      .filter((c) => c.ratingPromedio >= ratingMin)
      .sort((a, b) => b.ratingPromedio - a.ratingPromedio);
  }, [disponibles, busqueda, especialidadSel, ratingMin]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Directorio de consultores</h1>
        <p className="text-sm text-ink-soft">
          Encuentra consultores verificados para tareas específicas de tus proyectos.
        </p>
      </div>

      {solicitud && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brick-100 bg-brick-50 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-brick-700">Buscando consultor para: {solicitud.tituloTarea}</p>
            <p className="text-xs text-brick-600/80">
              Elige un perfil y usa &ldquo;Solicitar para mi tarea&rdquo; en su ficha completa.
            </p>
          </div>
          <button onClick={cancelarSolicitud} className="text-xs font-semibold text-brick-700 hover:underline">
            Cancelar solicitud
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-lg border border-line py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-ink-faint focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-max rounded-2xl border border-line p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Filtros</h2>
            {(especialidadSel.length > 0 || ratingMin > 0) && (
              <button
                onClick={() => {
                  setEspecialidadSel([]);
                  setRatingMin(0);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
              >
                <X className="h-3 w-3" /> Limpiar
              </button>
            )}
          </div>

          <div className="mb-4 border-b border-line-soft pb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Especialidad</p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {categorias.map((cat) => (
                <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={especialidadSel.includes(cat.id)}
                    onChange={() => toggleEspecialidad(cat.id)}
                    className="h-4 w-4 rounded border-line text-primary-700 focus:ring-primary-500"
                  />
                  {cat.nombre}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Rating mínimo: {ratingMin.toFixed(1)}
            </p>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={ratingMin}
              onChange={(e) => setRatingMin(Number(e.target.value))}
              className="w-full accent-primary-700"
            />
          </div>
        </aside>

        <div>
          {resultados.length === 0 ? (
            <EmptyState
              icon={Search}
              titulo="No encontramos consultores con esos filtros"
              descripcion="Ajusta los filtros o la búsqueda para ver más resultados."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultados.map((c) => (
                <Link
                  key={c.id}
                  href={`/consultores/${c.id}`}
                  className="flex flex-col rounded-2xl border border-line p-5 transition-colors hover:border-brick-100 hover:bg-brick-50/30"
                >
                  <div className="flex items-center gap-3">
                    <img src={c.fotoUrl} alt="" className="h-14 w-14 rounded-full ring-1 ring-line" />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-ink">{c.nombreProfesional}</h3>
                      <RatingStars valor={c.ratingPromedio} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.especialidades.slice(0, 3).map((id) => {
                      const cat = categoriaPorId(id);
                      return cat ? (
                        <Chip key={id} tono={cat.tipo}>
                          {cat.nombre}
                        </Chip>
                      ) : null;
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 border-t border-line-soft pt-4 text-xs text-ink-faint">
                    <Briefcase className="h-3.5 w-3.5" /> {c.totalEncargosCompletados} encargos completados
                  </div>

                  {solicitud && (
                    <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gold-700 ring-1 ring-inset ring-gold-500">
                      Ver perfil y solicitar
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
