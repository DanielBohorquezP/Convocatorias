"use client";

import Link from "next/link";
import { Users, Ban, RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ESTADO_PERFIL_LABEL, ESTADO_PERFIL_ESTILO } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminConsultoresPage() {
  const consultores = useAppStore((s) => s.consultores);
  const suspenderConsultor = useAppStore((s) => s.suspenderConsultor);
  const reactivarConsultor = useAppStore((s) => s.reactivarConsultor);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Consultores</h1>
        <p className="text-sm text-ink-soft">Todos los perfiles de consultor registrados en la plataforma.</p>
      </div>

      {consultores.length === 0 ? (
        <EmptyState icon={Users} titulo="No hay consultores" descripcion="Aún no hay perfiles de consultor registrados." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Consultor</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Encargos</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {consultores.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.fotoUrl} alt="" className="h-8 w-8 rounded-full ring-1 ring-line" />
                      {c.estadoPerfil === "en_revision" ? (
                        <Link
                          href="/admin/consultores/revision"
                          className="font-medium text-ink hover:text-primary-800"
                        >
                          {c.nombreProfesional}
                        </Link>
                      ) : (
                        <span className="font-medium text-ink">{c.nombreProfesional}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={ESTADO_PERFIL_ESTILO[c.estadoPerfil]}>{ESTADO_PERFIL_LABEL[c.estadoPerfil]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <RatingStars valor={c.ratingPromedio} />
                  </td>
                  <td className="px-5 py-3 font-tabular text-ink-soft">{c.totalEncargosCompletados}</td>
                  <td className="px-5 py-3 text-ink-soft">{c.esEquipoInterno ? "Equipo interno" : "Externo"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      {c.estadoPerfil === "aprobado" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => suspenderConsultor(c.id)}
                          className="text-danger hover:bg-danger-bg"
                          aria-label="Suspender"
                        >
                          <Ban className="h-3.5 w-3.5" /> Suspender
                        </Button>
                      )}
                      {c.estadoPerfil === "suspendido" && (
                        <Button variant="ghost" size="sm" onClick={() => reactivarConsultor(c.id)} aria-label="Reactivar">
                          <RotateCcw className="h-3.5 w-3.5" /> Reactivar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
