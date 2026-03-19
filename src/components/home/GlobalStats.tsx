'use client';

export const GlobalStats = (): React.ReactElement => (
  <div className="flex w-full flex-wrap items-center justify-between gap-3 border-y border-emerald-500/10 bg-emerald-500/5 px-6 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-500/40 backdrop-blur-sm">
    <span>Units: 493</span>
    <span>Moves: 467</span>
    <span>
      Sync_Status: <span className="text-emerald-400">Verified_1.13</span>
    </span>
    <span className="text-emerald-400">Node: US-EAST-1</span>
  </div>
);
