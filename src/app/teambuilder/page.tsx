'use client';

import { useMemo, useState } from 'react';
import { Search, ShieldCheck, Sparkles, Swords } from 'lucide-react';
import { TacticalFrame } from '@/components/ui/TacticalFrame';
import { SynergyMatrix } from '@/components/teambuilder/SynergyMatrix';
import { trainersData } from '@/data/trainers';

type CatalogEntry = {
  id: string;
  name: string;
  enName: string;
  trainer: string;
  role: string;
  note: string;
  tactic: string;
  types: string[];
};

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

const catalog: CatalogEntry[] = trainersData.flatMap((trainer) =>
  trainer.pokemon.map((pokemon) => ({
    id: pokemon.id,
    name: pokemonLabels[pokemon.enName] || pokemon.enName,
    enName: pokemon.enName,
    trainer: trainerLabels[trainer.id] || trainer.id,
    role: pokemon.role,
    note: pokemon.note,
    tactic: pokemon.tactic,
    types: typeMap[pokemon.enName] || ['Normal'],
  }))
);

function TeamSlot({
  index,
  member,
  onOpen,
}: {
  index: number;
  member: CatalogEntry | null;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 text-left backdrop-blur-md transition-all hover:border-emerald-500/35 hover:shadow-[0_0_18px_rgba(16,185,129,0.12)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/15 bg-black/20 font-mono text-sm font-black text-emerald-300">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="truncate text-base font-black text-white">
            {member ? member.name : '待命槽位'}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {member ? 'LOCKED' : 'EMPTY'}
          </span>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {member ? `${member.enName} / ${member.trainer}` : '点击接入战术库'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(member?.types || ['SCAN']).map((type) => (
            <span
              key={`${index}-${type}`}
              className="rounded-full border border-slate-700 bg-black/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function TeambuilderPage(): React.ReactElement {
  const [team, setTeam] = useState<Array<CatalogEntry | null>>(Array.from({ length: 6 }, () => null));
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState<string>('');

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.filter((entry) => {
      if (!normalized) return true;
      return `${entry.name} ${entry.enName} ${entry.trainer} ${entry.types.join(' ')}`.toLowerCase().includes(
        normalized
      );
    });
  }, [query]);

  const selectedCount = team.filter(Boolean).length;

  const handleSelect = (member: CatalogEntry) => {
    if (activeSlot === null) return;
    setTeam((prev) => prev.map((slot, index) => (index === activeSlot ? member : slot)));
    setActiveSlot(null);
    setQuery('');
  };

  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="title-strong text-4xl text-emerald-300 md:text-5xl">队伍构建中枢</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            横向战术条用于快速编排 6 个作战位置，下方联防矩阵会实时评估全队对 18 属性的承压能力。
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <TacticalFrame title="Team Slots">
            <div className="space-y-4">
              {team.map((member, index) => (
                <TeamSlot
                  key={`slot-${index}`}
                  index={index}
                  member={member}
                  onOpen={() => setActiveSlot(index)}
                />
              ))}
            </div>
          </TacticalFrame>

          <TacticalFrame title="Build Summary">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/65">
                  <ShieldCheck className="h-4 w-4" />
                  已锁定作战位
                </div>
                <div className="font-mono text-4xl font-black text-white">{selectedCount}/6</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/65">
                  <Sparkles className="h-4 w-4" />
                  推荐动作
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  优先补齐地面与格斗抗性，再用高速收尾位锁定残局窗口。
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/20 p-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-400/65">
                  <Swords className="h-4 w-4" />
                  战术库来源
                </div>
                <p className="font-mono text-xs leading-6 text-slate-400">
                  点击任意槽位即可从图鉴抓取可用单位，无需跳出当前构建流程。
                </p>
              </div>
            </div>
          </TacticalFrame>
        </div>

        <SynergyMatrix team={team} />

        {activeSlot !== null ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.7)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">战术库选择器</h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {`Slot ${String(activeSlot + 1).padStart(2, '0')} // Direct Dex Link`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSlot(null);
                    setQuery('');
                  }}
                  className="rounded-xl border border-slate-800 bg-black/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition-all hover:border-emerald-500/35 hover:text-emerald-300"
                >
                  关闭
                </button>
              </div>

              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-black/20 px-4 py-3">
                <Search className="h-4 w-4 text-emerald-300" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索战术单位 / 英文名 / 馆主来源"
                  className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-2 md:grid-cols-2">
                {filteredCatalog.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleSelect(entry)}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left transition-all hover:border-emerald-500/35 hover:bg-emerald-500/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-white">{entry.name}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          {entry.enName} / {entry.trainer}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {entry.types.map((type) => (
                          <span
                            key={`${entry.id}-${type}`}
                            className="rounded-full border border-slate-700 bg-black/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-400">{entry.note}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
