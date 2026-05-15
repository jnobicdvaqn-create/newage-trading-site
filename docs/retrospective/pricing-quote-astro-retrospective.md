# NewAge Trading 独立站定价与询价改版复盘记录

**文档版本：** v1.0  
**创建日期：** 2026-05-15  
**关联 PR：** #7 (`feature/pricing-quote-astro`)  
**Merge Commit：** `e5034c1e`  
**状态：** PR #7 已合并到 main，代码已推送，VPS 尚未部署  

---

## 一、项目背景

### 1.1 为什么要做这次改版

原网站（旧版 Astro 站点）在以下方面存在明显不足：

| 问题维度 | 现状 | 影响 |
|---------|------|------|
| **价格展示** | 汽车业务无价格展示策略，安防/内衣价格硬编码 USD | 客户无法获取报价路径，询盘转化低 |
| **询价转化** | 无统一询价入口，WhatsApp/Telegram 链接分散 | 客户不知如何联系，流失率高 |
| **多语言支持** | 三语页面存在但不统一价格展示逻辑 | RU/ZH 页面价格展示与 EN 不一致 |
| **联系方式管理** | WhatsApp 号码、Telegram 账号、Email 硬编码在多个组件和页面中 | 改一个号码需要改 10+ 文件，易遗漏 |
| **数据集中度** | 无统一的 contact/pricing 配置文件 | 维护成本高，安全隐患大 |
| **SEO 与合规** | 裸路径（如 `/pricing`）404，Schema.org 电话硬编码 | 搜索引擎抓取异常，合规风险 |

### 1.2 业务目标

| 目标 | 具体描述 |
|------|---------|
| **汽车业务** | 不显示固定价，走"Price on Request"询价模式 |
| **安防标准品** | 显示参考价区间（Reference Price），非最终报价 |
| **安防方案** | 显示"Solution Quotation Available"，引导询价 |
| **内衣 OEM** | 显示价格区间 + MOQ，标注"Reference Only" |
| **询价转化** | 统一 WhatsApp/Telegram/Email/表单 四条询价路径 |
| **三语支持** | EN（主）/ RU（俄罗斯+中亚）/ ZH（中文辅助） |
| **配置集中化** | 联系方式 → `contact.ts`，价格 → `pricing.ts` |
| **表单策略** | 保持 `FORM_MODE = prototype`，不接后端 |
| **安全红线** | 真实联系方式不提交到 GitHub，用占位符+环境变量 |
| **发布路径** | PR 合并 → VPS Web Terminal 拉取→构建→部署 |

---

## 二、需求来源与决策过程

### 2.1 时间线

| 阶段 | 时间 | 关键决策 | 产出 |
|------|------|---------|------|
| **调研** | 05-06~05-08 | 确认竞对网站（BYD/Geely 官方站）均不显示车价 | 调研记录 |
| **策略确认** | 05-09 | 确认汽车不显示价格，安防显示参考区间 | 决策记录 |
| **技术选型** | 05-09 | 确认 Astro 5 + TailwindCSS + 静态构建 | 方案文档 |
| **三语结构** | 05-09 | `[lang]/pricing` + `i18n/pricing/{en,ru,zh}.ts` | 代码结构 |
| **FORM_MODE** | 05-09 | 确认 `prototype`，不接后端，表单提示"will contact you" | 代码实现 |
| **WhatsApp 不写死** | 05-10 | `contact.ts` 从 `import.meta.env.PUBLIC_WHATSAPP_NUMBER` 读取 | `e1adb519` |
| **Telegram 不写死** | 05-14 | 硬编码真实 Telegram handle → `@placeholder_telegram` | `d3b19475` |
| **Email 不写死** | 05-15 | `contact.ts` 增加 `PUBLIC_CONTACT_EMAIL` 环境变量 | `5b6e09a6` |
| **价格迁移** | 05-09 | 所有价格从页面模板迁移到 `pricing.ts` | `337b0a2c` |
| **裸路径跳转** | 05-09 | `/pricing` → `/en/pricing` 等 6 条路由 | `337b0a2c` |
| **LanguageSwitcher** | 05-09 | 新建组件，保持当前路径切换语言 | `337b0a2c` |
| **WhatsAppFloatingButton** | 05-09 | 新建组件，根据页面类型生成上下文消息 | `337b0a2c` |
| **Draft PR 流程** | 05-10 | 确认 PR 先 Draft，人工审核后再 Ready | PR #7 |
| **占位符化** | 05-14 | Telegram/WhatsApp/Email 全部占位符 | `9311fe56` |
| **dist 清理** | 05-14 | `git rm -r --cached dist/`，400+ 文件移除跟踪 | `d3b19475` |
| **hreflang 修复** | 05-14 | `x-default` 双斜杠 `//` → 单斜杠 | `8c2c5ec1` |
| **PR 合并** | 05-15 | PR #7 合并到 main | `90fed708` |
| **VPS 待部署** | 05-15 | SSH 被封锁，需通过 Web Terminal 操作 | 待执行 |

