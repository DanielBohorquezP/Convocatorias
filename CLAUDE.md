# Plataforma de Gestión de Convocatorias

Aplicación web que ayuda a empresas colombianas a **encontrar convocatorias de financiación, generar con IA el documento base de postulación, preparar la postulación y contratar consultores**. Monetiza con suscripción mensual/anual por rol; los planes de **empresa** se diferencian por créditos de IA, el de **consultor** por acceso al directorio y a los encargos.

**Especificación vigente: v6.** Este archivo es el contexto mínimo. El detalle vive en `docs/` y se lee **bajo demanda**, no completo.

---

## Reglas de producto que nunca se rompen

1. **La plataforma NO radica postulaciones.** La presentación se hace en el portal de la entidad convocante. Aquí se *prepara*: buscar, evaluar compatibilidad, generar el documento base, organizar el checklist y hacer seguimiento. (RN-19)
2. **Veracidad del contenido generado.** La IA nunca inventa datos, cifras ni antecedentes que no vengan del proyecto del usuario o de la convocatoria. Lo que falte se marca como `[COMPLETAR: ...]` y se lista al usuario. (RNF-23, RF-57)
3. **La IA se usa en un solo lugar:** generar el documento base de postulación. **No** estructura el catálogo ni hace matching semántico — el matching es un cruce determinístico de atributos. (RN-05)
4. **Las convocatorias se cargan manualmente** por un administrador. Sin scraping en el MVP.
5. **Un crédito por generación exitosa.** Una generación fallida **nunca** consume crédito. 3 ajustes con IA gratis por documento. (RN-17)
6. **Suscripción y cupo se validan en el servidor y en RLS**, nunca solo en la interfaz. (RNF-20)
7. **La plataforma no intermedia el pago de los encargos** entre empresa y consultor. Los ingresos vienen de las suscripciones. (RN-14)
8. **Ninguna tabla se despliega sin RLS con política explícita, y ninguna sesión administrativa opera sin MFA verificado.** Ambos son requisitos de diseño desde el Sprint 0, no revisiones posteriores. (RN-24, RNF-25, RNF-28)
9. **Toda entidad de usuario declara su propietario y ningún listado se sirve sin filtrar por él** (RN-30), y **toda ruta y endpoint declara los roles que admite** (RNF-30). Ocultar un botón no es autorizar: el control vive en el servidor. También son requisitos de Sprint 0.
10. **El consultor no tiene cupo propio de créditos de IA.** No genera documentos; los ajustes que pide sobre un documento autorizado los paga siempre la empresa dueña, y no existe caso de respaldo que cargue el consumo a quien dispara la acción. (RN-28)

---

## Los tres roles

| Rol | Qué hace | Acceso |
|---|---|---|
| **Empresa** | Busca convocatorias, registra proyectos, genera documentos con IA, postula, contrata consultores | Registro libre + trial 14 días con 3 créditos |
| **Consultor** | Perfil con portafolio/CV/redes, recibe y ejecuta encargos, recibe calificaciones. **No genera documentos ni tiene cupo propio de IA** (RN-28) | Requiere **aprobación de un administrador** antes de operar |
| **Administrador** | Fuentes, convocatorias, requisitos, aprobación de consultores, planes y créditos, plantilla del prompt, seguridad y auditoría | Asignación manual del rol + **MFA obligatorio** (RNF-28) |

## Flujos centrales

```
CATÁLOGO      buscar/filtrar → ficha → [Postular] o [Generar documento con IA]
SUGERENCIAS   proyecto registrado → cruce de atributos → % de compatibilidad + desglose
GENERACIÓN    convocatoria → elegir proyecto → generar (1 crédito) → editar → exportar .docx
POSTULACIÓN   crear → checklist copiado de los requisitos → avance → estados con historial
ENCARGOS      proyecto → tipo de ayuda (convocatoria específica o buscar convocatoria) → directorio
              o asignación interna → aceptación (revela contacto) → ejecución → calificar
```

