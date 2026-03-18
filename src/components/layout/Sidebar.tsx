'use client';

import { navItems } from '@/lib/navigation';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { Radar, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar(): React.ReactElement {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <aside
        className={`glass-card fixed left-0 top-0 z-40 flex h-screen w-sidebar flex-col rounded-r-2xl border-r border-emerald-500/30 bg-black/45 shadow-[0_0_26px_rgba(59,130,246,0.22)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'
        }`}
        role="navigation"
        aria-label="主导航"
      >
        <div className="border-b border-emerald-500/25 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.12)]">
                <Radar size={22} />
              </div>
              <div>
                <h1 className="title-strong bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-2xl text-transparent">
                  PKZ SYS
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400/45">
                  Tactical Command
                </p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="tech-button h-10 w-10 px-0 py-0 md:hidden"
              aria-label="关闭侧边栏"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeSidebar}
                className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'translate-x-1 border-l-2 border-emerald-500 bg-emerald-500/20 text-emerald-200'
                    : 'text-slate-200 hover:translate-x-1 hover:bg-black/30 hover:text-emerald-200'
                }`}
              >
                <span className="flex-1 font-medium">{item.label}</span>
                {isActive && <div className="h-2 w-2 rounded-full bg-emerald-400" />}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-1 left-1/2 h-px -translate-x-1/2 bg-emerald-400/90 transition-all duration-300 ${
                    isActive ? 'w-[78%]' : 'w-0 group-hover:w-[78%]'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-emerald-500/25 p-4">
          <p className="text-center text-xs text-slate-400">白金改版百科 1.0 版</p>
        </div>
      </aside>
    </>
  );
}
