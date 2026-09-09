"use client";

import { useEffect, useRef, useState } from "react";
import { formatCOPCorto } from "@/lib/utils";

export function ContadorAnimado({
  valor,
  prefijo = "",
  sufijo = "",
  duracionMs = 1200,
  variante = "entero",
}: {
  valor: number;
  prefijo?: string;
  sufijo?: string;
  duracionMs?: number;
  variante?: "entero" | "cop-corto";
}) {
  const [actual, setActual] = useState(0);
  const inicioRef = useRef<number | null>(null);

  useEffect(() => {
    let frame: number;
    const paso = (marca: number) => {
      if (inicioRef.current === null) inicioRef.current = marca;
      const progreso = Math.min(1, (marca - inicioRef.current) / duracionMs);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      setActual(Math.round(valor * facilitado));
      if (progreso < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <span className="font-tabular font-display text-2xl font-bold text-primary-800">
      {prefijo}
      {variante === "cop-corto" ? formatCOPCorto(actual) : actual.toLocaleString("es-CO")}
      {sufijo}
    </span>
  );
}
