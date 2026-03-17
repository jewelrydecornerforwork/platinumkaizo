/**
 * Kaizo 伤害计算相关类型定义
 * 基于 @smogon/calc 库的扩展
 */

/**
 * 天气类型
 */
export type WeatherType =
  | 'hail'
  | 'rain'
  | 'sandstorm'
  | 'sun'
  | 'null'; // 无天气

/**
 * 场地类型
 */
export type FieldType =
  | 'grassy'
  | 'electric'
  | 'psychic'
  | 'misty'
  | 'null'; // 无场地

/**
 * Pokémon 的回合数标示
 */
export type KnockoutTurns =
  | 'OHKO'  // 一击必杀
  | '2HKO'  // 两回合击杀
  | '3HKO'  // 三回合击杀
  | '4HKO'  // 四回合击杀
  | 'survives'; // 存活（不会被击杀）

/**
 * Kaizo 修正项接口
 * 用于手动调整伤害的特殊规则（如改版中特性的威力翻倍等）
 */
export interface KaizoModifier {
  /** 修正项的唯一标识符 */
  id: string;

  /** 修正项名称（如"鬼火强化"） */
  name: string;

  /** 伤害倍数（1.0 = 无修正，2.0 = 双倍伤害） */
  damageMultiplier: number;

  /** 是否启用此修正项 */
  enabled: boolean;

  /** 修正项的描述 */
  description: string;

  /** 修正项应用的条件（可选） */
  condition?: string;
}

/**
 * Kaizo 特殊规则配置
 * 用于Kaizo版本特有的伤害修改规则
 */
export interface KaizoRules {
  /** Kaizo 修正项列表 */
  modifiers: KaizoModifier[];

  /** 是否启用所有修正项 */
  enableAllModifiers: boolean;

  /** 自定义伤害容错率（0-100）*/
  // 用于模拟实际battle中的随机浮动
  variance?: number;
}

/**
 * 伤害计算的输入参数
 */
export interface DamageCalcInput {
  // ==================== 攻击方信息 ====================
  attacker: {
    /** 宝可梦名称 */
    name: string;
    /** 宝可梦等级 */
    level: number;
    /** 攻击力能力值 */
    atk: number;
    /** 特攻能力值 */
    spA: number;
    /** 特性名称 */
    ability: string;
    /** 道具 */
    item: string;
    /** 性质修正 */
    nature: string;
    /** 技能名称 */
    move: string;
    /** 是否有某些状态（如物攻下降） */
    boosts?: {
      atk?: number;
      spA?: number;
      [key: string]: number | undefined;
    };
  };

  // ==================== 防御方信息 ====================
  defender: {
    /** 宝可梦名称 */
    name: string;
    /** 宝可梦等级 */
    level: number;
    /** 防御力能力值 */
    def: number;
    /** 特防能力值 */
    spD: number;
    /** 特性名称 */
    ability: string;
    /** 道具 */
    item: string;
    /** 当前 HP（用于计算击杀次数） */
    hp: number;
    /** 当前 HP 百分比（可选） */
    hpPercent?: number;
    /** 是否有某些状态（如特防提升） */
    boosts?: {
      def?: number;
      spD?: number;
      [key: string]: number | undefined;
    };
  };

  // ==================== 场地信息 ====================
  /** 当前天气 */
  weather?: WeatherType;

  /** 当前场地 */
  field?: FieldType;

  /** 反射盾是否生效 */
  isReflectActive?: boolean;

  /** 光墙是否生效 */
  isLightScreenActive?: boolean;

  /** 是否为暴击 */
  isCriticalHit?: boolean;

  // ==================== Kaizo 修正 ====================
  /** Kaizo 特殊规则 */
  kaizoRules?: KaizoRules;
}

/**
 * 伤害计算的输出结果
 */
export interface DamageCalcResult {
  // 伤害百分比
  /** 最小伤害百分比 */
  minDamagePercent: number;

  /** 最大伤害百分比 */
  maxDamagePercent: number;

  // 绝对伤害（根据防御方的 HP）
  /** 最小伤害值 */
  minDamage: number;

  /** 最大伤害值 */
  maxDamage: number;

  // 击杀信息
  /** 击杀类型（OHKO/2HKO 等） */
  ko: KnockoutTurns;

  /** 一击必杀的概率（0-100）*/
  ohkoPercent: number;

  /** 两回合击杀的概率 */
  twoHkoPercent: number;

  /** 三回合击杀的概率 */
  threeHkoPercent: number;

  // 详细信息
  /** 防御方是否必定被击杀 */
  guaranteedKO: boolean;

  /** 防御方的剩余 HP 百分比（不被击杀的情况） */
  survivingHPPercent?: number;

  // Kaizo 相关
  /** 应用的修正项列表 */
  appliedModifiers: string[];

  /** 计算的元数据（调试用） */
  metadata?: {
    attackerLevel: number;
    defenderLevel: number;
    basePower: number;
    effectiveness: number;
    modifierTotal: number;
  };
}

/**
 * useKaizoCalc Hook 的状态
 */
export interface UseKaizoCalcState {
  /** 当前的计算结果 */
  result: DamageCalcResult | null;

  /** 是否正在计算 */
  isLoading: boolean;

  /** 计算过程中的错误 */
  error: string | null;

  /** 上次计算的输入参数 */
  lastInput: DamageCalcInput | null;
}

/**
 * useKaizoCalc Hook 的返回值
 */
export interface UseKaizoCalcReturn extends UseKaizoCalcState {
  /** 执行伤害计算的函数 */
  calculate: (input: DamageCalcInput) => Promise<DamageCalcResult>;

  /** 清除计算结果 */
  clear: () => void;

  /** 向计算添加一个 Kaizo 修正项 */
  addModifier: (modifier: KaizoModifier) => void;

  /** 删除一个 Kaizo 修正项 */
  removeModifier: (modifierId: string) => void;

  /** 更新一个 Kaizo 修正项 */
  updateModifier: (modifierId: string, updates: Partial<KaizoModifier>) => void;

  /** 获取当前的修正项列表 */
  getModifiers: () => KaizoModifier[];
}

/**
 * Kaizo 生成击杀信息的帮助函数
 */
export function determineKnockoutTurns(
  maxDamagePercent: number,
): KnockoutTurns {
  if (maxDamagePercent >= 100) {
    return 'OHKO';
  } else if (maxDamagePercent >= 50) {
    return '2HKO';
  } else if (maxDamagePercent >= 33.33) {
    return '3HKO';
  } else if (maxDamagePercent >= 25) {
    return '4HKO';
  } else {
    return 'survives';
  }
}

/**
 * 计算击杀概率
 * 基于最小和最大伤害百分比
 */
export function calculateKOPercentage(
  minPercent: number,
  maxPercent: number,
): {
  ohkoPercent: number;
  twoHkoPercent: number;
  threeHkoPercent: number;
} {
  const ohkoPercent =
    maxPercent >= 100
      ? ((maxPercent - 100) / (maxPercent - minPercent)) * 100
      : 0;

  const twoHkoPercent =
    maxPercent >= 50 && maxPercent < 100
      ? ((maxPercent - 50) / (maxPercent - minPercent)) * 100
      : 0;

  const threeHkoPercent =
    maxPercent >= 33.33 && maxPercent < 50
      ? ((maxPercent - 33.33) / (maxPercent - minPercent)) * 100
      : 0;

  return {
    ohkoPercent: Math.max(0, ohkoPercent),
    twoHkoPercent: Math.max(0, twoHkoPercent),
    threeHkoPercent: Math.max(0, threeHkoPercent),
  };
}
