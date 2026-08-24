import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primary" | "secondary" | "ghost" | "danger" | "outline-gold";
type Tamano = "sm" | "md" | "lg";

const variantes: Record<Variante, string> = {
  primary:
    "bg-primary-800 text-white hover:bg-primary-900 disabled:bg-slate-300 disabled:text-slate-500",
  secondary:
    "bg-primary-50 text-primary-800 hover:bg-primary-100 disabled:bg-slate-100 disabled:text-slate-400",
  ghost:
    "bg-transparent text-ink-soft hover:bg-slate-100 disabled:text-slate-300",
  danger:
    "bg-danger text-white hover:bg-red-800 disabled:bg-slate-300 disabled:text-slate-500",
  "outline-gold":
    "bg-white text-gold-700 ring-1 ring-inset ring-gold-500 hover:bg-gold-50 disabled:text-slate-400 disabled:ring-slate-200",
};

const tamanos: Record<Tamano, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed cursor-pointer";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variante;
  size?: Tamano;
}) {
  return (
    <button
      className={cn(base, variantes[variant], tamanos[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: Variante;
  size?: Tamano;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variantes[variant], tamanos[size], className)}
    >
      {children}
    </Link>
  );
}
