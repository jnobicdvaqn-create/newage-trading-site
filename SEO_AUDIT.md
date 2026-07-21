# SEO Audit — NewAge Trading Site

**Date:** 2026-07-20
**Branch:** `feat/multilingual-product-inquiry-v1`
**Domain:** `https://newage-trading.com`

## 1. Multi-language Indexability

| Locale | Status | Notes |
|--------|--------|-------|
| `/en/` | ✅ Indexable | Default locale, sitemap includes |
| `/ru/` | ✅ Indexable | sitemap includes |
| `/zh/` | ✅ Indexable | sitemap includes |
| `/` (root) | ⚠️ Redirects | Should redirect to `/en/` or show locale picker |

**Issues Found:**
- Root `/` may serve content without proper locale — verify redirect behavior
- No `x-default` hreflang fallback configured

## 2. Title / Description / H1 Audit

| Page | Title | Description | H1 |
|------|-------|-------------|----|
| Home | ✅ Dynamic per locale | ✅ Dynamic per locale | ✅ Hero title |
| Cars | ✅ `t('cars.title')` | ✅ `t('cars.subtitle')` | ✅ |
| Used Cars | ✅ Dynamic | ✅ Dynamic | ✅ |
| Lingerie | ✅ `t('lingerie.title')` | ✅ `t('lingerie.subtitle')` | ✅ |
| Security | ✅ `t('security.title')` | ✅ `t('security.subtitle')` | ✅ |
| About | ✅ Dynamic | ✅ Dynamic | ✅ |
| Blog | ✅ Dynamic | ✅ Dynamic | ✅ |
| Contact | ✅ Dynamic | ✅ Dynamic | ✅ |
| **NEW** Vehicles | ✅ | ✅ | ✅ |
| **NEW** Textiles | ✅ | ✅ | ✅ |
| **NEW** Supply Chain | ✅ | ✅ | ✅ |
| **NEW** Insights | ✅ | ✅ | ✅ |

## 3. Canonical & Hreflang

| Check | Status |
|-------|--------|
| Self-referencing canonical | ✅ BaseLayout sets canonical |
| hreflang alternate links | ✅ `alternates()` in BaseLayout |
| x-default | ⚠️ Set to first alternate, should be `/en/` |
| Cross-locale canonical | ✅ Points to same path in canonical locale |

**Recommendation:** Add explicit x-default pointing to `/en/`

## 4. Sitemap / robots.txt

| Check | Status |
|-------|--------|
| @astrojs/sitemap configured | ✅ In astro.config.mjs |
| i18n locales defined | ✅ en, ru, zh |
| robots.txt exists | ⚠️ Verify at `/robots.txt` |
| Sitemap index generated | ✅ `/sitemap-index.xml` |

## 5. Status Codes / 404 / Redirects

| URL | Expected Status | Notes |
|-----|----------------|-------|
| `/en/`, `/ru/`, `/zh/` | 200 | ✅ |
| `/en/cars/` | 200 | ✅ |
| `/en/used-cars/` | 200 | ✅ |
| `/en/lingerie/` | 200 | ✅ |
| `/en/security/` | 200 | ✅ |
| `/en/vehicles/` | 200 | ✅ NEW |
| `/en/textiles/` | 200 | ✅ NEW |
| `/en/supply-chain/` | 200 | ✅ NEW |
| `/en/insights/` | 200 | ✅ NEW |
| Old root pages (`/pricing.astro`) | ⚠️ Check | May need 301 redirects |
| `/security-solutions.astro` | ⚠️ Check | May need 301 redirects |

## 6. Structured Data

| Type | Status | Location |
|------|--------|----------|
| Organization | ✅ | BaseLayout (static) |
| BreadcrumbList | ✅ | BaseLayout (conditional) |
| AggregateOffer | ✅ | Homepage schema |
| Product | ⚠️ Missing | ProductCardV2 should add Product schema |
| FAQPage | ⚠️ Missing | FAQ pages could add FAQPage schema |

## 7. Core Web Vitals Risks

| Metric | Risk | Notes |
|--------|------|-------|
| LCP | ⚠️ Medium | Hero images need `loading="eager"`, preconnect to fonts |
| CLS | ✅ Low | Fixed aspect ratios on images |
| INP | ⚠️ Medium | Mobile menu JS runs on DOMContentLoaded |
| Font Loading | ⚠️ Medium | Google Fonts without `font-display: swap` |

**Recommendations:**
- Add `loading="eager"` to hero images
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
- Consider self-hosting Inter font
- Add `font-display: swap` to font link

## 8. Keyword → Page Mapping

See `KEYWORD_PAGE_MAP.csv` for full mapping.

**Primary Keywords:**
| Keyword | Target Page | Locale |
|---------|------------|--------|
| Chinese car export | /en/vehicles/, /en/cars/ | EN |
| BYD export | /en/cars/ | EN |
| Used cars Africa | /en/used-cars/ | EN |
| Lingerie OEM China | /en/textiles/, /en/lingerie/ | EN |
| Security equipment China | /en/security/ | EN |
| China sourcing agent | /en/supply-chain/ | EN |
| Экспорт авто из Китая | /ru/vehicles/, /ru/cars/ | RU |
| Китайское нижнее белье OEM | /ru/textiles/ | RU |
| 中国汽车出口 | /zh/vehicles/, /zh/cars/ | ZH |
| 内衣OEM代工 | /zh/textiles/ | ZH |

## Summary

### Critical Issues (must fix before merge)
1. ✅ New pages (vehicles/textiles/supply-chain/insights) created with proper meta tags
2. ✅ hreflang configured in BaseLayout
3. ✅ Canonical URLs set per page
4. ⚠️ Verify root `/` redirect behavior

### Recommended Improvements
1. Add Product structured data to product detail pages
2. Add FAQPage schema to FAQ pages
3. Optimize font loading (self-host or add font-display: swap)
4. Add `loading="eager"` to hero images
5. Create explicit robots.txt
6. Add x-default hreflang

### Not Scored (out of scope for this task)
- Backlink profile analysis
- Competitor keyword gap analysis
- Page speed actual measurements (requires deployment)
