# Platinum Kaizo Wiki

一个基于 Next.js 14 + Tailwind CSS + TypeScript 的 Pokémon Platinum Kaizo 挑战指南网站。

## 🚀 功能特性

- **深色模式设计**：现代化的 Slate-950 配色方案，辅以电光绿 (#10B981) 点缀
- **响应式布局**：桌面端固定侧边栏 + 移动端可折叠导航
- **高斯模糊效果**：侧边栏和 Header 采用毛玻璃效果
- **类型安全**：使用 TypeScript 确保代码质量
- **组件化结构**：模块化设计便于维护和扩展

## 📁 项目结构

```
platinum-kaizo/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx          # 全局布局
│   │   ├── page.tsx            # 首页
│   │   ├── pokedex/            # 全图鉴
│   │   ├── bosses/             # 馆主战术
│   │   ├── calc/               # 伤害计算器
│   │   └── teambuilder/        # 队伍配置
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     # 侧边栏
│   │   │   ├── Header.tsx      # 移动端 Header
│   │   │   └── Sidebar.module.css
│   │   └── providers/
│   │       └── SidebarProvider.tsx  # 侧边栏 Context
│   ├── lib/
│   │   ├── navigation.ts       # 导航配置
│   │   └── utils.ts            # 工具函数
│   ├── types/
│   │   └── index.ts            # 类型定义
│   └── globals.css             # 全局样式
├── public/                     # 静态资源
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── next.config.js              # Next.js 配置
├── postcss.config.js           # PostCSS 配置
├── package.json
└── README.md
```

## 🎨 设计细节

### 色彩方案
- **背景色**：Slate-950 (#030712) - 深沉的设计基础
- **点缀色**：Emerald-500 (#10B981) - 醒目的交互色
- **文本色**：Slate-100/300/400 - 不同层级的信息层

### 响应式设计

#### 桌面端 (≥768px)
- 侧边栏固定在左侧
- 主要内容自动适应
- 宽度：280px 侧边栏 + 自适应主内容

#### 移动端 (<768px)
- 隐藏侧边栏（可切换）
- 顶部 Header 菜单按钮
- 全屏宽度内容

```
Mobile Layout:
┌─────────────────┐
│ 📱 Header       │ ← 固定顶部，16px 高度
├─────────────────┤
│                 │
│  Main Content   │ ← 内容区域
│                 │
│ (Sidebar 覆盖)  │
└─────────────────┘

Desktop Layout:
┌──────────┬──────────────┐
│          │              │
│ Sidebar  │ Main Content │
│ 280px    │ Auto         │
│          │              │
└──────────┴──────────────┘
```

## 🔧 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

### 类型检查

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📦 主要依赖

- **Next.js 14**：React 框架，支持 App Router
- **React 19**：UI 库
- **Tailwind CSS 3.4**：原子化 CSS 框架
- **Lucide React**：icon 库
- **TypeScript 5**：类型安全

## 🎯 使用组件

### 侧边栏 Context
```tsx
import { useSidebar } from '@/components/providers/SidebarProvider';

function MyComponent() {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  // 使用侧边栏状态...
}
```

### 工具函数
```tsx
import { cn, debounce, throttle } from '@/lib/utils';

// 合并类名
const className = cn('text-red-500', isActive && 'font-bold');

// 防抖
const handleSearch = debounce((query: string) => {
  // 搜索逻辑...
}, 300);

// 节流
const handleScroll = throttle(() => {
  // 滚动逻辑...
}, 1000);
```

## 🔄 导航配置

在 `src/lib/navigation.ts` 中修改导航项：

```typescript
export const navItems: NavItem[] = [
  {
    id: 'pokedex',
    label: '全图鉴',
    href: '/pokedex',
    icon: null,
  },
  // 更多项...
];
```

## 📱 页面清单

- `/` - 首页
- `/pokedex` - 全图鉴
- `/bosses` - 馆主战术
- `/calc` - 伤害计算器
- `/teambuilder` - 队伍配置

## 🎨 自定义样式

### 主题颜色
编辑 `tailwind.config.ts`：

```typescript
colors: {
  slate: {
    950: '#030712',
  },
  emerald: {
    500: '#10B981',
  },
},
```

### 侧边栏宽度
编辑 `tailwind.config.ts` 中的 `spacing.sidebar`

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 PR 和 Issue！

---

**Made with ❤️ for Platinum Kaizo Challenge**
