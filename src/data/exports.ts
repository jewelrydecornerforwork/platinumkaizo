/**
 * 数据模型快速导出和使用示例
 * 这个文件聚合了所有核心的数据模型、示例和工具函数
 * 便于在其他文件中统一导入
 */

// ==========================================
// 类型导出
// ==========================================

export type {
  PokemonType,
  Nature,
  BaseStats,
  IVs,
  EVs,
  Move,
  Ability,
  Item,
  Pokemon,
  PokemonInstance,
  TrainerTactic,
  Trainer,
  DamageCalcInput,
  DamageCalcResult,
} from '@/types';

// ==========================================
// 示例数据导出
// ==========================================

export {
  garchomp,
  garchompInstance,
  samplePokemonData,
  firefannyKaizo,
  sampleTrainerData,
  allSampleData,
} from '@/data/sampleData';

// ==========================================
// 工具函数导出
// ==========================================

export {
  calculateStat,
  calculateHP,
  getPokemonStats,
  getCurrentHP,
  calculateBaseDamage,
  getTypeAdvantage,
  validatePokemonInstance,
  serializePokemonInstance,
  formatPokemonInfo,
} from '@/lib/pokeUtils';

// ==========================================
// 使用示例
// ==========================================

/**
 * 导入示例：
 *
 * import {
 *   garchompInstance,
 *   getPokemonStats,
 *   formatPokemonInfo,
 * } from '@/data/exports';
 *
 * // 使用示例
 * const stats = getPokemonStats(garchompInstance);
 * console.log(formatPokemonInfo(garchompInstance));
 */
