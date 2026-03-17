'use client';

import { useCallback, useMemo, useState } from 'react';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import type {
  DamageCalcInput,
  KaizoModifier,
  WeatherType,
  FieldType,
} from '@/types/damage';
import { garchompInstance } from '@/data/sampleData';

interface CalculatorState {
  attackerName: string;
  defenderName: string;
  weather: WeatherType;
  field: FieldType;
  defenderHP: number;
}

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
  OHKO: '一击击杀',
  '2HKO': '两回合击杀',
  '3HKO': '三回合击杀',
  '4HKO': '四回合击杀',
  survives: '可存活',
};

export default function DamageCalculatorPage(): React.ReactElement {
  const { result, isLoading, error, calculate } = useKaizoCalc();

  const [state, setState] = useState<CalculatorState>({
    attackerName: '烈咬陆鲨',
    defenderName: '烈咬陆鲨',
    weather: 'null',
    field: 'null',
    defenderHP: 120,
  });

  const [modifiers, setModifiers] = useState<KaizoModifier[]>([
    {
      id: 'ability-boost',
      name: '特性强化',
      damageMultiplier: 1.3,
      enabled: false,
      description: '模拟改版中由特性触发的额外伤害加成。',
    },
    {
      id: 'move-power-boost',
      name: '招式强化',
      damageMultiplier: 1.2,
      enabled: false,
      description: '模拟关键招式在改版中的威力上调。',
    },
    {
      id: 'stab-boost',
      name: '本系加成强化',
      damageMultiplier: 1.1,
      enabled: false,
      description: '模拟版本调整后更强的本系加成。',
    },
  ]);

  const modifierNameMap = useMemo(
    () => Object.fromEntries(modifiers.map((modifier) => [modifier.id, modifier.name])),
    [modifiers]
  );

  const enabledModifiers = useMemo(
    () => modifiers.filter((modifier) => modifier.enabled).map((modifier) => modifier.name),
    [modifiers]
  );

  const appliedModifierLabels = useMemo(() => {
    if (!result?.appliedModifiers?.length) {
      return [];
    }
    return result.appliedModifiers.map((modifierId) => modifierNameMap[modifierId] || modifierId);
  }, [modifierNameMap, result?.appliedModifiers]);

  const handleCalculate = useCallback(async () => {
    const input: DamageCalcInput = {
      attacker: {
        name: state.attackerName,
        level: garchompInstance.level,
        atk: 180,
        spA: 120,
        ability: '粗糙皮肤',
        item: '生命宝珠',
        nature: '固执',
        move: '地震',
        boosts: {},
      },
      defender: {
        name: state.defenderName,
        level: garchompInstance.level,
        def: 100,
        spD: 100,
        ability: '粗糙皮肤',
        item: '生命宝珠',
        hp: state.defenderHP,
        boosts: {},
      },
      weather: state.weather !== 'null' ? state.weather : undefined,
      field: state.field !== 'null' ? state.field : undefined,
      kaizoRules: {
        modifiers,
        enableAllModifiers: false,
      },
    };

    await calculate(input);
  }, [calculate, modifiers, state]);

  const handleModifierToggle = (modifierId: string): void => {
    setModifiers((prev) =>
      prev.map((modifier) =>
        modifier.id === modifierId
          ? { ...modifier, enabled: !modifier.enabled }
          : modifier
      )
    );
  };

  const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="title-strong mb-2 text-4xl text-emerald-300">伤害计算器</h1>
          <p className="text-slate-300">基于对战参数快速估算伤害区间与击杀线。</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="glass-card p-6 lg:col-span-1">
            <h2 className="title-strong mb-4 text-xl text-emerald-300">计算参数</h2>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-300">攻击方宝可梦</label>
              <input
                type="text"
                value={state.attackerName}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, attackerName: event.target.value }))
                }
                placeholder="请输入攻击方名称"
                className="w-full rounded-lg border border-emerald-500/25 bg-slate-800/75 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-emerald-500/70"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-300">防守方宝可梦</label>
              <input
                type="text"
                value={state.defenderName}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, defenderName: event.target.value }))
                }
                placeholder="请输入防守方名称"
                className="w-full rounded-lg border border-emerald-500/25 bg-slate-800/75 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-emerald-500/70"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-300">防守方体力值</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={state.defenderHP}
                  onChange={(event) =>
                    setState((prev) => ({
                      ...prev,
                      defenderHP: Math.max(1, parseInt(event.target.value, 10) || 1),
                    }))
                  }
                  min={1}
                  max={400}
                  className="data-number w-28 rounded-lg border border-emerald-500/25 bg-slate-800/75 px-3 py-2 text-slate-100 outline-none transition-colors focus:border-emerald-500/70"
                />
                <input
                  type="range"
                  value={state.defenderHP}
                  onChange={(event) =>
                    setState((prev) => ({ ...prev, defenderHP: parseInt(event.target.value, 10) }))
                  }
                  min={1}
                  max={400}
                  className="w-full cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-300">天气</label>
              <select
                value={state.weather}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, weather: event.target.value as WeatherType }))
                }
                className="w-full rounded-lg border border-emerald-500/25 bg-slate-800/75 px-3 py-2 text-slate-100 outline-none transition-colors focus:border-emerald-500/70"
              >
                {WEATHER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-300">场地</label>
              <select
                value={state.field}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, field: event.target.value as FieldType }))
                }
                className="w-full rounded-lg border border-emerald-500/25 bg-slate-800/75 px-3 py-2 text-slate-100 outline-none transition-colors focus:border-emerald-500/70"
              >
                {FIELD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleCalculate} disabled={isLoading} className="tech-button w-full">
              {isLoading ? '演算中...' : '执行演算'}
            </button>

            {error && (
              <div className="mt-4 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">
                计算失败：{error}
              </div>
            )}
          </section>

          <section className="glass-card p-6 lg:col-span-1">
            <h2 className="title-strong mb-4 text-xl text-emerald-300">改版修正规则</h2>

            <div className="space-y-3">
              {modifiers.map((modifier) => (
                <div key={modifier.id} className="rounded-lg border border-emerald-500/20 bg-slate-800/65 p-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={modifier.enabled}
                      onChange={() => handleModifierToggle(modifier.id)}
                      className="mt-1 cursor-pointer accent-emerald-500"
                    />
                    <div className="flex-1 text-sm">
                      <div className="title-strong text-slate-100">{modifier.name}</div>
                      <div className="mt-1 text-xs text-slate-300">{modifier.description}</div>
                      <div className="data-number mt-1 text-xs text-emerald-300">
                        伤害倍率 ×{modifier.damageMultiplier.toFixed(2)}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="glass-card mt-4 p-3 text-xs">
              <p className="text-slate-400">当前已启用</p>
              <p className="mt-1 text-emerald-300">{enabledModifiers.join('、') || '无'}</p>
            </div>
          </section>

          <section className="glass-card p-6 lg:col-span-1">
            <h2 className="title-strong mb-4 text-xl text-emerald-300">计算结果</h2>

            {result ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-slate-400">伤害百分比</p>
                  <div className="data-number title-strong text-2xl text-emerald-300">
                    {formatPercent(result.minDamagePercent)} - {formatPercent(result.maxDamagePercent)}
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400"
                      style={{ width: `${Math.min(result.maxDamagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="glass-card p-3">
                  <div className="mb-2 text-xs text-slate-400">绝对伤害值</div>
                  <div className="data-number text-slate-100">{result.minDamage} - {result.maxDamage} 点</div>
                </div>

                <div className="glass-card p-3">
                  <div className="mb-2 text-xs text-slate-400">击杀判定</div>
                  <div className="title-strong text-lg text-emerald-300">{KO_LABEL_MAP[result.ko] || result.ko}</div>
                </div>

                {result.guaranteedKO ? (
                  <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-3">
                    <p className="title-strong text-sm text-red-200">可稳定击杀</p>
                  </div>
                ) : (
                  <div className="glass-card p-3">
                    <div className="mb-2 text-xs text-slate-400">预计剩余体力</div>
                    <div className="data-number text-slate-100">
                      {result.survivingHPPercent?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                )}

                {appliedModifierLabels.length > 0 && (
                  <div className="glass-card p-3 text-xs">
                    <div className="mb-1 text-slate-400">已应用修正项</div>
                    <div className="text-emerald-300">{appliedModifierLabels.join('、')}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-center text-slate-300">
                先设置参数，然后点击“执行演算”。
              </div>
            )}
          </section>
        </div>

        <section className="glass-card mt-8 p-6">
          <h3 className="title-strong mb-3 text-lg text-emerald-300">说明</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>本工具基于对战伤害公式进行快速估算，适合战术预演。</li>
            <li>改版修正规则可模拟版本中的额外倍率与机制变化。</li>
            <li>伤害区间默认考虑随机波动，可用于判断是否稳定击杀。</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
