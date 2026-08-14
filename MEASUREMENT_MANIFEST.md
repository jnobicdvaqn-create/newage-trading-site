# MEASUREMENT_MANIFEST — R1 Conversion Foundation

**Date:** 2026-08-14
**Status:** DESIGN ONLY — NOT YET IMPLEMENTED
**GA4 Property:** G-CFZWMWJRKX (already installed in BaseLayout.astro)

---

## 1. Event Definitions

| Event Name | Trigger | Parameters | Status |
|------------|---------|------------|--------|
| `view_market_landing_page` | User loads `/vehicle-export/georgia-new-cars/` or `/vehicle-export/ghana-used-cars/` | `market` (georgia/ghana), `content_type` (new/used) | ✅ Defined, pending implementation |
| `view_quote_basis` | User loads `/how-it-works/` page | `section` (which step viewed) | ✅ Defined, pending implementation |
| `start_vehicle_inquiry` | User selects a business line on contact page | `business_line` (vehicle/lingerie) | ✅ Defined, pending implementation |
| `submit_inquiry` | Contact form submits successfully | `business_line`, `destination_country`, `quantity`, `has_company` | ✅ Defined, pending implementation |
| `whatsapp_click` | User clicks WhatsApp link/button | `source_page` | ⚠️ Low-signal — not a qualified conversion |
| `telegram_click` | User clicks Telegram link/button | `source_page` | ⚠️ Low-signal — not a qualified conversion |
| `qualified_lead` | **MANUAL** — owner confirms lead quality in CRM | `lead_id`, `business_line`, `quality_score` | 🔒 Manual only — not automated |
| `quote_sent` | **MANUAL** — owner sends PI/quotation | `lead_id`, `business_line`, `quote_value_range` | 🔒 Manual only — not automated |
| `deposit_received` | **MANUAL** — owner confirms deposit received | `lead_id`, `business_line`, `amount` | 🔒 Manual only — not automated |

---

## 2. Implementation Plan (NOT YET DEPLOYED)

### 2.1 Page View Events
Add to respective page components:
```javascript
// On /vehicle-export/georgia-new-cars/
gtag('event', 'view_market_landing_page', {
  market: 'georgia',
  content_type: 'new',
  page_path: window.location.pathname
});
```

### 2.2 Form Events
Add to contact.astro form:
```javascript
// On business line selection
gtag('event', 'start_vehicle_inquiry', {
  business_line: selectedBiz
});

// On successful submission
gtag('event', 'submit_inquiry', {
  business_line: data._business_line,
  destination_country: data.destination_country || 'unspecified',
  quantity: data.quantity || 'unspecified',
  has_company: !!data.company
});
```

### 2.3 Click Tracking
Add to WhatsApp/Telegram links:
```javascript
gtag('event', 'whatsapp_click', {
  source_page: window.location.pathname
});
```

---

## 3. Manual-Only Events (NOT Automated)

These events MUST NOT be auto-tracked:

| Event | Reason |
|-------|--------|
| `qualified_lead` | Requires human judgment — only owner can confirm lead quality |
| `quote_sent` | Requires owner confirmation that PI was sent |
| `deposit_received` | Financial event — owner confirmation only |

**Future integration path:** These could be triggered from a CRM system (e.g., HubSpot, Notion database) via server-side events or manual entry in GA4.

---

## 4. NOT YET Configured

- [ ] Google Ads conversion tracking (requires owner approval)
- [ ] Meta Ads pixel (requires owner approval)
- [ ] Enhanced conversions (requires owner approval + customer data)
- [ ] Remarketing audiences (requires owner approval)
- [ ] Cross-domain tracking (single domain currently)

---

## 5. Ad Testing Plan (DESIGN ONLY — NOT EXECUTED)

### Test Group A: Georgia New Cars
- **Keywords:** "buy car from China to Georgia", "China car export Georgia", "BYD Georgia import"
- **Landing:** `/en/vehicle-export/georgia-new-cars/`
- **Budget:** Small test budget ($50-100/day)
- **Negative keywords:** "used", "second hand", "Ghana", "Africa" (non-Georgia)

### Test Group B: Ghana Used Cars
- **Keywords:** "used car from China to Ghana", "China car export Ghana", "Toyota Ghana import China"
- **Landing:** `/en/vehicle-export/ghana-used-cars/`
- **Budget:** Small test budget ($50-100/day)
- **Negative keywords:** "new", "Georgia", "Europe"

### NOT Recommended (Yet)
- PMax campaigns (too broad for B2B)
- Display ads (low intent)
- Remarketing (insufficient traffic)
- Cross-business-line mixed audiences

---

## 6. Data Quality Notes

- `submit_inquiry` is the **initial conversion** — not a qualified lead
- `qualified_lead`, `quote_sent`, `deposit_received` require manual confirmation
- WhatsApp/Telegram clicks are **engagement signals**, not conversions
- Newsletter subscriptions are **not** tracked as conversions (no confirmed backend)

---

**Owner Decision Required:**
1. Approve GA4 event implementation code?
2. Approve small-budget Google Search ad test?
3. Confirm GA4 property G-CFZWMWJRKX is correct?
