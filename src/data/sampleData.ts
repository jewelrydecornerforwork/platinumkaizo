/**
 * 示例数据文件
 * 包含 Pokémon 和 Trainer 的完整示例数据
 */

import type {
  Pokemon,
  PokemonInstance,
  Trainer,
  Move,
  Ability,
  Item,
} from '@/types';

/**
 * ==========================================
 * 招式库
 * ==========================================
 */

// 地震 - 烈咬陆鲨的标志招式
const earthquake: Move = {
  id: 'move-089',
  name: '地震',
  type: 'ground',
  category: 'physical',
  power: 100,
  accuracy: 100,
  priority: 0,
  description: '通过地面振动，对周围所有的宝可梦造成伤害',
};

// 龙舞 - 强化招式
const dragondance: Move = {
  id: 'move-349',
  name: '龙舞',
  type: 'dragon',
  category: 'status',
  power: 0,
  accuracy: 100,
  priority: 0,
  description: '自己的攻击和速度各上升一个阶段',
};

// 逆鳞 - 龙系强力招式
const outrage: Move = {
  id: 'move-179',
  name: '逆鳞',
  type: 'dragon',
  category: 'physical',
  power: 120,
  accuracy: 100,
  priority: 0,
  description: '连续攻击 2～3 回，之后陷入混乱状态',
};

// 石刃 - 岩系招式
const stoneedge: Move = {
  id: 'move-71',
  name: '石刃',
  type: 'rock',
  category: 'physical',
  power: 100,
  accuracy: 80,
  priority: 0,
  description: '向对手射出尖锐的岩石。容易产生极高伤害',
};

// 火焰冲击 - 覆盖面广的招式
const flareblitz: Move = {
  id: 'move-394',
  name: '火焰冲击',
  type: 'fire',
  category: 'physical',
  power: 120,
  accuracy: 100,
  priority: 0,
  description: '冲击对手，自己也会受到伤害。有 10% 的几率烼伤对手',
};

// 地裂 - 地面系强力招式
const earthquake2: Move = {
  id: 'move-089',
  name: '地裂',
  type: 'ground',
  category: 'physical',
  power: 100,
  accuracy: 100,
  priority: -1,
  description: '回合结束时对对手造成伤害，有 30% 的几率使对手陷入麻痹',
};

// 跨越 - 必中招式
const swordsdance: Move = {
  id: 'move-014',
  name: '剑舞',
  type: 'normal',
  category: 'status',
  power: 0,
  accuracy: 100,
  priority: 0,
  description: '自己的攻击上升两个阶段',
};

/**
 * ==========================================
 * 特性库
 * ==========================================
 */

// 沙漠之力 - Garchomp 的标志特性
const sandstream: Ability = {
  id: 'ability-045',
  name: '沙漠之力',
  description: '登场时天气变为沙暴。砂暴状态下岩石系宝可梦的特防上升',
  isHidden: false,
};

// 粗糙皮肤 - Garchomp 的第二个特性
const roughskin: Ability = {
  id: 'ability-024',
  name: '粗糙皮肤',
  description: '受到接触招式攻击时，对手也会受到伤害',
  isHidden: false,
};

// 鲨鱼皮 - Garchomp 的隐藏特性
const hydration: Ability = {
  id: 'ability-065',
  name: '鲨鱼皮',
  description: '回合结束时，如果下雨，异常状态回复',
  isHidden: true,
};

/**
 * ==========================================
 * 道具库
 * ==========================================
 */

// 生命玉 - 增加伤害的代价
const lifeorb: Item = {
  id: 'item-270',
  name: '生命玉',
  category: 'held-item',
  description: '增加招式威力，但每次攻击后损失 10% HP',
};

// 气息腰带 - 防守道具
const assaultvest: Item = {
  id: 'item-540',
  name: '防特围巾',
  category: 'held-item',
  description: '特防上升 1.1 倍，不能使用变化招式',
};

// 左旋石英 - 沙暴强化
const sandyrock: Item = {
  id: 'item-999',
  name: '沙暴石',
  category: 'held-item',
  description: '砂暴状态下，持有者的防御上升',
};

/**
 * ==========================================
 * Pokémon 定义
 * ==========================================
 */

/**
 * 烈咬陆鲨 (Garchomp)
 * 白金改版中得到 Kaizo 级别的强化
 *
 * 原生数据:
 * - HP: 108
 * - Atk: 130
 * - Def: 95
 * - SpA: 80
 * - SpD: 85
 * - Spe: 102
 *
 * Kaizo 改版调整:
 * - Spe: 110 (速度种族值微调增加，使其更容易先手)
 */
