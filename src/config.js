// ═══════════════════════════════════════════════════════════════
// ЦЕНТР УПРАВЛЕНИЯ КОНТАКТАМИ И ССЫЛКАМИ
// Реальные значения лежат в файле .env (переменные с префиксом VITE_).
// Здесь — только запасные значения на случай, если .env не задан.
// Меняешь данные в .env → меняется на всём сайте.
// ═══════════════════════════════════════════════════════════════
const env = import.meta.env;

export const config = {
  // Бренд
  brandName: env.VITE_BRAND_NAME || 'Ваше лого',
  city:      env.VITE_CITY       || 'Ваш город',
  since:     env.VITE_SINCE      || '2020',

  // Контакты
  whatsapp:     env.VITE_WHATSAPP || '70000000000',
  phoneDisplay: env.VITE_PHONE    || '+7 000 000 00 00',

  // Соцсети
  instagram: env.VITE_INSTAGRAM || '#',

  // Адрес
  address:     env.VITE_ADDRESS      || 'ул. Примерная, 1',
  addressNote: env.VITE_ADDRESS_NOTE || 'Ваш город, Казахстан',
  hours:       env.VITE_HOURS        || 'Ежедневно 10:00 — 20:00',

  // Карта 2ГИС
  gisLink: env.VITE_GIS_LINK || '#',
  gisKey:  env.VITE_2GIS_KEY || '',
  mapLat:  parseFloat(env.VITE_MAP_LAT) || 51.216649,
  mapLng:  parseFloat(env.VITE_MAP_LNG) || 51.37787,

  // Тексты-преимущества
  warrantyNote: env.VITE_WARRANTY_NOTE || '1 год гарантии',
  deliveryNote: env.VITE_DELIVERY_NOTE || 'Бесплатно по Казахстану',
};

// Готовая ссылка на WhatsApp с предзаполненным текстом
export const waLink = (text = '') =>
  `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;

// Ссылка-телефон
export const telLink = () => `tel:+${config.whatsapp}`;
