# 独立站 Astro 改版标准 SOP

**文档版本：** v1.0  
**创建日期：** 2026-05-15  
**适用范围：** NewAge Trading 独立站所有 Astro 改版、新增页面、发布流程  
**关联文档：** `docs/retrospective/pricing-quote-astro-retrospective.md`、`docs/deployment/vps-web-terminal-deploy-guide.md`  

---

## 一、适用范围

本 SOP 适用于以下场景：

| 场景 | 示例 |
|------|------|
| 独立站页面改版 | 首页更新、关于页修改 |
| 新增业务页面 | 定价页、计算器、FAQ |
| 多语言页面 | EN/RU/ZH 三语同步新增 |
| 价格展示策略调整 | 从固定价改为询价、价格区间更新 |
| 联系方式调整 | WhatsApp/Telegram/Email 号码变更 |
| 表单询价流程 | 新增表单字段、修改提交逻辑 |
| SEO 页面 | sitemap、hreflang、canonical 修改 |
| Astro 静态站发布前检查 | 构建验证、安全扫描 |
| GitHub PR 流程 | feature 分支 → Draft PR → Review → Merge |
| VPS Web Terminal 发布 | SSH 不可用时的部署流程 |

---

## 二、标准流程总览

```
阶段 1：需求确认
  ↓
阶段 2：调研与策略
  ↓
阶段 3：页面原型
  ↓
阶段 4：配置集中化（contact.ts / pricing.ts）
  ↓
阶段 5：组件化开发
  ↓
阶段 6：多语言接入（i18n/pricing/*.ts）
  ↓
阶段 7：本地构建（npm run build）
  ↓
阶段 8：安全扫描（grep 敏感信息）
  ↓
阶段 9：移动端验收（375px 响应式）
  ↓
阶段10：Git feature 分支
  ↓
阶段11：Draft PR
  ↓
阶段12：人工预览确认
  ↓
阶段13：合并 main
  ↓
阶段14：VPS 发布准备（环境变量）
  ↓
阶段15：VPS Web Terminal 部署
  ↓
阶段16：发布后回归检查
  ↓
阶段17：复盘归档
```

**铁规：** 每个阶段完成后必须记录产出，不可跳过阶段。

---

## 三、需求确认模板

每次改版前必须回答以下 14 个问题：

| # | 问题 | 答案（示例） |
|---|------|-------------|
| 1 | 本次改版目标是什么？ | 增加定价页和询价表单 |
| 2 | 涉及哪些页面？ | pricing, calculator, contact, index |
| 3 | 是否涉及价格？ | 是 → 价格放 `pricing.ts` |
| 4 | 是否涉及联系方式？ | 是 → 联系方式放 `contact.ts` |
| 5 | 是否涉及真实用户提交？ | 是 → 表单保持 prototype |
| 6 | 是否涉及多语言？ | 是 → 三语同步 |
| 7 | 是否涉及 SEO？ | 是 → 检查 sitemap/hreflang |
| 8 | 是否涉及合规风险？ | 是 → 审查文案措辞 |
| 9 | 是否需要发布到正式站？ | 是 → 走 VPS Web Terminal |
| 10 | 是否需要保留回滚方案？ | 是 → 备份当前 dist |
| 11 | 是否涉及 VPS 环境变量？ | 是 → 需配置 `.env.production` |
| 12 | 是否涉及真实联系方式？ | 是 → 只放在 VPS，不进 GitHub |
| 13 | 是否需要 Web Terminal 操作？ | 是 → SSH 被封锁 |
| 14 | 是否 SSH 可用？ | 否 → 使用 Web Terminal SOP |

---

## 四、技术实施规范

### 4.1 架构分层

| 层级 | 职责 | 文件示例 |
|------|------|---------|
| **配置层** | 业务数据（联系方式、价格） | `src/config/contact.ts`, `src/config/pricing.ts` |
| **i18n 层** | 多语文案翻译 | `src/i18n/`, `src/i18n/pricing/*.ts` |
| **组件层** | 可复用 UI 展示 | `src/components/PriceBadge.astro` |
| **页面层** | 组织组件和数据 | `src/pages/[lang]/pricing.astro` |
| **布局层** | Header/Footer/SEO | `src/layouts/BaseLayout.astro` |

