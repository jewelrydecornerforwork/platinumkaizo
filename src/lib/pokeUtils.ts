/**
 * 数据处理工具函数
 * 处理 Pokémon 和训练师数据的常用操作
 */

import type {
  Pokemon,
  PokemonInstance,
  BaseStats,
  IVs,
  EVs,
  Nature,
  DamageCalcInput,
  DamageCalcResult,
} from '@/types';

/**
 * 性质修正值映射表
 * 用于计算最终能力值
 */
const NATURE_MODIFIERS: Record<
  Nature,
  { stat: 'atk' | 'def' | 'spA' | 'spD' | 'spe' | null; increase: boolean }
> = {
  hardy: { stat: null, increase: false },
  lonely: { stat: 'atk', increase: true }, // +Atk -Def
  brave: { stat: 'atk', increase: true }, // +Atk -Spe
  adamant: { stat: 'atk', increase: true }, // +Atk -SpA
  naughty: { stat: 'atk', increase: true }, // +Atk -SpD
  bold: { stat: 'def', increase: true }, // +Def -Atk
  docile: { stat: null, increase: false },
  relaxed: { stat: 'def', increase: true }, // +Def -Spe
  impish: { stat: 'def', increase: true }, // +Def -SpA
  lax: { stat: 'def', increase: true }, // +Def -SpD
  timid: { stat: 'spe', increase: true }, // +Spe -Atk
  hasty: { stat: 'spe', increase: true }, // +Spe -Def
  serious: { stat: null, increase: false },
  jolly: { stat: 'spe', increase: true }, // +Spe -SpA
  naive: { stat: 'spe', increase: true }, // +Spe -SpD
  modest: { stat: 'spA', increase: true }, // +SpA -Atk
  mild: { stat: 'spA', increase: true }, // +SpA -Def
  quiet: { stat: 'spA', increase: true }, // +SpA -Spe
  bashful: { stat: null, increase: false },
  rash: { stat: 'spA', increase: true }, // +SpA -SpD
  calm: { stat: 'spD', increase: true }, // +SpD -Atk
  gentle: { stat: 'spD', increase: true }, // +SpD -Def
  sassy: { stat: 'spD', increase: true }, // +SpD -Spe
  careful: { stat: 'spD', increase: true }, // +SpD -SpA
  quirky: { stat: null, increase: false },
};

/**
 * 计算单个能力值
 *
 * @param base 基础值
 * @param iv 个体值
 * @param ev 努力值
 * @param level 等级
 * @param nature 性质修正
 * @returns 计算后的能力值
 */
export function calculateStat(
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: Nature = 'hardy',
): number {
  // 基础公式
  const stat = Math.floor(
    ((2 * base + iv + Math.floor(ev / 4)) * level) / 100 + 5,
  );

  // 应用性质修正（±10%）
  const modifier = NATURE_MODIFIERS[nature];
  if (modifier.stat === null) {
    return stat;
  }

  if (modifier.increase) {
    return Math.floor(stat * 1.1);
  } else {
    return Math.floor(stat * 0.9);
  }
}

/**
 * 计算 HP 专用公式（HP 不受性质影响）
 */
export function calculateHP(
  base: number,
  iv: number,
  ev: number,
  level: number,
): number {
  if (base === 1) {
    // Shedinja 特殊情况
    return 1;
  }
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 5;
}

/**
 * 获取宝可梦实例的所有能力值
 */
export function getPokemonStats(instance: PokemonInstance): Record<
  string,
  number
> {
  const { pokemon, level, nature, ivs, evs } = instance;
  const stats = pokemon.baseStats;

  return {
    hp: calculateHP(stats.hp, ivs.hp, evs.hp, level),
    atk: calculateStat(stats.atk, ivs.atk, evs.atk, level, nature),
    def: calculateStat(stats.def, ivs.def, evs.def, level, nature),
    spA: calculateStat(stats.spA, ivs.spA, evs.spA, level, nature),
    spD: calculateStat(stats.spD, ivs.spD, evs.spD, level, nature),
    spe: calculateStat(stats.spe, ivs.spe, evs.spe, level, nature),
  };
}

/**
 * 计算宝可梦的实际 HP（剩余血量）
 */
export function getCurrentHP(instance: PokemonInstance): number {
  const stats = getPokemonStats(instance);
  return stats.hp; // 实际应用中应存储当前 HP，这里返回最大 HP
}

/**
 * 简化的伤害计算（不包含所有细节）
 * 用于快速估算
 */
