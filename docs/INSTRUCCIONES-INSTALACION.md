# Cómo instalar esta documentación en tu proyecto de Claude Code

## 1. Copiar los archivos al repo

Descomprime este paquete en la **raíz** de tu proyecto del frontend. Debe quedar así:

```
tu-proyecto/
├── CLAUDE.md              ← contexto que Claude Code carga solo, en cada sesión
├── docs/
│   ├── README.md
│   ├── 00-contexto-y-alcance.md
│   ├── 01-casos-de-uso.md
│   ├── 02-requerimientos-funcionales.md
│   ├── 03-requerimientos-no-funcionales.md
│   ├── 04-arquitectura.md
│   ├── 05-modelo-de-datos.md
│   ├── 06-procesos-de-negocio.md
│   ├── 07-modelo-de-negocio.md
│   ├── 08-roadmap.md
│   ├── 09-trazabilidad.md
│   ├── 99-especificacion-completa.md
│   └── diagramas/*.png
├── app/  src/  package.json ...   (tu código actual)
```

**Si ya tenías un `CLAUDE.md`**, no lo reemplaces: abre los dos y fusiona. Lo que traes tú (comandos de build, convenciones de código) va arriba; el contexto de producto de este archivo va debajo.

## 2. Verificar que Claude Code lo está leyendo

Abre Claude Code en la carpeta del proyecto y pregunta algo que solo esté en la documentación:

```
¿Qué dice la regla RN-17 sobre los créditos?
```

Si responde que un crédito se descuenta por generación exitosa y que los fallos no descuentan, ya está cargado. Si no, revisa que `CLAUDE.md` esté en la raíz y reinicia la sesión.

## 3. Comprometerlo al repositorio

```bash
git add CLAUDE.md docs/
git commit -m "docs: especificación funcional y técnica del MVP v4"
```

Así viaja con el proyecto y cualquier sesión de Claude Code —tuya o de otra persona— arranca con el mismo contexto.

## 4. Cómo usarlo en el día a día

El truco está en **no pegar la especificación en el chat**. En vez de eso, referencia:

```
Implementa CU-33 (generar documento con IA) siguiendo docs/01-casos-de-uso.md
y docs/02-requerimientos-funcionales.md sección 4.10.
```

Claude Code abre solo los archivos que necesita. Eso es lo que ahorra tokens: `CLAUDE.md` es corto y siempre está; los documentos grandes se leen bajo demanda.

Otros ejemplos:

```
Crea las migraciones de Supabase para las tablas del módulo de IA
según docs/05-modelo-de-datos.md sección 9.3.

Revisa si la pantalla de suscripción cumple RF-41 y RF-50.

Antes de tocar el enforcement, lee RNF-20 en docs/03-requerimientos-no-funcionales.md.
```

## 5. Mantenerlo vivo

Cuando cambies una decisión de producto, pídele a Claude Code que actualice el documento en el mismo commit que el código:

```
Actualiza docs/02-requerimientos-funcionales.md con este cambio y luego impleméntalo.
```

Si la documentación y el código se desincronizan, el contexto deja de servir y vuelves a gastar tokens explicando cosas en el chat.
