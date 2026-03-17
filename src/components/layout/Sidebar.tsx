'use client';

import { navItems } from '@/lib/navigation';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export function Sidebar(): React.ReactElement {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-sidebar bg-slate-900/80 backdrop-blur-md border-r border-emerald-500/20 transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Platinum Wiki
          </h1>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-emerald-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-emerald-400'
                }`}
              >
                <span className="flex-1 font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-emerald-500/20 p-4">
          <p className="text-xs text-slate-400 text-center">
            Platinum Kaizo Wiki v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
