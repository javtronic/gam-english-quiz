/*
 * English Quiz - game logic (vanilla JS, no modules, runs from file://).
 *
 * Flow: Home (difficulty) -> Wheel -> exercise -> Wheel -> ... -> Summary.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var CATEGORIES = [
    { key: 'vocabulary',     label: 'Vocabulary',     color: 'var(--c-vocabulary)' },
    { key: 'trivia',         label: 'Trivia',         color: 'var(--c-trivia)' },
    { key: 'tongue_twister', label: 'Tongue Twister', color: 'var(--c-tongue_twister)' },
    { key: 'spelling',       label: 'Spelling',       color: 'var(--c-spelling)' }
  ];
  var SECTOR = 360 / CATEGORIES.length;
  var MAX_SCORE = CATEGORIES.length * 10;
  var SPIN_TURNS = 5;
  var SPIN_FALLBACK_MS = 4600;   // in case 'transitionend' never fires
  var REVEAL_DELAY_MS = 900;     // pause on the wheel showing the chosen category

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var state = {
    difficulty: null,
    session: {},          // one random item per category
    locked: new Set(),    // categories already played
    results: {},          // per-category result for the summary
    wheelRotation: 0,
    spinning: false,
    timerId: null
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function screenEl(key) { return document.getElementById('screen-' + key); }
  function role(screen, name) { return $('[data-role="' + name + '"]', screen); }
  function categoryLabel(key) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === key) return CATEGORIES[i].label;
    return key;
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function showScreen(key) {
    $all('.screen').forEach(function (s) { s.classList.toggle('active', s.id === 'screen-' + key); });
    window.scrollTo(0, 0);
  }

  function totalScore() {
    var sum = 0;
    Object.keys(state.results).forEach(function (k) { sum += state.results[k].points; });
    return sum;
  }

  function updateHud() {
    var total = totalScore();
    $all('[data-role="score"]').forEach(function (el) { el.textContent = total; });
    $all('[data-role="difficulty"]').forEach(function (el) {
      el.textContent = state.difficulty || '';
      el.className = 'badge ' + (state.difficulty || '');
    });
  }

  function setFeedback(screen, type, html) {
    var fb = role(screen, 'feedback');
    fb.className = 'feedback ' + type;
    fb.innerHTML = html;
    fb.hidden = false;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function pointsHtml(points) {
    return '<span class="points">+' + points + ' point' + (points === 1 ? '' : 's') + '</span>';
  }

  // ---------------------------------------------------------------------------
  // Spelling evaluation (pure functions, exposed for testing)
  // ---------------------------------------------------------------------------

  /** Lowercase, strip accents and punctuation, collapse whitespace. */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/['’]/g, '')          // don't -> dont
      .replace(/[^a-z0-9\s]/g, ' ')        // punctuation -> space
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(text) {
    var n = normalize(text);
    return n ? n.split(' ') : [];
  }

  /**
   * Positional word similarity: the word typed in box i is compared with the
   * i-th expected word (after normalization). Empty boxes count as misses.
   * Returns { matched, total, ratio, perSlot: [bool] }.
   */
  function positionalSimilarity(words, expected) {
    var exTokens = tokenize(expected);
    var total = exTokens.length;
    var perSlot = exTokens.map(function (token, i) {
      return normalize(words[i] || '').replace(/ /g, '') === token;
    });
    var matched = perSlot.filter(Boolean).length;
    return { matched: matched, total: total, ratio: total ? matched / total : 0, perSlot: perSlot };
  }

  /** 100% -> 10 pts, >= 40% -> 5 pts, < 40% -> 0 pts (integer math, no float issues). */
  function spellingPoints(sim) {
    if (sim.total > 0 && sim.matched === sim.total) return 10;
    if (sim.matched * 100 >= 40 * sim.total && sim.matched > 0) return 5;
    return 0;
  }

  // ---------------------------------------------------------------------------
  // Screen 1: start
  // ---------------------------------------------------------------------------
  function validateData() {
    var q = window.QUESTIONS;
    if (!q) return 'Could not load questions.js. Check that the file is next to index.html.';
    var levels = ['easy', 'medium', 'hard'];
    for (var i = 0; i < levels.length; i++) {
      var bank = q[levels[i]];
      if (!bank) return 'Missing difficulty "' + levels[i] + '" in questions.js.';
      for (var j = 0; j < CATEGORIES.length; j++) {
        var list = bank[CATEGORIES[j].key];
        if (!Array.isArray(list) || list.length === 0) {
          return 'Missing questions for "' + CATEGORIES[j].key + '" in "' + levels[i] + '".';
        }
      }
    }
    return null;
  }

  function buildSession(difficulty) {
    var bank = window.QUESTIONS[difficulty];
    var session = {};
    CATEGORIES.forEach(function (c) { session[c.key] = pickRandom(bank[c.key]); });
    return session;
  }

  function startGame(difficulty) {
    state.difficulty = difficulty;
    state.session = buildSession(difficulty);
    state.locked = new Set();
    state.results = {};
    resetWheelRotation();
    renderWheel();
    updateHud();
    showScreen('wheel');
  }

  // ---------------------------------------------------------------------------
  // Screen 2: wheel
  // ---------------------------------------------------------------------------
  function initWheelLabels() {
    var wheel = $('#wheel');
    CATEGORIES.forEach(function (c, i) {
      var label = document.createElement('div');
      label.className = 'wheel-label';
      label.dataset.cat = c.key;
      label.style.setProperty('--angle', (i * SECTOR + SECTOR / 2) + 'deg');
      var span = document.createElement('span');
      span.textContent = c.label;
      label.appendChild(span);
      wheel.appendChild(label);
    });
  }

  function renderWheel() {
    var stops = CATEGORIES.map(function (c, i) {
      var color = state.locked.has(c.key) ? 'var(--locked)' : c.color;
      return color + ' ' + (i * SECTOR) + 'deg ' + ((i + 1) * SECTOR) + 'deg';
    });
    $('#wheel').style.background = 'conic-gradient(' + stops.join(', ') + ')';

    $all('.wheel-label').forEach(function (el) {
      el.classList.toggle('locked', state.locked.has(el.dataset.cat));
    });

    var remaining = CATEGORIES.length - state.locked.size;
    $('#wheel-status').textContent = remaining + ' of ' + CATEGORIES.length + ' categories left';
    $('#wheel-result').textContent = '';
    $('#spin-btn').disabled = false;
  }

  function resetWheelRotation() {
    var wheel = $('#wheel');
    wheel.style.transition = 'none';
    state.wheelRotation = 0;
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth; // force reflow so the reset is not animated
    wheel.style.transition = '';
  }

  function spin() {
    if (state.spinning) return;
    var available = CATEGORIES.filter(function (c) { return !state.locked.has(c.key); });
    if (available.length === 0) return;

    var target = pickRandom(available);
    var idx = CATEGORIES.indexOf(target);
    // Pointer is at the top (0deg). Rotating the wheel by R moves a sector at
    // angle a to a + R, so to bring the sector center under the pointer we
    // need R = -center (mod 360). A small jitter keeps it from looking robotic.
    var center = idx * SECTOR + SECTOR / 2;
    var jitter = (Math.random() - 0.5) * SECTOR * 0.6;
    var desired = (((-(center + jitter)) % 360) + 360) % 360;
    var current = ((state.wheelRotation % 360) + 360) % 360;
    var delta = desired - current;
    if (delta < 0) delta += 360;
    state.wheelRotation += SPIN_TURNS * 360 + delta;

    state.spinning = true;
    $('#spin-btn').disabled = true;
    $('#wheel-result').textContent = '';

    var wheel = $('#wheel');
    var finished = false;
    function onDone() {
      if (finished) return;
      finished = true;
      wheel.removeEventListener('transitionend', onDone);
      $('#wheel-result').textContent = target.label + '!';
      setTimeout(function () {
        state.spinning = false;
        openCategory(target.key);
      }, REVEAL_DELAY_MS);
    }
    wheel.addEventListener('transitionend', onDone);
    setTimeout(onDone, SPIN_FALLBACK_MS);
    wheel.style.transform = 'rotate(' + state.wheelRotation + 'deg)';
  }

  function openCategory(key) {
    switch (key) {
      case 'vocabulary':
      case 'trivia':
        renderMultipleChoice(key); break;
      case 'tongue_twister':
        renderTongueTwister(); break;
      case 'spelling':
        renderSpelling(); break;
    }
    showScreen(key);
  }

  /** Store the result and lock the category. Called once per exercise. */
  function finishCategory(key, result) {
    state.results[key] = result;
    state.locked.add(key);
    updateHud();
  }

  /** "Back to the wheel": returns to the hub, or to the summary when all are locked. */
  function backToWheel() {
    clearTimer();
    if (state.locked.size >= CATEGORIES.length) {
      renderSummary();
      showScreen('summary');
    } else {
      renderWheel();
      showScreen('wheel');
    }
  }

  function prepareExercise(screen) {
    role(screen, 'feedback').hidden = true;
    role(screen, 'continue').hidden = true;
  }

  function showContinue(screen) {
    var btn = role(screen, 'continue');
    btn.textContent = state.locked.size >= CATEGORIES.length ? 'See results' : 'Back to the wheel';
    btn.hidden = false;
    btn.focus();
  }

  // ---------------------------------------------------------------------------
  // Screens 3.a / 3.b: Vocabulary & Trivia (two attempts)
  // ---------------------------------------------------------------------------
  function renderMultipleChoice(key) {
    var screen = screenEl(key);
    var item = state.session[key];
    prepareExercise(screen);

    // Prompt (Vocabulary renders the ___ blank as a highlighted span)
    var prompt = role(screen, 'prompt');
    prompt.textContent = '';
    if (key === 'vocabulary') {
      var parts = item.sentence.split('___');
      parts.forEach(function (part, i) {
        prompt.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) {
          var blank = document.createElement('span');
          blank.className = 'blank';
          blank.textContent = '?';
          prompt.appendChild(blank);
        }
      });
    } else {
      prompt.textContent = item.question;
    }

    var attemptsEl = role(screen, 'attempts');
    attemptsEl.textContent = 'Attempt 1 of 2 — 10 points if correct';

    var optionsEl = role(screen, 'options');
    optionsEl.textContent = '';
    var attempts = 0;
    var chosen = [];
    var resolved = false;

    function disableAll() { $all('.option', optionsEl).forEach(function (b) { b.disabled = true; }); }

    function fillBlank(text) {
      var blank = $('.blank', prompt);
      if (blank) blank.textContent = text;
    }

    function resolve(points, correct) {
      resolved = true;
      disableAll();
      finishCategory(key, {
        challenge: key === 'vocabulary' ? item.sentence : item.question,
        answers: chosen.slice(),
        correctAnswer: item.correct,
        correct: correct,
        points: points
      });
      showContinue(screen);
    }

    function choose(option, btn) {
      if (resolved || btn.disabled) return;
      attempts++;
      chosen.push(option);

      if (option === item.correct) {
        btn.classList.add('correct');
        fillBlank(option);
        var pts = attempts === 1 ? 10 : 5;
        attemptsEl.textContent = '';
        setFeedback(screen, 'success',
          (attempts === 1 ? 'Excellent! Correct on the first try.' : 'Correct on the second try!') + pointsHtml(pts));
        resolve(pts, true);
        return;
      }

      btn.classList.add('wrong');
      btn.disabled = true;
      if (attempts === 1) {
        attemptsEl.textContent = 'Attempt 2 of 2 — 5 points if correct';
        setFeedback(screen, 'info', 'Not quite. You have one more try!');
      } else {
        attemptsEl.textContent = '';
        $all('.option', optionsEl).forEach(function (b) {
          if (b.dataset.value === item.correct) b.classList.add('reveal');
        });
        setFeedback(screen, 'error',
          'Out of attempts. The correct answer was: <strong>' + escapeHtml(item.correct) + '</strong>' + pointsHtml(0));
        resolve(0, false);
      }
    }

    shuffle(item.options).forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn option';
      btn.textContent = option;
      btn.dataset.value = option;
      btn.addEventListener('click', function () { choose(option, btn); });
      optionsEl.appendChild(btn);
    });
  }

  // ---------------------------------------------------------------------------
  // Screen 3.c: Tongue Twister (timer + facilitator grading)
  // ---------------------------------------------------------------------------
  function clearTimer() {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function renderTongueTwister() {
    var key = 'tongue_twister';
    var screen = screenEl(key);
    var item = state.session[key];
    var seconds = (window.CONFIG && window.CONFIG.timers && window.CONFIG.timers[state.difficulty]) || 15;
    prepareExercise(screen);
    clearTimer();

    role(screen, 'prompt').textContent = item.text;
    var display = role(screen, 'timer-display');
    var fill = role(screen, 'timer-fill');
    var timerBtn = role(screen, 'timer-btn');
    var grading = role(screen, 'grading');

    display.textContent = seconds;
    display.classList.remove('done');
    fill.style.transition = 'none';
    fill.style.width = '100%';
    void fill.offsetWidth;
    fill.style.transition = '';
    timerBtn.hidden = false;
    timerBtn.disabled = false;
    grading.hidden = true;
    $all('.grade', grading).forEach(function (b) { b.disabled = false; });

    var resolved = false;

    timerBtn.onclick = function () {
      if (state.timerId !== null) return;
      timerBtn.disabled = true;
      var remaining = seconds;
      state.timerId = setInterval(function () {
        remaining--;
        display.textContent = Math.max(remaining, 0);
        fill.style.width = (Math.max(remaining, 0) / seconds * 100) + '%';
        if (remaining <= 0) {
          clearTimer();
          display.textContent = "Time's up!";
          display.classList.add('done');
          timerBtn.hidden = true;
          grading.hidden = false;
        }
      }, 1000);
    };

    $all('.grade', grading).forEach(function (btn) {
      btn.onclick = function () {
        if (resolved) return;
        resolved = true;
        $all('.grade', grading).forEach(function (b) { b.disabled = true; });
        var points = parseInt(btn.dataset.points, 10);
        var label = btn.dataset.label;
        finishCategory(key, {
          challenge: item.text,
          grade: label,
          points: points
        });
        var type = points === 10 ? 'success' : (points === 5 ? 'info' : 'error');
        setFeedback(screen, type, 'Facilitator rating: <strong>' + escapeHtml(label) + '</strong>' + pointsHtml(points));
        showContinue(screen);
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Screen 3.d: Spelling (automatic evaluation)
  // ---------------------------------------------------------------------------
  function renderSpelling() {
    var key = 'spelling';
    var screen = screenEl(key);
    var item = state.session[key];
    prepareExercise(screen);

    var img = role(screen, 'image');
    img.src = item.image_url;
    var submit = role(screen, 'submit');
    submit.disabled = true;
    submit.hidden = false;

    // One box per expected word (hint = number of words only)
    var wordCount = tokenize(item.expected_text).length;
    role(screen, 'slot-hint').textContent = wordCount + ' word' + (wordCount === 1 ? '' : 's');
    var slotsEl = role(screen, 'slots');
    slotsEl.textContent = '';
    var slots = [];
    for (var i = 0; i < wordCount; i++) {
      var slot = document.createElement('input');
      slot.type = 'text';
      slot.className = 'word-slot';
      slot.setAttribute('autocomplete', 'off');
      slot.setAttribute('autocapitalize', 'off');
      slot.setAttribute('autocorrect', 'off');
      slot.setAttribute('spellcheck', 'false');
      slot.setAttribute('aria-label', 'Word ' + (i + 1) + ' of ' + wordCount);
      slotsEl.appendChild(slot);
      slots.push(slot);
    }

    var resolved = false;

    function words() { return slots.map(function (s) { return s.value.trim(); }); }
    function hasAnyWord() { return slots.some(function (s) { return normalize(s.value) !== ''; }); }
    function refreshSubmit() { submit.disabled = !hasAnyWord(); }
    function focusSlot(i) {
      var s = slots[Math.max(0, Math.min(i, slots.length - 1))];
      s.focus();
      s.setSelectionRange(s.value.length, s.value.length);
    }

    /**
     * Keeps one word per box. Typing a space (also on mobile keyboards) or
     * pasting a phrase splits the text: the first word stays, the rest go to
     * the following boxes and the focus moves forward.
     */
    function distribute(index, text) {
      var parts = text.replace(/^\s+/, '').split(/\s+/);
      slots[index].value = parts[0];
      for (var k = 1; k < parts.length && index + k < slots.length; k++) {
        if (parts[k] !== '') slots[index + k].value = parts[k];
      }
      if (parts.length > 1) focusSlot(index + parts.length - 1);
    }

    slots.forEach(function (slot, index) {
      slot.addEventListener('input', function () {
        if (/\s/.test(slot.value)) distribute(index, slot.value);
        refreshSubmit();
      });
      slot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (index < slots.length - 1) focusSlot(index + 1);
          else if (!submit.disabled) submit.click();
        } else if (e.key === 'Backspace' && slot.value === '' && index > 0) {
          e.preventDefault();
          focusSlot(index - 1);
        }
      });
    });
    setTimeout(function () { if (!resolved && slots.length) slots[0].focus(); }, 50);

    submit.onclick = function () {
      if (resolved || !hasAnyWord()) return;
      resolved = true;
      submit.hidden = true;

      var typed = words();
      var sim = positionalSimilarity(typed, item.expected_text);
      slots.forEach(function (s, i) {
        s.disabled = true;
        s.classList.add(sim.perSlot[i] ? 'correct' : 'wrong');
      });
      var text = typed.join(' ').replace(/\s+/g, ' ').trim();
      var points = spellingPoints(sim);
      var percent = Math.round(sim.ratio * 100);

      finishCategory(key, {
        challenge: item.expected_text,
        image: item.image_url,
        answer: text,
        percent: percent,
        points: points
      });

      var type = points === 10 ? 'success' : (points === 5 ? 'info' : 'error');
      var msg = points === 10 ? 'Perfect match!' : (points === 5 ? 'Good job, close enough!' : 'Keep practicing!');
      setFeedback(screen, type,
        msg + ' Match: <strong>' + percent + '%</strong> (' + sim.matched + ' of ' + sim.total + ' words).' +
        '<br>Expected: <em>' + escapeHtml(item.expected_text) + '</em>' + pointsHtml(points));
      showContinue(screen);
    };
  }

  // ---------------------------------------------------------------------------
  // Screen 4: Summary
  // ---------------------------------------------------------------------------
  function renderSummary() {
    var total = totalScore();
    $('#summary-total').textContent = total;
    $('[data-role="difficulty-text"]', screenEl('summary')).textContent =
      'Difficulty: ' + state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

    var ratio = total / MAX_SCORE;
    $('#summary-message').textContent =
      ratio === 1 ? 'Perfect score! Outstanding work!' :
      ratio >= 0.75 ? 'Great job! Your English is strong.' :
      ratio >= 0.5 ? 'Good effort! Keep practicing.' :
      'Nice try! Practice makes perfect.';

    var list = $('#summary-list');
    list.textContent = '';

    CATEGORIES.forEach(function (c) {
      var r = state.results[c.key];
      if (!r) return;

      var card = document.createElement('article');
      card.className = 'summary-item cat-' + c.key;

      var head = document.createElement('div');
      head.className = 'summary-head';
      var h3 = document.createElement('h3');
      h3.textContent = c.label;
      var pill = document.createElement('span');
      pill.className = 'points-pill p' + r.points;
      pill.textContent = r.points + ' / 10';
      head.appendChild(h3);
      head.appendChild(pill);
      card.appendChild(head);
      list.appendChild(card);
    });
  }

  function resetGame() {
    clearTimer();
    state.difficulty = null;
    state.session = {};
    state.locked = new Set();
    state.results = {};
    state.spinning = false;
    resetWheelRotation();
    updateHud();
    showScreen('home');
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    initWheelLabels();

    var error = validateData();
    if (error) {
      var el = $('#data-error');
      el.textContent = error;
      el.hidden = false;
      $all('.difficulty-btn').forEach(function (b) { b.disabled = true; });
      return;
    }

    $all('.difficulty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { startGame(btn.dataset.difficulty); });
    });
    $('#spin-btn').addEventListener('click', spin);
    $all('[data-role="continue"]').forEach(function (btn) { btn.addEventListener('click', backToWheel); });
    $('#play-again-btn').addEventListener('click', resetGame);
  }

  // Exposed for console checks / manual testing
  window.EnglishQuiz = {
    state: state,
    normalize: normalize,
    positionalSimilarity: positionalSimilarity,
    spellingPoints: spellingPoints
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