## Stack

Next.js (App Router) + TypeScript + Tailwind, desplegado en **Vercel**. Backend con **Supabase**: PostgreSQL con RLS, Auth (3 roles), Storage (3 buckets) y pg_cron (3 jobs diarios). La IA es **Claude API**, aislada tras una interfaz propia (RNF-22).

## Convenciones

- Todo el producto y el código de cara al usuario está **en español**; montos en **COP**.
- Paleta: azul `#1F3864` (base), rojo `#8A2A21` (módulo de consultores), verde azulado `#0F766E` (módulo de IA y créditos).
- Los identificadores `CU-xx`, `RF-xx`, `RNF-xx` y `RN-xx` son la referencia canónica: al implementar o discutir una funcionalidad, cítalos.

---

## Dónde buscar el detalle (`docs/`)

| Necesitas… | Lee |
|---|---|
| Alcance, actores, métricas de éxito | `docs/00-contexto-y-alcance.md` |
| Flujos paso a paso, precondiciones, alternos | `docs/01-casos-de-uso.md` |
| Qué debe hacer el sistema (RF-01..63) | `docs/02-requerimientos-funcionales.md` |
| Rendimiento, seguridad, veracidad, reglas de negocio | `docs/03-requerimientos-no-funcionales.md` |
| Capas, rutas de pantallas, endpoints, servicios | `docs/04-arquitectura.md` |
| **Tablas, columnas, RLS, índices, SQL** | `docs/05-modelo-de-datos.md` |
| Procesos core vs. tercerizables | `docs/06-procesos-de-negocio.md` |
| Planes, precios, créditos, competencia | `docs/07-modelo-de-negocio.md` |
| Sprints, hitos, qué viene después del MVP | `docs/08-roadmap.md` |
| Qué RF/RNF cubre cada caso de uso | `docs/09-trazabilidad.md` |
| Todo junto (solo si hace falta) | `docs/99-especificacion-completa.md` |
| Cómo levantar el proyecto localmente | `docs/INSTRUCCIONES-INSTALACION.md` |

Diagramas en `docs/diagramas/`: arquitectura v4 (pendiente de actualizar a v6), modelo de datos base, módulo de consultores y módulo de IA.

**Antes de implementar una pantalla o endpoint, lee el caso de uso correspondiente y su requerimiento.** No infieras el comportamiento: está escrito. Al agregar un CU o RF nuevo, continúa la numeración y añádelo también a `docs/09-trazabilidad.md`.

## Ruta para modificar arquitectura, RF/RNF o casos de uso

Este proyecto documenta primero y programa después (ver regla de `docs/README.md`: *"si el código y estos documentos se contradicen, gana el documento"*). Para **agregar una funcionalidad nueva** o **modificar/editar una existente**, sigue este orden — nunca empieces por el código:

### 1. Ubica qué tipo de cambio es y qué documento se edita primero

| El cambio afecta… | Edita primero | Formato a seguir |
|---|---|---|
| Un flujo de pantalla, un actor, precondiciones/postcondiciones | `docs/01-casos-de-uso.md` | Sigue la numeración `CU-xx`; si es nuevo, usa el siguiente número libre y márcalo `(nuevo v5)`; si modificas uno existente, márcalo `(mod. v5)` |
| Qué debe hacer el sistema (un comportamiento concreto) | `docs/02-requerimientos-funcionales.md` | Numeración `RF-xx` continua, con prioridad MoSCoW (Must/Should) y el `CU` al que pertenece |
| Seguridad, rendimiento, disponibilidad, veracidad de IA | `docs/03-requerimientos-no-funcionales.md` | Numeración `RNF-xx`, con criterio de verificación medible |
| Una regla de negocio transversal (no un flujo, una restricción) | `docs/03-requerimientos-no-funcionales.md` §6 | Numeración `RN-xx` |
| Capas, rutas de pantalla, endpoints, servicios | `docs/04-arquitectura.md` | Actualiza la tabla de rutas del portal correspondiente y/o la tabla de endpoints |
| Tablas, columnas, índices, RLS | `docs/05-modelo-de-datos.md` | Agrega la columna/tabla con tipo y restricción; revisa si necesita índice o política RLS nueva |
| Qué se terceriza o no | `docs/06-procesos-de-negocio.md` | — |
| Precio, plan, créditos, competencia | `docs/07-modelo-de-negocio.md` | — |
| Fecha, sprint, fase posterior al MVP | `docs/08-roadmap.md` | — |

