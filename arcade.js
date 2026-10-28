/* THE ARCADE — three cabinets on the shop's own tools. Vanilla, no network, scores in this browser only. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = 'tw_arcade';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = (k, v) => { const b = load(); if (!(k in b) || v > b[k]) { b[k] = v; try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {} } return load(); };
  const toast = (m) => { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); };
  const paintBest = () => { const b = load(); $$('[data-best]').forEach(el => { const v = b[el.dataset.best]; el.textContent = v == null ? '—' : (el.dataset.best === 'pink' ? v + ' rounds' : el.dataset.best === 'panel' ? v + ' pts' : v + ' popped'); }); };
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const last = {};

  function cabinet(el, game) {
    const canvas = $('canvas', el), hud = $('[data-hud]', el), start = $('[data-start]', el);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf = 0, state = null;
    const fit = () => { const r = canvas.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (state) game.draw(ctx, state, W, H); else idle(); };
    new ResizeObserver(fit).observe(canvas);
    const idle = () => { ctx.clearRect(0, 0, W, H); ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(0, 0, W, H); ctx.font = '700 14px ' + getComputedStyle(document.body).getPropertyValue('--mono'); ctx.fillStyle = 'rgba(236,236,241,.7)'; ctx.textAlign = 'center'; ctx.fillText('PRESS PLAY', W / 2, H / 2); };
    const pt = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const end = (score, label) => { cancelAnimationFrame(raf); state = null; el.classList.remove('playing'); const b = save(game.key, score); hud.textContent = label + ' Best: ' + b[game.key] + '.'; last[game.key] = score; paintBest(); start.textContent = 'AGAIN'; idle(); };
    const loop = (now) => { if (!state) return; game.tick(state, now, W, H); game.draw(ctx, state, W, H); if (state.over) { end(state.score, state.label); return; } hud.textContent = game.hud(state); raf = requestAnimationFrame(loop); };
    start.onclick = () => { if (state) return; fit(); state = game.init(W, H, performance.now()); el.classList.add('playing'); start.textContent = 'PLAYING'; raf = requestAnimationFrame(loop); };
    canvas.addEventListener('pointerdown', (e) => { if (!state) return; canvas.setPointerCapture(e.pointerId); game.down && game.down(state, pt(e), performance.now()); });
    canvas.addEventListener('pointermove', (e) => { if (!state) return; game.move && game.move(state, pt(e), performance.now(), e.buttons); });
    ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, (e) => { if (!state) return; game.up && game.up(state, pt(e), performance.now()); }));
    fit();
  }

  const mono = () => '700 13px ' + getComputedStyle(document.body).getPropertyValue('--mono');
  const img = (src) => { const i = new Image(); i.src = src; return i; };
  const VAN_BEFORE = img('assets/van_before.jpg'), VAN_AFTER = img('assets/van_after.jpg');
  const cover = (ctx, im, W, H) => { if (!im.naturalWidth) return; const s = Math.max(W / im.naturalWidth, H / im.naturalHeight); const w = im.naturalWidth * s, h = im.naturalHeight * s; ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); };

  /* 1. SQUEEGEE RUSH — pop every bubble under the film before the clock runs out */
  const rush = {
    key: 'rush',
    init: (W, H, t) => ({ t0: t, dur: 20000, bubbles: Array.from({ length: 20 }, () => ({ x: 20 + Math.random() * (W - 40), y: 20 + Math.random() * (H - 40), r: 9 + Math.random() * 11 })), popped: 0, score: 0, over: false, wipes: [], label: '' }),
    tick: (s, now) => { s.left = Math.max(0, s.dur - (now - s.t0)); s.wipes = s.wipes.filter(w => now - w.t < 400); if (s.left <= 0 || !s.bubbles.length) { s.over = true; s.score = s.popped; s.label = s.bubbles.length ? 'Time. ' + s.popped + ' popped.' : 'Clean sheet in ' + ((now - s.t0) / 1000).toFixed(1) + 's. ' + s.popped + ' popped.'; } },
    hud: (s) => (s.left / 1000).toFixed(1) + 's · ' + s.popped + ' popped · ' + s.bubbles.length + ' left',
    move: (s, p, now, buttons) => { if (!buttons) return; s.bubbles = s.bubbles.filter(b => { const hit = Math.hypot(b.x - p.x, b.y - p.y) < b.r + 14; if (hit) { s.popped++; s.wipes.push({ x: b.x, y: b.y, t: now }); } return !hit; }); },
    down: (s, p, now) => rush.move(s, p, now, 1),
    draw: (ctx, s, W, H) => {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(168,85,247,.55)'); g.addColorStop(.5, 'rgba(236,72,153,.5)'); g.addColorStop(1, 'rgba(45,212,191,.55)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const b of s.bubbles) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); }
      for (const w of s.wipes) { const k = (performance.now() - w.t) / 400; ctx.beginPath(); ctx.arc(w.x, w.y, 14 + k * 30, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.font = mono(); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(Math.ceil((s.left || s.dur) / 1000) + 's', 10, 20);
    },
  };

  /* 2. PANEL PERFECT — one smooth pull left to right; speed makes bubbles, backing up is ignored */
  const panel = {
    key: 'panel',
    init: (W, H, t) => ({ t0: t, prog: 0, bubbles: [], last: null, over: false, score: 0, label: '', started: false }),
    tick: (s, now) => { if (s.prog >= .985 && !s.over) { s.over = true; const secs = (now - s.t0) / 1000; s.score = Math.max(0, Math.round(100 - s.bubbles.length * 8 - Math.max(0, secs - 2) * 4)); s.label = s.bubbles.length ? s.bubbles.length + ' bubble' + (s.bubbles.length > 1 ? 's' : '') + '. ' + s.score + ' pts.' : 'Zero bubbles. ' + s.score + ' pts.'; } },
    hud: (s) => Math.round(s.prog * 100) + '% laid · ' + s.bubbles.length + ' bubbles',
    down: (s, p, now) => { s.last = { x: p.x, y: p.y, t: now }; if (!s.started) { s.started = true; s.t0 = now; } },
    move: (s, p, now, buttons) => { if (!buttons || !s.last) return; const dt = Math.max(1, now - s.last.t), v = (p.x - s.last.x) / dt; if (p.x > s.last.x) { if (v > 1.4 && Math.random() < .5) s.bubbles.push({ x: p.x, y: 30 + Math.random() * 100 }); s.prog = Math.max(s.prog, p.x / s.W); } s.last = { x: p.x, y: p.y, t: now }; },
    up: (s) => { s.last = null; },
    draw: (ctx, s, W, H) => {
      s.W = W; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#1a1a22'; ctx.fillRect(0, 0, W, H); cover(ctx, VAN_BEFORE, W, H);
      const edge = s.prog * W;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, edge, H); ctx.clip(); cover(ctx, VAN_AFTER, W, H); ctx.restore();
      if (s.prog > 0 && s.prog < .985) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 16; ctx.fillRect(edge - 1, 0, 3, H); ctx.shadowBlur = 0; }
      for (const b of s.bubbles) { ctx.beginPath(); ctx.arc(b.x, b.y + (H - 160) / 2, 7, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke(); }
      ctx.font = mono(); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(s.started ? Math.round(s.prog * 100) + '%' : 'DRAG FROM THE LEFT EDGE', 10, 20);
    },
  };

  /* 3. SPOT THE PINK — exactly one pink dot; it gets smaller every round; eight seconds each */
  const pink = {
    key: 'pink',
    init: (W, H, t) => ({ round: 1, r: 9, dot: null, t0: t, dur: 8000, over: false, score: 0, label: '', W, H, flash: 0 }),
    place: (s) => { s.dot = { x: 24 + Math.random() * (s.W - 48), y: 24 + Math.random() * (s.H - 48) }; s.t0 = performance.now(); },
    tick: (s, now) => { if (!s.dot) pink.place(s); s.left = Math.max(0, s.dur - (now - s.t0)); if (s.left <= 0) { s.over = true; s.score = s.round - 1; s.label = 'The dog found it first. ' + (s.round - 1) + ' round' + (s.round - 1 === 1 ? '' : 's') + '.'; } },
    hud: (s) => 'round ' + s.round + ' · ' + (s.left / 1000).toFixed(1) + 's',
    down: (s, p) => { if (!s.dot) return; if (Math.hypot(s.dot.x - p.x, s.dot.y - p.y) < s.r + 8) { s.round++; s.r = Math.max(3, s.r - 1); s.flash = performance.now(); pink.place(s); } },
    draw: (ctx, s, W, H) => {
      s.W = W; s.H = H; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#1a1a22'; ctx.fillRect(0, 0, W, H); cover(ctx, VAN_AFTER, W, H);
      if (s.dot) { ctx.beginPath(); ctx.arc(s.dot.x, s.dot.y, s.r, 0, Math.PI * 2); ctx.fillStyle = '#ff2d95'; ctx.fill(); }
      if (performance.now() - s.flash < 300) { ctx.fillStyle = 'rgba(255,45,149,.18)'; ctx.fillRect(0, 0, W, H); }
      ctx.font = mono(); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText('R' + s.round + ' · ' + Math.ceil((s.left || s.dur) / 1000) + 's', 10, 20);
    },
  };

  const GAMES = { rush, panel, pink };
  $$('.cab[data-game]').forEach(el => cabinet(el, GAMES[el.dataset.game]));
  paintBest();
  const share = $('#arcadeShare');
  if (share) share.onclick = () => {
    const b = load();
    const line = 'My run at THE CAR SHOW: Squeegee Rush ' + (b.rush ?? 0) + ' popped, Panel Perfect ' + (b.panel ?? 0) + ' pts, Spot the Pink ' + (b.pink ?? 0) + ' rounds. ' + location.origin + location.pathname + '#arcade';
    (navigator.clipboard ? navigator.clipboard.writeText(line) : Promise.reject()).then(() => toast('RUN COPIED ✓'), () => toast('COPY BLOCKED — ' + line));
  };
  window.__arcadeReset = () => { try { localStorage.removeItem(KEY); } catch (e) {} paintBest(); };
})();
