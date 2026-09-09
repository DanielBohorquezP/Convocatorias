import { cn } from "@/lib/utils";

export function ProgressBar({
  porcentaje,
  className,
  tono = "primary",
}: {
  porcentaje: number;
  className?: string;
  tono?: "primary" | "gold" | "teal" | "danger" | "warning" | "success";
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
          tono === "gold" && "bg-gold-500",
          tono === "teal" && "bg-teal-600",
          tono === "danger" && "bg-danger",
          tono === "warning" && "bg-warning",
          tono === "success" && "bg-success",
          tono === "primary" && "bg-primary-700"
        )}
        style={{ width: `${valor}%` }}
      />
    </div>
  );
}
