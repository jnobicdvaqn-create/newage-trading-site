# Image Manifest - newage-trading.com

**Last Updated:** 2026-05-28
**Rule:** No image may be used on a production page unless it is recorded in this manifest.

---

## Format

| # | Filename | Product Name | Page(s) | Alt (zh) | Alt (en) | Alt (ru) | Content Description | Source/Authorization | Human Confirmed | Publish OK | Notes |
|---|----------|-------------|---------|----------|----------|----------|---------------------|---------------------|-----------------|------------|-------|

---

## Car Images (New Energy Vehicles)

| # | Filename | Product Name | Page(s) | Alt (zh) | Alt (en) | Alt (ru) | Content Description | Source/Authorization | Human Confirmed | Publish OK | Notes |
|---|----------|-------------|---------|----------|----------|----------|---------------------|---------------------|-----------------|------------|-------|
| 1 | byd-seal.jpg | BYD Seal | /cars/, /zh/cars/, /ru/cars/, index | 比亚迪海豹 | BYD Seal electric car | BYD Seal электромобиль | | Manufacturer / Alibaba | ❌ | ❌ | Pending verification |
| 2 | mg4-ev.jpg | MG4 EV | /cars/, index | MG4 EV电动车 | MG4 EV electric car | MG4 EV электромобиль | | Manufacturer / Alibaba | ❌ | ❌ | Pending verification |
| 3 | used-byd-e6.jpg | BYD e6 | /used-cars/, index | 比亚迪e6二手车 | BYD e6 used car | BYD e6 б/у | **⚠️ KNOWN WRONG** - currently shows white sedan, should be high-roof MPV/crossover | N/A | ❌ | ❌ | **MUST REPLACE** - see issue #C-001 |
| 4 | used-toyota-corolla.jpg | Toyota Corolla (used) | /used-cars/, index | 丰田卡罗拉二手车 | Used Toyota Corolla | Toyota Corolla б/у | White sedan, Toyota Corolla model | Verified by screenshot | ✅ | ✅ | Confirmed correct (方案C, 2026-05-28) |
| 5 | used-nissan-sunny.jpg | Nissan Sunny (used) | /used-cars/, index | 日产阳光二手车 | Used Nissan Sunny | Nissan Sunny б/у | White sedan, Nissan Sunny model | Verified by screenshot | ✅ | ✅ | Confirmed correct (方案C, 2026-05-28) |
| 6 | used-honda-fit.jpg | Honda Fit (used) | /used-cars/, index | 本田飞度二手车 | Used Honda Fit | Honda Fit б/у | White hatchback, Honda Fit model | Verified by screenshot | ✅ | ✅ | Confirmed correct (方案C, 2026-05-28) |
| 7 | used-greatwall-pickup.jpg | Great Wall Pickup (used) | /used-cars/, index | 长城皮卡二手车 | Used Great Wall pickup | Great Wall пикап б/у | Pickup truck, Great Wall model | Verified by screenshot | ✅ | ✅ | Confirmed correct (方案C, 2026-05-28) |
| 8 | used-jmc-pickup.jpg | JMC Pickup (used) | /used-cars/, index | 江铃皮卡二手车 | Used JMC pickup | JMC пикап б/у | Pickup truck, JMC model | Verified by screenshot | ✅ | ✅ | Confirmed correct (方案C, 2026-05-28) |

---

## Lingerie Images

| # | Filename | Product Name | Page(s) | Alt (zh) | Alt (en) | Alt (ru) | Content Description | Source/Authorization | Human Confirmed | Publish OK | Notes |
|---|----------|-------------|---------|----------|----------|----------|---------------------|---------------------|-----------------|------------|-------|
| 1 | silk_new.jpg | Silk Lingerie OEM | /lingerie/, index | 丝绸内衣OEM | Silk lingerie OEM | Шёлковое бельё OEM | B2B-appropriate silk lingerie product shot | | ❌ | ❌ | Pending verification |

---

## Security Equipment Images

| # | Filename | Product Name | Page(s) | Alt (zh) | Alt (en) | Alt (ru) | Content Description | Source/Authorization | Human Confirmed | Publish OK | Notes |
|---|----------|-------------|---------|----------|----------|----------|---------------------|---------------------|-----------------|------------|-------|
| 1 | hikvision-colorvu.jpg | Hikvision ColorVu | /security/, index | 海康威视ColorVu | Hikvision ColorVu camera | Hikvision ColorVu камера | Hikvision ColorVu CCTV camera | Manufacturer | ❌ | ❌ | Pending verification |

---

## Placeholder Images

| # | Filename | Purpose | Pages | Status | Notes |
|---|----------|---------|-------|--------|-------|
| - | placeholder-car.webp | Temporary car image | Any | PLACEHOLDER_ONLY_DO_NOT_PUBLISH | Must not appear in production |
| - | placeholder-security.webp | Temporary security image | Any | PLACEHOLDER_ONLY_DO_NOT_PUBLISH | Must not appear in production |
| - | placeholder-lingerie.webp | Temporary lingerie image | Any | PLACEHOLDER_ONLY_DO_NOT_PUBLISH | Must not appear in production |

---

## Verification Log

| Date | Image | Action | Verified By | Result |
|------|-------|--------|-------------|--------|
| 2026-05-28 | used-toyota-corolla.jpg | 方案C screenshot comparison | AI (Friday三世) | ✅ Correct |
| 2026-05-28 | used-nissan-sunny.jpg | 方案C screenshot comparison | AI (Friday三世) | ✅ Correct |
| 2026-05-28 | used-honda-fit.jpg | 方案C screenshot comparison | AI (Friday三世) | ✅ Correct |
| 2026-05-28 | used-greatwall-pickup.jpg | 方案C screenshot comparison | AI (Friday三世) | ✅ Correct |
| 2026-05-28 | used-jmc-pickup.jpg | 方案C screenshot comparison | AI (Friday三世) | ✅ Correct |
| 2026-05-28 | used-byd-e6.jpg | 方案C screenshot comparison | AI (Friday三世) | ❌ WRONG - needs replacement |

---

## Rules

1. **No image may be published unless "Human Confirmed" = ✅ and "Publish OK" = ✅**
2. **Placeholder images must never appear on production pages**
3. **Filename does NOT guarantee content match — always preview before use**
4. **Same image must be used across all three language versions (zh/en/ru) for the same product**
5. **If unable to verify, output: "需要人工确认：图片 xxx 是否为 xxx 产品"**
