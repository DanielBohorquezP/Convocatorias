"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Briefcase,
  Image as ImageIcon,
  Users,
  Link2,
  Lock,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categoriaPorId } from "@/lib/mock-data";
import type { RedSocialTipo } from "@/lib/types";
import { useAccesoSuscripcion } from "@/lib/hooks";
import { RatingStars } from "@/components/RatingStars";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

const iconosRed: Record<RedSocialTipo, React.ElementType> = {
  linkedin: Briefcase,
  instagram: ImageIcon,
  facebook: Users,
  otra: Link2,
};

export default function PerfilConsultorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const consultor = useAppStore((s) => s.consultores.find((c) => c.id === id));
  const todasLasCalificaciones = useAppStore((s) => s.calificaciones);
  const calificaciones = todasLasCalificaciones.filter((c) => c.consultorId === id);
  const solicitud = useAppStore((s) => s.solicitudConsultorEnCurso);
  const crearEncargoDesdeDirectorio = useAppStore((s) => s.crearEncargoDesdeDirectorio);
  const { requerirAcceso } = useAccesoSuscripcion();

  if (!consultor || consultor.estadoPerfil !== "aprobado") {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">No encontramos este consultor.</p>
        <Link href="/consultores" className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const solicitar = () => {
    if (!requerirAcceso("solicitar un consultor")) return;
    const encargo = crearEncargoDesdeDirectorio(consultor.id);
    if (encargo) router.push("/encargos");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/consultores"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary-800"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al directorio
      </Link>

      <div className="rounded-2xl border border-line p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <img src={consultor.fotoUrl} alt="" className="h-24 w-24 rounded-full ring-2 ring-brick-100" />
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-ink">{consultor.nombreProfesional}</h1>
            <div className="mt-1.5">
              <RatingStars valor={consultor.ratingPromedio} totalResenas={calificaciones.length} size="md" />
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-faint">
              <Briefcase className="h-3.5 w-3.5" /> {consultor.totalEncargosCompletados} encargos completados
            </p>
          </div>
          {solicitud && (
            <Button variant="primary" size="lg" onClick={solicitar} className="w-full shrink-0 sm:w-auto">
              Solicitar para mi tarea
            </Button>
          )}
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{consultor.descripcion}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {consultor.especialidades.map((id) => {
            const cat = categoriaPorId(id);
            return cat ? (
              <Chip key={id} tono={cat.tipo}>
                {cat.nombre}
              </Chip>
            ) : null;
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line-soft pt-5">
          {consultor.sitioWeb && (
            <a
              href={consultor.sitioWeb}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
            >
              <Globe className="h-4 w-4" /> Sitio web
            </a>
          )}
          {consultor.redes.map((red) => {
            const Icon = iconosRed[red.tipo];
            return (
              <a
                key={red.id}
                href={red.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
              >
                <Icon className="h-4 w-4" /> {red.tipo === "otra" ? "Otro enlace" : red.tipo}
              </a>
            );
          })}
          <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-ink-faint ring-1 ring-inset ring-line">
            <Lock className="h-3.5 w-3.5" />
            Hoja de vida disponible al iniciar una solicitud
          </span>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">Portafolio</h2>
          {consultor.portafolio.length === 0 ? (
            <p className="mt-2 text-sm text-ink-faint">Este consultor aún no registró proyectos en su portafolio.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {consultor.portafolio.map((item) => (
                <div key={item.id} className="rounded-xl border border-line-soft p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{item.nombreProyecto}</p>
                    <span className="font-tabular text-xs text-ink-faint">{item.anio}</span>
                  </div>
                  <p className="text-xs text-ink-faint">{item.entidad}</p>
                  <p className="mt-2 text-sm text-ink-soft">{item.descripcion}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success">
                    <FileText className="h-3.5 w-3.5" /> {item.resultado}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-ink">
            Reseñas ({calificaciones.length})
          </h2>
          {calificaciones.length === 0 ? (
            <p className="mt-2 text-sm text-ink-faint">Este consultor aún no tiene reseñas.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {calificaciones.map((c) => (
                <li key={c.id} className="rounded-xl border border-line-soft p-4">
                  <RatingStars valor={c.estrellas} />
                  <p className="mt-2 text-sm text-ink-soft">{c.comentario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!solicitud && (
          <div className="mt-8 rounded-xl border border-dashed border-line px-5 py-4 text-center text-sm text-ink-faint">
            Para solicitar a este consultor, primero inicia una solicitud desde uno de tus{" "}
            <Link href="/proyectos" className="font-semibold text-primary-700 hover:underline">
              proyectos
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
