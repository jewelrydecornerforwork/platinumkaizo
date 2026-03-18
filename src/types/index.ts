/**
 * ==========================================
 * 导航和 UI 类型定义
 * ==========================================
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export interface TrainerPokemonIntel {
  id: string;
  name: string;
  enName: string;
  level: string;
  role: string;
  ability: string;
  nature: string;
  item: string;
  note: string;
  tactic: string;
  moves: string[];
  stats: BaseStats;
}

export interface TrainerIntelProfile {
  id: string;
  code: string;
  name: string;
  specialty: string;
  intel: string;
  threatLevel: number;
  portraitLabel: string;
  recommendation: string;
  primaryColor: string;
  silhouetteAsset: string;
  pokemon: TrainerPokemonIntel[];
}

/**
 * ==========================================
 * 宝可梦和训练师数据类型定义
 * ==========================================
 */

/**
 * 宝可梦的属性类型
 * @example
 * - 'normal' | 'fire' | 'water' | 'grass' | 'electric'
 * - 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
 * - 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'
 */
export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

/**
 * 宝可梦的性质 (Nature)
 * 影响两个能力值的成长
 */
export type Nature =
  | 'hardy'
  | 'lonely'
  | 'brave'
  | 'adamant'
  | 'naughty'
  | 'bold'
  | 'docile'
  | 'relaxed'
  | 'impish'
  | 'lax'
  | 'timid'
  | 'hasty'
  | 'serious'
  | 'jolly'
  | 'naive'
  | 'modest'
  | 'mild'
  | 'quiet'
  | 'bashful'
  | 'rash'
  | 'calm'
  | 'gentle'
  | 'sassy'
  | 'careful'
  | 'quirky';

/**
 * 宝可梦的基础属性值 (Base Stats)
 * 决定了宝可梦的核心能力值
 */
export interface BaseStats {
  /** 体力值 (Hit Points) */
  hp: number;
  /** 物理攻击 (Attack) */
  atk: number;
  /** 物理防御 (Defense) */
  def: number;
  /** 特殊攻击 (Special Attack) */
  spA: number;
  /** 特殊防御 (Special Defense) */
  spD: number;
  /** 速度 (Speed) */
  spe: number;
}

/**
 * 宝可梦的个体值配置 (Individual Values)
 * 游戏中每只宝可梦都有随机或自定义的个体值
 */
export interface IVs {
  hp: number;
  atk: number;
  def: number;
  spA: number;
  spD: number;
  spe: number;
}

/**
 * 宝可梦的努力值配置 (Effort Values / EVs)
 * 通过对战和特定项目获得
 */
export interface EVs {
  hp: number;
  atk: number;
  def: number;
  spA: number;
  spD: number;
  spe: number;
}

/**
 * 宝可梦的招式数据
 * 包含招式名称、属性、分类和威力
 */
export interface Move {
  /** 招式唯一标识符 */
  id: string;
  /** 招式名称 (如 "地震") */
  name: string;
  /** 招式属性 (如 "ground") */
  type: PokemonType;
  /** 招式分类: 物理/特殊/变化 */
  category: 'physical' | 'special' | 'status';
  /** 招式威力 (0 表示变化招式) */
  power: number;
  /** 命中率 (0-100, 0 表示必中) */
  accuracy: number;
  /** 招式优先级 */
  priority: number;
  /** 招式简介 */
  description: string;
}

/**
 * 特性数据
 * 宝可梦在战斗中的被动能力
 */
export interface Ability {
  /** 特性唯一标识符 */
  id: string;
  /** 特性名称 (如 "沙漠之力") */
  name: string;
  /** 特性效果描述 */
  description: string;
  /** 是否为隐藏特性 */
  isHidden: boolean;
}

/**
 * 物品数据
 * 宝可梦携带的道具
 */
export interface Item {
  /** 物品唯一标识符 */
  id: string;
  /** 物品名称 (如 "生命玉") */
  name: string;
  /** 物品分类 */
  category:
    | 'held-item'
    | 'berry'
    | 'evolution-item'
    | 'stat-boosting'
    | 'other';
  /** 物品效果描述 */
  description: string;
}

/**
 * 宝可梦核心数据模型
 * 代表游戏中的一只宝可梦及其所有属性
 */
