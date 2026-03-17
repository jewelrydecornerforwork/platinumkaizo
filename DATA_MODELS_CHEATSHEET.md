# 📋 数据模型速查表 (Cheat Sheet)

## 快速导入

```typescript
// 导入所有类型
import type { Pokemon, PokemonInstance, Trainer } from '@/types';

// 导入示例数据
import { garchompInstance, firefannyKaizo } from '@/data/sampleData';

// 导入工具函数
import { getPokemonStats, formatPokemonInfo } from '@/lib/pokeUtils';

// 或使用统一导出
import { garchompInstance, getPokemonStats } from '@/data/exports';
```

---

## 📐 数据结构速查

### Move (招式)

```typescript
const exampleMove: Move = {
  id: 'move-089',
  name: '地震',
  type: 'ground',
  category: 'physical', // 'physical' | 'special' | 'status'
  power: 100,           // 0 表示变化招式
  accuracy: 100,        // 0-100，0 表示必中
  priority: 0,          // 优先级
  description: '...'
};
```

### Ability (特性)

```typescript
const exampleAbility: Ability = {
  id: 'ability-045',
  name: '沙漠之力',
  description: '...',
  isHidden: false      // 是否为隐藏特性
};
```

### Item (道具)

```typescript
const exampleItem: Item = {
  id: 'item-270',
  name: '生命玉',
  category: 'held-item', // 'held-item' | 'berry' | ... 
  description: '...'
};
```

### BaseStats (基础属性值)

```typescript
const exampleStats: BaseStats = {
  hp: 108,    // 体力值
  atk: 130,   // 物理攻击
  def: 95,    // 物理防御
  spA: 80,    // 特殊攻击
  spD: 85,    // 特殊防御
  spe: 110    // 速度
};
```

### Pokemon (宝可梦基础定义)

```typescript
const examplePokemon: Pokemon = {
  id: 445,
  name: '烈咬陆鲨',
  enName: 'Garchomp',
  types: ['dragon', 'ground'],
  height: 1.9,
  weight: 95.0,
  baseStats: { /* BaseStats */ },
  abilities: {
    ability1: { /* Ability */ },
    ability2: { /* Ability */ },        // 可选
    hidden: { /* Ability */ }           // 可选
  },
  learnset: {
    levelUp: [{ level: 1, move: {} }],  // 升级学习
    tmHm: [],                           // TM/HM 教学
    tutor: [],                          // 招式教学
    egg: []                             // 蛋招式
  },
  category: '龙宝可梦',
  dexEntry: '...'
};
```

### PokemonInstance (宝可梦实例/队伍中的宝可梦)

```typescript
const exampleInstance: PokemonInstance = {
  pokemon: { /* Pokemon 对象引用 */ },
  nickname: '暴龙王',           // 可选昵称
  level: 80,                    // 1-100
  nature: 'careful',            // 性质（25 种）
  ivs: {                        // 个体值 (0-31)
    hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31
  },
  evs: {                        // 努力值 (总和 ≤ 510)
    hp: 0, atk: 252, def: 0, spA: 0, spD: 252, spe: 4
  },
  heldItem: { /* Item */ },     // 携带道具，null 表示无
  moves: [
    { /* Move 1 */ },
    { /* Move 2 */ },
    { /* Move 3 */ },
    { /* Move 4 */ }
  ],
  gender: 'male',               // 可选：'male' | 'female'
  isShiny: false                // 闪光
};
```

### Trainer (馆主)

```typescript
const exampleTrainer: Trainer = {
  id: 'trainer-001',
  name: '火钰',
  title: '火系馆主',
  location: '不知火市',
  background: '...',
  tactic: {
    title: '沙暴队伍构筑',
    description: '...',
    difficulty: 'hard',           // 'easy' | 'normal' | 'hard' | 'very-hard'
    counters: ['...', '...']       // 对抗策略列表
  },
  team: [
    { /* PokemonInstance 1 */ },
    { /* PokemonInstance 2 */ },
    { /* PokemonInstance 3 */ },
    { /* PokemonInstance 4 */ },
    { /* PokemonInstance 5 */ },
    { /* PokemonInstance 6 */ }
  ],
  averageLevel: 79.5,
  recommendedLevel: { min: 75, max: 85 },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2026-03-17T00:00:00Z'
};
```

