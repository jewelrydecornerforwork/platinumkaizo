# 🚀 TacticalPokemonCard 速查表

## 快速导入

```typescript
// 导入组件
import { 
  TacticalPokemonCard,
  TacticalPokemonCardGrid,
  type KaizoModification 
} from '@/components/cards/TacticalPokemonCard';

// 导入示例数据
import { garchompInstance, firefannyKaizo } from '@/data/sampleData';
import { garchompKaizoModifications } from '@/data/kaizoModifications';
```

---

## 最简单的用法

### 显示单张卡片

```typescript
<TacticalPokemonCard pokemon={garchompInstance} />
```

完成！即可显示：
- ✅ 宝可梦名称和等级
- ✅ 属性标签
- ✅ 6 个能力值条（带颜色渐变）
- ✅ 特性信息
- ✅ 赛博朋克视觉效果
- ✅ 呼吸灯悬浮效果

---

## 常用配置

### 显示详细信息

```typescript
<TacticalPokemonCard
  pokemon={garchompInstance}
  showDetails={true}  // 显示性质和道具
/>
```

### 添加 Kaizo 改动标签

```typescript
const modifications: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '速度提升'
  }
];

<TacticalPokemonCard
  pokemon={garchompInstance}
  modifications={modifications}  // 悬浮时显示
/>
```

### 添加点击事件

```typescript
<TacticalPokemonCard
  pokemon={garchompInstance}
  onClick={() => console.log('点击了卡片')}
/>
```

---

## 批量显示（网格布局）

### 显示馆主队伍

```typescript
import { firefannyKaizo } from '@/data/sampleData';

<TacticalPokemonCardGrid
  pokemon={firefannyKaizo.team}  // 6 只宝可梦数组
/>
```

**自动布局：**
- 📱 移动端：1 列
- 📱 平板：2 列
- 🖥️ 桌面：3 列

### 带改动信息和点击事件

```typescript
const modificationsMap = {
  0: [{ stat: 'spe', change: 8, description: '...' }],
  1: [{ stat: 'atk', change: 10, description: '...' }],
  // ... 其他队伍成员
};

<TacticalPokemonCardGrid
  pokemon={firefannyKaizo.team}
  modifications={modificationsMap}
  onCardClick={(index) => {
    console.log(`选中第 ${index} 只`);
  }}
/>
```

---

## Props 速查表

### TacticalPokemonCard

| Props | 类型 | 必需 | 说明 |
|-------|------|------|------|
| `pokemon` | `PokemonInstance` | ✅ | 宝可梦实例 |
| `modifications` | `KaizoModification[]` | ❌ | 改动信息 |
| `showDetails` | `boolean` | ❌ | 显示详细信息 |
| `onClick` | `() => void` | ❌ | 点击回调 |

### TacticalPokemonCardGrid

| Props | 类型 | 必需 | 说明 |
|-------|------|------|------|
| `pokemon` | `PokemonInstance[]` | ✅ | 宝可梦数组 |
| `modifications` | `Record<number, KaizoModification[]>` | ❌ | 按索引的改动 |
| `onCardClick` | `(index: number) => void` | ❌ | 卡片点击回调 |

---

## KaizoModification 数据格式

```typescript
interface KaizoModification {
  stat: 'hp' | 'atk' | 'def' | 'spA' | 'spD' | 'spe';  // 属性
  change: number;      // 改动值（+8, -5 等）
  description: string; // 描述文本
}
```

### 示例数据

```typescript
// 烈咬陆鲨的改动
const garchompMods: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '速度提升使其更容易抢先手'
  }
];

// 炎帝的改动
const enteiMods: KaizoModification[] = [
  {
    stat: 'atk',
    change: 10,
    description: '攻击大幅提升'
  },
  {
    stat: 'spe',
    change: 5,
    description: '速度增加'
  }
];
```

---

## 视觉效果预览

### 默认状态
```
┌─────────────────────────┐
│ 暴龙王 (Garchomp)       │
│ Lv.80                   │
├─────────────────────────┤
│ [Dragon] [Ground]       │
├─────────────────────────┤
│ ━━ Base Stats ━━         │
│ HP    ▓▓▓▓░░░░ 191      │
│ Atk   ▓▓▓▓▓▓▓░ 258      │
│ Def   ▓▓▓▓░░░░ 185      │
│ SpA   ▓▓░░░░░░ 139      │
│ SpD   ▓▓▓▓▓░░░ 199      │
│ Spe   ▓▓▓▓▓░░░ 188      │
├─────────────────────────┤
│ Ability: 沙漠之力       │
└─────────────────────────┘
```

### 鼠标悬浮状态
```
✨✨✨✨✨✨✨✨✨✨✨✨✨  ← 呼吸灯
✨ 暴龙王 (Garchomp)    ✨
✨ Lv.80               ✨
✨ ────────────────── ✨
✨ [Dragon] [Ground]  ✨
✨ ────────────────── ✨
✨ ━━ Base Stats ━━   ✨
✨ HP    ▓▓▓▓░░░ 191 ✨
✨ ...               ✨
✨ ────────────────── ✨
✨ ⚡ Kaizo Mods     ✨  ← 显示改动
✨ SPE +8 - 速度...  ✨
✨✨✨✨✨✨✨✨✨✨✨✨✨
```

