/**
 * ШПИОН — script.js
 * Улучшенная версия: иконки, анимации, экран загрузки, TikTok-категория
 */
'use strict';

// ─── TikTok category (встроена прямо в скрипт) ───────────────────────────────
const TIKTOK_CATEGORY = {
  'TikTok': {
    icon: 'tiktok',
    words: [
      { word: 'Skibidi Toilet', hint: 'Танцующая голова в унитазе' },
      { word: 'Brawl Stars', hint: 'Мобильная игра от Supercell' },
      { word: 'Roblox', hint: 'Платформа с миллионами мини-игр' },
      { word: 'Minecraft', hint: 'Игра про кубики и выживание' },
      { word: 'MrBeast', hint: 'Ютубер с огромными челленджами' },
      { word: 'CapCut', hint: 'Популярное приложение для монтажа' },
      { word: 'Sigma', hint: 'Интернет-мем про крутого одиночку' },
      { word: 'Rizz', hint: 'Способность очаровывать людей' },
      { word: 'NPC', hint: 'Персонаж, ведущий себя как робот' },
      { word: 'Ohio', hint: 'Мем про «странный» штат США' },
      { word: 'Giga Chad', hint: 'Идеальный альфа-мужчина из мема' },
      { word: 'Fortnite', hint: 'Королевская битва с танцами' },
      { word: 'Among Us', hint: 'Игра про предателя на корабле' },
      { word: 'BLACKPINK', hint: 'К-поп-группа с миллиардами просмотров' },
      { word: 'Charli D\'Amelio', hint: 'Самая популярная тиктокерша' },
      { word: 'POV', hint: 'Формат видео от первого лица' },
      { word: 'Duet', hint: 'Функция совместного видео в TikTok' },
      { word: 'Хайп', hint: 'Бурное обсуждение чего-то популярного' },
      { word: 'Trendsetter', hint: 'Тот, кто задаёт тренды' },
      { word: 'Transition', hint: 'Плавный монтажный переход в видео' },
      { word: 'Grimace Shake', hint: 'Мем с фиолетовым коктейлем McDonald\'s' },
      { word: 'Subway Surfers', hint: 'Бегалка по крышам метро' },
      { word: 'Only in Ohio', hint: 'Мем про невероятные события' },
      { word: 'Slay', hint: 'Выглядеть или сделать что-то отлично' },
      { word: 'Touch grass', hint: 'Совет выйти на улицу от интернета' },
      { word: 'Rent free', hint: 'Мысль, которую нельзя выбросить из головы' },
      { word: 'No cap', hint: 'Говорю серьёзно, без шуток' },
      { word: 'Bussin\'', hint: 'Очень вкусно или очень круто' },
      { word: 'Speedrun', hint: 'Пройти игру как можно быстрее' },
      { word: 'Sheesh', hint: 'Возглас восхищения или удивления' }
    ]
  }
};

// ─── State ────────────────────────────────────────────────────────────────────
const State = {
  settings: {
    players: 6,
    spies: 1,
    hints: false,
    timer: 0,
    categories: [],
    sound: true,
    vibration: true,
    noRepeat: true,
    autoHide: true,
    playerNames: false
  },
  game: {
    roles: [],
    currentPlayer: 0,
    word: '',
    spyHint: '',
    category: '',
    playerOrder: [],
    spyPlayers: [],
    firstPlayer: 0,
    usedWords: []
  },
  timer: { interval: null, remaining: 0, total: 0, running: false, paused: false },
  stats: { games: 0, wordsPlayed: 0, totalPlayers: 0, spyWins: 0, civilianWins: 0 },
  session: { usedWords: [] }
};

