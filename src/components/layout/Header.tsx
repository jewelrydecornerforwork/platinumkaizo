'use client';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Menu } from 'lucide-react';

export function Header(): React.ReactElement {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed left-4 top-4 z-30 md:hidden">
      <button
        onClick={toggleSidebar}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-black/55 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.12)] backdrop-blur-xl transition-all hover:border-emerald-400/40"
        aria-label="切换侧边栏"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
