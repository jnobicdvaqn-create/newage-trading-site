# R1B_CORRECTION_REPORT

**Date:** 2026-08-14 19:45 CST
**Mode:** SOURCE_CORRECTION (no commit, no push, no merge, no deploy)
**Branch:** `r1-conversion-foundation-20260814`
**Baseline:** `origin/main` (HEAD=01b3472e)

---

## 一、变更文件白名单

| # | 文件 | 变更类型 | 修正类别 | 说明 |
|---|------|---------|---------|------|
| 1 | `src/pages/[lang]/contact.astro` | 修改 | C | 恢复公开联系邮箱到contactMethods数组 + contactSchema |
| 2 | `src/pages/[lang]/index.astro` | 修改 | B | 删除"ISO 9001, CE, FCC certified partners" + priceRange "$$" |
| 3 | `src/pages/[lang]/used-cars/index.astro` | 修改 | D | Changan Suzuki CNG: `available: true` → `available: false` |
| 4 | `src/pages/[lang]/vehicle-export/georgia-new-cars.astro` | 修改 | A | getStaticPaths: `en/ru/zh` → `en` only |
| 5 | `src/pages/[lang]/vehicle-export/ghana-used-cars.astro` | 修改 | A | getStaticPaths: `en/ru/zh` → `en` only; 删除SONCAP行 |

**未修改文件（确认无需变更）:**
- `src/data/translations.json` — 已修改但不在R1B范围内（R1遗留）
- `src/pages/[lang]/how-it-works.astro` — 已为EN-only，无需修正
- `MEASUREMENT_MANIFEST.md` — 设计文档，不改
- `R1A_*.md` — 只读报告，不改

---

## 二、修正详情

### A. Language Exposure Lock

| 页面 | 修正前 | 修正后 | 验证 |
|------|--------|--------|------|
| georgia-new-cars | getStaticPaths: en/ru/zh | getStaticPaths: en | ✅ 仅dist/en/生成 |
| ghana-used-cars | getStaticPaths: en/ru/zh | getStaticPaths: en | ✅ 仅dist/en/生成 |
| how-it-works | getStaticPaths: en（已正确） | 无需修正 | ✅ 仅dist/en/生成 |

**RU/ZH导航风险:** how-it-works的Breadcrumb接受lang参数，但RU/ZH页面无链接指向它（首页CTA指向`/{lang}/cars/`和`/{lang}/used-cars/`），无404风险。

### B. Remove Unverified Claims

| 声明 | 位置 | 删除内容 | 验证 |
|------|------|---------|------|
| ISO/CE/FCC | index.astro trustItems[3] | 整项删除（4项→3项） | ✅ dist/扫描0处 |
| priceRange "$$" | index.astro indexSchema | 字段删除 | ✅ dist/扫描0处 |
| SONCAP Ghana | ghana-used-cars.astro L78 | 整行删除 | ✅ dist/扫描0处 |

### C. Restore Baseline Contact Email

| 检查项 | 修正前 | 修正后 | 验证 |
|--------|--------|--------|------|
| contactMethods email项 | 已删除 | 已恢复（label/value/href/icon） | ✅ RU/ZH/EN三语均有 |
| contactSchema email字段 | 已删除 | 已恢复 | ✅ JSON-LD包含email |
| 表单email输入字段 | 保留（未动） | 保留 | ✅ `type="email" name="email" required` |

**恢复的邮箱值:** `felipeche01manager@YUNBSAOtrade.onmicrosoft.com` — 与origin/main一致。

**⚠️ OWNER_DECISION:** 邮箱主体为"YUNBSAOtrade"，与品牌名"YunBao International Trading"不完全一致。R1B不修正，仅记录。

### D. Availability Truthfulness

| 车型 | 修正前 | 修正后 | 影响 |
|------|--------|--------|------|
| Changan Suzuki CNG | `available: true` | `available: false` | 不再显示"查看详情"链接，与其他车型一致 |

**价格显示:** 仍保留价格区间（$4,500-5,000），但不暗示可立即购买。如需完全去除价格，需Owner指示。

---

## 三、验证结果

### 1. Build PASS ✅

```
427 page(s) built in 4.98s — Complete
```

页面数从431→427（-4 = 2页面×2语言ru/zh被移除）。

### 2. Raw i18n Key Scan ✅

```bash
grep -rl "usedCars\.heroTitle\|usedCars\.heroSubtitle\|usedCars\.ctaTitle\|usedCars\.ctaText" dist/
# Result: 0 matches
```

### 3. EN Page H1/Title/CTA ✅

- Contact H1: "Contact Us" ✅
- Contact email visible: `felipeche01manager@YUNBSAOtrade.onmicrosoft.com` ✅
- Georgia H1: "New Car Export from China to Georgia" ✅
- Ghana H1: "Used Car Export from China to Ghana" ✅

### 4. RU/ZH No Fake Localization ✅

- `/ru/vehicle-export/` — 不存在 ✅
- `/zh/vehicle-export/` — 不存在 ✅
- `/ru/how-it-works/` — 不存在 ✅
- `/zh/how-it-works/` — 不存在 ✅
- RU contact email: ✅ 存在
- ZH contact email: ✅ 存在

### 5. Contact Email Restored ✅

- EN: `felipeche01manager@YUNBSAOtrade.onmicrosoft.com` ✅
- RU: `felipeche01manager@YUNBSAOtrade.onmicrosoft.com` ✅
- ZH: `felipeche01manager@YUNBSAOtrade.onmicrosoft.com` ✅
- 表单email字段: `type="email" name="email" required` ✅

### 6. Static Scan — Forbidden Claims ✅

| 扫描目标 | 结果 |
|---------|------|
| "ISO 9001.*CE.*FCC" / "certified partners" | 0 matches ✅ |
| SONCAP in ghana-used-cars | 0 matches ✅ |
| `available: true` in used-cars | 0 matches ✅（仅注释中有"set available: true when..."） |

### 7. git diff --check ✅

```
EXIT=0
```

---

## 四、未解决 Owner 决策项

| # | 决策项 | 影响 | 建议 |
|---|--------|------|------|
| 1 | 邮箱主体 "YUNBSAOtrade" 与品牌名不一致 | 联系页显示 | Owner确认是否更换 |
| 2 | contact.responseTime RU/ZH仍为"<2小时"，与EN"1个工作日"不一致 | 三语响应时间 | Owner确认统一口径 |
| 3 | Changan Suzuki CNG价格是否保留 | 二手车列表 | Owner确认 |
| 4 | 落地页RU/ZH翻译（何时提供） | 多语体验 | Owner确认优先级 |
| 5 | used-cars页面缺少JSON-LD | SEO | 可后续补充 |
| 6 | UTM追踪未实现 | 广告归因 | 需Owner批准实施 |

---

## 五、回滚点

```bash
# 回滚所有R1B修正（保留R1遗留改动）
git checkout -- src/pages/[lang]/contact.astro src/pages/[lang]/index.astro src/pages/[lang]/used-cars/index.astro src/pages/[lang]/vehicle-export/georgia-new-cars.astro src/pages/[lang]/vehicle-export/ghana-used-cars.astro
```

**回滚后状态:** 所有R1改动（translations.json/contact/index.astro/新页面/新文档）保留，仅撤销R1B的5项修正。

---

## 六、结束状态

**R1B_STAGING_READY_FOR_OWNER_BROWSER_REVIEW**

所有修正在staging分支完成，build PASS，7项验证全部通过。待Owner浏览器审查后决定下一步。

---

*R1B_CORRECTION_REPORT 完成*
*Mode: SOURCE_CORRECTION — no commit, no push, no merge, no deploy*