// ─── SVG-иконки шпиона (встроенные) ──────────────────────────────────────────
const SpySVG = {
  // Классический агент в шляпе-федоре с тёмными очками
  agent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <!-- Голова -->
    <ellipse cx="40" cy="38" rx="16" ry="18" stroke-width="2.5" fill="var(--spy-face,#1a1a2e)" stroke="var(--spy-stroke,#e0c97f)"/>
    <!-- Шляпа-федора -->
    <rect x="22" y="18" width="36" height="9" rx="2" stroke-width="2.5" fill="var(--spy-hat,#0d0d1a)" stroke="var(--spy-stroke,#e0c97f)"/>
    <ellipse cx="40" cy="18" rx="22" ry="4" stroke-width="2.5" fill="var(--spy-hat,#0d0d1a)" stroke="var(--spy-stroke,#e0c97f)"/>
    <!-- Очки -->
    <rect x="26" y="35" width="11" height="7" rx="3" stroke-width="2" fill="var(--spy-glass,#0a0a0a)" stroke="var(--spy-stroke,#e0c97f)"/>
    <rect x="43" y="35" width="11" height="7" rx="3" stroke-width="2" fill="var(--spy-glass,#0a0a0a)" stroke="var(--spy-stroke,#e0c97f)"/>
    <line x1="37" y1="38.5" x2="43" y2="38.5" stroke-width="2" stroke="var(--spy-stroke,#e0c97f)"/>
    <!-- Уши -->
    <ellipse cx="24" cy="38" rx="3" ry="4" stroke-width="2" fill="var(--spy-face,#1a1a2e)" stroke="var(--spy-stroke,#e0c97f)"/>
    <ellipse cx="56" cy="38" rx="3" ry="4" stroke-width="2" fill="var(--spy-face,#1a1a2e)" stroke="var(--spy-stroke,#e0c97f)"/>
    <!-- Рот (ухмылка) -->
    <path d="M34 50 Q40 55 46 50" stroke-width="2" stroke="var(--spy-stroke,#e0c97f)" fill="none"/>
    <!-- Пиджак -->
    <path d="M24 68 Q28 56 40 54 Q52 56 56 68" stroke-width="2.5" fill="var(--spy-suit,#0d0d1a)" stroke="var(--spy-stroke,#e0c97f)"/>
    <path d="M40 54 L37 62 L40 60 L43 62 L40 54" stroke-width="1.5" fill="var(--spy-stroke,#e0c97f)" stroke="var(--spy-stroke,#e0c97f)"/>
  </svg>`,

  // Маленькая иконка для кнопок и чипов
  small: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="10" rx="5" ry="5.5"/>
    <rect x="6" y="4" width="12" height="3" rx="1"/>
    <ellipse cx="12" cy="4" rx="7.5" ry="1.5"/>
    <rect x="8.5" y="10" width="3" height="2.2" rx="1.1" fill="currentColor"/>
    <rect x="12.5" y="10" width="3" height="2.2" rx="1.1" fill="currentColor"/>
    <line x1="11.5" y1="11" x2="12.5" y2="11" stroke-width="1.5"/>
    <path d="M7 20 Q9 16 12 15.5 Q15 16 17 20" fill="currentColor" stroke="none"/>
  </svg>`
};

