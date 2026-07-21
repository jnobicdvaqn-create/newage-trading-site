# Analytics Event Spec

**Date:** 2026-07-20
**Branch:** `feat/multilingual-product-inquiry-v1`

## Overview

This document defines the analytics events to track for the new multilingual product inquiry system. Events should be implementable with any analytics provider (Google Analytics 4, Plausible, Fathom, etc.).

## Event Definitions

### Navigation Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `nav_click` | Click on any navigation link | `page`, `link_text`, `link_path`, `locale` |
| `nav_dropdown_open` | Click on "More" dropdown | `locale` |
| `nav_locale_switch` | Click on language switcher | `from_locale`, `to_locale` |

### Business Line Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `business_line_view` | Visit to vehicles/textiles/supply-chain page | `business_line`, `locale` |
| `business_line_cta_click` | Click "Request Current Quote" on business line section | `business_line`, `locale` |

### Product Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `product_card_view` | Product card enters viewport (impressions) | `product_id`, `product_name`, `category`, `verification_status`, `locale` |
| `product_card_click` | Click on product card | `product_id`, `product_name`, `category`, `locale` |
| `product_detail_view` | Visit product detail page | `product_id`, `product_name`, `category`, `locale` |
| `product_inquiry_click` | Click "Request Current Quote" on product card | `product_id`, `product_name`, `category`, `locale` |

### Filter Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `filter_apply` | Apply any product filter | `filter_type`, `filter_value`, `category`, `results_count`, `locale` |
| `filter_clear` | Clear a filter | `filter_type`, `category`, `locale` |
| `filter_reset` | Click "Reset All" | `category`, `locale` |

### Inquiry Builder Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `inquiry_start` | Load inquiry builder page | `preselected_category`, `locale` |
| `inquiry_step_complete` | Complete any step (1/2/3) | `step_number`, `step_name`, `locale` |
| `inquiry_submit` | Submit inquiry (mock or real) | `business_line`, `sub_options[]`, `has_description`, `has_quantity`, `has_budget`, `locale` |
| `inquiry_abandon` | Leave inquiry builder before submit | `last_step`, `time_on_page_seconds`, `locale` |

### Trust & Social Proof Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `testimonial_view` | Testimonial card enters viewport | `testimonial_id`, `locale` |
| `partner_logo_click` | Click on partner logo | `partner_name`, `locale` |
| `trust_badge_click` | Click on trust badge | `badge_type`, `locale` |

### Contact Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `contact_form_submit` | Submit contact form | `form_type` (inquiry|contact|quote), `has_phone`, `has_company`, `locale` |
| `whatsapp_click` | Click WhatsApp link/button | `context` (floating|footer|header|page), `locale` |
| `telegram_click` | Click Telegram link | `context`, `locale` |
| `email_click` | Click email link | `context`, `locale` |

### Scroll & Engagement Events

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `scroll_depth` | 25%, 50%, 75%, 100% scroll | `depth_percent`, `page`, `locale` |
| `time_on_page` | 30s, 60s, 120s, 300s | `time_seconds`, `page`, `locale` |

## Implementation Notes

### Mock Mode (Local Development)
- All events logged to `console.log()` with `[Analytics]` prefix
- No external API calls in development
- Inquiry submission shows mock success with data preview

### Production Mode
- Use `window.dataLayer` for GA4 or equivalent for chosen provider
- Inquiry submission goes to real backend (Formspree/Netlify Forms/etc.)
- Product impressions use IntersectionObserver for accurate tracking

### Privacy Compliance
- No PII in event properties (email/phone are NOT sent)
- Locale stored as event property, NOT in URL path for analytics
- IP anonymization enabled
- Cookie consent gate before analytics initialization

## Event Naming Convention

```
{category}_{action}
```

- Categories: `nav`, `product`, `filter`, `inquiry`, `trust`, `contact`, `engagement`
- Actions: `click`, `view`, `submit`, `apply`, `start`, `complete`, `abandon`

## Conversion Goals

| Goal | Definition |
|------|-----------|
| Inquiry Submitted | `inquiry_submit` event |
| Contact Form Submitted | `contact_form_submit` event |
| WhatsApp Clicked | `whatsapp_click` event |
| Product Viewed | `product_detail_view` event |
| Multi-step Completed | `inquiry_step_complete` with step=3 |