Si el cambio es amplio (por ejemplo, un módulo nuevo), es normal que toque varios de estos documentos a la vez — ese es justo el caso de "generación documental con IA" en v4, que tocó CU, RF, RNF, arquitectura y modelo de datos juntos.

### 2. Antes de editar, lee las dependencias

Revisa `docs/09-trazabilidad.md` para ver qué CU, RF y RNF/RN ya están relacionados con lo que vas a tocar — así no rompes algo que depende de ese comportamiento sin darte cuenta. Si tu cambio introduce una relación nueva (p. ej. un RF nuevo que depende de un CU existente), agrégala a esa matriz.

### 3. Edita el o los documentos

- Continúa la numeración existente (nunca reutilices un ID retirado).
- Si el comportamiento cambia RN-19, RN-20, RN-05, RN-17 o cualquier otra que esté citada en "Reglas de producto que nunca se rompen" (arriba en este archivo), actualiza también esa sección de `CLAUDE.md`.
- Si agregas o cambias una tabla en `docs/05-modelo-de-datos.md`, revisa si `docs/04-arquitectura.md` necesita un endpoint nuevo o modificado.
- Actualiza `docs/09-trazabilidad.md` con las nuevas filas o relaciones.

### 4. Solo después, implementa en el código

Con el documento ya actualizado como fuente de verdad, traduce el cambio al prototipo siguiendo el mapeo de la sección siguiente ("Estructura del código"): tipos en `lib/types.ts`, datos semilla en `lib/mock-data.ts`, lógica de negocio en `lib/store.ts`, pantallas en `app/`. Cita el `CU-xx`/`RF-xx` correspondiente en el commit o en comentarios donde no sea obvio, igual que hace la documentación.

### 5. Si algo es ambiguo, no lo inventes

Si una funcionalidad nueva no tiene un requerimiento claro que la respalde, o si modificar uno existente puede romper una regla de negocio (`RN-xx`) no declarada como tal, pregunta antes de asumir el comportamiento — es exactamente el error que RN-19/RN-20/RNF-23 existen para prevenir en el propio producto (no inventar lo que falta), y aplica igual al proceso de especificarlo.

## Estructura del código (prototipo actual)

El código ya sigue la organización de `docs/04-arquitectura.md`. Antes de crear un archivo nuevo, ubica dónde encaja:

```
app/(portal)/          → Portal Empresa: convocatorias, proyectos, documentos,
                          postulaciones, consultores, encargos, suscripción
app/consultor/         → Portal Consultor: perfil, encargos, documentos, suscripción
app/admin/             → Panel Administrador: fuentes, convocatorias, categorías,
                          consultores/revision, encargos, planes, plantillas, suscripciones
components/            → Componentes compartidos (Navbar, cards, modales, badges)
components/ui/         → Primitivas de UI (Button, Chip, Badge, ProgressBar, EmptyState)
lib/types.ts           → Todos los tipos — reflejan 1:1 las tablas de docs/05-modelo-de-datos.md
lib/mock-data.ts       → Datos semilla (reemplazar por Supabase en la fase de backend)
lib/store.ts           → Estado global con Zustand: toda la lógica de negocio del
                          prototipo vive aquí (crear proyecto, generar documento,
                          consumir crédito, cambiar estado de postulación, etc.)
lib/documentos.ts       → Composición del documento generado y aplicación de ajustes de IA
lib/proyectos.ts        → Cálculo del indicador de completitud del proyecto (RF-46)
lib/session.ts          → Simulador de sesión/rol: **no hay auth real todavía**.
                          `ModoDemo` (empresa_trial, empresa_vencida, empresa_sin_creditos,
                          consultor_aprobado, consultor_revision, admin) sustituye a
                          Supabase Auth + RLS mientras no hay backend
```

