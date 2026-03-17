# Platinum Kaizo Wiki - 项目文档

## 📖 项目概览

Platinum Kaizo Wiki 是一个现代化的 Pokémon 宝可梦周边应用，基于流行的开源技术栈构建。该项目采用最新的前端技术标准，提供优秀的用户体验和开发效率。

## 🏗️ 架构设计

### 技术栈
```
Frontend Framework: Next.js 14 (App Router)
Styling: Tailwind CSS 3.4
UI Library: React 19
Icons: Lucide React
Language: TypeScript 5.0
State Management: React Context API
```

### 分层架构

```
┌─────────────────────────────────────┐
│       User Interface Layer          │
│  (Pages, Components)                │
├─────────────────────────────────────┤
│      Business Logic Layer           │
│  (Hooks, Context, Utils)            │
├─────────────────────────────────────┤
│       Styling Layer                 │
│  (Tailwind CSS, CSS Modules)        │
├─────────────────────────────────────┤
│      Framework Layer                │
│  (Next.js, React)                   │
└─────────────────────────────────────┘
```

## 📂 目录结构详解

### `src/app/`
Next.js 14 App Router 的应用入口。使用基于文件的路由系统：
- `layout.tsx` - 全局布局，包含侧边栏和主内容区域
- `page.tsx` - 首页
- `[route]/page.tsx` - 动态路由页面

### `src/components/`
可复用的 React 组件，按功能分类：
- `layout/` - 布局组件（Sidebar、Header）
- `providers/` - Context Provider 组件（SidebarProvider）
- 其他功能组件可以在此扩展

### `src/lib/`
工具函数和配置文件：
- `navigation.ts` - 点击目录配置，集中管理所有导航链接
- `utils.ts` - 通用工具函数（cn、debounce、throttle 等）

### `src/types/`
TypeScript 类型定义：
- `index.ts` - 应用全局类型定义

### `src/globals.css`
全局样式覆盖和初始化：
- Tailwind CSS 指令导入
- CSS 变量定义
- 滚动条样式
- 全局组件样式

## 🎨 设计系统

### 色彩系统

**深色模式调色板：**
```
Background (背景):
  - slate-950: #030712 (主背景)
  - slate-900: #0f172a (次级背景)
  - slate-800: #1e293b (悬停/焦点)

Accent (强调):
  - emerald-400: #34d399 (hover state)
  - emerald-500: #10b981 (primary)

Text (文本):
  - slate-100: #f1f5f9 (主文本)
  - slate-300: #cbd5e1 (次要文本)
  - slate-400: #94a3b8 (禁用文本)

Border (边框):
  - emerald-500/20: 带透明度的强调色边框
```

### 排版系统

```typescript
// 标题
h1: text-5xl md:text-6xl font-bold
h2: text-4xl font-bold
h3: text-2xl font-bold
h4: text-xl font-bold

// 正文
body: text-base leading-relaxed
small: text-sm
```

### 间距系统

使用 Tailwind 的标准间距：
```
p-4: 16px (标准 padding)
p-6: 24px (大 padding)
gap-3: 12px (小间距)
gap-6: 24px (大间距)
```

### 动画系统

```typescript
// 过渡效果
transition-all duration-200   // 快速反馈
transition-all duration-300   // 正常过渡
transition-colors duration-200 // 颜色变化

// 缩放
ease-in-out // 标准缓动
```

## 🧩 组件使用指南

### Sidebar Provider

在根布局中使用 Context Provider 来管理侧边栏状态：

```typescript
import { SidebarProvider } from '@/components/providers/SidebarProvider';

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
```

### 使用 Sidebar Hook

在任何子组件中访问侧边栏状态：

```typescript
'use client';

import { useSidebar } from '@/components/providers/SidebarProvider';

export function MyComponent() {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>
      {isOpen ? '关闭' : '打开'}菜单
    </button>
  );
}
```

### 添加新导航项

编辑 `src/lib/navigation.ts`：

```typescript
export const navItems: NavItem[] = [
  {
    id: 'new-page',
    label: '新页面',
    href: '/new-page',
    icon: null, // 可选：添加 Lucide icon
  },
];
```

