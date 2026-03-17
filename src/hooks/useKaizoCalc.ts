/**
 * useKaizoCalc Hook
 * 基于 @smogon/calc 库的自定义 React Hook
 * 用于计算 Pokémon 对战中的伤害范围和击杀概率
 */

'use client';

import { useCallback, useState, useMemo } from 'react';
import {
  DamageCalcInput,
  DamageCalcResult,
  KaizoModifier,
  KaizoRules,
  UseKaizoCalcReturn,
  determineKnockoutTurns,
  calculateKOPercentage,
  WeatherType,
  FieldType,
} from '@/types/damage';

/**
 * 调用 @smogon/calc 库进行基础伤害计算
 * 这是一个模拟函数，实际使用时应替换为真实的库调用
 */
function calculateBaseDamage(input: DamageCalcInput): {
  minDamage: number;
  maxDamage: number;
} {
  // 注意：这是一个简化版本。实际使用时应调用真实的 @smogon/calc 库
  // import { Damage, toNumber } from '@smogon/calc';
  
  const attacker = input.attacker;
  const defender = input.defender;
  
  // 简化的伤害公式
  // 实际的 Pokémon 伤害公式：
  // Damage = (((2 * Level / 5 + 2) * Power * Attack / Defense) / 50 + 2) * Modifiers
  
  const level = attacker.level;
  const power = 100; // 默认技能威力，实际应从技能数据库获取
  const attack = attacker.atk;
  const defense = defender.def;
  
  // 基础伤害计算
  const baseDamage = Math.floor(
    ((((2 * level) / 5 + 2) * power * attack) / defense / 50 + 2)
  );
  
  // 伤害波动 (0.85 - 1.0)
  const minDamage = Math.floor(baseDamage * 0.85);
  const maxDamage = baseDamage;
  
  return { minDamage, maxDamage };
}

/**
 * 计算类型相性倍数
 */
