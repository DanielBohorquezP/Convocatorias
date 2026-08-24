"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categorias } from "@/lib/mock-data";
import { cn, diasRestantes } from "@/lib/utils";
import { ConvocatoriaCard } from "@/components/ConvocatoriaCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const tiposProyecto = categorias.filter((c) => c.tipo === "tipo_proyecto");
const sectores = categorias.filter((c) => c.tipo === "sector");

export default function CatalogoConvocatoriasPage() {
  const convocatorias = useAppStore((s) => s.convocatorias);
  const [busqueda, setBusqueda] = useState("");
  const [tipoProyectoSel, setTipoProyectoSel] = useState<string[]>([]);
  const [sectorSel, setSectorSel] = useState<string[]>([]);
  const [entidadSel, setEntidadSel] = useState<string>("");
  const [ubicacionSel, setUbicacionSel] = useState<string>("");
  const [montoMax, setMontoMax] = useState<string>("");
  const [cierraAntesDe, setCierraAntesDe] = useState<string>("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  const entidades = useMemo(
    () => Array.from(new Set(convocatorias.map((c) => c.entidadConvocante))).sort(),
    [convocatorias]
  );
  const ubicaciones = useMemo(
    () => Array.from(new Set(convocatorias.map((c) => c.ubicacion))).sort(),
    [convocatorias]
  );

  const toggle = (lista: string[], valor: string, set: (v: string[]) => void) => {
    set(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  };

  const resultados = useMemo(() => {
    return convocatorias
      .filter((c) => c.estado === "publicada" || c.estado === "cerrada")
      .filter((c) =>
        busqueda.trim()
          ? (c.nombre + " " + c.entidadConvocante + " " + c.descripcion)
              .toLowerCase()
              .includes(busqueda.toLowerCase())
          : true
      )
      .filter((c) => (tipoProyectoSel.length ? tipoProyectoSel.some((id) => c.categorias.includes(id)) : true))
      .filter((c) => (sectorSel.length ? sectorSel.some((id) => c.categorias.includes(id)) : true))
      .filter((c) => (entidadSel ? c.entidadConvocante === entidadSel : true))
      .filter((c) => (ubicacionSel ? c.ubicacion === ubicacionSel : true))
      .filter((c) => (montoMax ? c.montoMin <= Number(montoMax) * 1_000_000 : true))
      .filter((c) => (cierraAntesDe ? c.fechaCierre <= cierraAntesDe : true))
      .sort((a, b) => diasRestantes(a.fechaCierre) - diasRestantes(b.fechaCierre));
  }, [convocatorias, busqueda, tipoProyectoSel, sectorSel, entidadSel, ubicacionSel, montoMax, cierraAntesDe]);

  const hayFiltrosActivos =
    tipoProyectoSel.length > 0 ||
    sectorSel.length > 0 ||
    !!entidadSel ||
    !!ubicacionSel ||
    !!montoMax ||
    !!cierraAntesDe;

  const limpiarFiltros = () => {
    setTipoProyectoSel([]);
    setSectorSel([]);
    setEntidadSel("");
    setUbicacionSel("");
    setMontoMax("");
    setCierraAntesDe("");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Convocatorias disponibles</h1>
        <p className="text-sm text-ink-soft">
          {resultados.length} {resultados.length === 1 ? "convocatoria encontrada" : "convocatorias encontradas"}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, entidad o palabra clave..."
            className="w-full rounded-lg border border-line py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-ink-faint focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <Button
          variant={filtrosAbiertos ? "secondary" : "outline-gold"}
          size="md"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros {hayFiltrosActivos && `(${tipoProyectoSel.length + sectorSel.length + [entidadSel, ubicacionSel, montoMax, cierraAntesDe].filter(Boolean).length})`}
        </Button>
      </div>

      <div className={cn("grid gap-8", filtrosAbiertos ? "lg:grid-cols-[260px_1fr]" : "grid-cols-1")}>
        {filtrosAbiertos && (
          <aside className="h-max rounded-2xl border border-line p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-ink">Filtros</h2>
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline"
                >
                  <X className="h-3 w-3" /> Limpiar
                </button>
              )}
            </div>

            <FiltroGrupo titulo="Tipo de proyecto">
              {tiposProyecto.map((cat) => (
                <Checkbox
                  key={cat.id}
                  label={cat.nombre}
                  checked={tipoProyectoSel.includes(cat.id)}
                  onChange={() => toggle(tipoProyectoSel, cat.id, setTipoProyectoSel)}
                />
              ))}
            </FiltroGrupo>

            <FiltroGrupo titulo="Sector">
              {sectores.map((cat) => (
                <Checkbox
                  key={cat.id}
                  label={cat.nombre}
                  checked={sectorSel.includes(cat.id)}
                  onChange={() => toggle(sectorSel, cat.id, setSectorSel)}
                />
              ))}
            </FiltroGrupo>

            <FiltroGrupo titulo="Entidad convocante">
              <select
                value={entidadSel}
                onChange={(e) => setEntidadSel(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Todas las entidades</option>
                {entidades.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </FiltroGrupo>

            <FiltroGrupo titulo="Ubicación">
              <select
                value={ubicacionSel}
                onChange={(e) => setUbicacionSel(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Todas las ubicaciones</option>
                {ubicaciones.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </FiltroGrupo>

            <FiltroGrupo titulo="Monto mínimo requerido hasta">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={montoMax}
                  onChange={(e) => setMontoMax(e.target.value)}
                  placeholder="Ej. 100"
                  className="w-full rounded-lg border border-line px-3 py-2 pr-16 text-sm outline-none focus:border-primary-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint">
                  mill. COP
                </span>
              </div>
            </FiltroGrupo>

            <FiltroGrupo titulo="Fecha de cierre" ultimo>
              <input
                type="date"
                value={cierraAntesDe}
                onChange={(e) => setCierraAntesDe(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
              <p className="mt-1 text-xs text-ink-faint">Mostrar convocatorias que cierran antes de esta fecha</p>
            </FiltroGrupo>
          </aside>
        )}

        <div>
          {resultados.length === 0 ? (
            <EmptyState
              icon={Search}
              titulo="No encontramos convocatorias con esos filtros"
              descripcion="Prueba ajustando los filtros o la búsqueda para ver más resultados."
              accion={
                <Button variant="secondary" size="sm" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultados.map((c) => (
                <ConvocatoriaCard key={c.id} convocatoria={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltroGrupo({
  titulo,
  children,
  ultimo,
}: {
  titulo: string;
  children: React.ReactNode;
  ultimo?: boolean;
}) {
  return (
    <div className={cn("mb-4 border-b border-line-soft pb-4", ultimo && "mb-0 border-b-0 pb-0")}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{titulo}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line text-primary-700 focus:ring-primary-500"
      />
      {label}
    </label>
  );
}