然后在 `src/app/new-page/page.tsx` 中创建页面。

## 🎯 常见开发任务

### 添加新页面

1. 在 `src/app/` 中创建目录：`src/app/my-page/`
2. 创建 `page.tsx`：

```typescript
export default function MyPage(): React.ReactElement {
  return (
    <main className="px-6 py-12 md:px-12">
      <h1 className="text-4xl font-bold text-emerald-400">我的页面</h1>
    </main>
  );
}
```

3. 到 `src/lib/navigation.ts` 中添加导航项（可选）

### 创建新组件

1. 在 `src/components/` 中创建文件：`src/components/MyComponent.tsx`

```typescript
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({
  title,
  onClick,
}: MyComponentProps): React.ReactElement {
  return (
    <div
      className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 
                 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {title}
    </div>
  );
}
```

2. 在需要的地方导入和使用

### 添加全局样式

编辑 `src/globals.css`：

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-emerald-500 text-white rounded-lg
           hover:bg-emerald-600 transition-colors;
  }
}
```

### 优化移动端体验

使用 Tailwind 的响应式前缀：

```typescript
<div className="
  px-4 md:px-12           // 移动端 16px，桌面端 48px
  grid-cols-1 md:grid-cols-2  // 移动端 1 列，桌面端 2 列
  text-sm md:text-base    // 移动端小字，桌面端正常
">
  响应式内容
</div>
```

## 🔒 TypeScript 最佳实践

### Props 定义

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

export function Component({
  title,
  onClick,
  variant = 'primary',
  children,
}: ComponentProps): React.ReactElement {
  // 实现...
}
```

### 类型导出

```typescript
// 在 types/index.ts 中定义
export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
};

// 在组件中使用
import type { NavItem } from '@/types';
```

### React.ReactElement 的使用

始终为组件返回类型添加显式类型：

```typescript
export function MyComponent(): React.ReactElement {
  return <div>内容</div>;
}
```

## 📱 响应式设计断点

```typescript
// Tailwind 默认断点
sm:  640px
md:  768px   // 主要断点（侧边栏 toggle）
lg:  1024px
xl:  1280px
2xl: 1536px

// 使用示例
className="hidden md:block"  // 仅在 md 及以上显示
className="md:ml-sidebar"    // 在 md 及以上添加左边距
```

## 🚀 性能优化建议

### 代码分割

Next.js 自动进行路由级的代码分割。每个页面都是一个独立的分块。

### 图片优化

使用 Next.js 的 `Image` 组件：

```typescript
import Image from 'next/image';

export function Pokemon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="pokemon"
      width={240}
      height={240}
      priority={false}
    />
  );
}
```

### 懒加载组件

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <div>加载中...</div> }
);
```

## 📋 检查清单

### 新页面创建流程
- [ ] 在 `src/app/` 创建目录和 `page.tsx`
- [ ] 添加到 `src/lib/navigation.ts`（如果需要导航）
- [ ] 设置正确的标题和元描述
- [ ] 确保移动端响应式设计
- [ ] 添加 TypeScript 类型定义

### 新组件创建流程
- [ ] 在 `src/components/` 创建文件
- [ ] 定义 Props 接口
- [ ] 添加 JSDoc 注释
- [ ] 使用正确的 Tailwind 样式
- [ ] 确保无障碍访问（a11y）

## 🔗 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Lucide React](https://lucide.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## ❓ 常见问题

### Q: 如何添加全局字体？
A: 在 `src/app/layout.tsx` 中使用 `@font-face` 或 Google Fonts

### Q: 如何处理暗黑模式？
A: 项目默认为暗黑模式。在 `tailwind.config.ts` 中配置 `darkMode: 'class'`

### Q: 侧边栏在移动端如何使用？
A: 点击 Header 的菜单按钮（hamburger icon）打开/关闭侧边栏

### Q: 如何添加新的颜色主题？
A: 在 `tailwind.config.ts` 中修改 `colors` 配置，并在 CSS 变量中更新

---

**最后更新**: 2026年3月 | **版本**: 1.0.0
