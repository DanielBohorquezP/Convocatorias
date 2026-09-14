# Matriz de trazabilidad CU ↔ RF ↔ RNF/RN

> Parte de la especificación del MVP v4 · Plataforma de Gestión de Convocatorias.
> Índice general en `docs/README.md`. Contexto rápido en `CLAUDE.md`.

---

## 15. Matriz de trazabilidad

| Caso de uso | RF | RNF / RN |
|---|---|---|
| CU-01 Parametrizar fuente | RF-04 | RN-07 |
| CU-02 Cargar convocatoria *(v5: enlace oficial)* | RF-05, 06 | RNF-11, 14, 29 |
| CU-03 Adjuntar documentos | RF-07 | RNF-02, 06 |
| CU-04 Definir requisitos | RF-08 | RN-04 |
| CU-05 Publicar *(v5: exige enlace válido)* | RF-09 | RN-01, RNF-11, 29 |
| CU-06 Cierre automático | RF-10 | RN-02, RNF-12 |
| CU-07 Catálogo y chips | RF-11, 12, 43 | RNF-04 |
| CU-08 Detalle y descargas *(v5: enlace al portal)* | RF-13, **73** | RNF-06 |
| CU-09 Proyecto enriquecido | RF-14, 45, 46, 47 | RN-21, RNF-03 |
| CU-10 Sugerencias con % | RF-15, 16 | RN-05, RNF-05 |
| CU-11 Iniciar postulación | RF-17, 21 | RN-03, 04, 19 |
| CU-12 Checklist | RF-18, 20 | — |
| CU-13 Estados *(v5: generar/editar documento, enlace al portal, solicitar consultor)* | RF-19, 20, **28, 53, 73** | RNF-11, 12 |
| CU-14 Cuenta | RF-01, 02, 03 | RNF-01, RN-06 |
| CU-15..17 Perfil consultor | RF-22..25 | RN-13, RNF-16, 18 |
| CU-18 Encargos (consultor) *(v5: contexto, contacto)* | RF-30, 32, **68, 69, 70** | RN-10, **29**, RN-25, RN-26, RF-40 |
| CU-19..23 Contratación *(v5: contexto, tipo de ayuda, contacto, solicitud directa, buscador)* | RF-26, 28..31, **68, 69, 70, 74, 75** | RN-08, 12, 25, 26, RNF-19 |
| CU-24 Calificar | RF-33 | RN-09, RNF-17 |
| CU-25..27 Gestión consultores *(CU-26 v5: contacto; CU-27 v5: cancela encargos en curso)* | RF-34, 35, **70** | RN-13, 15, 26, **29**, RNF-11 |
| CU-28..30 Suscripción | RF-37, 38, 41 | RN-11, 16 |
| CU-31 Planes y suscripciones | RF-36, 42, 51 | RNF-14, 20 |
| CU-32 Enforcement | RF-40, 39 | RNF-20, RN-08, 10 |
| **CU-33 Generar documento** | **RF-53..57, 62, 48** | **RN-17, 19, 20, 21, RNF-21, 23, 24** |
| **CU-34 Revisar y exportar** *(v5: acceso del consultor)* | **RF-58..61, 71, 72** | **RN-20, 22, 27, 28, RNF-23** |
| **CU-35 Cupo de créditos** | **RF-48, 49, 50, 52** | **RN-17, 18, RNF-20, 24** |
| **CU-36 Indicadores landing** | **RF-44** | RNF-04 |
| **CU-38 Activar MFA** *(v5)* | **RF-64** | **RNF-28** |
| **CU-39 Eventos de seguridad** *(v5)* | **RF-65** | **RNF-11, 25, 26, 27** |
| **CU-40 Bloqueos por límite de tasa** *(v5)* | **RF-66, 67** | **RNF-27** |

---

*Especificación del MVP v4 · Plataforma de Gestión de Convocatorias · Septiembre 2026. Diagramas complementarios: `Arquitectura_Empresarial_MVP_v4.png` y `Modelo_de_Datos_IA_Creditos.png`, más los de la v2 y v3 para la base y el módulo de consultores.*