---

## 三、本次改版范围

### 3.1 配置文件

#### `src/config/contact.ts`（新建）

**作用：** 联系方式单一数据源

| 字段 | 读取方式 | 环境变量 | 占位符回退 |
|------|---------|---------|-----------|
| `whatsappDisplay` | `import.meta.env.PUBLIC_WHATSAPP_DISPLAY` | 显示号码（+XX 格式） | `'+XX XXXXX XXXXX'` |
| `whatsappNumber` | `import.meta.env.PUBLIC_WHATSAPP_NUMBER` | wa.me 链接号码 | `'WHATSAPP_NUMBER'` |
| `email` | `import.meta.env.PUBLIC_CONTACT_EMAIL` | 联系邮箱 | `'CONTACT_EMAIL'` |
| `telegram` | `import.meta.env.PUBLIC_TELEGRAM` | TG handle（无@） | `'placeholder_telegram'` |
| `telegramUrl` | `import.meta.env.PUBLIC_TELEGRAM_URL` | TG 链接 | `'https://t.me/placeholder_telegram'` |
| `companyName` | 硬编码 | — | `'NewAge Trading'` |
| `workingHours` | 硬编码 | — | `'9:00–18:00 (Beijing Time, UTC+8)'` |

**辅助函数：**
- `isWhatsAppConfigured()`: 判断是否已配置真实号码（非占位符）
- `waLink(pageSlug)`: 根据页面类型生成带预填消息的 wa.me 链接
- `whatsAppMessages`: 7 种页面类型的上下文消息模板

**安全设计：** 环境变量缺失时自动回退到占位符，不会暴露任何真实信息。

#### `src/config/pricing.ts`（新建）

**作用：** 定价策略单一数据源

| 业务线 | `priceType` | 价格范围 | MOQ | 说明 |
|--------|------------|---------|-----|------|
| 汽车 | `quote_only` | — | — | Price on Request，不显示任何价格 |
| 安防标准品 | `reference_range` | $50–$800 | — | Reference Price，标注 reference only |
| 安防方案 | `solution_quote` | — | — | Solution Quotation Available |
| 内衣 OEM | `range_moq` | $2–$15/piece | 300 | Price Range + MOQ |

**关键声明：**
- `disclaimers.universal`：所有价格页面必须显示的"reference only"免责声明
- `disclaimers.vehicles`：汽车专用免责声明（运费/关税/上牌另计）
- `disclaimers.oem`：内衣 OEM 专用声明（面料/颜色/工艺影响最终价格）
- `FORM_MODE = 'prototype'`：表单未接后端

### 3.2 i18n 国际化

| 文件 | 内容 | 行数 |
|------|------|------|
| `src/i18n/index.ts`（修改） | 新增 `getPricingTranslations()`、`tp()` 函数 | +23 |
| `src/i18n/pricing/en.ts`（新建） | 定价英文文案 | 214 |
| `src/i18n/pricing/ru.ts`（新建） | 定价俄文文案 | 214 |
| `src/i18n/pricing/zh.ts`（新建） | 定价中文文案 | 214 |

