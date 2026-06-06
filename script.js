/**
 * ШПИОН — script.js
 * Логика игры: настройки, роли, таймер, голосование, итоги
 */
'use strict';

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

const App = {
  init() {
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

  renderCategories(filter = '') {
    const grid = document.getElementById('categories-grid');
    const all = getAllCategories();
    const q = filter.trim().toLowerCase();
    grid.innerHTML = '';

    Object.entries(all).forEach(([name, data]) => {
      if (q && !name.toLowerCase().includes(q)) return;
      const count = data.words?.length || 0;
      const chip = document.createElement('button');
      chip.className = 'cat-chip' + (State.settings.categories.includes(name) ? ' selected' : '');
      const iconKey = data.icon || 'folder';
      chip.innerHTML = `<span class="cat-chip-icon">${Icons.render(iconKey, { size: 18 })}</span><span class="cat-chip-text">${name}</span><span class="cat-chip-count">${count}</span>`;
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

  filterCategories(value) {
    this.renderCategories(value);
  },

  updateCategorySummary() {
    const el = document.getElementById('categories-summary');
    if (!el) return;
    const all = getAllCategories();
    let words = 0;
    State.settings.categories.forEach((c) => { words += all[c]?.words?.length || 0; });
    el.textContent = `${State.settings.categories.length} категорий · ${words} слов`;
  },

  selectAllCategories() {
    State.settings.categories = Object.keys(getAllCategories());
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
    Object.values(getAllCategories()).forEach((cat) => {
      if (cat.icon && emojiToKey[cat.icon]) cat.icon = emojiToKey[cat.icon];
    });
  },

  loadSettings() {
    this.migrateCategoryIcons();
    const saved = localStorage.getItem('spy_settings');
    const all = getAllCategories();
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
    const all = getAllCategories();
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

  startGame() {
    this.saveSettings();
    const { players, spies, categories } = State.settings;

    if (!categories.length) { this.toast('Выбери хотя бы одну категорию!'); return; }
    if (spies >= players) { this.toast('Шпионов должно быть меньше игроков!'); return; }

    const picked = this.pickWord(categories);
    if (!picked) { this.toast('Нет слов в выбранных категориях!'); return; }

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

    this.showScreen('screen-role');
    this.showPassPhase();
  },

  showPassPhase() {
    const { currentPlayer, playerOrder, roles } = State.game;
    const total = roles.length;
    const role = roles[currentPlayer];

    document.getElementById('role-player-num').textContent =
      role.name || `Игрок №${playerOrder[currentPlayer]}`;
    document.getElementById('phase-pass').classList.remove('hidden');
    document.getElementById('phase-reveal').classList.add('hidden');
    document.getElementById('role-card').classList.remove('is-spy');

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
      badge.innerHTML = Icons.render('spy', { size: 72, strokeWidth: 1.5 });
      if (State.settings.hints && State.game.spyHint) {
        document.getElementById('role-word').textContent = State.game.spyHint;
        document.getElementById('role-desc').textContent = 'Подсказка — ты в теме, но слово другое';
      } else {
        document.getElementById('role-word').textContent = 'Вы шпион';
        document.getElementById('role-desc').textContent = 'Слушай, наблюдай, не выдавай себя!';
      }
    } else {
      card.classList.remove('is-spy');
      badge.innerHTML = Icons.render('person', { size: 72, strokeWidth: 1.5 });
      document.getElementById('role-word').textContent = State.game.word;
      document.getElementById('role-desc').textContent = 'Это твоё слово. Никому не говори!';
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
    const all = getAllCategories();
    const catData = all[State.game.category];

    document.getElementById('game-players-count').textContent = players;
    document.getElementById('game-spies-count').textContent = spies;
    const catEl = document.getElementById('game-category');
    const iconKey = catData?.icon || 'folder';
    catEl.innerHTML = `${Icons.render(iconKey, { size: 16 })}<span>${State.game.category}</span>`;
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
    const all = getAllCategories();
    const cat = all[State.game.category];
    document.getElementById('result-word').textContent = State.game.word;
    const resultCat = document.getElementById('result-category');
    const catIcon = cat?.icon || 'folder';
    resultCat.innerHTML = `${Icons.render(catIcon, { size: 14 })}<span>${State.game.category}</span>`;
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