---

## 🔧 工具函数速查

### 能力值计算

```typescript
// 计算单个能力值
const atk = calculateStat(130, 31, 252, 80, 'adamant');
// 参数：(基础值, 个体值, 努力值, 等级, 性质)
// 返回：大约 258

// 计算 HP（特殊公式）
const hp = calculateHP(108, 31, 0, 80);
// 返回：大约 191

// 获取整个实例的所有能力值
const stats = getPokemonStats(garchompInstance);
// 返回：{ hp: 191, atk: 258, def: 185, spA: 139, spD: 199, spe: 188 }
```

### 伤害计算

```typescript
// 简化伤害计算
const damage = calculateBaseDamage(attacker, defender, moveIndex);
// 参数：(攻击者实例, 防守者实例, 招式索引 0-3)
// 返回：{ min: 123, max: 145, ohko: false }
```

### 克制关系

```typescript
// 获取属性优劣
const advantage = getTypeAdvantage(['dragon', 'ground']);
// 返回：{
//   advantages: ['grass', 'bug', 'steel', ...],  // 克制这些属性
//   weaknesses: ['ice', 'dragon', 'fairy', ...] // 被这些属性克制
// }
```

### 数据验证

```typescript
// 验证宝可梦实例的完整性
const validation = validatePokemonInstance(instance);
// 返回：{
//   valid: true,
//   errors: []
// }
```

### 数据序列化

```typescript
// 转换为 JSON 字符串
const json = serializePokemonInstance(instance);

// 格式化为可读文本
const info = formatPokemonInfo(instance);
console.log(info);
```

---

## 🔷 属性类型列表

```typescript
type PokemonType =
  | 'normal'    // 一般
  | 'fire'      // 火系
  | 'water'     // 水系
  | 'grass'     // 草系
  | 'electric'  // 电系
  | 'ice'       // 冰系
  | 'fighting'  // 格斗系
  | 'poison'    // 毒系
  | 'ground'    // 地面系
  | 'flying'    // 飞行系
  | 'psychic'   // 超能力系
  | 'bug'       // 虫系
  | 'rock'      // 岩石系
  | 'ghost'     // 幽灵系
  | 'dragon'    // 龙系
  | 'dark'      // 恶系
  | 'steel'     // 钢系
  | 'fairy';    // 妖精系
```

---

## 🎲 性质列表 (Nature)

| 名称 | 增加 | 减少 |
|------|------|------|
| hardy | 无 | 无 |
| lonely | Atk↑ | Def↓ |
| brave | Atk↑ | Spe↓ |
| adamant | Atk↑ | SpA↓ |
| naughty | Atk↑ | SpD↓ |
| bold | Def↑ | Atk↓ |
| docile | 无 | 无 |
| relaxed | Def↑ | Spe↓ |
| impish | Def↑ | SpA↓ |
| lax | Def↑ | SpD↓ |
| timid | Spe↑ | Atk↓ |
| hasty | Spe↑ | Def↓ |
| serious | 无 | 无 |
| jolly | Spe↑ | SpA↓ |
| naive | Spe↑ | SpD↓ |
| modest | SpA↑ | Atk↓ |
| mild | SpA↑ | Def↓ |
| quiet | SpA↑ | Spe↓ |
| bashful | 无 | 无 |
| rash | SpA↑ | SpD↓ |
| calm | SpD↑ | Atk↓ |
| gentle | SpD↑ | Def↓ |
| sassy | SpD↑ | Spe↓ |
| careful | SpD↑ | SpA↓ |
| quirky | 无 | 无 |

---

## 📊 烈咬陆鲨 (Garchomp) 数据速查

### 基础数据
```
ID: 445
名称: 烈咬陆鲨 (Garchomp)
属性: 龙/地面
身高: 1.9m | 体重: 95.0kg
```

