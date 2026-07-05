"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSidebar } from "./SidebarState";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  topbarTitle?: string;
}

export function AppShell({ children, topbarTitle }: AppShellProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gawer-gray-50">
      <Sidebar />
      <div
        className={cn(
          "transition-[padding] duration-200 ease-in-out",
          collapsed ? "pl-20" : "pl-64"
        )}
      >
        <Topbar title={topbarTitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
