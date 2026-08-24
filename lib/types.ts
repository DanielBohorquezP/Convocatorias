export type TipoCategoria = "tipo_proyecto" | "sector" | "tipo_entidad";

export interface Categoria {
  id: string;
  tipo: TipoCategoria;
  nombre: string;
}

export type EstadoConvocatoria = "borrador" | "publicada" | "despublicada" | "cerrada";

export type TipoDocumento = "TDR" | "terminos" | "anexo" | "formato";

export interface Documento {
  id: string;
  tipo: TipoDocumento;
  nombre: string;
  archivo: string;
  pesoKb: number;
}

export type TipoRequisito = "documento" | "condicion";

export interface Requisito {
  id: string;
  descripcion: string;
  tipo: TipoRequisito;
  obligatorio: boolean;
  orden: number;
}

export interface Convocatoria {
  id: string;
  nombre: string;
  entidadConvocante: string;
  descripcion: string;
  montoMin: number;
  montoMax: number;
  ubicacion: string;
  fechaApertura: string; // ISO date
  fechaCierre: string; // ISO date
  estado: EstadoConvocatoria;
  categorias: string[]; // Categoria ids
  documentos: Documento[];
  requisitos: Requisito[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  montoBuscado: number;
  ubicacion: string;
  categorias: string[]; // Categoria ids
}

export type EstadoPostulacion =
  | "en_preparacion"
  | "presentada"
  | "en_evaluacion"
  | "aprobada"
  | "rechazada"
  | "cerrada";

export interface ChecklistItem {
  id: string;
  descripcion: string;
  obligatorio: boolean;
  completado: boolean;
}

export interface HistorialItem {
  id: string;
  estadoAnterior: EstadoPostulacion | null;
  estadoNuevo: EstadoPostulacion;
  fecha: string; // ISO date
}

export interface Postulacion {
  id: string;
  convocatoriaId: string;
  proyectoId: string | null;
  estado: EstadoPostulacion;
  checklist: ChecklistItem[];
  historial: HistorialItem[];
}

export interface Fuente {
  id: string;
  nombre: string;
  tipoEntidad: string;
  url: string;
  activa: boolean;
}
