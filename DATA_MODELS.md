# 📊 数据模型 (Data Models) 使用指南

## 概述

该项目包含完整的 TypeScript 数据模型，用于表示 Pokémon 及其在 Kaizo 改版中的各种信息。所有数据模型都定义在 `src/types/index.ts` 中，示例数据存放在 `src/data/sampleData.ts`。

---

## 🔷 核心数据模型

### 1. **PokemonType** - 宝可梦属性

```typescript
type PokemonType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric'
  | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
  | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon'
  | 'dark' | 'steel' | 'fairy';
```

宝可梦可拥有 1 个或 2 个属性。

### 2. **BaseStats** - 基础属性值

```typescript
interface BaseStats {
  hp: number;      // 体力值
  atk: number;     // 物理攻击
  def: number;     // 物理防御
  spA: number;     // 特殊攻击
  spD: number;     // 特殊防御
  spe: number;     // 速度
}
```

这些值决定了宝可梦的核心能力。

### 3. **Move** - 招式

```typescript
interface Move {
  id: string;
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power: number;           // 0 表示变化招式
  accuracy: number;        // 0-100
  priority: number;
  description: string;
}
```

**示例：地震**
```json
{
  "id": "move-089",
  "name": "地震",
  "type": "ground",
  "category": "physical",
  "power": 100,
  "accuracy": 100,
  "priority": 0,
  "description": "通过地面振动，对周围所有的宝可梦造成伤害"
}
```

### 4. **Ability** - 特性

```typescript
interface Ability {
  id: string;
  name: string;
  description: string;
  isHidden: boolean;
}
```

**示例：沙漠之力**
```json
{
  "id": "ability-045",
  "name": "沙漠之力",
  "description": "登场时天气变为沙暴。砂暴状态下岩石系宝可梦的特防上升",
  "isHidden": false
}
```

### 5. **Item** - 道具

```typescript
interface Item {
  id: string;
  name: string;
  category:
    | 'held-item'
    | 'berry'
    | 'evolution-item'
    | 'stat-boosting'
    | 'other';
  description: string;
}
```

**示例：生命玉**
```json
{
  "id": "item-270",
  "name": "生命玉",
  "category": "held-item",
  "description": "增加招式威力，但每次攻击后损失 10% HP"
}
```

### 6. **Pokemon** - 宝可梦基础定义

```typescript
interface Pokemon {
  id: number;                      // 国家图鉴编号
  name: string;                    // 中文名称
  enName: string;                  // 英文名称
  types: [PokemonType, PokemonType | null];  // 属性
  height: number;                  // 身高 (米)
  weight: number;                  // 体重 (斤)
  baseStats: BaseStats;            // 基础属性值
  abilities: {                      // 可用特性
    ability1: Ability;
    ability2?: Ability;
    hidden?: Ability;
  };
  learnset: {                       // 可学习招式
    levelUp: Array<{ level: number; move: Move }>;
    tmHm: Move[];
    tutor: Move[];
    egg: Move[];
  };
  category: string;                 // 分类描述
  dexEntry: string;                 // 图鉴描述
}
```

---

## 🎮 烈咬陆鲨 (Garchomp) 完整 JSON 示例

### Kaizo 改版特征

白金改版中烈咬陆鲨得到了强化：
- **原始速度**: 102
- **改版速度**: 110 (+8 点种族值)

这使其在对阵中更容易抢先行动。

### 完整定义

```json
{
  "id": 445,
  "name": "烈咬陆鲨",
  "enName": "Garchomp",
  "types": ["dragon", "ground"],
  "height": 1.9,
  "weight": 95.0,
  "baseStats": {
    "hp": 108,
    "atk": 130,
    "def": 95,
    "spA": 80,
    "spD": 85,
    "spe": 110,
    "comment": "改版调整：速度从 102 提升到 110"
  },
  "abilities": {
    "ability1": {
      "id": "ability-045",
      "name": "沙漠之力",
      "description": "登场时天气变为沙暴。砂暴状态下岩石系宝可梦的特防上升",
      "isHidden": false
    },
    "ability2": {
      "id": "ability-024",
      "name": "粗糙皮肤",
      "description": "受到接触招式攻击时，对手也会受到伤害",
      "isHidden": false
    },
    "hidden": {
      "id": "ability-065",
      "name": "鲨鱼皮",
      "description": "回合结束时，如果下雨，异常状态回复",
      "isHidden": true
    }
  },
  "learnset": {
    "levelUp": [
      { "level": 1, "move": "地震" },
      { "level": 16, "move": "逆鳞" },
      { "level": 32, "move": "龙舞" },
      { "level": 48, "move": "石刃" }
    ],
    "tmHm": ["地震", "逆鳞", "石刃", "火焰冲击", "龙舞", "剑舞"],
    "tutor": ["逆鳞", "石刃", "地震"],
    "egg": ["龙舞"]
  },
  "category": "龙宝可梦",
  "dexEntry": "进化后的陆鲨。可能是地面属性宝可梦中速度最快的。攻击力强大。在白金改版中得到了进一步的强化。"
}
```

