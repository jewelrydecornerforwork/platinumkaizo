# 🎨 TacticalPokemonCard 组件文档

一个完全功能化的、赛博朋克风格的宝可梦战术卡片组件。

## 📋 目录

- [组件概述](#组件概述)
- [核心特性](#核心特性)
- [API 文档](#api-文档)
- [使用示例](#使用示例)
- [样式定制](#样式定制)
- [性能优化](#性能优化)

---

## 组件概述

### 什么是 TacticalPokemonCard？

`TacticalPokemonCard` 是一个功能完整的 React 组件，用于以赛博朋克风格展示宝可梦的战术信息。它包含：

1. **宝可梦基本信息** - 名称、等级、属性、特性
2. **能力值可视化** - 带颜色渐变的水平条显示 6 大能力值
3. **Kaizo 改动标签** - 鼠标悬浮时展示版本改动信息
4. **视觉特效** - CRT 扫描线、呼吸灯边框、进入动画
5. **完全响应式** - 适配各种屏幕尺寸

---

## 核心特性

### ✨ 视觉设计

```
┌─────────────────────────────────┐ ← 呼吸灯边框（悬浮激活）
│  暴龙王 (Garchomp) · Lv.80     │
├─────────────────────────────────┤
│ [Dragon] [Ground]               │
├─────────────────────────────────┤
│ ━━ Base Stats ━━                │
│ HP    ▓▓▓▓░░░░░░ 191            │
│ Atk   ▓▓▓▓▓▓▓░░░ 258            │
│ Def   ▓▓▓▓░░░░░░ 185            │
│ SpA   ▓▓░░░░░░░░ 139            │
│ SpD   ▓▓▓▓▓░░░░░ 199            │
│ Spe   ▓▓▓▓▓░░░░░ 188            │
├─────────────────────────────────┤
│ ⚡ Kaizo Modifications          │  ← 悬浮显示
│ SPE +8 - 速度提升使其更容易...  │
└─────────────────────────────────┘
  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  CRT 扫描线纹理
```

### 🎨 能力值颜色方案

```
值范围      颜色          表示
0-100      🔴 红色        非常低
100-150    🟠 橙色        较低
150-200    🟡 黄绿        中等
200-250    🟢 绿色        较高
250-300    🟢 深绿        非常高
```

### ⚡ 呼吸灯特效

- **上边框** - 绿色脉冲 (2s 周期)
- **右边框** - 绿色脉冲 (2s 周期，延迟 0.3s)
- **下边框** - 绿色脉冲 (2s 周期，延迟 0.6s)
- **左边框** - 绿色脉冲 (2s 周期，延迟 0.9s)

形成持续的旋转呼吸灯效果。

---

## API 文档

### TacticalPokemonCard

单张卡片组件。

```typescript
interface TacticalPokemonCardProps {
  /** 要展示的宝可梦实例（必需） */
  pokemon: PokemonInstance;

  /** Kaizo 版本中的改动点（可选） */
  modifications?: KaizoModification[];

  /** 是否显示完整细节（性质、道具等） */
  showDetails?: boolean;

  /** 卡片点击回调 */
  onClick?: () => void;
}
```

#### KaizoModification 接口

```typescript
export interface KaizoModification {
  /** 被修改的能力值 */
  stat: 'hp' | 'atk' | 'def' | 'spA' | 'spD' | 'spe';

  /** 改动值（可正可负） */
  change: number;

  /** 改动描述 */
  description: string;
}
```

**示例：**
```typescript
const modifications: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '速度提升使其更容易抢先手'
  },
  {
    stat: 'atk',
    change: 0,
    description: '保持原始数值，搭配龙舞使用'
  }
];

<TacticalPokemonCard
  pokemon={garchompInstance}
  modifications={modifications}
  showDetails={true}
/>
```

---

### TacticalPokemonCardGrid

多张卡片网格布局。

```typescript
interface TacticalPokemonCardGridProps {
  /** 宝可梦实例数组（必需） */
  pokemon: PokemonInstance[];

  /** 按索引映射的改动信息 */
  modifications?: Record<number, KaizoModification[]>;

  /** 卡片点击回调（返回索引） */
  onCardClick?: (index: number) => void;
}
```

**示例：**
```typescript
const modificationsMap = {
  0: garchompKaizoModifications,
  1: heatranKaizoModifications,
  2: enteiKaizoModifications,
};

<TacticalPokemonCardGrid
  pokemon={firefannyKaizo.team}
  modifications={modificationsMap}
  onCardClick={(index) => console.log(index)}
/>
```

---

## 使用示例

### 基础用法

```typescript
'use client';

import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';
import { garchompInstance } from '@/data/sampleData';

export default function Page() {
  return (
    <TacticalPokemonCard pokemon={garchompInstance} />
  );
}
```

### 带改动信息

```typescript
'use client';

import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';
import { garchompInstance } from '@/data/sampleData';
import type { KaizoModification } from '@/components/cards/TacticalPokemonCard';

const modifications: KaizoModification[] = [
  {
    stat: 'spe',
    change: 8,
    description: '白金改版增强'
  }
];

export default function Page() {
  return (
    <TacticalPokemonCard
      pokemon={garchompInstance}
      modifications={modifications}
      showDetails={true}
    />
  );
}
```

### 网格布局（馆主队伍）

```typescript
'use client';

import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import { firefannyKaizo } from '@/data/sampleData';
import type { KaizoModification } from '@/components/cards/TacticalPokemonCard';

const modifications: Record<number, KaizoModification[]> = {
  0: [{ stat: 'spe', change: 8, description: '...' }],
  1: [{ stat: 'spA', change: 5, description: '...' }],
  // ... 其他队伍成员
};

export default function Page() {
  return (
    <div>
      <h1>{firefannyKaizo.name} 的队伍</h1>
      <TacticalPokemonCardGrid
        pokemon={firefannyKaizo.team}
        modifications={modifications}
        onCardClick={(index) => {
          console.log(`选中第 ${index} 只宝可梦`);
        }}
      />
    </div>
  );
}
```

### 完整复杂示例

```typescript
'use client';

import { useState } from 'react';
import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import type { KaizoModification } from '@/components/cards/TacticalPokemonCard';

export default function TrainerPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    // 可以在这里加载更多详细信息
  };

  return (
    <div className="space-y-8">
      {/* 馆主信息 */}
      <div>
        <h1 className="text-4xl font-bold">火系馆主</h1>
        <p className="text-slate-400">白金改版强化版本</p>
      </div>

      {/* 卡片网格 */}
      <TacticalPokemonCardGrid
        pokemon={trainerTeam}
        modifications={kaizoMods}
        onCardClick={handleCardClick}
      />

      {/* 选中卡片显示详情 */}
      {selectedIndex !== null && (
        <div className="p-6 rounded-lg bg-slate-900 border border-emerald-500/20">
          <h2>选中宝可梦详情</h2>
          <p>{trainerTeam[selectedIndex].pokemon.name}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 样式定制

### 颜色主题

卡片使用以下 Tailwind 色系：

```typescript
// 背景色
bg-gradient-to-br from-slate-900 to-slate-950

// 边框色
border-emerald-500/40

// 文本色（主色调）
text-emerald-400

// 次要文本
text-slate-400
```

**定制颜色的方法：**

1. 修改 `TacticalPokemonCard.tsx` 中的 className
2. 修改 `tailwind.config.ts` 中的颜色定义
3. 创建一个主题包装组件

### 能力值条颜色

在 `getStatColor()` 函数中修改：

```typescript
// 当前方案：红 → 橙 → 绿
// 可修改为：蓝 → 紫 → 绿 等其他方案

function getStatColor(value: number, min: number, max: number): string {
  // 修改此处的 RGB 值
  return `rgb(${r}, ${g}, ${b})`;
}
```

### 动画时长

在 Framer Motion 的 `transition` 中修改：

```typescript
// 修改呼吸灯周期（默认 2s）
animate={{
  opacity: [0.5, 1, 0.5],
}}
transition={{ duration: 2, repeat: Infinity }} // ← 改这里

// 修改卡片进入动画（默认 0.6s）
transition={{ duration: 0.6, ease: 'easeOut' }} // ← 改这里
```

---

## 性能优化

### 已内置优化

1. **Memo 化** - 使用 React 的 memo 包装（可选）
2. **懒加载** - 结合 `dynamic()` 实现代码分割
3. **动画优化** - 使用 `will-change` CSS
4. **事件委托** - 高效的事件处理

### 推荐优化

```typescript
import dynamic from 'next/dynamic';

// 懒加载卡片组件
const TacticalPokemonCard = dynamic(
  () => import('@/components/cards/TacticalPokemonCard')
    .then(mod => ({ default: mod.TacticalPokemonCard })),
  { loading: () => <div>加载中...</div> }
);
```

### 大数量渲染

当展示数十张卡片时：

```typescript
import { useCallback } from 'react';
import { virtualizer } from 'react-virtual'; // 可选虚拟滚动库

export function LargeCardList({ items }) {
  const virtualizer = createVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // 卡片高度估算
  });

  return (
    <div ref={parentRef}>
      <TacticalPokemonCardGrid pokemon={items} />
    </div>
  );
}
```

---

## 文件位置视图

```
src/
├── components/
│   └── cards/
│       ├── TacticalPokemonCard.tsx       # 🔑 主组件
│       └── TacticalPokemonCard.module.css # 样式模块
├── data/
│   └── kaizoModifications.ts             # Kaizo 改动数据
└── app/
    └── demo/
        └── cards/
            └── page.tsx                   # 完整演示页面
```

---

## 常见问题

### Q: 如何禁用呼吸灯特效？

A: 在 `isHovered` 状态下不渲染呼吸灯组件：

```typescript
{isHovered && showBreathingEffect && (
  // 呼吸灯代码
)}
```

### Q: 如何修改能力值颜色范围？

A: 修改 `getStatColor()` 函数的参数：

```typescript
value={statValues[index]}
maxValue={250}  // 改这里
hasModification={hasModification}
```

### Q: 能否自定义每个卡片的样式？

A: 可以通过 props 传入自定义 className：

```typescript
interface CustomProps extends TacticalPokemonCardProps {
  containerClassName?: string;
  statsContainerClassName?: string;
}
```

### Q: 如何在移动端优化显示？

A: 响应式布局已内置：

```typescript
// 网格自动响应
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Q: 如何添加点击卡片后的详情页面？

A: 使用 modal 或路由导航：

```typescript
onClick={() => {
  router.push(`/pokemon/${pokemon.pokemon.id}`);
}}
```

---

## 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | ≥90 | ✅ |
| Firefox | ≥88 | ✅ |
| Safari | ≥14 | ⚠️ 部分动画 |
| Edge | ≥90 | ✅ |

---

## 依赖项

- `react` ≥19.0.0
- `react-dom` ≥19.0.0
- `framer-motion` ≥10.16.0
- `lucide-react` ≥0.344.0
- `tailwindcss` ≥3.4.0
- `tailwind-merge` ≥2.2.0

---

## 许可证

MIT

---

## 更新日志

### v1.0.0 (2026-03-17)

- ✅ 初始发布
- ✅ 完整的赛博朋克设计
- ✅ 能力值可视化
- ✅ Kaizo 改动显示
- ✅ 呼吸灯特效
- ✅ 响应式布局

---

**祝你使用愉快！** 🚀