---

## 完整代码示例

### 示例 1：简单列表

```typescript
'use client';

import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';
import { garchompInstance } from '@/data/sampleData';

export default function SimplePage() {
  return (
    <div className="max-w-sm">
      <TacticalPokemonCard pokemon={garchompInstance} />
    </div>
  );
}
```

### 示例 2：馆主队伍展示

```typescript
'use client';

import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import { firefannyKaizo } from '@/data/sampleData';
import { garchompKaizoModifications } from '@/data/kaizoModifications';

export default function TrainerPage() {
  const modifications = {
    0: garchompKaizoModifications,
    // ... 其他队伍成员
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1>{firefannyKaizo.name} 的队伍</h1>
      <TacticalPokemonCardGrid
        pokemon={firefannyKaizo.team}
        modifications={modifications}
      />
    </div>
  );
}
```

### 示例 3：交互功能

```typescript
'use client';

import { useState } from 'react';
import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import { firefannyKaizo } from '@/data/sampleData';

export default function InteractivePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedPoke = selected !== null ? firefannyKaizo.team[selected] : null;

  return (
    <div>
      {/* 卡片网格 */}
      <TacticalPokemonCardGrid
        pokemon={firefannyKaizo.team}
        onCardClick={setSelected}
      />

      {/* 详情面板 */}
      {selectedPoke && (
        <div className="mt-8 p-6 rounded-lg bg-slate-900 border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-emerald-400">
            {selectedPoke.pokemon.name}
          </h2>
          <p>等级: {selectedPoke.level}</p>
          <p>特性: {selectedPoke.pokemon.abilities.ability1.name}</p>
          <p>道具: {selectedPoke.heldItem?.name || '无'}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 颜色速查

### 能力值条颜色

| 数值范围 | 颜色 | RGB 示例 |
|---------|------|---------|
| 0-100 | 🔴 红 | rgb(255, 0, 0) |
| 100-170 | 🟠 橙 | rgb(255, 165, 0) |
| 170-240 | 🟡 黄绿 | rgb(173, 255, 0) |
| 240-300 | 🟢 绿 | rgb(0, 255, 0) |

### UI 颜色主调

```typescript
// 主色调：电光绿
text-emerald-400    // 亮绿文字
bg-emerald-500/10   // 淡绿背景
border-emerald-500  // 绿色边框

// 背景色
bg-slate-950        // 最深黑
bg-slate-900        // 深灰

// 文本色
text-slate-100      // 亮文字
text-slate-400      // 暗文字
```

---

## 常见错误和解决

### ❌ 错误 1：导入路径错误

```typescript
// ❌ 错误
import { TacticalPokemonCard } from '@/TacticalPokemonCard';

// ✅ 正确
import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';
```

### ❌ 错误 2：忘记 'use client'

```typescript
// ❌ 错误 - 会报错：Cannot use hooks in server component
export default function Page() {
  return <TacticalPokemonCard pokemon={...} />;
}

// ✅ 正确
'use client';

export default function Page() {
  return <TacticalPokemonCard pokemon={...} />;
}
```

### ❌ 错误 3：改动信息格式不对

```typescript
// ❌ 错误
modifications={{ spe: 8 }}  // 对象形式

// ✅ 正确
modifications={[
  {
    stat: 'spe',
    change: 8,
    description: '...'
  }
]}
```

### ❌ 错误 4：网格中没有 keys

```typescript
// ❌ 错误
{pokemon.map((p) => <TacticalPokemonCard pokemon={p} />)}

// ✅ 正确
{pokemon.map((p, i) => (
  <TacticalPokemonCard key={`${p.pokemon.id}-${i}`} pokemon={p} />
))}
```

---

## 性能建议

### 优化技巧

```typescript
// 1. 使用 useMemo 缓存修改数据
const modifications = useMemo(() => ({
  0: garchompKaizoModifications,
  // ...
}), []);

// 2. 懒加载组件
const TacticalCard = dynamic(() => 
  import('@/components/cards/TacticalPokemonCard')
);

// 3. 使用虚拟滚动（大列表）
import { FixedSizeList } from 'react-window';
```

---

## 调试技巧

```typescript
// 在组件中加入日志
<TacticalPokemonCard
  pokemon={pokemon}
  onClick={() => console.log('Clicked:', pokemon)}
/>

// 检查宝可梦数据
console.log('Pokemon:', pokemon);
console.log('Stats:', getPokemonStats(pokemon));
console.log('Mods:', modifications);
```

---

## 下一步

- 📖 查看完整文档：[COMPONENT_DOCS.md](COMPONENT_DOCS.md)
- 🎮 访问演示页面：`/demo/cards`
- 💻 参考示例代码：[src/app/demo/cards/page.tsx](src/app/demo/cards/page.tsx)

---

**快速开始成功！** 🎉
