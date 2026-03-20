'use client';

import Image from 'next/image';
import { useDeferredValue, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { PinyinSearchInput } from '@/components/ui/PinyinSearchInput';
import { playerRosterData } from '@/data/playerRoster';
import { POKEMON_ART_ASSETS } from '@/data/remoteAssets';
import { trainersData } from '@/data/trainers';
import { garchomp } from '@/data/sampleData';

type PokedexEntry = {
  id: string;
  name: string;
  enName: string;
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

const typeMap: Record<string, string[]> = {
  Turtwig: ['Grass'],
  Chimchar: ['Fire'],
  Piplup: ['Water'],
  Starly: ['Normal', 'Flying'],
  Shinx: ['Electric'],
  Budew: ['Grass', 'Poison'],
  Cranidos: ['Rock'],
  Onix: ['Rock', 'Ground'],
  Geodude: ['Rock', 'Ground'],
  Shieldon: ['Rock', 'Steel'],
  Nosepass: ['Rock'],
  Aron: ['Steel', 'Rock'],
  Roserade: ['Grass', 'Poison'],
  Breloom: ['Grass', 'Fighting'],
  Tangela: ['Grass'],
  Cherrim: ['Grass'],
  Grovyle: ['Grass'],
  Grotle: ['Grass'],
  Lucario: ['Fighting', 'Steel'],
  Medicham: ['Fighting', 'Psychic'],
  Machoke: ['Fighting'],
  Hariyama: ['Fighting'],
  Toxicroak: ['Poison', 'Fighting'],
  Heracross: ['Bug', 'Fighting'],
  Gyarados: ['Water', 'Flying'],
  Floatzel: ['Water'],
  Quagsire: ['Water', 'Ground'],
  Azumarill: ['Water'],
  Pelipper: ['Water', 'Flying'],
  Poliwrath: ['Water', 'Fighting'],
  Garchomp: ['Dragon', 'Ground'],
};

const typeOptions = [
  ALL_TYPE_OPTION,
  'Normal',
  'Fire',
  'Rock',
  'Ground',
  'Steel',
  'Grass',
  'Poison',
  'Electric',
  'Fighting',
  'Psychic',
  'Bug',
  'Water',
  'Flying',
  'Dragon',
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
  Dragon: {
    label: 'DRAGON',
    accent: 'bg-violet-400',
    chip: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    hint: 'Elite offensive ceiling and sweep threat.',
  },
};

const pokemonSearchIndex: Record<string, { zh: string; initials: string }> = {
  Turtwig: { zh: '草苗龟', initials: 'cmg' },
  Chimchar: { zh: '小火焰猴', initials: 'xhyh' },
  Piplup: { zh: '波加曼', initials: 'bjm' },
  Starly: { zh: '姆克儿', initials: 'mke' },
  Shinx: { zh: '小猫怪', initials: 'xmg' },
  Budew: { zh: '含羞苞', initials: 'hxb' },
  Cranidos: { zh: '头盖龙', initials: 'tgl' },
  Onix: { zh: '大岩蛇', initials: 'dys' },
  Geodude: { zh: '小拳石', initials: 'xqs' },
  Shieldon: { zh: '盾甲龙', initials: 'djl' },
  Nosepass: { zh: '朝北鼻', initials: 'cbb' },
  Aron: { zh: '可可多拉', initials: 'kkdl' },
  Roserade: { zh: '罗丝雷朵', initials: 'lsld' },
  Breloom: { zh: '斗笠菇', initials: 'dlg' },
  Tangela: { zh: '蔓藤怪', initials: 'mtg' },
  Cherrim: { zh: '樱花儿', initials: 'yhe' },
  Grovyle: { zh: '森林蜥蜴', initials: 'slxy' },
  Grotle: { zh: '树林龟', initials: 'slg' },
  Lucario: { zh: '路卡利欧', initials: 'lklo' },
  Medicham: { zh: '恰雷姆', initials: 'qlm' },
  Machoke: { zh: '豪力', initials: 'hl' },
  Hariyama: { zh: '幕下力士', initials: 'mxls' },
  Toxicroak: { zh: '毒骷蛙', initials: 'dkw' },
  Heracross: { zh: '赫拉克罗斯', initials: 'hlkls' },
  Gyarados: { zh: '暴鲤龙', initials: 'bll' },
  Floatzel: { zh: '浮潜鼬', initials: 'fqy' },
  Quagsire: { zh: '沼王', initials: 'zw' },
  Azumarill: { zh: '玛力露丽', initials: 'mlll' },
  Pelipper: { zh: '大嘴鸥', initials: 'dzo' },
  Poliwrath: { zh: '蚊香泳士', initials: 'wxys' },
  Garchomp: { zh: '烈咬陆鲨', initials: 'llls' },
};

const typeLabelMap: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fire',
  water: 'Water',
  grass: 'Grass',
  electric: 'Electric',
  ice: 'Ice',
  fighting: 'Fighting',
  poison: 'Poison',
  ground: 'Ground',
  flying: 'Flying',
  psychic: 'Psychic',
  bug: 'Bug',
  rock: 'Rock',
  ghost: 'Ghost',
  dragon: 'Dragon',
  dark: 'Dark',
  steel: 'Steel',
  fairy: 'Fairy',
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

  const indexedPokemon = pokemonSearchIndex[entry.enName];
  const searchPool = [
    entry.name,
    entry.enName,
    indexedPokemon?.zh ?? '',
    indexedPokemon?.initials ?? '',
  ]
    .map((value) => normalizeQuery(value))
    .filter(Boolean);

  return searchPool.some((value) => value.includes(normalizedQuery));
}

const pokedexEntries: PokedexEntry[] = trainersData.flatMap((trainer) =>
  trainer.pokemon.map((pokemon) => {
    const threatScore =
      Math.round((pokemon.stats.atk + pokemon.stats.spA + pokemon.stats.spe + trainer.threatLevel) / 4) || 50;

    return {
      id: pokemon.id,
      name: pokemon.enName,
      enName: pokemon.enName,
      trainer: trainerLabels[trainer.id] || trainer.id,
      role: pokemon.role,
      note: pokemon.note,
      tactic: pokemon.tactic,
      ability: pokemon.ability,
      item: pokemon.item,
      nature: pokemon.nature,
      types: typeMap[pokemon.enName] || ['Normal'],
      art: POKEMON_ART_ASSETS[pokemon.enName] || '',
      threatScore,
      hasKaizoRevision: true,
      stats: pokemon.stats,
    };
  })
);

const supplementalDexEntries: PokedexEntry[] = [
  ...playerRosterData.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.enName,
    enName: pokemon.enName,
    trainer: 'Player Dossier',
    role: pokemon.role,
    note: pokemon.note,
    tactic: pokemon.tactic,
    ability: pokemon.ability,
    item: pokemon.item,
    nature: pokemon.nature,
    types: pokemon.types,
    art: POKEMON_ART_ASSETS[pokemon.enName] || '',
    threatScore: Math.round((pokemon.stats.atk + pokemon.stats.spA + pokemon.stats.spe) / 3),
    hasKaizoRevision: true,
    stats: pokemon.stats,
  })),
  {
    id: `dex-${garchomp.id}`,
    name: garchomp.enName,
    enName: garchomp.enName,
    trainer: 'Core Database',
    role: 'Reference Combat Sample',
    note: 'Integrated into the base dex index as a non-gym tactical benchmark unit.',
    tactic: 'Useful for validating multilingual search, acronym matching, and cross-page ballistic test flow.',
    ability: 'Sand Stream',
    item: 'Unassigned',
    nature: 'Reference Template',
    types: garchomp.types.flatMap((type) => {
      if (!type) {
        return [];
      }

      return [typeLabelMap[type] || type];
    }),
    art: POKEMON_ART_ASSETS.Garchomp,
    threatScore: Math.round(
      (garchomp.baseStats.atk + garchomp.baseStats.spA + garchomp.baseStats.spe) / 3
    ),
    hasKaizoRevision: true,
    stats: garchomp.baseStats,
  },
];

const dexEntries = [...pokedexEntries, ...supplementalDexEntries];

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

        <div className="grid grid-cols-1 gap-1.5 p-2 md:grid-cols-2 xl:grid-cols-3">
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

                <div className="mt-2 text-[11px] leading-5 text-slate-400">{meta.hint}</div>
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

