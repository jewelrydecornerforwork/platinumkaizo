'use client';

const feedItems = [
  { t: '02:45', m: 'SYNC: GARCHOMP_STATS_V2' },
  { t: '04:18', m: 'STATUS: ROARK_LEAD_PROFILE_LOCKED' },
  { t: '09:12', m: 'MOD: GARDENIA_AI_REFINED' },
  { t: '14:30', m: 'SYS: DB_BACKUP_COMPLETED' },
  { t: '19:44', m: 'OPS: MAYLENE_PRIORITY_CHAIN_VERIFIED' },
] as const;

export const LiveFeed = (): React.ReactElement => (
  <div className="relative h-36 overflow-hidden rounded border border-slate-800 bg-black/80 p-4 font-mono text-[9px] shadow-[0_0_24px_rgba(16,185,129,0.08)]">
    <div className="mb-2 border-b border-emerald-500/10 pb-1 text-emerald-500/60">
      LIVE_INTEL_STREAM:
    </div>
    <div className="space-y-1 overflow-y-auto pr-1 text-[10px]">
      {feedItems.map((item) => (
        <div key={`${item.t}-${item.m}`} className="flex gap-2 opacity-80">
          <span className="text-emerald-500">[{item.t}]</span>
          <span className="text-slate-400">{item.m}</span>
        </div>
      ))}
    </div>
    <div className="mt-2 animate-pulse cursor-pointer text-emerald-500 underline underline-offset-4">
      ACCESS_FULL_LOG...
    </div>
  </div>
);
