'use client';

import Image from 'next/image';

export const LeaderList = ({ leaders, activeId, onSelect }: any) => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="mb-2 flex items-center justify-between border-b border-emerald-500/10 pb-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Gym_Leader_Log
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
          Threat Index
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {leaders.map((leader: any) => (
          <button
            key={leader.id}
            type="button"
            onClick={() => onSelect(leader.id)}
            className={`group flex w-full items-center gap-3 rounded-xl border p-2 transition-all ${
              activeId === leader.id
                ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.08)]'
                : 'border-transparent hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              <Image
                src={leader.avatar}
                alt={leader.name}
                fill
                className="object-contain p-1 grayscale transition-all group-hover:grayscale-0"
              />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div
                className={`truncate text-xs font-bold ${
                  activeId === leader.id ? 'text-emerald-400' : 'text-slate-300'
                }`}
              >
                {leader.name}
              </div>
              <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-600">
                {leader.specialty}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[10px] font-mono font-bold text-emerald-300">
                {leader.threatLevel}
              </div>
              <div className="text-[8px] font-mono uppercase tracking-[0.16em] text-slate-600">
                Threat
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
