import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Phone, MessageCircle, MapPin, Info,
  RefreshCw, ChevronLeft, ChevronRight, CreditCard, Filter, ArrowDownUp,
  BarChart, Plus, Trash, Image as ImageIcon,
  Edit, Check, X, Maximize2, Battery, Box, Lock,
  Map as MapIcon, ShieldCheck, Sun, Moon
} from 'lucide-react';

// Иконка Instagram (нет в этой версии lucide) — инлайн SVG
function Instagram({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

import { initialProducts, categoriesData } from './data.js';
import { config, waLink, telLink } from './config.js';

// ── Сжатие фото при загрузке ────────────────────────────────
const processImageFile = (file, maxWidth, quality) =>
  new Promise((resolve, reject) => {
    if (!file.type.match(/image\/(jpeg|png|webp|jpg)/)) return reject('Разрешены только картинки.');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = reject; img.src = e.target.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });

// ── ErrorBoundary ────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="p-8 bg-bgMain min-h-screen flex flex-col items-center justify-center text-textMain">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Приложение упало.</h1>
        <p className="mb-6 text-textMuted text-center">Кэш сброшен, перезагрузи страницу.</p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="px-6 py-3 bg-brandAccent hover:bg-brandHover text-onBrand rounded-xl font-semibold">
          Перезагрузить
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ── localStorage hook ────────────────────────────────────────
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item);
      return Array.isArray(initialValue) && !Array.isArray(parsed) ? initialValue : parsed;
    } catch { return initialValue; }
  });
  const setValue = (value) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {
      if (e.name === 'QuotaExceededError') alert('Память браузера переполнена!');
    }
  };
  return [storedValue, setValue];
}

// ── Тема ─────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('imarket_theme') === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('imarket_theme', theme); } catch { /* */ }
  }, [theme]);
  return [theme, () => setTheme(p => p === 'dark' ? 'light' : 'dark')];
}

// ── Хелперы ──────────────────────────────────────────────────
const formatPrice = (p) => new Intl.NumberFormat('ru-RU').format(p) + ' ₸';

