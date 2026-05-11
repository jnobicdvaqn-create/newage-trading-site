# NewAge Trading 外贸独立站 v4.0 — 项目规格

## 项目概述
为格鲁吉亚外贸业务建设专业独立站，包含企业主站 + 利基SEO页面矩阵。

## 技术栈
- **框架**: Astro 5.x（静态站点生成，极速加载）
- **样式**: TailwindCSS 4.x
- **语言**: TypeScript
- **部署**: Docker + Nginx（Spaceship Starlight VM）
- **域名**: newage-trading.com

## 核心架构：双引擎

### 引擎1：企业主站（品牌展示）
专业的B2B外贸公司官网，三条业务线展示。

### 引擎2：利基SEO矩阵（程序化SEO引流）
基于数据驱动的程序化页面生成，覆盖1000+长尾关键词。

## 页面结构

### 主站页面
1. **首页** — Hero + 三业务线卡片 + 信任背书 + CTA
2. **汽车出口页** — 车型目录 + CIF报价计算器 + 出口流程图
3. **内衣OEM页** — OEM流程 + 面料展示 + MOQ说明 + 工厂实力
4. **安防设备页** — 产品线展示 + 认证标识 + 解决方案
5. **关于我们** — 公司介绍 + 团队 + 资质证书
6. **联系我们** — 表单 + WhatsApp + Telegram + 地图
7. **博客** — SEO内容发布

### 利基着陆页模板（程序化生成）
每个业务线生成多类利基页面：

#### 汽车出口利基页
- **车型价格页**: "BYD Han Price in Georgia 2026" × 20+车型
- **对比页**: "BYD vs Geely: Which Chinese Car for Georgia?" × 30+组合
- **出口指南页**: "How to Import Cars from China to [Country]" × 10+国家
- **FAQ页**: "Is it Legal to Import Chinese Cars to Georgia?" × 50+问题

#### 内衣OEM利基页
- **工厂目录页**: "Best Underwear Manufacturer in [City]" × 10+城市
- **面料对比页**: "Cotton vs Modal vs Bamboo Underwear" × 15+材质
- **OEM指南页**: "How to Start Private Label Lingerie from China" × 20+主题
- **市场趋势页**: "Lingerie Market Trends [Year] [Region]" × 10+

#### 安防设备利基页
- **产品对比页**: "Hikvision vs Dahua: Which CCTV for [场景]" × 15+
- **采购指南页**: "Security Camera Buying Guide for [场景]" × 20+
- **认证页**: "CE/FCC Certification for Security Equipment Export" × 10+
- **解决方案页**: "Security System for [场景: School/Office/Home]" × 15+

## 利基页面数据驱动
使用JSON数据文件定义变量，Astro动态路由生成页面：

```
src/data/
  cars.json        — 车型数据（品牌、型号、价格、参数）
  countries.json   — 目标国家（名称、关税、法规）
  fabrics.json     — 面料数据（名称、特性、价格）
  security.json    — 安防产品（型号、参数、认证）
  keywords.json    — SEO关键词矩阵
```

## SEO要求
- Schema.org结构化数据（Product, FAQ, HowTo, BreadcrumbList）
- hreflang标签（en/ru/zh三语）
- 自动sitemap.xml生成
- robots.txt
- Open Graph + Twitter Cards
- Core Web Vitals优化（LCP < 2.5s）
- 面包屑导航

## 设计要求
- 现代B2B外贸风格，深蓝+白+金色调
- 响应式设计（移动端优先）
- Hero区域大图 + 信任徽章
- 每页底部CTA区块（WhatsApp + Telegram + 邮件表单）
- 产品卡片网格布局
- 数据表格（价格、参数对比）

## 联系方式（嵌入页面）
- WhatsApp: +86-170-7278-3745
- Telegram: @richzhu001
- Email: felipeche01manager@YUNBSAOtrade.onmicrosoft.com

## i18n（三语）
- 英文（默认）: /en/
- 俄文: /ru/
- 中文: /zh/

## 部署
- Docker容器化
- Nginx反向代理 + SSL
- Cloudflare CDN
