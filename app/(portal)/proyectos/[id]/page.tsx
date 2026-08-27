"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Wallet, Sparkles, UserPlus, Search, Users, CheckCircle2, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categoriaPorId } from "@/lib/mock-data";
import { useAccesoSuscripcion } from "@/lib/hooks";
import { formatCOP } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import { Button, LinkButton } from "@/components/ui/Button";

export default function DetalleProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const proyecto = useAppStore((s) => s.proyectos.find((p) => p.id === id));
  const todosLosEncargos = useAppStore((s) => s.encargos);
  const encargos = todosLosEncargos.filter((e) => e.proyectoId === id);
  const consultores = useAppStore((s) => s.consultores);
  const iniciarSolicitudConsultor = useAppStore((s) => s.iniciarSolicitudConsultor);
  const crearEncargoEsperandoAsignacion = useAppStore((s) => s.crearEncargoEsperandoAsignacion);
  const { requerirAcceso } = useAccesoSuscripcion();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [confirmacion, setConfirmacion] = useState(false);

  if (!proyecto) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos este proyecto.</p>
        <Link href="/proyectos" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver a mis proyectos
        </Link>
      </div>
    );
  }

  const hayConsultoresAprobados = consultores.some(
    (c) => c.estadoPerfil === "aprobado" && !c.esEquipoInterno
  );

  const abrirFlujo = () => {
    if (!requerirAcceso("solicitar un consultor")) return;
    setPaso(1);
    setTitulo("");
    setDescripcion("");
    setConfirmacion(false);
    setModalAbierto(true);
  };

  const irAlPaso2 = () => {
    if (!titulo.trim() || !descripcion.trim()) return;
    setPaso(2);
  };

  const buscarEnDirectorio = () => {
    iniciarSolicitudConsultor({ proyectoId: proyecto.id, tituloTarea: titulo.trim(), descripcionTarea: descripcion.trim() });
    setModalAbierto(false);
    router.push("/consultores");
  };

  const pedirAsignacion = () => {
    iniciarSolicitudConsultor({ proyectoId: proyecto.id, tituloTarea: titulo.trim(), descripcionTarea: descripcion.trim() });
    crearEncargoEsperandoAsignacion();
    setConfirmacion(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/proyectos"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis proyectos
      </Link>

      <div className="rounded-2xl border border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{proyecto.nombre}</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{proyecto.descripcion}</p>
          </div>
          <Button variant="primary" size="lg" onClick={abrirFlujo} className="bg-brick-500 hover:bg-brick-600">
            <UserPlus className="h-4 w-4" /> Solicitar consultor
          </Button>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl bg-primary-50/60 p-5 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <Wallet className="h-3.5 w-3.5" /> Monto buscado
            </p>
            <p className="mt-1 font-tabular text-sm font-medium text-ink">{formatCOP(proyecto.montoBuscado)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <MapPin className="h-3.5 w-3.5" /> Ubicación
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{proyecto.ubicacion || "Sin ubicación"}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Categorías</p>
          <div className="flex flex-wrap gap-2">
            {proyecto.categorias.map((cid) => {
              const cat = categoriaPorId(cid);
              return cat ? (
                <Chip key={cid} tono={cat.tipo}>
                  {cat.nombre}
                </Chip>
              ) : null;
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line-soft pt-6">
          <p className="text-sm text-ink-soft">Cruza este proyecto contra el catálogo de convocatorias.</p>
          <LinkButton href={`/proyectos/${proyecto.id}/sugerencias`} variant="secondary">
            <Sparkles className="h-4 w-4" /> Ver sugerencias
          </LinkButton>
        </div>
      </div>

      {encargos.length > 0 && (
        <div className="mt-6 rounded-2xl border border-line p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <Users className="h-4 w-4 text-brick-600" /> Consultores en este proyecto
          </h2>
          <ul className="mt-3 divide-y divide-line-soft">
            {encargos.map((e) => (
              <li key={e.id} className="py-3 text-sm text-ink-soft">
                <Link href="/encargos" className="font-medium text-ink hover:text-primary-800">
                  {e.tituloTarea}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {confirmacion ? "Solicitud enviada" : `Solicitar consultor · Paso ${paso} de 2`}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="text-ink-faint hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            {confirmacion ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                <p className="mt-3 text-sm text-ink-soft">
                  Nuestro equipo te asignará un consultor para <strong>{titulo}</strong>. Podrás ver el avance en{" "}
                  <Link href="/encargos" className="font-semibold text-primary-700 hover:underline">
                    Encargos
                  </Link>
                  .
                </p>
                <Button variant="primary" className="mt-5" onClick={() => setModalAbierto(false)}>
                  Entendido
                </Button>
              </div>
            ) : paso === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Título de la tarea
                  </label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej. Estructuración financiera de la postulación"
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Descripción de la tarea
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    placeholder="Cuéntanos qué necesitas resolver para este proyecto"
                    className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={irAlPaso2} disabled={!titulo.trim() || !descripcion.trim()}>
                    Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-ink-soft">Elige cómo quieres encontrar un consultor para esta tarea.</p>
                {hayConsultoresAprobados && (
                  <button
                    onClick={buscarEnDirectorio}
                    className="flex w-full items-center gap-4 rounded-xl border border-line p-4 text-left transition-colors hover:border-brick-500 hover:bg-brick-50/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brick-50 text-brick-600">
                      <Search className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">Buscar en el directorio</span>
                      <span className="block text-xs text-ink-faint">
                        Elige tú mismo un consultor aprobado por su experiencia y calificación.
                      </span>
                    </span>
                  </button>
                )}
                <button
                  onClick={pedirAsignacion}
                  className="flex w-full items-center gap-4 rounded-xl border border-line p-4 text-left transition-colors hover:border-primary-500 hover:bg-primary-50/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Users className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">Pedir que me asignen un consultor</span>
                    <span className="block text-xs text-ink-faint">
                      Nuestro equipo interno elegirá y asignará un consultor disponible por ti.
                    </span>
                  </span>
                </button>
                <div className="flex justify-start pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setPaso(1)}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Volver
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
