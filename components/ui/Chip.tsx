import { cn } from "@/lib/utils";

const tonos = {
  tipo_proyecto: "bg-primary-50 text-primary-800",
  sector: "bg-gold-50 text-gold-700",
  tipo_entidad: "bg-slate-100 text-ink-soft",
  neutro: "bg-slate-100 text-ink-soft",
} as const;

export function Chip({
  children,
  tono = "neutro",
  className,
}: {
  children: React.ReactNode;
  tono?: keyof typeof tonos;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        tonos[tono],
        className
      )}
    >
      {children}
    </span>
  );
}
