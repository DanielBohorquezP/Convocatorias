import type {
  Categoria,
  Convocatoria,
  Fuente,
  Postulacion,
  Proyecto,
} from "./types";

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

export const categorias: Categoria[] = [
  { id: "tp-innovacion", tipo: "tipo_proyecto", nombre: "Innovación" },
  { id: "tp-investigacion", tipo: "tipo_proyecto", nombre: "Investigación aplicada" },
  { id: "tp-emprendimiento", tipo: "tipo_proyecto", nombre: "Emprendimiento" },
  { id: "tp-fortalecimiento", tipo: "tipo_proyecto", nombre: "Fortalecimiento empresarial" },
  { id: "tp-digital", tipo: "tipo_proyecto", nombre: "Transformación digital" },
  { id: "tp-sostenibilidad", tipo: "tipo_proyecto", nombre: "Sostenibilidad y economía circular" },
  { id: "tp-internacionalizacion", tipo: "tipo_proyecto", nombre: "Internacionalización" },

  { id: "sec-agro", tipo: "sector", nombre: "Agroindustria" },
  { id: "sec-tic", tipo: "sector", nombre: "TIC y software" },
  { id: "sec-manufactura", tipo: "sector", nombre: "Manufactura" },
  { id: "sec-turismo", tipo: "sector", nombre: "Turismo" },
  { id: "sec-salud", tipo: "sector", nombre: "Salud" },
  { id: "sec-educacion", tipo: "sector", nombre: "Educación" },
  { id: "sec-servicios", tipo: "sector", nombre: "Servicios" },
  { id: "sec-comercio", tipo: "sector", nombre: "Comercio" },

  { id: "te-mipyme", tipo: "tipo_entidad", nombre: "Mipyme" },
  { id: "te-startup", tipo: "tipo_entidad", nombre: "Startup" },
  { id: "te-persona-natural", tipo: "tipo_entidad", nombre: "Persona natural" },
  { id: "te-ong", tipo: "tipo_entidad", nombre: "ONG / Fundación" },
  { id: "te-publica", tipo: "tipo_entidad", nombre: "Entidad pública" },
  { id: "te-gran-empresa", tipo: "tipo_entidad", nombre: "Gran empresa" },
];