**设计原则：** i18n 只存文案，不存业务数据（价格/配置放 config）。

### 3.3 组件

| 组件 | 类型 | 行数 | 作用 |
|------|------|------|------|
| `PriceBadge.astro` | 新建 | 40 | 根据 `priceType` 渲染不同标签（Price on Request / Reference Price 等） |
| `QuoteCTA.astro` | 新建 | 51 | 询价 CTA 按钮（WhatsApp/Email/Telegram 三通道） |
| `QuoteForm.astro` | 新建 | 151 | 询价表单（prototype 模式，6 个字段） |
| `WhatsAppFloatingButton.astro` | 新建 | 74 | 全局悬浮 WhatsApp 按钮，根据页面类型生成上下文消息 |
| `PricingDisclaimer.astro` | 新建 | 51 | 价格免责声明（从 `pricing.ts` 读取文案） |
| `CostBreakdown.astro` | 新建 | 50 | 费用明细组件（CIF 估算，标注 reference only） |
| `LanguageSwitcher.astro` | 新建 | 51 | 语言切换器，保持当前路径 |
| `CTA.astro` | 修改 | +4-2 | Telegram 链接改为从 `contact.ts` 读取 |
| `CTASection.astro` | 修改 | +6-4 | WhatsApp/Telegram 改为从 `contact.ts` 读取 |
| `Header.astro` | 修改 | +3-58 | 删除旧代码，添加 LanguageSwitcher |
| `Footer.astro` | 修改 | +10-5 | 联系方式从 `contact.ts` 读取 |
| `BaseLayout.astro` | 修改 | +6-1 | hreflang x-default 修复 |

### 3.4 页面

| 页面 | 类型 | 行数 | 说明 |
|------|------|------|------|
| `[lang]/pricing` | 新建 | 168 | 定价总览页（三语） |
| `[lang]/faq/pricing` | 新建 | 61 | 定价 FAQ（三语） |
| `[lang]/calculator` | 新建 | 246 | CIF 费用估算器（三语） |
| `[lang]/vehicles-from-china` | 新建 | 99 | 汽车出口业务页（三语） |
| `[lang]/security-solutions` | 新建 | 141 | 安防方案页（三语） |
| `[lang]/underwear-oem` | 新建 | 130 | 内衣 OEM 页（三语） |
| `[lang]/contact` | 修改 | +41-5 | 联系方式从 `contact.ts` 读取 |
| `[lang]/index` | 修改 | +39-39 | 首页价格展示逻辑更新 |
| `[lang]/privacy` | 修改 | +5-5 | Email 从 `contact.ts` 读取 |
| `[lang]/terms` | 修改 | +5-5 | Email 从 `contact.ts` 读取 |

**裸路径跳转页面（新建 6 个）：**

| 裸路径 | 跳转目标 | 实现方式 |
|--------|---------|---------|
| `/pricing` | `/en/pricing` | 静态 redirect 页面 |
| `/calculator` | `/en/calculator` | 静态 redirect 页面 |
| `/faq/pricing` | `/en/faq/pricing` | 静态 redirect 页面 |
| `/vehicles-from-china` | `/en/vehicles-from-china` | 静态 redirect 页面 |
| `/security-solutions` | `/en/security-solutions` | 静态 redirect 页面 |
| `/underwear-oem` | `/en/underwear-oem` | 静态 redirect 页面 |

### 3.5 Git 与仓库清理

| 变更 | 原因 | Commit |
|------|------|--------|
| `.gitignore` 新增 `dist/` 和 `.env.local` | 防止构建产物和敏感配置进入版本控制 | `d3b19475` |
| `git rm -r --cached dist/` | 400+ dist 文件已被跟踪，需显式移除 | `d3b19475` |
| `translations.json.v2` 清理 | 临时文件，已完成迁移 | — |
| 敏感信息扫描 | 确认 src/ 无真实手机号/邮箱/Telegram/GitHub Token | `e1adb519` |

