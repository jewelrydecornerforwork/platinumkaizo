'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ScanSearch, ShieldAlert } from 'lucide-react';
import { TacticalFrame } from '@/components/ui/TacticalFrame';
import { trainersData } from '@/data/trainers';

const pokemonLabels: Record<string, string> = {
  Cranidos: '头盖龙',
  Onix: '大岩蛇',
  Geodude: '小拳石',
  Shieldon: '盾甲龙',
  Nosepass: '朝北鼻',
  Aron: '可可多拉',
  Roserade: '罗丝雷朵',
  Breloom: '斗笠菇',
  Tangela: '蔓藤怪',
  Cherrim: '樱花儿',
  Grovyle: '森林蜥蜴',
  Grotle: '树林龟',
  Lucario: '路卡利欧',
  Medicham: '恰雷姆',
  Machoke: '豪力',
  Hariyama: '幕下力士',
  Toxicroak: '毒骷蛙',
  Heracross: '赫拉克罗斯',
  Gyarados: '暴鲤龙',
  Floatzel: '浮潜鼬',
  Quagsire: '沼王',
  Azumarill: '玛力露丽',
  Pelipper: '大嘴鸥',
  Poliwrath: '蚊香泳士',
};

const trainerLabels: Record<string, string> = {
  roark: '瓢太',
  gardenia: '菜种',
  maylene: '阿李',
  wake: '吉宪',
};

const typeMap: Record<string, string[]> = {
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
};

const typeOptions = [
  '全部属性',
  'Rock',
  'Ground',
  'Steel',
  'Grass',
  'Poison',
  'Fighting',
  'Psychic',
  'Bug',
  'Water',
  'Flying',
] as const;

const pokedexEntries = trainersData.flatMap((trainer) =>
  trainer.pokemon.map((pokemon) => {
    const threatScore =
      Math.round(
        (pokemon.stats.atk + pokemon.stats.spA + pokemon.stats.spe + trainer.threatLevel) / 4
      ) || 50;

    return {
      id: pokemon.id,
      name: pokemonLabels[pokemon.enName] || pokemon.enName,
      enName: pokemon.enName,
      trainer: trainerLabels[trainer.id] || trainer.id,
      role: pokemon.role,
      note: pokemon.note,
      tactic: pokemon.tactic,
      types: typeMap[pokemon.enName] || ['Normal'],
      threatScore,
      hasKaizoRevision: true,
    };
  })
);

function FilterBar({
  selectedType,
  onTypeChange,
  kaizoOnly,
  onKaizoToggle,
}: {
  selectedType: string;
  onTypeChange: (value: string) => void;
  kaizoOnly: boolean;
  onKaizoToggle: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-800 bg-black/20 px-4 py-3">
        <ScanSearch className="h-4 w-4 text-emerald-300" />
        <div className="relative w-full">
          <select
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value)}
            className="w-full appearance-none bg-transparent pr-8 font-mono text-sm text-slate-100 outline-none"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type} className="bg-slate-950">
                {type}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onKaizoToggle(!kaizoOnly)}
        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-all ${
          kaizoOnly
            ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
            : 'border-slate-800 bg-black/20 text-slate-400'
        }`}
      >
        Kaizo 改动优先
        <div
          className={`h-5 w-10 rounded-full border transition-all ${
            kaizoOnly ? 'border-emerald-500/40 bg-emerald-500/15' : 'border-slate-700 bg-slate-900'
          }`}
        >
          <div
            className={`mt-[1px] h-4 w-4 rounded-full transition-all ${
              kaizoOnly
                ? 'translate-x-[18px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                : 'translate-x-[1px] bg-slate-600'
            }`}
          />
        </div>
      </button>
    </div>
  );
}

export default function PokedexPage(): React.ReactElement {
  const [selectedType, setSelectedType] = useState<string>('全部属性');
  const [kaizoOnly, setKaizoOnly] = useState<boolean>(true);

  const filteredEntries = useMemo(() => {
    return pokedexEntries.filter((entry) => {
      const typeMatch =
        selectedType === '全部属性' || entry.types.includes(selectedType);
      const kaizoMatch = !kaizoOnly || entry.hasKaizoRevision;
      return typeMatch && kaizoMatch;
    });
  }, [kaizoOnly, selectedType]);

  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="title-strong text-4xl text-emerald-300 md:text-5xl">全图鉴战术索引</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            以 Kaizo 环境威胁评估为核心的战术图鉴面板。筛选属性后可快速锁定关键目标，并优先查看已确认改动单位。
          </p>
        </section>

        <FilterBar
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          kaizoOnly={kaizoOnly}
          onKaizoToggle={setKaizoOnly}
        />

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/35"
            >
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-emerald-500/12 via-transparent to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-3">
                  <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/70">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    战术威胁等级
                  </div>
                  <div className="font-mono text-2xl font-black text-white">
                    T-{entry.threatScore}
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-white">{entry.name}</h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {entry.enName}
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-1 font-mono text-[9px] uppercase text-emerald-300/70">
                  {entry.trainer}
                </span>
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
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {entry.role}
                </p>
                <p className="line-clamp-2 text-xs leading-5 text-slate-400">{entry.note}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
