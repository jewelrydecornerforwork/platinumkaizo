'use client';

import Image from 'next/image';
import { useDeferredValue, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { PinyinSearchInput } from '@/components/ui/PinyinSearchInput';
import { nationalDexData } from '@/data/nationalDex';
import { nationalDexNameIndex } from '@/data/nationalDexNames';
import { playerRosterData } from '@/data/playerRoster';
import { getPokemonArtAsset } from '@/data/remoteAssets';
import { trainersData } from '@/data/trainers';

type PokedexEntry = {
  id: string;
  name: string;
  zhName: string;
  enName: string;
  initials: string;
  trainer: string;
  role: string;
  note: string;
  tactic: string;
  ability: string;
  item: string;
  nature: string;
  types: string[];
  art: string;
  threatScore: number;
  hasKaizoRevision: boolean;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spA: number;
    spD: number;
    spe: number;
  };
};

const ALL_TYPE_OPTION = 'ALL TYPES';

const trainerLabels: Record<string, string> = {
  roark: 'Roark',
  gardenia: 'Gardenia',
  maylene: 'Maylene',
  wake: 'Wake',
};

const typeOptions = [
  ALL_TYPE_OPTION,
  'Normal',
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
  'Steel',
  'Dragon',
  'Dark',
] as const;

const typeOptionMeta: Record<
  (typeof typeOptions)[number],
  {
    label: string;
    accent: string;
    chip: string;
    hint: string;
  }
> = {
  'ALL TYPES': {
    label: 'ALL TYPES',
    accent: 'bg-emerald-400',
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    hint: 'Display every indexed combat unit.',
  },
  Normal: {
    label: 'NORMAL',
    accent: 'bg-slate-300',
    chip: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
    hint: 'Generalist utility lines and stable neutral pressure.',
  },
  Fire: {
    label: 'FIRE',
    accent: 'bg-orange-500',
    chip: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
    hint: 'Fast breach pressure and burn-enabled tempo swings.',
  },
  Rock: {
    label: 'ROCK',
    accent: 'bg-amber-400',
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    hint: 'Heavy physical bulk and pressure anchors.',
  },
  Ground: {
    label: 'GROUND',
    accent: 'bg-yellow-500',
    chip: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
    hint: 'Electric denial and quake pressure lanes.',
  },
  Steel: {
    label: 'STEEL',
    accent: 'bg-slate-300',
    chip: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
    hint: 'High-resistance relay and defensive compression.',
  },
  Grass: {
    label: 'GRASS',
    accent: 'bg-lime-400',
    chip: 'border-lime-500/30 bg-lime-500/10 text-lime-200',
    hint: 'Seed attrition and recovery-based control.',
  },
  Electric: {
    label: 'ELECTRIC',
    accent: 'bg-yellow-400',
    chip: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200',
    hint: 'Speed control, anti-water pressure, and clean pivot checks.',
  },
  Ice: {
    label: 'ICE',
    accent: 'bg-cyan-200',
    chip: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100',
    hint: 'Freeze pressure and dragon suppression.',
  },
  Poison: {
    label: 'POISON',
    accent: 'bg-fuchsia-500',
    chip: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200',
    hint: 'Status warfare and toxic choke points.',
  },
  Fighting: {
    label: 'FIGHTING',
    accent: 'bg-orange-500',
    chip: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
    hint: 'Close-range breach and shield-breaking force.',
  },
  Psychic: {
    label: 'PSYCHIC',
    accent: 'bg-pink-500',
    chip: 'border-pink-500/30 bg-pink-500/10 text-pink-200',
    hint: 'Precision reads and special pressure vectors.',
  },
  Bug: {
    label: 'BUG',
    accent: 'bg-lime-500',
    chip: 'border-lime-600/30 bg-lime-600/10 text-lime-200',
    hint: 'Interference loops and opportunistic cleanup.',
  },
  Water: {
    label: 'WATER',
    accent: 'bg-sky-400',
    chip: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    hint: 'Rain tempo and sustained offensive flow.',
  },
  Flying: {
    label: 'FLYING',
    accent: 'bg-cyan-300',
    chip: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    hint: 'Fast insertion and ground suppression.',
  },
  Ghost: {
    label: 'GHOST',
    accent: 'bg-indigo-400',
    chip: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
    hint: 'Immunity abuse and shadow pressure.',
  },
  Dragon: {
    label: 'DRAGON',
    accent: 'bg-violet-400',
    chip: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    hint: 'Elite offensive ceiling and sweep threat.',
  },
  Dark: {
    label: 'DARK',
    accent: 'bg-zinc-400',
    chip: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-200',
    hint: 'Punish reads, trap lines, and deny psychic routes.',
  },
};