---

## 四、核心架构说明

### 4.1 联系方式架构

```
用户访问页面
    ↓
Header/Footer/CTA/Contact 组件
    ↓
import { contact } from '@config/contact'
    ↓
contact.ts 读取 import.meta.env.PUBLIC_*
    ↓
环境变量存在 → 真实值
环境变量缺失 → 占位符
    ↓
渲染到页面 / wa.me 链接 / mailto 链接 / t.me 链接
```

**单一数据源保证：** 所有联系方式只从 `contact.ts` 读取，任何组件/页面不得硬编码。

### 4.2 定价架构

```
用户访问价格页
    ↓
页面组件 import { pricingLines, disclaimers } from '@config/pricing'
    ↓
pricing.ts 定义所有价格数据
    ↓
PriceBadge 根据 priceType 渲染不同标签
PricingDisclaimer 显示免责声明
    ↓
渲染到页面
```

**数据与文案分离：** `pricing.ts` 存数据，`i18n/pricing/*.ts` 存文案。

### 4.3 i18n 架构

```
页面调用 t(key, locale) → 从 translations.json 读取
页面调用 tp(key, locale) → 从 i18n/pricing/{locale}.ts 读取
LanguageSwitcher → localePath(locale, currentPath) 保持路径
```

### 4.4 QuoteForm 保持 prototype 的原因

| 考虑 | 说明 |
|------|------|
| 后端未就绪 | FormSubmit.co 已配置但需确认邮箱可达性 |
| 合规风险 | 表单收集客户信息需隐私政策确认 |
| 安全考虑 | prototype 阶段不存储任何客户数据 |
| 成本控制 | 遵守付费功能禁止铁规 |

**prototype 模式行为：**
- 表单可填写并提交
- 提交后显示"Thank you"页面
- 不发送真实邮件（或发送到测试地址）
- 页面文案不暗示"已成功发送"

### 4.5 WhatsAppFloatingButton 上下文消息

```typescript
whatsappMessages = {
  default:    "Hello, I am interested in your export products..."
  vehicles:   "Hello, I am interested in importing vehicles from China..."
  security:   "Hello, I am interested in security products / CCTV solutions..."
  oem:        "Hello, I am interested in underwear OEM / wholesale..."
  pricing:    "Hello, I would like to get a quotation..."
  calculator: "Hello, I used your cost estimate tool..."
}
```

**设计意图：** 客户点击按钮时自动带入上下文相关消息，提高转化率。

### 4.6 Schema.org 不硬编码的原因

- JSON-LD 的 `telephone` 字段如填入占位符，会被搜索引擎标记为无效
- 解决方案：在 VPS 构建时使用真实值，GitHub 源码使用占位符
- **当前状态：** Schema.org `telephone` 在占位符模式下可能输出占位值，VPS 部署时需确认

---

## 五、关键问题与修复记录

### 5.1 CostBreakdown tp() key 不匹配

| 项目 | 内容 |
|------|------|
| **问题表现** | `CostBreakdown.astro` 中 `tp()` 调用使用了不存在的 key，导致页面显示 key 名而非文案 |
| **风险影响** | 费用明细页面显示原始 key，客户看不懂 |
| **修复方式** | 补充 `i18n/pricing/{en,ru,zh}.ts` 中缺失的 key |
| **预防措施** | 新增组件后运行 `npm run build` 确认无 i18n fallback |

### 5.2 安防/内衣 USD 价格硬编码

| 项目 | 内容 |
|------|------|
| **问题表现** | 旧版页面中直接写入 `$500-800` 等 USD 价格 |
| **风险影响** | 修改价格需要改多个页面，易不一致 |
| **修复方式** | 全部迁移到 `pricing.ts`，页面只引用 |
| **预防措施** | 禁止在页面模板中硬编码任何价格数字 |

