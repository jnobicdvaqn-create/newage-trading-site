# R1A_CLAIM_AND_I18N_AUDIT

**Date:** 2026-08-14 18:55 CST → **Corrected 19:00 CST**
**Mode:** READ_ONLY
**Branch:** `r1-conversion-foundation-20260814`

---

## 一、CLAIM_EVIDENCE_REGISTER

### 1.1 首页声明 (index.astro)

| # | 声明位置 | 声明内容 | 证据 | 判定 |
|---|---------|---------|------|------|
| 1 | trustItems L44 | "ISO 9001, CE, FCC certified partners" | ❌ 无供应商认证清单 | **REMOVE** |
| 2 | trustItems L43 | "Direct sourcing from verified Chinese manufacturers" | ⚠️ 无供应商名单 | **HOLD_FOR_OWNER** |
| 3 | trustItems L45 | "End-to-end shipping, customs clearance, and delivery to destination ports" | ⚠️ 无货代合同 | **HOLD_FOR_OWNER** |
| 4 | trustItems L46 | "Dedicated account managers available via WhatsApp, Telegram, and email" | ✅ 有WhatsApp/Telegram联系方式 | **KEEP_WITH_EVIDENCE** |
| 5 | indexSchema L55-62 | makesOffer: Vehicle Export (Georgia/Ghana/Nigeria/Kenya) | ⚠️ 仅格鲁吉亚有实际业务经验 | **REWRITE_WITH_CONDITIONS** |
| 6 | indexSchema L63 | Lingerie OEM/ODM "Worldwide" | ⚠️ 无工厂合作证据 | **HOLD_FOR_OWNER** |
| 7 | indexSchema L64 | priceRange: "$$" | ❌ 无定价依据 | **REMOVE** |
| 8 | 数字区块 L140-151 | "Global Clients" / "Markets Reached" / "Years in Trade" / "Shipments Completed" | ⚠️ 翻译中性化但无具体数字 | **KEEP_WITH_EVIDENCE** (中性标签) |

### 1.2 首页描述变更 (translations.json diff)

| # | Key | 旧文案 | 新文案 | 判定 |
|---|-----|--------|--------|------|
| 9 | home.trustDesc | "Thousands of satisfied clients across 30+ countries" | "Direct sourcing from verified Chinese manufacturers" | ✅ **KEEP** — 删除了不可验证的"30+国家" |
| 10 | home.trustQualityDesc | "[VERIFIED: partner factory list available on request]" | "No middlemen — direct pricing from Chinese manufacturers" | ⚠️ **REWRITE_WITH_CONDITIONS** — 删除了[VERIFIED]标记但保留了"direct pricing" |
| 11 | home.trustLogisticsDesc | "[VERIFIED: 25-35 day delivery to Georgia]" | "End-to-end shipping, customs clearance, and delivery to destination ports" | ⚠️ **REWRITE_WITH_CONDITIONS** — 删除了具体天数但保留了"customs clearance"承诺 |
| 12 | home.trustSupportDesc | "[VERIFIED: response time <2 hours]" | "Dedicated account managers available via WhatsApp, Telegram, and email" | ✅ **KEEP** — 删除了<2小时承诺 |
| 13 | home.usedCarsDesc | "Zero-tariff to 53 African countries since May 2026" | "Quality used vehicles for African markets" | ✅ **KEEP** — 删除了不可验证的"53国零关税" |
| 14 | usedCars.subtitle | "Zero-Tariff Policy Since May 2026 — 53 African Countries" | "Quality Used Vehicles for African Markets" | ✅ **KEEP** — 同上 |
| 15 | usedCars.policyText | "Per-car profit jumps from ¥3,000 to ¥8,000+" | "China-Africa trade framework provides favorable tariff conditions" | ✅ **KEEP** — 删除了利润数据 |
| 16 | usedCars.marketText | "70-80% of African car transactions are used vehicles" | "Used vehicles represent a significant portion of African auto markets" | ✅ **KEEP** — 删除了不可验证的统计数据 |
| 17 | contact.responseTime (EN) | "Typical response time: < 2 hours" | "We aim to respond within one business day" | ✅ **KEEP** — 从<2h改为1个工作日，更保守 |

**⚠️ 注意:** RU/ZH 的 `contact.responseTime` 仍为 "< 2 часов" / "< 2小时"，与EN不一致。

### 1.3 落地页声明 (vehicle-export/*.astro)

