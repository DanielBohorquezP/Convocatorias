import { ConsultorNavbar } from "@/components/ConsultorNavbar";
import { ModalSuscripcion } from "@/components/ModalSuscripcion";

export default function ConsultorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsultorNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-line-soft py-6 text-center text-xs text-ink-faint">
        Plataforma de Gestión de Convocatorias — portal de consultores, datos de ejemplo.
      </footer>
      <ModalSuscripcion />
    </div>
  );
}
