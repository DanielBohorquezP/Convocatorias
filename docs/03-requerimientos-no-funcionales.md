# Requerimientos no funcionales y reglas de negocio

> Parte de la especificación del MVP v4 · Plataforma de Gestión de Convocatorias.
> Índice general en `docs/README.md`. Contexto rápido en `CLAUDE.md`.

---

## 5. Requerimientos no funcionales

**28 RNF.** Críticos para el piloto: RNF-01..04, 11, 12, 16, 17, 20, 21, 24, **25, 26, 27 y 28** *(ampliado en la auditoría de seguridad v5)*.

### 5.1 Seguridad

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-01 | Autenticación y acceso | Contraseñas con hash seguro; funciones administrativas inaccesibles para otros roles incluso vía API | Empresa/consultor a endpoints admin → 403 |
| RNF-02 | Cifrado | HTTPS/TLS en tránsito; archivos cifrados en reposo | Escaneo TLS y de buckets |
| RNF-03 | Aislamiento de datos | Cada empresa ve solo sus proyectos, postulaciones, encargos **y documentos generados**; cada consultor solo sus encargos. Perfiles aprobados visibles salvo la hoja de vida | Prueba cruzada entre 2 empresas y 2 consultores |
| RNF-25 | **Cobertura de RLS** | Row Level Security habilitado y con política explícita en las 24 tablas sin excepción; ninguna tabla nueva se despliega sin su política escrita y probada *(nuevo v5)* | Revisión de esquema: cada tabla tiene ≥1 política activa; lectura cruzada por tabla entre 2 cuentas → denegada |
| RNF-26 | **Gobierno de credenciales elevadas** | La `service_role key` de Supabase solo se referencia en código de servidor (API routes, jobs de `pg_cron`); nunca en el bundle del cliente ni en variables `NEXT_PUBLIC_*` *(nuevo v5)* | Búsqueda de la key en el bundle compilado del cliente → 0 resultados |
| RNF-27 | **Límite de tasa** | Los endpoints de la capa de aplicación —en especial la generación con IA— aplican límite de tasa por usuario e IP, independiente del cupo de créditos *(nuevo v5)* | Ráfaga de requests por encima del límite → 429 antes de agotar el cupo real |
| RNF-28 | **Autenticación reforzada de administradores** | Toda cuenta con rol administrador exige verificación en dos pasos (MFA/TOTP) para iniciar sesión; no se completa el login admin sin un segundo factor activo *(nuevo v5)* | Login admin sin MFA configurado → flujo obligatorio de activación antes de continuar |
| RNF-29 | **Validación del enlace oficial de postulación** | El enlace debe ser una URL `http`/`https` bien formada, verificada en el servidor antes de guardar (no solo en el cliente); se rechaza cualquier otro esquema *(nuevo v5)* | Guardar `javascript:`, una cadena inválida o un dominio malformado → rechazado con mensaje claro |

### 5.2 Rendimiento

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-04 | Catálogo | Búsqueda y filtros < 2 s con hasta 1.000 convocatorias | Prueba de carga |
| RNF-05 | Sugerencias | Cruce de atributos y cálculo de compatibilidad < 3 s | SQL indexado; prueba de carga |
| RNF-06 | Documentos | Descarga de 20 MB inicia < 3 s; carga admin hasta 50 MB | Archivos límite |
| RNF-21 | **Generación con IA** | La generación puede tardar hasta 120 s; queda excluida de los umbrales anteriores. Debe mostrar progreso y no bloquear la navegación; si excede el tope, falla de forma controlada sin consumir crédito *(nuevo v4)* | Medición sobre 20 generaciones con TDR reales |

### 5.3 Usabilidad

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-07 | Idioma y simplicidad | Interfaz en español; flujos completables sin capacitación | Prueba con 3 usuarios piloto |
| RNF-08 | Responsivo | Usable en escritorio y móvil; panel admin puede ser solo escritorio | Revisión en 3 tamaños |

### 5.4 Disponibilidad y respaldo

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-09 | Disponibilidad | 99 % en horario hábil colombiano durante el piloto | Monitoreo de uptime |
| RNF-10 | Respaldos | Copia diaria de BD y archivos; restauración probada | Simulacro de restauración |

