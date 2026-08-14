# R1C: Changan Suzuki CNG — Conditional Price Label Only

**Date:** 2026-08-14 19:58 CST
**Scope:** used-cars detail page, CNG model only
**Authority:** OWNER_DECISION_APPLIED | SOURCE_BRANCH_AND_STAGING_ONLY | NO_COMMIT_NO_PUSH_NO_MERGE_NO_DEPLOY

## Change Summary

### Files Modified (2)

| File | Change |
|------|--------|
| `src/data/used-cars.json` | Added `priceNote`, `priceNoteZh`, `priceNoteRu` fields |
| `src/pages/[lang]/used-cars/[id].astro` | Rendered price note below price line |

### Diff

**used-cars.json** — 3 new fields appended after `price`:
```json
"priceNote": "Indicative FOB China port price: US$4,500–5,000. Named port, vehicle configuration and current availability confirmed by quotation. Shipping, import duties, clearance and destination charges are separate.",
"priceNoteZh": "中国港口FOB参考价：4,500–5,000美元。具体港口、车辆配置和现车情况以报价单为准。运费、进口关税、清关及目的港费用另计。",
"priceNoteRu": "Ориентировочная цена FOB порт Китая: 4 500–5 000 USD. Названный порт, комплектация и наличие уточняются в коммерческом предложении. Доставка, импортные пошлины, очистка и назначения сборы оплачиваются отдельно."
```

**[id].astro** — price section wrapped with note:
```diff
- <div class="text-3xl font-bold text-yellow-300 mb-6">{currentPrice} <span class="text-lg text-gray-300 font-normal">FOB</span></div>
+ <div class="mb-6">
+   <div class="text-3xl font-bold text-yellow-300">{currentPrice} <span class="text-lg text-gray-300 font-normal">FOB</span></div>
+   <p class="text-sm text-gray-300 mt-2 leading-relaxed">
+     {lang === 'zh' ? vehicle.priceNoteZh : lang === 'ru' ? vehicle.priceNoteRu : vehicle.priceNote}
+   </p>
+ </div>
```

## Validation Results

| Check | Result |
|-------|--------|
| `npx astro build` | ✅ PASS — 427 pages built |
| `git diff --check` | ✅ PASS — no whitespace issues |
| EN DOM: "Indicative FOB" present | ✅ PASS |
| ZH DOM: "报价单为准" present | ✅ PASS |
| RU DOM: "коммерческом предложении" present | ✅ PASS |
| Zero `availableForPurchase`/`in-stock`/`ready-to-buy` in DOM | ✅ PASS |
| Price note contains: FOB mention | ✅ PASS (all 3 langs) |
| Price note contains: quote confirmation | ✅ PASS (all 3 langs) |
| Price note contains: fee boundary (shipping/duties/clearance separate) | ✅ PASS (all 3 langs) |
| No changes to other models/pages/schema/GA4/UTM/email/translations | ✅ PASS |

## Rules Compliance

| Rule | Status |
|------|--------|
| Keep `available: false` / `QUOTE_REQUIRED` | ✅ Unchanged (no such fields exist; page has no availability claim) |
| No new inventory/stock/delivery/certification/clearance承诺 | ✅ Only price label text added |
| No changes to other models, pages, Schema, GA4, UTM, email, translations | ✅ Diff scoped to 2 files |
| FOB port not fixed to single port | ✅ Uses "China port" generic + specs retain "Horgos / Ningbo" |

## Staging

Files are in workspace staging. No commit, no push, no merge, no deploy.

**Status: R1C_STAGING_READY_FOR_OWNER_BROWSER_REVIEW**
