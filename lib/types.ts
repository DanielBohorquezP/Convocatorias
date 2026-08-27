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

// ---------------------------------------------------------------------------
// Empresas (mínimo, solo para mostrar nombre en paneles de admin)
// ---------------------------------------------------------------------------

export interface Empresa {
  id: string;
  nombre: string;
}

// ---------------------------------------------------------------------------
// Consultores
// ---------------------------------------------------------------------------

export type RedSocialTipo = "linkedin" | "instagram" | "facebook" | "otra";

export interface RedSocial {
  id: string;
  tipo: RedSocialTipo;
  url: string;
}

export interface ItemPortafolio {
  id: string;
  nombreProyecto: string;
  entidad: string;
  anio: number;
  descripcion: string;
  resultado: string;
}

export type EstadoPerfilConsultor =
  | "incompleto"
  | "en_revision"
  | "aprobado"
  | "rechazado"
  | "suspendido";

export interface PerfilConsultor {
  id: string;
  nombreProfesional: string;
  descripcion: string;
  fotoUrl: string;
  sitioWeb: string;
  redes: RedSocial[];
  especialidades: string[]; // Categoria ids
  portafolio: ItemPortafolio[];
  cvNombre: string;
  estadoPerfil: EstadoPerfilConsultor;
  motivoRechazo?: string;
  esEquipoInterno: boolean;
  ratingPromedio: number;
  totalEncargosCompletados: number;
}

// ---------------------------------------------------------------------------
// Encargos
// ---------------------------------------------------------------------------

export type ViaEncargo = "directorio" | "asignacion_interna";

export type EstadoEncargo =
  | "esperando_asignacion"
  | "pendiente"
  | "en_curso"
  | "rechazado"
  | "completado"
  | "calificado"
  | "cancelado";

export interface AvanceEncargo {
  id: string;
  nota: string;
  fecha: string; // ISO date
}

export interface Encargo {
  id: string;
  proyectoId: string;
  empresaId: string;
  consultorId: string | null;
  tituloTarea: string;
  descripcionTarea: string;
  via: ViaEncargo;
  estado: EstadoEncargo;
  avances: AvanceEncargo[];
  fechas: {
    creada: string;
    aceptado: string | null;
    completado: string | null;
  };
}

export interface Calificacion {
  id: string;
  encargoId: string;
  consultorId: string;
  estrellas: number;
  comentario: string;
  fecha: string; // ISO date
}

// ---------------------------------------------------------------------------
// Planes y suscripciones
// ---------------------------------------------------------------------------

export type RolPlan = "empresa" | "consultor";

export interface Plan {
  id: string;
  nombre: string;
  rol: RolPlan;
  precioMensual: number;
  precioAnual: number;
}

export type ModalidadSuscripcion = "trial" | "mensual" | "anual";

export type EstadoSuscripcion = "trial" | "activa" | "en_gracia" | "vencida" | "suspendida";

export interface Pago {
  id: string;
  suscripcionId: string;
  monto: number;
  fecha: string; // ISO date
}

export interface Suscripcion {
  id: string;
  usuarioId: string;
  planId: string;
  modalidad: ModalidadSuscripcion;
  estado: EstadoSuscripcion;
  fechaInicio: string; // ISO date
  fechaVencimiento: string; // ISO date
}

// ---------------------------------------------------------------------------
// Simulador de modo demo (roles/estados de sesión, sin autenticación real)
// ---------------------------------------------------------------------------

export type ModoDemo =
  | "empresa_trial"
  | "empresa_vencida"
  | "consultor_aprobado"
  | "consultor_revision"
  | "admin";
