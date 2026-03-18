'use client';

import { motion } from 'framer-motion';
import { CornerBracket } from '@/components/ui/CornerBracket';

export const TacticalFrame = ({
  children,
  title,
  className = '',
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] transition-all hover:border-emerald-500/40 ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"
        animate={{ opacity: [0.45, 0.78, 0.45] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {title && (
        <div className="mb-4 border-b border-emerald-500/10 pb-2 font-mono text-[10px] uppercase tracking-widest text-emerald-500/40">
          {`${title} // SECURE_ACCESS`}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