| # | 页面 | 声明 | 证据 | 判定 |
|---|------|------|------|------|
| 18 | georgia-new-cars | "Professional vehicle procurement and export from China to Georgia (Poti/Batumi)" | ⚠️ 有格鲁吉亚业务经验 | **KEEP_WITH_EVIDENCE** |
| 19 | georgia-new-cars | "BYD, Geely, Great Wall, Changan, NIO, Xpeng" | ⚠️ 品牌列表无库存证据 | **HOLD_FOR_OWNER** |
| 20 | georgia-new-cars | "25-35 days delivery" | ⚠️ 有历史经验但无当期合同 | **HOLD_FOR_OWNER** |
| 21 | ghana-used-cars | "Quality pre-owned vehicles · Direct China sourcing · Tema/Takoradi delivery" | ⚠️ 无加纳业务经验 | **HOLD_FOR_OWNER** |
| 22 | ghana-used-cars | "Toyota, Nissan, Honda, Hyundai" | ⚠️ 无库存证据 | **HOLD_FOR_OWNER** |
| 23 | ghana-used-cars | "SONCAP compliance support" | ⚠️ SONCAP是尼日利亚认证，加纳不需要 | **REWRITE_WITH_CONDITIONS** |

### 1.4 how-it-works 声明

| # | 声明 | 证据 | 判定 |
|---|------|------|------|
| 24 | "We provide a detailed quotation with clear pricing terms" | ⚠️ 流程描述，非承诺 | **KEEP_WITH_EVIDENCE** |
| 25 | "Validity period: typically 7-14 days" | ⚠️ 无合同支持 | **HOLD_FOR_OWNER** |
| 26 | "We do not publish fixed payment percentages online" | ✅ 保守表述 | **KEEP_WITH_EVIDENCE** |
| 27 | "We can provide guidance based on our experience" | ⚠️ 无经验证据 | **HOLD_FOR_OWNER** |

---

## 二、i18n 质量复核

### 2.1 used-cars 页面 — 三语key完整性 ✅ 已验证

| Key | EN | RU | ZH | 结论 |
|-----|----|----|----|------|
| `usedCars.heroTitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.heroSubtitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.modelsTitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.modelsSubtitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.countriesTitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.countriesSubtitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.ctaTitle` | ✅ | ✅ | ✅ | 三语齐全 |
| `usedCars.ctaText` | ✅ | ✅ | ✅ | 三语齐全 |

**验证方法:** python3脚本直接解析translations.json，遍历EN/RU/ZH三语usedCars对象，8个key全覆盖。

**结论:** 无raw key暴露风险。

### 2.2 硬编码英文 — 新建页面

| 页面 | 硬编码英文 | getStaticPaths | 结论 |
|------|-----------|----------------|------|
| how-it-works.astro | 全文硬编码英文 | 仅 `en` | ⚠️ **仅英文页面** — 有意设计 |
| georgia-new-cars.astro | title/description/H1/全部正文硬编码英文 | `en/ru/zh` | 🔴 **路由多语但内容仅英文** |
| ghana-used-cars.astro | title/description/H1/全部正文硬编码英文 | `en/ru/zh` | 🔴 **路由多语但内容仅英文** |

### 2.3 how-it-works 单语问题

```javascript
// how-it-works.astro L11-15
export function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
  ];
}
```

**结论:** 仅生成 `/en/how-it-works/`，无RU/ZH版本。但页面内Breadcrumb接受`lang`参数，如果从RU/ZH页面导航到此页面，URL会变为 `/ru/how-it-works/` 但实际不存在 → **404风险**。

### 2.4 落地页硬编码内容

| 页面 | 硬编码内容 | 影响 |
|------|-----------|------|
| georgia-new-cars | H1: "New Car Export from China to Georgia" | RU/ZH用户看到英文 |
| georgia-new-cars | 所有步骤/场景描述均为英文 | RU/ZH用户看到英文 |
| ghana-used-cars | H1: "Used Car Export from China to Ghana" | RU/ZH用户看到英文 |
| ghana-used-cars | 所有步骤/场景描述均为英文 | RU/ZH用户看到英文 |

### 2.5 responseTime 三语不一致

| 语言 | 值 | 一致性 |
|------|-----|--------|
| EN | "We aim to respond within one business day" | ✅ 已更新 |
| RU | "Среднее время ответа: < 2 часов" | ❌ 仍为旧值 |
| ZH | "典型响应时间：< 2小时" | ❌ 仍为旧值 |

### 2.6 JSON-LD 可解析性

