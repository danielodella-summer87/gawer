"use client";

import { Bell, Search, User } from "lucide-react";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gawer-gray-200 bg-white/80 backdrop-blur-sm px-6">
      <div>
        {title && (
          <p className="text-xs font-medium uppercase tracking-wider text-gawer-gray-400">
            {title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gawer-gray-400" />
          <input
            type="text"
            placeholder="Buscar oportunidades..."
            className="h-9 w-64 rounded-md border border-gawer-gray-200 bg-gawer-gray-50 pl-9 pr-4 text-sm placeholder:text-gawer-gray-400 focus:border-gawer-petrol focus:outline-none focus:ring-1 focus:ring-gawer-petrol"
            readOnly
          />
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-gawer-gray-500 hover:bg-gawer-gray-100 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gawer-green" />
        </button>

        <div className="flex items-center gap-2 rounded-md border border-gawer-gray-200 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gawer-petrol text-xs font-semibold text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gawer-charcoal">Fernando G.</p>
            <p className="text-[10px] text-gawer-gray-500">Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