### 基础属性值
```
HP:  108 | Atk: 130 | Def: 95
SpA: 80  | SpD: 85  | Spe: 110 ⭐ (Kaizo 改版加强)
总和: 608
```

### 可用特性
- **沙漠之力** (一般): 登场时变沙暴，沙暴时岩系特防↑
- **粗糙皮肤** (一般): 接触时对手受伤
- **鲨鱼皮** (隐藏): 下雨时回复异常状态

### 推荐配置
```
性质: Adamant / Careful
等级: 75-85（对标馆主）
EV: 252 Atk / 252 SpD / 4 Spe (Careful 时)
IV: 31/31/31/0/31/31 (Careful 特防强化)
道具: 生命玉 / 气息腰带 / 沙岩石
招式: 地震 / 逆鳞 / 石刃 / 龙舞
```

### 能力值计算示例 (Lv80, Careful, 252 Atk / 252 SpD)
```
HP:  191
Atk: 258  (130*2 + 31 + 63) × 80/100 + 5 ≈ 258
Def: 185
SpA: 139  (降低)
SpD: 199-210 (提升)
Spe: 188
```

---

## 🎯 常见操作代码片段

### 获取宝可梦的完整信息

```typescript
import { garchompInstance, getPokemonStats, formatPokemonInfo } from '@/data/exports';

// 方法 1：获取能力值对象
const stats = getPokemonStats(garchompInstance);
console.log(`Lv.${garchompInstance.level} - Atk: ${stats.atk}`);

// 方法 2：获取格式化文本
const info = formatPokemonInfo(garchompInstance);
console.log(info);
```

### 计算伤害

```typescript
import { calculateBaseDamage } from '@/lib/pokeUtils';

const result = calculateBaseDamage(garchompInstance, targetInstance, 0);
console.log(`地震伤害: ${result.min}-${result.max}`);
if (result.ohko) console.log('✓ 一击必杀！');
```

### 检查属性克制

```typescript
import { getTypeAdvantage } from '@/lib/pokeUtils';

const { advantages, weaknesses } = getTypeAdvantage(
  garchompInstance.pokemon.types
);
console.log('克制:', advantages);
console.log('被克制:', weaknesses);
```

### 创建新的宝可梦实例

```typescript
import { garchomp } from '@/data/sampleData';
import type { PokemonInstance } from '@/types';

const myGarchomp: PokemonInstance = {
  pokemon: garchomp,
  nickname: '我的烈咬陆鲨',
  level: 80,
  nature: 'adamant',
  ivs: { hp: 31, atk: 31, def: 31, spA: 0, spD: 31, spe: 31 },
  evs: { hp: 0, atk: 252, def: 4, spA: 0, spD: 0, spe: 252 },
  heldItem: null,
  moves: [ /* 4 个 Move 对象 */ ],
  gender: 'male',
  isShiny: false
};
```

---

## 📂 文件位置速查

| 内容 | 位置 |
|------|------|
| 类型定义 | `src/types/index.ts` |
| 示例数据 | `src/data/sampleData.ts` |
| 工具函数 | `src/lib/pokeUtils.ts` |
| 统一导出 | `src/data/exports.ts` |
| 完整文档 | `DATA_MODELS.md` |

---

## 💡 最佳实践

✅ **DO**
```typescript
// 导入类型
import type { PokemonInstance } from '@/types';

// 验证数据
const { valid } = validatePokemonInstance(instance);

// 使用工具函数计算
const stats = getPokemonStats(instance);

// 类型安全的访问
console.log(instance.pokemon.name);
```

❌ **DON'T**
```typescript
// 不要硬编码数据
const statStr = '191|258|185|139|199|188';

// 不要跳过验证
if (instance.level > 0) { /* 不够安全 */ }

// 不要访问可能不存在的字段
const nickname = instance.pokemon; // 应该用 instance.nickname

// 不要修改游戏规则
instance.evs.hp = 600; // EV 不能超 510！
```

---

**现在你已掌握了完整的数据模型系统！** 🚀
