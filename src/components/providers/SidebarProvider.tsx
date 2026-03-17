'use client';

import type { SidebarContextType } from '@/types';
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebar = (): void => {
    setIsOpen(false);
  };

  const value: SidebarContextType = {
    isOpen,
    toggleSidebar,
    closeSidebar,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar 必须在 SidebarProvider 内部使用');
  }
  return context;
}
