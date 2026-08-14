# R1C_BB: CNG List Price Condition Fix — Report

**Date:** 2026-08-14 21:42 CST
**Mode:** SOURCE_BRANCH_AND_STAGING_ONLY | NO_COMMIT_NO_PUSH_NO_MERGE_NO_DEPLOY

---

## Change Summary

**File:** `src/pages/[lang]/used-cars/index.astro`

### 1. Inline data: CNG 新增 priceNote 三字段

```js
priceNote: 'Indicative FOB China port price · availability and configuration confirmed by quotation · destination charges separate',
priceNoteZh: '中国港口FOB参考价 · 车辆配置及可供状态以报价单为准 · 运费、税费、清关及目的地费用另计',
priceNoteRu: 'Ориентировочная цена FOB порт Китая · комплектация и наличие подтверждаются предложением · доставка, пошлины, таможня и расходы назначения отдельно',
```

### 2. 列表页卡片：价格下方紧邻条件说明

```astro
{model.priceNote && model.priceNoteZh && model.priceNoteRu && (
  <p class="text-xs text-gray-400 mb-3 leading-relaxed">
    {lang === 'zh' ? model.priceNoteZh : lang === 'ru' ? model.priceNoteRu : model.priceNote}
  </p>
)}
```

- 三字段守卫：仅 CNG 满足条件
- `text-xs text-gray-400` 紧凑样式，紧邻价格行下方
- 非 CNG 车型不渲染此 `<p>`

---

## DOM 验证结果

### CNG 列表页卡片（三语）

| 语言 | 价格 | 三项条件说明 |
|------|------|------------|
| **EN** | `$4,500-5,000` | `Indicative FOB China port price · availability and configuration confirmed by quotation · destination charges separate` |
| **ZH** | `$4,500-5,000` | `中国港口FOB参考价 · 车辆配置及可供状态以报价单为准 · 运费、税费、清关及目的地费用另计` |
| **RU** | `$4,500-5,000` | `Ориентировочная цена FOB порт Китая · комплектация и наличие подтверждаются предложением · доставка, пошлины, таможня и расходы назначения отдельно` |

### 非 CNG 列表页卡片

| 检查项 | 结果 |
|--------|------|
| 价格显示 | ✅ 零裸价格（全部 `Request Current Quote`） |
| FOB 语义 | ✅ 零出现 |
| 空 `<p>` 元素 | ✅ 零空说明（`text-xs text-gray-400` 仅1次 = CNG 独有） |

### 全局计数

| 指标 | EN | ZH | RU |
|------|----|----|----|
| `text-xs text-gray-400` 出现次数 | 1 | 1 | 1 |
| `Indicative FOB` / `中国港口FOB` / `Ориентировочная цена FOB` 出现次数 | 1 | 1 | 1 |

### 其他验证

| 检查项 | 结果 |
|--------|------|
| Build | ✅ 427 pages PASS |
| `git diff --check` | ✅ PASS |
| i18n raw key scan | ✅ 0 |

---

**STATUS: R1C_BB_STAGING_READY_FOR_OWNER_BROWSER_REVIEW**