export const garchomp: Pokemon = {
  id: 445,
  name: '烈咬陆鲨',
  enName: 'Garchomp',
  types: ['dragon', 'ground'],
  height: 1.9,
  weight: 95.0,
  baseStats: {
    hp: 108,
    atk: 130,
    def: 95,
    spA: 80,
    spD: 85,
    spe: 110, // Kaizo 改版调整：从 102 提升到 110
  },
  abilities: {
    ability1: sandstream,
    ability2: roughskin,
    hidden: hydration,
  },
  learnset: {
    levelUp: [
      { level: 1, move: earthquake },
      { level: 16, move: outrage },
      { level: 32, move: dragondance },
      { level: 48, move: stoneedge },
    ],
    tmHm: [
      earthquake,
      outrage,
      stoneedge,
      flareblitz,
      dragondance,
      swordsdance,
    ],
    tutor: [outrage, stoneedge, earthquake],
    egg: [dragondance],
  },
  category: '龙宝可梦',
  dexEntry:
    '进化后的陆鲨。可能是地面属性宝可梦中速度最快的。攻击力强大。在白金改版中得到了进一步的强化。',
};

/**
 * ==========================================
 * PokemonInstance 示例
 * ==========================================
 */

/**
 * 特定的烈咬陆鲨实例
 * 模拟一只馆主使用的强化烈咬陆鲨
 *
 * 配置说明:
 * - 等级: 80 (Kaizo 中期BOSS)
 * - 性质: 镇定 (+SpD, -SpA，适合进行防守)
 * - 个体值: 31/31/31/31/31/31 (完美个体)
 * - 努力值: Atk 252 / SpD 252 / Spe 4 (攻击和特防双重强化)
 * - 特性: 沙漠之力 (创造沙暴环境)
 * - 道具: 生命玉 (增加伤害，适合进攻流)
 * - 招式: 地震、逆鳞、石刃、龙舞 (完整的进攻和强化配置)
 */
export const garchompInstance: PokemonInstance = {
  pokemon: garchomp,
  nickname: '暴龙王',
  level: 80,
  nature: 'careful', // +SpD -SpA
  ivs: {
    hp: 31,
    atk: 31,
    def: 31,
    spA: 31,
    spD: 31,
    spe: 31,
  },
  evs: {
    hp: 0,
    atk: 252, // 最大物攻投入
    def: 0,
    spA: 0,
    spD: 252, // 特防投入保证坚韧度
    spe: 4, // 剩余点数用于速度
  },
  heldItem: lifeorb,
  moves: [earthquake, outrage, stoneedge, dragondance],
  gender: 'male',
  isShiny: false,
};

/**
 * ==========================================
 * Trainer (馆主) 示例
 * ==========================================
 */

/**
 * 白金改版馆主示例
 * 展示完整的馆主数据结构
 */