**Importante para features nuevas:** mientras no exista backend, toda regla de negocio (RN-xx) que en producción sería enforcement en servidor/RLS (RNF-20) se implementa en `lib/store.ts` contra el `ModoDemo` activo. Al conectar Supabase, esa lógica se traslada a API routes + políticas RLS (ver `docs/04-arquitectura.md` §8.3 y `docs/05-modelo-de-datos.md` §9.5), y `session.ts` se reemplaza por Supabase Auth.

## Estado actual

Frontend de prototipo funcional con datos mock (Zustand + `ModoDemo`, sin autenticación real ni backend). La UI, los tipos y las reglas de negocio del store ya implementan el modelo v4 completo: créditos de IA, completitud de proyecto, generación y ajustes de documentos, versiones de plantilla.

**La especificación v6 va por delante del código**: los requerimientos de autorización, aislamiento y usabilidad (RF-76..83, RNF-30..34, RN-30) están escritos y aprobados, pero **ninguno está implementado todavía** — se construyen en la fase de desarrollo, junto con el backend. Al abrir cualquiera de esos frentes, el documento manda.

Pendientes conocidos antes de producción:

- **Implementar RF-76..83 y RNF-30..34.** Ninguna guarda de rol existe hoy: `/admin` y el grupo `(portal)` son alcanzables desde cualquier modo demo, y los listados no filtran por propietario porque `Proyecto`, `Postulacion` y `DocumentoGenerado` aún no declaran `usuarioId` (RN-30). Es el primer trabajo del Sprint 0.
- Cargar el **prompt propio de generación** en la plantilla versionada (RF-63, tabla `plantillas_generacion` / `lib/mock-data.ts: promptVersiones`).
- Medir el costo real de IA sobre 20 generaciones con TDR colombianos antes de fijar cupos y precios definitivos (RNF-21, sección 10.3 de `docs/07-modelo-de-negocio.md`).
- Conectar Supabase (Auth + Postgres + RLS + Storage) reemplazando `mock-data.ts`, `store.ts` y `session.ts`; los tipos del prototipo ya siguen el esquema de `docs/05-modelo-de-datos.md`, así que la migración es de origen de datos, no de forma.
- Integrar Claude API aislada tras la interfaz propia de generación (RNF-22), en vez de la composición simulada de `lib/documentos.ts`.

Deuda del prototipo detectada en las auditorías de v6 (no bloquea la especificación, sí el piloto):

- **`lib/utils.ts: HOY` está congelado en `2026-08-24`.** Las convocatorias "vigentes" de la demo ya cerraron y la ficha anuncia "Cierra en 1 día" sobre fechas pasadas. Generar las fechas de `mock-data.ts` como desplazamientos relativos a `new Date()` y eliminar la constante.
- **`consultor-5` tiene una suscripción en estado `trial`** (`lib/mock-data.ts: sub-6`) con el perfil aún en revisión, lo que contradice RF-37 ("consultores sin trial") y RN-11.
- **`components/ui/SearchableSelect.tsx:23` cita "(RF-76)"** para el selector con buscador, pero ese requerimiento es **RF-75**; desde v6, RF-76 designa la revocación en cascada, así que el comentario induce a error.
- **`EstadisticasIA` no registra tokens ni costo estimado**, que es lo que RF-52 exige y lo que la medición de precios de `docs/07 §10.3` necesita sobre 20 generaciones reales.
- **La generación no contempla el vencimiento por tope de 120 s** que RNF-21 describe como fallo controlado sin consumo de crédito: el temporizador simulado es fijo.
