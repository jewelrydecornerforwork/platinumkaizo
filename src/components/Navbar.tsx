"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'COMMAND HUB', href: '/' },
  { name: 'FULL DEX INDEX', href: '/pokedex' },
  { name: 'PRECISION BALLISTIC CONSOLE', href: '/calculator' },
  { name: 'GYM LEADER TACTICAL DOSSIER', href: '/trainers' },
  { name: 'STRIKE TEAM ARCHITECT', href: '/teambuilder' },
];

export default function Navbar(): React.ReactElement {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xl font-black tracking-tighter text-white">
            PK-WIKI <span className="data-number text-xs font-semibold text-emerald-500">v1.0</span>
          </span>
        </div>

        <div className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="group relative">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400 transition-colors group-hover:text-emerald-400">
                {item.name}
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-[2px] bg-emerald-500"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>

        <div className="hidden text-[10px] text-emerald-500/60 lg:block">
          <span className="data-number">SYSTEM_STATUS:</span>{' '}
          <span className="font-semibold text-emerald-400">OPTIMIZED</span>
        </div>
      </div>
    </nav>
  );
}
