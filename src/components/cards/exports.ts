/**
 * 组件导出统一入口
 * 便于快速导入 TacticalPokemonCard 相关内容
 */

// 导出组件
export {
  TacticalPokemonCard,
  TacticalPokemonCardGrid,
  type KaizoModification,
} from '@/components/cards/TacticalPokemonCard';

// 导出相关数据
export {
  garchompInstance,
  firefannyKaizo,
  sampleTrainerData,
} from '@/data/sampleData';

export {
  garchompKaizoModifications,
  heatranKaizoModifications,
  enteiKaizoModifications,
} from '@/data/kaizoModifications';

/**
 * 使用示例：
 *
 * import {
 *   TacticalPokemonCard,
 *   garchompInstance,
 *   garchompKaizoModifications
 * } from '@/components/exports';
 *
 * <TacticalPokemonCard
 *   pokemon={garchompInstance}
 *   modifications={garchompKaizoModifications}
 * />
 */