export function categoriaPorId(id: string): Categoria | undefined {
  return categorias.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Convocatorias
// ---------------------------------------------------------------------------

export const convocatorias: Convocatoria[] = [
  {
    id: "conv-1",
    nombre: "Fortalecimiento de la I+D+i Empresarial 2026",
    entidadConvocante: "Ministerio de Ciencia, Tecnología e Innovación (Minciencias)",
    descripcion:
      "Cofinanciación no reembolsable para proyectos de investigación, desarrollo tecnológico e innovación liderados por empresas colombianas, orientados a fortalecer capacidades de I+D+i y generar nuevos productos, procesos o servicios con potencial de mercado.",
    montoMin: 80_000_000,
    montoMax: 400_000_000,
    ubicacion: "Nacional",
    fechaApertura: "2026-07-01",
    fechaCierre: "2026-09-05",
    estado: "publicada",
    categorias: ["tp-innovacion", "tp-investigacion", "sec-tic", "sec-manufactura", "te-mipyme", "te-startup"],
    documentos: [
      { id: "doc-1-1", tipo: "TDR", nombre: "Términos de referencia I+D+i 2026", archivo: "tdr-minciencias-idi-2026.pdf", pesoKb: 842 },
      { id: "doc-1-2", tipo: "formato", nombre: "Formato de formulación de proyecto", archivo: "formato-formulacion-fp.docx", pesoKb: 210 },
      { id: "doc-1-3", tipo: "anexo", nombre: "Anexo presupuesto detallado", archivo: "anexo-presupuesto.xlsx", pesoKb: 96 },
    ],
    requisitos: [
      { id: "req-1-1", descripcion: "Certificado de existencia y representación legal vigente (< 30 días)", tipo: "documento", obligatorio: true, orden: 1 },
      { id: "req-1-2", descripcion: "Formulario de formulación de proyecto diligenciado", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-1-3", descripcion: "Estados financieros de los últimos 2 años", tipo: "documento", obligatorio: true, orden: 3 },
      { id: "req-1-4", descripcion: "La empresa debe tener mínimo 2 años de constituida", tipo: "condicion", obligatorio: true, orden: 4 },
      { id: "req-1-5", descripcion: "Carta de compromiso de contrapartida en efectivo o en especie", tipo: "documento", obligatorio: true, orden: 5 },
      { id: "req-1-6", descripcion: "Grupo de investigación aliado registrado en MinCiencias (opcional)", tipo: "condicion", obligatorio: false, orden: 6 },
    ],
  },
  {
    id: "conv-2",
    nombre: "Bogotá Reactiva: Fondo de Apoyo a Mipymes",
    entidadConvocante: "Cámara de Comercio de Bogotá",
    descripcion:
      "Apoyo económico y de acompañamiento técnico para micro, pequeñas y medianas empresas de Bogotá que buscan fortalecer sus procesos administrativos, comerciales y financieros tras periodos de contracción económica.",
    montoMin: 10_000_000,
    montoMax: 50_000_000,
    ubicacion: "Bogotá D.C.",
    fechaApertura: "2026-08-01",
    fechaCierre: "2026-10-15",
    estado: "publicada",
    categorias: ["tp-fortalecimiento", "sec-comercio", "sec-servicios", "te-mipyme"],
    documentos: [
      { id: "doc-2-1", tipo: "TDR", nombre: "Términos de referencia Bogotá Reactiva", archivo: "tdr-bogota-reactiva.pdf", pesoKb: 655 },
      { id: "doc-2-2", tipo: "formato", nombre: "Formato de plan de fortalecimiento", archivo: "formato-plan-fortalecimiento.docx", pesoKb: 180 },
    ],
    requisitos: [
      { id: "req-2-1", descripcion: "Matrícula mercantil renovada del año en curso", tipo: "documento", obligatorio: true, orden: 1 },
      { id: "req-2-2", descripcion: "RUT actualizado", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-2-3", descripcion: "Domicilio principal o sucursal en Bogotá D.C.", tipo: "condicion", obligatorio: true, orden: 3 },
      { id: "req-2-4", descripcion: "Plan de fortalecimiento diligenciado", tipo: "documento", obligatorio: true, orden: 4 },
    ],
  },
  {
    id: "conv-3",
    nombre: "Aldea: Escala tu Negocio de Base Tecnológica",
    entidadConvocante: "iNNpulsa Colombia",
    descripcion:
      "Programa de aceleración y cofinanciación para startups colombianas de base tecnológica en etapa de escalamiento, con acompañamiento en levantamiento de capital, modelo de negocio y entrada a nuevos mercados.",
    montoMin: 50_000_000,
    montoMax: 300_000_000,
    ubicacion: "Nacional",
    fechaApertura: "2026-06-15",
    fechaCierre: "2026-09-01",
    estado: "publicada",
    categorias: ["tp-digital", "tp-innovacion", "sec-tic", "te-startup"],
    documentos: [
      { id: "doc-3-1", tipo: "TDR", nombre: "Términos de referencia Aldea 2026", archivo: "tdr-aldea-2026.pdf", pesoKb: 730 },
      { id: "doc-3-2", tipo: "anexo", nombre: "Anexo métricas de tracción", archivo: "anexo-metricas-traccion.xlsx", pesoKb: 64 },
      { id: "doc-3-3", tipo: "formato", nombre: "Pitch deck sugerido", archivo: "formato-pitch-deck.pptx", pesoKb: 1200 },
    ],
    requisitos: [
      { id: "req-3-1", descripcion: "Startup constituida legalmente en Colombia", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-3-2", descripcion: "Mínimo Producto Mínimo Viable (MVP) validado en mercado", tipo: "condicion", obligatorio: true, orden: 2 },
      { id: "req-3-3", descripcion: "Pitch deck actualizado", tipo: "documento", obligatorio: true, orden: 3 },
      { id: "req-3-4", descripcion: "Reporte de métricas de tracción (usuarios, ingresos)", tipo: "documento", obligatorio: true, orden: 4 },
      { id: "req-3-5", descripcion: "Video pitch de 3 minutos (opcional)", tipo: "documento", obligatorio: false, orden: 5 },
    ],
  },
  {
    id: "conv-4",
    nombre: "Fondo de Economía Circular para Pymes",
    entidadConvocante: "Cooperación Alemana GIZ",
    descripcion:
      "Cofinanciación de proyectos piloto que reduzcan el uso de materiales vírgenes, promuevan el reciclaje industrial o el reaprovechamiento de residuos en cadenas productivas de manufactura y agroindustria.",
    montoMin: 30_000_000,
    montoMax: 120_000_000,
    ubicacion: "Antioquia, Valle del Cauca, Cundinamarca",
    fechaApertura: "2026-05-01",
    fechaCierre: "2026-08-30",
    estado: "publicada",
    categorias: ["tp-sostenibilidad", "sec-manufactura", "sec-agro", "te-mipyme"],
    documentos: [
      { id: "doc-4-1", tipo: "TDR", nombre: "Términos de referencia economía circular", archivo: "tdr-giz-economia-circular.pdf", pesoKb: 588 },
      { id: "doc-4-2", tipo: "anexo", nombre: "Anexo indicadores ambientales", archivo: "anexo-indicadores-ambientales.xlsx", pesoKb: 78 },
    ],
    requisitos: [
      { id: "req-4-1", descripcion: "Diagnóstico ambiental o de economía circular de la empresa", tipo: "documento", obligatorio: true, orden: 1 },
      { id: "req-4-2", descripcion: "Domicilio en Antioquia, Valle del Cauca o Cundinamarca", tipo: "condicion", obligatorio: true, orden: 2 },
      { id: "req-4-3", descripcion: "Certificado de existencia y representación legal", tipo: "documento", obligatorio: true, orden: 3 },
    ],
  },
  {
    id: "conv-5",
    nombre: "Programa de Apoyo a la Competitividad Rural (ADEL)",
    entidadConvocante: "Delegación de la Unión Europea en Colombia",
    descripcion:
      "Financiación de iniciativas productivas rurales que fortalezcan cadenas de valor agropecuarias, generen empleo formal y promuevan la sustitución de cultivos de uso ilícito en zonas priorizadas de posconflicto.",
    montoMin: 60_000_000,
    montoMax: 250_000_000,
    ubicacion: "Cauca, Nariño, Putumayo",
    fechaApertura: "2026-04-01",
    fechaCierre: "2026-11-30",
    estado: "publicada",
    categorias: ["tp-fortalecimiento", "tp-internacionalizacion", "sec-agro", "te-ong", "te-mipyme"],
    documentos: [
      { id: "doc-5-1", tipo: "TDR", nombre: "Términos de referencia ADEL Rural", archivo: "tdr-ue-adel-rural.pdf", pesoKb: 910 },
      { id: "doc-5-2", tipo: "terminos", nombre: "Términos y condiciones de cooperación UE", archivo: "terminos-cooperacion-ue.pdf", pesoKb: 340 },
      { id: "doc-5-3", tipo: "formato", nombre: "Marco lógico del proyecto", archivo: "formato-marco-logico.docx", pesoKb: 150 },
    ],
    requisitos: [
      { id: "req-5-1", descripcion: "Proyecto ubicado en zona rural priorizada", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-5-2", descripcion: "Marco lógico diligenciado", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-5-3", descripcion: "Carta de alianza con asociación de productores local", tipo: "documento", obligatorio: true, orden: 3 },
      { id: "req-5-4", descripcion: "Experiencia previa en proyectos de cooperación internacional (opcional)", tipo: "condicion", obligatorio: false, orden: 4 },
    ],
  },
  {
    id: "conv-6",
    nombre: "Medellín Exporta",
    entidadConvocante: "Cámara de Comercio de Medellín para Antioquia",
    descripcion:
      "Programa de internacionalización que cofinancia diagnósticos de exportación, participación en ruedas de negocios y adecuación de producto para empresas antioqueñas con vocación exportadora.",
    montoMin: 15_000_000,
    montoMax: 70_000_000,
    ubicacion: "Antioquia",
    fechaApertura: "2026-07-15",
    fechaCierre: "2026-09-10",
    estado: "publicada",
    categorias: ["tp-internacionalizacion", "sec-manufactura", "sec-agro", "te-mipyme"],
    documentos: [
      { id: "doc-6-1", tipo: "TDR", nombre: "Términos de referencia Medellín Exporta", archivo: "tdr-medellin-exporta.pdf", pesoKb: 470 },
      { id: "doc-6-2", tipo: "formato", nombre: "Formato diagnóstico exportador", archivo: "formato-diagnostico-exportador.docx", pesoKb: 140 },
    ],
    requisitos: [
      { id: "req-6-1", descripcion: "Matrícula mercantil vigente en Antioquia", tipo: "documento", obligatorio: true, orden: 1 },
      { id: "req-6-2", descripcion: "Producto o servicio con potencial exportador", tipo: "condicion", obligatorio: true, orden: 2 },
      { id: "req-6-3", descripcion: "Diagnóstico exportador diligenciado", tipo: "documento", obligatorio: true, orden: 3 },
    ],
  },
  {
    id: "conv-7",
    nombre: "Capital Semilla para Emprendimientos Innovadores",
    entidadConvocante: "Fondo Emprender - SENA",
    descripcion:
      "Recursos de capital semilla no reembolsable para emprendedores que deseen poner en marcha una empresa a partir de una idea de negocio innovadora, validada en el marco de la formación SENA o afines.",
    montoMin: 20_000_000,
    montoMax: 180_000_000,
    ubicacion: "Nacional",
    fechaApertura: "2026-03-01",
    fechaCierre: "2026-08-27",
    estado: "publicada",
    categorias: ["tp-emprendimiento", "tp-innovacion", "sec-tic", "sec-servicios", "te-startup", "te-persona-natural"],
    documentos: [
      { id: "doc-7-1", tipo: "TDR", nombre: "Términos de referencia Fondo Emprender", archivo: "tdr-fondo-emprender.pdf", pesoKb: 690 },
      { id: "doc-7-2", tipo: "formato", nombre: "Plan de negocio Fondo Emprender", archivo: "formato-plan-negocio-fe.docx", pesoKb: 260 },
      { id: "doc-7-3", tipo: "anexo", nombre: "Anexo flujo de caja proyectado", archivo: "anexo-flujo-caja.xlsx", pesoKb: 88 },
    ],
    requisitos: [
      { id: "req-7-1", descripcion: "Plan de negocio diligenciado en formato oficial", tipo: "documento", obligatorio: true, orden: 1 },
      { id: "req-7-2", descripcion: "Cédula de ciudadanía del emprendedor o representante legal", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-7-3", descripcion: "Idea de negocio no debe estar operando hace más de 12 meses", tipo: "condicion", obligatorio: true, orden: 3 },
      { id: "req-7-4", descripcion: "Flujo de caja proyectado a 3 años", tipo: "documento", obligatorio: true, orden: 4 },
    ],
  },
  {
    id: "conv-8",
    nombre: "Bancóldex Innova: Crédito para Transformación Digital",
    entidadConvocante: "Bancóldex",
    descripcion:
      "Línea de crédito blando con tasa preferencial y periodo de gracia, destinada a financiar la adopción de tecnologías digitales, automatización de procesos y comercio electrónico en empresas colombianas.",
    montoMin: 40_000_000,
    montoMax: 500_000_000,
    ubicacion: "Nacional",
    fechaApertura: "2026-02-01",
    fechaCierre: "2026-12-20",
    estado: "publicada",
    categorias: ["tp-digital", "sec-comercio", "sec-servicios", "sec-manufactura", "te-mipyme", "te-gran-empresa"],
    documentos: [
      { id: "doc-8-1", tipo: "terminos", nombre: "Términos y condiciones línea Bancóldex Innova", archivo: "terminos-bancoldex-innova.pdf", pesoKb: 520 },
      { id: "doc-8-2", tipo: "formato", nombre: "Formato de solicitud de crédito", archivo: "formato-solicitud-credito.pdf", pesoKb: 130 },
    ],
    requisitos: [
      { id: "req-8-1", descripcion: "Historial crediticio sin reportes negativos vigentes", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-8-2", descripcion: "Estados financieros certificados", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-8-3", descripcion: "Plan de inversión en transformación digital", tipo: "documento", obligatorio: true, orden: 3 },
    ],
  },
  {
    id: "conv-9",
    nombre: "Convocatoria CTeI para Startups de Base Tecnológica",
    entidadConvocante: "Ruta N Medellín",
    descripcion:
      "Financiación de proyectos de ciencia, tecnología e innovación desarrollados por startups con sede en Medellín, orientados a la creación de soluciones tecnológicas en salud digital, software e inteligencia artificial.",
    montoMin: 25_000_000,
    montoMax: 150_000_000,
    ubicacion: "Medellín, Antioquia",
    fechaApertura: "2026-06-01",
    fechaCierre: "2026-08-25",
    estado: "publicada",
    categorias: ["tp-investigacion", "tp-digital", "sec-tic", "sec-salud", "te-startup"],
    documentos: [
      { id: "doc-9-1", tipo: "TDR", nombre: "Términos de referencia CTeI Ruta N", archivo: "tdr-rutan-ctei.pdf", pesoKb: 610 },
      { id: "doc-9-2", tipo: "anexo", nombre: "Anexo de propiedad intelectual", archivo: "anexo-propiedad-intelectual.pdf", pesoKb: 95 },
    ],
    requisitos: [
      { id: "req-9-1", descripcion: "Domicilio o sede de operaciones en Medellín", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-9-2", descripcion: "Prototipo funcional o MVP demostrable", tipo: "condicion", obligatorio: true, orden: 2 },
      { id: "req-9-3", descripcion: "Declaración de propiedad intelectual", tipo: "documento", obligatorio: true, orden: 3 },
      { id: "req-9-4", descripcion: "Equipo fundador con dedicación de tiempo completo", tipo: "condicion", obligatorio: false, orden: 4 },
    ],
  },
  {
    id: "conv-10",
    nombre: "Fortalecimiento de Cadenas de Valor Agroindustriales",
    entidadConvocante: "USAID Colombia",
    descripcion:
      "Apoyo técnico y financiero a empresas agroindustriales para fortalecer eslabones de producción, transformación y comercialización, con énfasis en generación de empleo rural formal.",
    montoMin: 100_000_000,
    montoMax: 600_000_000,
    ubicacion: "Meta, Tolima, Huila",
    fechaApertura: "2026-01-15",
    fechaCierre: "2026-07-30",
    estado: "cerrada",
    categorias: ["tp-fortalecimiento", "sec-agro", "te-mipyme", "te-ong"],
    documentos: [
      { id: "doc-10-1", tipo: "TDR", nombre: "Términos de referencia USAID Agroindustria", archivo: "tdr-usaid-agroindustria.pdf", pesoKb: 780 },
      { id: "doc-10-2", tipo: "terminos", nombre: "Términos y condiciones de financiamiento USAID", archivo: "terminos-usaid.pdf", pesoKb: 410 },
    ],
    requisitos: [
      { id: "req-10-1", descripcion: "Operación en Meta, Tolima o Huila", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-10-2", descripcion: "Certificado de existencia y representación legal", tipo: "documento", obligatorio: true, orden: 2 },
      { id: "req-10-3", descripcion: "Plan de generación de empleo rural", tipo: "documento", obligatorio: true, orden: 3 },
    ],
  },
  {
    id: "conv-11",
    nombre: "Valle Innova",
    entidadConvocante: "Cámara de Comercio de Cali",
    descripcion:
      "Cofinanciación de proyectos de innovación tecnológica y turística para empresas del Valle del Cauca, con acompañamiento en propiedad intelectual y validación de mercado.",
    montoMin: 12_000_000,
    montoMax: 60_000_000,
    ubicacion: "Valle del Cauca",
    fechaApertura: "2026-09-01",
    fechaCierre: "2026-11-01",
    estado: "borrador",
    categorias: ["tp-innovacion", "sec-tic", "sec-turismo", "te-mipyme", "te-startup"],
    documentos: [
      { id: "doc-11-1", tipo: "TDR", nombre: "Borrador de términos de referencia Valle Innova", archivo: "tdr-valle-innova-borrador.pdf", pesoKb: 305 },
    ],
    requisitos: [
      { id: "req-11-1", descripcion: "Matrícula mercantil vigente en el Valle del Cauca", tipo: "documento", obligatorio: true, orden: 1 },
    ],
  },
  {
    id: "conv-12",
    nombre: "Reto Social: Innovación con Impacto",
    entidadConvocante: "Fundación Bolívar Davivienda",
    descripcion:
      "Fondo concursable para soluciones innovadoras que mejoren el acceso a educación y salud en comunidades vulnerables, con apoyo de mentoría y visibilidad ante inversionistas de impacto.",
    montoMin: 20_000_000,
    montoMax: 90_000_000,
    ubicacion: "Nacional",
    fechaApertura: "2026-05-10",
    fechaCierre: "2026-06-10",
    estado: "despublicada",
    categorias: ["tp-sostenibilidad", "sec-educacion", "sec-salud", "te-ong"],
    documentos: [
      { id: "doc-12-1", tipo: "TDR", nombre: "Términos de referencia Reto Social", archivo: "tdr-reto-social.pdf", pesoKb: 540 },
      { id: "doc-12-2", tipo: "formato", nombre: "Formato de teoría de cambio", archivo: "formato-teoria-cambio.docx", pesoKb: 175 },
    ],
    requisitos: [
      { id: "req-12-1", descripcion: "Entidad sin ánimo de lucro legalmente constituida", tipo: "condicion", obligatorio: true, orden: 1 },
      { id: "req-12-2", descripcion: "Teoría de cambio diligenciada", tipo: "documento", obligatorio: true, orden: 2 },
    ],
  },
];

export function convocatoriaPorId(id: string): Convocatoria | undefined {
  return convocatorias.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Proyectos
// ---------------------------------------------------------------------------

export const proyectos: Proyecto[] = [
  {
    id: "proy-1",
    nombre: "EcoEmpaques Andinos",
    descripcion:
      "Desarrollo de empaques biodegradables a partir de fibra de fique para reemplazar plásticos de un solo uso en la industria alimentaria colombiana.",
    montoBuscado: 150_000_000,
    ubicacion: "Bogotá D.C.",
    categorias: ["tp-sostenibilidad", "tp-innovacion", "sec-manufactura", "te-mipyme"],
  },
  {
    id: "proy-2",
    nombre: "AgroDatos Cauca",
    descripcion:
      "Plataforma de analítica de datos y monitoreo climático para pequeños caficultores del Cauca, orientada a mejorar el rendimiento y la trazabilidad del cultivo.",
    montoBuscado: 90_000_000,
    ubicacion: "Cauca",
    categorias: ["tp-digital", "tp-investigacion", "sec-agro", "te-startup"],
  },
  {
    id: "proy-3",
    nombre: "TurismoVivo Caribe",
    descripcion:
      "Aplicación móvil de turismo comunitario sostenible que conecta viajeros con experiencias operadas por comunidades locales en el Caribe colombiano.",
    montoBuscado: 60_000_000,
    ubicacion: "Bolívar",
    categorias: ["tp-emprendimiento", "sec-turismo", "te-startup"],
  },
];

export function proyectoPorId(id: string): Proyecto | undefined {
  return proyectos.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Postulaciones
// ---------------------------------------------------------------------------

export const postulaciones: Postulacion[] = [
  {
    id: "post-1",
    convocatoriaId: "conv-3",
    proyectoId: "proy-2",
    estado: "en_evaluacion",
    checklist: [
      { id: "chk-1-1", descripcion: "Constitución legal de la startup", obligatorio: true, completado: true },
      { id: "chk-1-2", descripcion: "MVP validado en mercado", obligatorio: true, completado: true },
      { id: "chk-1-3", descripcion: "Pitch deck actualizado", obligatorio: true, completado: true },
      { id: "chk-1-4", descripcion: "Reporte de métricas de tracción", obligatorio: true, completado: false },
      { id: "chk-1-5", descripcion: "Video pitch de 3 minutos", obligatorio: false, completado: false },
    ],
    historial: [
      { id: "hist-1-1", estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: "2026-07-02" },
      { id: "hist-1-2", estadoAnterior: "en_preparacion", estadoNuevo: "presentada", fecha: "2026-07-20" },
      { id: "hist-1-3", estadoAnterior: "presentada", estadoNuevo: "en_evaluacion", fecha: "2026-08-05" },
    ],
  },
  {
    id: "post-2",
    convocatoriaId: "conv-1",
    proyectoId: "proy-1",
    estado: "presentada",
    checklist: [
      { id: "chk-2-1", descripcion: "Certificado de existencia y representación legal", obligatorio: true, completado: true },
      { id: "chk-2-2", descripcion: "Formulario de formulación de proyecto", obligatorio: true, completado: true },
      { id: "chk-2-3", descripcion: "Estados financieros últimos 2 años", obligatorio: true, completado: true },
      { id: "chk-2-4", descripcion: "Carta de compromiso de contrapartida", obligatorio: true, completado: true },
      { id: "chk-2-5", descripcion: "Alianza con grupo de investigación", obligatorio: false, completado: false },
    ],
    historial: [
      { id: "hist-2-1", estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: "2026-07-10" },
      { id: "hist-2-2", estadoAnterior: "en_preparacion", estadoNuevo: "presentada", fecha: "2026-08-12" },
    ],
  },
  {
    id: "post-3",
    convocatoriaId: "conv-7",
    proyectoId: "proy-3",
    estado: "en_preparacion",
    checklist: [
      { id: "chk-3-1", descripcion: "Plan de negocio diligenciado", obligatorio: true, completado: true },
      { id: "chk-3-2", descripcion: "Cédula del emprendedor", obligatorio: true, completado: true },
      { id: "chk-3-3", descripcion: "Flujo de caja proyectado a 3 años", obligatorio: true, completado: false },
    ],
    historial: [
      { id: "hist-3-1", estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: "2026-08-15" },
    ],
  },
  {
    id: "post-4",
    convocatoriaId: "conv-10",
    proyectoId: "proy-1",
    estado: "rechazada",
    checklist: [
      { id: "chk-4-1", descripcion: "Operación en Meta, Tolima o Huila", obligatorio: true, completado: true },
      { id: "chk-4-2", descripcion: "Certificado de existencia y representación legal", obligatorio: true, completado: true },
      { id: "chk-4-3", descripcion: "Plan de generación de empleo rural", obligatorio: true, completado: true },
    ],
    historial: [
      { id: "hist-4-1", estadoAnterior: null, estadoNuevo: "en_preparacion", fecha: "2026-02-01" },
      { id: "hist-4-2", estadoAnterior: "en_preparacion", estadoNuevo: "presentada", fecha: "2026-03-10" },
      { id: "hist-4-3", estadoAnterior: "presentada", estadoNuevo: "en_evaluacion", fecha: "2026-04-22" },
      { id: "hist-4-4", estadoAnterior: "en_evaluacion", estadoNuevo: "rechazada", fecha: "2026-06-30" },
    ],
  },
];

export function postulacionPorId(id: string): Postulacion | undefined {
  return postulaciones.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Fuentes (panel admin)
// ---------------------------------------------------------------------------

export const fuentes: Fuente[] = [
  { id: "fuente-1", nombre: "Minciencias", tipoEntidad: "Entidad pública nacional", url: "https://minciencias.gov.co/convocatorias", activa: true },
  { id: "fuente-2", nombre: "Cámara de Comercio de Bogotá", tipoEntidad: "Cámara de comercio", url: "https://www.ccb.org.co", activa: true },
  { id: "fuente-3", nombre: "iNNpulsa Colombia", tipoEntidad: "Entidad pública nacional", url: "https://innpulsacolombia.com", activa: true },
  { id: "fuente-4", nombre: "Cooperación Alemana GIZ", tipoEntidad: "Cooperación internacional", url: "https://www.giz.de/en/worldwide/378.html", activa: true },
  { id: "fuente-5", nombre: "Delegación de la Unión Europea en Colombia", tipoEntidad: "Cooperación internacional", url: "https://www.eeas.europa.eu/colombia_es", activa: false },
  { id: "fuente-6", nombre: "Ruta N Medellín", tipoEntidad: "Fondo regional", url: "https://rutan.co", activa: true },
  { id: "fuente-7", nombre: "Bancóldex", tipoEntidad: "Entidad financiera pública", url: "https://www.bancoldex.com", activa: true },
];
