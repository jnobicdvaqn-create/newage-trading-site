# R1C_A: `[id].astro` Template Impact Audit

**Date:** 2026-08-14 20:12 CST
**Mode:** READ_ONLY — no code change, no commit, no push, no merge, no deploy

---

## 1. used-cars.json: 新增字段精确证据

| 车型 ID | 字段名 | 值（前80字符） |
|---------|--------|---------------|
| `changan-suzuki-cng` | `priceNote` | `Indicative FOB China port price: US$4,500–5,000. Named port, vehicle...` |
| `changan-suzuki-cng` | `priceNoteZh` | `中国港口FOB参考价：4,500–5,000美元。具体港口、车辆配置和现车情况以报价单为准...` |
| `changan-suzuki-cng` | `priceNoteRu` | `Ориентировочная цена FOB порт Китая: 4 500–5 000 USD. Названный порт...` |

**used-cars.json 模型总数：1**（仅 `changan-suzuki-cng`）

**结论：** 3个 `priceNote*` 字段仅存在于 `changan-suzuki-cng` 模型。

---

## 2. `[id].astro` 新增条件渲染精确逻辑

```astro
<div class="mb-6">
  <div class="text-3xl font-bold text-yellow-300">{currentPrice} <span class="text-lg text-gray-300 font-normal">FOB</span></div>
  <p class="text-sm text-gray-300 mt-2 leading-relaxed">
    {lang === 'zh' ? vehicle.priceNoteZh : lang === 'ru' ? vehicle.priceNoteRu : vehicle.priceNote}
  </p>
</div>
```

**渲染逻辑：**
- 对每个进入 `[id].astro` 的车型，无条件渲染 `<p>` 标签
- 根据 `lang` 选择 `priceNoteZh` / `priceNoteRu` / `priceNote`
- 若车型无对应字段 → `vehicle.priceNote*` 为 `undefined` → Astro 渲染空文本

---

## 3. 价格说明渲染条件验证

| 条件 | 验证结果 |
|------|---------|
| 仅 `changan-suzuki-cng` 有 `priceNote*` 字段 | ✅ 确认：used-cars.json 仅1条记录 |
| 三语页面均有对应字段 | ✅ EN/zh/ru 三字段全部存在 |
| 有字段才渲染文本 | ⚠️ `<p>` 标签无条件渲染；但当前仅1款车型有数据，实际效果等价于条件渲染 |

**结论：** 当前数据下，价格说明仅出现在 CNG 三语详情页。但模板本身未做 `vehicle.priceNote &&` 守卫。

---

## 4. 非 CNG 车型详情页验证

**关键发现：** `used-cars.json` 仅包含 `changan-suzuki-cng` 一个模型。

`used-cars/index.astro` 列表页硬编码了 7 个模型（含 Toyota Corolla、Nissan Sunny 等），但它们的 `available: false`，**未生成详情页 HTML**。

| 检查项 | 结果 |
|--------|------|
| Toyota Corolla 详情页存在 | ❌ 不存在（`available: false`，未注册到 `getStaticPaths`） |
| Nissan Sunny 详情页存在 | ❌ 不存在（同上） |
| 列表页非 CNG 卡片有无 CNG 价格 | ✅ 无 — 各卡片显示各自价格 |
| 列表页非 CNG 卡片有无 CNG FOB 说明 | ✅ 无 — 列表页不渲染 `priceNote` |
| 列表页非 CNG 卡片有无 misleading availability | ✅ 无 — 全部 `available: false`，`cursor-default`，`aria-disabled="true"` |

**结论：** 非 CNG 车型无详情页，列表页价格显示干净。

---

## 5. CNG 列表页 + 详情页验证

### 列表页（3语）

| 检查项 | EN | ZH | RU |
|--------|----|----|----|
| 无裸价格暗示现货 | ✅ 仅显示 `$4,500-5,000`，无 FOB 后缀 | ✅ 同 | ✅ 同 |
| 无 in-stock/available/ready-to-buy | ✅ | ✅ | ✅ |
| `available: false` 生效 | ✅ `cursor-default` + `aria-disabled="true"` | ✅ | ✅ |

### 详情页（3语）

| 检查项 | EN | ZH | RU |
|--------|----|----|----|
| 价格旁有 FOB 说明 | ✅ `FOB` 标签 | ✅ `FOB` 标签 | ✅ `FOB` 标签 |
| 价格旁有报价确认 | ✅ `confirmed by quotation` | ✅ `以报价单为准` | ✅ `уточняются в коммерческом предложении` |
| 价格旁有费用边界 | ✅ `Shipping, import duties, clearance and destination charges are separate` | ✅ `运费、进口关税、清关及目的港费用另计` | ✅ `Доставка, импортные пошлины, очистка и назначения сборы оплачиваются отдельно` |
| 无 available/in-stock/ready-to-buy | ✅ | ✅ | ✅ |
| `description` meta 含裸价格 | ⚠️ `{carName} ({year}), {currentPrice} FOB. Fleet-retired & refurbished.` — 含裸价格+FOB | ⚠️ 同 | ⚠️ 同 |

**meta description 发现：** `description` 属性使用 `{currentPrice} FOB` 拼接，未附加条件说明。但 meta description 对用户不可见（仅搜索引擎/OG），且 CNG 是唯一有详情页的车型，实际影响有限。

---

## 6. git diff 范围验证

```
git diff --name-only -- src/ (仅本次R1C改动):
  src/data/used-cars.json        ← 新增3个 priceNote 字段
  src/pages/[lang]/used-cars/[id].astro  ← 价格区渲染 priceNote
```

**⚠️ 重要说明：** `[id].astro` 是 used-cars 的**通用详情页模板**，被所有 used-cars 车型共享。本次修改虽然数据层仅影响 CNG（因为只有 CNG 有 `priceNote*` 字段），但模板层面是全局变更。

**不得称"仅改 used-cars 页面"。** 正确描述应为：
> "修改 used-cars 数据文件（仅 CNG 模型）+ used-cars 通用详情页模板（全局，但当前仅 CNG 模型有数据生效）"

**`git diff --check`:** ✅ PASS（无 whitespace 问题）

---

## 审计结论

| 维度 | 状态 |
|------|------|
| 数据层影响范围 | ✅ 严格限定 CNG（used-cars.json 仅1条记录） |
| 模板层影响范围 | ⚠️ 全局（`[id].astro` 是通用模板，但当前仅 CNG 有数据） |
| 列表页裸价格 | ✅ 无 — 列表页不渲染 priceNote |
| 列表页 availability 语义 | ✅ 全部 `available: false` |
| 非 CNG 详情页 | ✅ 不存在（未生成） |
| CNG 详情页三项说明 | ✅ FOB + 报价确认 + 费用边界 三语齐全 |
| CNG 详情页无 misleading 语义 | ✅ 无 in-stock/available/ready-to-buy |
| meta description 裸价格 | ⚠️ 有（但用户不可见，影响有限） |
| `git diff --check` | ✅ PASS |

---

**STATUS: R1C_A_EVIDENCE_COMPLETE_AWAITING_OWNER_DECISION**

影响严格限定为 CNG 数据层；模板层为全局变更但当前仅 CNG 生效。无其他车型或列表页裸价格泄漏。
