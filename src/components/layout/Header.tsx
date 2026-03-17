'use client';

import { useSidebar } from '@/components/providers/SidebarProvider';
import { Menu } from 'lucide-react';

export function Header(): React.ReactElement {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-emerald-500/30 bg-black/45 backdrop-blur-xl md:hidden">
      <div className="flex h-full items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="tech-button h-10 w-10 px-0 py-0"
          aria-label="切换侧边栏"
        >
          <Menu size={20} />
        </button>
        <span className="title-strong text-lg text-emerald-300">白金改版百科</span>
        <div className="w-10" />
      </div>
    </header>
  );
}
