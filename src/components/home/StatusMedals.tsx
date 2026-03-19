'use client';

import {
  BadgeCheck,
  Binary,
  Cpu,
  Database,
  Lock,
  Radar,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const medals = [
  { label: 'DEX_SYNC', status: 'SECURED', icon: Database },
  { label: 'AI_ROUTER', status: 'SECURED', icon: Cpu },
  { label: 'OPS_GRID', status: 'LOCKED', icon: Radar },
  { label: 'DAMAGE_CORE', status: 'SECURED', icon: Zap },
  { label: 'AUTH_NODE', status: 'SECURED', icon: ShieldCheck },
  { label: 'PATCH_LINE', status: 'LOCKED', icon: Lock },
  { label: 'BUILD_HASH', status: 'SECURED', icon: Binary },
  { label: 'FIELD_PASS', status: 'LOCKED', icon: BadgeCheck },
] as const;

export const StatusMedals = (): React.ReactElement => (
  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    {medals.map((medal) => {
      const Icon = medal.icon;
      const secured = medal.status === 'SECURED';

      return (
        <div
          key={medal.label}
          className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-[0_0_20px_rgba(15,23,42,0.65)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                secured
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
              }`}
            >
              <Icon size={16} />
            </div>
            <span
              className={`rounded-full px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] ${
                secured
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-amber-500/10 text-amber-300'
              }`}
            >
              {`STATUS: ${medal.status}`}
            </span>
          </div>

          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
            {medal.label}
          </div>
        </div>
      );
    })}
  </div>
);