---

## 🎯 PokemonInstance - 具体宝可梦实例

表示一只具体的、已配置的宝可梦（用于队伍中）。

```typescript
interface PokemonInstance {
  pokemon: Pokemon;              // Pokemon 定义（引用）
  nickname?: string;             // 昵称
  level: number;                 // 等级（1-100）
  nature: Nature;                // 性质（25 种）
  ivs: IVs;                      // 个体值
  evs: EVs;                      // 努力值
  heldItem: Item | null;         // 携带的道具
  moves: [Move, Move, Move, Move]; // 4 个招式
  gender?: 'male' | 'female';    // 性别
  isShiny: boolean;              // 闪光？
}
```

### 示例：馆主烈咬陆鲨

```json
{
  "pokemon": { /* Pokemon 对象 */ },
  "nickname": "暴龙王",
  "level": 80,
  "nature": "careful",
  "comment_nature": "+ SpD -SpA，优先特防来对抗特殊攻击",
  "ivs": {
    "hp": 31,
    "atk": 31,
    "def": 31,
    "spA": 31,
    "spD": 31,
    "spe": 31,
    "comment": "完美个体"
  },
  "evs": {
    "hp": 0,
    "atk": 252,
    "def": 0,
    "spA": 0,
    "spD": 252,
    "spe": 4,
    "comment": "252 Atk / 252 SpD / 4 Spe - 攻击和特防双重强化"
  },
  "heldItem": {
    "id": "item-270",
    "name": "生命玉",
    "category": "held-item",
    "description": "增加招式威力，但每次攻击后损失 10% HP"
  },
  "moves": [
    { "id": "move-089", "name": "地震", "type": "ground", "category": "physical", "power": 100, "accuracy": 100, "priority": 0, "description": "..." },
    { "id": "move-179", "name": "逆鳞", "type": "dragon", "category": "physical", "power": 120, "accuracy": 100, "priority": 0, "description": "..." },
    { "id": "move-71", "name": "石刃", "type": "rock", "category": "physical", "power": 100, "accuracy": 80, "priority": 0, "description": "..." },
    { "id": "move-349", "name": "龙舞", "type": "dragon", "category": "status", "power": 0, "accuracy": 100, "priority": 0, "description": "自己的攻击和速度各上升一个阶段" }
  ],
  "gender": "male",
  "isShiny": false
}
```

---

## 👮 Trainer - Kaizo 馆主数据

完整的馆主定义，包含其 6 只宝可梦队伍。

```typescript
interface Trainer {
  id: string;
  name: string;                    // "火钰"
  title: string;                   // "火系馆主"
  location: string;                // "火红不知火市"
  background: string;              // 背景描述
  tactic: TrainerTactic;           // 战术分析
  team: [PokemonInstance, ...];   // 6 只宝可梦
  averageLevel: number;            // 平均等级
  recommendedLevel: { min: number; max: number };
  createdAt: string;
  updatedAt: string;
}
```

### 战术分析 (TrainerTactic)

```json
{
  "tactic": {
    "title": "沙暴队伍构筑",
    "description": "核心策略是利用烈咬陆鲨的沙漠之力创造沙暴环境...",
    "difficulty": "hard",
    "counters": [
      "使用水系宝可梦攻击其弱点",
      "利用冰系招式克制龙系/地面系",
      "准备防守特化的宝可梦对抗其高攻击力"
    ]
  }
}
```

---

## 🛠️ 能力值计算

### 标准能力值公式

```
Stat = floor(((2 × Base + IV + floor(EV/4)) × Level / 100) + 5) × Nature
```

其中 Nature（性质）会给予某个能力值 ±10% 的修正。

### 使用工具函数

```typescript
import { 
  calculateStat, 
  calculateHP, 
  getPokemonStats 
} from '@/lib/pokeUtils';

// 计算 Atk
const atk = calculateStat(130, 31, 252, 80, 'careful');
// 返回：258

// 计算 HP
const hp = calculateHP(108, 31, 0, 80);
// 返回：191

// 获取完整能力值
const stats = getPokemonStats(garchompInstance);
// 返回：{ hp: 191, atk: 258, def: 185, spA: 139, spD: 199, spe: 188 }
```

---

## 📝 性质 (Nature) 列表

性质影响两个能力值：一个提升 10%，一个降低 10%。

| 性质 | 提升 | 降低 || 性质 | 提升 | 降低 |
|------|------|------||------|------|------|
| 认真 | 无 | 无 || 羞涩 | 无 | 无 |
| 孤独 | Atk | Def || 温顺 | 无 | 无 |
| 勇敢 | Atk | Spe || 固执 | SpA | Spe |
| 顽皮 | Atk | SpD || 急躁 | SpA | SpD |
| 大胆 | Def | Atk || 谨慎 | SpD | SpA |
| 温和 | Def | Spe || 宽松 | Def | SpD |
| 淘气 | Def | SpA || 胆小 | Spe | Atk |
| 迅速 | Spe | Def || 天真 | Spe | SpD |
| 乐天 | Spe | SpA || 保守 | SpD | Atk |
| 谦虚 | SpA | Atk || 温柔 | SpD | Def |
| 温柔 | SpA | Def || 调皮 | SpA | SpD |
| 冷静 | SpD | Atk | | | | |