// ── Логотип iMarket (текст + красная точка над «и») ──────────
function Logo({ onClick, onDoubleClick, size = 20 }) {
  const clickCount = React.useRef(0);
  const clickTimer = React.useRef(null);

  const handleClick = () => {
    clickCount.current += 1;
    if (clickCount.current === 2) {
      clearTimeout(clickTimer.current);
      clickCount.current = 0;
      onDoubleClick?.();
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
        onClick?.();
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-start select-none shrink-0 leading-none"
      aria-label={config.brandName}
    >
      <span className="logo-word" style={{ fontSize: `${size}px` }}>
        {config.brandName}
      </span>
      <span className="text-[8px] font-semibold tracking-[0.34em] uppercase text-textFaint mt-0.5 ml-[2px]">
        {config.city}
      </span>
    </button>
  );
}

function WhatsAppButton({ text, label, className = '', icon = null }) {
  return (
    <a href={waLink(text)}
      target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 transition-all active:scale-95 ${className}`}>
      {icon}{label}
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════
function App() {
  const [theme, toggleTheme] = useTheme();
  const [route, setRoute] = useState({ path: 'home', params: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [storedProducts, setProducts] = useLocalStorage('imarket_products', initialProducts);

  // Мёрдж: все товары из initialProducts (каталог) + admin-добавленные (ID не из каталога)
  const catalogIds = useMemo(() => new Set(initialProducts.map(p => p.id)), []);
  const products = useMemo(() => {
    const stored = Array.isArray(storedProducts) ? storedProducts : [];
    const adminAdded = stored.filter(p => !catalogIds.has(p.id));
    const catalogWithEdits = initialProducts.map(p => {
      const edited = stored.find(s => s.id === p.id);
      return edited || p;
    });
    return [...catalogWithEdits, ...adminAdded];
  }, [storedProducts, catalogIds]);

  const [storedCrm, setCrmStats] = useLocalStorage('imarket_crm', { views: {}, waClicks: {}, searches: {} });
  const crmStats = storedCrm && typeof storedCrm === 'object' ? storedCrm : { views: {}, waClicks: {}, searches: {} };

  const navigate = (path, params = null) => { window.scrollTo(0, 0); setRoute({ path, params }); };

  const trackEvent = (type, key) => {
    setCrmStats(prev => {
      const s = { ...prev };
      if (!s[type]) s[type] = {};
      s[type][key] = (s[type][key] || 0) + 1;
      return s;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (q) { trackEvent('searches', q); navigate('search', { query: q }); setSearchQuery(''); }
  };

  return (
    <div className="min-h-screen bg-bgMain text-textMain font-sans selection:bg-brandAccent selection:text-onBrand flex flex-col">
      {/* ── ШАПКА ─────────────────────────────────────────── */}
      <header className="bg-bgGlass backdrop-blur-md sticky top-0 z-50 border-b border-borderColor">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Logo onClick={() => navigate('home')} onDoubleClick={() => navigate('admin')} />

          {/* Поиск */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative min-w-0">
            <input
              type="search" placeholder="Поиск техники..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-bgElevated text-textMain rounded-full py-[9px] pl-9 pr-3 text-[13px] outline-none border border-borderColor focus:border-brandAccent transition-colors placeholder:text-textFaint"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textFaint pointer-events-none" />
          </form>

          {/* Переключатель темы */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            className="w-9 h-9 rounded-full bg-bgElevated border border-borderColor flex items-center justify-center text-textMuted hover:text-textMain hover:border-borderBright transition-all shrink-0"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* ── КОНТЕНТ ───────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto w-full flex-grow pb-12">
        {route.path === 'home'      && <HomePage navigate={navigate} />}
        {route.path === 'catalog'   && <CatalogPage navigate={navigate} categoryId={route.params?.category} products={products} />}
        {route.path === 'used'      && <UsedCatalogPage navigate={navigate} products={products} />}
        {route.path === 'search'    && <SearchPage navigate={navigate} query={route.params?.query} products={products} />}
        {route.path === 'product'   && <ProductPage navigate={navigate} productId={route.params?.id} products={products} trackEvent={trackEvent} />}
        {route.path === 'contact'   && <ContactPage navigate={navigate} />}
        {route.path === 'tradein'   && <TradeInPage navigate={navigate} />}
        {route.path === 'admin'     && <AdminPage products={products} setProducts={setProducts} crmStats={crmStats} isAdmin={isAdmin} setIsAdmin={setIsAdmin} navigate={navigate} />}
      </main>

      {/* ── ФУТЕР ─────────────────────────────────────────── */}
      <footer className="border-t border-borderColor mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="logo-word text-[16px]">{config.brandName}</span>
            <p className="text-[11px] text-textFaint mt-1.5">© {new Date().getFullYear()} {config.brandName} · {config.addressNote}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={config.instagram} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-bgElevated border border-borderColor flex items-center justify-center text-textMuted hover:text-brand hover:border-brandMutedBorder transition-all">
              <Instagram size={16} />
            </a>
            <a href={waLink('Здравствуйте!')} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-bgElevated border border-borderColor flex items-center justify-center text-textMuted hover:text-whatsapp hover:border-borderBright transition-all">
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}

// ═══════════════════════════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА
// ═══════════════════════════════════════════════════════════════
function HomePage({ navigate }) {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-6 animate-fadeIn">

      {/* ── Герой ─────────────────────────────────────────── */}
      <section className="smoke-bg bg-bgCard border border-borderBright rounded-2xl p-5">
        <h1 className="text-[26px] font-bold text-textMain leading-[1.2] mb-2">
          Вся техника Apple<br />и не только<span className="text-brand">.</span>
        </h1>
        <p className="text-[13px] text-textMuted leading-relaxed">
          Оригинальная электроника и Б/У техника<br />с гарантией и выгодный Trade-IN.
        </p>
      </section>

      {/* ── Сетка навигации ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Каталог — акцентная карточка */}
        <button onClick={() => navigate('catalog')}
          className="text-left rounded-2xl p-4 flex flex-col gap-3 transition-all duration-150 active:scale-[0.97] hover:brightness-110"
          style={{ background: 'var(--color-brand-muted)', border: '1px solid var(--color-brand-muted-border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(225,29,46,0.18)' }}>
            <Search size={17} className="text-brand" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-textMain">Каталог</div>
            <div className="text-[11px] text-textFaint mt-0.5">Все товары</div>
          </div>
        </button>

        {/* Б/У Техника */}
        <button onClick={() => navigate('used')}
          className="bg-bgCard border border-borderBright text-left rounded-2xl p-4 flex flex-col gap-3 transition-all duration-150 active:scale-[0.97] hover:border-brandMutedBorder">
          <div className="w-9 h-9 rounded-xl bg-bgElevated flex items-center justify-center">
            <RefreshCw size={17} className="text-textMuted" />
          </div>
          <div>
            <div className="text-[13px] font-medium text-textMain">Б/У Техника</div>
            <div className="text-[11px] text-textFaint mt-0.5">С гарантией</div>
          </div>
        </button>
      </div>

      {/* ── Trade-IN строка ────────────────────────────────── */}
      <button onClick={() => navigate('tradein')}
        className="bg-bgCard border border-borderBright rounded-2xl p-4 flex items-center gap-3 transition-all duration-150 active:scale-[0.99] hover:border-brandMutedBorder text-left w-full">
        <div className="w-9 h-9 rounded-xl bg-bgElevated flex items-center justify-center shrink-0">
          <RefreshCw size={17} className="text-textMuted" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-textMain">Trade-IN</div>
          <div className="text-[11px] text-textFaint mt-0.5">Обменяй и сэкономь</div>
        </div>
        <ChevronRight size={15} className="text-textFaint shrink-0" />
      </button>

      {/* ── Магазин ───────────────────────────────────────── */}
      <section className="bg-bgCard border border-borderBright rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-brand-muted)', border: '1px solid var(--color-brand-muted-border)' }}>
            <MapPin size={18} className="text-brand" />
          </div>
          <div>
            <div className="text-[15px] font-medium text-textMain">Наш магазин</div>
            <div className="text-[12px] text-textFaint mt-0.5">{config.city}</div>
          </div>
        </div>

        <div className="rounded-xl p-3 flex flex-col gap-2.5" style={{ background: 'var(--color-bg-elevated)' }}>
          <div className="flex items-center gap-2 text-[13px] text-textMuted">
            <MapPin size={13} className="text-textFaint shrink-0" /> {config.address}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-textMuted">
            <Info size={13} className="text-textFaint shrink-0" /> {config.hours}
          </div>
        </div>

        <button onClick={() => navigate('contact')}
          className="w-full bg-bgElevated border border-borderBright text-textMain rounded-xl py-3 text-[14px] font-medium flex items-center justify-center gap-2 transition-all hover:border-brandMutedBorder active:scale-[0.99]">
          <MapPin size={14} className="text-brand" /> Как проехать?
        </button>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КАТАЛОГ
// ═══════════════════════════════════════════════════════════════
function CatalogPage({ navigate, categoryId, products }) {
  const baseProducts = products.filter(p => p.type === 'new' && (categoryId ? p.category === categoryId : true));
  const [activeTag, setActiveTag] = useState('Все');
  const [sortOrder, setSortOrder] = useState('default');

  const availableTags = useMemo(() => {
    const tags = new Set();
    baseProducts.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return ['Все', ...Array.from(tags).sort()];
  }, [baseProducts]);

  const filteredProducts = useMemo(() => {
    let r = [...baseProducts];
    if (activeTag !== 'Все') r = r.filter(p => p.tags?.includes(activeTag) || p.brand === activeTag);
    if (sortOrder === 'asc') r.sort((a, b) => a.base_price - b.base_price);
    else if (sortOrder === 'desc') r.sort((a, b) => b.base_price - a.base_price);
    else if (!categoryId && activeTag === 'Все') {
      const om = categoriesData.reduce((acc, c) => ({ ...acc, [c.id]: c.order }), {});
      r.sort((a, b) => (om[a.category] || 99) - (om[b.category] || 99));
    }
    return r;
  }, [baseProducts, activeTag, sortOrder, categoryId]);

  const sortLabel = sortOrder === 'asc' ? 'Сначала дешёвые' : sortOrder === 'desc' ? 'Сначала дорогие' : 'Цена: по умолчанию';

  return (
    <div className="p-4 flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 bg-bgCard border border-borderBright rounded-xl text-textMain hover:border-brandMutedBorder transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-textMain">Каталог</h1>
      </div>

      {/* Категории */}
      <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => navigate('catalog')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${!categoryId ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgCard text-textMuted border-borderBright hover:border-brandMutedBorder'}`}>
          Все
        </button>
        {categoriesData.map(cat => {
          const Icon = cat.icon;
          const active = categoryId === cat.id;
          return (
            <button key={cat.id} onClick={() => navigate('catalog', { category: cat.id })}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${active ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgCard text-textMuted border-borderBright hover:border-brandMutedBorder'}`}>
              <Icon size={14} /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Фильтр/сортировка */}
      {baseProducts.length > 0 && (
        <div className="bg-bgCard p-3 rounded-2xl border border-borderBright flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-textFaint shrink-0" />
            <div className="flex overflow-x-auto gap-1.5 pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {availableTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${activeTag === tag ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgElevated text-textMuted border-borderColor hover:text-textMain'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setSortOrder(p => p === 'default' ? 'asc' : p === 'asc' ? 'desc' : 'default')}
            className={`w-fit flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border font-medium transition-colors ${sortOrder !== 'default' ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgElevated text-textMuted border-borderColor'}`}>
            <ArrowDownUp size={12} /> {sortLabel}
          </button>
        </div>
      )}

      {/* Товары */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1 stagger">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-bgCard rounded-2xl border border-borderBright mt-1 flex flex-col items-center">
          <p className="text-textMuted text-[15px] mb-4">По таким параметрам ничего не найдено.</p>
          <button onClick={() => { setActiveTag('Все'); setSortOrder('default'); }}
            className="bg-bgElevated border border-borderBright px-6 py-2.5 rounded-full text-[13px] font-medium text-textMain hover:border-brandMutedBorder transition-colors">
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КАТАЛОГ Б/У
// ═══════════════════════════════════════════════════════════════
function UsedCatalogPage({ navigate, products }) {
  const base = products.filter(p => p.type === 'used');
  const [activeBrand, setActiveBrand] = useState('Все');
  const brands = useMemo(() => ['Все', ...new Set(base.map(p => p.brand))], [base]);
  const filtered = useMemo(() => activeBrand === 'Все' ? base : base.filter(p => p.brand === activeBrand), [base, activeBrand]);

  return (
    <div className="p-4 flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 bg-bgCard border border-borderBright rounded-xl text-textMain">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-textMain flex items-center gap-2">
          <RefreshCw size={18} style={{ color: 'var(--color-accent-blue)' }} /> Б/У техника
        </h1>
      </div>

      <div className="bg-bgCard border border-borderBright p-4 rounded-2xl text-[13px] flex gap-3 text-textMuted">
        <Info size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent-blue)' }} />
        <p>Вся Б/У техника проверена нашими специалистами. Предоставляем гарантию от магазина.</p>
      </div>

      {brands.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {brands.map(b => (
            <button key={b} onClick={() => setActiveBrand(b)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors flex-shrink-0 ${activeBrand === b ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgCard text-textMuted border-borderBright hover:border-brandMutedBorder'}`}>
              {b}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 stagger">
        {filtered.map(product => (
          <div key={product.id} onClick={() => navigate('product', { id: product.id })}
            className="bg-bgCard rounded-2xl border border-borderBright p-4 cursor-pointer flex gap-4 hover:border-brandMutedBorder transition-all active:scale-[0.98]">
            <div className="w-24 h-24 bg-imgBg rounded-xl p-2 flex-shrink-0 relative overflow-hidden">
              <img src={product.variants?.[0]?.thumb || ''} className="w-full h-full object-contain" alt={product.name} />
              <span className="absolute top-1.5 left-1.5 bg-brandAccent text-onBrand text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">Б/У</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-textMain leading-tight mb-1 truncate">{product.name}</h3>
              <div className="text-brand font-bold text-[16px] mb-2">{formatPrice(product.base_price)}</div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <span className="bg-bgElevated border border-borderColor text-textFaint text-[10px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <Battery size={10} /> {product.used_stats?.battery}%
                </span>
                <span className="bg-bgElevated border border-borderColor text-textFaint text-[10px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <Info size={10} /> {product.used_stats?.wear}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 flex flex-col items-center">
            <p className="text-textMuted mb-4 text-[14px]">Б/У техники не найдено.</p>
            <button onClick={() => setActiveBrand('Все')} className="bg-bgCard border border-borderBright px-6 py-2 rounded-full text-[13px] font-medium text-textMain">Сбросить</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КАРТОЧКА ТОВАРА (в каталоге)
// ═══════════════════════════════════════════════════════════════
function ProductCard({ product, onClick }) {
  const displayImage = product.variants?.[0]?.thumb || '';
  return (
    <div onClick={onClick}
      className="bg-bgCard rounded-2xl border border-borderBright p-3 cursor-pointer transition-all duration-200 active:scale-95 flex flex-col h-full hover:border-brandMutedBorder group">
      <div className="aspect-square bg-imgBg rounded-xl mb-3 relative flex items-center justify-center p-3 overflow-hidden">
        {displayImage
          ? <img src={displayImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-textFaint"><ImageIcon size={32} /></div>
        }
        {product.type === 'used' && (
          <span className="absolute top-2 left-2 bg-brandAccent text-onBrand text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">Б/У</span>
        )}
      </div>
      <div className="flex flex-col flex-grow px-0.5">
        <span className="text-[10px] text-textFaint font-medium mb-1 uppercase tracking-wide">{product.brand}</span>
        <h3 className="font-medium text-[13px] text-textMain leading-snug line-clamp-2 mb-2">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-[10px] text-textFaint">От</span>
            <div className="font-extrabold text-[15px] text-textMain leading-none mt-0.5">{formatPrice(product.base_price)}</div>
          </div>
          <span className="w-7 h-7 rounded-full bg-brandAccent text-onBrand flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// СТРАНИЦА ТОВАРА
// ═══════════════════════════════════════════════════════════════
function ProductPage({ navigate, productId, products, trackEvent }) {
  const product = products.find(p => p.id === productId);
  const isUsed = product?.type === 'used';
  const variants = product?.variants || [];
  const uniqueMemories = useMemo(() => [...new Set(variants.map(v => v.memory))], [variants]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(uniqueMemories[0] || '');
  const [selectedColor, setSelectedColor] = useState('');

  const availableColors = useMemo(() => variants.filter(v => v.memory === selectedMemory).map(v => v.color), [variants, selectedMemory]);

  useEffect(() => { if (uniqueMemories.length > 0 && !selectedMemory) setSelectedMemory(uniqueMemories[0]); }, [uniqueMemories, selectedMemory]);
  useEffect(() => { if (availableColors.length > 0 && !availableColors.includes(selectedColor)) setSelectedColor(availableColors[0]); }, [availableColors, selectedColor]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (product) trackEvent('views', product.id); }, [product?.id]);

  if (!product) return <div className="p-8 text-center text-textMuted">Товар не найден</div>;

  const currentVariant = variants.find(v => v.memory === selectedMemory && v.color === selectedColor) || variants[0];
  const displayPrice = currentVariant ? currentVariant.price : product.base_price;
  const displayImage = currentVariant?.full || '';

  const handleWA = () => {
    trackEvent('waClicks', product.id);
    const memT = selectedMemory ? `Память: ${selectedMemory}` : '';
    const colT = selectedColor ? `Цвет: ${selectedColor}` : '';
    const detail = [memT, colT].filter(Boolean).join(', ');
    const text = `Здравствуйте! Пишу по поводу товара: ${product.name}${isUsed ? ' [Б/У]' : ''}${detail ? ` (${detail})` : ''}. Цена: ${formatPrice(displayPrice)}. Подскажите, есть ли в наличии?`;
    window.open(waLink(text), '_blank');
  };

  return (
    <div className="bg-bgMain min-h-screen pb-12 animate-fadeIn">
      {/* Sticky sub-header */}
      <div className="flex items-center gap-3 px-4 py-3 sticky top-0 bg-bgGlass backdrop-blur-md z-10 border-b border-borderColor">
        <button onClick={() => navigate(isUsed ? 'used' : 'catalog')}
          className="p-2 -ml-2 bg-bgElevated rounded-xl text-textMain border border-borderBright hover:border-brandMutedBorder transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="text-[13px] text-textMuted truncate">{isUsed ? 'Б/У' : 'Каталог'} / {product.brand}</span>
      </div>

      <div className="px-4 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto pt-4">
        {/* Изображение */}
        <div className="md:w-1/2">
          <div className="bg-imgBg rounded-2xl flex items-center justify-center relative cursor-zoom-in h-72 sm:h-80 border border-borderBright overflow-hidden"
            onClick={() => setIsZoomed(true)}>
            {isUsed && <span className="absolute top-3 left-3 bg-brandAccent text-onBrand text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase z-10">Б/У</span>}
            {displayImage
              ? <img src={displayImage} alt={product.name} className="w-full h-full object-contain" />
              : <div className="flex flex-col items-center gap-2 text-textFaint"><ImageIcon size={48} /><span className="text-[12px]">Нет фото</span></div>
            }
            <div className="absolute bottom-3 right-3 bg-bgCard/80 backdrop-blur-sm p-1.5 rounded-lg text-textMuted border border-borderColor">
              <Maximize2 size={16} />
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-2xl font-bold text-textMain leading-tight mb-2">{product.name}</h1>
          <div className="text-2xl font-extrabold text-brand mb-4">{formatPrice(displayPrice)}</div>

          {/* Бейджи */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-bgCard border border-borderBright text-textMuted px-3 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1">
              <ShieldCheck size={12} style={{ color: 'var(--color-accent-blue)' }} /> {config.warrantyNote}
            </span>
            {product.features?.tradeIn && (
              <span className="bg-bgCard border border-borderBright text-textMuted px-3 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1">
                <RefreshCw size={12} style={{ color: 'var(--color-accent-orange)' }} /> Trade-IN
              </span>
            )}
            {product.features?.installment && (
              <span className="bg-bgCard border border-borderBright text-textMuted px-3 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1">
                <CreditCard size={12} className="text-brand" /> Рассрочка
              </span>
            )}
          </div>

          {/* Характеристики Б/У */}
          {isUsed && product.used_stats && (
            <div className="bg-bgCard border border-borderBright rounded-2xl p-4 mb-5 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5"><span className="text-textFaint text-[10px] font-medium uppercase">Состояние</span><span className="font-medium text-[13px] text-textMain flex items-center gap-1"><Info size={13} className="text-brand" /> {product.used_stats.wear}</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-textFaint text-[10px] font-medium uppercase">Батарея</span><span className="font-medium text-[13px] text-textMain flex items-center gap-1"><Battery size={13} className="text-brand" /> {product.used_stats.battery}%</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-textFaint text-[10px] font-medium uppercase">Коробка</span><span className="font-medium text-[13px] text-textMain flex items-center gap-1"><Box size={13} className="text-brand" /> {product.used_stats.has_box ? 'Есть' : 'Нет'}</span></div>
              {product.used_stats.defects && (
                <div className="col-span-2 flex flex-col gap-0.5 pt-2 border-t border-borderColor"><span className="text-textFaint text-[10px] font-medium uppercase">Примечания</span><span className="text-[12px] text-textMuted">{product.used_stats.defects}</span></div>
              )}
            </div>
          )}

          {/* Опции */}
          {variants.length > 0 && (
            <div className="flex flex-col gap-4 mb-5">
              {uniqueMemories[0] && (
                <div>
                  <span className="block text-[11px] font-medium text-textFaint uppercase mb-2">Объём памяти</span>
                  <div className="flex flex-wrap gap-2">
                    {uniqueMemories.map(mem => (
                      <button key={mem} onClick={() => setSelectedMemory(mem)}
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all border ${selectedMemory === mem ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgCard text-textMain border-borderBright hover:border-brandMutedBorder'}`}>
                        {mem}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {availableColors[0] && (
                <div>
                  <span className="block text-[11px] font-medium text-textFaint uppercase mb-2">Цвет</span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(col => (
                      <button key={col} onClick={() => setSelectedColor(col)}
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all border ${selectedColor === col ? 'bg-brandAccent text-onBrand border-brandAccent' : 'bg-bgCard text-textMain border-borderBright hover:border-brandMutedBorder'}`}>
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Описание */}
          {product.description && (
            <div className="mb-6">
              <span className="block text-[11px] font-medium text-textFaint uppercase mb-2">Описание</span>
              <p className="text-[13px] text-textMain leading-relaxed bg-bgCard p-4 rounded-xl border border-borderBright">{product.description}</p>
            </div>
          )}

          <div className="mt-auto">
            <button onClick={handleWA}
              className="w-full bg-brandAccent hover:bg-brandHover text-onBrand py-4 rounded-2xl font-semibold text-[15px] flex justify-center items-center gap-2 shadow-lg transition-all active:scale-95">
              <MessageCircle size={20} /> Написать и купить
            </button>
          </div>
        </div>
      </div>

      {/* Зум фото */}
      {isZoomed && (
        <div className="fixed inset-0 bg-overlay z-[100] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomed(false)}>
          <button className="absolute top-6 right-6 text-onBrand/60 hover:text-onBrand p-2 transition-colors">
            <X size={28} />
          </button>
          <img src={displayImage} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} alt={product.name} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КОНТАКТЫ
// ═══════════════════════════════════════════════════════════════
function ContactPage({ navigate }) {
  useEffect(() => {
    let map;
    if (!document.getElementById('2gis-loader')) {
      const script = document.createElement('script');
      script.id = '2gis-loader';
      script.src = 'https://maps.api.2gis.ru/2.0/loader.js';
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
    function initMap() {
      if (!window.DG) return;
      window.DG.then(() => {
        const container = document.getElementById('map-container');
        if (container) container.innerHTML = '';
        map = window.DG.map('map-container', {
          center: [config.mapLat, config.mapLng], zoom: 17, fullscreenControl: false,
          key: config.gisKey,
        });
        window.DG.marker([config.mapLat, config.mapLng]).addTo(map)
          .bindPopup(`<b>${config.brandName}</b><br>${config.address}`);
      });
    }
    return () => { if (map) map.remove(); };
  }, []);

  return (
    <div className="p-4 flex flex-col gap-5 max-w-lg mx-auto animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('home')} className="p-2 -ml-2 bg-bgCard text-textMain border border-borderBright rounded-xl hover:border-brandMutedBorder transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-textMain">Контакты</h1>
      </div>

      <div className="bg-bgCard rounded-2xl p-5 border border-borderBright">
        <h2 className="text-[16px] font-semibold mb-5 text-textMain">Ждём вас!</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-brand" style={{ background: 'var(--color-brand-muted)' }}>
              <MapPin size={18} />
            </div>
            <div>
              <p className="font-medium text-textMain text-[15px]">{config.address}</p>
              <p className="text-[12px] text-textMuted mt-0.5">{config.addressNote}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-brand" style={{ background: 'var(--color-brand-muted)' }}>
              <Phone size={18} />
            </div>
            <div>
              <a href={telLink()} className="font-medium text-textMain text-[15px] hover:text-brand transition-colors block">{config.phoneDisplay}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-brand" style={{ background: 'var(--color-brand-muted)' }}>
              <Info size={18} />
            </div>
            <div>
              <p className="font-medium text-textMain text-[15px]">{config.hours}</p>
              <p className="text-[12px] text-textMuted mt-0.5">Без выходных</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-brand" style={{ background: 'var(--color-brand-muted)' }}>
              <Instagram size={18} />
            </div>
            <div>
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="font-medium text-textMain text-[15px] hover:text-brand transition-colors block">@ваш.instagram</a>
              <p className="text-[12px] text-textMuted mt-0.5">Новинки и акции</p>
            </div>
          </div>
        </div>

        <WhatsAppButton
          text="Здравствуйте! Как к вам проехать?"
          label="Связаться в WhatsApp"
          className="w-full bg-whatsapp hover:bg-whatsappHover text-onBrand py-3.5 rounded-xl font-medium mt-6"
          icon={<MessageCircle size={18} />}
        />
        <a href={config.gisLink}
          target="_blank" rel="noopener noreferrer"
          className="w-full bg-gis hover:bg-gisHover text-onBrand py-3.5 rounded-xl font-medium mt-3 flex items-center justify-center gap-2 transition-colors">
          <MapIcon size={18} /> Открыть в 2GIS
        </a>
      </div>

      <div className="h-56 bg-imgBg rounded-2xl overflow-hidden border border-borderBright">
        <div id="map-container" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TRADE-IN
// ═══════════════════════════════════════════════════════════════
function TradeInPage({ navigate }) {
  return (
    <div className="p-4 max-w-lg mx-auto animate-fadeIn">
      <button onClick={() => navigate('home')} className="mb-4 p-2 bg-bgCard border border-borderBright rounded-xl text-textMain">
        <ChevronLeft size={20} />
      </button>
      <div className="smoke-bg bg-bgCard border border-borderBright p-7 rounded-3xl mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(255,122,26,0.12)', border: '1px solid rgba(255,122,26,0.28)', color: 'var(--color-accent-orange)' }}>
          <RefreshCw size={22} />
        </div>
        <h1 className="text-2xl font-bold text-textMain mb-2">Trade-IN</h1>
        <p className="text-[14px] text-textMuted leading-relaxed">Обменяй старый гаджет на новый с доплатой. Честная оценка за 5 минут на месте.</p>
      </div>
      <WhatsAppButton
        text="Хочу сдать в Trade-IN: "
        label="Оценить онлайн"
        className="w-full bg-brandAccent hover:bg-brandHover text-onBrand py-4 rounded-2xl font-semibold text-[15px]"
        icon={<MessageCircle size={18} />}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ПОИСК
// ═══════════════════════════════════════════════════════════════
function SearchPage({ navigate, query, products }) {
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.tags?.some(t => t.includes(query)) ||
    p.brand.toLowerCase().includes(query)
  );

  return (
    <div className="p-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => navigate('home')} className="p-2 bg-bgCard border border-borderBright rounded-xl text-textMain">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[16px] font-semibold truncate text-textMain">Поиск: «{query}»</h1>
      </div>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger">
          {results.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-bgCard rounded-2xl border border-borderBright flex flex-col items-center">
          <p className="text-textMuted text-[15px] mb-4">По запросу ничего не нашли</p>
          <button onClick={() => navigate('catalog')}
            className="bg-bgElevated border border-borderBright px-6 py-2.5 rounded-full text-[13px] font-medium text-textMain hover:border-brandMutedBorder">
            Перейти в каталог
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// АДМИНКА
// ═══════════════════════════════════════════════════════════════
function AdminPage({ products, setProducts, crmStats, isAdmin, setIsAdmin, navigate }) {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);

  // Пароль берётся из .env (VITE_ADMIN_PASS).
  // VITE_ переменные встраиваются в бандл — не используй здесь production-секреты.
  // Для настоящей защиты нужен backend. Данная панель правит только localStorage.
  const handleLogin = () => {
    const adminPass = import.meta.env.VITE_ADMIN_PASS;
    if (adminPass && password === adminPass) {
      setIsAdmin(true); setLoginError(false);
    } else {
      setLoginError(true); setPassword('');
    }
  };

  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-bgCard p-8 rounded-3xl border border-borderBright max-w-sm w-full text-center animate-fadeUp">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--color-brand-muted)', border: '1px solid var(--color-brand-muted-border)' }}>
          <Lock size={26} className="text-brand" />
        </div>
        <h2 className="text-xl font-bold mb-5 text-textMain">Вход в панель</h2>
        <input
          type="password" placeholder="Пароль" value={password}
          onChange={e => { setPassword(e.target.value); setLoginError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className={`w-full bg-bgElevated border ${loginError ? 'border-brandAccent' : 'border-borderBright'} text-textMain rounded-xl p-3 mb-2 text-center focus:outline-none focus:border-brandAccent font-mono text-[15px]`}
        />
        {loginError && <p className="text-brandAccent text-[12px] mb-3">Неверный пароль</p>}
        <button onClick={handleLogin} className="w-full bg-brandAccent hover:bg-brandHover text-onBrand font-semibold py-3.5 rounded-xl mt-2 transition-colors">
          Войти
        </button>
      </div>
    </div>
  );

  const handleDelete = (id) => {
    if (window.confirm('Удалить товар?')) setProducts(products.filter(p => p.id !== id));
  };
  const handleSave = (prod) => {
    if (prod.id) {
      const exists = products.some(p => p.id === prod.id);
      setProducts(exists
        ? products.map(p => p.id === prod.id ? prod : p)
        : [...products, prod]
      );
    } else {
      setProducts([{ ...prod, id: Date.now().toString() }, ...products]);
    }
    setEditingProduct(null);
  };

  if (editingProduct) return (
    <AdminProductForm
      product={editingProduct}
      onSave={handleSave}
      onCancel={() => setEditingProduct(null)}
      allTags={[...new Set(products.flatMap(p => p.tags || []))]}
    />
  );

  const newProduct = { type: activeTab === 'products' ? 'new' : 'used', name: '', brand: '', category: 'smartphones', base_price: '', tags: [], variants: [], features: { tradeIn: false, installment: false }, used_stats: activeTab === 'used' ? { wear: 'Хорошее', battery: 100, has_box: false, defects: '' } : null };

  return (
    <div className="p-4 flex flex-col gap-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('home')} className="p-2 bg-bgCard border border-borderBright rounded-xl text-textMain"><ChevronLeft size={18} /></button>
          <h1 className="text-[18px] font-bold text-textMain">Управление</h1>
        </div>
        <button onClick={() => setIsAdmin(false)} className="text-[12px] font-medium text-textMuted bg-bgCard border border-borderBright px-3 py-1.5 rounded-lg hover:text-textMain transition-colors">
          Выйти
        </button>
      </div>

      {/* Табы */}
      <div className="flex bg-bgCard border border-borderBright p-1 rounded-xl">
        {[['products','Новые'], ['used','Б/У'], ['crm','CRM']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[12px] font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-brandAccent text-onBrand' : 'text-textMuted'}`}>
            {tab === 'crm' ? <span className="flex items-center justify-center gap-1"><BarChart size={13} /> {label}</span> : `${label} (${products.filter(p => p.type === (tab === 'products' ? 'new' : 'used')).length})`}
          </button>
        ))}
      </div>

      {/* CRM */}
      {activeTab === 'crm' && (
        <div className="bg-bgCard rounded-2xl p-5 border border-borderBright flex flex-col gap-6">
          {[['views','👁 Топ просмотров'], ['waClicks','💬 Переходы в WhatsApp'], ['searches','🔍 Поиски']].map(([key, label]) => (
            <div key={key}>
              <h3 className="font-medium text-[14px] mb-3 text-brand">{label}</h3>
              {Object.entries(crmStats[key] || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, count]) => {
                const p = key === 'searches' ? null : products.find(x => x.id === id);
                const name = key === 'searches' ? `«${id}»` : (p ? p.name : null);
                return name ? (
                  <div key={id} className="flex justify-between py-2 border-b border-borderColor text-[13px]">
                    <span className="text-textMuted truncate mr-4">{name}</span>
                    <span className="font-medium text-textMain shrink-0">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
      )}

      {/* Товары */}
      {(activeTab === 'products' || activeTab === 'used') && (
        <div className="flex flex-col gap-3">
          <button onClick={() => setEditingProduct(newProduct)}
            className="bg-brandAccent hover:bg-brandHover text-onBrand font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <Plus size={18} /> Добавить {activeTab === 'products' ? 'новый товар' : 'Б/У товар'}
          </button>
          <div className="flex flex-col gap-2">
            {products.filter(p => activeTab === 'products' ? p.type === 'new' : p.type === 'used').map(p => (
              <div key={p.id} className="bg-bgCard p-3 rounded-xl border border-borderBright flex items-center gap-3">
                <div className="w-10 h-10 bg-imgBg rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {p.variants?.[0]?.thumb
                    ? <img src={p.variants[0].thumb} className="w-full h-full object-contain" alt={p.name} />
                    : <ImageIcon size={16} className="text-textFaint" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[13px] text-textMain truncate">{p.name}</h4>
                  <p className="text-[11px] text-brand font-bold">{formatPrice(p.base_price)}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditingProduct(p)} className="p-2 text-textMuted bg-bgElevated border border-borderColor rounded-lg hover:border-borderBright transition-colors"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-brandAccent bg-bgElevated border border-borderColor rounded-lg hover:border-borderBright transition-colors"><Trash size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ФОРМА ТОВАРА (АДМИНКА)
// ═══════════════════════════════════════════════════════════════
function AdminProductForm({ product, onSave, onCancel, allTags }) {
  const [form, setForm] = useState(product);
  const [tagInput, setTagInput] = useState('');
  const isUsed = form.type === 'used';

  const addTag = (t) => {
    const v = t.toLowerCase().trim();
    if (v && !form.tags?.includes(v)) setForm({ ...form, tags: [...(form.tags || []), v] });
    setTagInput('');
  };
  const addVariant = () => setForm({ ...form, variants: [...(form.variants || []), { memory: '', color: '', price: form.base_price, thumb: '', full: '' }] });
  const updateVariant = (idx, field, val) => { const nv = [...form.variants]; nv[idx][field] = val; setForm({ ...form, variants: nv }); };
  const handlePhotoUpload = async (file, vIdx) => {
    try {
      updateVariant(vIdx, 'thumb', await processImageFile(file, 400, 0.6));
      updateVariant(vIdx, 'full', await processImageFile(file, 1200, 0.8));
    } catch (e) { alert(e); }
  };
  const tagSuggestions = allTags.filter(t => t.includes(tagInput.toLowerCase().trim()) && !form.tags?.includes(t)).slice(0, 5);

  const inputCls = 'p-3 rounded-xl bg-bgMain text-textMain border border-borderBright focus:border-brandAccent outline-none w-full text-[13px]';

  return (
    <div className="p-4 bg-bgMain min-h-screen animate-fadeIn">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-textMain">{form.id ? 'Редактировать' : 'Добавить'} {isUsed ? 'Б/У' : 'Новый'}</h2>
        <button onClick={onCancel} className="p-2 bg-bgCard border border-borderBright rounded-xl text-textMain"><X size={18} /></button>
      </div>

      <div className="flex flex-col gap-4 max-w-lg mx-auto pb-24">
        {/* Основные поля */}
        <div className="flex flex-col gap-3 bg-bgCard p-5 rounded-2xl border border-borderBright">
          <input className={inputCls} placeholder="Название (напр. iPhone 16)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="flex gap-3">
            <input className={inputCls} placeholder="Бренд" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {categoriesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <input type="number" className={`${inputCls} text-brand font-bold`} placeholder="Базовая цена" value={form.base_price} onChange={e => setForm({ ...form, base_price: Number(e.target.value) })} />
          <textarea className={`${inputCls} h-20 resize-none`} placeholder="Описание..." value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* Флаги услуг */}
        {!isUsed && (
          <div className="flex flex-col gap-3 bg-bgCard p-5 rounded-2xl border border-borderBright">
            <h3 className="font-medium text-[13px] text-textMuted">Услуги</h3>
            {[['tradeIn','Trade-IN'],['installment','Рассрочка']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-[13px] text-textMain cursor-pointer">
                <input type="checkbox" checked={form.features?.[key]} onChange={e => setForm({ ...form, features: { ...form.features, [key]: e.target.checked } })} className="w-4 h-4 accent-brandAccent" />
                {label}
              </label>
            ))}
          </div>
        )}

        {/* Данные Б/У */}
        {isUsed && (
          <div className="flex flex-col gap-3 bg-bgCard p-5 rounded-2xl border border-borderBright">
            <h3 className="font-medium text-[13px] text-brand">Данные Б/У</h3>
            <div className="flex gap-3">
              <select className={inputCls} value={form.used_stats?.wear} onChange={e => setForm({ ...form, used_stats: { ...form.used_stats, wear: e.target.value } })}>
                {['Как новый','Отличное','Хорошее','Удовлетворительное'].map(o => <option key={o}>{o}</option>)}
              </select>
              <input type="number" placeholder="Батарея %" className={inputCls} value={form.used_stats?.battery} onChange={e => setForm({ ...form, used_stats: { ...form.used_stats, battery: Number(e.target.value) } })} />
            </div>
            <label className="flex items-center gap-2 text-[13px] text-textMain cursor-pointer">
              <input type="checkbox" checked={form.used_stats?.has_box} onChange={e => setForm({ ...form, used_stats: { ...form.used_stats, has_box: e.target.checked } })} className="w-4 h-4 accent-brandAccent" />
              Есть коробка
            </label>
            <input className={inputCls} placeholder="Дефекты (если есть)" value={form.used_stats?.defects || ''} onChange={e => setForm({ ...form, used_stats: { ...form.used_stats, defects: e.target.value } })} />
          </div>
        )}

        {/* Опции и фото */}
        <div className="flex flex-col gap-3 bg-bgCard p-5 rounded-2xl border border-borderBright">
          <h3 className="font-medium text-[13px] text-textMain">Опции и фотографии</h3>
          <p className="text-[11px] text-textFaint">Нажми на иконку фото, чтобы загрузить изображение — оно сожмётся автоматически.</p>
          {(form.variants || []).map((v, i) => (
            <div key={i} className="flex gap-3 items-start bg-bgMain p-3 rounded-xl border border-borderColor relative">
              <button onClick={() => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 text-brandAccent"><X size={13} /></button>
              <div className="relative w-14 h-14 bg-imgBg border border-borderBright rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-brandMutedBorder shrink-0">
                {v.thumb ? <img src={v.thumb} className="w-full h-full object-contain" alt="preview" /> : <ImageIcon size={16} className="text-textFaint" />}
                <input type="file" accept="image/*" onChange={e => e.target.files[0] && handlePhotoUpload(e.target.files[0], i)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex gap-2">
                  <input placeholder="Память" className="p-2 border border-borderBright rounded-lg bg-bgCard text-textMain text-[12px] w-1/2 outline-none focus:border-brandAccent" value={v.memory} onChange={e => updateVariant(i, 'memory', e.target.value)} />
                  <input placeholder="Цвет" className="p-2 border border-borderBright rounded-lg bg-bgCard text-textMain text-[12px] w-1/2 outline-none focus:border-brandAccent" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                </div>
                <input type="number" placeholder="Точная цена" className="p-2 border border-borderBright rounded-lg bg-bgCard text-brand font-bold text-[12px] w-full outline-none focus:border-brandAccent" value={v.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))} />
              </div>
            </div>
          ))}
          <button onClick={addVariant} className="bg-bgMain border border-dashed border-borderBright text-textFaint hover:text-brand hover:border-brandMutedBorder font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] transition-colors">
            <Plus size={15} /> Добавить опцию
          </button>
        </div>

        {/* Теги */}
        <div className="flex flex-col gap-3 bg-bgCard p-5 rounded-2xl border border-borderBright">
          <h3 className="font-medium text-[13px] text-textMain">Теги фильтра</h3>
          <div className="flex flex-wrap gap-2">
            {(form.tags || []).map(t => (
              <span key={t} className="bg-brandMuted border border-brandMutedBorder text-brand px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-1">
                {t} <X size={12} className="cursor-pointer hover:text-brandHover" onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })} />
              </span>
            ))}
          </div>
          <div className="relative">
            <div className="flex gap-2">
              <input className="p-3 rounded-xl bg-bgMain border border-borderBright text-textMain flex-1 text-[13px] outline-none focus:border-brandAccent" placeholder="Напр: apple..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTag(tagInput); }} />
              <button onClick={() => addTag(tagInput)} className="bg-brandAccent text-onBrand px-4 rounded-xl font-bold text-[15px] hover:bg-brandHover transition-colors">+</button>
            </div>
            {tagInput && tagSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-bgCard border border-borderBright shadow-lg rounded-xl mt-1 p-2 z-10 flex flex-wrap gap-2">
                {tagSuggestions.map(t => (
                  <button key={t} onClick={() => { addTag(t); setTagInput(''); }} className="bg-bgElevated border border-borderBright text-textMain px-3 py-1 rounded-lg text-[12px] hover:border-brandMutedBorder transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Фиксированная кнопка сохранить */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bgGlass backdrop-blur-md border-t border-borderColor">
        <button
          onClick={() => { if (!form.name || !form.base_price) return alert('Введите название и цену'); onSave(form); }}
          className="w-full max-w-lg mx-auto bg-brandAccent hover:bg-brandHover text-onBrand py-4 rounded-2xl font-semibold text-[15px] shadow-lg flex justify-center items-center gap-2 transition-colors block">
          <Check size={20} /> Сохранить товар
        </button>
      </div>
    </div>
  );
}
