# Estado del trabajo

> **Este es el primer archivo que se lee al abrir una sesión.** Dice dónde vamos, qué está en curso y qué bloquea.
> Plan de sprints: [`docs/10-plan-de-desarrollo.md`](docs/10-plan-de-desarrollo.md) · Detalle por requerimiento: [`docs/11-avance-por-requerimiento.md`](docs/11-avance-por-requerimiento.md) · Historial: [`docs/bitacora/`](docs/bitacora/)

---

**Actualizado:** 16 de septiembre de 2026 · cierre de la sesión 001
**Sprint:** — (día 0 de 30, sin arrancar)
**Rama de trabajo:** `auditoria-v6` (pendiente de fusionar a `main`)

---

## Dónde vamos

La especificación está cerrada en **v6** y el prototipo implementa el modelo completo en la interfaz, con datos simulados. **No hay backend.** El desarrollo de los 30 días no ha empezado: el día 1 arranca con el Sprint 1.

Dos auditorías cerraron esta etapa —una de implementación y otra de interfaz— y produjeron 14 requerimientos nuevos (RF-76..83, RNF-30..34, RN-30). Los de usabilidad ya están implementados; los de seguridad están escritos y **pendientes de construir**.

## Lo último que se hizo

- Especificación v6 completa: 83 RF, 34 RNF, 30 RN, matriz de trazabilidad al día.
- Arreglados los 9 hallazgos de la auditoría de interfaz en el prototipo.
- Plan de 30 días, matriz de avance y bitácora creados (esta sesión).

Detalle en [`docs/bitacora/2026-09-15-sesion-001.md`](docs/bitacora/2026-09-15-sesion-001.md).

## En curso

Nada. Sesión cerrada limpiamente.

## Lo siguiente — Sprint 1, día 1

Por orden, porque cada uno desbloquea al siguiente:

1. **Columnas de propietario (RN-30)** en `Proyecto`, `Postulacion` y `DocumentoGenerado`, todavía sobre mocks. Es lo que permite escribir las políticas RLS sin rehacer consultas después.
2. **Proyecto Supabase y migraciones** de las 24 tablas, cada una con su política RLS en el mismo commit (RNF-25, RN-24). El esquema está en `docs/05-modelo-de-datos.md §9.1–9.10`.
3. **Supabase Auth con los tres roles**, reemplazando `lib/session.ts` y el `ModoDemo`.
4. **`requireRole()` en toda ruta y endpoint** (RNF-30) — corrige de paso la condición invertida de `components/GuardaMFA.tsx:26`.

**Hito 1 (día 6):** un consultor recibe 403 en `/admin` y en `/convocatorias/[id]/generar`; dos empresas no ven nada la una de la otra en los cuatro listados. Probado, no supuesto.

## Bloqueos

Ninguno.

## Decisiones abiertas

Esperan al Product Owner. No bloquean el Sprint 1.

| Decisión | Contexto | Cuándo hace falta |
|---|---|---|
| **Precio del plan Consultor** | Quedó en COP $69.000 al retirarle el cupo de IA. `docs/07 §10.2` marca los planes como "a validar con los pilotos" | Antes de cobrar |
| **Fusionar `auditoria-v6` a `main`** | Dos commits listos y subidos, sin fusionar | Antes de empezar el Sprint 1 |
| **Proveedor del límite de tasa** | RNF-27 pide un almacén fuera de Postgres (Upstash Redis o Vercel Edge Config); no está elegido | Sprint 5 |

## Hallazgos no planificados

Cosas detectadas de paso que no pertenecen al sprint en curso. **No se arreglan sobre la marcha**; se anotan aquí y se planifican.

| Hallazgo | Dónde | Gravedad |
|---|---|---|
| `Date.now()` llamado durante el render | `app/admin/seguridad/page.tsx:30` | baja · lint lo marca |
| `setState` dentro de un efecto | `components/SolicitarConsultorModal.tsx:60` | baja · lint lo marca |
| `consultor-5` tiene suscripción `trial`, contra RF-37 y RN-11 | `lib/mock-data.ts` | baja · dato de ejemplo |
| Los diagramas de `docs/diagramas/` siguen siendo de v4 | `docs/diagramas/` | media · desactualizados frente a v6 |

---

## Cómo retomar en la próxima sesión

1. Leer este archivo y la última entrada de [`docs/bitacora/`](docs/bitacora/).
2. Confirmar si alguna decisión abierta se resolvió.
3. Continuar por "Lo siguiente".
4. **Al cerrar**: actualizar este archivo, `docs/11-avance-por-requerimiento.md`, escribir la entrada de bitácora y hacer commit citando los `RF-xx`/`RNF-xx`.

El ritual completo está en [`docs/10-plan-de-desarrollo.md §17.3`](docs/10-plan-de-desarrollo.md).
