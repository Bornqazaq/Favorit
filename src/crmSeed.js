// ═══════════════════════════════════════════════════════════════
// Генератор демо-статистики CRM.
// Создаёт реалистичный журнал событий (просмотры / WhatsApp / поиски)
// с временными метками за последние ~45 дней — чтобы фильтр по периоду
// (сегодня / неделя / месяц) показывал живые цифры.
// Запускается один раз, если статистика пустая (см. App.jsx).
// ═══════════════════════════════════════════════════════════════
import { initialProducts } from './data.js';

const DAY = 86400000;

const SEARCH_TERMS = [
  'iphone 16 pro max', 'айфон', 'iphone 15', 'наушники', 'airpods', 'macbook',
  'samsung s24 ultra', 'ipad', 'бу айфон', 'apple watch', 'xiaomi', 'аирподс',
  'iphone 13', 'макбук', 'часы apple', 'трейд ин', 'рассрочка', 'iphone 16',
  'аксессуары', 'galaxy', 'ipad air', 'airpods pro', 'телефон', 'samsung',
  'ipad pro', 'watch ultra', 'iphone 14', 'наушники сони', 'macbook air', 'бу',
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Метка времени с перекосом в недавнее: ~22% за сутки, ~30% за неделю, остальное за ~45 дней
function seededTs() {
  const r = Math.random();
  let ago;
  if (r < 0.22) ago = Math.random() * DAY;
  else if (r < 0.52) ago = Math.random() * 7 * DAY;
  else ago = Math.random() * 45 * DAY;
  return Math.round(Date.now() - ago);
}

const POPULAR = /iphone 16|iphone 15|airpods|macbook air|s24 ultra|watch|ipad/i;

export function generateCrmSeed() {
  const events = [];

  initialProducts.forEach(p => {
    // Базовая популярность товара
    let views = p.type === 'used' ? rand(5, 16) : rand(10, 28);
    if (POPULAR.test(p.name)) views += rand(15, 45);

    for (let i = 0; i < views; i++) {
      events.push({ t: 'view', k: p.id, ts: seededTs() });
    }
    // Переходы в WhatsApp — 12–30% от просмотров
    const wa = Math.round(views * (rand(12, 30) / 100));
    for (let i = 0; i < wa; i++) {
      events.push({ t: 'wa', k: p.id, ts: seededTs() });
    }
  });

  // Поисковые запросы
  SEARCH_TERMS.forEach(term => {
    const count = rand(3, 28);
    for (let i = 0; i < count; i++) {
      events.push({ t: 'search', k: term, ts: seededTs() });
    }
  });

  events.sort((a, b) => a.ts - b.ts);
  return events;
}
