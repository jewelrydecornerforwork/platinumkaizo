'use client';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Menu } from 'lucide-react';

export function Header(): React.ReactElement {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-emerald-500/20 z-30 md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-emerald-500" />
        </button>
        <span className="text-lg font-bold text-emerald-400">Platinum Wiki</span>
        <div className="w-10" />
      </div>
    </header>
  );
}
