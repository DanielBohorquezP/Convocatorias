# Requerimientos funcionales (RF-01 a RF-75)

> Parte de la especificación del MVP v4 · Plataforma de Gestión de Convocatorias.
> Índice general en `docs/README.md`. Contexto rápido en `CLAUDE.md`.

---

## 4. Requerimientos funcionales

**75 requerimientos** (61 Must, 14 Should).

### 4.1 Gestión de usuarios y acceso

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-01 | Registro con elección de rol empresa o consultor; el administrador se asigna manualmente. El registro de empresa inicia el trial de 14 días con 3 créditos | CU-14 | Must |
| RF-02 | Autenticar y restringir las funciones administrativas al rol administrador | CU-14 | Must |
| RF-03 | Recuperación de contraseña por correo | CU-14 | Should |

### 4.2 Fuentes y convocatorias (administrador)

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-04 | Crear, editar y desactivar fuentes con nombre, tipo de entidad, URL y notas | CU-01 | Must |
| RF-05 | Crear convocatoria con nombre, entidad, descripción, monto, ubicación, fechas **y el enlace oficial de postulación (URL del portal de la entidad)** *(mod. v5)* | CU-02 | Must |
| RF-06 | Clasificar en categorías: tipo de proyecto, sector y tipo de entidad elegible | CU-02 | Must |
| RF-07 | Adjuntar documentos (TDR, términos, anexos, formatos) con nombre descriptivo | CU-03 | Must |
| RF-08 | Registrar la lista de requisitos exigidos como ítems individuales | CU-04 | Must |
| RF-09 | Publicar solo con datos mínimos **(incluido un enlace de postulación válido)** y ≥1 documento; permitir despublicar y editar *(mod. v5)* | CU-05 | Must |
| RF-10 | Cerrar automáticamente las convocatorias vencidas | CU-06 | Must |

### 4.3 Búsqueda y descubrimiento

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-11 | Catálogo de publicadas vigentes con búsqueda por texto libre | CU-07 | Must |
| RF-12 | Filtros combinables: tipo de proyecto, sector, entidad, monto, ubicación, cierre | CU-07 | Must |
| RF-13 | Ficha de detalle con datos, requisitos y descarga de documentos | CU-08 | Must |
| RF-14 | Registrar proyectos con sus datos de clasificación | CU-09 | Must |
| RF-15 | Sugerencias desde un proyecto ordenadas por coincidencias. Requiere suscripción | CU-10 | Must |
| RF-16 | Mostrar cada sugerencia con **porcentaje de compatibilidad** y desglose de criterios que coinciden y que no *(mod. v4)* | CU-10 | Must |
| RF-43 | **Chips de búsqueda sugerida** clickeables en el buscador y en el estado sin resultados, que precargan combinaciones de filtros *(nuevo v4)* | CU-07 | Should |
| RF-44 | **Indicadores públicos del catálogo** en la landing (convocatorias vigentes, monto total disponible en COP, entidades convocantes, consultores aprobados), calculados en vivo con caché de 1 hora *(nuevo v4)* | CU-36 | Should |

### 4.4 Proyectos enriquecidos *(nuevo v4)*

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-45 | El proyecto debe capturar, además de sus datos de clasificación, **datos de contenido**: problema que resuelve, objetivo general, objetivos específicos, población beneficiaria, actividades principales, resultados esperados, duración en meses, presupuesto estimado y experiencia de la empresa | CU-09 | Must |
| RF-46 | Mostrar un **indicador de completitud del proyecto** con los campos faltantes y su efecto sobre la calidad del documento generado | CU-09 | Must |
| RF-47 | Permitir generar documentos sobre un proyecto incompleto, advirtiendo previamente del resultado limitado | CU-09, CU-33 | Should |

### 4.5 Postulación y seguimiento

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-17 | Iniciar postulación generando el checklist automáticamente. Requiere suscripción | CU-11 | Must |
| RF-18 | Marcar ítems del checklist y mostrar porcentaje de avance | CU-12 | Must |
| RF-19 | Estados de la postulación con historial fechado | CU-13 | Must |
| RF-20 | Panel del usuario con postulaciones activas, avance y fechas de cierre | CU-12, 13 | Should |
| RF-21 | Impedir postulaciones sobre convocatorias cerradas o despublicadas | CU-06, 11 | Must |

### 4.6 Perfil del consultor

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-22 | Registro con rol consultor en estado "perfil incompleto" con acceso restringido | CU-15 | Must |
| RF-23 | Perfil con foto, nombre profesional, descripción, especialidades, sitio web, redes, portafolio y hoja de vida en PDF | CU-16 | Must |
| RF-24 | Envío a revisión solo con los mínimos completos | CU-17 | Must |
| RF-25 | Mostrar el motivo de rechazo y permitir corregir y reenviar | CU-17 | Must |

