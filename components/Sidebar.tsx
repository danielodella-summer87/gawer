"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Trophy,
  Building2,
  BookOpen,
  Brain,
  FolderOpen,
  LifeBuoy,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/propuestas", label: "Propuestas", icon: FileText },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/areas-negocio", label: "Áreas de negocio", icon: Building2 },
  { href: "/base-conocimiento", label: "Base de conocimiento", icon: BookOpen },
  { href: "/ia", label: "IA", icon: Brain },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/mesa-ayuda", label: "Mesa de ayuda", icon: LifeBuoy },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gawer-charcoal text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gawer-green font-bold text-sm">
          G
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">GAWER Intelligence</p>
          <p className="text-[10px] text-white/50 leading-tight">Evaluación estratégica</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gawer-green text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-md bg-white/5 px-3 py-2">
          <p className="text-xs text-white/50">Versión mock</p>
          <p className="text-xs font-medium text-white/80">v0.1.0 — Discovery</p>
        </div>
      </div>
    </aside>
  );
}
