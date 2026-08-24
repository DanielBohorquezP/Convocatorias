"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categorias as catalogoCategorias, categoriaPorId } from "@/lib/mock-data";
import type { Convocatoria, Documento, EstadoConvocatoria, Requisito, TipoDocumento, TipoRequisito } from "@/lib/types";
import { cn, formatCOP, ESTADO_CONVOCATORIA_LABEL, ESTADO_CONVOCATORIA_ESTILO, TIPO_DOCUMENTO_LABEL } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const tiposDocumento: TipoDocumento[] = ["TDR", "terminos", "anexo", "formato"];

export default function EditorConvocatoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const convocatoria = useAppStore((s) => s.convocatorias.find((c) => c.id === id));
  const actualizarConvocatoria = useAppStore((s) => s.actualizarConvocatoria);

  if (!convocatoria) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos esta convocatoria.</p>
        <Link href="/admin/convocatorias" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <EditorForm
      key={convocatoria.id}
      convocatoria={convocatoria}
      actualizarConvocatoria={actualizarConvocatoria}
    />
  );
}

function EditorForm({
  convocatoria,
  actualizarConvocatoria,
}: {
  convocatoria: Convocatoria;
  actualizarConvocatoria: (id: string, cambios: Partial<Convocatoria>) => void;
}) {
  const [nombre, setNombre] = useState(convocatoria.nombre);
  const [entidadConvocante, setEntidadConvocante] = useState(convocatoria.entidadConvocante);
  const [descripcion, setDescripcion] = useState(convocatoria.descripcion);
  const [ubicacion, setUbicacion] = useState(convocatoria.ubicacion);
  const [montoMin, setMontoMin] = useState(convocatoria.montoMin ? String(convocatoria.montoMin) : "");
  const [montoMax, setMontoMax] = useState(convocatoria.montoMax ? String(convocatoria.montoMax) : "");
  const [fechaApertura, setFechaApertura] = useState(convocatoria.fechaApertura);
  const [fechaCierre, setFechaCierre] = useState(convocatoria.fechaCierre);
  const [categoriasSel, setCategoriasSel] = useState<string[]>(convocatoria.categorias);
  const [documentos, setDocumentos] = useState<Documento[]>(convocatoria.documentos);
  const [requisitos, setRequisitos] = useState<Requisito[]>(convocatoria.requisitos);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const [faltantes, setFaltantes] = useState<string[]>([]);

  const guardarCambios = (extra?: Partial<{ estado: EstadoConvocatoria }>) => {
    actualizarConvocatoria(convocatoria.id, {
      nombre: nombre.trim() || "Nueva convocatoria sin título",
      entidadConvocante: entidadConvocante.trim(),
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      montoMin: Number(montoMin) || 0,
      montoMax: Number(montoMax) || 0,
      fechaApertura,
      fechaCierre,
      categorias: categoriasSel,
      documentos,
      requisitos,
      ...extra,
    });
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 2000);
  };

  const toggleCategoria = (idCat: string) => {
    setCategoriasSel((prev) => (prev.includes(idCat) ? prev.filter((c) => c !== idCat) : [...prev, idCat]));
  };

  const agregarDocumento = () => {
    setDocumentos((prev) => [
      ...prev,
      {
        id: `doc-nuevo-${Date.now()}`,
        tipo: "anexo",
        nombre: "Nuevo documento",
        archivo: "documento.pdf",
        pesoKb: 0,
      },
    ]);
  };

  const actualizarDocumento = (idDoc: string, cambios: Partial<Documento>) => {
    setDocumentos((prev) => prev.map((d) => (d.id === idDoc ? { ...d, ...cambios } : d)));
  };

  const eliminarDocumento = (idDoc: string) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== idDoc));
  };

  const agregarRequisito = () => {
    setRequisitos((prev) => [
      ...prev,
      {
        id: `req-nuevo-${Date.now()}`,
        descripcion: "Nuevo requisito",
        tipo: "documento",
        obligatorio: true,
        orden: prev.length + 1,
      },
    ]);
  };

  const actualizarRequisito = (idReq: string, cambios: Partial<Requisito>) => {
    setRequisitos((prev) => prev.map((r) => (r.id === idReq ? { ...r, ...cambios } : r)));
  };

  const eliminarRequisito = (idReq: string) => {
    setRequisitos((prev) => prev.filter((r) => r.id !== idReq).map((r, i) => ({ ...r, orden: i + 1 })));
  };

  const moverRequisito = (idReq: string, direccion: -1 | 1) => {
    setRequisitos((prev) => {
      const ordenados = [...prev].sort((a, b) => a.orden - b.orden);
      const idx = ordenados.findIndex((r) => r.id === idReq);
      const destino = idx + direccion;
      if (destino < 0 || destino >= ordenados.length) return prev;
      [ordenados[idx], ordenados[destino]] = [ordenados[destino], ordenados[idx]];
      return ordenados.map((r, i) => ({ ...r, orden: i + 1 }));
    });
  };

  const validarYPublicar = () => {
    const problemas: string[] = [];
    if (!nombre.trim()) problemas.push("Falta el nombre de la convocatoria");
    if (!entidadConvocante.trim()) problemas.push("Falta la entidad convocante");
    if (!descripcion.trim()) problemas.push("Falta la descripción");
    if (!ubicacion.trim()) problemas.push("Falta la ubicación");
    if (!fechaApertura || !fechaCierre) problemas.push("Faltan las fechas de apertura o cierre");
    if (fechaApertura && fechaCierre && fechaApertura > fechaCierre)
      problemas.push("La fecha de apertura debe ser anterior a la de cierre");
    if (!Number(montoMin) || !Number(montoMax)) problemas.push("Falta definir el monto mínimo y máximo");
    if (Number(montoMin) > Number(montoMax)) problemas.push("El monto mínimo no puede ser mayor al máximo");
    if (documentos.length === 0) problemas.push("Debes cargar al menos 1 documento");
    if (requisitos.length === 0) problemas.push("Debes definir al menos 1 requisito");

    setFaltantes(problemas);
    if (problemas.length === 0) {
      guardarCambios({ estado: "publicada" });
    } else {
      guardarCambios();
    }
  };

  return (
    <div>
      <Link
        href="/admin/convocatorias"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={ESTADO_CONVOCATORIA_ESTILO[convocatoria.estado]}>
              {ESTADO_CONVOCATORIA_LABEL[convocatoria.estado]}
            </Badge>
            {mensajeGuardado && (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Cambios guardados
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">{nombre || "Nueva convocatoria"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => guardarCambios()}>
            Guardar cambios
          </Button>
          <Button variant="primary" onClick={validarYPublicar} disabled={convocatoria.estado === "publicada"}>
            {convocatoria.estado === "publicada" ? "Ya publicada" : "Publicar"}
          </Button>
        </div>
      </div>

      {faltantes.length > 0 && (
        <div className="mb-6 rounded-xl border border-danger/30 bg-danger-bg p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-danger">
            <AlertCircle className="h-4 w-4" /> No se pudo publicar. Falta lo siguiente:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-danger/90">
            {faltantes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <Seccion titulo="Datos generales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre de la convocatoria" span2>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Entidad convocante">
              <input
                value={entidadConvocante}
                onChange={(e) => setEntidadConvocante(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Ubicación">
              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Descripción" span2>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Monto mínimo (COP)">
              <input
                type="number"
                value={montoMin}
                onChange={(e) => setMontoMin(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Monto máximo (COP)">
              <input
                type="number"
                value={montoMax}
                onChange={(e) => setMontoMax(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Fecha de apertura">
              <input
                type="date"
                value={fechaApertura}
                onChange={(e) => setFechaApertura(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
            <Campo etiqueta="Fecha de cierre">
              <input
                type="date"
                value={fechaCierre}
                onChange={(e) => setFechaCierre(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </Campo>
          </div>
          {Number(montoMin) > 0 && Number(montoMax) > 0 && (
            <p className="mt-2 text-xs text-ink-faint font-tabular">
              Rango: {formatCOP(Number(montoMin))} – {formatCOP(Number(montoMax))}
            </p>
          )}
        </Seccion>

        <Seccion titulo="Categorías">
          <div className="space-y-4">
            {(["tipo_proyecto", "sector", "tipo_entidad"] as const).map((tipo) => (
              <div key={tipo}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {tipo === "tipo_proyecto" ? "Tipo de proyecto" : tipo === "sector" ? "Sector" : "Tipo de entidad"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {catalogoCategorias
                    .filter((c) => c.tipo === tipo)
                    .map((c) => {
                      const activo = categoriasSel.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCategoria(c.id)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                            activo
                              ? "bg-primary-800 text-white ring-primary-800"
                              : "bg-white text-ink-soft ring-line hover:bg-slate-50"
                          )}
                        >
                          {c.nombre}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
          {categoriasSel.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line-soft pt-4">
              {categoriasSel.map((cid) => {
                const cat = categoriaPorId(cid);
                return cat ? (
                  <Chip key={cid} tono={cat.tipo}>
                    {cat.nombre}
                  </Chip>
                ) : null;
              })}
            </div>
          )}
        </Seccion>

        <Seccion
          titulo="Documentos"
          accion={
            <Button variant="secondary" size="sm" onClick={agregarDocumento}>
              <Upload className="h-3.5 w-3.5" /> Subir documento
            </Button>
          }
        >
          {documentos.length === 0 ? (
            <p className="text-sm text-ink-faint">Aún no hay documentos cargados.</p>
          ) : (
            <ul className="space-y-2">
              {documentos.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 rounded-lg border border-line-soft px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <FileText className="h-4 w-4" />
                  </span>
                  <input
                    value={doc.nombre}
                    onChange={(e) => actualizarDocumento(doc.id, { nombre: e.target.value })}
                    className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary-500"
                  />
                  <select
                    value={doc.tipo}
                    onChange={(e) => actualizarDocumento(doc.id, { tipo: e.target.value as TipoDocumento })}
                    className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary-500"
                  >
                    {tiposDocumento.map((t) => (
                      <option key={t} value={t}>
                        {TIPO_DOCUMENTO_LABEL[t]}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarDocumento(doc.id)}
                    className="text-danger hover:bg-danger-bg"
                    aria-label="Eliminar documento"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Seccion>

        <Seccion
          titulo="Requisitos"
          accion={
            <Button variant="secondary" size="sm" onClick={agregarRequisito}>
              <Plus className="h-3.5 w-3.5" /> Agregar requisito
            </Button>
          }
        >
          {requisitos.length === 0 ? (
            <p className="text-sm text-ink-faint">Aún no hay requisitos definidos.</p>
          ) : (
            <ul className="space-y-2">
              {requisitos
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((req, idx, arr) => (
                  <li key={req.id} className="flex items-center gap-2 rounded-lg border border-line-soft px-3 py-2.5">
                    <GripVertical className="h-4 w-4 shrink-0 text-ink-faint" />
                    <input
                      value={req.descripcion}
                      onChange={(e) => actualizarRequisito(req.id, { descripcion: e.target.value })}
                      className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-primary-500"
                    />
                    <select
                      value={req.tipo}
                      onChange={(e) => actualizarRequisito(req.id, { tipo: e.target.value as TipoRequisito })}
                      className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-primary-500"
                    >
                      <option value="documento">Documento</option>
                      <option value="condicion">Condición</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <input
                        type="checkbox"
                        checked={req.obligatorio}
                        onChange={(e) => actualizarRequisito(req.id, { obligatorio: e.target.checked })}
                        className="h-4 w-4 rounded border-line text-primary-700 focus:ring-primary-500"
                      />
                      Obligatorio
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moverRequisito(req.id, -1)}
                        disabled={idx === 0}
                        aria-label="Subir"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moverRequisito(req.id, 1)}
                        disabled={idx === arr.length - 1}
                        aria-label="Bajar"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarRequisito(req.id)}
                        className="text-danger hover:bg-danger-bg"
                        aria-label="Eliminar requisito"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Seccion>
      </div>
    </div>
  );
}

function Seccion({
  titulo,
  children,
  accion,
}: {
  titulo: string;
  children: React.ReactNode;
  accion?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">{titulo}</h2>
        {accion}
      </div>
      {children}
    </div>
  );
}

function Campo({
  etiqueta,
  children,
  span2,
}: {
  etiqueta: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {etiqueta}
      </label>
      {children}
    </div>
  );
}
