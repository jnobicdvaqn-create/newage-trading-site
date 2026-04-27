# Next.js + Tailwind CSS 学习笔记

**学习时间：** 2026-04-16 01:00  
**学习人：** 星期五三世  
**学习目标：** 掌握安防独立站建站技术栈

---

## 📚 Next.js 核心概念

### 什么是 Next.js？
- React 框架，提供完整的 Web 应用构建能力
- 处理工具链、路由、数据获取、渲染优化
- 支持 SSR（服务端渲染）和 SSG（静态站点生成）

### 为什么选 Next.js？
| 特性 | 说明 | 业务价值 |
|------|------|---------|
| 路由系统 | 文件系统路由，零配置 | 快速搭建多页面网站 |
| 数据获取 | getServerSideProps / getStaticProps | SEO 友好，加载快 |
| API 路由 | 内置 API 端点 | 可对接后端服务 |
| 图片优化 | 自动优化图片 | 提升加载速度 |
| 部署简单 | Vercel 一键部署 | 零运维成本 |

---

## 🎨 Tailwind CSS 核心概念

### 什么是 Tailwind CSS？
- 原子化 CSS 框架
- 通过类名直接应用样式
- 零运行时，构建时生成 CSS

### 核心优势
| 特性 | 说明 | 示例 |
|------|------|------|
| 响应式 | 移动端优先 | `md:flex lg:grid` |
| 状态变体 | 悬停/聚焦/激活 | `hover:bg-blue-500` |
| 组件化 | 可复用样式模式 | `btn-primary` |
| 自定义主题 | 扩展配置 | `tailwind.config.js` |

### 常用类名速查
```css
/* 布局 */
flex, grid, block, inline-block
justify-center, items-center
w-full, h-screen, max-w-7xl

/* 间距 */
p-4, m-2, gap-6, space-x-4

/* 文字 */
text-3xl, font-bold, text-center
text-white, text-gray-500

/* 背景 */
bg-blue-500, bg-gradient-to-r
bg-cover, bg-center

/* 响应式 */
md:text-lg, lg:flex, xl:grid-cols-4
```

---

## 🛠️ 建站工作流

### 1. 初始化项目
```bash
npx create-next-app@latest my-site
cd my-site
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. 配置 Tailwind
```js
// tailwind.config.js
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### 3. 创建页面结构
```
pages/
├── index.js          # 首页
├── about.js          # 关于我们
├── services.js       # 服务展示
├── products.js       # 产品列表
└── contact.js        # 联系我们
```

### 4. 部署到 Vercel
```bash
git push origin main
# Vercel 自动检测 Next.js 并部署
```

---

## 🎯 安防独立站原型规划

### 页面结构
| 页面 | 内容 | 优先级 |
|------|------|--------|
| Hero | 视频背景 + 品牌标语 | P0 |
| About | 公司简介 + 工厂实力 | P0 |
| Products | 产品列表（摄像头/DVR/NVR） | P0 |
| Services | 出口服务流程 | P1 |
| Contact | 联系表单 + WhatsApp | P0 |

### 技术栈
- Next.js 14（App Router）
- Tailwind CSS
- Vercel 部署
- 多语言：i18next（中/英/俄/格）

---

**下一步：** 创建安防独立站原型项目
