"use client";

import { motion } from 'framer-motion';

interface TacticalCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  actionLabel: string;
}

export function TacticalCard({
  title,
  desc,
  icon,
  actionLabel,
}: TacticalCardProps): React.ReactElement {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-500 hover:border-emerald-500/50">
      <motion.div
        className="absolute inset-0 z-10 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-emerald-500/30" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-emerald-500/30" />

      <div className="relative z-20">
        <div className="mb-4 text-emerald-500">{icon}</div>
        <h3 className="title-strong mb-2 text-lg text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{desc}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] italic text-slate-500">{actionLabel}</span>
          <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-emerald-500"
              animate={{ x: [-50, 50] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
