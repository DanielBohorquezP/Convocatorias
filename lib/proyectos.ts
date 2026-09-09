import type { Proyecto } from "./types";

export interface CampoContenido {
  clave: keyof Pick<
    Proyecto,
    | "problema"
    | "objetivoGeneral"
    | "objetivosEspecificos"
    | "poblacionBeneficiaria"
    | "actividades"
    | "resultadosEsperados"
    | "duracionMeses"
    | "presupuestoEstimado"
    | "experienciaEmpresa"
  >;
  etiqueta: string;
}

export const CAMPOS_CONTENIDO: CampoContenido[] = [
  { clave: "problema", etiqueta: "Problema" },
  { clave: "objetivoGeneral", etiqueta: "Objetivo general" },
  { clave: "objetivosEspecificos", etiqueta: "Objetivos específicos" },
  { clave: "poblacionBeneficiaria", etiqueta: "Población beneficiaria" },
  { clave: "actividades", etiqueta: "Actividades" },
  { clave: "resultadosEsperados", etiqueta: "Resultados esperados" },
  { clave: "duracionMeses", etiqueta: "Duración (meses)" },
  { clave: "presupuestoEstimado", etiqueta: "Presupuesto estimado" },
  { clave: "experienciaEmpresa", etiqueta: "Experiencia de la empresa" },
];

export function campoContenidoCompleto(proyecto: Proyecto, clave: CampoContenido["clave"]): boolean {
  const valor = proyecto[clave];
  if (Array.isArray(valor)) return valor.length > 0 && valor.some((v) => v.trim().length > 0);
  if (typeof valor === "number") return valor > 0;
  if (typeof valor === "string") return valor.trim().length > 0;
  return false;
}

export interface CompletitudProyecto {
  porcentaje: number;
  completos: number;
  total: number;
  faltantes: CampoContenido[];
}

export function calcularCompletitud(proyecto: Proyecto): CompletitudProyecto {
  const faltantes = CAMPOS_CONTENIDO.filter((c) => !campoContenidoCompleto(proyecto, c.clave));
  const completos = CAMPOS_CONTENIDO.length - faltantes.length;
  const porcentaje = Math.round((completos / CAMPOS_CONTENIDO.length) * 100);
  return { porcentaje, completos, total: CAMPOS_CONTENIDO.length, faltantes };
}

export function toneCompletitud(porcentaje: number): "bajo" | "medio" | "alto" {
  if (porcentaje >= 80) return "alto";
  if (porcentaje >= 40) return "medio";
  return "bajo";
}

export const ESTILO_COMPLETITUD: Record<"bajo" | "medio" | "alto", string> = {
  bajo: "bg-danger-bg text-danger ring-red-200",
  medio: "bg-amber-50 text-amber-700 ring-amber-200",
  alto: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};