export interface Pokemon {
  /** 宝可梦国家图鉴编号 */
  id: number;
  /** 宝可梦名称 (如 "烈咬陆鲨") */
  name: string;
  /** 英文名称 (如 "Garchomp") */
  enName: string;
  /** 宝可梦的属性 (单或双属性) */
  types: [PokemonType, PokemonType | null];
  /** 宝可梦的身高 (米) */
  height: number;
  /** 宝可梦的体重 (千克) */
  weight: number;
  /** 宝可梦的基础属性值 */
  baseStats: BaseStats;
  /** 宝可梦的所有可用特性 */
  abilities: {
    /** 常规特性 1 */
    ability1: Ability;
    /** 常规特性 2 (可选) */
    ability2?: Ability;
    /** 隐藏特性 (可选) */
    hidden?: Ability;
  };
  /** 宝可梦可学习的所有招式 */
  learnset: {
    /** 升级学习的招式 */
    levelUp: Array<{ level: number; move: Move }>;
    /** 通过招式学习器学习的招式 */
    tmHm: Move[];
    /** 通过转移学习的招式 */
    tutor: Move[];
    /** 蛋招式 */
    egg: Move[];
  };
  /** 宝可梦的分类描述 */
  category: string;
  /** 宝可梦的图鉴描述 */
  dexEntry: string;
}

/**
 * 宝可梦队伍中的实例数据
 * 包含具体的等级、性质、个体值、努力值等
 */
export interface PokemonInstance {
  /** Pokemon 的基础定义 (引用) */
  pokemon: Pokemon;
  /** 此宝可梦实例的昵称 (可选) */
  nickname?: string;
  /** 宝可梦的当前等级 (1-100) */
  level: number;
  /** 宝可梦的性质 */
  nature: Nature;
  /** 宝可梦的个体值 */
  ivs: IVs;
  /** 宝可梦的努力值 */
  evs: EVs;
  /** 宝可梦携带的道具 */
  heldItem: Item | null;
  /** 宝可梦当前学习的 4 个招式 */
  moves: [Move, Move, Move, Move];
  /** 宝可梦的性别 (可选，某些宝可梦无性别) */
  gender?: 'male' | 'female';
  /** 是否为闪光宝可梦 */
  isShiny: boolean;
}

/**
 * Kaizo 馆主的战术分析
 * 描述馆主的战斗策略和特点
 */
export interface TrainerTactic {
  /** 战术的简短标题 */
  title: string;
  /** 战术的详细描述 */
  description: string;
  /** 战术的难度等级 */
  difficulty: 'easy' | 'normal' | 'hard' | 'very-hard';
  /** 推荐的对抗策略 */
  counters: string[];
}

/**
 * Kaizo 馆主数据模型
 * 专门用于代表改版中的强化馆主
 */
export interface Trainer {
  /** 馆主的唯一标识符 */
  id: string;
  /** 馆主的名称 (如 "火钰") */
  name: string;
  /** 馆主的馆徽/职务 (如 "火系馆主") */
  title: string;
  /** 馆主所在的城市 */
  location: string;
  /** 馆主的个人背景描述 */
  background: string;
  /** 馆主的战术分析 */
  tactic: TrainerTactic;
  /** 馆主携带的 6 只宝可梦队伍 */
  team: [
    PokemonInstance,
    PokemonInstance,
    PokemonInstance,
    PokemonInstance,
    PokemonInstance,
    PokemonInstance
  ];
  /** 馆主队伍的平均等级 */
  averageLevel: number;
  /** 馆主的推荐等级范围 */
  recommendedLevel: {
    min: number;
    max: number;
  };
  /** 馆主的生成时间戳（用于记录修改历史）*/
  createdAt: string;
  /** 上次修改时间*/
  updatedAt: string;
}

/**
 * ==========================================
 * 伤害计算相关类型定义 (从 types/damage.ts 导出)
 * ==========================================
 */

export type {
  WeatherType,
  FieldType,
  KnockoutTurns,
  KaizoModifier,
  KaizoRules,
  DamageCalcInput,
  DamageCalcResult,
  UseKaizoCalcState,
  UseKaizoCalcReturn,
} from './damage';

export {
  determineKnockoutTurns,
  calculateKOPercentage,
} from './damage';
