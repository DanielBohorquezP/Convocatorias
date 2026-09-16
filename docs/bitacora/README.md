# Bitácora de sesiones

Una entrada por sesión de trabajo. Es la memoria del proyecto entre sesiones: lo que `git log` no puede contar.

## La regla

**La bitácora narra y decide; el `git log` detalla.**

Si algo se puede reconstruir leyendo el diff, no va aquí. Lo que va aquí es lo que el diff no dice:

- Por qué se eligió un camino y **qué se descartó**.
- Qué quedó a medias y **con qué idea seguir**.
- Qué se probó y **cómo se comprobó que funciona**.
- Qué apareció de imprevisto y dónde quedó anotado.

Una entrada que solo enumere archivos tocados es una entrada inútil: eso ya está en el commit.

## Nombre de archivo

`AAAA-MM-DD-sesion-NNN.md` — fecha de la sesión y número correlativo. Si hay dos sesiones el mismo día, siguen numerando (`-sesion-004`, `-sesion-005`).

## Plantilla

Copiar [`PLANTILLA.md`](PLANTILLA.md) y rellenar. Las secciones vacías se borran, no se dejan con "N/A".

## Qué NO va aquí

- Listas de archivos modificados → `git log --stat`
- El estado actual del proyecto → [`../../ESTADO.md`](../../ESTADO.md)
- El estado de cada requerimiento → [`../11-avance-por-requerimiento.md`](../11-avance-por-requerimiento.md)
- Requerimientos nuevos o cambios de alcance → los documentos de `docs/`, siguiendo la ruta de `CLAUDE.md`