### 4.7 Directorio y encargos

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-26 | Directorio solo con consultores aprobados, activos y con suscripción vigente, con filtros por especialidad y rating | CU-20 | Must |
| RF-27 | Perfil completo visible; **hoja de vida, sitio web y redes sociales solo para admins y empresas con solicitud activa** *(mod. v5 — antes solo aplicaba a la hoja de vida)* | CU-21 | Should |
| RF-28 | Acción "Solicitar consultor": **exige elegir tipo de ayuda (convocatoria específica, con selector, o búsqueda de convocatoria) antes de confirmar**; la descripción de la tarea es complementaria. Disponible en la ficha del proyecto, **en la tarjeta del proyecto en el listado (`/proyectos`, mismo modal) y, de forma simétrica, en el detalle de una postulación (CU-13) — ahí el proyecto y la convocatoria quedan preseleccionados (tipo de ayuda fijo en "convocatoria específica"); si la postulación no tiene proyecto vinculado, primero pide vincular uno** *(mod. v5 — antes solo desde la ficha del proyecto)* | CU-19, **13** | Must |
| RF-29 | Solicitud de encargo con su ciclo de estados | CU-22 | Must |
| RF-30 | El consultor acepta o rechaza cada solicitud | CU-18, 22 | Must |
| RF-31 | Asignación interna con bandeja para administradores | CU-23, 26 | Must |
| RF-32 | Registro de avances y marcación de finalización | CU-18 | Must |
| RF-33 | Calificación única por encargo con recálculo del rating | CU-24 | Must |
| **RF-68** | El sistema adjunta automáticamente al encargo los datos de contenido del proyecto (problema, objetivo, población, presupuesto, etc.) y, si se eligió convocatoria específica, sus datos y requisitos — visibles para el consultor desde que recibe la solicitud, antes de aceptar o rechazar *(nuevo v5)* | CU-19, 22 | Must |
| **RF-69** | Cuando el tipo de ayuda es "buscar convocatoria", mostrar al consultor los datos de clasificación del proyecto (categorías, monto buscado, ubicación); el consultor reporta convocatorias candidatas mediante los avances del encargo *(nuevo v5)* | CU-19, 18 | Should |
| **RF-70** | Al aceptar una solicitud de encargo — por directorio o por asignación interna — revelar a empresa y consultor el correo de contacto de la contraparte; no visible mientras el encargo esté `pendiente` o `esperando_asignación` *(nuevo v5)* | CU-18, 22, 23, 26 | Must |
| **RF-71** | Permitir a la empresa autorizar o revocar, para un consultor con encargo `en_curso`, acceso de **lectura, edición manual y solicitud de ajustes con IA** a un documento generado específico — **nunca descarga**; sin autorización explícita el consultor no lo ve, aunque el encargo esté activo *(nuevo v5)* | CU-34, 18 | Must |
| **RF-72** | Bloquear en el servidor el endpoint de exportación del documento (`.../exportar`) para cualquier usuario distinto al dueño (la empresa), incluido un consultor autorizado a editarlo — refuerza RNF-20: la restricción no depende de ocultar el botón en la interfaz *(nuevo v5)* | CU-34 | Must |
| **RF-73** | Mostrar un botón "Ir al portal de la entidad" en la ficha de la convocatoria y en el detalle de la postulación, que abre el enlace oficial de postulación en una pestaña nueva sin salir de la sesión actual *(nuevo v5)* | CU-08, 13 | Must |
| **RF-74** | Permitir a la empresa solicitar un consultor directamente desde el directorio o su ficha de perfil, eligiendo en el mismo flujo **(a)** un proyecto propio (y opcionalmente el tipo de ayuda: convocatoria específica o buscar convocatoria) **o (b)** una postulación propia ya vinculada a un proyecto — fija automáticamente proyecto y convocatoria — sin depender de haber iniciado la solicitud antes desde la ficha del proyecto (CU-19) *(nuevo v5)* | CU-20, 21, 22 | Must |
| **RF-75** | El selector de "convocatoria específica" dentro de los flujos de solicitud de consultor (RF-28, RF-74) incluye un campo de búsqueda por texto que filtra las convocatorias vigentes por nombre mientras el usuario escribe, en vez de un menú desplegable con toda la lista — relevante a medida que crece el catálogo (RNF-04) *(nuevo v5)* | CU-19, 21 | Should |

### 4.8 Gestión de consultores (administrador)

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-34 | Bandeja de revisión con aprobar o rechazar con motivo obligatorio | CU-25 | Must |
| RF-35 | Suspender y reactivar conservando historial. **Al suspender, cancela de inmediato los encargos `en_curso` del consultor y registra el motivo; reactivar no los revive** *(mod. v5)* | CU-27 | Should |