const normalizeQuery = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');

function filterPokemon(
  entry: PokedexEntry,
  query: string,
  selectedType: string
) {
  const typeMatch = selectedType === ALL_TYPE_OPTION || entry.types.includes(selectedType);

  if (!typeMatch) {
    return false;
  }

  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchPool = [
    entry.zhName,
    entry.enName,
    entry.initials,
  ]
    .map((value) => normalizeQuery(value))
    .filter(Boolean);

  return searchPool.some((value) => value.includes(normalizedQuery));
}

function getNationalDexRole(stats: PokedexEntry['stats']): string {
  const physical = stats.atk;
  const special = stats.spA;
  const speed = stats.spe;
  const bulk = stats.hp + stats.def + stats.spD;

  if (speed >= 110) return 'Rapid Tactical Unit';
  if (physical >= 120) return 'Physical Pressure Unit';
  if (special >= 120) return 'Special Pressure Unit';
  if (bulk >= 280) return 'Defensive Anchor Unit';
  return 'Balanced Combat Unit';
}

function getNationalDexThreatScore(stats: PokedexEntry['stats']): number {
  return Math.round((stats.atk + stats.spA + stats.spe) / 3) || 50;
}

const intelOverrides = new Map<string, Partial<PokedexEntry>>([
  ...trainersData.flatMap((trainer) =>
    trainer.pokemon.map((pokemon) => [
      pokemon.enName,
      {
        trainer: trainerLabels[trainer.id] || trainer.id,
        role: pokemon.role,
        note: pokemon.note,
        tactic: pokemon.tactic,
        ability: pokemon.ability,
        item: pokemon.item,
        nature: pokemon.nature,
        art: getPokemonArtAsset(pokemon.enName),
        threatScore:
          Math.round((pokemon.stats.atk + pokemon.stats.spA + pokemon.stats.spe + trainer.threatLevel) / 4) || 50,
        hasKaizoRevision: true,
      } satisfies Partial<PokedexEntry>,
    ] as const)
  ),
  ...playerRosterData.map((pokemon) => [
    pokemon.enName,
    {
      trainer: 'Player Dossier',
      role: pokemon.role,
      note: pokemon.note,
      tactic: pokemon.tactic,
      ability: pokemon.ability,
      item: pokemon.item,
      nature: pokemon.nature,
      art: getPokemonArtAsset(pokemon.enName),
      threatScore: Math.round((pokemon.stats.atk + pokemon.stats.spA + pokemon.stats.spe) / 3),
      hasKaizoRevision: true,
    } satisfies Partial<PokedexEntry>,
  ] as const),
]);

const dexEntries: PokedexEntry[] = nationalDexData.map((pokemon) => {
  const override = intelOverrides.get(pokemon.enName);

  return {
    id: pokemon.id,
    name: nationalDexNameIndex[pokemon.enName]?.zh || pokemon.enName,
    zhName: nationalDexNameIndex[pokemon.enName]?.zh || pokemon.enName,
    enName: pokemon.enName,
    initials: nationalDexNameIndex[pokemon.enName]?.initials || normalizeQuery(pokemon.enName),
    trainer: override?.trainer || 'National Dex',
    role: override?.role || getNationalDexRole(pokemon.stats),
    note: override?.note || 'Standard national dex profile synchronized for tactical review.',
    tactic:
      override?.tactic ||
      'Use this unit as a baseline combat profile, then transfer it into the ballistic console for field-specific damage validation.',
    ability: override?.ability || pokemon.ability || 'Unassigned',
    item: override?.item || 'Unassigned',
    nature: override?.nature || 'Neutral',
    types: pokemon.types,
    art: override?.art || getPokemonArtAsset(pokemon.enName),
    threatScore: override?.threatScore || getNationalDexThreatScore(pokemon.stats),
    hasKaizoRevision: override?.hasKaizoRevision || false,
    stats: pokemon.stats,
  };
});

