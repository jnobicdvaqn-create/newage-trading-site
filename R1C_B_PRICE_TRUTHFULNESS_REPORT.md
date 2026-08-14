# R1C_B: Price Truthfulness Fix — Report

**Date:** 2026-08-14 20:44 CST
**Mode:** SOURCE_BRANCH_AND_STAGING_ONLY | NO_COMMIT_NO_PUSH_NO_MERGE_NO_DEPLOY

---

## Changes Made

### 1. Template Guard (`[id].astro`)

```astro
{vehicle.priceNote && vehicle.priceNoteZh && vehicle.priceNoteRu && (
  <p class="text-sm text-gray-300 mt-2 leading-relaxed">
    {lang === 'zh' ? vehicle.priceNoteZh : lang === 'ru' ? vehicle.priceNoteRu : vehicle.priceNote}
  </p>
)}
```

- `<p>` 仅在三个字段全部存在时渲染
- 未来车型缺少任一字段 → 不生成空 `<p>`

### 2. Meta Description (`[id].astro`)

```astro
description={`${carName} (${currentYear}). ${currentPrice ? 'Indicative FOB price, confirmed by quotation.' : 'Request current quote.'} Fleet-retired & refurbished.`}
```

- CNG: `Indicative FOB price, confirmed by quotation.`
- 非CNG: `Request current quote.`
- 不再裸展示 `{price} FOB`

### 3. 列表页价格条件渲染 (`used-cars/index.astro`)

```astro
{model.price
  ? ' · <span class="text-[var(--color-primary)] font-semibold">' + model.price + '</span>'
  : ' · <span class="text-[var(--color-primary)] font-medium">' +
    (lang === 'zh' ? '获取当前报价' : lang === 'ru' ? 'Запросить актуальную цену' : 'Request Current Quote') +
    '</span>'}
```

- CNG: 显示 `$4,500-5,000`（`font-semibold`）
- 非CNG: 显示三语 "Request Current Quote"（`font-medium`）
- 非CNG 内联数据已移除 `price` 字段

### 4. 非CNG 内联数据清理

```diff
- id: 'toyota-corolla', name: 'Toyota Corolla', year: '2020-2023', price: '$1,500-3,000', fuel: 'Fuel', ...
+ id: 'toyota-corolla', name: 'Toyota Corolla', year: '2020-2023', fuel: 'Fuel', ...
```

6 款非CNG 车型全部移除 `price` 字段。

---

## Validation Results

### Build

| Check | Result |
|-------|--------|
| `npx astro build` | ✅ 427 pages PASS |
| `git diff --check` | ✅ PASS |
| i18n raw key scan | ✅ 0 results |

### CNG 列表页价格显示矩阵

| 语言 | 车型 | 显示内容 | CSS类 |
|------|------|---------|-------|
| EN | CNG | `$4,500-5,000` | `font-semibold` |
| ZH | CNG | `$4,500-5,000` | `font-semibold` |
| RU | CNG | `$4,500-5,000` | `font-semibold` |

### 非CNG 列表页价格显示矩阵

| 车型 | EN | ZH | RU |
|------|----|----|----|
| Toyota Corolla | Request Current Quote | 获取当前报价 | Запросить актуальную цену |
| Nissan Sunny | Request Current Quote | 获取当前报价 | Запросить актуальную цену |
| Honda Fit/Jazz | Request Current Quote | 获取当前报价 | Запросить актуальную цену |
| Great Wall Pickup | Request Current Quote | 获取当前报价 | Запросить актуальную цену |
| JMC Pickup | Request Current Quote | 获取当前报价 | Запросить актуальную цену |
| BYD E6 / Aion S | Request Current Quote | 获取当前报价 | Запросить актуальную цену |

### CNG 详情页三项条件说明

| 语言 | FOB | 报价确认 | 费用边界 |
|------|-----|---------|---------|
| EN | ✅ Indicative FOB | ✅ confirmed by quotation | ✅ charges are separate |
| ZH | ✅ FOB | ✅ 以报价单为准 | ✅ 费用另计 |
| RU | ✅ FOB | ✅ коммерческом предложении | ✅ назначения сборы |

### CNG 详情页 meta description

| 语言 | 内容 |
|------|------|
| EN | `Changan Suzuki CNG (2020-2022). Indicative FOB price, confirmed by quotation. Fleet-retired & refurbished.` |
| ZH | `长安铃木CNG双动力 (2020-2022). Indicative FOB price, confirmed by quotation. Fleet-retired & refurbished.` |
| RU | `Changan Suzuki CNG (2020-2022). Indicative FOB price, confirmed by quotation. Fleet-retired & refurbished.` |

✅ 均含条件语义，无裸价格。

### 非CNG 详情页

| 检查项 | 结果 |
|--------|------|
| 非CNG 详情页是否存在 | ❌ 不存在（`available: false`，未生成HTML） |
| 列表页非CNG 裸价格 | ✅ 零裸价格（全列表页仅1处 `$4,500-5,000`） |

### 模板守卫验证

| 检查项 | 结果 |
|--------|------|
| `priceNote && priceNoteZh && priceNoteRu` 三字段守卫 | ✅ 已添加 |
| 未来无字段车型渲染空 `<p>` | ✅ 不会（条件短路） |

---

## git diff 范围

```
src/data/used-cars.json          ← CNG 新增3个 priceNote 字段
src/pages/[lang]/used-cars/[id].astro  ← 模板守卫 + meta description 修复
src/pages/[lang]/used-cars/index.astro ← 列表页条件价格 + 非CNG price 移除
```

⚠️ `[id].astro` 和 `index.astro` 是通用模板，全局变更但当前仅 CNG 数据生效。

---

**STATUS: R1C_B_STAGING_READY_FOR_OWNER_BROWSER_REVIEW**