### 5.3 LanguageSwitcher / WhatsAppFloatingButton 文件缺失

| 项目 | 内容 |
|------|------|
| **问题表现** | Header 引用了不存在的组件文件 |
| **风险影响** | 构建失败或页面功能缺失 |
| **修复方式** | 新建 `LanguageSwitcher.astro` 和 `WhatsAppFloatingButton.astro` |
| **预防措施** | 新增组件后立即构建验证 |

### 5.4 /pricing 裸路径 404

| 项目 | 内容 |
|------|------|
| **问题表现** | 访问 `newage-trading.com/pricing` 返回 404 |
| **风险影响** | SEO 损失，用户流失 |
| **修复方式** | 新建 6 个裸路径 redirect 页面（`/pricing` → `/en/pricing` 等） |
| **预防措施** | 新增裸路径后测试所有 6 条路由 |

### 5.5 contact.astro Schema.org 电话硬编码

| 项目 | 内容 |
|------|------|
| **问题表现** | JSON-LD 的 `telephone` 字段硬编码了真实号码 |
| **风险影响** | 号码泄露到 GitHub，合规风险 |
| **修复方式** | 改为从 `contact.ts` 读取 |
| **预防措施** | 安全扫描中增加 JSON-LD 检查 |

### 5.6 WhatsApp 真实号码残留风险

| 项目 | 内容 |
|------|------|
| **问题表现** | 多个组件和页面中硬编码 `+XX XXXXX XXXXX` |
| **风险影响** | 号码公开到 GitHub |
| **修复方式** | 全部迁移到 `contact.ts` 环境变量 |
| **预防措施** | `grep -rn` 扫描 `+86` / `+XX` 等模式 |

### 5.7 Telegram 真实账号硬编码风险

| 项目 | 内容 |
|------|------|
| **问题表现** | `contact.ts` 注释和代码中硬编码真实 Telegram handle |
| **风险影响** | Telegram 账号公开到 GitHub |
| **修复方式** | 代码 → `placeholder_telegram`，注释 → 占位符 |
| **预防措施** | 安全扫描中增加 `<handle>` 模式 |

### 5.8 translations.json.v2 临时文件

| 项目 | 内容 |
|------|------|
| **问题表现** | 迁移过程中的临时文件残留在工作区 |
| **风险影响** | 文件混淆，可能导致错误的翻译引用 |
| **修复方式** | 清理临时文件 |
| **预防措施** | 开发完成后清理临时文件 |

### 5.9 dist/ 构建产物误入 Git 跟踪

| 项目 | 内容 |
|------|------|
| **问题表现** | 400+ dist 文件被 Git 跟踪（`.gitignore` 在 `dist/` 被添加后才配置） |
| **风险影响** | 仓库膨胀，VPS 同步时可能用旧 dist 覆盖新构建 |
| **修复方式** | `git rm -r --cached dist/` + `.gitignore` 添加 `dist/` |
| **预防措施** | 项目初期就配置 `.gitignore` |

### 5.10 子模块干扰导致不能用 git add -A

| 项目 | 内容 |
|------|------|
| **问题表现** | `node_modules` 作为子模块存在，`git add -A` 会尝试跟踪 |
| **风险影响** | commit 包含无关文件，push 被拒绝 |
| **修复方式** | 精确 `git add <具体文件>` |
| **预防措施** | 禁用 `git add -A`，使用精确路径 |

### 5.11 Draft PR 中 untracked 文件表述不准确

| 项目 | 内容 |
|------|------|
| **问题表现** | `git status` 显示大量 untracked dist 文件，与 PR 实际变更不符 |
| **风险影响** | 审核者无法准确评估变更范围 |
| **修复方式** | 移除 dist/ 跟踪后，`git status` 恢复正常 |
| **预防措施** | PR 审核前确保 `git status` 干净 |

### 5.12 BaseLayout.astro hreflang x-default 双斜杠