### 5.5 Integridad y trazabilidad

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-11 | Trazabilidad | Auditoría de creación y publicación de convocatorias, aprobación de consultores, historial de postulaciones y encargos, **y consumos de IA** | Revisión de campos de auditoría |
| RNF-12 | Consistencia | Integridad referencial sin registros huérfanos | Restricciones del esquema |
| RNF-17 | Integridad del rating | Una calificación por encargo, inmutable, promedio no editable | Segunda calificación → rechazada |

### 5.6 Escalabilidad y mantenibilidad

| ID | Atributo | Requerimiento | Requerimiento |
|---|---|---|---|
| RNF-13 | Evolución | El esquema soporta scraping y matching semántico futuros sin migración; suscripciones preparadas para pasarela | Revisión de diseño |
| RNF-14 | Catálogos administrables | Categorías, planes y cupos de créditos son datos, no código | Cambio desde el panel admin sin despliegue |
| RNF-15 | Portabilidad | Lógica portable; PostgreSQL estándar exportable; Next.js desplegable en otros entornos | Export de BD + despliegue alterno |
| RNF-22 | **Independencia del proveedor de IA** | La construcción del contexto y el parseo del resultado se aíslan tras una interfaz propia, de modo que cambiar de proveedor o de modelo no exija reescribir el módulo *(nuevo v4)* | Revisión de diseño del servicio de generación |

### 5.7 Datos personales y contenido generado

| ID | Atributo | Requerimiento | Verificación |
|---|---|---|---|
| RNF-16 | Protección de datos personales | Datos del consultor bajo consentimiento explícito (Ley 1581 de 2012). Hoja de vida solo por URLs firmadas con expiración **máxima de 15 minutos** *(precisado en v5)*. Derecho a eliminación del perfil | Acceso directo a la URL del CV sin autorización → denegado; URL reutilizada pasados 15 min → denegada |
| RNF-18 | Archivos de perfil | Foto ≤5 MB (JPG/PNG); hoja de vida ≤10 MB (PDF); validación en cliente y servidor | Archivos límite y tipos inválidos |
| RNF-19 | Rendimiento del directorio | Listado con filtros < 2 s con hasta 500 consultores | Prueba de carga |
| RNF-20 | Enforcement en servidor | Suscripción y cupo verificados en la capa de aplicación y en RLS, nunca solo en UI; cambios de estado auditados | API directa sin cupo → 403; bitácora |
| RNF-23 | **Veracidad del contenido generado** | El documento no incluye datos, cifras ni antecedentes que no provengan del proyecto del usuario o de la convocatoria; los vacíos se marcan como pendientes y nunca se completan por inferencia. La interfaz declara que el documento es una base sujeta a revisión humana *(nuevo v4)* | Revisión experta de 10 documentos generados con proyectos deliberadamente incompletos: cero datos inventados |
| RNF-24 | **Transparencia y control del uso de IA** | Los términos informan que el contenido del proyecto y de la convocatoria se procesa con un proveedor externo de IA. Cada generación registra tokens y costo estimado; existe un tope de tamaño de contexto por generación *(nuevo v4)* | Revisión de términos y de la bitácora de consumos |

---

