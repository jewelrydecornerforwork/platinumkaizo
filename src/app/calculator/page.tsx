'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Radar, ShieldAlert, Swords, Target } from 'lucide-react';
import { DamageRolls } from '@/components/calc/DamageRolls';
import { TypeIcon } from '@/components/calc/TypeIcon';
import IntelSelector from '@/components/calculator/IntelSelector';
import { StatAdjuster } from '@/components/StatAdjuster';
import { TYPE_CHART } from '@/constants/typeChart';
import { GYM_MOVE_INTEL, getGymMoveIntelByName } from '@/data/gymMoveIntel';
import { trainersData } from '@/data/trainers';
import { usePokemonCalc } from '@/hooks/usePokemonCalc';

type MoveOption = {
  value: string;
  label: string;
  power: number;
  type: string;
  category: 'physical' | 'special' | 'status';
};

type CombatPreset = {
  id: string;
  trainerId: string;
  trainerCode: string;
  trainerName: string;
  name: string;
  enName: string;
  role: string;
  level: number;
  item: string;
  ability: string;
  nature: string;
  types: string[];
  stats: {
    hp: number;
    atk: number;
    def: number;
    spA: number;
    spD: number;
    spe: number;
  };
  moves: MoveOption[];
  searchKey: string;
};

const TRAINER_LABELS: Record<string, string> = {
  roark: '瓢太',
  gardenia: '菜种',
  maylene: '阿李',
  wake: '吉宪',
};

const GYM_KEY_MAP: Record<string, keyof typeof GYM_MOVE_INTEL.gym_leaders> = {
  roark: 'Roark',
  gardenia: 'Gardenia',
  maylene: 'Maylene',
  wake: 'Wake',
};