function getEffectivenessMultiplier(
  moveType: string,
  defenderType: string,
): number {
  // 简化的类型相性表
  // 实际应该使用完整的类型相性数据
  const typeChart: Record<string, Record<string, number>> = {
    'normal': { 'rock': 0.5, 'ghost': 0, 'steel': 0.5 },
    'fire': { 'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 2, 'bug': 2, 'steel': 2 },
    'water': { 'water': 0.5, 'grass': 0.5, 'ground': 2, 'rock': 2, 'fire': 2 },
    'grass': { 'water': 2, 'ground': 2, 'rock': 2, 'grass': 0.5, 'fire': 0.5, 'poison': 0.5 },
    'electric': { 'water': 2, 'flying': 2, 'grass': 0.5, 'electric': 0.5, 'ground': 0 },
    'flying': { 'grass': 2, 'fighting': 2, 'bug': 2, 'rock': 0.5, 'steel': 0.5 },
  };
  
  return typeChart[moveType]?.[defenderType] ?? 1;
}

/**
 * 计算天气修正
 */
function getWeatherMultiplier(
  weather: WeatherType | undefined,
  moveType: string,
): number {
  switch (weather) {
    case 'sun':
      return moveType === 'fire' ? 1.5 : moveType === 'water' ? 0.5 : 1;
    case 'rain':
      return moveType === 'water' ? 1.5 : moveType === 'fire' ? 0.5 : 1;
    case 'sandstorm':
      return moveType === 'rock' ? 1.5 : 1;
    case 'hail':
      return moveType === 'ice' ? 1.5 : 1;
    default:
      return 1;
  }
}

/**
 * 计算场地修正
 */
function getFieldMultiplier(
  field: FieldType | undefined,
  moveType: string,
): number {
  switch (field) {
    case 'grassy':
      return moveType === 'grass' ? 1.3 : 1;
    case 'electric':
      return moveType === 'electric' ? 1.3 : 1;
    case 'psychic':
      return moveType === 'psychic' ? 1.3 : 1;
    case 'misty':
      return moveType === 'dragon' ? 0.5 : 1;
    default:
      return 1;
  }
}

/**
 * 应用 Kaizo 修正项
 */
function applyKaizoModifiers(
  baseDamage: number,
  modifiers: KaizoModifier[],
): { damage: number; appliedModifiers: string[] } {
  let totalMultiplier = 1;
  const appliedModifiers: string[] = [];

  modifiers.forEach((modifier) => {
    if (modifier.enabled) {
      totalMultiplier *= modifier.damageMultiplier;
      appliedModifiers.push(modifier.id);
    }
  });

  return {
    damage: Math.floor(baseDamage * totalMultiplier),
    appliedModifiers,
  };
}

/**
 * useKaizoCalc Hook
 * 用于计算 Pokémon 伤害
 */
export function useKaizoCalc(): UseKaizoCalcReturn {
  const [result, setResult] = useState<DamageCalcResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<DamageCalcInput | null>(null);
  const [modifiers, setModifiers] = useState<KaizoModifier[]>([]);

  /**
   * 执行伤害计算
   */
  const calculate = useCallback(async (input: DamageCalcInput): Promise<DamageCalcResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // 基础伤害计算
      const { minDamage: baseminDamage, maxDamage: baseMaxDamage } =
        calculateBaseDamage(input);

      // 推断攻击技能的类型（简化处理）
      const moveType = 'normal'; // 实际应从技能数据库获取

      // 应用类型相性
      const effectiveness = getEffectivenessMultiplier(
        moveType,
        'normal', // 防御方类型，实际应从输入获取
      );

      // 应用天气修正
      const weatherMultiplier = getWeatherMultiplier(input.weather, moveType);

      // 应用场地修正
      const fieldMultiplier = getFieldMultiplier(input.field, moveType);

      // 计算所有修正后的伤害
      const minDamage = Math.floor(
        baseminDamage * effectiveness * weatherMultiplier * fieldMultiplier
      );
      const maxDamage = Math.floor(
        baseMaxDamage * effectiveness * weatherMultiplier * fieldMultiplier
      );

      // 应用 Kaizo 修正项
      const currentModifiers = input.kaizoRules?.modifiers || modifiers;
      const { damage: kaizoMinDamage, appliedModifiers: kaizoApplied1 } =
        applyKaizoModifiers(minDamage, currentModifiers);
      const { damage: kaizoMaxDamage, appliedModifiers: kaizoApplied2 } =
        applyKaizoModifiers(maxDamage, currentModifiers);

      // 计算伤害百分比
      const defenderHP = input.defender.hp || 1;
      const minDamagePercent = (kaizoMinDamage / defenderHP) * 100;
      const maxDamagePercent = (kaizoMaxDamage / defenderHP) * 100;

      // 确定击杀类型
      const ko = determineKnockoutTurns(maxDamagePercent);

      // 计算击杀概率
      const { ohkoPercent, twoHkoPercent, threeHkoPercent } =
        calculateKOPercentage(minDamagePercent, maxDamagePercent);

      // 计算存活 HP 百分比
      const survivingHPPercent =
        maxDamagePercent < 100
          ? Math.max(0, 100 - maxDamagePercent)
          : undefined;

      const calcResult: DamageCalcResult = {
        minDamagePercent,
        maxDamagePercent,
        minDamage: kaizoMinDamage,
        maxDamage: kaizoMaxDamage,
        ko,
        ohkoPercent,
        twoHkoPercent,
        threeHkoPercent,
        guaranteedKO: maxDamagePercent >= 100,
        survivingHPPercent,
        appliedModifiers: kaizoApplied2,
        metadata: {
          attackerLevel: input.attacker.level,
          defenderLevel: input.defender.level,
          basePower: 100,
          effectiveness,
          modifierTotal:
            effectiveness *
            weatherMultiplier *
            fieldMultiplier *
            (currentModifiers.reduce((acc, m) => (m.enabled ? acc * m.damageMultiplier : acc), 1)),
        },
      };

      setResult(calcResult);
      setLastInput(input);

      return calcResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '计算失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [modifiers]);

  /**
   * 清除计算结果
   */
  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setLastInput(null);
  }, []);

  /**
   * 添加 Kaizo 修正项
   */
  const addModifier = useCallback((modifier: KaizoModifier) => {
    setModifiers((prev) => [...prev, modifier]);
  }, []);

  /**
   * 删除 Kaizo 修正项
   */
  const removeModifier = useCallback((modifierId: string) => {
    setModifiers((prev) => prev.filter((m) => m.id !== modifierId));
  }, []);

  /**
   * 更新 Kaizo 修正项
   */
  const updateModifier = useCallback(
    (modifierId: string, updates: Partial<KaizoModifier>) => {
      setModifiers((prev) =>
        prev.map((m) => (m.id === modifierId ? { ...m, ...updates } : m))
      );
    },
    []
  );

  /**
   * 获取当前的修正项列表
   */
  const getModifiers = useCallback(() => [...modifiers], [modifiers]);

  return {
    result,
    isLoading,
    error,
    lastInput,
    calculate,
    clear,
    addModifier,
    removeModifier,
    updateModifier,
    getModifiers,
  };
}

export default useKaizoCalc;