function FilterBar({
  onSearch,
  selectedType,
  onTypeChange,
}: {
  onSearch: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3 backdrop-blur-md">
      <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/95 shadow-[0_24px_60px_rgba(2,6,23,0.72)]">
        <div className="border-b border-emerald-500/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_60%)] px-3 py-3">
          <div>
            <PinyinSearchInput onSearch={onSearch} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-2 md:grid-cols-3 xl:grid-cols-4">
          {typeOptions.map((type) => {
            const meta = typeOptionMeta[type];
            const isActive = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => onTypeChange(type)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                    : 'border-slate-800 bg-black/25 hover:border-emerald-500/20 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${meta.accent}`} />
                      <span className="text-[13px] font-bold text-white">{meta.label}</span>
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                      {type}
                    </div>
                  </div>
                  {isActive ? (
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-emerald-300">
                      ACTIVE
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({
  entry,
  onClose,
}: {
  entry: PokedexEntry | null;
  onClose: () => void;
}) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end bg-black/65 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl border-l border-emerald-500/15 bg-slate-950/95 p-6 shadow-[-20px_0_80px_rgba(2,6,23,0.7)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-800 bg-black/20">
              <Image src={entry.art} alt={entry.name} fill className="object-contain p-2" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/60">
                DEX_UNIT_RECORD
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">{entry.name}</h2>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                {entry.enName} / {entry.trainer}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-black/20 p-3 text-slate-300 transition-all hover:border-emerald-500/35 hover:text-emerald-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {entry.types.map((type) => (
            <span
              key={`${entry.id}-${type}`}
              className="rounded-full border border-slate-700 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">TACTICAL ROLE</div>
            <div className="mt-2 text-sm text-white">{entry.role}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">THREAT GRADE</div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-300">T-{entry.threatScore}</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-black/20 p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">BASE STAT PANEL</div>
          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-slate-300">
            <div>HP {entry.stats.hp}</div>
            <div>ATK {entry.stats.atk}</div>
            <div>DEF {entry.stats.def}</div>
            <div>SPA {entry.stats.spA}</div>
            <div>SPD {entry.stats.spD}</div>
            <div>SPE {entry.stats.spe}</div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">KAIZO REVISION</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{entry.note}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">TACTICAL ADVISORY</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{entry.tactic}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">ABILITY</div>
              <div className="mt-2 text-sm text-white">{entry.ability}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">HELD ITEM</div>
              <div className="mt-2 text-sm text-white">{entry.item}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">NATURE</div>
              <div className="mt-2 text-sm text-white">{entry.nature}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PokedexPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(ALL_TYPE_OPTION);
  const [activeEntry, setActiveEntry] = useState<PokedexEntry | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredEntries = useMemo(() => {
    return dexEntries.filter((entry) => filterPokemon(entry, deferredQuery, selectedType));
  }, [deferredQuery, selectedType]);

  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="title-strong text-4xl text-emerald-300 md:text-5xl">FULL DEX TACTICAL INDEX</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            A Kaizo-first intelligence board for high-risk unit review. Search by localized name, English name, or acronym while filtering by combat type.
          </p>
        </section>

        <FilterBar onSearch={setSearchQuery} selectedType={selectedType} onTypeChange={setSelectedType} />

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {filteredEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActiveEntry(entry)}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left backdrop-blur-md transition-all duration-300 hover:border-emerald-500/35"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-800 bg-black/20">
                    <Image src={entry.art} alt={entry.name} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">{entry.name}</h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{entry.enName}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {entry.types.map((type) => (
                  <span
                    key={`${entry.id}-${type}`}
                    className="rounded-full border border-slate-700 bg-black/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{entry.role}</p>
                <p className="line-clamp-2 text-xs leading-5 text-slate-400">{entry.note}</p>
              </div>
            </button>
          ))}
        </section>
      </div>

      <DetailDrawer entry={activeEntry} onClose={() => setActiveEntry(null)} />
    </div>
  );
}

