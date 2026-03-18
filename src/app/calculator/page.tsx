'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Shield, Swords, Target } from 'lucide-react';
import IntelSelector from '@/components/calculator/IntelSelector';
import { GYM_MOVE_INTEL, getGymMoveIntelByName } from '@/data/gymMoveIntel';
import { trainersData } from '@/data/trainers';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import type { TrainerIntelProfile, TrainerPokemonIntel } from '@/types';
import type { DamageCalcInput, FieldType, WeatherType } from '@/types/damage';

type MoveOption = {
  value: string;
  label: string;
  category: 'physical' | 'special' | 'status';
  power: number;
  type: string;
};

type CombatantPreset = {
  id: string;
  trainerId: string;
  trainerName: string;
  name: string;
  enName: string;
  role: string;
  specialty: string;
  level: number;
  hp: number;
  atk: number;
  def: number;
  spA: number;
  spD: number;
  ability: string;
  item: string;
  nature: string;
  searchKey: string;
  moves: MoveOption[];
};

type AttackerState = {
  presetId: string;
  level: number;
  atk: number;
  spA: number;
  ability: string;
  item: string;
  nature: string;
  move: string;
};

type DefenderState = {
  presetId: string;
  level: number;
  hp: number;
  def: number;
  spD: number;
  ability: string;
  item: string;
  nature: string;
};

const GYM_KEY_MAP: Record<string, keyof typeof GYM_MOVE_INTEL.gym_leaders> = {
  roark: 'Roark',
  gardenia: 'Gardenia',
  maylene: 'Maylene',
  wake: 'Wake',
};

const CORE_MOVE_OVERRIDE_MAP: Record<string, keyof typeof GYM_MOVE_INTEL.gym_leaders> = {
  'roark-cranidos': 'Roark',
  'gardenia-roserade': 'Gardenia',
  'maylene-lucario': 'Maylene',
  'wake-gyarados': 'Wake',
};

const WEATHER_OPTIONS: Array<{ label: string; value: WeatherType }> = [
  { label: '无天气', value: 'null' },
  { label: '晴天', value: 'sun' },
  { label: '下雨', value: 'rain' },
  { label: '沙暴', value: 'sandstorm' },
  { label: '冰雹', value: 'hail' },
];

const FIELD_OPTIONS: Array<{ label: string; value: FieldType }> = [
  { label: '无场地', value: 'null' },
  { label: '青草场地', value: 'grassy' },
  { label: '电气场地', value: 'electric' },
  { label: '精神场地', value: 'psychic' },
  { label: '薄雾场地', value: 'misty' },
];

const STATUS_MOVE_LABELS = ['龙之舞', '剑舞', '隐形岩', '毒菱', '蘑菇孢子', '寄生种子', '大晴天'];

const KO_LABEL_MAP: Record<string, string> = {
  OHKO: '确一 (OHKO)',
  '2HKO': '确二 (2HKO)',
  '3HKO': '确三 (3HKO)',
  '4HKO': '确四 (4HKO)',
  survives: '暂不构成稳定击杀',
};

function mapMoveCategory(move: {
  category?: string;
  name?: string;
  label?: string;
}): 'physical' | 'special' | 'status' {
  if (move.category === 'Status') return 'status';
  if (move.category === 'Special') return 'special';
  if (move.category === 'Physical') return 'physical';

  const label = `${move.label || ''}${move.name || ''}`;
  return STATUS_MOVE_LABELS.some((keyword) => label.includes(keyword)) ? 'status' : 'physical';
}

function createOverrideMoves(
  leaderKey: keyof typeof GYM_MOVE_INTEL.gym_leaders
): MoveOption[] {
  return GYM_MOVE_INTEL.gym_leaders[leaderKey].core_moves.map((move) => ({
    value: move.name,
    label: move.label || move.name,
    category: mapMoveCategory(move),
    power: move.power,
    type: move.type,
  }));
}

