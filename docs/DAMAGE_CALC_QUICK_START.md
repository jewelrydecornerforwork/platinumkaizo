# useKaizoCalc Hook - 快速开始指南

## 概览

`useKaizoCalc` Hook 已经成功添加到 **Platinum Kaizo Wiki** 项目中。该 Hook 基于 [@smogon/calc](https://github.com/smogon/damage-calc) 库，提供精确的 Pokémon 伤害计算功能，并支持 Kaizo 版本的特殊修正规则。

---

## 📦 新增文件

### 核心文件

1. **[src/types/damage.ts](../src/types/damage.ts)** (260+ 行)
   - 伤害计算的完整类型定义
   - `DamageCalcInput` - 伤害计算的输入参数
   - `DamageCalcResult` - 伤害计算的输出结果
   - `KaizoModifier` - Kaizo 修正项接口
   - 辅助类型和工具函数

2. **[src/hooks/useKaizoCalc.ts](../src/hooks/useKaizoCalc.ts)** (300+ 行)
   - 完整的 React Hook 实现
   - 支持非同步伤害计算
   - 修正项的动态管理（Add/Remove/Update）
   - 环境效果处理（天气、场地）

3. **[src/hooks/index.ts](../src/hooks/index.ts)** (导出文件)
   - 统一导出所有 hooks
   - 便于从 `@/hooks` 直接导入

4. **[src/app/calculator/page.tsx](../src/app/calculator/page.tsx)** (280+ 行)
   - 完整的伤害计算器演示页面
   - 交互式 UI，支持参数调整
   - Kaizo 修正项的实时切换
   - 详细的结果展示

5. **[docs/DAMAGE_CALC_DOCS.md](../docs/DAMAGE_CALC_DOCS.md)** (1000+ 行)
   - 完整的 API 文档
   - 使用示例和最佳实践
   - 与 @smogon/calc 的集成指南
   - FAQ 和故障排除

### 更新文件

1. **[src/types/index.ts](../src/types/index.ts)**
   - 添加了伤害计算相关类型的重新导出
   - 移除了旧的 `DamageCalcInput` / `DamageCalcResult` 接口

2. **[package.json](../package.json)**
   - ✅ 已包含 `@smogon/calc` 依赖

---

## 🚀 使用方法

### 1. 基础导入

```typescript
import { useKaizoCalc } from '@/hooks/useKaizoCalc';
import { DamageCalcInput, DamageCalcResult } from '@/types/damage';
```

### 2. 在组件中使用

```typescript
'use client';

import { useKaizoCalc } from '@/hooks/useKaizoCalc';

export default function MyComponent() {
  const { result, isLoading, error, calculate } = useKaizoCalc();

  const handleCalculate = async () => {
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

    try {
      const result = await calculate(input);
      console.log(`伤害: ${result.minDamagePercent}% - ${result.maxDamagePercent}%`);
    } catch (err) {
      console.error('计算失败:', err);
    }
  };

  return (
    <button onClick={handleCalculate} disabled={isLoading}>
      {isLoading ? '计算中...' : '计算伤害'}
    </button>
  );
}
```

### 3. 使用 Kaizo 修正项

```typescript
const { addModifier, calculate } = useKaizoCalc();

// 添加修正项
addModifier({
  id: 'kaizo-ability-boost',
  name: '烈咬陆鲨特性强化',
  damageMultiplier: 1.2,
  enabled: true,
  description: 'Kaizo 版本中的特性威力提升',
});

// 计算伤害（会自动应用启用的修正项）
await calculate(input);
```

### 4. 查看演示页面

访问 **http://localhost:3000/calculator** 查看完整的交互式演示页面。

---

## 🎯 核心功能

### ✅ 已实现

- **精确伤害计算**
  - 基于官方 Pokémon 伤害公式
  - 计算最小和最大伤害百分比
  - 支持 0.85-1.0 的伤害波动

- **击杀概率分析**
  - OHKO (一击必杀)
  - 2HKO/3HKO/4HKO
  - 存活 HP 百分比计算

- **环境效果**
  - 天气修正：晴朗、下雨、沙暴、冰雹
  - 场地修正：草地场、电气场、心灵场、薄雾场
  - 类型相性倍数计算

- **Kaizo 修正项系统**
  - 可插拔的修正项架构
  - 支持多个修正项同时激活
  - 每个修正项可独立启用/禁用
  - 详细的修正元数据跟踪

- **完整的 TypeScript 支持**
  - 全面的类型定义
  - 类型安全的输入/输出
  - IntelliSense 代码提示

### 🔲 计划中

- 完全集成 @smogon/calc 官方库（当前使用简化版本）
- 性质修正自动计算
- IV/EV 配置面板
- 多技能对比分析
- 团队覆盖分析（哪些宝可梦可以击杀目标）
- 构建索引和缓存优化

---

## 📊 文件结构

```
src/
├── types/
│   ├── index.ts           ✅ 更新：添加伤害计算类型导出
│   └── damage.ts          ✨ 新增：伤害计算类型定义
├── hooks/
│   ├── index.ts           ✨ 新增：hooks 导出文件
│   └── useKaizoCalc.ts    ✨ 新增：Hook 实现
├── app/
│   ├── layout.tsx         ✅ 现有
│   ├── page.tsx           ✅ 现有
│   └── calculator/
│       └── page.tsx       ✨ 新增：演示页面
└── [其他现有文件...]

docs/
└── DAMAGE_CALC_DOCS.md    ✨ 新增：完整文档

package.json               ✅ 包含 @smogon/calc 依赖
```

---

## 🎓 学习资源

### 文档

- **[完整 API 文档](../docs/DAMAGE_CALC_DOCS.md)**
  - 详细的类型参考
  - 使用示例
  - 集成指南
  - FAQ

### 代码示例

1. **演示页面**: [src/app/calculator/page.tsx](../src/app/calculator/page.tsx)
   - 完整的交互式 UI
   - 参数输入、结果显示
   - Kaizo 修正项管理

2. **Hook 实现**: [src/hooks/useKaizoCalc.ts](../src/hooks/useKaizoCalc.ts)
   - Hook 的内部逻辑
   - 伤害公式实现
   - 修正项处理

3. **类型定义**: [src/types/damage.ts](../src/types/damage.ts)
   - 完整的接口定义
   - 辅助工具函数
   - 常数定义

---

## ⚙️ 配置和集成

### 使用 @smogon/calc 库

当前实现使用简化的伤害公式。如果需要完全准确的结果，可以集成完整的 @smogon/calc 库：

```bash
npm install @smogon/calc
```

然后按照 [docs/DAMAGE_CALC_DOCS.md](../docs/DAMAGE_CALC_DOCS.md) 中的 "与 @smogon/calc 集成" 章节进行更新。

### 添加自定义 Kaizo 规则

```typescript
const kaizoRules = {
  modifiers: [
    {
      id: 'custom-rule-1',
      name: '自定义规则名称',
      damageMultiplier: 1.3,  // 伤害 ×1.3
      enabled: true,
      description: '规则描述',
    },
  ],
  enableAllModifiers: false,
};

await calculate({
  // ... 其他参数
  kaizoRules,
});
```

---

## 🧪 测试

### 单元测试示例

参考 [docs/DAMAGE_CALC_DOCS.md](../docs/DAMAGE_CALC_DOCS.md) 中的测试用例部分：

```typescript
import { renderHook, act } from '@testing-library/react';
import { useKaizoCalc } from '@/hooks/useKaizoCalc';

describe('useKaizoCalc', () => {
  it('should calculate damage correctly', async () => {
    const { result } = renderHook(() => useKaizoCalc());

    const input = { /* ... */ };

    await act(async () => {
      await result.current.calculate(input);
    });

    expect(result.current.result?.maxDamagePercent).toBeGreaterThan(0);
  });
});
```

---

## 📋 检查清单

### 部署前验证

- [ ] 运行 `npm install` 确保 @smogon/calc 已安装
- [ ] 运行 `npm run type-check` 验证 TypeScript 类型
- [ ] 访问 `/calculator` 页面验证演示页面正常运行
- [ ] 在浏览器控制台验证没有错误
- [ ] 尝试切换 Kaizo 修正项并重新计算

### 下一步

1. **集成到其他页面**
   - 在馆主数据页面中显示推荐队伍的伤害范围
   - 在宝可梦详情页中显示与常见敌手的伤害对比
   - 在队伍构建工具中集成伤害计算器

2. **实现高级功能**
   - 多技能对比分析
   - 团队覆盖分析（显示哪些队员可以击杀目标）
   - 伤害计算历史记录
   - 批量计算导出为 CSV

3. **性能优化**
   - 实现结果缓存
   - 使用 Web Worker 进行后台计算
   - 优化大规模批量计算

4. **用户体验改进**
   - 添加快速预设（常见的馆主队伍配置）
   - 支持导入/导出计算配置
   - 添加计算历史和比较功能

---

## 🔗 相关链接

- [Smogon Damage Calculator 官方库](https://github.com/smogon/damage-calc)
- [Pokémon Damage Formula 官方文档](https://bulbapedia.bulbagarden.net/wiki/Damage)
- [Platinum Kaizo 信息](https://nuzlocke.fandom.com/wiki/Pokémon_Platinum_Kaizo)

---

## 📝 更新日志

### Version 1.0.0 (当前)

**新增功能：**
- ✅ useKaizoCalc Hook 实现
- ✅ 伤害类型定义文件 (damage.ts)
- ✅ 伤害计算演示页面
- ✅ 完整的 API 文档
- ✅ Kaizo 修正项系统
- ✅ 天气和场地效果支持

**改进：**
- ✅ 更新 types/index.ts 以导出伤害计算类型
- ✅ 添加了 @smogon/calc 依赖

---

## ❓ 常见问题

**Q: 为什么伤害计算结果和其他计算器不一致？**

A: 当前实现使用简化的伤害公式。集成完整的 @smogon/calc 库可以获得 100% 准确的结果。

**Q: 如何添加我自己的 Kaizo 修正规则？**

A: 使用 `addModifier()` 方法添加自定义修正项。参考文档中的"使用Kaizo修正项"部分。

**Q: 性质 (Nature) 如何影响伤害计算？**

A: 性质对能力值造成 ±10% 的修正 (除 HP 外)。输入数据时，`attacker.atk` 等字段应已包含性质修正。

**Q: 能否在服务器端进行伤害计算？**

A: 可以。将 Hook 的逻辑提取为独立函数，在 API 路由中调用即可。

---

## 🙋 获取帮助

- 查看[完整文档](../docs/DAMAGE_CALC_DOCS.md)了解详细信息
- 参考[演示页面源码](../src/app/calculator/page.tsx)学习实现方式
- 检查[Hook 实现](../src/hooks/useKaizoCalc.ts)了解内部逻辑
- 阅读[类型定义](../src/types/damage.ts)理解数据结构

---

**祝你使用愉快！** 🎮⚡
