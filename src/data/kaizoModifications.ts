import type { KaizoModification } from '@/components/cards/TacticalPokemonCard';

export const garchompKaizoModifications: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '速度提升，更容易抢到先手。',
  },
  {
    stat: 'atk',
    change: 0,
    description: '攻击维持原值，依赖强化招式放大收益。',
  },
];

export const heatranKaizoModifications: KaizoModification[] = [
  {
    stat: 'spA',
    change: 5,
    description: '特攻小幅提升，强化中后期压制能力。',
  },
];

export const enteiKaizoModifications: KaizoModification[] = [
  {
    stat: 'atk',
    change: 10,
    description: '攻击显著提升，提高爆发斩杀能力。',
  },
  {
    stat: 'spe',
    change: 5,
    description: '速度上调，扩大可先手覆盖范围。',
  },
];
