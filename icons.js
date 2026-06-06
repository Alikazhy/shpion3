/**
 * ШПИОН — icons.js
 * Детализированные SVG-иконки в стиле Apple SF Symbols
 */
'use strict';

const ICON_PATHS = {
  spy: [
    'M12 2C8.5 2 6 4.2 6 7.5c0 2.1 1 3.9 2.5 5.1V22h7v-9.4C17 10.4 18 8.6 18 7.5 18 4.2 15.5 2 12 2z',
    'M9.5 7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z',
    'M8 14.5h8M10 17h4',
    'M4 10l2 1M20 10l-2 1M4 14l2-1M20 14l-2-1'
  ],
  person: [
    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M4 22v-1.5c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5V22'
  ],
  people: [
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M3 20v-1c0-2.8 2.7-4.5 6-4.5',
    'M15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M13 20v-1c0-1.5 1.2-2.8 3-3.5',
    'M21 20v-1c0-2.2-2-3.8-4.5-4.2'
  ],
  lightbulb: [
    'M9 18h6M10 22h4',
    'M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z',
    'M12 6v4M9.5 8.5h5'
  ],
  repeat: [
    'M17 2v4h4M7 22v-4H3',
    'M20.5 8A8 8 0 0 0 5.6 6.5M3.5 16A8 8 0 0 0 18.4 17.5'
  ],
  eyeSlash: [
    'M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8',
    'M9.9 5.1A10.5 10.5 0 0 1 12 5c5.5 0 9.5 4.5 10.5 7-0.4 1-1.2 2.3-2.3 3.6',
    'M6.1 6.1C4.2 7.4 2.8 9.2 2 11c1 2.5 5 7 10 7 1.1 0 2.1-.2 3.1-.5'
  ],
  speaker: [
    'M11 5L6 9H3v6h3l5 4V5z',
    'M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12'
  ],
  vibration: [
    'M7 4v16M11 7v10M15 4v16M19 7v10'
  ],
  timer: [
    'M12 8v5l3 2',
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M12 2v2M4.2 4.2l1.4 1.4M2 12h2'
  ],
  folder: [
    'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
    'M3 9h18'
  ],
  star: [
    'M12 2l2.9 6.9L22 10.2l-5.2 4.5L18.2 22 12 18.2 5.8 22l1.4-7.3L2 10.2l7.1-1.3L12 2z'
  ],
  download: [
    'M12 3v12M7 10l5 5 5-5',
    'M5 21h14'
  ],
  phone: [
    'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
    'M10 19h4'
  ],
  handshake: [
    'M4 12l3-2 3 2 4-3 4 3 2-2',
    'M4 12v4l3 2M20 12v4l-3 2M7 14l2 2M17 14l-2 2'
  ],
  rocket: [
    'M12 2c-2 4-2 8 0 12 2-1 4-3 5-6-3-1-5-3-5-6z',
    'M9 16l-2 4 3-1 2-3M15 16l2 4-3-1-2-3',
    'M12 14v4'
  ],
  pause: [
    'M8 6h3v12H8zM13 6h3v12h-3z'
  ],
  play: [
    'M8 5v14l11-7L8 5z'
  ],
  arrowClockwise: [
    'M20 12a8 8 0 1 1-2.3-5.7',
    'M20 4v6h-6'
  ],
  flag: [
    'M5 3v18M5 4h12l-3 4 3 4H5'
  ],
  house: [
    'M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z'
  ],
  eye: [
    'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
  ],
  checkmark: [
    'M5 12l4 4L19 6'
  ],
  xmark: [
    'M6 6l12 12M18 6L6 18'
  ],
  party: [
    'M4 20l4-12 4 4 8-8',
    'M18 4l2 2M20 8l2-1M16 6l1-2'
  ],
  warning: [
    'M12 3L2 21h20L12 3z',
    'M12 10v4M12 18h.01'
  ],
  gamepad: [
    'M6 12h4M8 10v4',
    'M15 11h.01M18 13h.01',
    'M6 8h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z'
  ],
  chevronLeft: [
    'M15 6l-6 6 6 6'
  ],
  chevronRight: [
    'M9 6l6 6-6 6'
  ],
  chart: [
    'M4 20V10M10 20V4M16 20v-8M22 20H2'
  ],
  book: [
    'M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z',
    'M7 4v16'
  ],
  shield: [
    'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z',
    'M9 12l2 2 4-4'
  ],
  info: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M12 10v6M12 7h.01'
  ],
  magnifyingglass: [
    'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
    'M16.5 16.5L21 21'
  ],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  trash: [
    'M4 7h16M9 7V5h6v2M7 7l1 14h8l1-14'
  ],
  /* Category icons */
  catHome: [
    'M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z',
    'M9 12h6'
  ],
  catText: [
    'M5 6h14M5 12h10M5 18h14',
    'M18 6v12'
  ],
  catSport: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M4 12h16M12 4a15 15 0 0 1 0 16M12 4a15 15 0 0 0 0 16'
  ],
  catMap: [
    'M4 6l6-2 6 2 4-1v15l-6 2-6-2-6 2V5l2-.5z',
    'M10 4v15M16 6v15'
  ],
  catFood: [
    'M12 3C8 3 5 6 5 10c0 4 3 7 7 11 4-4 7-7 7-11 0-4-3-7-7-7z',
    'M8 10h8M10 7h4'
  ],
  catBriefcase: [
    'M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z',
    'M8 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M3 13h18'
  ],
  catLaptop: [
    'M4 6h16v10H4z',
    'M2 18h20',
    'M10 10h4'
  ],
  catBooks: [
    'M5 4h8v16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    'M11 4h8v16h-8',
    'M7 8h2M15 8h2'
  ],
  catFilm: [
    'M4 5h16v14H4z',
    'M4 9h16M4 15h16M8 5v14M16 5v14'
  ],
  catPaw: [
    'M8.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM15.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    'M6 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    'M12 14c-3 0-5 2-5 4.5V22h10v-3.5c0-2.5-2-4.5-5-4.5z'
  ],
  catCar: [
    'M4 14l2-6h12l2 6',
    'M3 14h18v5H3z',
    'M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    'M6 11h12'
  ],
  catLeaf: [
    'M12 22C6 16 4 10 6 4c6 2 10 6 12 12-6 2-10 4-6 6z',
    'M12 22V10'
  ],
  catGlobe: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20'
  ],
  catMusic: [
    'M9 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'M11 16V6l8-2v10'
  ],
  catTelescope: [
    'M3 21l4-4',
    'M14 6l4 10-4 2-6-8 6-4z',
    'M18 4l2 2'
  ],
  catDice: [
    'M5 5h14v14H5z',
    'M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01'
  ],
  catParty: [
    'M4 20l5-14 3 3 8-6',
    'M18 4l2 2M21 7l-2 1'
  ],
  catHospital: [
    'M4 6h16v14H4z',
    'M12 9v6M9 12h6'
  ],
  catPlane: [
    'M2 12h6l8-6v4l6-2-2 6h4l-8 6v-4l-6 2 2-6H2z'
  ]
};

