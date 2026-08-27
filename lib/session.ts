import type { ModoDemo } from "./types";

export const MODO_DEMO_LABEL: Record<ModoDemo, string> = {
  empresa_trial: "Empresa · trial activo",
  empresa_vencida: "Empresa · suscripción vencida",
  consultor_aprobado: "Consultor · aprobado",
  consultor_revision: "Consultor · en revisión",
  admin: "Administrador",
};

export const MODOS_DEMO: ModoDemo[] = [
  "empresa_trial",
  "empresa_vencida",
  "consultor_aprobado",
  "consultor_revision",
  "admin",
];

export type RolSesion = "empresa" | "consultor" | "admin";

export function rolDeModo(modo: ModoDemo): RolSesion {
  if (modo.startsWith("empresa")) return "empresa";
  if (modo.startsWith("consultor")) return "consultor";
  return "admin";
}

/** Identidad simulada (usuarioId) para cada modo — se usa para buscar la suscripción vigente. */
export function usuarioIdDeModo(modo: ModoDemo): string {
  switch (modo) {
    case "empresa_trial":
      return "empresa-1";
    case "empresa_vencida":
      return "empresa-2";
    case "consultor_aprobado":
      return "consultor-1";
    case "consultor_revision":
      return "consultor-5";
    case "admin":
      return "admin-1";
  }
}

/** Id del perfil de consultor activo, o null si el modo actual no es de consultor. */
export function consultorIdDeModo(modo: ModoDemo): string | null {
  if (modo === "consultor_aprobado") return "consultor-1";
  if (modo === "consultor_revision") return "consultor-5";
  return null;
}

export function rutaHomeDeModo(modo: ModoDemo): string {
  switch (rolDeModo(modo)) {
    case "empresa":
      return "/convocatorias";
    case "consultor":
      return "/consultor/perfil";
    case "admin":
      return "/admin";
  }
}
