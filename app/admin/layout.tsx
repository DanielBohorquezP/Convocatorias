import { AdminSidebar } from "@/components/AdminSidebar";
import { SelectorModoDemo } from "@/components/SelectorModoDemo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-[1024px] bg-primary-50/40">
      <AdminSidebar />
      <div className="flex-1 overflow-x-auto">
        <header className="flex justify-end border-b border-line bg-white px-8 py-3">
          <SelectorModoDemo />
        </header>
        <main className="px-8 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
