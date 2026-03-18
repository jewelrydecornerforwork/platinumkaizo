import { motion } from 'framer-motion';

const typeColors: Record<string, string> = {
  Normal: 'border-stone-500 bg-stone-900/40 text-stone-200',
  Fire: 'border-orange-600 bg-orange-900/40 text-orange-200',
  Water: 'border-blue-600 bg-blue-900/40 text-blue-200',
  Electric: 'border-yellow-500 bg-yellow-900/40 text-yellow-200',
  Grass: 'border-emerald-600 bg-emerald-900/40 text-emerald-200',
  Ice: 'border-cyan-500 bg-cyan-900/40 text-cyan-200',
  Fighting: 'border-red-600 bg-red-900/40 text-red-200',
  Poison: 'border-fuchsia-600 bg-fuchsia-900/40 text-fuchsia-200',
  Ground: 'border-yellow-600 bg-yellow-900/40 text-yellow-200',
  Flying: 'border-sky-600 bg-sky-900/40 text-sky-200',
  Psychic: 'border-pink-600 bg-pink-900/40 text-pink-200',
  Bug: 'border-lime-600 bg-lime-900/40 text-lime-200',
  Rock: 'border-slate-600 bg-slate-900/40 text-slate-200',
  Ghost: 'border-violet-600 bg-violet-900/40 text-violet-200',
  Dragon: 'border-purple-600 bg-purple-900/40 text-purple-200',
  Dark: 'border-zinc-600 bg-zinc-900/40 text-zinc-200',
  Steel: 'border-slate-400 bg-slate-800/60 text-slate-100',
};

export const TypeIcon = ({ type }: { type: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded border px-3 py-1 text-[10px] font-mono ${typeColors[type] || 'border-slate-800 text-slate-300'}`}
    >
      {type.toUpperCase()}
    </motion.span>
  );
};