| 页面 | JSON-LD | 可解析 |
|------|---------|--------|
| index.astro | Organization schema | ✅ 静态可解析 |
| contact.astro | ContactPage schema | ✅ 静态可解析 |
| how-it-works.astro | WebPage schema | ✅ 静态可解析 |
| georgia-new-cars.astro | WebPage schema | ✅ 静态可解析 |
| ghana-used-cars.astro | WebPage schema | ✅ 静态可解析 |
| used-cars/index.astro | 无JSON-LD | ⚠️ 缺失 |

---

## 三、CTA 一致性检查

| CTA位置 | 文本 | 跳转目标 | 一致 |
|---------|------|---------|------|
| 首页 Hero CTA | `t('home.heroCTA', lang)` | `/{lang}/cars/` | ✅ |
| 首页 "Learn More" (Vehicle) | `t('common.learnMore', lang)` | `/{lang}/cars/` | ✅ |
| 首页 "Learn More" (Used Cars) | `t('common.learnMore', lang)` | `/{lang}/used-cars/` | ✅ |
| 首页 "Learn More" (Lingerie) | `t('common.learnMore', lang)` | `/{lang}/lingerie/` | ✅ |
| 首页 "Learn More" (Security) | `t('common.learnMore', lang)` | `/{lang}/security/` | ✅ |
| used-cars Hero CTA | 硬编码中文/俄文/英文 | `/{lang}/contact/` | ✅ |
| how-it-works CTA | "Request a Quote" | `/{lang}/contact/` | ✅ |
| georgia-new-cars CTA | "Request Available Vehicles" | `/{lang}/contact/` | ✅ |
| ghana-used-cars CTA | "Request Available Vehicles" | `/{lang}/contact/` | ✅ |

---

## 四、内部备注/Placeholder 检查

| 检查项 | 证据 | 结论 |
|--------|------|------|
| TODO/FIXME/HACK | grep全文未找到 | ✅ 无 |
| "Coming Soon" 误导性表述 | used-cars页面有"Coming Soon"逻辑（available:false时） | ⚠️ 见R1A_CONTACT_AND_AVAILABILITY_EVIDENCE.md |
| placeholder文本 | 表单有placeholder（如"e.g. Georgia, Ghana"） | ✅ 正常 |
| 内部备注泄露 | 未找到 | ✅ 无 |

---

## 五、R1A_CLAIM_AND_I18N_AUDIT 总结

### 关键发现

| 严重度 | 问题 | 影响范围 |
|--------|------|---------|
| 🔴 P0 | 2个落地页硬编码英文但getStaticPaths有RU/ZH路由 | RU/ZH用户看到英文内容 |
| 🔴 P0 | "ISO 9001, CE, FCC certified partners" 无证据 | 首页信任声明 |
| 🔴 P0 | how-it-works 仅EN但Breadcrumb可能从RU/ZH导航到 | 404风险 |
| 🟡 P1 | contact.responseTime RU/ZH仍为"<2小时"，与EN不一致 | 三语响应时间 |
| 🟡 P1 | Changan Suzuki CNG available:true 无车源证据 | 二手车列表 |
| 🟡 P1 | 页面公开邮箱被删除，原因不明 | contact.astro |
| 🟡 P1 | SONCAP标注在加纳页面（SONCAP是尼日利亚认证） | ghana-used-cars |
| 🟢 P2 | UTM追踪未实现 | contact.astro |
| 🟢 P2 | used-cars页面缺少JSON-LD | used-cars/index.astro |

### 已修正的错误

| 原报告错误 | 修正 |
|-----------|------|
| "used-cars页面6个i18n key在translations.json中不存在" | ❌ 错误 — python3脚本验证所有8个key在三语中均存在 |
| "页面可能显示raw key" | ❌ 错误 — t()函数能正确解析所有key |

### 结束状态

**R1A_BLOCKED_BY_UNVERIFIED_CLAIMS_OR_SCOPE_CONFLICT**

**阻塞原因:**
1. 2个落地页硬编码英文但路由多语 → RU/ZH用户体验差
2. ISO/CE/FCC认证声明无证据 → 合规风险
3. 公开邮箱删除原因不明 → SCOPE_CONFLICT
4. Changan Suzuki CNG无车源证据 → UNVERIFIED_AVAILABILITY
5. SONCAP错标在加纳页面 → 事实错误

**建议:** 以上5项必须由Owner确认后再推进。

---

*R1A_CLAIM_AND_I18N_AUDIT 完成 (Corrected)*
*Mode: READ_ONLY — no code modified*