## 6. Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | Una convocatoria es visible solo cuando el admin completa datos mínimos —**incluido el enlace oficial de postulación**—, adjunta ≥1 documento, define requisitos y publica *(ampliado en v5)* |
| RN-02 | Convocatoria vencida pasa automáticamente a "cerrada" y sale de catálogo, sugerencias y generación con IA |
| RN-03 | No se puede postular ni generar documentos sobre convocatorias cerradas o despublicadas |
| RN-04 | El checklist se genera copiando los requisitos vigentes al postular; ediciones posteriores no alteran postulaciones en curso |
| RN-05 | El porcentaje de compatibilidad es un cálculo determinístico de coincidencias, no una predicción de éxito ni un resultado de IA, y así se comunica; la decisión de postular es del usuario |
| RN-06 | El rol administrador se asigna manualmente; todo registro de autoservicio nace como empresa o consultor |
| RN-07 | Fuentes y convocatorias no se eliminan físicamente: se desactivan o despublican |
| RN-08 | Un consultor aparece en el directorio solo si: perfil aprobado + no suspendido + suscripción activa |
| RN-09 | Una calificación por encargo completado, emitida solo por la empresa de ese encargo, inmutable |
| RN-10 | Consultor con suscripción vencida termina sus encargos en curso pero no recibe nuevos |
| RN-11 | Trial de 14 días con 3 créditos, único por cuenta de empresa; el consultor paga desde su aprobación; los administradores no pagan |
| RN-12 | La hoja de vida, **el sitio web y las redes sociales** solo son visibles para administradores y empresas con solicitud activa con ese consultor; sin solicitud, la empresa solo ve descripción, especialidades, portafolio (sin links de contacto) y rating *(ampliado en v5 — antes solo cubría la hoja de vida)* |
| RN-13 | Todo rechazo de perfil lleva motivo obligatorio; reenvíos sin límite |
| RN-14 | El pago del servicio de consultoría se acuerda entre empresa y consultor fuera de la plataforma; los ingresos vienen de las suscripciones |
| RN-15 | La suspensión de un consultor no borra su historial |
| RN-16 | Suscripción vencida: 5 días de gracia con avisos antes de restringir |
| RN-17 | **Un crédito por generación exitosa.** Las ediciones manuales no cuestan; los ajustes pedidos a la IA son gratuitos hasta 3 por documento; del cuarto en adelante consumen crédito. Una generación fallida nunca consume crédito |
| RN-18 | **Los créditos se reinician cada mes** según la fecha de la suscripción, también en planes anuales, y **no se acumulan** de un periodo al siguiente. Los créditos de paquetes adicionales sí permanecen hasta agotarse |
| RN-19 | **La plataforma no radica postulaciones.** La presentación se hace en el portal de la entidad convocante; el documento generado es un insumo de preparación y así se comunica |
| RN-20 | **El documento generado es responsabilidad final del usuario**, quien debe verificarlo y completar los pendientes antes de usarlo |
| RN-21 | Un proyecto incompleto puede usarse para generar, pero el sistema advierte previamente que el resultado será limitado |
| RN-22 | Los documentos generados pertenecen a la empresa que los generó y solo son visibles para ella. **El consultor con encargo `en_curso` sobre ese proyecto puede leer, editar el contenido y solicitar ajustes con IA únicamente si la empresa lo autoriza explícitamente para ese documento — la aceptación del encargo, por sí sola, nunca da acceso. El consultor autorizado nunca puede exportar/descargar el documento; esa acción es exclusiva de la empresa dueña** *(precisado en v5)* |
| RN-23 | El contenido extraído de documentos adjuntos (TDR) que alimenta la generación con IA se sanitiza antes de incluirse en el prompt, removiendo instrucciones incrustadas dirigidas al modelo *(nuevo v5)* |
| RN-24 | Ninguna tabla del esquema se despliega sin RLS habilitado y su política definida: es un requisito de diseño desde el Sprint 0, no una revisión posterior *(nuevo v5)* |
| RN-25 | Un consultor con un encargo `pendiente`, `en_curso` o `esperando_asignación` sobre un proyecto puede ver el contenido de **ese** proyecto (y la convocatoria asociada, si el tipo de ayuda es "convocatoria específica") — limitado a ese encargo, no al resto de proyectos de la empresa *(nuevo v5)* |
| RN-26 | El correo de contacto entre empresa y consultor solo se revela cuando el encargo pasa a `en_curso` (por aceptación en directorio o por asignación interna del administrador); nunca mientras está `pendiente` o `esperando_asignación`, ni tras un rechazo o cancelación *(nuevo v5)* |
| RN-27 | La autorización de un documento generado a un consultor solo puede otorgarse mientras el encargo esté `en_curso`; la empresa puede revocarla en cualquier momento, lo que oculta el documento al consultor sin eliminarlo ni afectar el encargo *(nuevo v5)* |
| RN-28 | Cuando el ajuste con IA sobre un documento lo solicita un consultor autorizado (no la empresa dueña), el consumo de crédito —si aplica, a partir del cuarto ajuste (RN-17)— se descuenta siempre del cupo de la **empresa** dueña del documento, nunca del cupo propio del consultor *(nuevo v5)* |
| RN-29 | Suspender un consultor (CU-27) cancela de inmediato sus encargos `en_curso` — pasan a `cancelado` con un motivo registrado — sin alterar el historial ni las calificaciones ya emitidas; reactivar el perfil no los revive. El vencimiento de la suscripción del consultor (RN-10, CU-18) produce el mismo efecto sobre el dato, con un disparador distinto (el job diario, CU-32, en vez de una acción del administrador) *(nuevo v5)* |

---