function createDefaultMoves(pokemon: TrainerPokemonIntel): MoveOption[] {
  return pokemon.moves.map((move) => {
    const intel = getGymMoveIntelByName(move);
    return {
      value: intel?.name || move,
      label: intel?.label || move,
      category: mapMoveCategory(intel || { name: move }),
      power: intel?.power ?? 100,
      type: intel?.type ?? 'Normal',
    };
  });
}

function createCombatantPresets(data: TrainerIntelProfile[]): CombatantPreset[] {
  return data.flatMap((trainer) =>
    trainer.pokemon.map((pokemon) => {
      const overrideLeader = CORE_MOVE_OVERRIDE_MAP[pokemon.id];
      const moves = overrideLeader
        ? createOverrideMoves(overrideLeader)
        : createDefaultMoves(pokemon);

      return {
        id: pokemon.id,
        trainerId: trainer.id,
        trainerName: trainer.name,
        name: pokemon.name,
        enName: pokemon.enName,
        role: pokemon.role,
        specialty: trainer.specialty,
        level: Number(pokemon.level.replace(/[^\d]/g, '')) || 100,
        hp: pokemon.stats.hp,
        atk: pokemon.stats.atk,
        def: pokemon.stats.def,
        spA: pokemon.stats.spA,
        spD: pokemon.stats.spD,
        ability: pokemon.ability,
        item: pokemon.item,
        nature: pokemon.nature,
        searchKey: `${pokemon.name} ${pokemon.enName} ${trainer.name} ${trainer.specialty} ${trainer.id}`.toLowerCase(),
        moves,
      };
    })
  );
}

const COMBATANT_PRESETS = createCombatantPresets(trainersData);

function getPreset(presetId: string): CombatantPreset {
  return COMBATANT_PRESETS.find((preset) => preset.id === presetId) ?? COMBATANT_PRESETS[0];
}

function getDamageGradient(min: number, max: number): string {
  if (max >= 100) {
    return 'linear-gradient(90deg, #22c55e 0%, #f59e0b 45%, #ef4444 100%)';
  }
  if (max >= 75) {
    return 'linear-gradient(90deg, #22c55e 0%, #f59e0b 70%, #f97316 100%)';
  }
  return 'linear-gradient(90deg, #22c55e 0%, #84cc16 50%, #facc15 100%)';
}

function getBarColor(value: number): string {
  if (value < 50) return 'bg-emerald-500';
  if (value < 100) return 'bg-orange-500';
  return 'bg-red-600 animate-pulse';
}

function getKoDisplay(result: ReturnType<typeof useKaizoCalc>['result']): string {
  if (!result) {
    return '等待演算结果';
  }

  if (result.ko === '2HKO' && result.minDamagePercent < 50) {
    return '确二 (2HKO) 且需隐形岩伤害';
  }

  return KO_LABEL_MAP[result.ko] || result.ko;
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
}): React.ReactElement {
  const border = accent === 'cyan' ? 'focus:border-cyan-300 border-cyan-500/20' : 'focus:border-red-300 border-red-500/20';

  return (
    <label className="space-y-2">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-black/40 px-3 py-2 font-mono text-sm text-slate-100 outline-none ${border}`}
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
}): React.ReactElement {
  const border = accent === 'cyan' ? 'focus:border-cyan-300 border-cyan-500/20' : 'focus:border-red-300 border-red-500/20';

  return (
    <label className="space-y-2">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-black/40 px-3 py-2 font-mono text-sm text-slate-100 outline-none ${border}`}
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

function DamageResultBar({
  min,
  max,
}: {
  min: number;
  max: number;
}): React.ReactElement {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_0_26px_rgba(14,165,233,0.08)]">
      <div className="flex items-end justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
          Calculated_Damage
        </span>
        <div className="font-mono text-4xl font-black italic text-white md:text-5xl">
          {min.toFixed(1)}%
          <span className="px-2 text-xl text-slate-600">-</span>
          {max.toFixed(1)}%
        </div>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(min, 100)}%` }}
          className={`absolute left-0 top-0 h-full opacity-50 ${getBarColor(min)}`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(max, 100)}%` }}
          className="absolute left-0 top-0 h-full"
          style={{ background: getDamageGradient(min, max) }}
        />
        <div className="absolute right-0 top-0 h-full w-px bg-red-500 shadow-[0_0_10px_red]" />
      </div>

      <div className="flex justify-between font-mono text-[10px] text-slate-500">
        <span>0% (SAFE)</span>
        <span className="text-red-500">100% (LETHAL)</span>
      </div>
    </div>
  );
}