export const firefannyKaizo: Trainer = {
  id: 'trainer-001-firefanny',
  name: '火钰',
  title: '火系馆主',
  location: '火红不知火市',
  background:
    '火红不知火市的火系馆主。以使用火系宝可梦而闻名。在白金改版中，她大幅强化了自己的队伍，运用高端的战术来挑战所有来访者。',
  tactic: {
    title: '沙暴队伍构筑',
    description:
      '核心策略是利用烈咬陆鲨的沙漠之力创造沙暴环境，配合其他宝可梦进行协同作战。烈咬陆鲨作为先手手，通过龙舞提升后进行全面扫荡。队伍中的других宝可梦互相配合制造压力。',
    difficulty: 'hard',
    counters: [
      '使用水系宝可梦攻击其弱点',
      '利用冰系招式克制龙系/地面系',
      '准备防守特化的宝可梦对抗其高攻击力',
      '在沙暴环境中使用天气控制招式',
    ],
  },
  team: [
    garchompInstance, // 烈咬陆鲨 - 核心输出手

    // 第二只：轰焰怪兽（Heatran）- 火/钢双属性，特防强
    {
      pokemon: {
        id: 485,
        name: '轰焰怪兽',
        enName: 'Heatran',
        types: ['fire', 'steel'],
        height: 1.7,
        weight: 430.0,
        baseStats: {
          hp: 91,
          atk: 90,
          def: 106,
          spA: 130,
          spD: 106,
          spe: 77,
        },
        abilities: {
          ability1: {
            id: 'ability-flash-fire',
            name: '引火',
            description: '受到火招式时吸收。火招式的威力上升',
            isHidden: false,
          },
          hidden: {
            id: 'ability-flame-body',
            name: '火焰躯体',
            description: '与宝可梦接触时可能燃烧对手',
            isHidden: true,
          },
        },
        learnset: {
          levelUp: [],
          tmHm: [],
          tutor: [],
          egg: [],
        },
        category: '熔岩宝可梦',
        dexEntry: '地下深处的火山中栖息的宝可梦。',
      } as Pokemon,
      level: 80,
      nature: 'modest', // +SpA -Atk
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spA: 31,
        spD: 31,
        spe: 0,
      },
      evs: {
        hp: 4,
        atk: 0,
        def: 0,
        spA: 252,
        spD: 252,
        spe: 0,
      },
      heldItem: null,
      moves: [
        {
          id: 'move-257',
          name: '喷火',
          type: 'fire',
          category: 'special',
          power: 90,
          accuracy: 100,
          priority: 0,
          description: '喷出烈火进行攻击',
        },
        {
          id: 'move-433',
          name: '闪焰冲锋',
          type: 'fire',
          category: 'physical',
          power: 120,
          accuracy: 100,
          priority: 0,
          description: '冲击对手。自己也会受到伤害。',
        },
        stoneedge,
        {
          id: 'move-414',
          name: '铁头',
          type: 'steel',
          category: 'physical',
          power: 80,
          accuracy: 100,
          priority: 0,
          description: '用头进行铁头冲击',
        },
      ] as [any, any, any, any],
      gender: 'female',
      isShiny: false,
    },

    // 第三只：炎帝（Entei）- 纯火系，攻击型
    {
      pokemon: {
        id: 244,
        name: '炎帝',
        enName: 'Entei',
        types: ['fire', null],
        height: 2.1,
        weight: 198.0,
        baseStats: {
          hp: 115,
          atk: 115,
          def: 85,
          spA: 90,
          spD: 75,
          spe: 100,
        },
        abilities: {
          ability1: {
            id: 'ability-pressure',
            name: '压力',
            description: '增加对手使用的招式 PP 消耗',
            isHidden: false,
          },
        },
        learnset: {
          levelUp: [],
          tmHm: [],
          tutor: [],
          egg: [],
        },
        category: '传说宝可梦',
        dexEntry: '传说中在琉璃岛喷发时奔驰的宝可梦。',
      } as Pokemon,
      level: 80,
      nature: 'jolly', // +Spe -SpA
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spA: 0,
        spD: 31,
        spe: 31,
      },
      evs: {
        hp: 0,
        atk: 252,
        def: 4,
        spA: 0,
        spD: 0,
        spe: 252,
      },
      heldItem: assaultvest,
      moves: [
        {
          id: 'move-110',
          name: '高速移动',
          type: 'psychic',
          category: 'status',
          power: 0,
          accuracy: 100,
          priority: 0,
          description: '速度上升',
        },
        flareblitz,
        stoneedge,
        {
          id: 'move-091',
          name: '暴风',
          type: 'flying',
          category: 'special',
          power: 120,
          accuracy: 70,
          priority: 0,
          description: '凶猛的暴风进行攻击',
        },
      ] as [any, any, any, any],
      gender: 'male',
      isShiny: false,
    },

    // 第四只：烈焰马（Rapidash）
    {
      pokemon: {
        id: 78,
        name: '烈焰马',
        enName: 'Rapidash',
        types: ['fire', null],
        height: 1.7,
        weight: 95.0,
        baseStats: {
          hp: 65,
          atk: 100,
          def: 70,
          spA: 80,
          spD: 80,
          spe: 105,
        },
        abilities: {
          ability1: {
            id: 'ability-run-away',
            name: '逃跑',
            description: '可以逃离野生宝可梦的战斗',
            isHidden: false,
          },
        },
        learnset: {
          levelUp: [],
          tmHm: [],
          tutor: [],
          egg: [],
        },
        category: '烈马宝可梦',
        dexEntry: '能在时速 200 公里的速度下奔驰。',
      } as Pokemon,
      level: 78,
      nature: 'jolly',
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spA: 0,
        spD: 31,
        spe: 31,
      },
      evs: {
        hp: 0,
        atk: 252,
        def: 4,
        spA: 0,
        spD: 0,
        spe: 252,
      },
      heldItem: null,
      moves: [
        flareblitz,
        {
          id: 'move-116',
          name: '火焰驾驭',
          type: 'fire',
          category: 'physical',
          power: 100,
          accuracy: 100,
          priority: 0,
          description: '烈焰驾驭进行攻击',
        },
        {
          id: 'move-161',
          name: '守住',
          type: 'normal',
          category: 'status',
          power: 0,
          accuracy: 100,
          priority: 4,
          description: '一回合内保护自己免受任何攻击',
        },
        stoneedge,
      ] as [any, any, any, any],
      gender: 'male',
      isShiny: false,
    },

    // 第五只：火焰鸡（Blaziken）- 火/格斗
    {
      pokemon: {
        id: 257,
        name: '火焰鸡',
        enName: 'Blaziken',
        types: ['fire', 'fighting'],
        height: 1.9,
        weight: 52.0,
        baseStats: {
          hp: 80,
          atk: 120,
          def: 100,
          spA: 110,
          spD: 100,
          spe: 80,
        },
        abilities: {
          ability1: {
            id: 'ability-blaze',
            name: '火焰之身',
            description: 'HP 减少时火招式的威力上升',
            isHidden: false,
          },
        },
        learnset: {
          levelUp: [],
          tmHm: [],
          tutor: [],
          egg: [],
        },
        category: '火鸡宝可梦',
        dexEntry: '两腿火力十足，一脚能踢裂钢铁。',
      } as Pokemon,
      level: 80,
      nature: 'adamant', // +Atk -SpA
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spA: 0,
        spD: 31,
        spe: 31,
      },
      evs: {
        hp: 0,
        atk: 252,
        def: 4,
        spA: 0,
        spD: 0,
        spe: 252,
      },
      heldItem: lifeorb,
      moves: [
        flareblitz,
        {
          id: 'move-234',
          name: '高速星条',
          type: 'normal',
          category: 'physical',
          power: 75,
          accuracy: 100,
          priority: 2,
          description: '白色的星条进行攻击。必然先制',
        },
        {
          id: 'move-416',
          name: '跳踢',
          type: 'fighting',
          category: 'physical',
          power: 100,
          accuracy: 95,
          priority: 0,
          description: '跳跃并踢击对手',
        },
        stoneedge,
      ] as [any, any, any, any],
      gender: 'female',
      isShiny: false,
    },

    // 第六只：风速狗（Arcanine）- 火系，所有属性均衡
    {
      pokemon: {
        id: 59,
        name: '风速狗',
        enName: 'Arcanine',
        types: ['fire', null],
        height: 1.9,
        weight: 155.0,
        baseStats: {
          hp: 90,
          atk: 110,
          def: 80,
          spA: 100,
          spD: 80,
          spe: 95,
        },
        abilities: {
          ability1: {
            id: 'ability-flash-fire',
            name: '引火',
            description: '受到火招式时吸收',
            isHidden: false,
          },
        },
        learnset: {
          levelUp: [],
          tmHm: [],
          tutor: [],
          egg: [],
        },
        category: '闪焰犬宝可梦',
        dexEntry: '脚底生火，在地面留下焦痕奔驰的样子迪美艳',
      } as Pokemon,
      level: 80,
      nature: 'timid', // +Spe -Atk
      ivs: {
        hp: 31,
        atk: 0,
        def: 31,
        spA: 31,
        spD: 31,
        spe: 31,
      },
      evs: {
        hp: 252,
        atk: 0,
        def: 4,
        spA: 252,
        spD: 0,
        spe: 0,
      },
      heldItem: null,
      moves: [
        {
          id: 'move-226',
          name: '烈焰溅射',
          type: 'fire',
          category: 'special',
          power: 90,
          accuracy: 100,
          priority: 0,
          description: '火焰溅射进行攻击',
        },
        {
          id: 'move-237',
          name: '精神强念',
          type: 'psychic',
          category: 'special',
          power: 90,
          accuracy: 100,
          priority: 0,
          description: '用念力进行攻击',
        },
        {
          id: 'move-311',
          name: '铁尾',
          type: 'steel',
          category: 'physical',
          power: 100,
          accuracy: 75,
          priority: 0,
          description: '用坚硬的尾巴进行攻击',
        },
        {
          id: 'move-073',
          name: '急速冷冻',
          type: 'ice',
          category: 'special',
          power: 40,
          accuracy: 100,
          priority: 0,
          description: '冷气快速冻结对手',
        },
      ] as [any, any, any, any],
      gender: 'male',
      isShiny: false,
    },
  ],
  averageLevel: 79.5,
  recommendedLevel: {
    min: 75,
    max: 85,
  },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2026-03-17T00:00:00Z',
};

/**
 * ==========================================
 * 导出所有示例数据
 * ==========================================
 */

export const samplePokemonData = {
  garchomp,
  garchompInstance,
};

export const sampleTrainerData = {
  firefannyKaizo,
};

export const allSampleData = {
  pokemon: samplePokemonData,
  trainers: sampleTrainerData,
};
