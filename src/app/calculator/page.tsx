'use client';

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Shield, Swords, Target } from 'lucide-react';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import type { DamageCalcInput, FieldType, WeatherType } from '@/types/damage';

type CombatantPreset = {
  id: string;
  name: string;
  enName: string;
  searchKey: string;
  role: string;
  level: number;
  hp: number;
  atk: number;
  def: number;
  spA: number;
  spD: number;
  spe: number;
  ability: string;
  item: string;
  nature: string;
  moves: Array<{
    name: string;
    category: 'physical' | 'special';
    powerHint: string;
  }>;
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

type BattleState = {
  weather: WeatherType;
  field: FieldType;
};

const COMBATANT_PRESETS: CombatantPreset[] = [
  {
    id: 'garchomp',
    name: '烈咬陆鲨',
    enName: 'Garchomp',
    searchKey: 'ljls garchomp lieyaolusha',
    role: '高速物攻压制',
    level: 80,
    hp: 289,
    atk: 244,
    def: 176,
    spA: 156,
    spD: 178,
    spe: 205,
    ability: '粗糙皮肤',
    item: '生命宝珠',
    nature: '固执',
    moves: [
      { name: '地震', category: 'physical', powerHint: '100 BP' },
      { name: '逆鳞', category: 'physical', powerHint: '120 BP' },
      { name: '尖石攻击', category: 'physical', powerHint: '100 BP' },
      { name: '火焰牙', category: 'physical', powerHint: '65 BP' },
    ],
  },
  {
    id: 'lucario',
    name: '路卡利欧',
    enName: 'Lucario',
    searchKey: 'lklo lucario lukaliou',
    role: '先制斩杀终端',
    level: 72,
    hp: 241,
    atk: 223,
    def: 156,
    spA: 206,
    spD: 156,
    spe: 177,
    ability: '适应力',
    item: '生命宝珠',
    nature: '固执',
    moves: [
      { name: '近身战', category: 'physical', powerHint: '120 BP' },
      { name: '神速', category: 'physical', powerHint: '80 BP' },
      { name: '子弹拳', category: 'physical', powerHint: '40 BP' },
      { name: '剑舞', category: 'physical', powerHint: '强化' },
    ],
  },
  {
    id: 'gyarados',
    name: '暴鲤龙',
    enName: 'Gyarados',
    searchKey: 'bll gyarados baolilong',
    role: '威吓推队核心',
    level: 74,
    hp: 284,
    atk: 228,
    def: 173,
    spA: 132,
    spD: 194,
    spe: 174,
    ability: '威吓',
    item: '吃剩的东西',
    nature: '开朗',
    moves: [
      { name: '龙之舞', category: 'physical', powerHint: '强化' },
      { name: '攀瀑', category: 'physical', powerHint: '80 BP' },
      { name: '冰冻牙', category: 'physical', powerHint: '65 BP' },
      { name: '咬碎', category: 'physical', powerHint: '80 BP' },
    ],
  },
  {
    id: 'roserade',
    name: '罗丝雷朵',
    enName: 'Roserade',
    searchKey: 'lsld roserade luosileiduo',
    role: '高速特攻爆破',
    level: 68,
    hp: 218,
    atk: 135,
    def: 146,
    spA: 234,
    spD: 205,
    spe: 189,
    ability: '技师',
    item: '达人带',
    nature: '胆小',
    moves: [
      { name: '能量球', category: 'special', powerHint: '90 BP' },
      { name: '污泥炸弹', category: 'special', powerHint: '90 BP' },
      { name: '觉醒力量火', category: 'special', powerHint: '70 BP' },
      { name: '毒菱', category: 'special', powerHint: '布场' },
    ],
  },
];

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

const KO_LABEL_MAP: Record<string, string> = {
  OHKO: '确一 (OHKO)',
  '2HKO': '确二 (2HKO)',
  '3HKO': '确三 (3HKO)',
  '4HKO': '确四 (4HKO)',
  survives: '无法稳定击杀',
};

function getPreset(presetId: string): CombatantPreset {
  return COMBATANT_PRESETS.find((preset) => preset.id === presetId) ?? COMBATANT_PRESETS[0];
}

function getBarColorClass(value: number): string {
  if (value < 50) return 'bg-emerald-500';
  if (value < 100) return 'bg-orange-500';
  return 'bg-red-600 animate-pulse';
}

function getDamageGradient(min: number, max: number): string {
  const lethal = max >= 100;
  if (lethal) {
    return 'linear-gradient(90deg, #f59e0b 0%, #ef4444 55%, #991b1b 100%)';
  }
  if (max >= 70) {
    return 'linear-gradient(90deg, #10b981 0%, #f59e0b 65%, #f97316 100%)';
  }
  return 'linear-gradient(90deg, #10b981 0%, #22c55e 60%, #84cc16 100%)';
}

function getKoDisplay(result: ReturnType<typeof useKaizoCalc>['result']): string {
  if (!result) {
    return '等待演算指令';
  }

  if (result.ko === 'OHKO') {
    return '确一 (OHKO)';
  }

  if (result.ko === '2HKO') {
    if (result.minDamagePercent < 50) {
      return '确二 (2HKO) 且需隐形岩伤害';
    }
    return '确二 (2HKO)';
  }

  return KO_LABEL_MAP[result.ko] || result.ko;
}

function SearchSelect({
  title,
  accent,
  value,
  query,
  onQueryChange,
  onChange,
  filtered,
}: {
  title: string;
  accent: 'blue' | 'red';
  value: string;
  query: string;
  onQueryChange: (value: string) => void;
  onChange: (value: string) => void;
  filtered: CombatantPreset[];
}): React.ReactElement {
  const accentClasses =
    accent === 'blue'
      ? 'border-cyan-400/20 focus:border-cyan-300 text-cyan-200'
      : 'border-red-400/20 focus:border-red-300 text-red-200';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-[0.28em] text-slate-500">{title}</label>
        <span className="font-mono text-[10px] text-slate-500">支持拼音 / 首字母检索</span>
      </div>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="输入名称、拼音或首字母"
        className={`w-full rounded-xl border bg-slate-950/70 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-600 ${accentClasses}`}
      />
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {filtered.map((preset) => {
            const active = preset.id === value;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(preset.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                  active
                    ? accent === 'blue'
                      ? 'bg-cyan-400/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]'
                      : 'bg-red-500/10 text-red-100 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{preset.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {preset.role}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{preset.level}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accent: 'blue' | 'red';
}): React.ReactElement {
  const accentClasses =
    accent === 'blue'
      ? 'border-cyan-500/20 focus:border-cyan-300'
      : 'border-red-500/20 focus:border-red-300';

  return (
    <label className="space-y-2">
      <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Math.max(1, Number(event.target.value) || 1))}
        className={`w-full rounded-xl border bg-slate-950/75 px-4 py-3 font-mono text-sm text-slate-100 outline-none ${accentClasses}`}
      />
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
  const gradient = getDamageGradient(min, max);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_0_24px_rgba(14,165,233,0.08)]">
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`absolute left-0 top-0 h-full opacity-45 ${getBarColorClass(min)}`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(max, 100)}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-full"
          style={{ background: gradient }}
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

  const [attackerQuery, setAttackerQuery] = useState('');
  const [defenderQuery, setDefenderQuery] = useState('');
  const attackerQueryDeferred = useDeferredValue(attackerQuery);
  const defenderQueryDeferred = useDeferredValue(defenderQuery);

  const attackerPreset = getPreset('garchomp');
  const defenderPreset = getPreset('gyarados');

  const [attacker, setAttacker] = useState<AttackerState>({
    presetId: attackerPreset.id,
    level: attackerPreset.level,
    atk: attackerPreset.atk,
    spA: attackerPreset.spA,
    ability: attackerPreset.ability,
    item: attackerPreset.item,
    nature: attackerPreset.nature,
    move: attackerPreset.moves[0].name,
  });

  const [defender, setDefender] = useState<DefenderState>({
    presetId: defenderPreset.id,
    level: defenderPreset.level,
    hp: defenderPreset.hp,
    def: defenderPreset.def,
    spD: defenderPreset.spD,
    ability: defenderPreset.ability,
    item: defenderPreset.item,
    nature: defenderPreset.nature,
  });

  const [battle, setBattle] = useState<BattleState>({
    weather: 'null',
    field: 'null',
  });

  const filteredAttackers = useMemo(() => {
    const query = attackerQueryDeferred.trim().toLowerCase();
    if (!query) return COMBATANT_PRESETS;
    return COMBATANT_PRESETS.filter(
      (preset) =>
        preset.name.toLowerCase().includes(query) ||
        preset.searchKey.includes(query) ||
        preset.enName.toLowerCase().includes(query)
    );
  }, [attackerQueryDeferred]);

  const filteredDefenders = useMemo(() => {
    const query = defenderQueryDeferred.trim().toLowerCase();
    if (!query) return COMBATANT_PRESETS;
    return COMBATANT_PRESETS.filter(
      (preset) =>
        preset.name.toLowerCase().includes(query) ||
        preset.searchKey.includes(query) ||
        preset.enName.toLowerCase().includes(query)
    );
  }, [defenderQueryDeferred]);

  const selectedAttackerPreset = useMemo(() => getPreset(attacker.presetId), [attacker.presetId]);
  const selectedDefenderPreset = useMemo(() => getPreset(defender.presetId), [defender.presetId]);

  const attackerMoves = selectedAttackerPreset.moves;
  const selectedMoveMeta =
    attackerMoves.find((move) => move.name === attacker.move) ?? attackerMoves[0];

  const input = useMemo<DamageCalcInput>(
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
    let active = true;

    const run = async (): Promise<void> => {
      try {
        await calculate(input);
      } catch {
        if (!active) return;
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [calculate, input]);

  const handleSelectAttacker = (presetId: string): void => {
    const preset = getPreset(presetId);
    setAttacker({
      presetId: preset.id,
      level: preset.level,
      atk: preset.atk,
      spA: preset.spA,
      ability: preset.ability,
      item: preset.item,
      nature: preset.nature,
      move: preset.moves[0].name,
    });
  };

  const handleSelectDefender = (presetId: string): void => {
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,47,73,0.35),transparent_25%),linear-gradient(180deg,#020617_0%,#04111d_40%,#020617_100%)] px-4 py-6 text-slate-100 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-cyan-500/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.32em] text-cyan-400/80">
              Ballistic Calculation Console
            </p>
            <h1 className="title-strong text-4xl text-white md:text-5xl">精密弹道伤害计算</h1>
            <p className="mt-2 text-sm text-slate-400">
              针对 Kaizo 对战环境的实时伤害演算中枢，所有数值同步刷新。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Sync Status
            </p>
            <p className="mt-1 font-mono text-sm text-cyan-300">
              {isLoading ? 'LIVE_RECACLULATING' : 'LOCKED_ON_TARGET'}
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.2fr_1.1fr]">
          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/55 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">
                  攻击方终端
                </p>
                <h2 className="text-xl font-bold text-white">攻击方参数锁定</h2>
              </div>
            </div>

            <SearchSelect
              title="攻击方目标检索"
              accent="blue"
              value={attacker.presetId}
              query={attackerQuery}
              onQueryChange={setAttackerQuery}
              onChange={handleSelectAttacker}
              filtered={filteredAttackers}
            />

            <div className="mt-5 grid grid-cols-2 gap-4">
              <NumberField
                label="等级"
                value={attacker.level}
                onChange={(value) => setAttacker((prev) => ({ ...prev, level: value }))}
                accent="blue"
              />
              <NumberField
                label="攻击"
                value={attacker.atk}
                onChange={(value) => setAttacker((prev) => ({ ...prev, atk: value }))}
                accent="blue"
              />
              <NumberField
                label="特攻"
                value={attacker.spA}
                onChange={(value) => setAttacker((prev) => ({ ...prev, spA: value }))}
                accent="blue"
              />
              <div className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">招式</span>
                <select
                  value={attacker.move}
                  onChange={(event) =>
                    setAttacker((prev) => ({ ...prev, move: event.target.value }))
                  }
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-300"
                >
                  {attackerMoves.map((move) => (
                    <option key={move.name} value={move.name}>
                      {move.name} / {move.powerHint}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">特性</span>
                <input
                  value={attacker.ability}
                  onChange={(event) =>
                    setAttacker((prev) => ({ ...prev, ability: event.target.value }))
                  }
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                />
              </label>
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">道具</span>
                <input
                  value={attacker.item}
                  onChange={(event) =>
                    setAttacker((prev) => ({ ...prev, item: event.target.value }))
                  }
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                />
              </label>
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">性格</span>
                <input
                  value={attacker.nature}
                  onChange={(event) =>
                    setAttacker((prev) => ({ ...prev, nature: event.target.value }))
                  }
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-500/15 bg-slate-950/75 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                攻击方战术摘要
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {selectedAttackerPreset.name} / {selectedAttackerPreset.role}
              </p>
              <p className="mt-1 font-mono text-xs text-cyan-300">
                当前招式：{selectedMoveMeta.name} / {selectedMoveMeta.category === 'physical' ? '物理' : '特殊'}
              </p>
            </div>
          </section>

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
                key={`${result?.minDamagePercent ?? 0}-${result?.maxDamagePercent ?? 0}-${attacker.move}-${defender.hp}`}
                initial={{ opacity: 0.25, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.2, y: -10 }}
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
                      OHKO {result?.ohkoPercent.toFixed(1) ?? '0.0'}% / 2HKO{' '}
                      {result?.twoHkoPercent.toFixed(1) ?? '0.0'}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-500/15 bg-slate-950/75 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      绝对伤害值
                    </p>
                    <p className="mt-3 font-mono text-2xl font-black text-white">
                      {result?.minDamage ?? 0} - {result?.maxDamage ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      目标当前体力：<span className="font-mono text-red-300">{defender.hp}</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      交战环境参数
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      MODIFIERS_LOCKED
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">天气</span>
                      <select
                        value={battle.weather}
                        onChange={(event) =>
                          setBattle((prev) => ({
                            ...prev,
                            weather: event.target.value as WeatherType,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                      >
                        {WEATHER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">场地</span>
                      <select
                        value={battle.field}
                        onChange={(event) =>
                          setBattle((prev) => ({
                            ...prev,
                            field: event.target.value as FieldType,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm outline-none focus:border-cyan-300"
                      >
                        {FIELD_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {(error || result) && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      系统回传
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
                          推算剩余体力：
                          <span className="font-mono text-white">
                            {' '}
                            {result?.survivingHPPercent?.toFixed(1) ?? '0.0'}%
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="rounded-3xl border border-red-500/20 bg-slate-900/55 p-5 shadow-[0_0_30px_rgba(239,68,68,0.08)] backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-2 text-red-300">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-red-300/80">
                  防御方终端
                </p>
                <h2 className="text-xl font-bold text-white">防守方参数锁定</h2>
              </div>
            </div>

            <SearchSelect
              title="防守方目标检索"
              accent="red"
              value={defender.presetId}
              query={defenderQuery}
              onQueryChange={setDefenderQuery}
              onChange={handleSelectDefender}
              filtered={filteredDefenders}
            />

            <div className="mt-5 grid grid-cols-2 gap-4">
              <NumberField
                label="等级"
                value={defender.level}
                onChange={(value) => setDefender((prev) => ({ ...prev, level: value }))}
                accent="red"
              />
              <NumberField
                label="体力"
                value={defender.hp}
                onChange={(value) => setDefender((prev) => ({ ...prev, hp: value }))}
                accent="red"
              />
              <NumberField
                label="防御"
                value={defender.def}
                onChange={(value) => setDefender((prev) => ({ ...prev, def: value }))}
                accent="red"
              />
              <NumberField
                label="特防"
                value={defender.spD}
                onChange={(value) => setDefender((prev) => ({ ...prev, spD: value }))}
                accent="red"
              />
            </div>

            <div className="mt-5 grid gap-4">
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">特性</span>
                <input
                  value={defender.ability}
                  onChange={(event) =>
                    setDefender((prev) => ({ ...prev, ability: event.target.value }))
                  }
                  className="w-full rounded-xl border border-red-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-red-300"
                />
              </label>
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">道具</span>
                <input
                  value={defender.item}
                  onChange={(event) =>
                    setDefender((prev) => ({ ...prev, item: event.target.value }))
                  }
                  className="w-full rounded-xl border border-red-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-red-300"
                />
              </label>
              <label className="space-y-2">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">性格</span>
                <input
                  value={defender.nature}
                  onChange={(event) =>
                    setDefender((prev) => ({ ...prev, nature: event.target.value }))
                  }
                  className="w-full rounded-xl border border-red-500/20 bg-slate-950/75 px-4 py-3 text-sm outline-none focus:border-red-300"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-red-500/15 bg-slate-950/75 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                防御方战术摘要
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {selectedDefenderPreset.name} / {selectedDefenderPreset.role}
              </p>
              <p className="mt-1 font-mono text-xs text-red-300">
                体力 {defender.hp} / 防御 {defender.def} / 特防 {defender.spD}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
