"use client";

import { create } from "zustand";
import {
  categorias as categoriasIniciales,
  convocatorias as convocatoriasIniciales,
  fuentes as fuentesIniciales,
  postulaciones as postulacionesIniciales,
  proyectos as proyectosIniciales,
} from "./mock-data";
import type {
  Categoria,
  ChecklistItem,
  Convocatoria,
  EstadoPostulacion,
  Fuente,
  Postulacion,
  Proyecto,
} from "./types";

let contador = 1000;
function nuevoId(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${contador}`;
}

interface AppState {
  categorias: Categoria[];
  convocatorias: Convocatoria[];
  proyectos: Proyecto[];
  postulaciones: Postulacion[];
  fuentes: Fuente[];

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
}

export const useAppStore = create<AppState>((set, get) => ({
  categorias: categoriasIniciales,
  convocatorias: convocatoriasIniciales,
  proyectos: proyectosIniciales,
  postulaciones: postulacionesIniciales,
  fuentes: fuentesIniciales,

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
        { id: nuevoId("hist"), estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: new Date().toISOString().slice(0, 10) },
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
              fecha: new Date().toISOString().slice(0, 10),
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
}));