### 4.2 铁规

| 规则 | 说明 |
|------|------|
| **不硬编码联系方式** | WhatsApp/Telegram/Email 一律从 `contact.ts` 读取 |
| **不硬编码价格** | 所有价格从 `pricing.ts` 读取 |
| **不硬编码密钥** | API key、Token、Webhook 一律用环境变量 |
| **不提交 .env.local** | 已在 `.gitignore` |
| **不提交 .env.production** | 已在 `.gitignore` |
| **不提交 dist/** | 已在 `.gitignore`，`git rm -r --cached` 已执行 |
| **不用 git add -A** | 有 `node_modules` 子模块干扰 |
| **精确 git add** | `git add src/components/X.astro src/pages/Y.astro` |
| **构建产物与源码分离** | `dist/` 不进入版本控制 |
| **PR 合并 ≠ 发布** | 合并后需另行 VPS 部署 |

---

## 五、联系方式管理规范

### 5.1 contact.ts 是单一数据源

```
所有组件/页面
  → import { contact } from '@config/contact'
  → 读取 contact.whatsappDisplay / contact.email / contact.telegram 等
```

**禁止：** 在任何组件或页面中直接写入联系方式。

### 5.2 WhatsApp 分开管理

| 字段 | 用途 | 示例 |
|------|------|------|
| `whatsappDisplay` | UI 显示（+XX 格式） | `+XX XXXXX XXXXX` |
| `whatsappNumber` | wa.me 链接（无+无空格） | `XXXXXXXXXXXXX` |

### 5.3 Telegram 分开管理

| 字段 | 用途 | 示例 |
|------|------|------|
| `telegram` | UI 显示（无@） | `<handle>` |
| `telegramUrl` | 跳转链接 | `https://t.me/<handle>` |

### 5.4 Email 管理

| 字段 | 用途 | 示例 |
|------|------|------|
| `email` | UI 显示 + mailto 链接 + FormSubmit 目标 | `<email>` |

### 5.5 真实联系方式管理路径

| 环境 | 配置方式 | 说明 |
|------|---------|------|
| 本地开发 | `.env.local` | 不提交 |
| VPS 生产 | `.env.production` 或系统环境变量 | 不提交 |
| GitHub 源码 | 占位符 | `WHATSAPP_NUMBER` / `CONTACT_EMAIL` / `placeholder_telegram` |

### 5.6 JSON-LD telephone

| 状态 | 行为 |
|------|------|
| 本地占位符构建 | 输出占位符（搜索引擎可能标记无效） |
| VPS 真实构建 | 输出真实号码（搜索引擎正常抓取） |

**建议：** VPS 部署后立即检查 JSON-LD 输出。

### 5.7 提交前扫描

```bash
# 扫描真实号码/邮箱/Telegram
grep -rn "8617\|+86\|email\|telegram\|ghp" src/
# 结果必须为空，否则拒绝提交
```

### 5.8 发布前确认

构建后检查 `dist/` 中不再显示占位符（VPS 真实环境变量构建时）：

```bash
grep -rn "WHATSAPP_NUMBER\|CONTACT_EMAIL\|placeholder_telegram" dist/
# VPS 构建后结果必须为空
```

---

## 六、价格展示规范

### 6.1 各业务线展示策略

| 业务线 | 展示方式 | 说明 |
|--------|---------|------|
| **汽车** | Price on Request | 不显示任何价格，引导询价 |
| **安防标准品** | Reference Price ($XX–$XX) | 参考区间，标注 reference only |
| **安防方案** | Solution Quotation Available | 引导方案询价 |
| **内衣 OEM** | Price Range ($XX–$XX/件) + MOQ: N | 区间 + 起订量 |

### 6.2 铁规

| 规则 | 说明 |
|------|------|
| **所有价格都是 reference only** | 必须在页面标注 |
| **价格数据放 pricing.ts** | 不在页面模板中硬编码 |
| **i18n 不存业务价格** | i18n 只存文案，不存数值 |
| **合并前审核 pricing.ts** | 价格是否仍为占位符或参考值 |
| **未确认价格的处理** | 显示 `USD XX–XX` / `MOQ: N` / `Price on Request` |

---

## 七、多语言规范

### 7.1 语言优先级

| 语言 | 定位 | 优先级 |
|------|------|--------|
| EN | 主版本，默认语言 | 最高 |
| RU | 俄罗斯+中亚市场 | 高 |
| ZH | 中文辅助 | 中 |

### 7.2 铁规

| 规则 | 说明 |
|------|------|
| **新增页面必须同步三语** | `[lang]/xxx.astro` 自动三语，或手动创建 EN/RU/ZH |
| **LanguageSwitcher 保持当前路径** | `/en/pricing` → 切换 RU → `/ru/pricing`（不是首页） |
| **RU/ZH 重点检查长文案换行** | 手机端易溢出 |
| **裸路径跳转默认英文** | `/pricing` → `/en/pricing` |
| **hreflang x-default 无双斜杠** | 不能出现 `//` |
| **BaseLayout 修改后必须重建** | `npm run build` |

---

## 八、表单规范

### 8.1 Prototype 模式

| 项目 | 规则 |
|------|------|
| **默认模式** | `FORM_MODE = 'prototype'` |
| **未确认前** | 不接后端 |
| **不接支付** | 任何支付功能需主人确认 |
| **不入库** | 不存储客户数据 |
| **不要求注册** | 访客可直接填写 |
| **后续方案** | 优先 email，再 email_feishu |

### 8.2 表单设计

| 项目 | 规则 |
|------|------|
| **字段数量** | ≤ 6 个 |
| **手机端优先** | 375px 可用 |
| **成功提示** | 不暗示"已真实发送"，写明"我们将联系您" |

---

## 九、合规文案规范

### 9.1 禁止使用的表达

| 禁止表达 | 原因 |
|---------|------|
| `guaranteed lowest price` | 价格承诺 |
| `ship to any country` | 可能违反出口管制 |
| `no restriction` | 不实声明 |
| `bypass sanctions` | 合规风险 |
| `avoid customs` | 违法暗示 |
| `military` / `weapon` / `combat` / `army` | 安防敏感词 |

### 9.2 推荐使用的表达

| 场景 | 推荐表达 |
|------|---------|
| 安防产品 | `lawful civilian and commercial security use only` |
| 汽车报价 | `price, shipping, customs clearance, taxes, and registration are calculated separately` |
| 出口管制 | `subject to export controls, sanctions, and end-use review` |

---

## 十、Git 工作流规范

### 10.1 标准命令

```bash
# 1. 新建 feature 分支
git checkout -b feature/<功能名>

# 2. 精确 git add（不用 -A）
git add src/components/X.astro src/pages/Y.astro src/config/Z.ts

# 3. 构建验证
npm run build

# 4. 检查 whitespace issues
git diff --cached --check

# 5. 检查变更统计
git diff --cached --stat

# 6. 提交
git commit -m "<type>: <描述>"

# 7. 推送到远程
git push origin feature/<功能名>

# 8. 创建 Draft PR
# （通过 GitHub 界面或 API）

# 9. PR Review（人工）

# 10. Ready for review

# 11. 合并 main

# 12. ⚠️ 合并 ≠ 已发布！VPS 另行部署
```

### 10.2 Commit Message 规范

| 类型 | 示例 |
|------|------|
| `feat` | `feat: add multilingual pricing and quote flow pages` |
| `chore` | `chore: sanitize contact placeholders and pricing config` |
| `fix` | `fix: normalize hreflang x-default URL` |
| `fix` | `fix: remove real contact info from comments` |

### 10.3 PR 合并后

| 操作 | 说明 |
|------|------|
| **不删除 feature 分支** | 保留记录 |
| **关闭 PR** | 自动完成 |
| **更新 TODO.md** | 记录已完成 |
| **不立即发布 VPS** | 等主人确认后再部署 |

---

## 十一、VPS Web Terminal 发布 SOP

> **适用场景：** SSH 被封锁，只能通过云服务商 Web Terminal 操作。

> **详细 SOP 请参见：** `docs/deployment/vps-web-terminal-deploy-guide.md`

### 11.1 发布前确认

- [ ] 确认当前线上版本（备份 dist）
- [ ] 记录当前 commit hash
- [ ] 确认 main 最新 commit
- [ ] 确认真实 WhatsApp / Telegram / Email
- [ ] 确认 `FORM_MODE`
- [ ] 确认 Node / npm 版本
- [ ] 确认磁盘空间
- [ ] 确认 Nginx 静态目录
- [ ] 确认回滚路径

### 11.2 操作步骤（简化版）

```bash
# 1. 进入项目目录
cd /path/to/project

# 2. 备份当前 dist
cp -r dist/ dist.bak_$(date +%Y%m%d_%H%M%S)/

# 3. 拉取 main
git fetch origin main
git reset --hard origin/main

# 4. 创建 .env.production（首次或更新）
cat > .env.production << 'EOF'
PUBLIC_WHATSAPP_NUMBER=<number>
PUBLIC_WHATSAPP_DISPLAY=+<number>
PUBLIC_CONTACT_EMAIL=<email>
PUBLIC_TELEGRAM=<handle>
PUBLIC_TELEGRAM_URL=https://t.me/<handle>
PUBLIC_FORM_MODE=prototype
EOF

# 5. 安装依赖
npm ci --production=false

# 6. 构建
PUBLIC_WHATSAPP_NUMBER=<number> \
PUBLIC_WHATSAPP_DISPLAY=+<number> \
PUBLIC_CONTACT_EMAIL=<email> \
PUBLIC_TELEGRAM=<handle> \
PUBLIC_TELEGRAM_URL=https://t.me/<handle> \
PUBLIC_FORM_MODE=prototype \
npm run build

# 7. 检查构建
grep -rn "WHATSAPP_NUMBER\|CONTACT_EMAIL\|placeholder_telegram" dist/

# 8. 部署
rm -rf /var/www/newage-trading.com/*
cp -r dist/* /var/www/newage-trading.com/

# 9. 重载 Nginx
nginx -t && systemctl reload nginx

# 10. 检查页面
curl -sI http://newage-trading.com/
```

### 11.3 发布后检查

| 页面 | 检查项 |
|------|--------|
| `/en/` | 打开正常 |
| `/en/contact` | WhatsApp/Telegram/Email 可点击 |
| `/en/pricing` | 价格展示正确 |
| `/en/calculator` | 计算器可用 |
| `/pricing` | 跳转到 `/en/pricing` |
| 手机端 | 375px 布局正常 |
| 占位符 | 无 `WHATSAPP_NUMBER` / `CONTACT_EMAIL` 残留 |

---

## 十二、发布前检查清单

```markdown
### 构建验证
- [ ] npm run build 通过
- [ ] npm run check 通过或确认未配置
- [ ] 构建页面无 404/i18n fallback

### 多语言
- [ ] 18 个多语言页面可打开（EN/RU/ZH × 核心页面）
- [ ] LanguageSwitcher 正常
- [ ] 6 个裸路径跳转正常

### 安全
- [ ] contact.ts 无真实未确认号码
- [ ] Telegram 无真实未确认账号
- [ ] Email 无真实未确认邮箱
- [ ] 无 GitHub Token 残留
- [ ] src/ 安全扫描通过（grep）

### 配置
- [ ] pricing.ts 已审核
- [ ] 页面无硬编码 USD
- [ ] FORM_MODE = prototype 或后端已确认
- [ ] .env.local 未提交
- [ ] .env.production 未提交
- [ ] dist/ 未提交

### SEO
- [ ] JSON-LD 有效
- [ ] hreflang 无双斜杠
- [ ] sitemap 已生成
- [ ] 手机端 375px 正常

### Git
- [ ] PR Review 完成
- [ ] main 已合并
- [ ] 回滚方案明确

### VPS
- [ ] VPS 环境变量已准备
- [ ] Web Terminal 发布步骤已确认
- [ ] 人工确认后再部署
```

---

## 十三、发布后回归检查清单

| 序号 | 检查项 | 方法 | 通过标准 |
|------|--------|------|---------|
| 1 | 首页 | 浏览器访问 `/` | 打开正常，Header/Footer 正常 |
| 2 | 联系页 | 访问 `/en/contact` | WhatsApp/Telegram/Email 可点击 |
| 3 | 新增业务页 | 访问 `/en/pricing` 等 | 价格展示正确 |
| 4 | WhatsApp 点击 | 点击按钮 | 跳转 wa.me，消息预填正确 |
| 5 | Telegram 点击 | 点击按钮 | 跳转 t.me 正确 |
| 6 | Email 点击 | 点击链接 | mailto 正确 |
| 7 | 表单提交 | 填写并提交 | prototype 行为正确 |
| 8 | 手机端 | 375px 浏览器 | 布局正常，无溢出 |
| 9 | sitemap | 访问 `/sitemap-index.xml` | 包含所有页面 |
| 10 | 404 检查 | 随机访问旧路径 | 404 页面正确 |
| 11 | 控制台 | 浏览器 DevTools | 无 JS 错误 |
| 12 | 客户询盘路径 | 模拟客户提交 | 表单到达预期目标 |

---

## 十四、常见问题与处理办法

| # | 问题 | 原因 | 处理 |
|---|------|------|------|
| 1 | 构建通过但页面 404 | Nginx 静态目录未更新 | 检查 `cp -r dist/*` 是否执行 |
| 2 | 语言切换跳回首页 | LanguageSwitcher 路径错误 | 检查 `localePath(locale, currentPath)` |
| 3 | WhatsApp 链接无效 | 号码格式错误（有+或空格） | `whatsappNumber` 必须纯数字 |
| 4 | Telegram 链接无效 | URL 格式错误 | 必须是 `https://t.me/<handle>` |
| 5 | Email 仍是占位符 | 环境变量未设置 | 检查 `.env.production` |
| 6 | JSON-LD 报错 | telephone 字段输出占位符 | VPS 用真实值构建 |
| 7 | i18n 显示 key 名 | key 不存在于翻译文件 | 补充 `i18n/pricing/*.ts` |
| 8 | 价格显示错位 | `pricing.ts` 数据错误 | 检查 `priceType` 字段 |
| 9 | 手机端按钮遮挡 | WhatsAppFloatingButton 遮挡 | 调整 `z-index` / 底部间距 |
| 10 | dist 被误提交 | 忘记 `git rm --cached` | `git rm -r --cached dist/` |
| 11 | .env.local 被误提交 | `.gitignore` 未配置 | `git rm --cached .env.local` |
| 12 | 子模块干扰 git status | `node_modules` 存在 | `.gitignore` 已配置 |
| 13 | PR 已合并但 VPS 没更新 | VPS 未拉取 main | Web Terminal `git pull` |
| 14 | Web Terminal 拉取失败 | 网络/认证问题 | 检查 `git remote -v` |
| 15 | 构建后仍显示占位符 | 环境变量未传入构建 | 检查构建命令中是否包含环境变量 |
| 16 | 发布后页面 404 | Nginx 配置未指向正确目录 | 检查 `root` 指令 |
| 17 | Nginx 指向旧 dist | 静态目录路径错误 | 确认 `/var/www/newage-trading.com/` |

---

## 十五、以后每次改版的固定交付物

| # | 交付物 | 存储位置 |
|---|--------|---------|
| 1 | 需求确认记录 | `docs/retrospective/` |
| 2 | 改版方案 | `docs/retrospective/` |
| 3 | 文件变更清单 | PR 描述 |
| 4 | 构建日志 | PR 描述 / 文档 |
| 5 | 页面检查清单 | 本文档第十二节 |
| 6 | 安全扫描结果 | PR 描述 |
| 7 | PR 地址 | PR #N |
| 8 | main 合并记录 | 本文档第七节 |
| 9 | VPS 发布记录 | `docs/deployment/` |
| 10 | 回滚方案 | 本文档第九节 |
| 11 | 发布后检查结果 | `docs/retrospective/` |
| 12 | 复盘文档 | `docs/retrospective/` |

---

*本文档作为独立站运维的标准操作程序，每次改版必须遵循。如有例外情况，需记录原因。*
