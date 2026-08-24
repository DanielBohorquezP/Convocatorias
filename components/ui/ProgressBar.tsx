import { cn } from "@/lib/utils";

export function ProgressBar({
  porcentaje,
  className,
  tono = "primary",
}: {
  porcentaje: number;
  className?: string;
  tono?: "primary" | "gold";
}) {
  const valor = Math.max(0, Math.min(100, porcentaje));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-line-soft", className)}
      role="progressbar"
      aria-valuenow={valor}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          tono === "gold" ? "bg-gold-500" : "bg-primary-700"
        )}
        style={{ width: `${valor}%` }}
      />
    </div>
  );
}