---

## 📦 数据验证

使用工具函数验证数据完整性：

```typescript
import { validatePokemonInstance } from '@/lib/pokeUtils';

const result = validatePokemonInstance(garchompInstance);

if (!result.valid) {
  console.error('数据验证失败：', result.errors);
  // ['努力值总和不能超过 510', ...]
} else {
  console.log('数据有效✓');
}
```

**检查项包括：**
- 等级范围（1-100）
- 个体值范围（0-31）
- 努力值总和（≤510）
- 招式数量（4 个）
- 特性存在

---

## 💾 数据序列化

### 转换为 JSON 字符串

```typescript
import { serializePokemonInstance } from '@/lib/pokeUtils';

const json = serializePokemonInstance(garchompInstance);
// 可用于存储或网络传输
```

### 格式化为可读文本

```typescript
import { formatPokemonInfo } from '@/lib/pokeUtils';

const info = formatPokemonInfo(garchompInstance);
console.log(info);
/*
输出：
暴龙王 (Garchomp)
等级: 80 | 性质: careful | 性别: male
特性: 沙漠之力
道具: 生命玉
招式: 地震 / 逆鳞 / 石刃 / 龙舞

能力值:
  HP: 191
  Atk: 258
  Def: 185
  SpA: 139
  SpD: 199
  Spe: 188

努力值分配:
  HP: 0 | Atk: 252 | Def: 0
  SpA: 0 | SpD: 252 | Spe: 4
*/
```

---

## ⚔️ 伤害计算

简化的伤害计算（不包含所有修正）：

```typescript
import { calculateBaseDamage } from '@/lib/pokeUtils';

const damage = calculateBaseDamage(
  garchompInstance,  // 攻击者
  defenderInstance,  // 防守者
  0                  // 招式索引（0 = 地震）
);

console.log(`伤害范围：${damage.min} - ${damage.max}`);
if (damage.ohko) {
  console.log('✓ 一击必杀！');
}
```

**返回：**
```typescript
{
  min: 123,        // 最小伤害
  max: 145,        // 最大伤害
  ohko: false      // 是否一击必杀
}
```

---

## 🔗 属性和克制

查看宝可梦对特定属性的优劣：

```typescript
import { getTypeAdvantage } from '@/lib/pokeUtils';

const advantage = getTypeAdvantage(['dragon', 'ground']);

console.log('克制属性:', advantage.advantages);
// ['grass', 'bug', 'steel', 'water', 'grass', 'ground', 'rock', ...]

console.log('被克制属性:', advantage.weaknesses);
// ['ice', 'dragon', 'fairy', 'water', 'grass', 'ice', ...]
```

---

## 📂 文件结构

```
src/
├── types/
│   └── index.ts              # 所有类型定义
├── data/
│   └── sampleData.ts         # 示例数据（烈咬陆鲨 + 馆主）
├── lib/
│   └── pokeUtils.ts          # 数据处理工具函数
└── app/
    ├── calc/
    │   └── page.tsx          # 伤害计算器页面（可使用这些工具）
    └── teambuilder/
        └── page.tsx          # 队伍配置页面（可使用这些工具）
```

---

## 🎯 在项目中使用

### 在组件中导入和使用

```typescript
'use client';

import { garchompInstance, firefannyKaizo } from '@/data/sampleData';
import { getPokemonStats, formatPokemonInfo } from '@/lib/pokeUtils';

export default function DemoPage() {
  const stats = getPokemonStats(garchompInstance);

  return (
    <div>
      <h1>{garchompInstance.nickname}</h1>
      <p>Lv.{garchompInstance.level}</p>
      <p>Atk: {stats.atk}</p>
      <p>馆主: {firefannyKaizo.name}</p>
    </div>
  );
}
```

### 在服务器端使用

```typescript
// src/app/api/pokemon/[id]/route.ts
import { garchompInstance } from '@/data/sampleData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (params.id === '445') {
    return Response.json(garchompInstance);
  }
  return Response.json({ error: 'Not found' }, { status: 404 });
}
```

---

## 📚 扩展建议

### 添加更多宝可梦

1. 在 `src/data/sampleData.ts` 中定义新的 Pokemon 对象
2. 创建相应的招式、特性和道具定义
3. 可以考虑创建分离的文件：
   - `src/data/pokemon.ts`
   - `src/data/moves.ts`
   - `src/data/abilities.ts`

### 构建数据库

将数据迁移到实际数据库（如 MongoDB）：

```typescript
// 保持相同的 TypeScript 类型
// 使用相同的验证和计算函数
// 仅改变数据获取方式

async function getPokemon(id: number): Promise<Pokemon> {
  const data = await db.pokemon.findOne({ id });
  return data;
}
```

---

**完整数据模型系统已准备就绪！** ✨

使用这些类型定义和工具函数，你可以轻松构建伤害计算器、队伍配置工具和其他 Quiz 相关的功能。
