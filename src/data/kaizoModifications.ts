/**
 * 组件演示服务器端数据
 * 包含烈咬陆鲨的 Kaizo 改动信息
 */

import type { KaizoModification } from '@/components/cards/TacticalPokemonCard';

/**
 * 烈咬陆鲨在白金改版中的改动点
 */
export const garchompKaizoModifications: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '速度提升使其更容易抢先手',
  },
  {
    stat: 'atk',
    change: 0,
    description: '保持原始数值，搭配龙舞使用',
  },
];

/**
 * 火钰的其他队伍成员的改动示例
 */
export const heatranKaizoModifications: KaizoModification[] = [
  {
    stat: 'spA',
    change: 5,
    description: '特攻微调，提高输出能力',
  },
];

export const enteiKaizoModifications: KaizoModification[] = [
  {
    stat: 'atk',
    change: 10,
    description: '攻击大幅提升，提高威胁程度',
  },
  {
    stat: 'spe',
    change: 5,
    description: '速度增加，确保行动顺序',
  },
];
