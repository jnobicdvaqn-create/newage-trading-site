# R1A_CONTACT_AND_AVAILABILITY_EVIDENCE

**Date:** 2026-08-14 18:52 CST
**Mode:** READ_ONLY
**Branch:** `r1-conversion-foundation-20260814`

---

## 一、Contact.astro 合规复核

### 1.1 汽车询盘表单 — email 字段

| 检查项 | 证据 | 结论 |
|--------|------|------|
| email输入字段是否存在 | `contact.astro` L172: `<input type="email" name="email" required>` | ✅ 存在，且为required |
| 字段归属 | 在 `<!-- Common Fields -->` 区块（vehicle/lingerie共用） | ✅ 汽车询盘和内衣OEM询盘均包含email |

### 1.2 内衣OEM表单 — email 字段

| 检查项 | 证据 | 结论 |
|--------|------|------|
| email输入字段是否共用 | L172 在Common Fields区块，lingerieFields切换时仍可见 | ✅ 内衣OEM表单同样包含email |

### 1.3 页面公开联系邮箱 — 被删除

| 检查项 | 证据 | 结论 |
|--------|------|------|
| contactMethods数组 | 仅WhatsApp + Telegram两项（原email项已被删除） | 🔴 **已删除** |
| 删除位置 | diff: `- { label: t('contact.email', lang), value: contact.email, href: 'mailto:...' }` | 在contactMethods数组定义处删除 |
| 删除原因 | **未知** — 无commit message或注释说明 | ⚠️ 需Owner确认 |

### 1.4 表单字段完整性

| 字段 | 汽车询盘 | 内衣OEM | 证据位置 |
|------|---------|---------|---------|
| 目的国/港口 | ✅ destination_country + destination_port | — | L144-152 |
| 需求类型 | ✅ service_type (procurement_and_export / export_only) | — | L154-159 |
| 车型/产品 | ✅ vehicle_model | ✅ product_type | L161-171 |
| 预算 | ✅ budget | ✅ target_price | L173-183 |
| 数量 | ✅ quantity | ✅ estimated_qty | L169-171 |
| 时间 | ✅ timeline (select) | ✅ lingerie_timeline | L185-192 |
| 来源页 | ✅ _source_page (hidden) | ✅ 同上 | L130 |
| UTM | ❌ 未实现 | ❌ 未实现 | — |
| 业务线 | ✅ _business_line (hidden) | ✅ 同上 | L129 |

**UTM追踪状态:** MEASUREMENT_MANIFEST.md定义了事件参数，但**页面代码中未实现任何gtag调用**（grep确认0处）。

### 1.5 外部副作用检查

| 检查项 | 证据 | 结论 |
|--------|------|------|
| 真实发送测试 | 无 — 代码仅修改本地文件 | ✅ 无外部副作用 |
| 真实邮箱测试 | 无 — form action=/api/contact (mock) | ✅ 无外部副作用 |

---

## 二、SCOPE_CONFLICT 判定

### 判定: **SCOPE_CONFLICT_REQUIRES_OWNER_DECISION**

**根因:**
1. contactMethods数组中的email联系项被删除（页面不再显示公共邮箱）
2. 但表单内部的email输入字段保留（用户仍可输入邮箱）
3. 删除原因无记录，无法判断是R1有意为之还是意外

**影响:**
- 用户无法直接看到业务邮箱，只能通过WhatsApp/Telegram联系
- 表单提交仍包含用户邮箱（用于回复）
- 如果主人不希望页面显示邮箱 → 删除正确
- 如果主人希望页面显示邮箱 → 需恢复

**结论:** 此问题必须由Owner确认，代理不得自行恢复或删除。

---

## 三、二手车 "available" 真实性复核

| 车型 | available | 车源证据路径/来源 | 证据日期 | 目的国适配 | 价格口径 | 是否可公开 |
|------|-----------|-------------------|---------|-----------|---------|-----------|
| Changan Suzuki CNG | true | 无独立证据文件；来自PR #68 (commit f9a27d78) | PR日期未知 | 未标注目的国 | $4,500-5,000 (区间价) | ⚠️ **UNVERIFIED** |
| Toyota Corolla | false | — | — | — | $5,500-8,500 | ✅ 不可点击 |
| Nissan Sunny | false | — | — | — | $4,800-7,500 | ✅ 不可点击 |
| Honda Fit/Jazz | false | — | — | — | $5,000-7,800 | ✅ 不可点击 |
| Great Wall Pickup | false | — | — | — | $7,000-12,000 | ✅ 不可点击 |
| JMC Pickup | false | — | — | — | $6,500-11,000 | ✅ 不可点击 |
| BYD E6 / Aion S | false | — | — | — | $8,000-15,000 | ✅ 不可点击 |

### Changan Suzuki CNG 专项核查

| 检查项 | 证据 | 结论 |
|--------|------|------|
| 车源证据 | 无 — 无供应商报价、无库存截图、无采购合同 | ❌ 无证据 |
| 价格来源 | 无 — 区间价$4,500-5,000无出处标注 | ❌ 无证据 |
| 图片 | `/images/cars/used/changan-suzuki-cng.jpg` — 静态资源，非当期车况照 | ⚠️ 通用图片 |
| 目的国适配 | 未标注 — CNG双动力车型是否适配非洲市场无说明 | ❌ 未验证 |
| 描述 | "营运车退役已翻新" — 无来源 | ⚠️ 无证据 |

### 判定: **UNVERIFIED_AVAILABILITY_CANNOT_BE_PUBLISHED_AS_AVAILABLE**

**理由:**
- Changan Suzuki CNG是唯一`available: true`的车型
- 无当期、可复核的车源证据（供应商报价/库存/车况报告）
- 价格区间无出处
- 目的国适配性未验证（CNG双动力在非洲市场的适用性存疑）
- 图片为通用车型照，非当期真实车况

**建议:** 在获得真实车源证据前，应将`available: false`。

---

## 四、表单UTM追踪缺失

| 检查项 | 状态 |
|--------|------|
| _utm_source hidden field | ❌ 不存在 |
| _utm_medium hidden field | ❌ 不存在 |
| _utm_campaign hidden field | ❌ 不存在 |
| JS自动捕获URL参数 | ❌ 未实现 |
| MEASUREMENT_MANIFEST.md引用 | 有定义，但未实施 |

**结论:** UTM追踪在代码层面完全缺失，仅存在于设计文档中。

---

*R1A_CONTACT_AND_AVAILABILITY_EVIDENCE 完成*
*Mode: READ_ONLY — no code modified*