const POKEMON_LABELS: Record<string, string> = {
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

const POKEMON_TYPE_MAP: Record<string, string[]> = {
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

const MOVE_LABELS: Record<string, string> = {
  'Head Smash': '双刃头槌',
  'Rock Slide': '岩崩',
  'Stealth Rock': '隐形岩',
  'Leaf Storm': '飞叶风暴',
  'Sludge Bomb': '污泥炸弹',
  'Giga Drain': '亿万吸取',
  'Close Combat': '近身战',
  'Aura Sphere': '波导弹',
  'Drain Punch': '吸取拳',
  Waterfall: '攀瀑',
  'Ice Fang': '冰冻牙',
  'Dragon Dance': '龙之舞',
};

const DEFAULT_PROFILE: Record<
  string,
  {
    ability: string;
    item: string;
    nature: string;
  }
> = {
  roark: { ability: 'Mold Breaker', item: 'Life Orb', nature: 'Adamant' },
  gardenia: { ability: 'Technician', item: 'Black Sludge', nature: 'Modest' },
  maylene: { ability: 'Adaptability', item: 'Life Orb', nature: 'Adamant' },
  wake: { ability: 'Intimidate', item: 'Leftovers', nature: 'Jolly' },
};

function getMoveCategory(
  category?: string
): 'physical' | 'special' | 'status' {
  if (category === 'Special') return 'special';
  if (category === 'Status') return 'status';
  return 'physical';
}

function getPresetMoveOptions(trainerId: string): MoveOption[] {
  const gymKey = GYM_KEY_MAP[trainerId];

  return GYM_MOVE_INTEL.gym_leaders[gymKey].core_moves.map((move) => ({
    value: move.name,
    label: MOVE_LABELS[move.name] || move.name,
    power: move.power,
    type: move.type,
    category: getMoveCategory(move.category),
  }));
}

function buildPresets(): CombatPreset[] {
  return trainersData.flatMap((trainer) =>
    trainer.pokemon.map((pokemon) => {
      const profile = DEFAULT_PROFILE[trainer.id];
      const displayName = POKEMON_LABELS[pokemon.enName] || pokemon.enName;
      const trainerName = TRAINER_LABELS[trainer.id] || trainer.id;

      return {
        id: pokemon.id,
        trainerId: trainer.id,
        trainerCode: trainer.code,
        trainerName,
        name: displayName,
        enName: pokemon.enName,
        role: pokemon.role || '战术位',
        level: Number(pokemon.level.replace(/[^\d]/g, '')) || 100,
        item: profile.item,
        ability: profile.ability,
        nature: profile.nature,
        types: POKEMON_TYPE_MAP[pokemon.enName] || ['Normal'],
        stats: pokemon.stats,
        moves: getPresetMoveOptions(trainer.id),
        searchKey: `${displayName} ${pokemon.enName} ${trainerName} ${trainer.code}`.toLowerCase(),
      };
    })
  );
}

const PRESETS = buildPresets();

function getPreset(presetId: string): CombatPreset {
  return PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
}

function getEffectiveness(moveType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce(
    (multiplier, type) => multiplier * (TYPE_CHART[moveType]?.[type] ?? 1),
    1
  );
}

function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return '无效';
  if (multiplier >= 4) return '四倍克制';
  if (multiplier >= 2) return '效果拔群';
  if (multiplier <= 0.25) return '极度受阻';
  if (multiplier < 1) return '效果不佳';
  return '标准命中';
}

function getDamageGradient(min: number, max: number): string {
  if (max >= 100) {
    return 'linear-gradient(90deg, #22c55e 0%, #f59e0b 42%, #ef4444 100%)';
  }
  if (max >= 70) {
    return 'linear-gradient(90deg, #10b981 0%, #eab308 68%, #f97316 100%)';
  }
  return 'linear-gradient(90deg, #10b981 0%, #84cc16 58%, #eab308 100%)';
}

function getKoDisplay(koText: string | undefined): string {
  if (!koText) return '等待演算数据';
  if (koText.includes('OHKO')) return '确一 (OHKO)';
  if (koText.includes('2HKO')) return koText.includes('Stealth Rock') ? '确二 (2HKO) 且需隐形岩辅助' : '确二 (2HKO)';
  if (koText.includes('3HKO')) return '确三 (3HKO)';
  if (koText.includes('4HKO')) return '确四 (4HKO)';
  if (koText.includes('变化招式')) return '变化招式，不直接造成伤害';
  return '暂不构成稳定击杀';
}

function createDamageRolls(min: number, max: number): Array<{ factor: number; value: number }> {
  const factors = Array.from({ length: 16 }, (_, index) => 85 + index);
  const spread = max - min;

  if (spread <= 0) {
    return factors.map((factor) => ({ factor, value: Number(max.toFixed(1)) }));
  }

  return factors.map((factor, index) => ({
    factor,
    value: Number((min + (spread * index) / 15).toFixed(1)),
  }));
}

function PanelInput({
  label,
  value,
  onChange,
  accent,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  accent: 'cyan' | 'red';
  type?: 'text' | 'number';
}) {
  const border =
    accent === 'cyan'
      ? 'border-cyan-500/20 focus:border-cyan-300'
      : 'border-red-500/20 focus:border-red-300';

  return (
    <label className="space-y-2">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-black/40 px-3 py-2.5 font-mono text-sm text-slate-100 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] ${border}`}
      />
    </label>
  );
}

function PanelSelect({
  label,
  value,
  onChange,
  options,
  accent,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  accent: 'cyan' | 'red';
}) {
  const border =
    accent === 'cyan'
      ? 'border-cyan-500/20 focus:border-cyan-300'
      : 'border-red-500/20 focus:border-red-300';

  return (
    <label className="space-y-2">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-black/40 px-3 py-2.5 font-mono text-sm text-slate-100 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] ${border}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DamageResultBar({ min, max }: { min: number; max: number }) {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-slate-700/80 bg-slate-900/55 p-6 backdrop-blur-xl shadow-[0_24px_60px_rgba(2,6,23,0.55)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">
            Ballistic_Output
          </p>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-slate-400">
            实时伤害区间
          </p>
        </div>
        <div className="font-mono text-[2.4rem] font-black leading-none tracking-[0.08em] text-white drop-shadow-[0_0_18px_rgba(226,232,240,0.15)] md:text-[4.25rem]">
          <span className="inline-block text-cyan-100 [text-shadow:0_0_8px_rgba(34,211,238,0.25),0_0_18px_rgba(255,255,255,0.12)]">
            {min.toFixed(1)}%
          </span>
          <span className="px-2 text-xl text-slate-600 md:text-3xl">-</span>
          <span className="inline-block text-slate-100 [text-shadow:0_0_8px_rgba(248,250,252,0.22),0_0_18px_rgba(255,255,255,0.12)]">
            {max.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-4 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(max, 100)}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-full"
          style={{ background: getDamageGradient(min, max) }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(min, 100)}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-full bg-white/15"
        />
        <div className="absolute right-0 top-0 h-full w-px bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
      </div>

      <div className="flex justify-between font-mono text-[10px] text-slate-500">
        <span>0% / SAFE</span>
        <span className="text-red-400">100% / LETHAL</span>
      </div>
    </div>
  );
}

export default function DamageCalculatorPage() {
  const { attacker, setAttacker, defender, setDefender, move, setMove, result } =
    usePokemonCalc();

  const [attackerSearch, setAttackerSearch] = useState('');
  const [defenderSearch, setDefenderSearch] = useState('');
  const [activeAttackerId, setActiveAttackerId] = useState('roark-cranidos');
  const [activeDefenderId, setActiveDefenderId] = useState('wake-gyarados');

  const deferredAttackerSearch = useDeferredValue(attackerSearch);
  const deferredDefenderSearch = useDeferredValue(defenderSearch);

  const selectedAttackerPreset = useMemo(
    () => getPreset(activeAttackerId),
    [activeAttackerId]
  );
  const selectedDefenderPreset = useMemo(
    () => getPreset(activeDefenderId),
    [activeDefenderId]
  );

  const attackerOptions = useMemo(() => {
    const query = deferredAttackerSearch.trim().toLowerCase();
    return PRESETS.filter(
      (preset) => !query || preset.searchKey.includes(query)
    ).map((preset) => ({
      id: preset.id,
      name: preset.name,
      subtitle: `${preset.trainerName} / ${preset.enName}`,
      meta: `LV.${preset.level}`,
    }));
  }, [deferredAttackerSearch]);

  const defenderOptions = useMemo(() => {
    const query = deferredDefenderSearch.trim().toLowerCase();
    return PRESETS.filter(
      (preset) => !query || preset.searchKey.includes(query)
    ).map((preset) => ({
      id: preset.id,
      name: preset.name,
      subtitle: `${preset.trainerName} / ${preset.enName}`,
      meta: `LV.${preset.level}`,
    }));
  }, [deferredDefenderSearch]);

  const currentMoveOptions = selectedAttackerPreset.moves;
  const currentMove = useMemo(
    () =>
      currentMoveOptions.find((option) => option.value === move) ||
      currentMoveOptions[0],
    [currentMoveOptions, move]
  );
  const mappedMoveIntel = useMemo(() => getGymMoveIntelByName(move), [move]);

  const minDamage = result?.range[0] ?? 0;
  const maxDamage = result?.range[1] ?? 0;
  const damageRolls = useMemo(
    () => createDamageRolls(minDamage, maxDamage),
    [minDamage, maxDamage]
  );
  const koDisplay = useMemo(() => getKoDisplay(result?.ko), [result?.ko]);
  const isOhko = koDisplay.includes('确一');
  const offenseStatLabel = currentMove?.category === 'special' ? '特攻轴' : '攻击轴';
  const offenseStatValue =
    currentMove?.category === 'special'
      ? selectedAttackerPreset.stats.spA
      : selectedAttackerPreset.stats.atk;
  const defenseStatLabel = currentMove?.category === 'special' ? '特防甲' : '物防甲';
  const defenseStatValue =
    currentMove?.category === 'special'
      ? selectedDefenderPreset.stats.spD
      : selectedDefenderPreset.stats.def;

  const effectiveness = useMemo(() => {
    const moveType = mappedMoveIntel?.type || currentMove?.type || 'Normal';
    return getEffectiveness(moveType, selectedDefenderPreset.types);
  }, [currentMove?.type, mappedMoveIntel?.type, selectedDefenderPreset.types]);

  const applyAttackerPreset = (presetId: string) => {
    const preset = getPreset(presetId);
    setActiveAttackerId(presetId);
    setAttacker({
      name: preset.enName,
      level: preset.level,
      evs: { atk: 252, spA: 252, spe: 252 },
      ivs: { atk: 31, spA: 31, spe: 31 },
      item: preset.item,
      nature: preset.nature,
      ability: preset.ability,
    });
    setMove(preset.moves[0]?.value || 'Earthquake');
  };

  const applyDefenderPreset = (presetId: string) => {
    const preset = getPreset(presetId);
    setActiveDefenderId(presetId);
    setDefender({
      name: preset.enName,
      level: preset.level,
      evs: { hp: 252, def: 252, spD: 252 },
      ivs: { hp: 31, def: 31, spD: 31 },
      item: preset.item,
      nature: 'Bold',
      ability: preset.ability,
    });
  };

  useEffect(() => {
    const initialAttacker = getPreset('roark-cranidos');
    const initialDefender = getPreset('wake-gyarados');

    setActiveAttackerId(initialAttacker.id);
    setAttacker({
      name: initialAttacker.enName,
      level: initialAttacker.level,
      evs: { atk: 252, spA: 252, spe: 252 },
      ivs: { atk: 31, spA: 31, spe: 31 },
      item: initialAttacker.item,
      nature: initialAttacker.nature,
      ability: initialAttacker.ability,
    });
    setMove(initialAttacker.moves[0]?.value || 'Earthquake');

    setActiveDefenderId(initialDefender.id);
    setDefender({
      name: initialDefender.enName,
      level: initialDefender.level,
      evs: { hp: 252, def: 252, spD: 252 },
      ivs: { hp: 31, def: 31, spD: 31 },
      item: initialDefender.item,
      nature: 'Bold',
      ability: initialDefender.ability,
    });
  }, [setAttacker, setDefender, setMove]);

  const scrollToResult = () => {
    document.getElementById('damage-result-panel')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(239,68,68,0.1),transparent_22%),linear-gradient(180deg,#020617_0%,#04111d_40%,#020617_100%)] px-4 py-6 pb-24 text-slate-100 md:px-8 lg:px-10 lg:pb-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(51,65,85,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.14)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div
          className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          animate={{ y: ['0%', '100vh'] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-cyan-500/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.32em] text-cyan-400/80">
              Precision Damage Console
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              精密伤害演算中枢
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              基于 Platinum Kaizo 战术情报构建的实时演算界面。修改等级、努力值、招式后，中央结果面板会自动刷新。
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Console_Status
            </p>
            <p className="mt-1 font-mono text-sm text-cyan-300">
              {result ? 'LIVE_FEED_ACTIVE' : 'SYNCING_PARAMETERS'}
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.15fr_1.05fr]">
          <IntelSelector
            side="attacker"
            title="进攻单位情报"
            searchValue={attackerSearch}
            onSearchChange={setAttackerSearch}
            options={attackerOptions}
            selectedId={activeAttackerId}
            onSelect={applyAttackerPreset}
            levelValue={attacker.level}
            effortValue={attacker.evs.atk ?? 0}
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '攻击', value: selectedAttackerPreset.stats.atk },
                { label: '特攻', value: selectedAttackerPreset.stats.spA },
                { label: '速度', value: selectedAttackerPreset.stats.spe },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 md:hidden">
              <StatAdjuster
                label="等级"
                value={attacker.level}
                step={1}
                max={100}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, level: value }))
                }
              />
              <StatAdjuster
                label="攻击 EV"
                value={attacker.evs.atk ?? 0}
                onChange={(value) =>
                  setAttacker((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, atk: value },
                  }))
                }
              />
              <StatAdjuster
                label="特攻 EV"
                value={attacker.evs.spA ?? 0}
                onChange={(value) =>
                  setAttacker((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, spA: value },
                  }))
                }
              />
            </div>

            <div className="hidden grid-cols-2 gap-3 md:grid">
              <PanelInput
                label="等级"
                type="number"
                value={attacker.level}
                onChange={(value) =>
                  setAttacker((prev) => ({
                    ...prev,
                    level: Math.max(1, Number(value) || 1),
                  }))
                }
                accent="cyan"
              />
              <PanelSelect
                label="招式"
                value={move}
                onChange={setMove}
                accent="cyan"
                options={currentMoveOptions.map((option) => ({
                  value: option.value,
                  label: `${option.label} / ${option.power} BP`,
                }))}
              />
              <PanelInput
                label="攻击 EV"
                type="number"
                value={attacker.evs.atk ?? 0}
                onChange={(value) =>
                  setAttacker((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, atk: Math.max(0, Number(value) || 0) },
                  }))
                }
                accent="cyan"
              />
              <PanelInput
                label="特攻 EV"
                type="number"
                value={attacker.evs.spA ?? 0}
                onChange={(value) =>
                  setAttacker((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, spA: Math.max(0, Number(value) || 0) },
                  }))
                }
                accent="cyan"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <PanelInput
                label="特性"
                value={attacker.ability || ''}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, ability: value }))
                }
                accent="cyan"
              />
              <PanelInput
                label="道具"
                value={attacker.item}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, item: value }))
                }
                accent="cyan"
              />
              <PanelInput
                label="性格"
                value={attacker.nature}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, nature: value }))
                }
                accent="cyan"
              />
            </div>
          </IntelSelector>

          <section
            id="damage-result-panel"
            className="rounded-[2rem] border border-slate-800/80 bg-slate-900/45 p-5 backdrop-blur-xl shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Real_Time_Result
                </p>
                <h2 className="text-xl font-bold text-white">中央伤害演算区</h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeAttackerId}-${activeDefenderId}-${move}-${attacker.level}-${defender.level}-${attacker.evs.atk}-${attacker.evs.spA}-${defender.evs.hp}-${defender.evs.def}-${defender.evs.spD}`}
                initial={{ opacity: 0.35, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.22, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5"
              >
                <DamageResultBar min={minDamage} max={maxDamage} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.05] p-4 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(34,211,238,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                          Attack_Vector
                        </p>
                        <h3 className="mt-2 font-mono text-lg font-black uppercase text-white">
                          {currentMove?.label || move}
                        </h3>
                      </div>
                      <TypeIcon type={mappedMoveIntel?.type || currentMove?.type || 'Normal'} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          {offenseStatLabel}
                        </p>
                        <p className="mt-1 font-mono text-2xl font-black text-cyan-100">
                          {offenseStatValue}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          Base_Power
                        </p>
                        <p className="mt-1 font-mono text-2xl font-black text-white">
                          {mappedMoveIntel?.power ?? currentMove?.power ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-4 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(239,68,68,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-300/70">
                          Defense_Armor
                        </p>
                        <h3 className="mt-2 font-mono text-lg font-black uppercase text-white">
                          {selectedDefenderPreset.name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {selectedDefenderPreset.types.map((type) => (
                          <TypeIcon key={type} type={type} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          {defenseStatLabel}
                        </p>
                        <p className="mt-1 font-mono text-2xl font-black text-red-100">
                          {defenseStatValue}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          Effectiveness
                        </p>
                        <p className="mt-1 font-mono text-2xl font-black text-white">
                          {effectiveness.toFixed(2)}x
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-500/15 bg-slate-950/70 p-5 backdrop-blur-md">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      击杀概率
                    </p>
                    <p
                      className={`mt-3 font-mono text-2xl font-black uppercase tracking-[0.08em] ${
                        isOhko
                          ? 'animate-pulse text-red-300 [text-shadow:0_0_12px_rgba(248,113,113,0.7),0_0_28px_rgba(239,68,68,0.45)]'
                          : 'text-white'
                      }`}
                    >
                      {koDisplay}
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-400">
                      {result?.ko === '变化招式'
                        ? '当前招式为变化系，仅提供节奏控制。'
                        : '移动参数后将自动重新判定斩杀窗口。'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-500/15 bg-slate-950/70 p-5 backdrop-blur-md">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      威力映射
                    </p>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {mappedMoveIntel?.power ?? currentMove?.power ?? 0} BP
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-400">
                      {currentMove?.label || move}
                      <span className="font-mono text-red-300">
                        {' '}
                        / {(mappedMoveIntel?.type || currentMove?.type || 'Normal').toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        属性相性矩阵
                      </p>
                      <Radar className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {effectiveness.toFixed(2)}x
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-400">
                      {getEffectivenessLabel(effectiveness)} / 目标属性:
                      <span className="font-mono text-emerald-300">
                        {' '}
                        {selectedDefenderPreset.types.join(' / ')}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        攻防基准
                      </p>
                      <Swords className="h-4 w-4 text-cyan-300" />
                    </div>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {selectedAttackerPreset.stats.atk} / {selectedDefenderPreset.stats.def}
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-400">
                      进攻方攻击基值对位守方物防基值，适合快速判断是否需要强化。
                    </p>
                  </div>
                </div>

                <DamageRolls rolls={damageRolls} />

                <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-500/15 bg-cyan-500/5 p-5 backdrop-blur-md">
                  <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Crosshair className="h-20 w-20 text-cyan-300" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        Tactical_Readout
                      </p>
                      <p className="mt-2 font-mono text-sm leading-6 text-slate-300">
                        {result?.desc ||
                          '参数正在同步中。请选择双方单位并微调等级、努力值或招式。'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          <IntelSelector
            side="defender"
            title="防守单位情报"
            searchValue={defenderSearch}
            onSearchChange={setDefenderSearch}
            options={defenderOptions}
            selectedId={activeDefenderId}
            onSelect={applyDefenderPreset}
            levelValue={defender.level}
            effortValue={defender.evs.hp ?? 0}
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '体力', value: selectedDefenderPreset.stats.hp },
                { label: '防御', value: selectedDefenderPreset.stats.def },
                { label: '特防', value: selectedDefenderPreset.stats.spD },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 md:hidden">
              <StatAdjuster
                label="等级"
                value={defender.level}
                step={1}
                max={100}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, level: value }))
                }
              />
              <StatAdjuster
                label="体力 EV"
                value={defender.evs.hp ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, hp: value },
                  }))
                }
              />
              <StatAdjuster
                label="防御 EV"
                value={defender.evs.def ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, def: value },
                  }))
                }
              />
              <StatAdjuster
                label="特防 EV"
                value={defender.evs.spD ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, spD: value },
                  }))
                }
              />
            </div>

            <div className="hidden grid-cols-2 gap-3 md:grid">
              <PanelInput
                label="等级"
                type="number"
                value={defender.level}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    level: Math.max(1, Number(value) || 1),
                  }))
                }
                accent="red"
              />
              <PanelInput
                label="体力 EV"
                type="number"
                value={defender.evs.hp ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, hp: Math.max(0, Number(value) || 0) },
                  }))
                }
                accent="red"
              />
              <PanelInput
                label="防御 EV"
                type="number"
                value={defender.evs.def ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, def: Math.max(0, Number(value) || 0) },
                  }))
                }
                accent="red"
              />
              <PanelInput
                label="特防 EV"
                type="number"
                value={defender.evs.spD ?? 0}
                onChange={(value) =>
                  setDefender((prev) => ({
                    ...prev,
                    evs: { ...prev.evs, spD: Math.max(0, Number(value) || 0) },
                  }))
                }
                accent="red"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <PanelInput
                label="特性"
                value={defender.ability || ''}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, ability: value }))
                }
                accent="red"
              />
              <PanelInput
                label="道具"
                value={defender.item}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, item: value }))
                }
                accent="red"
              />
              <PanelInput
                label="性格"
                value={defender.nature}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, nature: value }))
                }
                accent="red"
              />
            </div>
          </IntelSelector>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 h-[60px] border-t border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
              Live_Damage_Bar
            </p>
            <p className="truncate font-mono text-sm font-bold text-white">
              {minDamage.toFixed(1)}% - {maxDamage.toFixed(1)}%
              <span className="ml-2 text-xs text-cyan-300">
                {getKoDisplay(result?.ko)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToResult}
            className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 font-mono text-xs font-bold tracking-[0.24em] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(34,211,238,0.12)] transition-all active:scale-95"
          >
            一键演算
          </button>
        </div>
      </div>
    </main>
  );
}
