"use client";

import { useAppStore } from "./store";
import { usuarioIdDeModo, consultorIdDeModo, rolDeModo } from "./session";
import { diasRestantesHasta } from "./utils";

const ESTADOS_CON_ACCESO = new Set(["trial", "activa", "en_gracia"]);

/**
 * Resuelve si el usuario simulado actual (según el modo demo) tiene una
 * suscripción vigente. Si no encuentra una suscripción para el usuario
 * (p. ej. el administrador) se asume acceso libre: la restricción solo
 * aplica quien tiene una suscripción registrada y está vencida/suspendida.
 */
export function useAccesoSuscripcion() {
  const modoDemo = useAppStore((s) => s.modoDemo);
  const suscripciones = useAppStore((s) => s.suscripciones);
  const abrirModalSuscripcion = useAppStore((s) => s.abrirModalSuscripcion);

  const usuarioId = usuarioIdDeModo(modoDemo);
  const rol = rolDeModo(modoDemo);
  const suscripcion = suscripciones.find((s) => s.usuarioId === usuarioId);
  const tieneAcceso = rol === "admin" || !suscripcion || ESTADOS_CON_ACCESO.has(suscripcion.estado);
  const diasRestantes = suscripcion ? diasRestantesHasta(suscripcion.fechaVencimiento) : null;

  function requerirAcceso(motivo?: string): boolean {
    if (tieneAcceso) return true;
    abrirModalSuscripcion(motivo);
    return false;
  }

  return { usuarioId, rol, suscripcion, tieneAcceso, diasRestantes, requerirAcceso };
}

export function useConsultorActual() {
  const modoDemo = useAppStore((s) => s.modoDemo);
  const consultores = useAppStore((s) => s.consultores);
  const consultorId = consultorIdDeModo(modoDemo);
  const consultor = consultorId ? consultores.find((c) => c.id === consultorId) : undefined;
  return { consultorId, consultor };
}
