# I18N Quality Audit Report

**Branch:** `feat/multilingual-product-inquiry-v1`
**Date:** 2026-07-20
**Scope:** `src/data/translations.json` — en / ru / zh

---

## 1. Translation Key Completeness

| Language | Total Keys | Status |
|----------|-----------|--------|
| EN | 246 | baseline |
| RU | 256 | +10 extra flat keys |
| ZH | 256 | +10 extra flat keys |

### Missing from EN (10 flat keys present in RU/ZH only)

| Key | RU Value | ZH Value |
|-----|----------|----------|
| `subscribe_newsletter` | Подпишитесь на нашу рассылку | 订阅我们的新闻通讯 |
| `newsletter_description` | Введите ваш email... | 输入您的邮箱... |
| `subscribe_btn` | Подписаться | 订阅 |
| `have_questions` | Есть вопросы? | 有任何问题？ |
| `contact_description` | Свяжитесь с нашей командой... | 联系我们的专业团队... |
| `send_us_message` | Отправьте нам сообщение | 给我们留言 |
| `your_name` | Ваше имя | 您的姓名 |
| `your_email` | Ваш email | 您的邮箱 |
| `your_message` | Ваше сообщение | 您的留言 |
| `send_message_btn` | Отправить сообщение | 发送消息 |

**Recommendation:** Add these 10 keys to EN to maintain parity.

### Structural Issue
RU and ZH have 10 flat top-level keys that don't exist in EN. These should either be:
- Added to EN as flat keys, OR
- Reorganized into proper nested sections (e.g., `contact.*`, `footer.*`)

---

## 2. English Residue

### RU — Actionable Issues

| Key | Issue | Suggested Fix |
|-----|-------|--------------|
| `contact.subtitle` | "sourcing" not translated | "закупках и экспорте" |
| `site.title` | "sourcing" not translated | "глобальным закупкам и экспорту" |
| `contact.formEmail` | "Email" as standalone label | "Электронная почта" |
| `footer.newsletterPlaceholder` | "email" | "электронную почту" |
| `newsletter_description` | "email" | "электронную почту" |
| `your_email` | "email" | "электронную почту" |

### RU — Acceptable English (brand names, technical terms, template vars)
- Brand names: YunBao, BYD, Geely, NIO, Toyota, Nissan, Honda, Hikvision, Dahua
- Technical: CIF, OEM, ODM, MOQ, CCTV, PTZ, NVR, XVR, SSL, TLS, FOB, L/C, SONCAP, PVOC, Incoterms, CISG
- Product names: WhatsApp, Telegram
- Template vars: `{country}`
- Domain: newage-trading.com

### ZH — Actionable Issues
- `privacy.section6Title`: "Cookie 使用" → acceptable (Cookie is standard term in Chinese web context)
- `privacy.section6Content`: "Cookie" occurrences → acceptable

### ZH — Acceptable English
Same as RU (brand names, technical terms, template vars)

---

## 3. Language Mixing (Cross-contamination)

| Key | Language | Issue | Severity |
|-----|----------|-------|----------|
| `home.featuredSubtitle` | RU | Contains Chinese characters "安防" (security) | **HIGH** |

**Current RU value:** "Популярные товары из наших бизнес-направлений — от автомобилей до**安防** оборудования"
**Should be:** "Популярные товары из наших бизнес-направлений — от автомобилей до оборудования безопасности"

---

## 4. "Three/Four Business Lines" Inconsistency

| Section | EN | RU | ZH | Status |
|---------|----|----|----|--------|
| `home.heroSubtitle` | "Three core business lines" ✓ | "Три ключевых направления" ✓ | "三大核心业务线" ✓ | Consistent |
| `home.servicesSubtitle` | "Three core business lines" ✓ | "Три специализированных подразделения" ✓ | "三个专业部门" ✓ | Consistent |
| `about.storyText` | "four key sectors" ✗ | No number mentioned | No number mentioned | **INCONSISTENT** |

**Problem:** EN about.storyText says "four key sectors" but the site only has 3 business lines (Vehicles, Textiles/OEM, Security). Used Cars is a sub-section of Vehicles.

**Fix:** Change EN to "three core business lines" and update RU/ZH to mention the number for consistency.

---

## 5. Summary of Fixes Needed

| # | Type | Severity | Action |
|---|------|----------|--------|
| 1 | Missing keys | MEDIUM | Add 10 flat keys to EN |
| 2 | Language mixing | HIGH | Fix RU `home.featuredSubtitle` (安防 → оборудования безопасности) |
| 3 | Inconsistency | HIGH | Fix EN `about.storyText` (four → three) |
| 4 | Inconsistency | MEDIUM | Update RU/ZH `about.storyText` to mention "three" |
| 5 | English residue | LOW | Fix 6 RU keys with untranslated "sourcing"/"email" |

---

## 6. Fixes Applied

All fixes applied to `src/data/translations.json` — see commit for details.
