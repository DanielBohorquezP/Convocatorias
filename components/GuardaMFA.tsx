"use client";

import { useState } from "react";
import { ShieldCheck, QrCode, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useAccesoSuscripcion } from "@/lib/hooks";
import { Button } from "./ui/Button";
import { SelectorModoDemo } from "./SelectorModoDemo";

/**
 * Ninguna sesión administrativa opera sin MFA verificado (RNF-28, CU-38).
 * Solo aplica cuando el modo demo actual es "admin"; otros roles no lo ven.
 */
export function GuardaMFA({ children }: { children: React.ReactNode }) {
  const { rol } = useAccesoSuscripcion();
  const mfaVerificado = useAppStore((s) => s.mfaVerificado);
  const verificarMFA = useAppStore((s) => s.verificarMFA);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(false);

  if (rol !== "admin" || mfaVerificado) {
    return <>{children}</>;
  }

  const confirmar = () => {
    if (codigo.trim().length !== 6) {
      setError(true);
      return;
    }
    setError(false);
    verificarMFA();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary-950/95 px-4">
      <SelectorModoDemo variant="dark" />
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-bold text-ink">Verificación en dos pasos requerida</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Ninguna sesión administrativa puede operar sin verificación en dos pasos. Escanea el código con tu app
          autenticadora y confirma con el código de 6 dígitos.
        </p>

        <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 py-8">
          <QrCode className="h-16 w-16 text-ink-faint" strokeWidth={1} />
        </div>

        <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Código de 6 dígitos
        </label>
        <input
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError(false);
          }}
          placeholder="000000"
          inputMode="numeric"
          className="w-full rounded-lg border border-line px-3 py-2 text-center font-tabular text-lg tracking-[0.3em] outline-none focus:border-primary-500"
        />
        {error && <p className="mt-1.5 text-xs text-danger">Ingresa los 6 dígitos del código (cualquier valor sirve en esta demo).</p>}

        <Button variant="primary" className="mt-5 w-full" onClick={confirmar}>
          <CheckCircle2 className="h-4 w-4" /> Activar y continuar
        </Button>
      </div>
    </div>
  );
}
