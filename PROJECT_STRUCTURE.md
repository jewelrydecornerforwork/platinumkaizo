# 项目文件树

```
platinum-kaizo/
│
├── 📄 package.json                 # 项目依赖配置
├── 📄 tsconfig.json                # TypeScript 配置
├── 📄 next.config.js               # Next.js 配置
├── 📄 tailwind.config.ts           # Tailwind CSS 配置
├── 📄 postcss.config.js            # PostCSS 配置
├── 📄 next-env.d.ts                # Next.js 环境类型定义
├── 📄 .eslintrc.json               # ESLint 配置
├── 📄 .prettierrc                  # Prettier 格式化配置
├── 📄 .gitignore                   # Git 忽略文件
├── 📄 .env.example                 # 环境变量示例
│
├── 📚 README.md                    # 项目 README
├── 📚 QUICKSTART.md                # 快速开始指南
├── 📚 ARCHITECTURE.md              # 架构设计文档
│
├── 📂 public/                      # 静态资源目录
│   └── (favicon, 图片等)
│
├── 📂 src/
│   │
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── layout.tsx              # 🔑 全局布局（主要文件）
│   │   ├── page.tsx                # 首页
│   │   │
│   │   ├── 📂 pokedex/
│   │   │   └── page.tsx            # 全图鉴页面
│   │   │
│   │   ├── 📂 bosses/
│   │   │   └── page.tsx            # 馆主战术页面
│   │   │
│   │   ├── 📂 calc/
│   │   │   └── page.tsx            # 伤害计算器页面
│   │   │
│   │   └── 📂 teambuilder/
│   │       └── page.tsx            # 队伍配置页面
│   │
│   ├── 📂 components/              # React 组件
│   │   │
│   │   ├── 📂 layout/
│   │   │   ├── Sidebar.tsx         # 侧边栏组件
│   │   │   ├── Sidebar.module.css  # 侧边栏样式模块
│   │   │   └── Header.tsx          # 移动端 Header
│   │   │
│   │   └── 📂 providers/
│   │       └── SidebarProvider.tsx # 侧边栏 Context Provider
│   │
│   ├── 📂 lib/                     # 工具和配置
│   │   ├── navigation.ts           # 导航菜单配置
│   │   └── utils.ts                # 通用工具函数
│   │
│   ├── 📂 types/                   # TypeScript 类型定义
│   │   └── index.ts                # 全局类型声明
│   │
│   └── globals.css                 # 全局样式 (Tailwind + 自定义)
│
└── .git/                           # Git 仓库信息
```

## 文件说明速查表

### 配置文件
| 文件 | 用途 |
|------|------|
| `package.json` | npm 依赖和脚本 |
| `tsconfig.json` | TypeScript 编译配置 |
| `next.config.js` | Next.js 框架配置 |
| `tailwind.config.ts` | Tailwind CSS 主题定义 |
| `postcss.config.js` | PostCSS 处理器配置 |
| `.eslintrc.json` | 代码质量检查规则 |
| `.prettierrc` | 代码格式化规则 |

### 核心应用文件
| 文件 | 重要性 | 说明 |
|------|--------|------|
| `src/app/layout.tsx` | ⭐⭐⭐ | **全局布局** - 侧边栏和主内容布局 |
| `src/components/layout/Sidebar.tsx` | ⭐⭐⭐ | **侧边栏** - 导航菜单组件 |
| `src/components/providers/SidebarProvider.tsx` | ⭐⭐ | **状态管理** - 侧边栏开关状态 |
| `src/lib/navigation.ts` | ⭐⭐ | **导航配置** - 菜单项定义 |
| `src/globals.css` | ⭐⭐ | **全局样式** - 主题和全局样式 |
| `src/components/layout/Header.tsx` | ⭐ | **移动端Header** - 菜单按钮 |

### 页面文件
| 文件 | 说明 |
|------|------|
| `src/app/page.tsx` | 首页 / 主页 |
| `src/app/pokedex/page.tsx` | 全图鉴页面 |
| `src/app/bosses/page.tsx` | 馆主战术页面 |
| `src/app/calc/page.tsx` | 伤害计算器页面 |
| `src/app/teambuilder/page.tsx` | 队伍配置页面 |

### 类型定义
| 文件 | 说明 |
|------|------|
| `src/types/index.ts` | 全局 TypeScript 接口和类型 |
| `next-env.d.ts` | Next.js 环境类型支持 |

## 代码行数统计

```
src/app/
  ├── layout.tsx          ~50 行  (主布局)
  ├── page.tsx            ~70 行  (首页)
  └── */page.tsx          ~10 行 x4 (页面)

src/components/
  ├── layout/Sidebar.tsx  ~80 行  (侧边栏)
  └── providers/          ~40 行  (Provider)

src/lib/
  ├── navigation.ts       ~25 行  (配置)
  └── utils.ts            ~40 行  (工具)

Global Styles           ~40 行  (globals.css)
```

**总计：约 450+ 行业务代码**

## 依赖关系图

```
app/layout.tsx
├── SidebarProvider (state management)
├── Sidebar.tsx
│   ├── useSidebar hook
│   └── navItems (from navigation.ts)
├── Header.tsx
│   └── useSidebar hook
└── children (页面内容)
```

---

**项目结构完全，所有文件已初始化！** ✅
