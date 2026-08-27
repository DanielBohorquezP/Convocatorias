"use client";

import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MODOS_DEMO, MODO_DEMO_LABEL, rutaHomeDeModo } from "@/lib/session";
import type { ModoDemo } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SelectorModoDemo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const modoDemo = useAppStore((s) => s.modoDemo);
  const setModoDemo = useAppStore((s) => s.setModoDemo);
  const router = useRouter();

  const cambiar = (modo: ModoDemo) => {
    setModoDemo(modo);
    router.push(rutaHomeDeModo(modo));
  };

  return (
    <label
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold",
        variant === "dark"
          ? "bg-white/10 text-white/80"
          : "bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-100"
      )}
      title="Simulador de rol y suscripción — solo para este prototipo"
    >
      <UserCog className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden sm:inline">Modo demo:</span>
      <select
        value={modoDemo}
        onChange={(e) => cambiar(e.target.value as ModoDemo)}
        className={cn(
          "cursor-pointer border-none bg-transparent pr-1 text-xs font-semibold outline-none",
          variant === "dark" ? "text-white" : "text-gold-800"
        )}
      >
        {MODOS_DEMO.map((modo) => (
          <option key={modo} value={modo} className="text-ink">
            {MODO_DEMO_LABEL[modo]}
          </option>
        ))}
      </select>
    </label>
  );
}
