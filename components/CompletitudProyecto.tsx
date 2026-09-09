import { calcularCompletitud, toneCompletitud, ESTILO_COMPLETITUD } from "@/lib/proyectos";
import type { Proyecto } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { ProgressBar } from "./ui/ProgressBar";

const TONO_BARRA: Record<"bajo" | "medio" | "alto", "danger" | "warning" | "success"> = {
  bajo: "danger",
  medio: "warning",
  alto: "success",
};

export function CompletitudBadge({ proyecto, className }: { proyecto: Proyecto; className?: string }) {
  const { porcentaje } = calcularCompletitud(proyecto);
  const tono = toneCompletitud(porcentaje);
  return (
    <Badge className={cn(ESTILO_COMPLETITUD[tono], className)}>
      {porcentaje}% completo
    </Badge>
  );
}

export function CompletitudDetalle({ proyecto }: { proyecto: Proyecto }) {
  const { porcentaje, completos, total, faltantes } = calcularCompletitud(proyecto);
  const tono = toneCompletitud(porcentaje);

  return (
    <div className="rounded-xl border border-line-soft p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Completitud del contenido</p>
        <span className="font-tabular text-sm font-bold text-ink">
          {completos}/{total} · {porcentaje}%
        </span>
      </div>
      <ProgressBar porcentaje={porcentaje} tono={TONO_BARRA[tono]} className="mt-2" />
      {faltantes.length > 0 ? (
        <p className="mt-2 text-xs text-ink-faint">
          Falta: {faltantes.map((f) => f.etiqueta).join(", ")}.
        </p>
      ) : (
        <p className="mt-2 text-xs text-success">Todo el contenido está diligenciado.</p>
      )}
      <p className="mt-1 text-xs text-ink-faint">
        A mayor completitud, mejor será el documento que genere la IA.
      </p>
    </div>
  );
}