export default function DamageCalculatorPage(): React.ReactElement {
  const { result, isLoading, error, calculate } = useKaizoCalc();

  const [attackerSearch, setAttackerSearch] = useState('');
  const [defenderSearch, setDefenderSearch] = useState('');
  const deferredAttackerSearch = useDeferredValue(attackerSearch);
  const deferredDefenderSearch = useDeferredValue(defenderSearch);

  const defaultAttacker = getPreset('roark-cranidos');
  const defaultDefender = getPreset('wake-gyarados');

  const [attacker, setAttacker] = useState<AttackerState>({
    presetId: defaultAttacker.id,
    level: defaultAttacker.level,
    atk: defaultAttacker.atk,
    spA: defaultAttacker.spA,
    ability: defaultAttacker.ability,
    item: defaultAttacker.item,
    nature: defaultAttacker.nature,
    move: defaultAttacker.moves[0]?.value ?? '',
  });

  const [defender, setDefender] = useState<DefenderState>({
    presetId: defaultDefender.id,
    level: defaultDefender.level,
    hp: defaultDefender.hp,
    def: defaultDefender.def,
    spD: defaultDefender.spD,
    ability: defaultDefender.ability,
    item: defaultDefender.item,
    nature: defaultDefender.nature,
  });

  const [battle, setBattle] = useState({
    weather: 'null' as WeatherType,
    field: 'null' as FieldType,
  });

  const selectedAttackerPreset = useMemo(() => getPreset(attacker.presetId), [attacker.presetId]);
  const selectedDefenderPreset = useMemo(() => getPreset(defender.presetId), [defender.presetId]);

  const attackerOptions = useMemo(() => {
    const query = deferredAttackerSearch.trim().toLowerCase();
    return COMBATANT_PRESETS.filter((preset) => !query || preset.searchKey.includes(query)).map((preset) => ({
      id: preset.id,
      name: preset.name,
      subtitle: `${preset.trainerName} / ${preset.role}`,
      meta: preset.specialty,
    }));
  }, [deferredAttackerSearch]);

  const defenderOptions = useMemo(() => {
    const query = deferredDefenderSearch.trim().toLowerCase();
    return COMBATANT_PRESETS.filter((preset) => !query || preset.searchKey.includes(query)).map((preset) => ({
      id: preset.id,
      name: preset.name,
      subtitle: `${preset.trainerName} / ${preset.role}`,
      meta: preset.specialty,
    }));
  }, [deferredDefenderSearch]);

  const currentMove = useMemo(
    () =>
      selectedAttackerPreset.moves.find((move) => move.value === attacker.move) ??
      selectedAttackerPreset.moves[0],
    [attacker.move, selectedAttackerPreset.moves]
  );

  const mappedMoveIntel = useMemo(
    () => getGymMoveIntelByName(attacker.move),
    [attacker.move]
  );

  const calculateInput = useMemo<DamageCalcInput>(
    () => ({
      attacker: {
        name: selectedAttackerPreset.name,
        level: attacker.level,
        atk: attacker.atk,
        spA: attacker.spA,
        ability: attacker.ability,
        item: attacker.item,
        nature: attacker.nature,
        move: attacker.move,
        boosts: {},
      },
      defender: {
        name: selectedDefenderPreset.name,
        level: defender.level,
        def: defender.def,
        spD: defender.spD,
        ability: defender.ability,
        item: defender.item,
        hp: defender.hp,
        boosts: {},
      },
      weather: battle.weather !== 'null' ? battle.weather : undefined,
      field: battle.field !== 'null' ? battle.field : undefined,
      kaizoRules: {
        modifiers: [],
        enableAllModifiers: false,
      },
    }),
    [attacker, battle.field, battle.weather, defender, selectedAttackerPreset.name, selectedDefenderPreset.name]
  );

  useEffect(() => {
    let canceled = false;

    const run = async (): Promise<void> => {
      try {
        await calculate(calculateInput);
      } catch {
        if (canceled) return;
      }
    };

    void run();

    return () => {
      canceled = true;
    };
  }, [calculate, calculateInput]);

  const handleAttackerSelect = (presetId: string): void => {
    const preset = getPreset(presetId);
    setAttacker({
      presetId: preset.id,
      level: preset.level,
      atk: preset.atk,
      spA: preset.spA,
      ability: preset.ability,
      item: preset.item,
      nature: preset.nature,
      move: preset.moves[0]?.value ?? '',
    });
  };

  const handleDefenderSelect = (presetId: string): void => {
    const preset = getPreset(presetId);
    setDefender({
      presetId: preset.id,
      level: preset.level,
      hp: preset.hp,
      def: preset.def,
      spD: preset.spD,
      ability: preset.ability,
      item: preset.item,
      nature: preset.nature,
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,47,73,0.35),transparent_25%),linear-gradient(180deg,#020617_0%,#04111d_38%,#020617_100%)] px-4 py-6 text-slate-100 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-cyan-500/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.32em] text-cyan-400/80">
              Ballistic Calculation Console
            </p>
            <h1 className="title-strong text-4xl text-white md:text-5xl">精密弹道伤害计算</h1>
            <p className="mt-2 text-sm text-slate-400">
              以馆主战术情报为底板的实时伤害演算中枢，输入变更后中枢自动刷新。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Sync Status
            </p>
            <p className="mt-1 font-mono text-sm text-cyan-300">
              {isLoading ? 'LIVE_RECALCULATING' : 'LOCKED_ON_TARGET'}
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_1.15fr_1.05fr]">
          <IntelSelector
            side="attacker"
            title="Attacker Intel"
            searchValue={attackerSearch}
            onSearchChange={setAttackerSearch}
            options={attackerOptions}
            selectedId={attacker.presetId}
            onSelect={handleAttackerSelect}
            levelValue={attacker.level}
            effortValue={252}
          >
            <div className="grid grid-cols-2 gap-3">
              <PanelInput
                label="等级"
                type="number"
                value={attacker.level}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, level: Math.max(1, Number(value) || 1) }))
                }
                accent="cyan"
              />
              <PanelSelect
                label="招式"
                value={attacker.move}
                onChange={(value) => setAttacker((prev) => ({ ...prev, move: value }))}
                accent="cyan"
                options={selectedAttackerPreset.moves.map((move) => ({
                  value: move.value,
                  label: `${move.label} / ${move.power} BP`,
                }))}
              />
              <PanelInput
                label="攻击"
                type="number"
                value={attacker.atk}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, atk: Math.max(1, Number(value) || 1) }))
                }
                accent="cyan"
              />
              <PanelInput
                label="特攻"
                type="number"
                value={attacker.spA}
                onChange={(value) =>
                  setAttacker((prev) => ({ ...prev, spA: Math.max(1, Number(value) || 1) }))
                }
                accent="cyan"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <PanelInput
                label="特性"
                value={attacker.ability}
                onChange={(value) => setAttacker((prev) => ({ ...prev, ability: value }))}
                accent="cyan"
              />
              <PanelInput
                label="道具"
                value={attacker.item}
                onChange={(value) => setAttacker((prev) => ({ ...prev, item: value }))}
                accent="cyan"
              />
              <PanelInput
                label="性格"
                value={attacker.nature}
                onChange={(value) => setAttacker((prev) => ({ ...prev, nature: value }))}
                accent="cyan"
              />
            </div>
          </IntelSelector>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Damage Output
                </p>
                <h2 className="text-xl font-bold text-white">中央伤害演算区</h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${result?.minDamagePercent ?? 0}-${result?.maxDamagePercent ?? 0}-${attacker.move}-${defender.hp}-${battle.weather}-${battle.field}`}
                initial={{ opacity: 0.4, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.25, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5"
              >
                <DamageResultBar
                  min={result?.minDamagePercent ?? 0}
                  max={result?.maxDamagePercent ?? 0}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-500/15 bg-slate-950/75 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      击杀概率
                    </p>
                    <p className="mt-3 text-2xl font-black text-white">{getKoDisplay(result)}</p>
                    <p className="mt-2 font-mono text-xs text-cyan-300">
                      OHKO {result?.ohkoPercent.toFixed(1) ?? '0.0'}% / 2HKO {result?.twoHkoPercent.toFixed(1) ?? '0.0'}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-500/15 bg-slate-950/75 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      威力映射
                    </p>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {mappedMoveIntel?.power ?? currentMove?.power ?? 100} BP
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {currentMove?.label || attacker.move}
                      <span className="font-mono text-red-300"> / {mappedMoveIntel?.type || currentMove?.type || 'Normal'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      绝对伤害值
                    </p>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {result?.minDamage ?? 0} - {result?.maxDamage ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      目标体力 <span className="font-mono text-red-300">{defender.hp}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      环境修正
                    </p>
                    <div className="mt-3 grid gap-3">
                      <PanelSelect
                        label="天气"
                        value={battle.weather}
                        onChange={(value) =>
                          setBattle((prev) => ({ ...prev, weather: value as WeatherType }))
                        }
                        options={WEATHER_OPTIONS}
                        accent="cyan"
                      />
                      <PanelSelect
                        label="场地"
                        value={battle.field}
                        onChange={(value) =>
                          setBattle((prev) => ({ ...prev, field: value as FieldType }))
                        }
                        options={FIELD_OPTIONS}
                        accent="cyan"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                  <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Crosshair className="h-20 w-20 text-cyan-300" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    交战摘要
                  </p>
                  {error ? (
                    <p className="mt-3 text-sm text-red-300">计算失败：{error}</p>
                  ) : (
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      <p>
                        进攻方：<span className="font-mono text-cyan-300">{selectedAttackerPreset.name}</span>
                      </p>
                      <p>
                        防守方：<span className="font-mono text-red-300">{selectedDefenderPreset.name}</span>
                      </p>
                      <p>
                        预估剩余体力：<span className="font-mono text-white">{result?.survivingHPPercent?.toFixed(1) ?? '0.0'}%</span>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          <IntelSelector
            side="defender"
            title="Defender Intel"
            searchValue={defenderSearch}
            onSearchChange={setDefenderSearch}
            options={defenderOptions}
            selectedId={defender.presetId}
            onSelect={handleDefenderSelect}
            levelValue={defender.level}
            effortValue={252}
          >
            <div className="grid grid-cols-2 gap-3">
              <PanelInput
                label="等级"
                type="number"
                value={defender.level}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, level: Math.max(1, Number(value) || 1) }))
                }
                accent="red"
              />
              <PanelInput
                label="体力"
                type="number"
                value={defender.hp}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, hp: Math.max(1, Number(value) || 1) }))
                }
                accent="red"
              />
              <PanelInput
                label="防御"
                type="number"
                value={defender.def}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, def: Math.max(1, Number(value) || 1) }))
                }
                accent="red"
              />
              <PanelInput
                label="特防"
                type="number"
                value={defender.spD}
                onChange={(value) =>
                  setDefender((prev) => ({ ...prev, spD: Math.max(1, Number(value) || 1) }))
                }
                accent="red"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <PanelInput
                label="特性"
                value={defender.ability}
                onChange={(value) => setDefender((prev) => ({ ...prev, ability: value }))}
                accent="red"
              />
              <PanelInput
                label="道具"
                value={defender.item}
                onChange={(value) => setDefender((prev) => ({ ...prev, item: value }))}
                accent="red"
              />
              <PanelInput
                label="性格"
                value={defender.nature}
                onChange={(value) => setDefender((prev) => ({ ...prev, nature: value }))}
                accent="red"
              />
            </div>
          </IntelSelector>
        </div>
      </div>
    </main>
  );
}