### 4.9 Suscripciones y créditos

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-36 | Planes administrables por rol con precio mensual, anual **y créditos de IA mensuales**, sin despliegue *(mod. v4)* | CU-31 | Must |
| RF-37 | Trial automático de 14 días con 3 créditos al registrarse una empresa, único por cuenta; consultores sin trial | CU-28 | Must |
| RF-38 | Activación, renovación y suspensión manual por el administrador, con el modelo preparado para pasarela sin cambios de esquema | CU-28, 31 | Must |
| RF-39 | Job diario de vencimientos con periodo de gracia de 5 días | CU-29, 32 | Must |
| RF-40 | Verificación de suscripción en cada acción restringida, incluida la generación con IA | CU-32 | Must |
| RF-41 | Vista del suscriptor con plan, fechas, **cupo de créditos** e historial de pagos *(mod. v4)* | CU-30 | Should |
| RF-42 | Tablero admin de suscripciones por estado **y consumo de IA del periodo** *(mod. v4)* | CU-31 | Should |
| RF-48 | Descontar **un crédito por generación exitosa**; las generaciones fallidas no consumen crédito *(nuevo v4)* | CU-35 | Must |
| RF-49 | Reiniciar el cupo mensualmente según la fecha de la suscripción, también en planes anuales; los créditos no consumidos **no se acumulan** *(nuevo v4)* | CU-35 | Must |
| RF-50 | Bloquear la generación sin cupo mostrando opciones de mejora de plan o compra de paquete adicional *(nuevo v4)* | CU-35 | Must |
| RF-51 | Permitir al administrador otorgar paquetes de créditos adicionales a una suscripción *(nuevo v4)* | CU-31 | Should |
| RF-52 | Registrar cada consumo de IA (tipo, tokens, costo estimado, éxito o fallo) para auditoría y control de costo *(nuevo v4)* | CU-35 | Must |

### 4.10 Generación documental con IA *(nuevo v4)*

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-53 | Ofrecer la acción "Generar documento con IA" (o "Editar documento" si ya existe uno para ese par proyecto-convocatoria) en la ficha de la convocatoria, en la ficha del proyecto y, de forma simétrica, **en el detalle de la postulación** *(mod. v5 — antes solo cubría convocatoria y proyecto)* | CU-33, 34, 13 | Must |
| RF-54 | Presentar la lista de proyectos del usuario con su completitud y el cupo de créditos restante antes de generar | CU-33 | Must |
| RF-55 | Construir el contexto de generación con: datos de contenido del proyecto, datos estructurados de la convocatoria, requisitos definidos por el administrador y texto del TDR adjunto | CU-33 | Must |
| RF-56 | Generar el documento estructurado según los requisitos de la convocatoria; ante ausencia de requisitos, usar una estructura estándar (resumen, problema y justificación, objetivos, población, metodología y actividades, resultados, presupuesto, cronograma, experiencia) | CU-33 | Must |
| RF-57 | Marcar en el documento todo dato sin fuente como pendiente de completar y listar los pendientes al usuario | CU-33, 34 | Must |
| RF-58 | Mostrar el documento en vista previa editable, permitir edición libre sin costo y guardar los cambios | CU-34 | Must |
| RF-59 | Permitir hasta 3 ajustes solicitados a la IA en lenguaje natural por documento sin consumir crédito; a partir del cuarto se consume | CU-34 | Should |
| RF-60 | Exportar el documento a Word (.docx) | CU-34 | Must |
| RF-61 | Guardar cada documento asociado al par proyecto-convocatoria y, si existe, a la postulación correspondiente; conservar las versiones de regeneración | CU-33, 34 | Must |
| RF-62 | Mostrar estado de progreso durante la generación e informar con claridad cualquier fallo, con opción de reintentar | CU-33 | Must |
| RF-63 | La **plantilla de instrucción (prompt)** del generador debe estar almacenada como configuración editable y versionada por el administrador —nunca incrustada en el código—, permitiendo ajustarla, probar variantes y saber con qué versión se generó cada documento | CU-37 | Must |

### 4.11 Seguridad administrativa *(nuevo v5)*

| ID | Requerimiento | CU | Prioridad |
|---|---|---|---|
| RF-64 | Exigir verificación en dos pasos (MFA/TOTP) antes de permitir que una sesión con rol administrador opere cualquier función administrativa | CU-38 | Must |
| RF-65 | Registrar cada evento de seguridad (login fallido, acceso denegado, bloqueo por límite de tasa, activación/fallo de MFA) con tipo, usuario si aplica, IP, ruta y fecha | CU-39 | Must |
| RF-66 | Aplicar límite de tasa por usuario e IP en los endpoints de la capa de aplicación, en especial en la generación con IA, de forma independiente al cupo de créditos | CU-40 | Must |
| RF-67 | Permitir al administrador liberar manualmente un bloqueo por límite de tasa antes de su expiración | CU-40 | Should |

---

