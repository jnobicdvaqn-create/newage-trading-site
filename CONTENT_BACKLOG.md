# Content Backlog

**Date:** 2026-07-20
**Priority:** P0 > P1 > P2

## P0 — Must Fix Before Merge

| # | Item | Page | Issue | Action | Status |
|---|------|------|-------|--------|--------|
| 1 | "Four specialized export divisions" | Home EN hero | Claims 4 business lines, should be 3 | Updated to 3 core lines | ✅ Done |
| 2 | "三大业务板块" | Home ZH hero | Says 3, consistent with new structure | Already correct | ✅ Verified |
| 3 | "Три направления экспорта" | Home RU hero | Says 3, needs update to match new structure | Updated | ✅ Done |
| 4 | FeaturedProducts fixed prices | FeaturedProducts.astro | Shows "$28,000" etc., should be "Request Current Quote" | Replaced with CTA | ✅ Done |
| 5 | Trust badges duplicate | Home index.astro | trustQuality appears twice (once with English desc) | Merged to 3 items | ✅ Done |
| 6 | Navigation inconsistency | Header.astro | Old nav had 8 items, now 6 + More dropdown | Updated | ✅ Done |
| 7 | Translation key `nav.home` | translations.json | No longer used in nav, keep for reference | Retained | ✅ Verified |

## P1 — Should Fix This Sprint

| # | Item | Page | Issue | Action | Status |
|---|------|------|-------|--------|--------|
| 8 | ProductCardV2 not yet used on cars/lingerie/security pages | /cars/, /lingerie/, /security/ | Old ProductCard still in use | Migrate when pages updated | ⏳ Pending |
| 9 | InquiryBuilder not yet linked from all product pages | All product pages | No structured inquiry path | Add InquiryBuilder or link to /contact/ | ⏳ Pending |
| 10 | Verification status markers missing on old product cards | FeaturedProducts.astro | No verification status shown | Added to new version | ✅ Done |
| 11 | Content verification tags in trust descriptions | translations.json | Added [VERIFIED: ...] tags, need actual verification | Flagged for human review | ⏳ Pending |
| 12 | Testimonials identity verification | Testimonials.astro | No identity verification on testimonials | Add verification note | ⏳ Pending |
| 13 | Stats numbers verification | Home index.astro | "500+ clients", "30+ countries" — need source | Flagged for human review | ⏳ Pending |

## P2 — Nice to Have

| # | Item | Page | Issue | Action | Status |
|---|------|------|-------|--------|--------|
| 14 | Product schema markup | Product pages | No Product structured data | Add to ProductCardV2 | ⏳ Backlog |
| 15 | FAQPage schema | FAQ pages | No FAQPage structured data | Add to FAQ components | ⏳ Backlog |
| 16 | Self-hosted fonts | BaseLayout.astro | Google Fonts dependency | Download Inter font | ⏳ Backlog |
| 17 | Image optimization | All pages | No WebP/AVIF fallbacks | Add srcset with modern formats | ⏳ Backlog |
| 18 | Dark mode support | All pages | No dark theme | Consider in v2 | ⏳ Backlog |
| 19 | Accessibility audit | All pages | No formal a11y audit | Run axe-core | ⏳ Backlog |
| 20 | Content translation review | RU/ZH | Machine-translated quality check | Human review needed | ⏳ Backlog |

## Content Verification Checklist

### Data Claims (need human verification)
- [ ] "500+ Happy Clients" — source?
- [ ] "30+ Countries Served" — source?
- [ ] "8+ Years of Experience" — founded 2018, so ~8 years ✅
- [ ] "50K+ Products Shipped" — source?
- [ ] "25-35 day delivery to Georgia" — confirmed by logistics partner?
- [ ] "Response time <2 hours" — SLA documented?
- [ ] "Partner factory list available on request" — list exists?

### Certification Claims
- [ ] ISO 9001 — certificate number? expiry?
- [ ] CE — self-declared or third-party?
- [ ] FCC — applicable to which products?

### Testimonial Verification
- [ ] "Alex from Georgia" — real person? company?
- [ ] "Sarah from UK" — real person? company?
- [ ] "Dmitry from Russia" — real person? company?

### Product Data Verification
- [ ] BYD Seal specs match official 2026 specs?
- [ ] Geely Monjaro specs match official?
- [ ] Prices are indicative only (already noted) ✅
- [ ] MOQ figures accurate for each product?