| 项目 | 内容 |
|------|------|
| **问题表现** | `hreflang="x-default"` 的 URL 出现 `//`（如 `https://newage-trading.com//en/`） |
| **风险影响** | 搜索引擎可能视为无效 hreflang |
| **修复方式** | 修复 `localePath` 拼接逻辑，`8c2c5ec1` |
| **预防措施** | 构建后检查 hreflang 标签 |

### 5.13 Header.astro 删除旧代码需 diff review

| 项目 | 内容 |
|------|------|
| **问题表现** | Header 修改涉及大量代码删除（-58 行），需确认不删错 |
| **风险影响** | 误删功能代码 |
| **修复方式** | `git diff` 逐行 review 后确认 |
| **预防措施** | 大删除操作必须 diff review |

### 5.14 PR 合并后 VPS 尚未部署

| 项目 | 内容 |
|------|------|
| **问题表现** | PR #7 已合并到 main，但 VPS 仍运行旧版代码 |
| **风险影响** | 新功能用户看不到 |
| **修复方式** | 需通过 VPS Web Terminal 手动部署 |
| **当前状态** | SSH 被封锁，待主人通过 Web Terminal 操作 |

### 5.15 SSH 被封锁，需改用 Web Terminal

| 项目 | 内容 |
|------|------|
| **问题表现** | Spaceship 防火墙封锁外部 SSH（22/22022 端口均不可达） |
| **风险影响** | 无法远程部署 |
| **修复方式** | 编写 Web Terminal 操作 SOP |
| **预防措施** | 维护 VPS Web Terminal 操作指南文档 |

---

## 六、验证与验收记录

### 6.1 构建验证

| 检查项 | 结果 | 说明 |
|--------|------|------|
| `npm run build` | ✅ 通过 | 367 页，0 警告，0 404，0 i18n fallback |
| `npm run check` | 未配置 | 项目未启用 Astro check |
| 页面总数 | 367 | EN/RU/ZH × 多页面 |

### 6.2 多语言页面检查（18 个核心页面）

| 页面 | EN | RU | ZH |
|------|----|----|----|
| `/pricing` | ✅ | ✅ | ✅ |
| `/calculator` | ✅ | ✅ | ✅ |
| `/faq/pricing` | ✅ | ✅ | ✅ |
| `/vehicles-from-china` | ✅ | ✅ | ✅ |
| `/security-solutions` | ✅ | ✅ | ✅ |
| `/underwear-oem` | ✅ | ✅ | ✅ |

### 6.3 裸路径跳转检查（6 条）

| 裸路径 | 跳转目标 | 状态 |
|--------|---------|------|
| `/pricing` | `/en/pricing` | ✅ |
| `/calculator` | `/en/calculator` | ✅ |
| `/faq/pricing` | `/en/faq/pricing` | ✅ |
| `/vehicles-from-china` | `/en/vehicles-from-china` | ✅ |
| `/security-solutions` | `/en/security-solutions` | ✅ |
| `/underwear-oem` | `/en/underwear-oem` | ✅ |

### 6.4 安全扫描

| 扫描项 | 方法 | 结果 |
|--------|------|------|
| 真实 WhatsApp 号码 | `grep -rn "8617" src/` | ✅ 无残留 |
| 真实 Email | `grep -rn "manager003\|felipeche" src/` | ✅ 无残留 |
| 真实 Telegram | `grep -rn "telegram_handle" src/` | ✅ 无残留 |
| GitHub Token | `grep -rn "ghp" src/` | ✅ 无残留 |
| dist/ 提交 | `git ls-files --cached dist/` | ✅ 0 文件 |
| .env.local 提交 | `git ls-files --cached .env.local` | ✅ 0 文件 |
| 注释中的真实信息 | `grep -rn` 扫描所有敏感模式 | ✅ 已清理 |

### 6.5 构建产物验证（真实环境变量）

