'use client';

import { TYPE_CHART } from '@/constants/typeChart';

type TeamMember = {
  id: string;
  name: string;
  types: string[];
} | null;

const types = [
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Steel',
  'Dark',
  'Fairy',
  'Normal',
] as const;

function getDefensiveMultiplier(attackType: string, defendTypes: string[]): number {
  return defendTypes.reduce(
    (multiplier, defendType) => multiplier * (TYPE_CHART[attackType]?.[defendType] ?? 1),
    1
  );
}

function getTone(score: number): string {
  if (score >= 3) return 'from-emerald-500/35 to-emerald-400/10 text-emerald-300';
  if (score >= 1) return 'from-cyan-500/25 to-cyan-400/10 text-cyan-300';
  if (score === 0) return 'from-slate-700/30 to-slate-600/10 text-slate-300';
  if (score <= -3) return 'from-red-500/35 to-red-400/10 text-red-300';
  return 'from-orange-500/30 to-orange-400/10 text-orange-300';
}

function getBarWidth(score: number): string {
  const normalized = Math.min(100, Math.max(12, 50 + score * 12));
  return `${normalized}%`;
}

export const SynergyMatrix = ({ team }: { team: TeamMember[] }) => {
  const analysis = types.map((attackType) => {
    const activeMembers = team.filter(Boolean) as Exclude<TeamMember, null>[];

    const stats = activeMembers.reduce(
      (acc, member) => {
        const multiplier = getDefensiveMultiplier(attackType, member.types);

        if (multiplier === 0) acc.immune += 1;
        else if (multiplier < 1) acc.resist += 1;
        else if (multiplier > 1) acc.weak += 1;

        return acc;
      },
      { weak: 0, resist: 0, immune: 0 }
    );

    const score = stats.resist + stats.immune - stats.weak;
    return { attackType, ...stats, score };
  });

  return (
    <div className="rounded-2xl border border-slate-800 border-t-emerald-500/20 bg-slate-950/80 p-6">
      <h3 className="mb-6 text-xs font-mono uppercase tracking-[0.2em] text-emerald-500">
        Team_Synergy_Analysis // 联防演算
      </h3>
      <div className="grid grid-cols-6 gap-2 md:grid-cols-9">
        {analysis.map((entry) => (
          <div
            key={entry.attackType}
            className="overflow-hidden rounded border border-slate-900 bg-black/40"
          >
            <div className="px-2 pt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500">
                  {entry.attackType.slice(0, 3)}
                </span>
                <span className={`text-xs font-bold ${getTone(entry.score).split(' ').pop()}`}>
                  {entry.score >= 0 ? `+${entry.score}` : entry.score}
                </span>
              </div>
              <div className="mb-2 grid grid-cols-3 gap-1 text-center text-[9px] font-mono text-slate-500">
                <span>W{entry.weak}</span>
                <span>R{entry.resist}</span>
                <span>I{entry.immune}</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-900">
              <div
                className={`h-full bg-gradient-to-r ${getTone(entry.score)}`}
                style={{ width: getBarWidth(entry.score) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

