"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Trophy,
  Building2,
  BookOpen,
  Compass,
  Brain,
  FolderOpen,
  LifeBuoy,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Globe,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarState";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/propuestas", label: "Propuestas", icon: FileText },
  { href: "/bandeja", label: "Bandeja operativa", icon: Inbox },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/areas-negocio", label: "Áreas de negocio", icon: Building2 },
  { href: "/base-conocimiento", label: "Base de conocimiento", icon: BookOpen },
  { href: "/discovery", label: "Discovery GAWER", icon: Compass },
  { href: "/ia", label: "IA", icon: Brain },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/mesa-ayuda", label: "Mesa de ayuda", icon: LifeBuoy },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/demo-local", label: "Demo local", icon: ClipboardCheck },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-gawer-charcoal text-white transition-[width] duration-200 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "relative flex h-16 items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gawer-green font-bold text-sm">
          G
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">GAWER Intelligence</p>
            <p className="text-[10px] text-white/50 leading-tight truncate">Evaluación estratégica</p>
          </div>
        )}

        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          aria-pressed={collapsed}
          className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-gawer-charcoal text-white/80 shadow-md transition-colors hover:bg-gawer-green hover:text-white hover:border-gawer-green"
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronsLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
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
                  title={item.label}
                  aria-label={item.label}
                  className={cn(
                    "flex items-center rounded-md py-2.5 text-sm font-medium transition-colors",
                    collapsed ? "justify-center px-2" : "gap-3 px-3",
                    isActive
                      ? "bg-gawer-green text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={cn("border-t border-white/10", collapsed ? "px-3 py-3" : "p-3")}>
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Acceso externo
          </p>
        )}
        <Link
          href="/propuesta"
          target="_blank"
          rel="noopener noreferrer"
          title="Formulario público — Presentar propuesta (se abre en una pestaña nueva)"
          aria-label="Formulario público — Presentar propuesta (se abre en una pestaña nueva)"
          className={cn(
            "flex items-center rounded-md border border-gawer-gold/30 bg-gawer-gold/10 py-2.5 text-sm font-medium text-gawer-gold-muted transition-colors hover:bg-gawer-gold/20",
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Formulario público</span>}
        </Link>
      </div>

      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="rounded-md bg-white/5 px-3 py-2">
            <p className="text-xs text-white/50">Versión mock</p>
            <p className="text-xs font-medium text-white/80">v0.1.0 — Discovery</p>
          </div>
        ) : (
          <div
            className="rounded-md bg-white/5 py-2 text-center"
            title="Versión mock v0.1.0 — Discovery"
          >
            <p className="text-[10px] font-medium text-white/60">v0.1</p>
          </div>
        )}
      </div>
    </aside>
  );
}