| 检查项 | 占位符模式 | 真实环境变量模式 |
|--------|-----------|-----------------|
| wa.me 链接 | `wa.me/WHATSAPP_NUMBER` | `wa.me/<number>` ✅ |
| Email 链接 | `mailto:CONTACT_EMAIL` | `mailto:<email>` ✅ |
| Telegram 链接 | `t.me/placeholder_telegram` | `t.me/<handle>` ✅ |
| WhatsApp 显示 | `+XX XXXXX XXXXX` | `+XX XXXXX XXXXX` ✅ |
| Telegram 显示 | `placeholder_telegram` | `<handle>` ✅ |
| FormSubmit 目标 | `formsubmit.co/CONTACT_EMAIL` | `formsubmit.co/<email>` ✅ |

### 6.6 Git 与 PR 验证

| 检查项 | 结果 |
|--------|------|
| PR #7 状态 | 已合并到 main |
| Merge commit | `e5034c1e` |
| 分支 | `feature/pricing-quote-astro` → `main` |
| 总变更 | 438 files changed, +2372 / -5087 |
| src/ 安全扫描 | ✅ CLEAN |
| dist/ 未提交 | ✅ 确认 |

---

## 七、Git、PR 与 main 合并记录

### 7.1 分支信息

| 项目 | 值 |
|------|-----|
| 功能分支 | `feature/pricing-quote-astro` |
| 目标分支 | `main` |
| PR 编号 | #7 |
| PR 标题 | `feat: add multilingual pricing and quote flow pages` |

### 7.2 主要 Commits（按时间倒序）

| Hash | 类型 | Message | 变更 |
|------|------|---------|------|
| `e1adb519` | fix | remove real contact info from comments | `contact.ts` 注释占位符化 |
| `5b6e09a6` | feat | add env var support for all contact methods | `contact.ts` 增加 Email/Telegram 环境变量 |
| `d3b19475` | fix | sanitize Telegram contact + remove dist/ from git tracking | Telegram 占位符化 + 400 dist 文件移除 |
| `8c2c5ec1` | fix | normalize hreflang x-default URL | BaseLayout 双斜杠修复 |
| `9311fe56` | chore | sanitize contact placeholders and pricing config | 10 文件，WhatsApp/Email 占位符化 |
| `337b0a2c` | feat | add multilingual pricing and quote flow pages | 31 文件，2277 行新增 |
| `90fed708` | merge | Merge PR #7: feat add multilingual pricing and quote flow pages | 438 files changed |

### 7.3 当前状态

| 状态 | 值 |
|------|-----|
| PR #7 | ✅ 已合并到 main |
| main 分支 | ✅ 已推送，包含全部改版代码 |
| VPS 部署 | ⏳ 尚未部署，待 Web Terminal 操作 |
| 表单后端 | ⏳ 未接入，保持 prototype |
| 真实联系方式 | ⏳ 需在 VPS 环境变量中配置 |
| dist/ 跟踪 | ✅ 已移除 |
| .env.local 跟踪 | ✅ 已在 .gitignore |

---

## 八、未完成事项

| 序号 | 待办事项 | 责任人 | 优先级 | 依赖 |
|------|---------|--------|--------|------|
| 1 | VPS Web Terminal 登录 | 主人 | P0 | — |
| 2 | VPS 上 `git pull origin main` | 主人/助手 | P0 | 1 |
| 3 | VPS 配置 `.env.production`（WhatsApp/Email/Telegram） | 主人 | P0 | 1 |
| 4 | VPS 执行 `npm install` 或 `npm ci` | 主人/助手 | P0 | 2 |
| 5 | VPS 执行 `npm run build` | 主人/助手 | P0 | 3,4 |
| 6 | 构建产物部署到 Nginx 静态目录 | 主人/助手 | P0 | 5 |
| 7 | 构建后确认页面不显示占位符 | 主人/助手 | P0 | 6 |
| 8 | Nginx 配置确认（静态目录/缓存） | 主人/助手 | P1 | 6 |
| 9 | 发布后回归检查（10+ 页面） | 主人/助手 | P0 | 6 |
| 10 | `pricing.ts` 真实价格审核 | 主人 | P1 | — |
| 11 | 表单后端方案选择（email/email_feishu） | 主人 | P2 | — |
| 12 | sitemap/meta 部署后复验 | 主人/助手 | P1 | 6 |
| 13 | 移动端真机测试 | 主人 | P1 | 6 |
| 14 | 发布后收集询盘路径数据 | 主人/助手 | P2 | 6 |

