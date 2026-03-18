'use client';

import { TYPE_CHART } from '@/constants/typeChart';

type TeamMember = {
  id: string;
  name: string;
  types: string[];
} | null;

const attackTypes = [
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

export const SynergyMatrix = ({ team }: { team: TeamMember[] }) => {
  const analysis = attackTypes.map((attackType) => {
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
        {analysis.map((entry) => {
          const tone =
            entry.score > 0
              ? 'text-emerald-400'
              : entry.score < 0
                ? 'text-red-400'
                : 'text-slate-300';

          return (
            <div
              key={entry.attackType}
              className="rounded border border-slate-900 bg-black/40 p-2"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500">
                  {entry.attackType.slice(0, 3)}
                </span>
                <span className={`text-xs font-bold ${tone}`}>
                  {entry.score >= 0 ? `+${entry.score}` : entry.score}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-[9px] font-mono text-slate-500">
                <span>W{entry.weak}</span>
                <span>R{entry.resist}</span>
                <span>I{entry.immune}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

