/**
 * Multi-language data helper for dynamic page content.
 * Selects the appropriate field based on locale (en/ru/zh).
 */
import type { Locale } from '@i18n/types';

export function tData(data: Record<string, unknown>, key: string, lang: Locale, fallback?: string): string {
  const langMap: Record<string, Record<string, string>> = {
    en: {},
    zh: {},
    ru: {},
  };

  const langSuffix = lang === 'en' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1);
  const localizedKey = key + langSuffix;

  // Try localized key first
  if (data[localizedKey] && typeof data[localizedKey] === 'string') {
    return data[localizedKey] as string;
  }
  // Fallback to base key
  if (data[key] && typeof data[key] === 'string') {
    return data[key] as string;
  }
  return fallback ?? key;
}

export function tArr(data: Record<string, unknown>, key: string, lang: Locale): string[] {
  const langSuffix = lang === 'en' ? '' : lang.charAt(0).toUpperCase() + lang.slice(1);
  const localizedKey = key + langSuffix;

  if (Array.isArray(data[localizedKey])) {
    return data[localizedKey] as string[];
  }
  if (Array.isArray(data[key])) {
    return data[key] as string[];
  }
  return [];
}

// UI label translations for car pages
export const uiLabels: Record<string, Record<Locale, string>> = {
  // Car page
  getQuote: { en: 'Get CIF Quote →', zh: '获取 CIF 报价 →', ru: 'Получить CIF цену →' },
  technicalSpecs: { en: 'Technical Specifications', zh: '技术参数', ru: 'Технические характеристики' },
  general: { en: 'General', zh: '基本信息', ru: 'Общие сведения' },
  brand: { en: 'Brand', zh: '品牌', ru: 'Бренд' },
  model: { en: 'Model', zh: '型号', ru: 'Модель' },
  type: { en: 'Type', zh: '车型', ru: 'Тип' },
  category: { en: 'Category', zh: '动力类型', ru: 'Категория' },
  seats: { en: 'Seats', zh: '座位数', ru: 'Сиденья' },
  engine: { en: 'Engine / Powertrain', zh: '发动机/动力系统', ru: 'Двигатель' },
  keyHighlights: { en: 'Key Highlights', zh: '核心亮点', ru: 'Основные преимущества' },
  idealFor: { en: 'Ideal For', zh: '适合人群', ru: 'Идеально подходит для' },
  cifPricing: { en: 'CIF Export Pricing', zh: 'CIF 出口报价', ru: 'Экспортные цены CIF' },
  cifSub: { en: 'Estimated CIF prices to major export destinations', zh: '主要出口目的地 CIF 估算价格', ru: 'Ориентировочные цены CIF по основным направлениям' },
  destination: { en: 'Destination', zh: '目的地', ru: 'Направление' },
  fobPrice: { en: 'FOB Price', zh: 'FOB 工厂价', ru: 'Цена FOB' },
  oceanFreight: { en: 'Ocean Freight', zh: '海运费', ru: 'Морская перевозка' },
  insurance: { en: 'Insurance', zh: '保险费', ru: 'Страхование' },
  importDuty: { en: 'Import Duty', zh: '进口关税', ru: 'Импортная пошлина' },
  priceNote: { en: '* Prices are estimates for reference. Contact us for an exact CIF quote.', zh: '* 价格为估算参考价，请联系我们获取精确 CIF 报价。', ru: '* Цены являются ориентировочными. Свяжитесь с нами для точного расчёта.' },
  faq: { en: 'Frequently Asked Questions', zh: '常见问题', ru: 'Часто задаваемые вопросы' },
  similarModels: { en: 'Similar Models You May Like', zh: '您可能感兴趣的相似车型', ru: 'Похожие модели, которые могут вам понравиться' },
  compare: { en: 'Compare', zh: '对比', ru: 'Сравнение' },
  headToHead: { en: 'Head to Head Comparison', zh: '详细对比', ru: 'Подробное сравнение' },
  importGuide: { en: 'Import Guide', zh: '进口指南', ru: 'Руководство по импорту' },
  readMore: { en: 'Read More', zh: '了解更多', ru: 'Подробнее' },

  // Lingerie page
  priceRange: { en: 'Price Range', zh: '价格区间', ru: 'Ценовой диапазон' },
  moq: { en: 'MOQ', zh: '最低起订量', ru: 'Минимальный заказ' },
  leadTime: { en: 'Lead Time', zh: '交货期', ru: 'Срок производства' },
  fabricProps: { en: 'Fabric Properties', zh: '面料特性', ru: 'Свойства ткани' },
  applications: { en: 'Ideal Product Applications', zh: '适用产品', ru: 'Применение' },
  oemProcess: { en: 'OEM Production Process', zh: 'OEM 生产流程', ru: 'Процесс OEM-производства' },
  certifications: { en: 'Quality Certifications', zh: '质量认证', ru: 'Сертификаты качества' },
  requestOEM: { en: 'Request OEM Quote →', zh: '索取 OEM 报价 →', ru: 'Запросить OEM цену →' },
  otherFabrics: { en: 'Other Fabrics to Explore', zh: '其他可探索的面料', ru: 'Другие ткани для изучения' },

  // Security page
  requestBulk: { en: 'Request Bulk Quote →', zh: '索取批量报价 →', ru: 'Запросить оптовую цену →' },
  specs: { en: 'Technical Specifications', zh: '技术规格', ru: 'Технические характеристики' },
  scenarios: { en: 'Application Scenarios', zh: '应用场景', ru: 'Области применения' },
  residential: { en: 'Residential', zh: '住宅', ru: 'Жилые помещения' },
  commercial: { en: 'Commercial', zh: '商业', ru: 'Коммерческие' },
  education: { en: 'Education', zh: '教育', ru: 'Образование' },
  industrial: { en: 'Industrial', zh: '工业', ru: 'Промышленность' },
  internationalCerts: { en: 'International Certifications', zh: '国际认证', ru: 'Международные сертификаты' },
  moreFrom: { en: 'More from', zh: '更多', ru: 'Ещё от' },

  // Common
  home: { en: 'Home', zh: '首页', ru: 'Главная' },
  cars: { en: 'Car Export', zh: '汽车出口', ru: 'Экспорт авто' },
  lingerie: { en: 'Lingerie OEM', zh: '内衣 OEM', ru: 'Бельё OEM' },
  security: { en: 'Security Equipment', zh: '安防设备', ru: 'Оборудование безопасности' },
};

export function label(key: string, lang: Locale): string {
  return uiLabels[key]?.[lang] ?? key;
}
