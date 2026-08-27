"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConsultorActual } from "@/lib/hooks";
import { SelectorModoDemo } from "./SelectorModoDemo";

const enlaces = [
  { href: "/consultor/perfil", label: "Mi perfil" },
  { href: "/consultor/encargos", label: "Mis encargos" },
  { href: "/consultor/suscripcion", label: "Mi suscripción" },
];

export function ConsultorNavbar() {
  const pathname = usePathname();
  const { consultor } = useConsultorActual();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/consultor/perfil" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brick-500 text-white">
            <HardHat className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="hidden font-display text-[15px] font-bold leading-none text-ink lg:inline">
            Portal de
            <br />
            Consultores
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {enlaces.map((enlace) => {
            const activo = pathname === enlace.href || pathname.startsWith(enlace.href + "/");
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  activo ? "bg-brick-50 text-brick-700" : "text-ink-soft hover:bg-slate-50 hover:text-ink"
                )}
              >
                {enlace.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <SelectorModoDemo />
          <Link
            href="/admin"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink-faint hover:text-primary-800 xl:flex"
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Panel admin
          </Link>
          <img
            src={consultor?.fotoUrl ?? "https://ui-avatars.com/api/?name=Consultor"}
            alt=""
            className="hidden h-9 w-9 shrink-0 rounded-full ring-1 ring-line sm:block"
          />
        </div>
      </div>
    </header>
  );
}
