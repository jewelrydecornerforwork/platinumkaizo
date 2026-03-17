# useKaizoCalc Hook 完整文档

## 概述

`useKaizoCalc` 是一个自定义 React Hook，基于 [@smogon/calc](https://github.com/smogon/damage-calc) 库实现，用于精确计算 Pokémon 对战中的伤害范围、击杀概率和其他相关数据。

该 Hook 专门为 **Platinum Kaizo Wiki** 项目优化，支持 Kaizo 版本特有的伤害修正规则。

---

## 功能特性

### ✨ 核心功能

- **精确伤害计算**：基于官方 Pokémon 伤害公式计算最小和最大伤害
- **击杀概率分析**：计算 OHKO/2HKO/3HKO/4HKO 的击杀概率
- **环境修正**：支持天气（晴朗、下雨、沙暴、冰雹）和场地效果（草地场、电气场、心灵场、薄雾场）
- **类型相性计算**：自动计算攻击技能对防御方的类型相性倍数
- **Kaizo 修正项**：支持自定义伤害修正倍数，用于改版特殊规则
- **完整的 TypeScript 类型**：全面的类型定义和泛型支持

### 🎯 Kaizo 特性

- 可插拔的修正项系统（Add/Remove/Update）
- 支持多个修正项同时激活
- 每个修正项可独立启用/禁用
- 详细的修正项元数据（名称、描述、条件等）

---

## 安装与导入

### 依赖

```json
{
  "dependencies": {
    "@smogon/calc": "^0.6.0",
    "react": "^19.0.0"
  }
}
```

### 基础导入

```typescript
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import { DamageCalcInput, DamageCalcResult } from '@/types/damage';
```

---

## API 参考

### Hook 签名

```typescript
function useKaizoCalc(): UseKaizoCalcReturn
```

### 返回值类型

```typescript
interface UseKaizoCalcReturn {
  // 状态
  result: DamageCalcResult | null;
  isLoading: boolean;
  error: string | null;
  lastInput: DamageCalcInput | null;

  // 方法
  calculate: (input: DamageCalcInput) => Promise<DamageCalcResult>;
  clear: () => void;
  addModifier: (modifier: KaizoModifier) => void;
  removeModifier: (modifierId: string) => void;
  updateModifier: (modifierId: string, updates: Partial<KaizoModifier>) => void;
  getModifiers: () => KaizoModifier[];
}
```

---

## 输入类型 - DamageCalcInput

### 完整示例

```typescript
const input: DamageCalcInput = {
  // 攻击方信息
  attacker: {
    name: '烈咬陆鲨',
    level: 80,
    atk: 180,           // 攻击力能力值
    spA: 120,           // 特攻能力值
    ability: '粗暴',
    item: '人字拖',
    nature: '固执',     // 性质（可修正能力值）
    move: '地震',       // 技能名称
    boosts: {
      atk: 1,          // 攻击力提升 1 阶
      spe: -1,         // 速度下降 1 阶
    },
  },

  // 防御方信息
  defender: {
    name: '烈咬陆鲨',
    level: 80,
    def: 100,           // 防御力能力值
    spD: 100,           // 特防能力值
    ability: '粗暴',
    item: '人字拖',
    hp: 200,            // 当前 HP（用于计算击杀次数）
    hpPercent: 100,     // 当前 HP 百分比（可选）
    boosts: {
      def: 1,          // 防御力提升 1 阶
    },
  },

  // 环境条件
  weather: 'sun',              // 晴朗
  field: 'grassy',             // 草地场
  isReflectActive: false,      // 反射盾
  isLightScreenActive: false,  // 光墙
  isCriticalHit: false,        // 暴击

  // Kaizo 修正
  kaizoRules: {
    modifiers: [
      {
        id: 'ability-boost',
        name: '特性强化：威力提升',
        damageMultiplier: 1.3,
        enabled: true,
        description: 'Kaizo版本中的特性威力翻倍强化',
      },
    ],
    enableAllModifiers: false,
  },
};
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `attacker.name` | `string` | ✓ | 攻击方宝可梦名称 |
| `attacker.level` | `number` | ✓ | 等级 (1-100) |
| `attacker.atk` | `number` | ✓ | 攻击力能力值 |
| `attacker.spA` | `number` | ✓ | 特攻能力值 |
| `attacker.ability` | `string` | ✓ | 特性名称 |
| `attacker.item` | `string` | ✓ | 道具名称 |
| `attacker.nature` | `string` | ✓ | 性质（影响能力值的 1.1 或 0.9 倍） |
| `attacker.move` | `string` | ✓ | 技能名称 |
| `attacker.boosts` | `object` | ✗ | 临时能力值修正 |
| `defender.*` | `object` | ✓ | 防御方信息（结构同攻击方） |
| `defender.hp` | `number` | ✓ | 当前 HP（用于计算百分比） |
| `weather` | `WeatherType` | ✗ | 天气类型 |
| `field` | `FieldType` | ✗ | 场地类型 |
| `kaizoRules` | `KaizoRules` | ✗ | Kaizo 修正规则 |

---

## 输出类型 - DamageCalcResult

### 结果结构

```typescript
interface DamageCalcResult {
  // 伤害百分比（基于防御方的 HP）
  minDamagePercent: number;    // 最小伤害百分比 (0-∞%)
  maxDamagePercent: number;    // 最大伤害百分比

  // 绝对伤害值（HP）
  minDamage: number;           // 最小伤害 HP
  maxDamage: number;           // 最大伤害 HP

  // 击杀信息
  ko: KnockoutTurns;           // 'OHKO' | '2HKO' | '3HKO' | '4HKO' | 'survives'
  ohkoPercent: number;         // 一击必杀的概率 (0-100%)
  twoHkoPercent: number;       // 两回合击杀的概率
  threeHkoPercent: number;     // 三回合击杀的概率

  // 整体信息
  guaranteedKO: boolean;       // 是否确保击杀
  survivingHPPercent?: number; // 防御方存活 HP 百分比（如果不被击杀）

  // Kaizo 相关
  appliedModifiers: string[];  // 已应用的修正项 ID 列表

  // 元数据（调试用）
  metadata?: {
    attackerLevel: number;
    defenderLevel: number;
    basePower: number;          // 技能基础威力
    effectiveness: number;      // 类型相性倍数
    modifierTotal: number;      // 所有修正倍数的乘积
  };
}
```

### 结果示例

```typescript
{
  minDamagePercent: 85.5,
  maxDamagePercent: 100.5,
  minDamage: 171,
  maxDamage: 201,
  ko: 'OHKO',
  ohkoPercent: 95.2,
  guaranteedKO: true,
  appliedModifiers: ['ability-boost'],
  metadata: {
    attackerLevel: 80,
    defenderLevel: 80,
    basePower: 100,
    effectiveness: 1.0,
    modifierTotal: 1.3,
  }
}
```

---

## 使用示例

### 基础使用

```typescript
import { useKaizoCalc } from '@/hooks/useKaizoCalc';

export default function DamageCalculator() {
  const { result, isLoading, calculate, error } = useKaizoCalc();

  const handleCalculate = async () => {
    try {
      const input = {
        attacker: {
          name: '烈咬陆鲨',
          level: 80,
          atk: 180,
          spA: 120,
          ability: '粗暴',
          item: '人字拖',
          nature: '固执',
          move: '地震',
        },
        defender: {
          name: '火帝',
          level: 78,
          def: 100,
          spD: 100,
          ability: '火焰之躯',
          item: '土地云的残骸',
          hp: 180,
        },
      };

      const result = await calculate(input);
      console.log(`伤害范围: ${result.minDamagePercent}% - ${result.maxDamagePercent}%`);
      console.log(`击杀类型: ${result.ko}`);
    } catch (err) {
      console.error('计算失败:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCalculate} disabled={isLoading}>
        {isLoading ? '计算中...' : '计算伤害'}
      </button>

      {result && (
        <div>
          <p>最小伤害: {result.minDamagePercent.toFixed(1)}%</p>
          <p>最大伤害: {result.maxDamagePercent.toFixed(1)}%</p>
          <p>击杀类型: {result.ko}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### 使用 Kaizo 修正项

```typescript
const { result, addModifier, removeModifier, calculate } = useKaizoCalc();

// 添加修正项
addModifier({
  id: 'speed-boost',
  name: '速度强化',
  damageMultiplier: 1.2,
  enabled: true,
  description: '在Kaizo中特定宝可梦的速度提升',
});

// 计算伤害（自动应用启用的修正项）
await calculate(input);

// 移除修正项
removeModifier('speed-boost');
```

### 高级：条件修正项

```typescript
const modifiers: KaizoModifier[] = [
  {
    id: 'weather-boost',
    name: '晴朗下火系技能强化',
    damageMultiplier: 1.5,
    enabled: true,
    description: '晴朗天气下，火系技能的威力提升50%',
    condition: 'weather === "sun" && moveType === "fire"',
  },
  {
    id: 'ability-nerf',
    name: '特性削弱',
    damageMultiplier: 0.8,
    enabled: false,
    description: '模拟某个特性被削弱的伤害降低',
  },
];

// 在组件中管理这些修正项
modifiers.forEach(mod => addModifier(mod));
```

---

## 环境效果详解

### 天气 (WeatherType)

| 天气 | 技能效果 | 代码值 |
|------|---------|--------|
| 晴朗 | 火系技能 ×1.5，水系技能 ×0.5 | `'sun'` |
| 下雨 | 水系技能 ×1.5，火系技能 ×0.5 | `'rain'` |
| 沙暴 | 岩石系技能 ×1.5 | `'sandstorm'` |
| 冰雹 | 冰系技能 ×1.5 | `'hail'` |
| 无 | 无修正 | `'null'` |

### 场地 (FieldType)

| 场地 | 技能效果 | 代码值 |
|------|---------|--------|
| 草地场 | 草系技能 ×1.3 | `'grassy'` |
| 电气场 | 电系技能 ×1.3 | `'electric'` |
| 心灵场 | 超能力系技能 ×1.3 | `'psychic'` |
| 薄雾场 | 龙系技能 ×0.5 | `'misty'` |
| 无 | 无修正 | `'null'` |

---

## Kaizo 修正项接口

### KaizoModifier 结构

```typescript
interface KaizoModifier {
  id: string;                    // 唯一标识符（用于增删改查）
  name: string;                  // 修正项名称（用户可见）
  damageMultiplier: number;      // 伤害倍数（1.0 = 无修正）
  enabled: boolean;              // 是否激活
  description: string;           // 修正项描述
  condition?: string;            // 应用条件（可选）
}
```

### 常见 Kaizo 修正项示例

```typescript
// 特性强化
{
  id: 'ability-marvel-scale',
  name: '奇迹鳞片强化',
  damageMultiplier: 1.2,
  enabled: true,
  description: '烈咬陆鲨的奇迹鳞片在Kaizo中威力提升20%',
}

// 技能威力调整
{
  id: 'move-earthquake-buff',
  name: '地震威力增强',
  damageMultiplier: 1.15,
  enabled: true,
  description: '地震的基础威力从100增加到115',
}

// 属性修正
{
  id: 'type-dual-stab',
  name: '双属性同源加成',
  damageMultiplier: 1.25,
  enabled: false,
  description: '同时拥有技能属性的宝可梦，同源加成倍数提升至1.25',
}

// 禁用特定机制
{
  id: 'no-weakness',
  name: '弱点类型削弱',
  damageMultiplier: 0.75,
  enabled: false,
  description: '此宝可梦的伤害削弱因为变更的弱点类型',
}
```

---

## 性质修正表

宝可梦的性质会对能力值产生 ±10% 的修正（不影响 HP）：

### 提升能力值的性质

| 性质 | 提升 | 降低 |
|------|------|------|
| 固执 (Adamant) | 攻击 | 特攻 |
| 粗暴 (Brave) | 攻击 | 速度 |
| 威严 (Lonely) | 攻击 | 防御 |
| 淘气 (Naughty) | 攻击 | 特防 |
| 胆小 (Timid) | 速度 | 攻击 |
| 温和 (Modest) | 特攻 | 攻击 |
| 内敛 (Quiet) | 特攻 | 速度 |
| 谨慎 (Careful) | 特防 | 特攻 |
| ... 等等 |  |  |

> 注：完整的性质修正需要根据完整的性质表实现

---

## 错误处理

### 常见错误情况

```typescript
const { calculate, error } = useKaizoCalc();

try {
  await calculate(input);
} catch (err) {
  if (error?.includes('宝可梦数据不存在')) {
    // 处理宝可梦未找到
  } else if (error?.includes('等级超出范围')) {
    // 处理等级错误
  } else if (error?.includes('伤害公式计算失败')) {
    // 处理计算错误
  }
}
```

---

## 性能优化

### 使用 React.memo 缓存组件

```typescript
const DamageDisplay = React.memo(({ result }: { result: DamageCalcResult }) => {
  return <div>{result.maxDamagePercent}%</div>;
});
```

### 避免频繁重新计算

```typescript
import { useCallback, useMemo } from 'react';

const { calculate } = useKaizoCalc();

const memoizedCalculate = useCallback(async (input) => {
  return calculate(input);
}, [calculate]);

// 仅在输入改变时重新计算
const cachedResult = useMemo(async () => {
  if (!needsRecalculation) return lastResult;
  return memoizedCalculate(input);
}, [input, lastResult, needsRecalculation]);
```

---

## 与 @smogon/calc 集成

### 当前实现

目前的实现提供了一个简化版本的伤害计算。要完全集成 @smogon/calc 库，请按以下步骤操作：

#### 1. 更新 Hook 中的导入

```typescript
import { Damage, Field, Weather, Boosts, Sides } from '@smogon/calc';
import { pokemonIndex, itemIndex, moveIndex, abilityIndex } from '@smogon/calc';
```

#### 2. 实现完整的 Smogon 伤害计算

```typescript
function calculateWithSmogon(input: DamageCalcInput): {
  minDamage: number;
  maxDamage: number;
  effectiveness: number;
} {
  // 创建攻击方
  const attacker = new Damage.Pokemon(
    pokemonIndex[input.attacker.name],
    {
      level: input.attacker.level,
      nature: input.attacker.nature,
      evs: { /* 数据 */ },
      ivs: { /* 数据 */ },
      item: itemIndex[input.attacker.item],
      ability: abilityIndex[input.attacker.ability],
    }
  );

  // 创建防御方
  const defender = new Damage.Pokemon(
    pokemonIndex[input.defender.name],
    { /* 配置 */ }
  );

  // 创建技能
  const move = moveIndex[input.attacker.move];

  // 执行计算
  const damage = new Damage(attacker, defender, move, {
    weather: input.weather,
    field: input.field,
  });

  return {
    minDamage: damage.min(),
    maxDamage: damage.max(),
    effectiveness: damage.effectiveness(),
  };
}
```

#### 3. 在 Hook 中使用

```typescript
// 在 calculate 函数中替换 calculateBaseDamage 的调用
const { minDamage: baseMinDamage, maxDamage: baseMaxDamage, effectiveness } = 
  calculateWithSmogon(input);
```

---

## 完整工作流示例

```typescript
'use client';

import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import { DamageCalcInput } from '@/types/damage';
import { useState } from 'react';

export default function AdvancedCalculator() {
  const {
    result,
    isLoading,
    error,
    calculate,
    addModifier,
    removeModifier,
    getModifiers,
    clear,
  } = useKaizoCalc();

  const [selectedAttacker, setSelectedAttacker] = useState('烈咬陆鲨');
  const [selectedDefender, setSelectedDefender] = useState('火帝');

  // 初始化 Kaizo 修正项
  const initializeModifiers = () => {
    clear();
    
    [
      {
        id: 'kaizo-ability-1',
        name: '烈咬陆鲨 - 粗暴提升',
        damageMultiplier: 1.15,
        enabled: true,
        description: 'Kaizo版中粗暴特性的威力提升',
      },
      {
        id: 'kaizo-speed-1',
        name: '火帝 - 速度调整',
        damageMultiplier: 0.95,
        enabled: false,
        description: '火帝的速度在Kaizo中被削弱',
      },
    ].forEach(mod => addModifier(mod));
  };

  const handleCalculate = async () => {
    const input: DamageCalcInput = {
      attacker: {
        name: selectedAttacker,
        level: 80,
        atk: 180,
        spA: 120,
        ability: '粗暴',
        item: '人字拖',
        nature: '固执',
        move: '地震',
      },
      defender: {
        name: selectedDefender,
        level: 78,
        def: 100,
        spD: 100,
        ability: '火焰之躯',
        item: '土地云的残骸',
        hp: 180,
      },
      weather: 'sun',
      field: 'grassy',
      kaizoRules: {
        modifiers: getModifiers(),
        enableAllModifiers: false,
      },
    };

    try {
      await calculate(input);
    } catch (err) {
      console.error('伤害计算失败:', err);
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">高级伤害计算器</h1>

      {/* 控制面板 */}
      <div className="space-y-4 mb-6">
        <button
          onClick={initializeModifiers}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          初始化修正项
        </button>

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '计算中...' : '计算伤害'}
        </button>

        <button
          onClick={clear}
          className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
        >
          清除结果
        </button>
      </div>

      {/* 修正项列表 */}
      <div className="mb-6 p-4 bg-slate-800 rounded">
        <h3 className="font-bold text-white mb-2">激活的修正项</h3>
        {getModifiers().length === 0 ? (
          <p className="text-slate-400">无</p>
        ) : (
          <ul className="space-y-1">
            {getModifiers()
              .filter(m => m.enabled)
              .map(m => (
                <li key={m.id} className="text-emerald-400 text-sm">
                  • {m.name} (×{m.damageMultiplier})
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* 结果显示 */}
      {result && (
        <div className="p-4 bg-slate-800 rounded border border-emerald-500">
          <h3 className="font-bold text-white mb-3">计算结果</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-400">伤害范围：</dt>
              <dd className="text-emerald-400 font-mono">
                {result.minDamagePercent.toFixed(1)}% - {result.maxDamagePercent.toFixed(1)}%
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">绝对伤害：</dt>
              <dd className="text-emerald-400 font-mono">
                {result.minDamage} - {result.maxDamage} HP
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">击杀类型：</dt>
              <dd className="text-emerald-400 font-bold text-base">{result.ko}</dd>
            </div>
            <div>
              <dt className="text-slate-400">确保击杀：</dt>
              <dd className={result.guaranteedKO ? 'text-red-400' : 'text-slate-400'}>
                {result.guaranteedKO ? '是 ✓' : '否'}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded text-red-400">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
```

---

## 测试用例

### 单元测试 (Jest)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';

describe('useKaizoCalc', () => {
  it('should calculate basic damage', async () => {
    const { result } = renderHook(() => useKaizoCalc());

    const input = {
      attacker: {
        name: '烈咬陆鲨',
        level: 80,
        atk: 180,
        spA: 120,
        ability: '粗暴',
        item: '人字拖',
        nature: '固执',
        move: '地震',
      },
      defender: {
        name: '火帝',
        level: 78,
        def: 100,
        spD: 100,
        ability: '火焰之躯',
        item: '土地云的残骸',
        hp: 180,
      },
    };

    await act(async () => {
      await result.current.calculate(input);
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.maxDamagePercent).toBeGreaterThan(0);
  });

  it('should apply kaizo modifiers', async () => {
    const { result } = renderHook(() => useKaizoCalc());

    act(() => {
      result.current.addModifier({
        id: 'test-modifier',
        name: 'Test',
        damageMultiplier: 2.0,
        enabled: true,
        description: 'Test modifier that doubles damage',
      });
    });

    expect(result.current.getModifiers()).toHaveLength(1);
    expect(result.current.getModifiers()[0].damageMultiplier).toBe(2.0);
  });
});
```

---

## 常见问题

### Q: 为什么伤害计算不准确？

**A:** 当前的 Hook 使用了简化的伤害公式。要获得完全准确的结果，请按照 "与 @smogon/calc 集成" 章节集成完整的 Smogon 库。

### Q: 如何添加新的 Kaizo 修正项？

**A:** 使用 `addModifier()` 方法：

```typescript
const { addModifier } = useKaizoCalc();

addModifier({
  id: 'new-modifier',
  name: '新的修正项',
  damageMultiplier: 1.25,
  enabled: true,
  description: '新增的Kaizo特殊规则',
});
```

### Q: 性质修正如何计算？

**A:** 性质对除 HP 以外的能力值造成 ±10% 的修正。在输入数据时，`attacker.atk` 和 `defender.def` 等字段应该已经包含了性质修正。

### Q: 能否支持多技能对比？

**A:** 可以。在组件中多次调用 `calculate()` 函数，每次使用不同的 `attacker.move` 值。

---

## 相关链接

- [Smogon Damage Calculator](https://github.com/smogon/damage-calc)
- [Pokémon Damage Formula 官方文档](https://bulbapedia.bulbagarden.net/wiki/Damage)
- [Platinum Kaizo Wiki](/)

---

## 版本历史

### v1.0.0 (当前)
- ✅ 基础伤害计算
- ✅ 天气和场地效果
- ✅ Kaizo 修正项系统
- ✅ 击杀概率分析
- ✅ 完整的 TypeScript 支持

### 计划中
- 🔲 完整的 @smogon/calc 集成
- 🔲 更详细的类型相性表
- 🔲 性质修正自动计算
- 🔲 IV/EV 配置面板
- 🔲 多技能对比分析
- 🔲 团队覆盖分析

---

## 许可证

MIT

---

## 作者

Platinum Kaizo Wiki 开发团队

