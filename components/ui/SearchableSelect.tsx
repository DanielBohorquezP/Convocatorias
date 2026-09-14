"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Opcion {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  opciones: Opcion[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  vacioLabel?: string;
  className?: string;
}

/**
 * Selector con buscador por texto (RF-76) — reemplaza un `<select>` plano
 * cuando la lista de opciones puede crecer mucho, como las convocatorias
 * vigentes del catálogo dentro de otros flujos (RF-28, RF-74).
 */
export function SearchableSelect({
  opciones,
  value,
  onChange,
  placeholder = "Buscar...",
  vacioLabel = "Sin resultados",
  className,
}: SearchableSelectProps) {
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);

  const seleccionada = opciones.find((o) => o.value === value);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  const filtradas = query.trim()
    ? opciones.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : opciones;

  return (
    <div ref={contenedorRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={abierto ? query : (seleccionada?.label ?? "")}
          onFocus={() => {
            setAbierto(true);
            setQuery("");
          }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </div>
      {abierto && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-lg">
          {filtradas.length === 0 ? (
            <p className="px-3 py-2 text-sm text-ink-faint">{vacioLabel}</p>
          ) : (
            filtradas.map((o) => (
              <button
                key={o.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o.value);
                  setAbierto(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-primary-50",
                  o.value === value && "bg-primary-50 font-medium text-primary-800"
                )}
              >
                <span>{o.label}</span>
                {o.sublabel && <span className="text-xs text-ink-faint">{o.sublabel}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
