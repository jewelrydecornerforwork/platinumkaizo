'use client';

import { Minus, Plus } from 'lucide-react';

export const StatAdjuster = ({
  label,
  value,
  onChange,
  step = 4,
  max = 252,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  max?: number;
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-black/40 p-2 transition-all group hover:border-emerald-500/30">
      <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-500">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - step))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-400 shadow-inner transition-all hover:text-red-400 active:scale-95"
        >
          <Minus size={14} />
        </button>

        <span className="w-8 text-center font-mono text-sm font-bold text-white">{value}</span>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-700 bg-slate-800 text-slate-400 shadow-inner transition-all hover:text-emerald-400 active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

