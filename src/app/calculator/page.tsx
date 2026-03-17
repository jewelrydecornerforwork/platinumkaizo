/**
 * 伤害计算器演示页面
 * 展示 useKaizoCalc Hook 的使用
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import { DamageCalcInput, DamageCalcResult, KaizoModifier, WeatherType, FieldType } from '@/types/damage';
import { garchomp, garchomp as garchompInstance } from '@/data/sampleData';
import Image from 'next/image';

interface CalculatorState {
  attackerName: string;
  defenderName: string;
  weather: WeatherType;
  field: FieldType;
  defenderHP: number;
}

export default function DamageCalculatorPage() {
  const { result, isLoading, error, calculate, addModifier, removeModifier, getModifiers } = useKaizoCalc();
  const [state, setState] = useState<CalculatorState>({
    attackerName: '烈咬陆鲨',
    defenderName: '烈咬陆鲨',
    weather: 'null',
    field: 'null',
    defenderHP: 120,
  });

  const [kaizoModifiers, setKaizoModifiers] = useState<KaizoModifier[]>([
    {
      id: 'ability-boost',
      name: '特性强化：威力提升',
      damageMultiplier: 1.3,
      enabled: false,
      description: 'Kaizo版本中的特性威力翻倍强化',
    },
    {
      id: 'move-power-boost',
      name: '技能强化：地震',
      damageMultiplier: 1.2,
      enabled: false,
      description: '地震在Kaizo中的威力提升',
    },
    {
      id: 'stab-boost',
      name: '同物系加成强化',
      damageMultiplier: 1.1,
      enabled: false,
      description: '本次修改中类型相性加成提升',
    },
  ]);

  /**
   * 处理计算请求
   */
  const handleCalculate = useCallback(async () => {
    try {
      const input: DamageCalcInput = {
        attacker: {
          name: state.attackerName,
          level: garchompInstance.level,
          atk: 180,
          spA: 120,
          ability: '粗暴',
          item: '人字拖',
          nature: '固执',
          move: '地震',
          boosts: {},
        },
        defender: {
          name: state.defenderName,
          level: garchompInstance.level,
          def: 100,
          spD: 100,
          ability: '粗暴',
          item: '人字拖',
          hp: state.defenderHP,
          boosts: {},
        },
        weather: state.weather !== 'null' ? state.weather : undefined,
        field: state.field !== 'null' ? state.field : undefined,
        kaizoRules: {
          modifiers: kaizoModifiers,
          enableAllModifiers: false,
        },
      };

      await calculate(input);
    } catch (err) {
      console.error('计算失败:', err);
    }
  }, [state, kaizoModifiers, calculate]);

  /**
   * 处理修正项的启用/禁用
   */
  const handleModifierToggle = (modifierId: string) => {
    setKaizoModifiers((prev) =>
      prev.map((m) =>
        m.id === modifierId ? { ...m, enabled: !m.enabled } : m
      )
    );
  };

  /**
   * 格式化百分比
   */
  const formatPercent = (value: number) => {
    return `${Math.round(value * 10) / 10}%`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">⚡ 伤害计算器</h1>
          <p className="text-slate-400">
            使用 Smogon/calc 库计算 Pokémon 对战伤害
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧：输入面板 */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-emerald-500/30 bg-slate-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold text-emerald-400">⚙️ 计算参数</h2>

              {/* 攻击方 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🔥 攻击方宝可梦
                </label>
                <input
                  type="text"
                  value={state.attackerName}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, attackerName: e.target.value }))
                  }
                  placeholder="输入宝可梦名称"
                  className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* 防御方 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🛡️ 防御方宝可梦
                </label>
                <input
                  type="text"
                  value={state.defenderName}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, defenderName: e.target.value }))
                  }
                  placeholder="输入宝可梦名称"
                  className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* 防御方 HP */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  💚 防御方 HP
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={state.defenderHP}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        defenderHP: Math.max(1, parseInt(e.target.value) || 0),
                      }))
                    }
                    min="1"
                    max="400"
                    className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="range"
                    value={state.defenderHP}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        defenderHP: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    max="400"
                    className="flex-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* 天气选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ☀️ 天气
                </label>
                <select
                  value={state.weather}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, weather: e.target.value as WeatherType }))
                  }
                  className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="null">无</option>
                  <option value="sun">晴朗</option>
                  <option value="rain">下雨</option>
                  <option value="sandstorm">沙暴</option>
                  <option value="hail">冰雹</option>
                </select>
              </div>

              {/* 场地选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🌾 场地
                </label>
                <select
                  value={state.field}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, field: e.target.value as FieldType }))
                  }
                  className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="null">无</option>
                  <option value="grassy">草地场</option>
                  <option value="electric">电气场</option>
                  <option value="psychic">精神场</option>
                  <option value="misty">雾场</option>
                </select>
              </div>

              {/* 计算按钮 */}
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2 font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50"
              >
                {isLoading ? '计算中...' : '⚡ 计算伤害'}
              </button>

              {error && (
                <div className="mt-4 rounded bg-red-900/30 p-3 text-sm text-red-400">
                  ❌ {error}
                </div>
              )}
            </div>
          </div>

          {/* 中间：Kaizo 修正项 */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-emerald-500/30 bg-slate-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold text-emerald-400">🧬 Kaizo 修正项</h2>

              <div className="space-y-3">
                {kaizoModifiers.map((modifier) => (
                  <div
                    key={modifier.id}
                    className="rounded border border-slate-700 bg-slate-800/50 p-3"
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={modifier.enabled}
                        onChange={() => handleModifierToggle(modifier.id)}
                        className="mt-1 cursor-pointer accent-emerald-500"
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium text-slate-200">
                          {modifier.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {modifier.description}
                        </div>
                        <div className="text-xs text-emerald-400 mt-1 font-mono">
                          × {modifier.damageMultiplier.toFixed(2)}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded bg-slate-800/50 p-3 text-xs text-slate-400">
                <p>当前激活修正项：</p>
                <p className="text-emerald-400 font-mono">
                  {kaizoModifiers
                    .filter((m) => m.enabled)
                    .map((m) => m.name)
                    .join(', ') || '无'}
                </p>
              </div>
            </div>
          </div>

          {/* 右侧：结果面板 */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-emerald-500/30 bg-slate-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold text-emerald-400">📊 计算结果</h2>

              {result ? (
                <div className="space-y-4">
                  {/* 伤害范围 */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">伤害百分比</p>
                    <div className="text-2xl font-bold text-emerald-400">
                      {formatPercent(result.minDamagePercent)} - {formatPercent(result.maxDamagePercent)}
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                        style={{
                          width: `${Math.min(result.maxDamagePercent, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 绝对伤害 */}
                  <div className="rounded bg-slate-800/50 p-3">
                    <div className="text-xs text-slate-400 mb-2">绝对伤害值</div>
                    <div className="font-mono text-white">
                      {result.minDamage} - {result.maxDamage} HP
                    </div>
                  </div>

                  {/* 击杀信息 */}
                  <div className="rounded bg-slate-800/50 p-3">
                    <div className="text-xs text-slate-400 mb-2">击杀类型</div>
                    <div className={`text-lg font-bold ${
                      result.ko === 'OHKO' ? 'text-red-400' :
                      result.ko === '2HKO' ? 'text-orange-400' :
                      result.ko === '3HKO' ? 'text-yellow-400' :
                      result.ko === '4HKO' ? 'text-blue-400' :
                      'text-slate-400'
                    }`}>
                      {result.ko}
                    </div>
                  </div>

                  {/* 概率分析 */}
                  {result.guaranteedKO ? (
                    <div className="rounded bg-red-900/30 border border-red-700 p-3">
                      <p className="text-sm font-bold text-red-400">
                        ✓ 确保击杀
                      </p>
                    </div>
                  ) : (
                    <div className="rounded bg-slate-800/50 p-3">
                      <div className="text-xs text-slate-400 mb-2">存活 HP</div>
                      <div className="font-mono text-white">
                        {result.survivingHPPercent?.toFixed(1)}%
                      </div>
                    </div>
                  )}

                  {/* 应用的修正项 */}
                  {result.appliedModifiers.length > 0 && (
                    <div className="rounded bg-slate-800/50 p-3 text-xs">
                      <div className="text-slate-400 mb-1">已应用的修正项：</div>
                      <div className="text-emerald-400">
                        {result.appliedModifiers.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-center">
                  <p className="text-slate-400">
                    👈 选择参数后点击"计算伤害"<br />
                    查看结果
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-900/30 p-6 backdrop-blur">
          <h3 className="mb-3 text-lg font-bold text-white">📖 使用说明</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• 此计算器基于官方 Pokémon 伤害公式</li>
            <li>• Kaizo 修正项用于模拟改版特殊规则（如类型或特性强化）</li>
            <li>• 天气和场地会影响特定类型的伤害倍数</li>
            <li>• 结果显示最小和最大伤害百分比，基于 0.85-1.0 的伤害波动</li>
            <li>• OHKO = 一击必杀，2HKO = 两回合击杀，以此类推</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
