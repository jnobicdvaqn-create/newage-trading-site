/**
 * Pricing configuration — single source of truth.
 * All price-related pages read from here.
 *
 * ⚠️ RULE: When real supplier prices are confirmed, ONLY edit this file.
 * Do NOT hardcode prices in page HTML or Astro components.
 *
 * ⚠️ CURRENT STATUS: All prices are PLACEHOLDER references only.
 * Real numbers must be confirmed with suppliers before launch.
 */

export type PriceType =
  | 'quote_only'
  | 'reference_range'
  | 'solution_quote'
  | 'range_moq';

export interface PricingLine {
  key: string;
  priceType: PriceType;
  /** Reference price range min (USD) — used for reference_range and range_moq */
  priceMin?: number;
  /** Reference price range max (USD) */
  priceMax?: number;
  /** MOQ — used for range_moq */
  moq?: number;
  /** Unit */
  unit?: 'piece' | 'set' | 'unit' | 'pair';
  /** WhatsApp page slug for context-aware message */
  whatsappSlug: string;
}

/**
 * Pricing lines by business segment.
 * Vehicles: quote_only (no price shown — like BYD, Geely official sites)
 * Security products: reference_range (catalogue items)
 * Security solutions: solution_quote (custom project)
 * Underwear OEM: range_moq (price range + MOQ)
 */
export const pricingLines: PricingLine[] = [
  { key: 'vehicles', priceType: 'quote_only', whatsappSlug: 'vehicles' },
  {
    key: 'security_products',
    priceType: 'reference_range',
    priceMin: 50,
    priceMax: 800,
    unit: 'unit',
    whatsappSlug: 'security',
  },
  {
    key: 'security_solutions',
    priceType: 'solution_quote',
    whatsappSlug: 'security',
  },
  {
    key: 'underwear_oem',
    priceType: 'range_moq',
    priceMin: 2,
    priceMax: 15,
    moq: 300,
    unit: 'piece',
    whatsappSlug: 'oem',
  },
];

/** Price type → display label */
export const priceTypeLabels: Record<PriceType, string> = {
  quote_only: 'Price on Request',
  reference_range: 'Reference Price',
  solution_quote: 'Solution Quote',
  range_moq: 'Price Range',
};

/**
 * Disclaimer texts.
 */
export const disclaimers = {
  /** Universal — required on ALL price pages */
  universal:
    'All prices shown are for reference only and do not constitute a final offer. Final quotation depends on product availability, quantity, destination, shipping method, customs requirements, taxes, service scope and compliance review.',

  /** Vehicle-specific */
  vehicle:
    'Vehicle price, freight, customs clearance, duty, tax and local registration service are calculated separately unless otherwise stated.',

  /** Security-specific */
  security:
    'Products are supplied for lawful civilian and commercial security use only. Supply may be subject to destination, end-user and end-use review.',

  /** OEM-specific */
  oem: 'Displayed pricing is for reference only. Final quotation depends on material, size range, packaging, logo requirements, quantity and shipping method.',

  /** Export compliance notice */
  compliance:
    'We comply with applicable export control, sanctions, customs and end-use requirements. Some destinations, entities, logistics providers or end uses may require additional review or may be restricted.',
} as const;

/**
 * Form submission mode.
 * prototype: no backend, shows success message locally (CURRENT)
 * email: send email notification
 * feishu: send Feishu webhook
 * email_feishu: both
 */
export const FORM_MODE: 'prototype' | 'email' | 'feishu' | 'email_feishu' =
  'prototype';

import { contact } from './contact';

/**
 * Form endpoints (used when FORM_MODE !== 'prototype')
 */
export const FORM_ENDPOINTS = {
  email:
    `https://formsubmit.co/${contact.email}`,
  feishu: '', // TODO: add Feishu webhook URL when ready
} as const;

// ─────────────────────────────────────────────
// Security product reference table
// ─────────────────────────────────────────────

export interface SecurityProduct {
  key: string;
  price: string; // e.g. "USD 50–120/unit"
}

export const securityProducts: SecurityProduct[] = [
  { key: 'rowCam2mp', price: 'USD XX–XX/unit' },
  { key: 'rowCam4mp', price: 'USD XX–XX/unit' },
  { key: 'rowNvr8ch', price: 'USD XX–XX/set' },
  { key: 'rowNvr16ch', price: 'USD XX–XX/set' },
  { key: 'rowAccess', price: 'USD XX–XX/set' },
];

// ─────────────────────────────────────────────
// Underwear OEM product reference table
// ─────────────────────────────────────────────

export interface OemProduct {
  key: string;
  price: string;
  moq: string;
}

export const underwearOemProducts: OemProduct[] = [
  { key: 'rowBraBasic', price: 'USD XX–XX/pc', moq: 'N pcs' },
  { key: 'rowBraMid', price: 'USD XX–XX/pc', moq: 'N pcs' },
  { key: 'rowBraPremium', price: 'USD XX–XX/pc', moq: 'N pcs' },
  { key: 'rowPanty', price: 'USD XX–XX/set', moq: 'N sets' },
  { key: 'rowShapewear', price: 'USD XX–XX/pc', moq: 'N pcs' },
];
