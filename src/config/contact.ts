/**
 * Contact configuration — single source of truth.
 * All WhatsApp buttons and contact elements read from here.
 * Do NOT hardcode WhatsApp numbers or email in pages/components.
 */
export const contact = {
  /** Display number for UI (with + and spaces) */
  whatsappDisplay: '+86 170 7278 3745',

  /** Number for wa.me deep links (no + or spaces) */
  whatsappNumber: '8617072783745',

  /** Email for receiving inquiries */
  email: 'CONTACT_EMAIL',

  /** Company name */
  companyName: 'NewAge Trading',

  /** Working hours */
  workingHours: '9:00–18:00 (Beijing Time, UTC+8)',

  /** Telegram */
  telegram: '@richzhu001',
  telegramUrl: 'https://t.me/richzhu001',
} as const;

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