const CATEGORY_ICON_MAP = {
  'Повседневная жизнь': 'catHome',
  'Базовые слова': 'catText',
  'Спорт': 'catSport',
  'Местность': 'catMap',
  'Еда': 'catFood',
  'Профессии': 'catBriefcase',
  'Технологии': 'catLaptop',
  'Школа и учёба': 'catBooks',
  'Путешествия': 'catPlane',
  'Фильмы и развлечения': 'catFilm',
  'Животные': 'catPaw',
  'Транспорт': 'catCar',
  'Природа': 'catLeaf',
  'Города и страны': 'catGlobe',
  'Музыка': 'catMusic',
  'Наука и космос': 'catTelescope',
  'Игры и хобби': 'catDice',
  'Праздники': 'catParty',
  'Медицина': 'catHospital',
  'Мои слова': 'star'
};

const Icons = {
  render(name, options = {}) {
    const {
      size = 24,
      className = '',
      color = 'currentColor',
      strokeWidth = 1.75,
      filled = false
    } = typeof options === 'string' ? { className: options } : options;

    const paths = ICON_PATHS[name];
    if (!paths) return '';

    const fill = filled ? color : 'none';
    const stroke = filled ? 'none' : color;

    const pathEls = paths.map((d) =>
      `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('');

    return `<svg class="sf-icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${pathEls}</svg>`;
  },

  categoryIcon(categoryName) {
    const key = CATEGORY_ICON_MAP[categoryName] || 'folder';
    return this.render(key, { size: 20, className: 'cat-icon' });
  },

  categoryKey(categoryName) {
    return CATEGORY_ICON_MAP[categoryName] || 'folder';
  },

  insert(el, name, options = {}) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.innerHTML = this.render(name, options);
  },

  btnContent(name, label, options = {}) {
    return `${this.render(name, { size: 18, ...options })}<span>${label}</span>`;
  }
};

if (typeof window !== 'undefined') window.Icons = Icons;