---

## 九、回滚方案

### 9.1 PR 已合并但 VPS 未部署

| 场景 | 操作 | 风险 |
|------|------|------|
| 发现 main 有问题 | `git revert -m 1 90fed708` 撤销 merge commit | 低，可随时 revert |
| 暂缓 VPS 发布 | 不执行 Web Terminal 部署步骤 | 无风险 |

### 9.2 VPS 已部署后发现问题

| 场景 | 操作 | 风险 |
|------|------|------|
| 页面异常 | 恢复备份的 dist 目录 | 低，需提前备份 |
| 联系方式错误 | 修改 `.env.production` 后重新构建 | 低 |
| 表单异常 | 设置 `PUBLIC_FORM_MODE=prototype` 重新构建 | 低 |
| 新增页面需下线 | 删除对应 redirect 页面文件 | 低 |

### 9.3 Web Terminal 操作中止

| 场景 | 操作 |
|------|------|
| 构建失败 | 使用备份 dist，不部署新构建产物 |
| 环境变量错误 | 修正 `.env.production` 后重新构建 |
| Nginx 异常 | `nginx -t` 测试通过后再 reload |
| 不确定 | **立即停止，不继续下一步** |

### 9.4 关键回滚命令

```bash
# 撤销 merge commit（在 main 分支执行）
git revert -m 1 e5034c1e

# VPS 恢复旧 dist
cp -r /var/www/newage-trading.com/dist.bak/* /var/www/newage-trading.com/dist/

# VPS 关闭新页面（删除 redirect 页面）
rm src/pages/pricing.astro src/pages/calculator.astro ...
```

---

## 十、经验教训

| # | 教训 | 说明 |
|---|------|------|
| 1 | **配置集中化至关重要** | 改一个号码只需改 `contact.ts`，不是 10+ 文件 |
| 2 | **绝不硬编码真实联系方式** | GitHub 是公开仓库，任何硬编码 = 公开泄露 |
| 3 | **价格数据不能写在页面模板里** | 维护成本高，多语言不一致风险大 |
| 4 | **i18n 不承担业务数据职责** | i18n 存文案，config 存数据，职责分离 |
| 5 | **表单后端不能过早接入** | 合规/安全/成本均未就绪时，prototype 最安全 |
| 6 | **先 Draft PR 再合并** | 人工审核是最后一道安全防线 |
| 7 | **移动端必须提前验收** | 375px 屏幕上的布局问题在桌面端看不到 |
| 8 | **dist/ 和 .env.local 绝不能提交** | 构建产物进 Git = 仓库膨胀 + 部署混乱 |
| 9 | **每次都要做敏感信息扫描** | `grep -rn` 扫描必须在每次 commit 前执行 |
| 10 | **多语言路由要重点检查** | 裸路径 404、hreflang 双斜杠、LanguageSwitcher 跳回首页 |
| 11 | **PR 合并 ≠ 正式发布** | 合并只是代码进入 main，部署是独立步骤 |
| 12 | **VPS 发布前必须确认环境变量** | 没有环境变量 = 构建出来全是占位符 |
| 13 | **SSH 不可用时要准备 Web Terminal SOP** | Spaceship 防火墙特性导致外部 SSH 封锁 |

---

*本文档基于真实 Git 仓库状态、commit 记录和 PR #7 变更记录生成。所有联系方式均以占位符表示，未包含任何真实手机号、邮箱或 Telegram 账号。*
