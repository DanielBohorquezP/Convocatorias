"use client";

import { create } from "zustand";
import {
  calificaciones as calificacionesIniciales,
  categorias as categoriasIniciales,
  consultores as consultoresIniciales,
  convocatorias as convocatoriasIniciales,
  encargos as encargosIniciales,
  fuentes as fuentesIniciales,
  pagos as pagosIniciales,
  planes as planesIniciales,
  postulaciones as postulacionesIniciales,
  proyectos as proyectosIniciales,
  suscripciones as suscripcionesIniciales,
} from "./mock-data";
import type {
  Calificacion,
  Categoria,
  ChecklistItem,
  Convocatoria,
  Encargo,
  EstadoEncargo,
  EstadoPostulacion,
  Fuente,
  ItemPortafolio,
  ModalidadSuscripcion,
  ModoDemo,
  Pago,
  PerfilConsultor,
  Plan,
  Postulacion,
  Proyecto,
  RedSocial,
  Suscripcion,
} from "./types";

let contador = 1000;
function nuevoId(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${contador}`;
}

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function sumarPeriodo(fechaBaseIso: string, modalidad: ModalidadSuscripcion): string {
  const base = new Date(fechaBaseIso + "T00:00:00");
  if (modalidad === "anual") {
    base.setFullYear(base.getFullYear() + 1);
  } else {
    base.setMonth(base.getMonth() + 1);
  }
  return base.toISOString().slice(0, 10);
}

interface SolicitudConsultor {
  proyectoId: string;
  tituloTarea: string;
  descripcionTarea: string;
}

interface AppState {
  categorias: Categoria[];
  convocatorias: Convocatoria[];
  proyectos: Proyecto[];
  postulaciones: Postulacion[];
  fuentes: Fuente[];
  consultores: PerfilConsultor[];
  encargos: Encargo[];
  calificaciones: Calificacion[];
  planes: Plan[];
  suscripciones: Suscripcion[];
  pagos: Pago[];

  // Simulador de modo demo
  modoDemo: ModoDemo;
  setModoDemo: (modo: ModoDemo) => void;

  // Modal de suscripción
  modalSuscripcionAbierto: boolean;
  motivoModalSuscripcion: string;
  abrirModalSuscripcion: (motivo?: string) => void;
  cerrarModalSuscripcion: () => void;
  simularPago: (usuarioId: string, planId: string, modalidad: ModalidadSuscripcion) => void;

  // Proyectos
  agregarProyecto: (p: Omit<Proyecto, "id">) => Proyecto;
  actualizarProyecto: (id: string, p: Omit<Proyecto, "id">) => void;
  eliminarProyecto: (id: string) => void;

  // Postulaciones
  crearPostulacion: (convocatoriaId: string, proyectoId: string | null) => Postulacion;
  toggleChecklistItem: (postulacionId: string, itemId: string) => void;
  cambiarEstadoPostulacion: (postulacionId: string, nuevoEstado: EstadoPostulacion) => void;

  // Fuentes
  agregarFuente: (f: Omit<Fuente, "id">) => void;
  actualizarFuente: (id: string, f: Omit<Fuente, "id">) => void;
  eliminarFuente: (id: string) => void;

  // Convocatorias (admin)
  agregarConvocatoria: (c: Omit<Convocatoria, "id">) => Convocatoria;
  actualizarConvocatoria: (id: string, cambios: Partial<Convocatoria>) => void;
  eliminarConvocatoria: (id: string) => void;

  // Categorías
  agregarCategoria: (c: Omit<Categoria, "id">) => void;
  eliminarCategoria: (id: string) => void;

  // Flujo de solicitud de consultor
  solicitudConsultorEnCurso: SolicitudConsultor | null;
  iniciarSolicitudConsultor: (s: SolicitudConsultor) => void;
  cancelarSolicitudConsultor: () => void;
  crearEncargoEsperandoAsignacion: () => Encargo | null;
  crearEncargoDesdeDirectorio: (consultorId: string) => Encargo | null;

  // Encargos
  aceptarEncargo: (encargoId: string) => void;
  rechazarEncargoConsultor: (encargoId: string) => void;
  agregarAvanceEncargo: (encargoId: string, nota: string) => void;
  completarEncargo: (encargoId: string) => void;
  calificarEncargo: (encargoId: string, estrellas: number, comentario: string) => void;
  asignarConsultorInterno: (encargoId: string, consultorId: string) => void;

  // Perfiles de consultor
  actualizarPerfilConsultor: (consultorId: string, cambios: Partial<PerfilConsultor>) => void;
  enviarPerfilARevision: (consultorId: string) => void;
  aprobarPerfil: (consultorId: string) => void;
  rechazarPerfil: (consultorId: string, motivo: string) => void;
  suspenderConsultor: (consultorId: string) => void;
  reactivarConsultor: (consultorId: string) => void;
  agregarPortafolioItem: (consultorId: string, item: Omit<ItemPortafolio, "id">) => void;
  actualizarPortafolioItem: (consultorId: string, itemId: string, cambios: Partial<ItemPortafolio>) => void;
  eliminarPortafolioItem: (consultorId: string, itemId: string) => void;
  agregarRed: (consultorId: string, red: Omit<RedSocial, "id">) => void;
  actualizarRed: (consultorId: string, redId: string, cambios: Partial<RedSocial>) => void;
  eliminarRed: (consultorId: string, redId: string) => void;

  // Planes
  agregarPlan: (p: Omit<Plan, "id">) => void;
  actualizarPlan: (id: string, p: Omit<Plan, "id">) => void;
  eliminarPlan: (id: string) => void;

  // Suscripciones
  registrarPago: (suscripcionId: string, monto: number, fecha: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  categorias: categoriasIniciales,
  convocatorias: convocatoriasIniciales,
  proyectos: proyectosIniciales,
  postulaciones: postulacionesIniciales,
  fuentes: fuentesIniciales,
  consultores: consultoresIniciales,
  encargos: encargosIniciales,
  calificaciones: calificacionesIniciales,
  planes: planesIniciales,
  suscripciones: suscripcionesIniciales,
  pagos: pagosIniciales,

  modoDemo: "empresa_trial",
  setModoDemo: (modo) => set({ modoDemo: modo }),

  modalSuscripcionAbierto: false,
  motivoModalSuscripcion: "",
  abrirModalSuscripcion: (motivo) =>
    set({ modalSuscripcionAbierto: true, motivoModalSuscripcion: motivo ?? "continuar" }),
  cerrarModalSuscripcion: () => set({ modalSuscripcionAbierto: false }),

  simularPago: (usuarioId, planId, modalidad) => {
    set((s) => {
      const existente = s.suscripciones.find((sub) => sub.usuarioId === usuarioId);
      const monto =
        modalidad === "anual"
          ? s.planes.find((p) => p.id === planId)?.precioAnual ?? 0
          : s.planes.find((p) => p.id === planId)?.precioMensual ?? 0;
      const hoy = hoyIso();
      const nuevaFechaVencimiento = sumarPeriodo(hoy, modalidad);

      let suscripciones: Suscripcion[];
      let suscripcionId: string;
      if (existente) {
        suscripcionId = existente.id;
        suscripciones = s.suscripciones.map((sub) =>
          sub.id === existente.id
            ? { ...sub, planId, modalidad, estado: "activa", fechaInicio: hoy, fechaVencimiento: nuevaFechaVencimiento }
            : sub
        );
      } else {
        suscripcionId = nuevoId("sub");
        const nueva: Suscripcion = {
          id: suscripcionId,
          usuarioId,
          planId,
          modalidad,
          estado: "activa",
          fechaInicio: hoy,
          fechaVencimiento: nuevaFechaVencimiento,
        };
        suscripciones = [...s.suscripciones, nueva];
      }

      const pago: Pago = { id: nuevoId("pago"), suscripcionId, monto, fecha: hoy };

      return { suscripciones, pagos: [...s.pagos, pago], modalSuscripcionAbierto: false };
    });
  },

  agregarProyecto: (p) => {
    const nuevo: Proyecto = { ...p, id: nuevoId("proy") };
    set((s) => ({ proyectos: [...s.proyectos, nuevo] }));
    return nuevo;
  },
  actualizarProyecto: (id, p) => {
    set((s) => ({
      proyectos: s.proyectos.map((pr) => (pr.id === id ? { ...pr, ...p } : pr)),
    }));
  },
  eliminarProyecto: (id) => {
    set((s) => ({ proyectos: s.proyectos.filter((p) => p.id !== id) }));
  },

  crearPostulacion: (convocatoriaId, proyectoId) => {
    const convocatoria = get().convocatorias.find((c) => c.id === convocatoriaId);
    const checklist: ChecklistItem[] = (convocatoria?.requisitos ?? []).map((r) => ({
      id: nuevoId("chk"),
      descripcion: r.descripcion,
      obligatorio: r.obligatorio,
      completado: false,
    }));
    const nueva: Postulacion = {
      id: nuevoId("post"),
      convocatoriaId,
      proyectoId,
      estado: "en_preparacion",
      checklist,
      historial: [
        { id: nuevoId("hist"), estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: hoyIso() },
      ],
    };
    set((s) => ({ postulaciones: [...s.postulaciones, nueva] }));
    return nueva;
  },

  toggleChecklistItem: (postulacionId, itemId) => {
    set((s) => ({
      postulaciones: s.postulaciones.map((p) =>
        p.id === postulacionId
          ? {
              ...p,
              checklist: p.checklist.map((item) =>
                item.id === itemId ? { ...item, completado: !item.completado } : item
              ),
            }
          : p
      ),
    }));
  },

  cambiarEstadoPostulacion: (postulacionId, nuevoEstado) => {
    set((s) => ({
      postulaciones: s.postulaciones.map((p) => {
        if (p.id !== postulacionId || p.estado === nuevoEstado) return p;
        return {
          ...p,
          estado: nuevoEstado,
          historial: [
            ...p.historial,
            {
              id: nuevoId("hist"),
              estadoAnterior: p.estado,
              estadoNuevo: nuevoEstado,
              fecha: hoyIso(),
            },
          ],
        };
      }),
    }));
  },

  agregarFuente: (f) => {
    set((s) => ({ fuentes: [...s.fuentes, { ...f, id: nuevoId("fuente") }] }));
  },
  actualizarFuente: (id, f) => {
    set((s) => ({ fuentes: s.fuentes.map((fu) => (fu.id === id ? { ...fu, ...f } : fu)) }));
  },
  eliminarFuente: (id) => {
    set((s) => ({ fuentes: s.fuentes.filter((f) => f.id !== id) }));
  },

  agregarConvocatoria: (c) => {
    const nueva: Convocatoria = { ...c, id: nuevoId("conv") };
    set((s) => ({ convocatorias: [...s.convocatorias, nueva] }));
    return nueva;
  },
  actualizarConvocatoria: (id, cambios) => {
    set((s) => ({
      convocatorias: s.convocatorias.map((c) => (c.id === id ? { ...c, ...cambios } : c)),
    }));
  },
  eliminarConvocatoria: (id) => {
    set((s) => ({ convocatorias: s.convocatorias.filter((c) => c.id !== id) }));
  },

  agregarCategoria: (c) => {
    set((s) => ({ categorias: [...s.categorias, { ...c, id: nuevoId("cat") }] }));
  },
  eliminarCategoria: (id) => {
    set((s) => ({ categorias: s.categorias.filter((c) => c.id !== id) }));
  },

  // -------------------------------------------------------------------------
  // Flujo de solicitud de consultor
  // -------------------------------------------------------------------------

  solicitudConsultorEnCurso: null,
  iniciarSolicitudConsultor: (solicitud) => set({ solicitudConsultorEnCurso: solicitud }),
  cancelarSolicitudConsultor: () => set({ solicitudConsultorEnCurso: null }),

  crearEncargoEsperandoAsignacion: () => {
    const solicitud = get().solicitudConsultorEnCurso;
    if (!solicitud) return null;
    const nuevo: Encargo = {
      id: nuevoId("encargo"),
      proyectoId: solicitud.proyectoId,
      empresaId: "empresa-1",
      consultorId: null,
      tituloTarea: solicitud.tituloTarea,
      descripcionTarea: solicitud.descripcionTarea,
      via: "asignacion_interna",
      estado: "esperando_asignacion",
      avances: [],
      fechas: { creada: hoyIso(), aceptado: null, completado: null },
    };
    set((s) => ({ encargos: [...s.encargos, nuevo], solicitudConsultorEnCurso: null }));
    return nuevo;
  },

  crearEncargoDesdeDirectorio: (consultorId) => {
    const solicitud = get().solicitudConsultorEnCurso;
    if (!solicitud) return null;
    const nuevo: Encargo = {
      id: nuevoId("encargo"),
      proyectoId: solicitud.proyectoId,
      empresaId: "empresa-1",
      consultorId,
      tituloTarea: solicitud.tituloTarea,
      descripcionTarea: solicitud.descripcionTarea,
      via: "directorio",
      estado: "pendiente",
      avances: [],
      fechas: { creada: hoyIso(), aceptado: null, completado: null },
    };
    set((s) => ({ encargos: [...s.encargos, nuevo], solicitudConsultorEnCurso: null }));
    return nuevo;
  },

  // -------------------------------------------------------------------------
  // Encargos
  // -------------------------------------------------------------------------

  aceptarEncargo: (encargoId) => {
    set((s) => ({
      encargos: s.encargos.map((e) =>
        e.id === encargoId ? { ...e, estado: "en_curso" as EstadoEncargo, fechas: { ...e.fechas, aceptado: hoyIso() } } : e
      ),
    }));
  },
  rechazarEncargoConsultor: (encargoId) => {
    set((s) => ({
      encargos: s.encargos.map((e) => (e.id === encargoId ? { ...e, estado: "rechazado" as EstadoEncargo } : e)),
    }));
  },
  agregarAvanceEncargo: (encargoId, nota) => {
    if (!nota.trim()) return;
    set((s) => ({
      encargos: s.encargos.map((e) =>
        e.id === encargoId
          ? { ...e, avances: [...e.avances, { id: nuevoId("avance"), nota: nota.trim(), fecha: hoyIso() }] }
          : e
      ),
    }));
  },
  completarEncargo: (encargoId) => {
    set((s) => ({
      encargos: s.encargos.map((e) =>
        e.id === encargoId
          ? { ...e, estado: "completado" as EstadoEncargo, fechas: { ...e.fechas, completado: hoyIso() } }
          : e
      ),
    }));
  },
  calificarEncargo: (encargoId, estrellas, comentario) => {
    set((s) => {
      const encargo = s.encargos.find((e) => e.id === encargoId);
      if (!encargo || !encargo.consultorId) return s;
      const yaCalificado = s.calificaciones.some((c) => c.encargoId === encargoId);
      if (yaCalificado) return s;

      const nuevaCalificacion: Calificacion = {
        id: nuevoId("calif"),
        encargoId,
        consultorId: encargo.consultorId,
        estrellas,
        comentario: comentario.trim(),
        fecha: hoyIso(),
      };
      const calificaciones = [...s.calificaciones, nuevaCalificacion];
      const delConsultor = calificaciones.filter((c) => c.consultorId === encargo.consultorId);
      const promedio = delConsultor.reduce((acc, c) => acc + c.estrellas, 0) / delConsultor.length;

      const consultores = s.consultores.map((c) =>
        c.id === encargo.consultorId
          ? { ...c, ratingPromedio: Math.round(promedio * 10) / 10, totalEncargosCompletados: c.totalEncargosCompletados + 1 }
          : c
      );

      const encargos = s.encargos.map((e) =>
        e.id === encargoId ? { ...e, estado: "calificado" as EstadoEncargo } : e
      );

      return { calificaciones, consultores, encargos };
    });
  },
  asignarConsultorInterno: (encargoId, consultorId) => {
    set((s) => ({
      encargos: s.encargos.map((e) =>
        e.id === encargoId
          ? { ...e, consultorId, estado: "en_curso" as EstadoEncargo, fechas: { ...e.fechas, aceptado: hoyIso() } }
          : e
      ),
    }));
  },

  // -------------------------------------------------------------------------
  // Perfiles de consultor
  // -------------------------------------------------------------------------

  actualizarPerfilConsultor: (consultorId, cambios) => {
    set((s) => ({
      consultores: s.consultores.map((c) => (c.id === consultorId ? { ...c, ...cambios } : c)),
    }));
  },
  enviarPerfilARevision: (consultorId) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, estadoPerfil: "en_revision", motivoRechazo: undefined } : c
      ),
    }));
  },
  aprobarPerfil: (consultorId) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, estadoPerfil: "aprobado", motivoRechazo: undefined } : c
      ),
    }));
  },
  rechazarPerfil: (consultorId, motivo) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, estadoPerfil: "rechazado", motivoRechazo: motivo } : c
      ),
    }));
  },
  suspenderConsultor: (consultorId) => {
    set((s) => ({
      consultores: s.consultores.map((c) => (c.id === consultorId ? { ...c, estadoPerfil: "suspendido" } : c)),
    }));
  },
  reactivarConsultor: (consultorId) => {
    set((s) => ({
      consultores: s.consultores.map((c) => (c.id === consultorId ? { ...c, estadoPerfil: "aprobado" } : c)),
    }));
  },
  agregarPortafolioItem: (consultorId, item) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, portafolio: [...c.portafolio, { ...item, id: nuevoId("port") }] } : c
      ),
    }));
  },
  actualizarPortafolioItem: (consultorId, itemId, cambios) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId
          ? { ...c, portafolio: c.portafolio.map((it) => (it.id === itemId ? { ...it, ...cambios } : it)) }
          : c
      ),
    }));
  },
  eliminarPortafolioItem: (consultorId, itemId) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, portafolio: c.portafolio.filter((it) => it.id !== itemId) } : c
      ),
    }));
  },
  agregarRed: (consultorId, red) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, redes: [...c.redes, { ...red, id: nuevoId("red") }] } : c
      ),
    }));
  },
  actualizarRed: (consultorId, redId, cambios) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId
          ? { ...c, redes: c.redes.map((r) => (r.id === redId ? { ...r, ...cambios } : r)) }
          : c
      ),
    }));
  },
  eliminarRed: (consultorId, redId) => {
    set((s) => ({
      consultores: s.consultores.map((c) =>
        c.id === consultorId ? { ...c, redes: c.redes.filter((r) => r.id !== redId) } : c
      ),
    }));
  },

  // -------------------------------------------------------------------------
  // Planes
  // -------------------------------------------------------------------------

  agregarPlan: (p) => {
    set((s) => ({ planes: [...s.planes, { ...p, id: nuevoId("plan") }] }));
  },
  actualizarPlan: (id, p) => {
    set((s) => ({ planes: s.planes.map((pl) => (pl.id === id ? { ...pl, ...p } : pl)) }));
  },
  eliminarPlan: (id) => {
    set((s) => ({ planes: s.planes.filter((p) => p.id !== id) }));
  },

  // -------------------------------------------------------------------------
  // Suscripciones
  // -------------------------------------------------------------------------

  registrarPago: (suscripcionId, monto, fecha) => {
    set((s) => {
      const suscripcion = s.suscripciones.find((sub) => sub.id === suscripcionId);
      if (!suscripcion) return s;
      const baseVencimiento = suscripcion.fechaVencimiento > fecha ? suscripcion.fechaVencimiento : fecha;
      const nuevaFechaVencimiento = sumarPeriodo(baseVencimiento, suscripcion.modalidad === "trial" ? "mensual" : suscripcion.modalidad);
      const pago: Pago = { id: nuevoId("pago"), suscripcionId, monto, fecha };
      return {
        pagos: [...s.pagos, pago],
        suscripciones: s.suscripciones.map((sub) =>
          sub.id === suscripcionId
            ? { ...sub, estado: "activa", fechaVencimiento: nuevaFechaVencimiento }
            : sub
        ),
      };
    });
  },
}));
