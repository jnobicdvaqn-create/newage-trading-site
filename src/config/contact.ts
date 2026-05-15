/**
 * Contact configuration — single source of truth.
 * All contact methods read from environment variables at build time.
 * Do NOT hardcode real contact info in pages/components.
 *
 * Production env vars (set on VPS before `npm run build`):
 *   PUBLIC_WHATSAPP_NUMBER=<real_number>
 *   PUBLIC_WHATSAPP_DISPLAY=+<real_number>
 *   PUBLIC_CONTACT_EMAIL=<real_email>
 *   PUBLIC_TELEGRAM=<real_handle>
 *   PUBLIC_TELEGRAM_URL=https://t.me/<real_handle>
 *
 * Local testing (.env.local):
 *   PUBLIC_WHATSAPP_NUMBER=<test_number>
 *   PUBLIC_WHATSAPP_DISPLAY=+<test_number>
 */

const envWaNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
const envWaDisplay = import.meta.env.PUBLIC_WHATSAPP_DISPLAY;
const envEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
const envTg = import.meta.env.PUBLIC_TELEGRAM;
const envTgUrl = import.meta.env.PUBLIC_TELEGRAM_URL;

export const contact = {
  /** Display number for UI (with + and spaces) */
  whatsappDisplay: envWaDisplay ?? '+86-170-7278-3745',

  /** Number for wa.me deep links (no + or spaces) */
  whatsappNumber: envWaNumber ?? '8617072783745',

  /** Email for receiving inquiries */
  email: envEmail ?? 'felipeche01manager@YUNBSAOtrade.onmicrosoft.com',

  /** Company name */
  companyName: 'NewAge Trading',

  /** Working hours */
  workingHours: '9:00–18:00 (Beijing Time, UTC+8)',

  /** Telegram handle (without @) */
  telegram: envTg ?? 'richzhu001',

  /** Telegram deep link URL */
  telegramUrl: envTgUrl ?? 'https://t.me/richzhu001',
} as const;

/** Check if WhatsApp is properly configured (not placeholder) */
export function isWhatsAppConfigured(): boolean {
  return contact.whatsappNumber !== 'WHATSAPP_NUMBER';
}

/**
 * Page-aware WhatsApp messages — auto-selects context-appropriate text.
 */
export const whatsAppMessages: Record<string, string> = {
  default:
    'Hello, I am interested in your export products. Please send me more details.',
  vehicles:
    'Hello, I am interested in importing vehicles from China. Please help me estimate the CIF price and registration cost.',
  security:
    'Hello, I am interested in security products / CCTV solutions. Please send me a quotation.',
  oem:
    'Hello, I am interested in underwear OEM / wholesale. Please send me price range and MOQ.',
  pricing:
    'Hello, I would like to get a quotation. Please advise on pricing and delivery.',
  calculator:
    'Hello, I used your cost estimate tool and would like a formal quotation.',
} as const;

/** Build wa.me link with pre-filled message */
export function waLink(pageSlug: string = 'default'): string {
  const num = contact.whatsappNumber;
  const msg = whatsAppMessages[pageSlug] ?? whatsAppMessages.default;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
