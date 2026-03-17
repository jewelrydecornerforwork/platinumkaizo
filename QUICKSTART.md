# 🚀 快速开始指南

## 项目初始化

### 1️⃣ 安装依赖

```bash
npm install
```

或使用其他包管理器：
```bash
yarn install
pnpm install
bun install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

然后打开浏览器访问：
```
http://localhost:3000
```

### 3️⃣ 开始编辑

在 `src/app/page.tsx` 或 `src/components/` 中进行修改，浏览器会自动刷新。

---

## 📖 常用命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

---

## 🎨 项目特色

✨ **深色主题** - Slate-950 背景 + 电光绿点缀
📱 **响应式设计** - 完美适配移动端和桌面端
⚡ **高性能** - Next.js 14 App Router 的最新特性
🔒 **类型安全** - 完整的 TypeScript 支持
🧩 **组件化** - 模块化的组件结构

---

## 📂 关键文件

| 文件 | 说明 |
|------|------|
| `src/app/layout.tsx` | 全局布局（🔑 关键文件）|
| `src/components/layout/Sidebar.tsx` | 侧边栏导航 |
| `src/components/layout/Header.tsx` | 移动端 Header |
| `src/lib/navigation.ts` | 导航配置 |
| `src/globals.css` | 全局样式 |
| `tailwind.config.ts` | Tailwind 主题配置 |

---

## 🎯 下一步

### 添加新页面
```typescript
// 创建 src/app/new-page/page.tsx
export default function NewPage() {
  return <h1>新页面</h1>;
}
```

### 编辑导航菜单
编辑 `src/lib/navigation.ts` 中的 `navItems`

### 自定义颜色
编辑 `tailwind.config.ts` 中的 `colors` 配置

### 修改侧边栏宽度
编辑 `tailwind.config.ts` 中的 `spacing.sidebar`

---

## 🐛 调试

### 浏览器开发者工具
- 打开：F12 或 Ctrl+Shift+I
- 查看 React 组件树（需要 React DevTools 扩展）

### Next.js 调试
查看终端输出获取详细的构建日志

### TypeScript 错误
运行 `npm run type-check` 查看所有类型错误

---

## 📚 学习资源

- [Next.js 文档](https://nextjs.org)
- [React 官方文档](https://react.dev)
- [Tailwind CSS 中文文档](https://www.tailwindcss.cn)
- [TypeScript 文档](https://www.typescriptlang.org)

---

## ✅ 检查清单

- [ ] 安装依赖：`npm install`
- [ ] 启动开发服务器：`npm run dev`
- [ ] 访问 http://localhost:3000
- [ ] 尝试编辑页面
- [ ] 查看响应式设计（缩小浏览器窗口）
- [ ] 打开移动端菜单（点击 Header 的汉堡菜单）

---

**祝你开发愉快！** 🎉
