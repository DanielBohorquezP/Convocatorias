"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  CheckSquare,
  Square,
  FileText,
  Sparkles,
  Pencil,
  ExternalLink,
  UserPlus,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { EstadoPostulacion } from "@/lib/types";
import { documentoParaProyectoConv, ESTADO_DOCUMENTO_LABEL, ESTADO_DOCUMENTO_ESTILO } from "@/lib/documentos";
import { useAccesoSuscripcion } from "@/lib/hooks";
import {
  formatCOP,
  formatFecha,
  ESTADO_POSTULACION_LABEL,
  ESTADO_POSTULACION_ESTILO,
  ESTADO_POSTULACION_ORDEN,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SolicitarConsultorModal } from "@/components/SolicitarConsultorModal";

export default function DetallePostulacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const postulacion = useAppStore((s) => s.postulaciones.find((p) => p.id === id));
  const convocatoria = useAppStore((s) =>
    postulacion ? s.convocatorias.find((c) => c.id === postulacion.convocatoriaId) : undefined
  );
  const proyecto = useAppStore((s) =>
    postulacion?.proyectoId ? s.proyectos.find((p) => p.id === postulacion.proyectoId) : undefined
  );
  const proyectos = useAppStore((s) => s.proyectos);
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const cambiarEstadoPostulacion = useAppStore((s) => s.cambiarEstadoPostulacion);
  const vincularProyectoAPostulacion = useAppStore((s) => s.vincularProyectoAPostulacion);
  const setProyectoParaGenerar = useAppStore((s) => s.setProyectoParaGenerar);
  const documentos = useAppStore((s) => s.documentos);
  const { requerirAcceso } = useAccesoSuscripcion();
  const [proyectoParaVincular, setProyectoParaVincular] = useState("");
  const [modalConsultorAbierto, setModalConsultorAbierto] = useState(false);

  if (!postulacion) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos esta postulación.</p>
        <Link href="/postulaciones" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver a mis postulaciones
        </Link>
      </div>
    );
  }

  const total = postulacion.checklist.length;
  const completados = postulacion.checklist.filter((i) => i.completado).length;
  const porcentaje = total ? Math.round((completados / total) * 100) : 0;
  const documento = postulacion.proyectoId
    ? documentoParaProyectoConv(postulacion.proyectoId, postulacion.convocatoriaId, documentos)
    : undefined;

  const irAGenerarOEditar = () => {
    if (documento) {
      router.push(`/documentos/${documento.id}`);
      return;
    }
    if (!postulacion.proyectoId) return; // el botón de abajo pide vincular uno primero
    if (!requerirAcceso("generar un documento con IA")) return;
    setProyectoParaGenerar(postulacion.proyectoId);
    router.push(`/convocatorias/${postulacion.convocatoriaId}/generar`);
  };

  const vincularYContinuar = () => {
    if (!proyectoParaVincular) return;
    vincularProyectoAPostulacion(postulacion.id, proyectoParaVincular);
    if (!requerirAcceso("generar un documento con IA")) return;
    setProyectoParaGenerar(proyectoParaVincular);
    router.push(`/convocatorias/${postulacion.convocatoriaId}/generar`);
  };

  const abrirSolicitudConsultor = () => {
    if (!requerirAcceso("solicitar un consultor")) return;
    setModalConsultorAbierto(true);
  };

  const vincularYSolicitarConsultor = () => {
    if (!proyectoParaVincular) return;
    vincularProyectoAPostulacion(postulacion.id, proyectoParaVincular);
    if (!requerirAcceso("solicitar un consultor")) return;
    setModalConsultorAbierto(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/postulaciones"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis postulaciones
      </Link>

      <div className="rounded-2xl border border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className={ESTADO_POSTULACION_ESTILO[postulacion.estado]}>
              {ESTADO_POSTULACION_LABEL[postulacion.estado]}
            </Badge>
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-ink">
              {convocatoria?.nombre ?? "Convocatoria no disponible"}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {proyecto ? `Proyecto: ${proyecto.nombre}` : "Sin proyecto asociado"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-56">
            {convocatoria?.urlPostulacion && (
              <a href={convocatoria.urlPostulacion} target="_blank" rel="noreferrer" className="w-full">
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="h-4 w-4" /> Ir al portal de la entidad
                </Button>
              </a>
            )}
            {proyecto && (
              <Button variant="brick" className="w-full" onClick={abrirSolicitudConsultor}>
                <UserPlus className="h-4 w-4" /> Solicitar consultor
              </Button>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Cambiar estado
              </label>
              <select
                value={postulacion.estado}
                onChange={(e) => cambiarEstadoPostulacion(postulacion.id, e.target.value as EstadoPostulacion)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                {ESTADO_POSTULACION_ORDEN.map((estado) => (
                  <option key={estado} value={estado}>
                    {ESTADO_POSTULACION_LABEL[estado]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-line px-4 py-2.5 text-xs text-ink-faint">
          La postulación se radica en el portal de la entidad convocante, no en esta plataforma (RN-19).
        </p>

        {convocatoria && (
          <div className="mt-6 flex flex-wrap gap-6 border-y border-line-soft py-4 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              <span className="font-tabular">
                {formatCOP(convocatoria.montoMin)} – {formatCOP(convocatoria.montoMax)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {convocatoria.ubicacion}
            </span>
            <span>Cierra el {formatFecha(convocatoria.fechaCierre)}</span>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Checklist de la postulación</h2>
            <span className="font-tabular text-sm font-semibold text-primary-800">
              {completados}/{total} · {porcentaje}%
            </span>
          </div>
          <ProgressBar porcentaje={porcentaje} className="mb-4" />
          <ul className="space-y-2">
            {postulacion.checklist.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggleChecklistItem(postulacion.id, item.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-line-soft px-4 py-3 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/30"
                >
                  {item.completado ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                  )}
                  <span>
                    <span className={item.completado ? "text-sm text-ink-faint line-through" : "text-sm text-ink"}>
                      {item.descripcion}
                    </span>
                    {item.obligatorio && (
                      <span className="ml-2 text-xs font-medium text-gold-700">obligatorio</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Documento generado con IA</h2>

          {documento ? (
            <button
              onClick={irAGenerarOEditar}
              className="mt-3 flex w-full items-center gap-3 rounded-lg border border-teal-100 bg-teal-50/40 px-4 py-3 text-left transition-colors hover:bg-teal-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                <FileText className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">{documento.titulo}</span>
                <span className="block text-xs text-ink-faint">Versión {documento.version}</span>
              </span>
              <Badge className={ESTADO_DOCUMENTO_ESTILO[documento.estado]}>{ESTADO_DOCUMENTO_LABEL[documento.estado]}</Badge>
              <Pencil className="h-4 w-4 shrink-0 text-teal-700" />
            </button>
          ) : postulacion.proyectoId ? (
            <button
              onClick={irAGenerarOEditar}
              className="mt-3 flex w-full items-center gap-3 rounded-lg border border-dashed border-teal-200 bg-teal-50/20 px-4 py-3 text-left transition-colors hover:bg-teal-50/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-teal-800">Generar documento con IA para esta postulación</span>
            </button>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-line px-4 py-3">
              <p className="text-sm text-ink-soft">
                Vincula un proyecto para poder generar el documento con IA o solicitar un consultor (CU-13, flujos
                3a/5a).
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <select
                  value={proyectoParaVincular}
                  onChange={(e) => setProyectoParaVincular(e.target.value)}
                  className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">Selecciona un proyecto...</option>
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                <Button variant="teal" size="sm" onClick={vincularYContinuar} disabled={!proyectoParaVincular}>
                  Vincular y generar
                </Button>
                <Button variant="brick" size="sm" onClick={vincularYSolicitarConsultor} disabled={!proyectoParaVincular}>
                  Vincular y solicitar consultor
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Línea de tiempo</h2>
          <ol className="mt-4 space-y-0">
            {postulacion.historial.map((h, idx) => (
              <li key={h.id} className="relative flex gap-4 pb-6 last:pb-0">
                {idx !== postulacion.historial.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
                )}
                <span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary-700 bg-white" />
                <div>
                  <p className="text-sm font-medium text-ink">
                    {h.estadoAnterior ? (
                      <>
                        {ESTADO_POSTULACION_LABEL[h.estadoAnterior]} → {ESTADO_POSTULACION_LABEL[h.estadoNuevo]}
                      </>
                    ) : (
                      <>Postulación creada · {ESTADO_POSTULACION_LABEL[h.estadoNuevo]}</>
                    )}
                  </p>
                  <p className="text-xs text-ink-faint">{formatFecha(h.fecha)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {proyecto && (
        <SolicitarConsultorModal
          proyecto={proyecto}
          open={modalConsultorAbierto}
          onClose={() => setModalConsultorAbierto(false)}
          convocatoriaFijaId={postulacion.convocatoriaId}
        />
      )}
    </div>
  );
}