// ─── Экран загрузки ───────────────────────────────────────────────────────────
const LoadingScreen = {
  show(targetScreen, onComplete) {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-inner">
          <div class="loading-spy-wrap">
            <div class="loading-spy-anim">${SpySVG.agent}</div>
            <div class="loading-radar">
              <div class="radar-ring r1"></div>
              <div class="radar-ring r2"></div>
              <div class="radar-ring r3"></div>
            </div>
          </div>
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p class="loading-label" id="loading-label">Подготовка миссии...</p>
        </div>`;
      document.body.appendChild(overlay);
    }

    const messages = [
      'Перетасовываем роли…',
      'Выбираем секретное слово…',
      'Инструктируем агентов…',
      'Миссия начинается!'
    ];
    let mi = 0;
    const label = overlay.querySelector('#loading-label');
    overlay.classList.remove('fade-out');
    overlay.classList.add('visible');

    const ticker = setInterval(() => {
      mi++;
      if (label && mi < messages.length) label.textContent = messages[mi];
    }, 400);

    setTimeout(() => {
      clearInterval(ticker);
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.classList.remove('visible', 'fade-out');
        if (onComplete) onComplete();
      }, 400);
    }, 1800);
  }
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = {
  init() {
    this.injectStyles();
    loadCustomCategories();
    this.initIcons();
    this.loadSettings();
    this.loadStats();
    this.loadSession();
    this.renderCategories();
    this.restoreSettingsUI();
    this.renderCustomWords();
    this.registerSW();
    this.initInstallPrompt();
    this.bindRoleHide();
    this.showScreen('screen-menu');
  },

  // ── Inject улучшенные стили ──────────────────────────────────────────────
  injectStyles() {
    if (document.getElementById('spy-enhanced-styles')) return;
    const style = document.createElement('style');
    style.id = 'spy-enhanced-styles';
    style.textContent = `
      /* ── Переменные ── */
      :root {
        --color-spy: #e0c97f;
        --color-spy-dim: rgba(224,201,127,0.15);
        --color-bg: #0d0d1a;
        --color-surface: #13132a;
        --color-surface2: #1a1a38;
        --color-text: #f0f0ff;
        --color-text-dim: rgba(240,240,255,0.55);
        --radius-card: 20px;
        --transition-screen: 0.38s cubic-bezier(0.4,0,0.2,1);
      }

      /* ── Переходы между экранами ── */
      .screen { transition: opacity var(--transition-screen), transform var(--transition-screen); }
      .screen:not(.active) { opacity: 0; transform: translateY(18px) scale(0.98); pointer-events: none; }
      .screen.active { opacity: 1; transform: translateY(0) scale(1); }
      .screen.exit { opacity: 0; transform: translateY(-18px) scale(0.98); }

      /* ── Экран загрузки ── */
      #loading-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: var(--color-bg);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none;
        transition: opacity 0.4s;
      }
      #loading-overlay.visible { opacity: 1; pointer-events: all; }
      #loading-overlay.fade-out { opacity: 0; }

      .loading-inner {
        display: flex; flex-direction: column; align-items: center; gap: 20px;
      }
      .loading-spy-wrap {
        position: relative; width: 120px; height: 120px;
        display: flex; align-items: center; justify-content: center;
      }
      .loading-spy-anim {
        width: 80px; height: 80px;
        color: var(--color-spy);
        --spy-face: #1a1a2e; --spy-hat: #0d0d1a; --spy-glass: #0a0a0a;
        --spy-suit: #0d0d1a; --spy-stroke: #e0c97f;
        animation: spyFloat 2.4s ease-in-out infinite;
        position: relative; z-index: 2;
      }
      @keyframes spyFloat {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .loading-radar {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
      }
      .radar-ring {
        position: absolute; border-radius: 50%; border: 1.5px solid var(--color-spy);
        opacity: 0; animation: radarPulse 2.4s ease-out infinite;
      }
      .radar-ring.r1 { width: 80px; height: 80px; animation-delay: 0s; }
      .radar-ring.r2 { width: 100px; height: 100px; animation-delay: 0.6s; }
      .radar-ring.r3 { width: 120px; height: 120px; animation-delay: 1.2s; }
      @keyframes radarPulse {
        0% { opacity: 0.9; transform: scale(0.6); }
        100% { opacity: 0; transform: scale(1); }
      }

      .loading-dots { display: flex; gap: 8px; }
      .loading-dots span {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--color-spy);
        animation: dotBounce 1.2s ease-in-out infinite;
      }
      .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
      .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes dotBounce {
        0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
      .loading-label {
        font-size: 15px; color: var(--color-text-dim);
        letter-spacing: 0.04em; text-align: center;
        min-height: 1.4em;
      }

      /* ── Карточка роли — шпион ── */
      #role-card.is-spy {
        background: linear-gradient(145deg, #0d0d1a 0%, #1a0a2e 60%, #0d0d1a 100%);
        border: 1.5px solid rgba(224,201,127,0.45);
        box-shadow: 0 0 40px rgba(224,201,127,0.12), inset 0 0 20px rgba(224,201,127,0.04);
        animation: cardRevealSpy 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
      }
      #role-card:not(.is-spy) {
        animation: cardReveal 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
      }
      @keyframes cardRevealSpy {
        from { transform: rotateY(90deg) scale(0.85); opacity: 0; }
        to   { transform: rotateY(0deg)  scale(1);    opacity: 1; }
      }
      @keyframes cardReveal {
        from { transform: scale(0.88) translateY(20px); opacity: 0; }
        to   { transform: scale(1)    translateY(0);    opacity: 1; }
      }

      /* ── SVG агент на карточке шпиона ── */
      .spy-agent-icon {
        width: 80px; height: 80px;
        color: var(--color-spy);
        --spy-face: #1a1a2e; --spy-hat: #0d0d1a; --spy-glass: #0a0a0a;
        --spy-suit: #0d0d1a; --spy-stroke: #e0c97f;
        filter: drop-shadow(0 0 12px rgba(224,201,127,0.4));
        animation: agentAppear 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
      }
      @keyframes agentAppear {
        from { transform: scale(0) rotate(-15deg); opacity: 0; }
        to   { transform: scale(1) rotate(0deg);   opacity: 1; }
      }

      /* ── Экран передачи устройства — стиль для .pass-text ── */
      .pass-text {
        font-size: 15px;
        color: var(--color-text-dim);
        text-align: center;
        line-height: 1.5;
        margin: 8px 0 0;
      }

      /* ── Анимация появления экранов ── */
      .screen-game-enter .game-info-grid > * {
        animation: slideInUp 0.4s both;
      }
      .screen-game-enter .game-info-grid > *:nth-child(1) { animation-delay: 0.05s; }
      .screen-game-enter .game-info-grid > *:nth-child(2) { animation-delay: 0.1s; }
      .screen-game-enter .game-info-grid > *:nth-child(3) { animation-delay: 0.15s; }
      .screen-game-enter .game-info-grid > *:nth-child(4) { animation-delay: 0.2s; }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Новая кнопка «Раскрыть роль» с эффектом ── */
      #btn-reveal-role {
        position: relative; overflow: hidden;
      }
      #btn-reveal-role::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
        transform: translateX(-100%);
        transition: transform 0.5s;
      }
      #btn-reveal-role:hover::after { transform: translateX(100%); }

      /* ── Результат — плавное появление ── */
      #screen-result.active .result-card {
        animation: resultReveal 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
      }
      @keyframes resultReveal {
        from { transform: scale(0.9) translateY(24px); opacity: 0; }
        to   { transform: scale(1)   translateY(0);    opacity: 1; }
      }

      /* ── TikTok иконка (упрощённый логотип) ── */
      .cat-chip-icon svg.tiktok-icon { color: #ff0050; }
    `;
    document.head.appendChild(style);
  },

  // ── Иконки ──────────────────────────────────────────────────────────────
  initIcons() {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.dataset.icon;
      const size = parseInt(el.dataset.size, 10) || 22;
      el.innerHTML = Icons.render(name, { size, className: el.className || '' });
    });

    Icons.insert('logo-icon', 'spy', { size: 80, strokeWidth: 1.5 });
    Icons.insert('about-logo', 'spy', { size: 56, strokeWidth: 1.5 });
    Icons.insert('pass-icon', 'phone', { size: 56 });
    Icons.insert('cover-icon', 'handshake', { size: 48 });
    Icons.insert('rule-tip-icon', 'lightbulb', { size: 24 });

    ['back-rules', 'back-settings', 'back-custom', 'back-stats', 'back-about'].forEach((id) => {
      Icons.insert(id, 'chevronLeft', { size: 20 });
    });

    const btnIcons = {
      'btn-custom-words': ['star', 'Свои слова'],
      'install-btn': ['download', 'Установить'],
      'btn-start-game': ['rocket', 'Начать игру'],
      'btn-hide-role': ['eyeSlash', 'Скрыть'],
      'btn-pause-timer': ['pause', 'Пауза'],
      'btn-restart-game': ['arrowClockwise', 'Новый раунд'],
      'btn-end-round': ['flag', 'Завершить раунд'],
      'btn-game-menu': ['house', 'Меню'],
      'btn-reveal-word': ['eye', 'Раскрыть слово (для ведущего)'],
      'btn-vote-civilian': ['checkmark', 'Мирные'],
      'btn-vote-spy': ['spy', 'Шпионы'],
      'btn-result-restart': ['arrowClockwise', 'Ещё раунд'],
      'btn-result-menu': ['house', 'В меню']
    };
    Object.entries(btnIcons).forEach(([id, [icon, label]]) => {
      const btn = document.getElementById(id);
      if (btn) btn.innerHTML = Icons.btnContent(icon, label);
    });

    // Патчим тексты существующих элементов без перезаписи HTML
    this.patchPassScreenTexts();
  },

  // ── Патчим тексты экрана передачи, не трогая структуру HTML ────────────
  patchPassScreenTexts() {
    // Текст внутри cover-screen: «Передай телефон» → красивее
    const coverText = document.querySelector('.cover-text');
    if (coverText) coverText.textContent = 'Передайте устройство следующему участнику';

    // Текст-подсказка в phase-pass
    const passText = document.querySelector('.pass-text');
    if (passText) passText.textContent = 'Передайте телефон следующему участнику и нажмите кнопку';
  },

  goToAbout() { this.showScreen('screen-about'); },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }
  },

  initInstallPrompt() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const hint = document.getElementById('install-hint');
      if (hint) hint.style.display = 'block';
    });
    document.getElementById('install-btn')?.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          document.getElementById('install-hint').style.display = 'none';
        });
      }
    });
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => {
      if (s.id === id) {
        s.classList.add('active');
        s.classList.remove('exit');
        // Добавляем класс анимации при входе
        void s.offsetWidth; // reflow
        s.classList.add('screen-entered');
        setTimeout(() => s.classList.remove('screen-entered'), 600);
      } else if (s.classList.contains('active')) {
        s.classList.add('exit');
        setTimeout(() => s.classList.remove('active', 'exit'), 400);
      }
    });
  },

  goToMenu() { this.stopTimer(); this.showScreen('screen-menu'); },
  goToSettings() { this.showScreen('screen-settings'); },
  goToRules() { this.showScreen('screen-rules'); },
  goToStats() { this.updateStatsUI(); this.showScreen('screen-stats'); },
  goToCustom() { this.renderCustomWords(); this.showScreen('screen-custom'); },

  bindRoleHide() {
    document.getElementById('btn-hide-role')?.addEventListener('click', () => this.hideRole());
  },

  // ── Категории: добавляем TikTok ──────────────────────────────────────────
  _getAllWithTikTok() {
    const all = getAllCategories();
    return Object.assign({}, all, TIKTOK_CATEGORY);
  },

  renderCategories(filter = '') {
    const grid = document.getElementById('categories-grid');
    const all = this._getAllWithTikTok();
    const q = filter.trim().toLowerCase();
    grid.innerHTML = '';

    Object.entries(all).forEach(([name, data]) => {
      if (q && !name.toLowerCase().includes(q)) return;
      const count = data.words?.length || 0;
      const chip = document.createElement('button');
      chip.className = 'cat-chip' + (State.settings.categories.includes(name) ? ' selected' : '');
      const iconKey = data.icon || 'folder';

      // TikTok — специальная иконка (нотка + видео)
      let iconHtml;
      if (name === 'TikTok') {
        iconHtml = `<span class="cat-chip-icon">${this._tiktokIconSVG(18)}</span>`;
      } else {
        iconHtml = `<span class="cat-chip-icon">${Icons.render(iconKey, { size: 18 })}</span>`;
      }

      chip.innerHTML = `${iconHtml}<span class="cat-chip-text">${name}</span><span class="cat-chip-count">${count}</span>`;
      chip.addEventListener('click', () => {
        const idx = State.settings.categories.indexOf(name);
        if (idx >= 0) {
          State.settings.categories.splice(idx, 1);
          chip.classList.remove('selected');
        } else {
          State.settings.categories.push(name);
          chip.classList.add('selected');
        }
        this.saveSettings();
        this.updateCategorySummary();
      });
      grid.appendChild(chip);
    });
    this.updateCategorySummary();
  },

  _tiktokIconSVG(size = 18) {
    // Упрощённый TikTok-логотип (нота с двумя кружками)
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="color:#ff0050">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.81 1.52V6.75a4.85 4.85 0 01-1.04-.06z"/>
    </svg>`;
  },

  filterCategories(value) {
    this.renderCategories(value);
  },

  updateCategorySummary() {
    const el = document.getElementById('categories-summary');
    if (!el) return;
    const all = this._getAllWithTikTok();
    let words = 0;
    State.settings.categories.forEach((c) => { words += all[c]?.words?.length || 0; });
    el.textContent = `${State.settings.categories.length} категорий · ${words} слов`;
  },

  selectAllCategories() {
    State.settings.categories = Object.keys(this._getAllWithTikTok());
    this.renderCategories(document.getElementById('cat-search')?.value || '');
    this.saveSettings();
  },

  clearCategories() {
    State.settings.categories = [];
    this.renderCategories(document.getElementById('cat-search')?.value || '');
    this.saveSettings();
  },

  changeCount(field, delta) {
    const limits = { players: { min: 3, max: 20 }, spies: { min: 1, max: 5 } };
    const lim = limits[field];
    let val = State.settings[field] + delta;
    val = Math.min(lim.max, Math.max(lim.min, val));
    if (field === 'spies') val = Math.min(val, State.settings.players - 1);
    if (field === 'players') State.settings.spies = Math.min(State.settings.spies, val - 1);
    State.settings[field] = val;
    document.getElementById('val-players').textContent = State.settings.players;
    document.getElementById('val-spies').textContent = State.settings.spies;
    this.saveSettings();
  },

  saveSettings() {
    const map = {
      hints: 'toggle-hints',
      sound: 'toggle-sound',
      vibration: 'toggle-vibration',
      noRepeat: 'toggle-no-repeat',
      autoHide: 'toggle-auto-hide',
      playerNames: 'toggle-player-names'
    };
    Object.entries(map).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) State.settings[key] = el.checked;
    });
    const timerEl = document.getElementById('select-timer');
    if (timerEl) State.settings.timer = parseInt(timerEl.value, 10) || 0;
    localStorage.setItem('spy_settings', JSON.stringify(State.settings));
  },

  migrateCategoryIcons() {
    const emojiToKey = { '⭐': 'star', '📁': 'folder' };
    Object.values(this._getAllWithTikTok()).forEach((cat) => {
      if (cat.icon && emojiToKey[cat.icon]) cat.icon = emojiToKey[cat.icon];
    });
  },

  loadSettings() {
    this.migrateCategoryIcons();
    const saved = localStorage.getItem('spy_settings');
    const all = this._getAllWithTikTok();
    if (saved) {
      try {
        const s = JSON.parse(saved);
        Object.assign(State.settings, s);
        if (Array.isArray(s.categories) && s.categories.length > 0) {
          const valid = s.categories.filter((c) => all[c]);
          State.settings.categories = valid.length > 0 ? valid : Object.keys(all);
        } else {
          State.settings.categories = Object.keys(all);
        }
      } catch {
        State.settings.categories = Object.keys(all);
      }
    } else {
      State.settings.categories = Object.keys(all);
    }
  },

  restoreSettingsUI() {
    document.getElementById('val-players').textContent = State.settings.players;
    document.getElementById('val-spies').textContent = State.settings.spies;
    const toggles = {
      'toggle-hints': State.settings.hints,
      'toggle-sound': State.settings.sound !== false,
      'toggle-vibration': State.settings.vibration !== false,
      'toggle-no-repeat': State.settings.noRepeat !== false,
      'toggle-auto-hide': State.settings.autoHide !== false,
      'toggle-player-names': State.settings.playerNames
    };
    Object.entries(toggles).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    });
    document.getElementById('select-timer').value = String(State.settings.timer);
    const total = document.getElementById('menu-word-count');
    if (total) total.textContent = getTotalWordCount();
  },

  loadSession() {
    try {
      const s = JSON.parse(localStorage.getItem('spy_session') || '{}');
      State.session.usedWords = Array.isArray(s.usedWords) ? s.usedWords : [];
    } catch { State.session.usedWords = []; }
  },

  saveSession() {
    localStorage.setItem('spy_session', JSON.stringify(State.session));
  },

  clearSessionWords() {
    State.session.usedWords = [];
    this.saveSession();
    this.toast('История слов сброшена');
  },

  pickWord(categories) {
    const all = this._getAllWithTikTok();
    const pool = [];
    categories.forEach((cat) => {
      if (all[cat]?.words) {
        all[cat].words.forEach((w) => pool.push({ ...w, category: cat }));
      }
    });
    if (!pool.length) return null;

    let available = pool;
    if (State.settings.noRepeat) {
      available = pool.filter((w) => !State.session.usedWords.includes(w.word));
      if (!available.length) {
        State.session.usedWords = [];
        available = pool;
        this.toast('Все слова использованы — начинаем заново');
      }
    }
    return available[Math.floor(Math.random() * available.length)];
  },

  // ── Запуск с экраном загрузки ─────────────────────────────────────────────
  startGame() {
    this.saveSettings();
    const { players, spies, categories } = State.settings;

    if (!categories.length) { this.toast('Выбери хотя бы одну категорию!'); return; }
    if (spies >= players) { this.toast('Шпионов должно быть меньше игроков!'); return; }

    const picked = this.pickWord(categories);
    if (!picked) { this.toast('Нет слов в выбранных категориях!'); return; }

    // Показываем экран загрузки, пока готовим игру
    LoadingScreen.show('screen-role', () => {
      this._initGameState(picked, players, spies);
      this.showScreen('screen-role');
      this.showPassPhase();
    });
  },

  _initGameState(picked, players, spies) {
    State.game.word = picked.word;
    State.game.spyHint = picked.hint;
    State.game.category = picked.category;

    if (State.settings.noRepeat && !State.session.usedWords.includes(picked.word)) {
      State.session.usedWords.push(picked.word);
      this.saveSession();
    }

    State.game.playerOrder = this.shuffle([...Array(players).keys()].map((i) => i + 1));
    const spySlots = new Set(this.shuffle([...Array(players).keys()]).slice(0, spies));

    State.game.roles = State.game.playerOrder.map((num, idx) => ({
      isSpy: spySlots.has(idx),
      playerNum: num,
      name: State.settings.playerNames ? `Игрок ${num}` : null
    }));

    State.game.spyPlayers = State.game.roles.filter((r) => r.isSpy).map((r) => r.playerNum);
    State.game.firstPlayer = State.game.playerOrder[Math.floor(Math.random() * players)];
    State.game.currentPlayer = 0;

    State.stats.games++;
    State.stats.wordsPlayed++;
    State.stats.totalPlayers += players;
    this.saveStats();
  },

  showPassPhase() {
    const { currentPlayer, playerOrder, roles } = State.game;
    const total = roles.length;
    const role = roles[currentPlayer];

    // #role-player-num — существует в HTML внутри #phase-pass
    const numEl = document.getElementById('role-player-num');
    if (numEl) numEl.textContent = role.name || `Игрок №${playerOrder[currentPlayer]}`;

    // Обновляем текст-подсказку в зависимости от номера игрока
    const passText = document.querySelector('.pass-text');
    if (passText) {
      passText.textContent = currentPlayer === 0
        ? 'Нажми кнопку, чтобы увидеть свою роль'
        : 'Передайте телефон следующему участнику и нажмите кнопку';
    }

    document.getElementById('phase-pass').classList.remove('hidden');
    document.getElementById('phase-reveal').classList.add('hidden');
    document.getElementById('role-card').classList.remove('is-spy');

    // role-progress — реальный ID из HTML (role-progress-fill внутри role-progress-bar)
    const progress = document.getElementById('role-progress');
    const progressText = document.getElementById('role-progress-text');
    if (progress) progress.style.width = `${((currentPlayer) / total) * 100}%`;
    if (progressText) progressText.textContent = `${currentPlayer + 1} / ${total}`;

    if (currentPlayer > 0) {
      const cover = document.getElementById('cover-screen');
      cover.classList.remove('hidden');
      setTimeout(() => cover.classList.add('hidden'), 1200);
    }
  },

  revealRole() {
    const { currentPlayer, roles } = State.game;
    const role = roles[currentPlayer];

    document.getElementById('phase-pass').classList.add('hidden');
    document.getElementById('phase-reveal').classList.remove('hidden');

    const card = document.getElementById('role-card');
    const hideBtn = document.getElementById('btn-hide-role');
    const badge = document.getElementById('role-badge');

    if (role.isSpy) {
      card.classList.add('is-spy');
      // Показываем красивую иконку агента вместо символа
      badge.innerHTML = `<div class="spy-agent-icon">${SpySVG.agent}</div>`;

      if (State.settings.hints && State.game.spyHint) {
        document.getElementById('role-word').textContent = State.game.spyHint;
        document.getElementById('role-desc').textContent = 'Подсказка — ты в теме, но слово другое';
      } else {
        document.getElementById('role-word').textContent = 'Вы — шпион 🕵️';
        document.getElementById('role-desc').textContent = 'Слушай, наблюдай, не выдавай себя!';
      }
      this.haptic('heavy');
    } else {
      card.classList.remove('is-spy');
      badge.innerHTML = Icons.render('person', { size: 72, strokeWidth: 1.5 });
      document.getElementById('role-word').textContent = State.game.word;
      document.getElementById('role-desc').textContent = 'Это твоё слово. Никому не говори!';
      this.haptic('light');
    }

    if (hideBtn) hideBtn.style.display = State.settings.autoHide ? 'inline-flex' : 'none';

    const isLast = currentPlayer >= roles.length - 1;
    const nextBtn = document.getElementById('btn-next-player');
    if (nextBtn) {
      nextBtn.innerHTML = isLast
        ? Icons.btnContent('gamepad', 'Начать игру')
        : Icons.btnContent('chevronRight', 'Передать следующему');
    }
  },

  hideRole() {
    document.getElementById('phase-reveal').classList.add('hidden');
    document.getElementById('phase-pass').classList.remove('hidden');
    document.getElementById('role-card').classList.remove('is-spy');
    this.toast('Роль скрыта');
  },

  nextPlayer() {
    if (State.game.currentPlayer >= State.game.roles.length - 1) {
      this.goToGameScreen();
    } else {
      State.game.currentPlayer++;
      this.showPassPhase();
    }
  },

  goToGameScreen() {
    const { players, spies, timer } = State.settings;
    const all = this._getAllWithTikTok();
    const catData = all[State.game.category];

    document.getElementById('game-players-count').textContent = players;
    document.getElementById('game-spies-count').textContent = spies;
    const catEl = document.getElementById('game-category');
    const iconKey = catData?.icon || 'folder';
    const isTikTok = State.game.category === 'TikTok';
    catEl.innerHTML = isTikTok
      ? `${this._tiktokIconSVG(16)}<span>${State.game.category}</span>`
      : `${Icons.render(iconKey, { size: 16 })}<span>${State.game.category}</span>`;

    document.getElementById('game-first-player').textContent =
      `Игрок №${State.game.firstPlayer} начинает`;
    document.getElementById('revealed-word').textContent = State.game.word;
    document.getElementById('revealed-word').classList.add('hidden');

    const timerWrap = document.getElementById('timer-wrap');
    if (timer > 0) {
      timerWrap.style.display = 'flex';
      this.setupTimer(timer);
    } else {
      timerWrap.style.display = 'none';
    }

    document.getElementById('btn-start-discuss').style.display = 'block';
    document.getElementById('btn-pause-timer').style.display = 'none';
    document.getElementById('btn-end-round').style.display = 'block';
    this.showScreen('screen-game');
  },

  startDiscussion() {
    document.getElementById('btn-start-discuss').style.display = 'none';
    if (State.settings.timer > 0) {
      this.startTimer();
      document.getElementById('btn-pause-timer').style.display = 'block';
    } else {
      document.getElementById('timer-status').textContent = 'Обсуждайте!';
    }
  },

  togglePauseTimer() {
    if (!State.timer.running && !State.timer.paused) return;
    State.timer.paused = !State.timer.paused;
    State.timer.running = !State.timer.paused;
    const btn = document.getElementById('btn-pause-timer');
    if (State.timer.paused) {
      clearInterval(State.timer.interval);
      btn.innerHTML = Icons.btnContent('play', 'Продолжить');
      document.getElementById('timer-status').textContent = 'Пауза';
    } else {
      State.timer.interval = setInterval(() => this.tickTimer(), 1000);
      btn.innerHTML = Icons.btnContent('pause', 'Пауза');
      document.getElementById('timer-status').textContent = 'Время идёт...';
    }
  },

  endRound() {
    this.stopTimer();
    this.showResultScreen();
  },

  showResultScreen() {
    const all = this._getAllWithTikTok();
    const cat = all[State.game.category];
    document.getElementById('result-word').textContent = State.game.word;
    const resultCat = document.getElementById('result-category');
    const catIcon = cat?.icon || 'folder';
    const isTikTok = State.game.category === 'TikTok';
    resultCat.innerHTML = isTikTok
      ? `${this._tiktokIconSVG(14)}<span>${State.game.category}</span>`
      : `${Icons.render(catIcon, { size: 14 })}<span>${State.game.category}</span>`;
    document.getElementById('result-spies').textContent =
      State.game.spyPlayers.map((n) => `№${n}`).join(', ');

    const spyGuess = document.getElementById('spy-guess-section');
    if (State.settings.spies === 1) {
      spyGuess.style.display = 'block';
      document.getElementById('spy-guess-input').value = '';
    } else {
      spyGuess.style.display = 'none';
    }

    this.showScreen('screen-result');
  },

  checkSpyGuess() {
    const guess = document.getElementById('spy-guess-input').value.trim().toLowerCase();
    const word = State.game.word.toLowerCase();
    const correct = guess === word;
    const el = document.getElementById('spy-guess-result');
    if (correct) {
      el.innerHTML = `${Icons.render('party', { size: 18 })} Шпион угадал слово! Победа шпиона!`;
      el.className = 'guess-result spy-win';
      State.stats.spyWins++;
    } else {
      el.innerHTML = `${Icons.render('xmark', { size: 18 })} Не угадал. Слово было: «${State.game.word}»`;
      el.className = 'guess-result civilian-win';
      State.stats.civilianWins++;
    }
    this.saveStats();
  },

  recordVote(winner) {
    if (winner === 'spy') State.stats.spyWins++;
    else State.stats.civilianWins++;
    this.saveStats();
    this.toast(winner === 'spy' ? 'Победа шпионов!' : 'Победа мирных!');
  },

  restartGame() {
    this.stopTimer();
    this.startGame();
  },

  toggleRevealWord() {
    document.getElementById('revealed-word').classList.toggle('hidden');
  },

  setupTimer(seconds) {
    State.timer.total = seconds;
    State.timer.remaining = seconds;
    State.timer.running = false;
    State.timer.paused = false;
    this.renderTimer();
    document.getElementById('timer-status').textContent = 'Нажми «Начать обсуждение»';
    document.querySelector('.timer-ring')?.classList.remove('timer-warn', 'timer-danger');
  },

  startTimer() {
    State.timer.running = true;
    State.timer.paused = false;
    document.getElementById('timer-status').textContent = 'Время идёт...';
    State.timer.interval = setInterval(() => this.tickTimer(), 1000);
  },

  tickTimer() {
    if (!State.timer.running) return;
    State.timer.remaining--;
    if (State.timer.remaining <= 0) {
      State.timer.remaining = 0;
      this.stopTimer();
      this.renderTimer();
      const status = document.getElementById('timer-status');
      status.innerHTML = `${Icons.render('warning', { size: 16 })}<span>Время вышло!</span>`;
      this.playBeep();
      this.vibrate();
      return;
    }
    this.renderTimer();
    const pct = State.timer.remaining / State.timer.total;
    const ring = document.querySelector('.timer-ring');
    ring?.classList.toggle('timer-warn', pct <= 0.5 && pct > 0.2);
    ring?.classList.toggle('timer-danger', pct <= 0.2);
  },

  stopTimer() {
    clearInterval(State.timer.interval);
    State.timer.running = false;
    State.timer.paused = false;
  },

  renderTimer() {
    const { remaining, total } = State.timer;
    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    document.getElementById('timer-text').textContent = `${mins}:${secs}`;
    const circumference = 2 * Math.PI * 54;
    document.getElementById('timer-circle').style.strokeDashoffset =
      circumference * (1 - remaining / (total || 1));
  },

  playBeep() {
    if (!State.settings.sound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const tone = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      tone(880, 0, 0.3);
      tone(660, 0.35, 0.3);
      tone(440, 0.7, 0.5);
    } catch {}
  },

  vibrate(pattern = [200, 100, 200]) {
    if (State.settings.vibration && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  haptic(type = 'light') {
    const patterns = { light: 10, medium: [15, 30, 15], heavy: [30, 50, 30] };
    this.vibrate(patterns[type] || patterns.light);
  },

  loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem('spy_stats') || '{}');
      Object.assign(State.stats, s);
    } catch {}
  },

  saveStats() {
    localStorage.setItem('spy_stats', JSON.stringify(State.stats));
  },

  updateStatsUI() {
    document.getElementById('stat-games').textContent = State.stats.games;
    document.getElementById('stat-words').textContent = State.stats.wordsPlayed || State.stats.games;
    const avg = State.stats.games > 0
      ? (State.stats.totalPlayers / State.stats.games).toFixed(1) : '0';
    document.getElementById('stat-avg-players').textContent = avg;
    document.getElementById('stat-spy-wins').textContent = State.stats.spyWins || 0;
    document.getElementById('stat-civilian-wins').textContent = State.stats.civilianWins || 0;
    document.getElementById('stat-total-words').textContent = getTotalWordCount();
  },

  resetStats() {
    State.stats = { games: 0, wordsPlayed: 0, totalPlayers: 0, spyWins: 0, civilianWins: 0 };
    this.saveStats();
    this.updateStatsUI();
    this.toast('Статистика сброшена');
  },

  renderCustomWords() {
    const list = document.getElementById('custom-words-list');
    if (!list) return;
    const custom = CUSTOM_CATEGORIES['Мои слова'];
    list.innerHTML = '';
    if (!custom?.words?.length) {
      list.innerHTML = '<p class="empty-hint">Пока нет своих слов</p>';
      return;
    }
    custom.words.forEach((w, i) => {
      const item = document.createElement('div');
      item.className = 'custom-word-item';
      item.innerHTML = `<span>${w.word}</span><span class="custom-hint">${w.hint}</span><button class="btn-icon" onclick="App.removeCustomWord(${i})" aria-label="Удалить">${Icons.render('xmark', { size: 16 })}</button>`;
      list.appendChild(item);
    });
  },

  addCustomWord() {
    const word = document.getElementById('custom-word-input').value.trim();
    const hint = document.getElementById('custom-hint-input').value.trim();
    if (!word || !hint) { this.toast('Введи слово и подсказку'); return; }

    if (!CUSTOM_CATEGORIES['Мои слова']) {
      CUSTOM_CATEGORIES['Мои слова'] = { icon: 'star', words: [] };
    }
    CUSTOM_CATEGORIES['Мои слова'].words.push({ word, hint });
    saveCustomCategories();

    if (!State.settings.categories.includes('Мои слова')) {
      State.settings.categories.push('Мои слова');
      this.saveSettings();
    }

    document.getElementById('custom-word-input').value = '';
    document.getElementById('custom-hint-input').value = '';
    this.renderCustomWords();
    this.renderCategories();
    this.toast('Слово добавлено!');
  },

  removeCustomWord(index) {
    if (CUSTOM_CATEGORIES['Мои слова']) {
      CUSTOM_CATEGORIES['Мои слова'].words.splice(index, 1);
      if (!CUSTOM_CATEGORIES['Мои слова'].words.length) delete CUSTOM_CATEGORIES['Мои слова'];
      saveCustomCategories();
      this.renderCustomWords();
      this.renderCategories();
    }
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  toast(msg, duration = 2500) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => t.classList.remove('show'), duration);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
