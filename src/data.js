import { Smartphone, Laptop, Headphones, Watch, Tv, Tablet, BatteryCharging } from 'lucide-react';

export const initialProducts = [

  // ════════════════════════════════════════
  // СМАРТФОНЫ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 's1', type: 'new', name: "Apple iPhone 16 Pro Max", brand: "Apple", category: "smartphones", base_price: 680000,
    tags: ["apple","iphone","айфон","pro"],
    features: { tradeIn: true, installment: true },
    description: "Флагман с titanium корпусом, чипом A18 Pro и камерой 48 Мп с 5× оптикой.",
    variants: [
      { memory: "256 GB", color: "Чёрный титан",     price: 680000, thumb: "/images/iphone16promax.jpg", full: "/images/iphone16promax.jpg" },
      { memory: "256 GB", color: "Натуральный титан", price: 680000, thumb: "/images/iphone16promax.jpg", full: "/images/iphone16promax.jpg" },
      { memory: "512 GB", color: "Белый титан",       price: 780000, thumb: "/images/iphone16promax.jpg", full: "/images/iphone16promax.jpg" },
      { memory: "1 TB",   color: "Пустынный титан",   price: 900000, thumb: "/images/iphone16promax.jpg", full: "/images/iphone16promax.jpg" },
    ]
  },
  {
    id: 's2', type: 'new', name: "Apple iPhone 16 Pro", brand: "Apple", category: "smartphones", base_price: 570000,
    tags: ["apple","iphone","айфон","pro"],
    features: { tradeIn: true, installment: true },
    description: "Titanium корпус, A18 Pro, Action Button, Camera Control, USB-C 3.",
    variants: [
      { memory: "128 GB", color: "Чёрный титан",     price: 570000, thumb: "/images/iphone16pro.jpg", full: "/images/iphone16pro.jpg" },
      { memory: "256 GB", color: "Белый титан",       price: 650000, thumb: "/images/iphone16pro.jpg", full: "/images/iphone16pro.jpg" },
      { memory: "512 GB", color: "Пустынный титан",   price: 760000, thumb: "/images/iphone16pro.jpg", full: "/images/iphone16pro.jpg" },
    ]
  },
  {
    id: 's3', type: 'new', name: "Apple iPhone 16", brand: "Apple", category: "smartphones", base_price: 440000,
    tags: ["apple","iphone","айфон"],
    features: { tradeIn: true, installment: true },
    description: "Чип A18, Dynamic Island, Camera Control, улучшенная двойная камера.",
    variants: [
      { memory: "128 GB", color: "Ультрамарин", price: 440000, thumb: "/images/iphone16.jpg", full: "/images/iphone16.jpg" },
      { memory: "128 GB", color: "Розовый",     price: 440000, thumb: "/images/iphone16.jpg", full: "/images/iphone16.jpg" },
      { memory: "256 GB", color: "Чёрный",      price: 510000, thumb: "/images/iphone16.jpg", full: "/images/iphone16.jpg" },
    ]
  },
  {
    id: 's4', type: 'new', name: "Apple iPhone 15 Pro", brand: "Apple", category: "smartphones", base_price: 490000,
    tags: ["apple","iphone","айфон","pro"],
    features: { tradeIn: true, installment: true },
    description: "Titanium, A17 Pro, ProRAW/ProRes видео, USB-C 3.",
    variants: [
      { memory: "128 GB", color: "Натуральный титан", price: 490000, thumb: "/images/iphone15pro.jpg", full: "/images/iphone15pro.jpg" },
      { memory: "256 GB", color: "Чёрный титан",      price: 560000, thumb: "/images/iphone15pro.jpg", full: "/images/iphone15pro.jpg" },
    ]
  },
  {
    id: 's5', type: 'new', name: "Apple iPhone 15", brand: "Apple", category: "smartphones", base_price: 360000,
    tags: ["apple","iphone","айфон"],
    features: { tradeIn: true, installment: true },
    description: "Dynamic Island, USB-C, 48 Мп основная камера, A16 Bionic.",
    variants: [
      { memory: "128 GB", color: "Розовый",  price: 360000, thumb: "/images/iphone15.jpg", full: "/images/iphone15.jpg" },
      { memory: "128 GB", color: "Жёлтый",   price: 360000, thumb: "/images/iphone15.jpg", full: "/images/iphone15.jpg" },
      { memory: "256 GB", color: "Чёрный",   price: 420000, thumb: "/images/iphone15.jpg", full: "/images/iphone15.jpg" },
    ]
  },
  {
    id: 's6', type: 'new', name: "Apple iPhone 14", brand: "Apple", category: "smartphones", base_price: 280000,
    tags: ["apple","iphone","айфон"],
    features: { tradeIn: true, installment: true },
    description: "A15 Bionic, аварийный вызов через спутник, eSIM.",
    variants: [
      { memory: "128 GB", color: "Полуночный", price: 280000, thumb: "/images/iphone14.jpg", full: "/images/iphone14.jpg" },
      { memory: "256 GB", color: "Синий",      price: 340000, thumb: "/images/iphone14.jpg", full: "/images/iphone14.jpg" },
    ]
  },
  {
    id: 's7', type: 'new', name: "Apple iPhone SE 3", brand: "Apple", category: "smartphones", base_price: 185000,
    tags: ["apple","iphone","айфон","se","бюджет"],
    features: { tradeIn: true, installment: false },
    description: "A15 Bionic, Touch ID, компактный 4.7″ дисплей.",
    variants: [
      { memory: "64 GB",  color: "Чёрный",  price: 185000, thumb: "/images/iphonese3.jpg", full: "/images/iphonese3.jpg" },
      { memory: "128 GB", color: "Красный", price: 215000, thumb: "/images/iphonese3.jpg", full: "/images/iphonese3.jpg" },
    ]
  },
  {
    id: 's8', type: 'new', name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "smartphones", base_price: 590000,
    tags: ["samsung","galaxy","android","pro","s24"],
    features: { tradeIn: true, installment: true },
    description: "S Pen, 200 Мп камера, Snapdragon 8 Gen 3, Galaxy AI.",
    variants: [
      { memory: "256 GB", color: "Titanium Black", price: 590000, thumb: "/images/s24ultra.jpg", full: "/images/s24ultra.jpg" },
      { memory: "512 GB", color: "Titanium Gray",  price: 690000, thumb: "/images/s24ultra.jpg", full: "/images/s24ultra.jpg" },
    ]
  },
  {
    id: 's9', type: 'new', name: "Samsung Galaxy S24+", brand: "Samsung", category: "smartphones", base_price: 455000,
    tags: ["samsung","galaxy","android","s24"],
    features: { tradeIn: true, installment: true },
    description: "6.7″ Dynamic AMOLED, Snapdragon 8 Gen 3, 50+10+12 Мп.",
    variants: [
      { memory: "256 GB", color: "Cobalt Violet", price: 455000, thumb: "/images/s24plus.jpg", full: "/images/s24plus.jpg" },
      { memory: "512 GB", color: "Marble Gray",   price: 540000, thumb: "/images/s24plus.jpg", full: "/images/s24plus.jpg" },
    ]
  },
  {
    id: 's10', type: 'new', name: "Samsung Galaxy S24", brand: "Samsung", category: "smartphones", base_price: 335000,
    tags: ["samsung","galaxy","android","s24"],
    features: { tradeIn: true, installment: true },
    description: "Компактный флагман, 6.2″ AMOLED, Exynos 2400.",
    variants: [
      { memory: "128 GB", color: "Onyx Black", price: 335000, thumb: "/images/s24.jpg", full: "/images/s24.jpg" },
      { memory: "256 GB", color: "Marble Gray",price: 395000, thumb: "/images/s24.jpg", full: "/images/s24.jpg" },
    ]
  },
  {
    id: 's11', type: 'new', name: "Samsung Galaxy A55", brand: "Samsung", category: "smartphones", base_price: 168000,
    tags: ["samsung","galaxy","android","средний"],
    features: { tradeIn: false, installment: true },
    description: "50 Мп камера, 120 Гц Super AMOLED, IP67.",
    variants: [
      { memory: "128 GB", color: "Awesome Navy",    price: 168000, thumb: "/images/a55.jpg", full: "/images/a55.jpg" },
      { memory: "256 GB", color: "Awesome Iceblue", price: 200000, thumb: "/images/a55.jpg", full: "/images/a55.jpg" },
    ]
  },
  {
    id: 's12', type: 'new', name: "Samsung Galaxy A35", brand: "Samsung", category: "smartphones", base_price: 128000,
    tags: ["samsung","galaxy","android","бюджет"],
    features: { tradeIn: false, installment: true },
    description: "50 Мп + OIS, 6.6″ AMOLED, 5000 мАч.",
    variants: [
      { memory: "128 GB", color: "Awesome Navy",    price: 128000, thumb: "/images/a35.jpg", full: "/images/a35.jpg" },
      { memory: "256 GB", color: "Awesome Lilac",   price: 155000, thumb: "/images/a35.jpg", full: "/images/a35.jpg" },
    ]
  },
  {
    id: 's13', type: 'new', name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "smartphones", base_price: 530000,
    tags: ["xiaomi","android","leica","про"],
    features: { tradeIn: true, installment: true },
    description: "Leica 1\" сенсор, Snapdragon 8 Gen 3, 90W зарядка.",
    variants: [
      { memory: "256 GB", color: "Чёрный", price: 530000, thumb: "/images/xiaomi14ultra.jpg", full: "/images/xiaomi14ultra.jpg" },
      { memory: "512 GB", color: "Белый",  price: 620000, thumb: "/images/xiaomi14ultra.jpg", full: "/images/xiaomi14ultra.jpg" },
    ]
  },
  {
    id: 's14', type: 'new', name: "Xiaomi 14", brand: "Xiaomi", category: "smartphones", base_price: 305000,
    tags: ["xiaomi","android","leica"],
    features: { tradeIn: true, installment: true },
    description: "Компактный флагман Leica, Snapdragon 8 Gen 3, 67W.",
    variants: [
      { memory: "256 GB", color: "Чёрный", price: 305000, thumb: "/images/xiaomi14.jpg", full: "/images/xiaomi14.jpg" },
      { memory: "512 GB", color: "Белый",  price: 365000, thumb: "/images/xiaomi14.jpg", full: "/images/xiaomi14.jpg" },
    ]
  },

  // ════════════════════════════════════════
  // НОУТБУКИ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 'l1', type: 'new', name: "MacBook Air 15\" M3", brand: "Apple", category: "laptops", base_price: 585000,
    tags: ["apple","macbook","макбук","m3","ноутбук"],
    features: { tradeIn: true, installment: true },
    description: "Тончайший 15″ ноутбук: M3, до 18 ч работы, дисплей Liquid Retina.",
    variants: [
      { memory: "256 GB", color: "Space Gray", price: 585000, thumb: "/images/macbookairm3_15.jpg", full: "/images/macbookairm3_15.jpg" },
      { memory: "512 GB", color: "Midnight",   price: 695000, thumb: "/images/macbookairm3_15.jpg", full: "/images/macbookairm3_15.jpg" },
      { memory: "1 TB",   color: "Starlight",  price: 815000, thumb: "/images/macbookairm3_15.jpg", full: "/images/macbookairm3_15.jpg" },
    ]
  },
  {
    id: 'l2', type: 'new', name: "MacBook Air 13\" M3", brand: "Apple", category: "laptops", base_price: 475000,
    tags: ["apple","macbook","макбук","m3","ноутбук"],
    features: { tradeIn: true, installment: true },
    description: "1.24 кг, M3 с нейронным процессором, Wi-Fi 6E.",
    variants: [
      { memory: "256 GB", color: "Midnight",  price: 475000, thumb: "/images/macbookairm3_13.jpg", full: "/images/macbookairm3_13.jpg" },
      { memory: "512 GB", color: "Starlight", price: 585000, thumb: "/images/macbookairm3_13.jpg", full: "/images/macbookairm3_13.jpg" },
    ]
  },
  {
    id: 'l3', type: 'new', name: "MacBook Pro 14\" M3", brand: "Apple", category: "laptops", base_price: 755000,
    tags: ["apple","macbook","макбук","pro","m3","ноутбук"],
    features: { tradeIn: true, installment: true },
    description: "ProMotion 120 Гц, M3, до 22 ч работы, порты Thunderbolt 4.",
    variants: [
      { memory: "512 GB", color: "Space Black", price: 755000, thumb: "/images/macbookprom3.jpg", full: "/images/macbookprom3.jpg" },
      { memory: "1 TB",   color: "Silver",      price: 885000, thumb: "/images/macbookprom3.jpg", full: "/images/macbookprom3.jpg" },
    ]
  },

  // ════════════════════════════════════════
  // ПЛАНШЕТЫ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 't1', type: 'new', name: "iPad Pro 11\" M4", brand: "Apple", category: "tablets", base_price: 488000,
    tags: ["apple","ipad","планшет","pro","m4"],
    features: { tradeIn: true, installment: true },
    description: "Ultra Retina XDR OLED, M4, ультратонкий 5.3 мм, Apple Pencil Pro.",
    variants: [
      { memory: "256 GB", color: "Space Black", price: 488000, thumb: "/images/ipadprom4.jpg", full: "/images/ipadprom4.jpg" },
      { memory: "512 GB", color: "Silver",      price: 598000, thumb: "/images/ipadprom4.jpg", full: "/images/ipadprom4.jpg" },
    ]
  },
  {
    id: 't2', type: 'new', name: "iPad Air 11\" M2", brand: "Apple", category: "tablets", base_price: 318000,
    tags: ["apple","ipad","планшет","m2"],
    features: { tradeIn: true, installment: true },
    description: "Liquid Retina, M2, Apple Pencil Pro, Wi-Fi 6E.",
    variants: [
      { memory: "128 GB", color: "Синий",       price: 318000, thumb: "/images/ipadairm2.jpg", full: "/images/ipadairm2.jpg" },
      { memory: "256 GB", color: "Space Gray",  price: 388000, thumb: "/images/ipadairm2.jpg", full: "/images/ipadairm2.jpg" },
    ]
  },
  {
    id: 't3', type: 'new', name: "iPad mini 7", brand: "Apple", category: "tablets", base_price: 272000,
    tags: ["apple","ipad","планшет","mini"],
    features: { tradeIn: true, installment: true },
    description: "8.3″ Liquid Retina, A17 Pro, Apple Pencil Pro.",
    variants: [
      { memory: "128 GB", color: "Space Gray", price: 272000, thumb: "/images/ipadmini7.jpg", full: "/images/ipadmini7.jpg" },
      { memory: "256 GB", color: "Starlight",  price: 328000, thumb: "/images/ipadmini7.jpg", full: "/images/ipadmini7.jpg" },
    ]
  },

  // ════════════════════════════════════════
  // НАУШНИКИ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 'a1', type: 'new', name: "AirPods Pro 2nd Gen", brand: "Apple", category: "audio", base_price: 113000,
    tags: ["apple","airpods","наушники","tws","anc"],
    features: { tradeIn: false, installment: true },
    description: "Adaptive ANC, Transparency, персональный звук, USB-C зарядка.",
    variants: [{ memory: "—", color: "Белый", price: 113000, thumb: "/images/airpodspro2.jpg", full: "/images/airpodspro2.jpg" }]
  },
  {
    id: 'a2', type: 'new', name: "AirPods 4", brand: "Apple", category: "audio", base_price: 76000,
    tags: ["apple","airpods","наушники","tws"],
    features: { tradeIn: false, installment: false },
    description: "Новый дизайн H2, персональный Spatial Audio, USB-C.",
    variants: [{ memory: "—", color: "Белый", price: 76000, thumb: "/images/airpods4.jpg", full: "/images/airpods4.jpg" }]
  },
  {
    id: 'a3', type: 'new', name: "Sony WH-1000XM5", brand: "Sony", category: "audio", base_price: 103000,
    tags: ["sony","наушники","anc","накладные"],
    features: { tradeIn: false, installment: true },
    description: "Лучшее ANC в классе, 30 ч работы, 8 микрофонов.",
    variants: [
      { memory: "—", color: "Чёрный",     price: 103000, thumb: "/images/sonywh1000xm5.jpg", full: "/images/sonywh1000xm5.jpg" },
      { memory: "—", color: "Серебристый",price: 103000, thumb: "/images/sonywh1000xm5.jpg", full: "/images/sonywh1000xm5.jpg" },
    ]
  },
  {
    id: 'a4', type: 'new', name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "audio", base_price: 66000,
    tags: ["samsung","наушники","tws","anc"],
    features: { tradeIn: false, installment: false },
    description: "HiFi 24bit, Adaptive ANC, форм-фактор вкладыши.",
    variants: [
      { memory: "—", color: "Серебристый", price: 66000, thumb: "/images/galaxybuds3pro.jpg", full: "/images/galaxybuds3pro.jpg" },
      { memory: "—", color: "Белый",       price: 66000, thumb: "/images/galaxybuds3pro.jpg", full: "/images/galaxybuds3pro.jpg" },
    ]
  },

  // ════════════════════════════════════════
  // ЧАСЫ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 'w1', type: 'new', name: "Apple Watch Series 10 GPS", brand: "Apple", category: "watches", base_price: 152000,
    tags: ["apple","watch","часы","series10"],
    features: { tradeIn: false, installment: true },
    description: "Самые тонкие Apple Watch, 46 мм, обнаружение апноэ сна, S10 SiP.",
    variants: [
      { memory: "46 мм", color: "Jet Black",  price: 152000, thumb: "/images/watchs10.jpg", full: "/images/watchs10.jpg" },
      { memory: "42 мм", color: "Rose Gold",  price: 142000, thumb: "/images/watchs10.jpg", full: "/images/watchs10.jpg" },
    ]
  },
  {
    id: 'w2', type: 'new', name: "Apple Watch Ultra 2", brand: "Apple", category: "watches", base_price: 282000,
    tags: ["apple","watch","часы","ultra"],
    features: { tradeIn: false, installment: true },
    description: "Titanium 49 мм, 3000 нит, 60 ч автономности, Siren.",
    variants: [
      { memory: "49 мм", color: "Black Titanium",   price: 282000, thumb: "/images/watchultra2.jpg", full: "/images/watchultra2.jpg" },
      { memory: "49 мм", color: "Natural Titanium", price: 282000, thumb: "/images/watchultra2.jpg", full: "/images/watchultra2.jpg" },
    ]
  },
  {
    id: 'w3', type: 'new', name: "Apple Watch SE 2 GPS", brand: "Apple", category: "watches", base_price: 98000,
    tags: ["apple","watch","часы","se"],
    features: { tradeIn: false, installment: false },
    description: "Crash Detection, Fall Detection, мониторинг сна, S8 SiP.",
    variants: [
      { memory: "44 мм", color: "Midnight",  price: 98000, thumb: "/images/watchse2.jpg", full: "/images/watchse2.jpg" },
      { memory: "40 мм", color: "Starlight", price: 88000, thumb: "/images/watchse2.jpg", full: "/images/watchse2.jpg" },
    ]
  },
  {
    id: 'w4', type: 'new', name: "Samsung Galaxy Watch 7", brand: "Samsung", category: "watches", base_price: 112000,
    tags: ["samsung","watch","часы","android"],
    features: { tradeIn: false, installment: false },
    description: "Energy Score AI, BioActive, 3-дневный GPS, Android/iOS.",
    variants: [
      { memory: "44 мм", color: "Cream",  price: 112000, thumb: "/images/galaxywatch7.jpg", full: "/images/galaxywatch7.jpg" },
      { memory: "40 мм", color: "Green",  price: 102000, thumb: "/images/galaxywatch7.jpg", full: "/images/galaxywatch7.jpg" },
    ]
  },

  // ════════════════════════════════════════
  // ТВ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 'tv1', type: 'new', name: "Samsung Neo QLED 4K 55\"", brand: "Samsung", category: "tvs", base_price: 215000,
    tags: ["samsung","телевизор","4k","qled","smart"],
    features: { tradeIn: false, installment: true },
    description: "Quantum Matrix, 4K, Tizen Smart TV, 100 Гц.",
    variants: [{ memory: "55\"", color: "Чёрный", price: 215000, thumb: "/images/samsungneoqled.jpg", full: "/images/samsungneoqled.jpg" }]
  },
  {
    id: 'tv2', type: 'new', name: "Xiaomi TV A 55\" 4K", brand: "Xiaomi", category: "tvs", base_price: 128000,
    tags: ["xiaomi","телевизор","4k","android","smart"],
    features: { tradeIn: false, installment: true },
    description: "144 Гц, Dolby Vision, Google Assistant, Android TV.",
    variants: [{ memory: "55\"", color: "Чёрный", price: 128000, thumb: "/images/xiaomitv.jpg", full: "/images/xiaomitv.jpg" }]
  },

  // ════════════════════════════════════════
  // АКСЕССУАРЫ — НОВЫЕ
  // ════════════════════════════════════════
  {
    id: 'acc1', type: 'new', name: "Apple MagSafe Charger 25W", brand: "Apple", category: "accessories", base_price: 22000,
    tags: ["apple","magsafe","зарядка","аксессуар"],
    features: { tradeIn: false, installment: false },
    description: "Быстрая магнитная зарядка 25W для iPhone 12–16.",
    variants: [{ memory: "—", color: "Белый", price: 22000, thumb: "/images/magsafe.jpg", full: "/images/magsafe.jpg" }]
  },
  {
    id: 'acc2', type: 'new', name: "Apple Pencil Pro", brand: "Apple", category: "accessories", base_price: 59000,
    tags: ["apple","pencil","стилус","ipad"],
    features: { tradeIn: false, installment: false },
    description: "Hover, Find My, анимированные реакции, тактильная отдача.",
    variants: [{ memory: "—", color: "Белый", price: 59000, thumb: "/images/pencilpro.jpg", full: "/images/pencilpro.jpg" }]
  },

  // ════════════════════════════════════════
  // Б/У ТЕХНИКА
  // ════════════════════════════════════════
  {
    id: 'u1', type: 'used', name: "iPhone 14 Pro 256 GB", brand: "Apple", category: "smartphones", base_price: 355000,
    tags: ["apple","iphone","бу"],
    features: { tradeIn: false, installment: false },
    description: "Dynamic Island, 48 Мп камера, A16 Bionic.",
    used_stats: { wear: "Отличное", battery: 91, has_box: true, defects: "Без дефектов" },
    variants: [{ memory: "256 GB", color: "Deep Purple", price: 355000, thumb: "/images/iphone14.jpg", full: "/images/iphone14.jpg" }]
  },
  {
    id: 'u2', type: 'used', name: "iPhone 13 Pro 256 GB", brand: "Apple", category: "smartphones", base_price: 275000,
    tags: ["apple","iphone","бу"],
    features: { tradeIn: false, installment: false },
    description: "ProMotion 120 Гц, тройная камера, Face ID.",
    used_stats: { wear: "Хорошее", battery: 84, has_box: false, defects: "Мелкие царапины на боковой поверхности" },
    variants: [{ memory: "256 GB", color: "Sierra Blue", price: 275000, thumb: "/images/iphone15pro.jpg", full: "/images/iphone15pro.jpg" }]
  },
  {
    id: 'u3', type: 'used', name: "iPhone 13 128 GB", brand: "Apple", category: "smartphones", base_price: 208000,
    tags: ["apple","iphone","бу"],
    features: { tradeIn: false, installment: false },
    description: "A15 Bionic, Face ID, ночная съёмка.",
    used_stats: { wear: "Хорошее", battery: 88, has_box: true, defects: "Без дефектов" },
    variants: [{ memory: "128 GB", color: "Midnight", price: 208000, thumb: "/images/iphone15.jpg", full: "/images/iphone15.jpg" }]
  },
  {
    id: 'u4', type: 'used', name: "Samsung Galaxy S23 Ultra 256 GB", brand: "Samsung", category: "smartphones", base_price: 368000,
    tags: ["samsung","galaxy","бу"],
    features: { tradeIn: false, installment: false },
    description: "S Pen, 200 Мп, 8K видео, 5000 мАч.",
    used_stats: { wear: "Отличное", battery: 93, has_box: true, defects: "Без дефектов" },
    variants: [{ memory: "256 GB", color: "Phantom Black", price: 368000, thumb: "/images/s24ultra.jpg", full: "/images/s24ultra.jpg" }]
  },
  {
    id: 'u5', type: 'used', name: "MacBook Air M1 256 GB", brand: "Apple", category: "laptops", base_price: 285000,
    tags: ["apple","macbook","бу","m1"],
    features: { tradeIn: false, installment: false },
    description: "Первый M1, тихий и быстрый, до 18 ч работы.",
    used_stats: { wear: "Хорошее", battery: 87, has_box: false, defects: "Незначительные следы использования на корпусе" },
    variants: [{ memory: "256 GB", color: "Space Gray", price: 285000, thumb: "/images/macbookairm3_13.jpg", full: "/images/macbookairm3_13.jpg" }]
  },
  {
    id: 'u6', type: 'used', name: "iPad Pro 11\" 2022 128 GB", brand: "Apple", category: "tablets", base_price: 268000,
    tags: ["apple","ipad","бу"],
    features: { tradeIn: false, installment: false },
    description: "M2, ProMotion 120 Гц, Face ID, USB-C Thunderbolt.",
    used_stats: { wear: "Отличное", battery: 95, has_box: true, defects: "Без дефектов" },
    variants: [{ memory: "128 GB", color: "Space Gray", price: 268000, thumb: "/images/ipadprom4.jpg", full: "/images/ipadprom4.jpg" }]
  },
  {
    id: 'u7', type: 'used', name: "AirPods Pro 1st Gen", brand: "Apple", category: "audio", base_price: 50000,
    tags: ["apple","airpods","бу","наушники"],
    features: { tradeIn: false, installment: false },
    description: "ANC, Transparency, беспроводная зарядка MagSafe.",
    used_stats: { wear: "Хорошее", battery: 82, has_box: false, defects: "Лёгкий износ чехла" },
    variants: [{ memory: "—", color: "Белый", price: 50000, thumb: "/images/airpodspro2.jpg", full: "/images/airpodspro2.jpg" }]
  },
  {
    id: 'u8', type: 'used', name: "Samsung Galaxy S22+ 256 GB", brand: "Samsung", category: "smartphones", base_price: 192000,
    tags: ["samsung","galaxy","бу"],
    features: { tradeIn: false, installment: false },
    description: "Snapdragon 8 Gen 1, 50 Мп + OIS, 120 Гц AMOLED.",
    used_stats: { wear: "Хорошее", battery: 84, has_box: true, defects: "Без дефектов" },
    variants: [{ memory: "256 GB", color: "Phantom White", price: 192000, thumb: "/images/s24plus.jpg", full: "/images/s24plus.jpg" }]
  },
  {
    id: 'u9', type: 'used', name: "Apple Watch S8 GPS 45 мм", brand: "Apple", category: "watches", base_price: 90000,
    tags: ["apple","watch","бу","часы"],
    features: { tradeIn: false, installment: false },
    description: "Crash Detection, Always-On, температура тела.",
    used_stats: { wear: "Отличное", battery: 89, has_box: false, defects: "Без дефектов" },
    variants: [{ memory: "45 мм", color: "Midnight", price: 90000, thumb: "/images/watchs10.jpg", full: "/images/watchs10.jpg" }]
  },
  {
    id: 'u10', type: 'used', name: "iPad Air 4 64 GB", brand: "Apple", category: "tablets", base_price: 155000,
    tags: ["apple","ipad","бу"],
    features: { tradeIn: false, installment: false },
    description: "A14 Bionic, Touch ID, USB-C, поддержка Pencil 2.",
    used_stats: { wear: "Хорошее", battery: 86, has_box: true, defects: "Мелкие царапины на экране (не заметны при использовании)" },
    variants: [{ memory: "64 GB", color: "Sky Blue", price: 155000, thumb: "/images/ipadairm2.jpg", full: "/images/ipadairm2.jpg" }]
  },
];

export const categoriesData = [
  { id: 'smartphones', name: 'Смартфоны',  icon: Smartphone,    order: 1 },
  { id: 'laptops',     name: 'Ноутбуки',   icon: Laptop,        order: 2 },
  { id: 'tablets',     name: 'Планшеты',   icon: Tablet,        order: 3 },
  { id: 'audio',       name: 'Наушники',   icon: Headphones,    order: 4 },
  { id: 'watches',     name: 'Часы',       icon: Watch,         order: 5 },
  { id: 'tvs',         name: 'ТВ',         icon: Tv,            order: 6 },
  { id: 'accessories', name: 'Аксессуары', icon: BatteryCharging, order: 7 },
];