export function calculateBaseDamage(
  attacker: PokemonInstance,
  defender: PokemonInstance,
  moveIndex: number,
): { min: number; max: number; ohko: boolean } {
  const attackerStats = getPokemonStats(attacker);
  const defenderStats = getPokemonStats(defender);
  const move = attacker.moves[moveIndex];

  if (!move || move.power === 0) {
    return { min: 0, max: 0, ohko: false };
  }

  // 选择攻击类型
  let attack: number;
  if (move.category === 'physical') {
    attack = attackerStats.atk;
  } else if (move.category === 'special') {
    attack = attackerStats.spA;
  } else {
    return { min: 0, max: 0, ohko: false };
  }

  // 选择防御类型
  let defense: number;
  if (move.category === 'physical') {
    defense = defenderStats.def;
  } else {
    defense = defenderStats.spD;
  }

  // 基础伤害公式
  const baseDamage =
    ((((2 * attacker.level) / 5 + 2) * move.power * attack) / defense / 50 + 2);

  // 考虑暴击（简化，假设正常倍数）
  const minDamage = Math.floor(baseDamage * 0.85);
  const maxDamage = Math.floor(baseDamage);
  const defenderHP = defenderStats.hp;

  return {
    min: minDamage,
    max: maxDamage,
    ohko: maxDamage >= defenderHP,
  };
}

/**
 * 获取宝可梦对特定属性的克制情况
 * 返回相对优势和劣势
 */
export function getTypeAdvantage(pokemonTypes: [string, string | null]) {
  const [type1, type2] = pokemonTypes;

  // 简化版的克制表（仅保留关键克制）
  const advantages: Record<string, string[]> = {
    fire: ['grass', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    ice: ['grass', 'flying', 'ground', 'dragon'],
    fighting: ['normal', 'rock', 'steel', 'ice', 'dark'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark'],
    normal: [],
  };

  const weaknesses: Record<string, string[]> = {
    fire: ['water', 'ground', 'rock'],
    water: ['grass', 'electric'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    electric: ['ground'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'water', 'ground'],
    fairy: ['poison', 'steel'],
    normal: ['fighting'],
  };

  return {
    advantages: [
      ...(advantages[type1] || []),
      ...(type2 && advantages[type2] ? advantages[type2] : []),
    ],
    weaknesses: [
      ...(weaknesses[type1] || []),
      ...(type2 && weaknesses[type2] ? weaknesses[type2] : []),
    ],
  };
}

/**
 * 验证宝可梦实例的数据完整性
 */
export function validatePokemonInstance(
  instance: PokemonInstance,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 检查等级范围
  if (instance.level < 1 || instance.level > 100) {
    errors.push('等级必须在 1 到 100 之间');
  }

  // 检查个体值范围
  Object.entries(instance.ivs).forEach(([stat, iv]) => {
    if (iv < 0 || iv > 31) {
      errors.push(`${stat} 个体值必须在 0 到 31 之间`);
    }
  });

  // 检查努力值总和
  const evTotal = Object.values(instance.evs).reduce((a, b) => a + b, 0);
  if (evTotal > 510) {
    errors.push('努力值总和不能超过 510');
  }

  // 检查招式
  if (instance.moves.length !== 4) {
    errors.push('宝可梦必须学习 4 个招式');
  }

  // 检查特性
  if (!instance.pokemon.abilities.ability1) {
    errors.push('宝可梦必须有至少一个特性');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 生成宝可梦的 JSON 字符串（用于存储或传输）
 */
export function serializePokemonInstance(
  instance: PokemonInstance,
): string {
  return JSON.stringify(instance, null, 2);
}

/**
 * 格式化宝可梦的信息为可读字符串
 */
export function formatPokemonInfo(instance: PokemonInstance): string {
  const stats = getPokemonStats(instance);
  const moves = instance.moves.map((m) => m.name).join(' / ');

  return `
${instance.nickname || instance.pokemon.name} (${instance.pokemon.enName})
等级: ${instance.level} | 性质: ${instance.nature} | 性别: ${instance.gender || '未知'}
特性: ${instance.pokemon.abilities.ability1.name}
道具: ${instance.heldItem?.name || '无'}
招式: ${moves}

能力值:
  HP: ${stats.hp}
  Atk: ${stats.atk}
  Def: ${stats.def}
  SpA: ${stats.spA}
  SpD: ${stats.spD}
  Spe: ${stats.spe}

努力值分配:
  HP: ${instance.evs.hp} | Atk: ${instance.evs.atk} | Def: ${instance.evs.def}
  SpA: ${instance.evs.spA} | SpD: ${instance.evs.spD} | Spe: ${instance.evs.spe}
  `;
}
