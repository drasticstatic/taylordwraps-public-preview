
(() => {
"use strict";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- toast ---------- */
let toastT;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ---------- preloader ---------- */
(() => {
  let p = 0;
  const bar = $('#lbar'), pct = $('#lpct');
  const iv = setInterval(() => {
    p = Math.min(100, p + 7 + Math.random()*9);
    bar.style.width = p + '%';
    pct.textContent = 'WARMING THE LAMINATOR — ' + Math.round(p) + '%';
    if (p >= 100){
      clearInterval(iv);
      setTimeout(()=>{ $('#loader').classList.add('done'); (window.__startPeel||function(){})(); }, 350);
    }
  }, 90);
})();

/* ---------- ticker ---------- */
(() => {
  const words = ['DESIGN','PRINT','INSTALL','BRAND','GET TAYLOR\u2019D','NO PINK','WRAP EVERYTHING'];
  const seq = words.map(w => `<span>${w}</span><span><i>\u25C6</i></span>`).join('');
  $('#tickTrack').innerHTML = seq + seq;
})();

/* ---------- reveal on scroll ---------- */
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.12});
  $$('.rv').forEach(el => io.observe(el));
})();

/* ---------- THE PEEL ---------- */
const peel = (() => {
  const cv = $('#peelCanvas'), ctx = cv.getContext('2d');
  const chip = $('#peelChip');
  let W=0, H=0, dpr=1, p=0, target=0, dragging=false, done=false, demoT=null;
  let imgB=null, imgA=null;

  function srcs(){
    const b = $$('.case .media img.before')[0], a = $$('.case .media img.after')[0];
    return [b, a];
  }
  function load(){
    const [b,a] = srcs();
    let n = 0;
    const ready = () => { if(++n===2) build(); };
    if (b && b.complete) { imgB=b; ready(); } else if (b) { imgB=b; b.onload=ready; }
    if (a && a.complete) { imgA=a; ready(); } else if (a) { imgA=a; a.onload=ready; }
    // safety: if imgs missing, retry
    setTimeout(()=>{ if(!imgB||!imgA) { const [b2,a2]=srcs(); imgB=imgB||b2; imgA=imgA||a2; if(imgB&&imgA) build(); } }, 2500);
  }
  function build(){
    dpr = Math.min(2, devicePixelRatio||1);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  function cover(img){
    const s = Math.max(W/img.naturalWidth, H/img.naturalHeight);
    const dw = img.naturalWidth*s, dh = img.naturalHeight*s;
    return [(W-dw)/2, (H-dh)/2, dw, dh];
  }
  function edgeX(y){
    const ex = p*W;
    return ex + Math.sin(y*0.012 + ex*0.02)*10 + Math.sin(y*0.031 - ex*0.01)*5;
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    if (imgB) ctx.drawImage(imgB, ...cover(imgB));
    if (!imgA) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0,0);
    const steps = 28;
    for (let i=0;i<=steps;i++){
      const y = (i/steps)*H;
      ctx.lineTo(edgeX(y), y);
    }
    ctx.lineTo(0,H); ctx.closePath();
    ctx.clip();
    ctx.drawImage(imgA, ...cover(imgA));
    // edge gloss
    const ex = p*W;
    const g = ctx.createLinearGradient(ex-26,0,ex+26,0);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(.5,'rgba(255,255,255,.75)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(168,85,247,.9)'; ctx.shadowBlur = 18;
    ctx.beginPath();
    for (let i=0;i<=steps;i++){
      const y = (i/steps)*H, x = edgeX(y);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.restore();
  }
  function setP(v){
    p = Math.max(0, Math.min(1, v));
    target = p;
    const pctv = Math.round(p*100);
    if (p >= .985 && !done){
      done = true;
      chip.innerHTML = 'WRAPPED \u2713 <b>GET TAYLOR\u2019D</b>';
      chip.classList.add('hot');
      $('#filmChip').innerHTML = 'FILM: <b>INSTALLED \u00B7 ZERO BUBBLES</b>';
    } else if (p < .985 && done){
      done = false;
      chip.classList.remove('hot');
      $('#filmChip').innerHTML = 'FILM: <b>SPECTRA-PSYCLONE 3M 1080</b>';
    }
    chip.innerHTML = chip.innerHTML.replace(/^([A-Z ]+)(\u2192)?\s*/, '') // noop guard
    if (!done) chip.innerHTML = 'DRAG TO WRAP \u2192 <b>' + pctv + '%</b>';
    draw();
  }
  function x2p(clientX){
    const r = cv.getBoundingClientRect();
    return (clientX - r.left) / r.width;
  }
  cv.addEventListener('pointerdown', e => {
    dragging = true; cv.setPointerCapture(e.pointerId);
    cancelAnimationFrame(demoT); demoT = null;
    if (done){ done=false; chip.classList.remove('hot'); setP(0); return; }
    setP(x2p(e.clientX));
  });
  cv.addEventListener('pointermove', e => { if (dragging) setP(x2p(e.clientX)); });
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev => cv.addEventListener(ev, ()=>dragging=false));

  function startPeelDemo(){
    load();
    if (REDUCED){ setP(1); chip.innerHTML = 'WRAPPED \u2713 <b>TAP TO UNWRAP</b>'; return; }
    const t0 = performance.now(), DUR = 2600;
    const tick = now => {
      if (demoT === null) return;
      const t = Math.min(1, (now - t0)/DUR);
      const e = t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
      setP(.15 + e*.84);
      if (t < 1) demoT = requestAnimationFrame(tick);
      else {
        demoT = null;
        setTimeout(()=>{ if(!dragging && !done){ const s=performance.now();
          const back = now2 => { const t2=Math.min(1,(now2-s)/900); setP(.99 - t2*.81); if(t2<1) requestAnimationFrame(back); };
          requestAnimationFrame(back); } }, 1400);
      }
    };
    demoT = requestAnimationFrame(tick);
  }
  addEventListener('resize', () => { if (imgB && imgA) build(); });
  return { startPeelDemo };
})();
window.__startPeel = peel.startPeelDemo;

/* ---------- before/after sliders ---------- */
(() => {
  $$('[data-ba]').forEach(media => {
    const set = clientX => {
      const r = media.getBoundingClientRect();
      const v = Math.max(4, Math.min(96, (clientX - r.left)/r.width*100));
      media.style.setProperty('--split', v + '%');
    };
    media.addEventListener('pointerdown', e => {
      media.setPointerCapture(e.pointerId);
      set(e.clientX);
      const mv = ev => set(ev.clientX);
      const up = () => { media.removeEventListener('pointermove', mv); };
      media.addEventListener('pointermove', mv);
      media.addEventListener('pointerup', up, {once:true});
    });
  });
})();

/* ---------- rail nav ---------- */
(() => {
  const rail = $('#rail');
  $('#railL').onclick = () => rail.scrollBy({left:-min()});
  $('#railR').onclick = () => rail.scrollBy({left:min()});
  function min(){ return Math.min(580, rail.clientWidth*.8); }
})();

/* ---------- visualizer ---------- */
(() => {
  const FILMS = [
    {n:'SPECTRA-PSYCLONE', h:0,   s:1,    css:'linear-gradient(120deg,#a855f7,#ec4899,#2dd4bf)'},
    {n:'ULTRAVIOLET RUSH', h:-50, s:1.1,  css:'linear-gradient(120deg,#6366f1,#a855f7,#3b82f6)'},
    {n:'ACID BLOOM',       h:45,  s:1.2,  css:'linear-gradient(120deg,#ec4899,#f43f5e,#f97316)'},
    {n:'TANGERINE DREAM',  h:95,  s:1.15, css:'linear-gradient(120deg,#f97316,#fbbf24,#ef4444)'},
    {n:'LIME RIOT',        h:140, s:1.2,  css:'linear-gradient(120deg,#facc15,#84cc16,#22c55e)'},
    {n:'TEAL TEMPEST',     h:185, s:1.1,  css:'linear-gradient(120deg,#22c55e,#2dd4bf,#0ea5e9)'},
    {n:'GLACIER SHIFT',    h:230, s:.9,   css:'linear-gradient(120deg,#0ea5e9,#64748b,#e2e8f0)'},
    {n:'INFRARED GHOST',   h:300, s:1.25, css:'linear-gradient(120deg,#ef4444,#a855f7,#6366f1)'},
  ];
  const FINS = {
    gloss: {n:'GLOSS', f:'saturate(1.15) contrast(1.07) brightness(1.02)'},
    satin: {n:'SATIN', f:'saturate(.92) contrast(1.02) brightness(.97)'},
    matte: {n:'MATTE', f:'saturate(.78) contrast(.98) brightness(.9)'},
  };
  const IMGS = { van:'assets/van_after.jpg', car:'assets/car_after.jpg', mower:'assets/mower.jpg', toolbox:'assets/toolbox.jpg', rc:'assets/rc-white.jpg', rcReal:'assets/rc.jpg', atv:'assets/atv.jpg', jetski:'assets/jetski.jpg', snow:'assets/snowmobile.jpg', boards:'assets/boards.jpg', rv:'assets/rv.jpg', bus:'assets/bus.jpg', drums:'assets/drums.jpg', custom:null };
  const BODYN = { van:'WORK VAN', car:'SPORT COUPE', mower:'ZERO-TURN MOWER', toolbox:'TOOL CHEST', rc:'RC TRUCK \u00b7 FRESH SHELL', rcReal:'RC TRUCK \u00b7 MOM\u2019S BUILD', atv:'ATV QUAD', jetski:'JET SKI', snow:'SNOWMOBILE', boards:'SKATE + SNOW DECKS', rv:'VINTAGE RV', bus:'WHITE SCHOOL BUS', drums:'DRUM KIT', custom:'YOUR RIDE' };
  const SKEW = { van:'-14deg', car:'-8deg', mower:'-6deg', toolbox:'-10deg', rc:'-8deg', rcReal:'-8deg', atv:'-10deg', jetski:'-6deg', snow:'-8deg', boards:'-4deg', rv:'-10deg', bus:'-4deg', drums:'-6deg', custom:'-8deg' };
  let film = FILMS[0], fin = 'gloss', body = 'van';
  const img = $('#vizImg');

  const sw = $('#swatches');
  FILMS.forEach((f,i) => {
    const b = document.createElement('button');
    b.className = 'sw' + (i===0?' on':'');
    b.style.background = f.css;
    b.title = f.n;
    b.setAttribute('aria-label', 'Film: ' + f.n);
    b.onclick = () => { film = f; $$('#swatches .sw').forEach(x=>x.classList.remove('on')); b.classList.add('on'); apply(); };
    sw.appendChild(b);
  });

  $$('#bodySeg button').forEach(b => b.onclick = () => {
    body = b.dataset.body;
    $$('#bodySeg button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    apply();
  });
  $$('#finSeg button').forEach(b => b.onclick = () => {
    fin = b.dataset.fin;
    $$('#finSeg button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    apply();
  });

  const vtxt = $('#vizText');
  let txtDrag = null;
  function placeText(){
    if (body==='custom'){ vtxt.style.left='50%'; vtxt.style.top='50%'; }
    else { vtxt.style.left='34%'; vtxt.style.top = body==='van' ? '52%' : '62%'; }
  }
  vtxt.addEventListener('pointerdown', e => {
    txtDrag = {dx: e.clientX - vtxt.offsetLeft, dy: e.clientY - vtxt.offsetTop};
    vtxt.setPointerCapture(e.pointerId);
  });
  vtxt.addEventListener('pointermove', e => {
    if (!txtDrag) return;
    const stage = vtxt.parentElement.getBoundingClientRect();
    vtxt.style.left = Math.max(0, Math.min(stage.width - vtxt.offsetWidth, e.clientX - txtDrag.dx)) + 'px';
    vtxt.style.top  = Math.max(0, Math.min(stage.height - vtxt.offsetHeight, e.clientY - txtDrag.dy)) + 'px';
  });
  ['pointerup','pointercancel'].forEach(ev => vtxt.addEventListener(ev, ()=> txtDrag=null));
  $('#vizTextInput').addEventListener('input', e => {
    vtxt.textContent = e.target.value.trim() || 'YOUR TEXT HERE';
  });

  // wrap anything: upload + drag-drop
  const fileInput = $('#wrapFile'), stageEl = document.querySelector('.viz .stage');
  function loadCustom(file){
    if (!file || !file.type.startsWith('image/')) return toast('THAT AINT AN IMAGE, CHIEF');
    IMGS.custom = URL.createObjectURL(file);
    body = 'custom';
    $$('#bodySeg button').forEach(x=>x.classList.toggle('on', x.dataset.body==='custom'));
    apply();
    toast('RIDE LOADED — PICK A FILM, DRAG YOUR LETTERING');
  }
  $('#uploadBtn').onclick = () => fileInput.click();
  fileInput.addEventListener('change', () => loadCustom(fileInput.files[0]));
  ['dragover','dragenter'].forEach(ev => stageEl.addEventListener(ev, e => { e.preventDefault(); stageEl.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(ev => stageEl.addEventListener(ev, e => { e.preventDefault(); stageEl.classList.remove('dragover'); }));
  stageEl.addEventListener('drop', e => loadCustom(e.dataTransfer.files[0]));

  function apply(){
    if (body==='custom' && !IMGS.custom){ fileInput.click(); return; }
    img.src = IMGS[body];
    img.style.filter = `sepia(.35) hue-rotate(${film.h}deg) saturate(${film.s}) ` + FINS[fin].f;
    $('#bodyName').textContent = BODYN[body];
    $('#filmName').textContent = film.n;
    $('#finName').textContent = FINS[fin].n;
    $('#vizBadge').innerHTML = 'SPEC: <b>' + BODYN[body] + ' / ' + film.n + ' \u00B7 ' + FINS[fin].n + '</b>';
    vtxt.style.transform = 'skewX(' + (SKEW[body] || '-8deg') + ')';
    if (body==='custom'){ vtxt.style.left='50%'; vtxt.style.top='50%'; }
    if (window.__vizDirty) window.__vizDirty();
  }
  window.__vizState = () => ({ body, film, fin, FINS });

  $('#vizSend').addEventListener('click', () => {
    // prefill the funnel with the visualizer's choices
    pick('body',  body==='van' ? 'Work Van / Transit' : 'Car / Coupe');
    pick('service', body==='van' ? 'Full Custom Wrap' : 'Color Change');
    pick('film', film.n==='ULTRAVIOLET RUSH'||film.n==='GLACIER SHIFT' ? 'Satin / Matte' : 'Color-Shift / Iridescent');
    toast('BUILD PRELOADED INTO THE WORK ORDER \u2193');
  });
  function pick(key, val){
    const box = document.querySelector('.opts[data-key="'+key+'"]');
    if (!box) return;
    [...box.querySelectorAll('.opt')].forEach(o =>
      o.classList.toggle('on', o.dataset.v === val));
  }
})();

/* ---------- quote funnel ---------- */
(() => {
  const state = {body:null, service:null, film:null, name:'', contact:'', notes:''};
  let step = 1;
  const qs = $$('.q'), steps = $$('.funnel .railq .step');
  const next = $('#qNext'), back = $('#qBack');

  $$('.opts[data-key] .opt').forEach(o => o.addEventListener('click', () => {
    const key = o.closest('.opts').dataset.key;
    [...o.parentElement.querySelectorAll('.opt')].forEach(x=>x.classList.remove('on'));
    o.classList.add('on');
    state[key] = o.dataset.v;
    if (step < 4) setTimeout(() => go(step+1), 320);
  }));
  ['qName','qContact','qNotes'].forEach(id => $('#'+id).addEventListener('input', e => {
    state[{qName:'name', qContact:'contact', qNotes:'notes'}[id]] = e.target.value;
  }));

  function go(s){
    step = s;
    qs.forEach(q => q.classList.toggle('on', +q.dataset.q === s));
    steps.forEach(st => st.classList.toggle('on', +st.dataset.s === Math.min(s,4)));
    $('#qProgress').textContent = s >= 4 ? 'STEP 4 / 4' : 'STEP ' + s + ' / 4';
    back.style.visibility = s === 1 ? 'hidden' : 'visible';
    next.textContent = s === 4 ? 'Build Work Order \u2197' : 'Next \u2192';
    if (s === 5) buildTicket();
    $('.funnel').scrollIntoView({behavior: REDUCED ? 'auto' : 'smooth', block:'nearest'});
  }
  function missing(){
    if (step===1 && !state.body) return 'Pick a body first \u2014 what are we wrapping?';
    if (step===2 && !state.service) return 'Pick a service \u2014 how deep does this go?';
    if (step===3 && !state.film) return 'Pick a film finish \u2014 or pick "Advise Me".';
    if (step===4 && !state.contact.trim()) return 'We need a phone or email to call you back.';
    return null;
  }
  next.onclick = () => {
    const m = missing();
    if (m) return toast(m);
    go(step === 4 ? 5 : step + 1);
  };
  back.onclick = () => go(Math.max(1, step - 1));

  function buildTicket(){
    const no = '#TW-' + String(Math.floor(1000 + Math.random()*9000));
    $('#tktNo').textContent = no;
    $('#tBody').textContent = state.body;
    $('#tService').textContent = state.service;
    $('#tFilm').textContent = state.film;
    $('#tContact').textContent = state.contact;
    $('#tNotes').textContent = state.notes.trim() || '\u2014';
    const lines = [
      'WORK ORDER ' + no,
      'Body: ' + state.body,
      'Service: ' + state.service,
      'Film: ' + state.film,
      'Contact: ' + state.contact,
      'Notes: ' + (state.notes.trim() || 'n/a'),
      '',
      'Sent from the Taylor\u2019d interactive showcase.'
    ].join('\n');
    $('#sendMail').href = 'mailto:info@taylordwraps.com?subject=' +
      encodeURIComponent('WRAP INQUIRY ' + no + ' \u2014 ' + state.body) +
      '&body=' + encodeURIComponent(lines);
    $('#copySpec').onclick = () => {
      navigator.clipboard.writeText(lines).then(()=>toast('SPEC COPIED \u2713'), ()=>toast('COPY BLOCKED \u2014 SELECT MANUALLY'));
    };
    $('#resetQ').onclick = () => {
      Object.keys(state).forEach(k => state[k]=null); state.name=state.contact=state.notes='';
      $$('.opt.on').forEach(o=>o.classList.remove('on'));
      ['qName','qContact','qNotes'].forEach(id => $('#'+id).value='');
      go(1);
    };
  }
})();

/* ---------- wallet + vault ---------- */
(() => {
  const btns = [$('#walletBtn'), $('#walletBtn2')];
  const addrEl = $('#walletAddr');
  let connected = false;
  const short = a => a.slice(0,6) + '\u2026' + a.slice(-4);

  async function connect(){
    if (connected) return;
    let addr = null;
    if (window.ethereum){
      try {
        const [a] = await window.ethereum.request({method:'eth_requestAccounts'});
        addr = a;
      } catch(e){ /* user declined */ }
    }
    if (!addr){
      const hex = '0123456789abcdef';
      addr = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map(b=>hex[b>>4]+hex[b&15]).join('');
      toast('DEMO WALLET GENERATED \u2014 NO REAL FUNDS, NO REAL RUG');
    } else {
      toast('WALLET CONNECTED \u2014 THE VAULT HEARS YOU');
    }
    connected = true;
    addrEl.textContent = short(addr) + ' \u00B7 ' + (window.ethereum ? 'LIVE' : 'DEMO');
    btns.forEach(b => { b.textContent = '\u25C8 ' + short(addr); b.classList.remove('solid'); });
    $('#vaultState').textContent = 'UNLOCKED';
    $('#vault').classList.add('open');
    $('#vaultBtn').textContent = 'Enter';
  }
  btns.forEach(b => b.onclick = connect);
  $('#vaultBtn').onclick = () => {
    if (!connected) return toast('KNOCK KNOCK \u2014 CONNECT A WALLET FIRST');
    $('#vault').classList.add('open');
    $('#vaultState').textContent = 'UNLOCKED';
    toast('VAULT OPEN \u2014 MERCH LIVES OFF-SITE, AS IT SHOULD');
  };
})();

/* ---------- konami psyclone mode ---------- */
(() => {
  const K = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  const psyBtn = $('#psyBtn');
  function togglePsy(){
    const on = document.body.classList.toggle('psylight');
    if (psyBtn) psyBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    toast(on ? 'PSYCLONE MODE ENGAGED \u2014 NO PINK. JK. ALL THE PINK.' : 'PSYCLONE MODE DISENGAGED');
  }
  if (psyBtn) psyBtn.onclick = togglePsy;
  addEventListener('keydown', e => {
    const k = e.key.length===1 ? e.key.toLowerCase() : e.key;
    idx = (k === K[idx]) ? idx+1 : (k === K[0] ? 1 : 0);
    if (idx === K.length){
      idx = 0;
      togglePsy();
    }
  });
})();

/* ---------- easter eggs ---------- */
(() => {
  let buf = '';
  const flash = document.createElement('div'); flash.id = 'flash'; document.body.appendChild(flash);
  function runDog(){
    if ($('#dog')) return;
    const d = document.createElement('div'); d.id = 'dog'; d.textContent = '\u{1F415}';
    document.body.appendChild(d);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ d.style.left = (innerWidth + 40) + 'px'; }));
    setTimeout(()=>{ d.remove(); }, 3700);
    toast('QC INSPECTION UNDERWAY \u2014 STAND CLEAR OF THE SHOP DOG');
  }
  const LOGOS = ['a mailbox.','a grand piano.','a mobility scooter.','a kayak.','a porta-john (we said what we said).','a casket. premium sendoff package.','a hot tub.','a church van (no further questions).'];
  const dayPick = LOGOS[Math.floor(Date.now()/86400000) % LOGOS.length];
  const visits = (+localStorage.getItem('tw_visits') || 0) + 1;
  localStorage.setItem('tw_visits', visits);
  setTimeout(() => {
    if (visits > 1) toast('WELCOME BACK \u2014 VISIT #' + visits + '. TODAY\'S MYSTERY QUEUE: ' + dayPick.toUpperCase());
  }, 5200);
  addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    buf = (buf + (e.key.length===1 ? e.key.toLowerCase() : '')).slice(-8);
    if (buf.endsWith('pink')){
      buf = '';
      document.body.classList.add('pinkmode'); flash.style.opacity = .22;
      toast('NO PINK. ...OKAY FINE. TEN SECONDS. THEN WE NEVER SPEAK OF IT.');
      setTimeout(()=>{ document.body.classList.remove('pinkmode'); flash.style.opacity = 0; }, 10000);
    }
    if (buf.endsWith('dog')){ buf = ''; runDog(); }
  });
  let clicks = 0, ct;
  document.querySelector('nav .logo').addEventListener('click', () => {
    clearTimeout(ct); clicks++;
    ct = setTimeout(()=>clicks=0, 900);
    if (clicks >= 3){ clicks = 0; runDog(); }
  });
})();

/* ---------- hashes (injected at build) ---------- */
(() => {
  const H = {"van": "c7e708cdee63abfbbbf482d8fdc759c0c4c2e5326175b95154294b87acf5d733", "car": "c8d2e3c03de7438c7c40a6f7859509b316d38b1144308cf7c2ebee7a40d7c738", "mack": "89d9aebfbcc464f11b7ae0b58eb210ffb882665a000e9b3d978bc00b351e4fde", "boat": "dfb8ea48d3a99fd80c319a757ff5598861e6ab99df0adb0740cf28cdfa2b2e8a", "livery": "6d63f7aeaf26f3f19eab62efac2693c825a07909390a64901d63f0652cc09c77", "truck": "ea2b06bc17e438910ade0f4a5447b08048c021f6dc01922a9ff4f0104a89a69d"};
  $$('[data-hash]').forEach(el => { el.textContent = (H[el.dataset.hash]||'').slice(0,16) + '\u2026'; });
})();

/* ---------- boot ---------- */
})();


const $v = s => document.querySelector(s);
/* ---------- v1.3: settings drawer + theme + trail toggle ---------- */
(() => {
  const gear = $v('#gearBtn'), drawer = $v('#settingsDrawer'), ov = $v('#drawerOverlay');
  if(!gear || !drawer) return;
  const open = () => { drawer.hidden = false; ov.hidden = false; requestAnimationFrame(() => { drawer.classList.add('open'); }); gear.setAttribute('aria-expanded','true'); };
  const close = () => { drawer.classList.remove('open'); gear.setAttribute('aria-expanded','false'); setTimeout(() => { drawer.hidden = true; ov.hidden = true; }, 300); };
  gear.onclick = open; $v('#drawerClose').onclick = close; ov.onclick = close;
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !drawer.hidden) close(); });

  const setTheme = light => {
    document.body.classList.toggle('light', light);
    $v('#thmDark').setAttribute('aria-pressed', String(!light));
    $v('#thmLight').setAttribute('aria-pressed', String(light));
    try{ localStorage.tw_theme = light ? 'light' : 'dark'; }catch(err){}
  };
  $v('#thmDark').onclick = () => setTheme(false);
  $v('#thmLight').onclick = () => setTheme(true);
  try{ if(localStorage.tw_theme === 'light') setTheme(true); }catch(err){}

  const tb = $v('#trailBtn');
  const setTrail = onFlag => { window.__trailOn = onFlag; tb.textContent = onFlag ? 'ON' : 'OFF';
    tb.setAttribute('aria-pressed', String(onFlag));
    try{ localStorage.tw_trail = onFlag ? 'on' : 'off'; }catch(err){} };
  tb.onclick = () => setTrail(!window.__trailOn);
  try{ setTrail(localStorage.tw_trail !== 'off'); }catch(err){ setTrail(true); }
})();

/* ---------- v1.3: film-trail squeegee cursor ---------- */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(pointer: fine)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'trailCanvas'; document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W, H; const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  fit(); addEventListener('resize', fit);
  const cols = ['168,85,247', '236,72,153', '45,212,191'];
  let ci = Math.floor(Math.random() * 3), last = null, lastT = 0, lastShh = 0;
  const shh = document.createElement('span'); shh.className = 'shh'; shh.textContent = 'shhhk'; document.body.appendChild(shh);
  function stroke(x, y, px, py){
    ctx.strokeStyle = 'rgba(' + cols[ci] + ',.16)';
    ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.10)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(px, py - 6); ctx.lineTo(x, y - 6); ctx.stroke();
  }
  function wipe(x, y, px, py){
    ctx.save(); ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 110; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
  }
  addEventListener('pointermove', e => {
    if (!window.__trailOn) return;
    const t = performance.now(), dt = t - lastT;
    if (last && dt > 4 && dt < 120){
      const v = Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(dt, 1);
      if (v > 2.0){
        wipe(e.clientX, e.clientY, last.x, last.y);
        if (t - lastShh > 1400){ lastShh = t;
          shh.style.left = (e.clientX - 20) + 'px'; shh.style.top = (e.clientY + 14) + 'px';
          shh.classList.remove('pop'); void shh.offsetWidth; shh.classList.add('pop'); }
        ci = (ci + 1) % cols.length;
        last = { x: e.clientX, y: e.clientY }; lastT = t; return;
      }
    }
    if (last) stroke(e.clientX, e.clientY, last.x, last.y);
    last = { x: e.clientX, y: e.clientY }; lastT = t;
  });
  setInterval(() => {
    if (window.__toolActive) return;
    ctx.save(); ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,.02)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }, 2000);
})();

/* ---------- v1.3: arrival kit language toggle ---------- */
(() => {
  const en = $v('#langEN'), es = $v('#langES');
  if(!en || !es) return;
  const set = which => {
    en.classList.toggle('on', which === 'en'); es.classList.toggle('on', which === 'es');
    en.setAttribute('aria-pressed', String(which === 'en')); es.setAttribute('aria-pressed', String(which === 'es'));
    document.querySelectorAll('[data-lang]').forEach(el => { el.hidden = el.getAttribute('data-lang') !== which; });
  };
  en.onclick = () => set('en'); es.onclick = () => set('es');
})();


/* ---------- v1.4: THE TOOLBOX — vinyl paint studio (never blocks the page) ---------- */
(() => {
  const box = document.getElementById('toolbox');
  if (!box) return;
  let cv = document.getElementById('trailCanvas');
  if (!cv){ cv = document.createElement('canvas'); cv.id = 'trailCanvas'; document.body.appendChild(cv); }
  const ctx = cv.getContext('2d');
  let W, H; const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  fit(); addEventListener('resize', fit);

  const OPS = [];            // replayable stroke ops
  let strokes = [];          // groups of ops (for undo)
  let tool = 'trail', film = '#a855f7', last = null, lastT = 0, strokeStart = 0;

  const btns = [...box.querySelectorAll('.tb-btn[data-tool]')];
  const swatches = [...box.querySelectorAll('.swatch')];
  const tip = document.createElement('div'); tip.className = 'tb-tip'; document.body.appendChild(tip);
  const LABELS = { trail: 'CURSOR FILM — slow lays it down', squeegee: 'SQUEEGEE — shhhk it clean', eraser: 'ERASER — lift the film', blade: 'BLADE — score a cut line', heat: 'HEAT GUN — soften & feather' };
  btns.forEach(b => {
    b.addEventListener('mouseenter', () => { tip.textContent = LABELS[b.dataset.tool] || ''; tip.style.top = b.getBoundingClientRect().top + 'px'; tip.classList.add('show'); });
    b.addEventListener('mouseleave', () => tip.classList.remove('show'));
    b.onclick = () => setTool(b.dataset.tool);
  });
  swatches.forEach(s => s.onclick = () => { film = s.dataset.film; swatches.forEach(x => x.classList.toggle('on', x === s)); setTool('film'); });
  function setTool(t){
    tool = t;
    window.__toolActive = t !== 'trail';
    window.__trailOn = t === 'trail';
    btns.forEach(b => { const on = b.dataset.tool === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    if (t !== 'trail' && t !== 'film') last = null;
  }
  window.__paintOps = OPS; window.__paintStrokes = () => strokes;

  function seg(x, y, px, py, w, color, mode, blur){
    ctx.save();
    if (mode === 'erase'){ ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = w; }
    else if (mode === 'feather'){ ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = w; ctx.globalAlpha = .18; }
    else { ctx.strokeStyle = color; ctx.lineWidth = w; }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (blur){ ctx.shadowColor = color; ctx.shadowBlur = blur; }
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    ctx.restore();
    OPS.push({ x, y, px, py, w, color, mode, blur });
  }
  function commit(){
    const now = performance.now();
    if (!strokes.length || now - strokeStart > 260){ strokes.push([]); }
    strokes[strokes.length - 1].push(OPS[OPS.length - 1]);
    strokeStart = now;
  }
  addEventListener('pointermove', e => {
    if (tool === 'trail') return;
    const px = last ? last.x : e.clientX, py = last ? last.y : e.clientY;
    if (tool === 'squeegee'){ seg(e.clientX, e.clientY, px, py, 110, null, 'erase'); seg(e.clientX, e.clientY, px, py, 3, 'rgba(255,255,255,.5)', 'draw'); }
    else if (tool === 'eraser'){ seg(e.clientX, e.clientY, px, py, 60, null, 'erase'); }
    else if (tool === 'blade'){ seg(e.clientX, e.clientY, px, py, 2, 'rgba(255,255,255,.85)', 'draw', 4); }
    else if (tool === 'heat'){ for (let i = 0; i < 3; i++) seg(e.clientX, e.clientY, px, py, 90 + i * 22, null, 'feather'); }
    else if (tool === 'film'){ seg(e.clientX, e.clientY, px, py, 30, film, 'draw'); seg(e.clientX, e.clientY - 8, px, py - 8, 5, 'rgba(255,255,255,.35)', 'draw'); }
    last = { x: e.clientX, y: e.clientY };
    commit();
  });
  addEventListener('pointerdown', () => { last = null; strokeStart = 0; });

  const replay = () => {
    ctx.clearRect(0, 0, W, H);
    OPS.length = 0;
    strokes.flat().forEach(o => {
      ctx.save();
      if (o.mode === 'erase'){ ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = o.w; }
      else if (o.mode === 'feather'){ ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = o.w; ctx.globalAlpha = .18; }
      else { ctx.strokeStyle = o.color; ctx.lineWidth = o.w; }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (o.blur){ ctx.shadowColor = o.color; ctx.shadowBlur = o.blur; }
      ctx.beginPath(); ctx.moveTo(o.px, o.py); ctx.lineTo(o.x, o.y); ctx.stroke();
      ctx.restore();
    });
  };
  document.getElementById('tbUndo').onclick = () => { strokes.pop(); strokes = strokes.filter(s => s.length); replay(); };
  document.getElementById('tbClear').onclick = () => { strokes = []; replay(); };
  window.__toolboxReady = true;
})();


/* ---------- v1.5: STEP 2.5 lettering appears the moment you type ---------- */
(() => {
  const inp = document.getElementById('vizTextInput'), vtxt = document.getElementById('vizText');
  if(!inp || !vtxt) return;
  inp.addEventListener('input', () => {
    if(!vtxt.dataset.placed){
      const stage = vtxt.parentElement;
      const r = stage.getBoundingClientRect();
      vtxt.style.left = Math.round(r.width * .38) + 'px';
      vtxt.style.top = Math.round(r.height * .55) + 'px';
      vtxt.style.opacity = '1';
      vtxt.dataset.placed = '1';
      const chip = document.querySelector('.viz-letter-chip');
      if(chip) chip.textContent = 'LETTERING PLACED \u2014 DRAG TO MOVE IT';
    }
  }, true);
})();

/* ---------- v1.5: vinyl-peel CTA ---------- */
(() => {
  const hero = document.getElementById('hero');
  if(!hero) return;
  const cta = hero.querySelector('.btn');
  if(cta) cta.classList.add('solid');
})();

/* ---------- v1.5: parallax + shader hero ---------- */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.getElementById('hero');
  if(!hero) return;
  const fx = document.createElement('div'); fx.id = 'shaderfx'; hero.style.position = 'relative'; hero.prepend(fx);
  const media = hero.querySelector('img, canvas, .peel-wrap, .stage');
  const copy = hero.querySelector('h1, .h-copy');
  const layers = [];
  if(media) layers.push([media, .12]);
  if(copy) layers.push([copy, -.06]);
  let tick = false;
  addEventListener('scroll', () => {
    if(tick) return; tick = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      layers.forEach(([el, d]) => { el.style.transform = 'translateY(' + (y * d) + 'px)'; });
      tick = false;
    });
  }, { passive: true });
})();

/* ---------- v1.5: tool cursors + wiper sweep + mobile FAB ---------- */
(() => {
  const box = document.getElementById('toolbox');
  if(!box) return;
  const cur = document.createElement('div'); cur.className = 'tool-cursor'; document.body.appendChild(cur);
  const ICONS = { squeegee: '\u{1F9F9}', eraser: '\u25CD', blade: '\u2702', heat: '\u2668' };
  let active = null;
  addEventListener('pointermove', e => {
    const overUI = e.target.closest && e.target.closest('a,button,input,textarea,select,label,.tb-btn,.swatch,#toolbox,.drawer,.tm-modal');
    if(active && ICONS[active] && !overUI){
      cur.textContent = ICONS[active];
      cur.style.display = 'block';
      cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
      document.body.classList.add('toolmode');
    } else {
      cur.style.display = 'none';
      document.body.classList.remove('toolmode');
    }
  });
  const syncTool = () => {
    const on = box.querySelector('.tb-btn.on');
    active = on ? on.dataset.tool : (box.querySelector('.swatch.on') ? 'film' : null);
    if(active === 'film'){ ICONS.film = '\u25C9'; }
  };
  box.addEventListener('click', e => { if(e.target.closest('.tb-btn, .swatch')) syncTool(); });
  new MutationObserver(syncTool).observe(box, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // windshield-wiper sweep: double-click with squeegee clears the whole canvas in one arc
  addEventListener('dblclick', () => {
    if(active !== 'squeegee') return;
    const cv = document.getElementById('trailCanvas'); if(!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, T0 = performance.now(), DUR = 750;
    const blade = document.createElement('div');
    blade.style.cssText = 'position:fixed;top:0;bottom:0;left:0;width:120px;z-index:869;pointer-events:none;background:linear-gradient(90deg,rgba(45,212,191,.35),rgba(45,212,191,.06) 70%,transparent);transform:translateX(-130px)';
    document.body.appendChild(blade);
    (function sweep(now){
      const t = Math.min((now - T0) / DUR, 1);
      const x = -130 + t * (W + 260);
      blade.style.transform = 'translateX(' + x + 'px) skewX(-8deg)';
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(x, 0, 150, H); ctx.restore();
      if(t < 1) requestAnimationFrame(sweep);
      else { blade.remove(); if(window.__paintOps){ window.__paintOps.length = 0; window.__paintStrokes && (window.__paintStrokes().length = 0); } }
    })(T0);
  });

  // mobile FAB
  const fab = document.getElementById('tbFab');
  if(fab) fab.onclick = () => box.classList.toggle('open');
})();

/* ---------- v1.5: arrival kit welcome doors (language copy already in markup) ---------- */
(() => {
  const en = document.getElementById('langEN'), es = document.getElementById('langES');
  if(en) en.classList.add('doodle');
})();


/* ---------- v1.6: TRUE WRAP — film lands on the body, not the backdrop ---------- */
(() => {
  const stage = document.querySelector('.viz .stage');
  const img = document.getElementById('vizImg');
  if(!stage || !img || img.dataset.wrapInit) return;
  img.dataset.wrapInit = '1';
  img.style.filter = 'none';
  const vtxt = document.getElementById('vizText');
  const cv = document.createElement('canvas');
  cv.className = 'viz-canvas'; cv.setAttribute('aria-hidden','true');
  stage.insertBefore(cv, vtxt || null);
  const chip = document.createElement('div');
  chip.className = 'viz-mode-chip';
  stage.appendChild(chip);
  const smooth = (x,a,b) => { const t = Math.min(1, Math.max(0, (x-a)/(b-a))); return t*t*(3-2*t); };
  let raf = 0;
  function render(){
    const st = window.__vizState && window.__vizState();
    if(!st) return;
    const W = img.naturalWidth, H = img.naturalHeight;
    if(!W || !H) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let box = stage.getBoundingClientRect();
    let cw, ch;
    if(box.width > 100){
      cw = Math.round(box.width * dpr); ch = Math.round(box.height * dpr);
    } else {
      // section not laid out yet (off-screen lazy layout): size from the image itself
      const ar = W / H;
      cw = Math.min(1280, W); ch = Math.round(cw / ar);
    }
    const cap = 1400; if(cw > cap){ ch = Math.round(ch * cap / cw); cw = cap; }
    cv.width = cw; cv.height = ch;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    // cover-crop the source like object-fit: cover
    const s = Math.max(cw / W, ch / H);
    const sw = cw / s, sh = ch / s, sx = (W - sw) / 2, sy = (H - sh) / 2;
    const finF = st.FINS && st.FINS[st.fin] ? st.FINS[st.fin].f : '';
    try { cx.filter = finF; } catch(e){}
    cx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    cx.filter = 'none';
    // mask: white / neutral paint = low chroma, mid-high luminance
    const base = cx.getImageData(0, 0, cw, ch);
    const mk = document.createElement('canvas'); mk.width = cw; mk.height = ch;
    const mx = mk.getContext('2d');
    const md = mx.createImageData(cw, ch);
    const p = base.data, q = md.data;
    for(let i = 0; i < p.length; i += 4){
      const r = p[i], g = p[i+1], b = p[i+2];
      const hi = Math.max(r,g,b), lo = Math.min(r,g,b);
      const chroma = (hi - lo) / 255;
      const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
      let wgt = (1 - Math.min(1, chroma * 3.4)) * smooth(lum, .28, .52);
      if(lum < .15) wgt = 0;
      q[i] = q[i+1] = q[i+2] = 255;
      q[i+3] = (wgt * 255) | 0;
    }
    mx.putImageData(md, 0, 0);
    // feather the cut-line
    const mk2 = document.createElement('canvas'); mk2.width = cw; mk2.height = ch;
    const mx2 = mk2.getContext('2d');
    mx2.filter = 'blur(' + Math.max(2, cw/300) + 'px)';
    mx2.drawImage(mk, 0, 0);
    // film layer
    const fl = document.createElement('canvas'); fl.width = cw; fl.height = ch;
    const fx = fl.getContext('2d');
    const hue = st.film.h, sat = Math.max(45, Math.min(92, st.film.s));
    const grad = fx.createLinearGradient(0, 0, cw, ch);
    grad.addColorStop(0, 'hsl(' + hue + ' ' + sat + '% 58%)');
    grad.addColorStop(.45, 'hsl(' + ((hue+34)%360) + ' ' + sat + '% 44%)');
    grad.addColorStop(1, 'hsl(' + ((hue+326)%360) + ' ' + sat + '% 52%)');
    fx.fillStyle = grad; fx.fillRect(0, 0, cw, ch);
    // carbon-weave texture so it reads as material, not a color fill
    fx.globalAlpha = .10; fx.strokeStyle = '#000'; fx.lineWidth = Math.max(1, cw/500);
    fx.beginPath();
    for(let x = -ch; x < cw + ch; x += Math.max(7, cw/160)){
      fx.moveTo(x, 0); fx.lineTo(x + ch, ch);
    }
    fx.stroke();
    fx.setLineDash([]);
    fx.globalAlpha = 1;
    // trim film to the body
    fx.globalCompositeOperation = 'destination-in';
    fx.drawImage(mk2, 0, 0);
    fx.globalCompositeOperation = 'source-over';
    // lay the film: color blend keeps every crease and shadow
    cx.save();
    cx.globalCompositeOperation = 'color';
    cx.drawImage(fl, 0, 0);
    cx.globalCompositeOperation = 'multiply';
    cx.globalAlpha = .30;
    cx.drawImage(fl, 0, 0);
    cx.restore();
    chip.textContent = st.body === 'custom'
      ? 'UPLOAD MODE \u2014 hue-wash only; white or neutral paint wraps cleanest. True cut-lines need the shop\u2019s eye.'
      : 'STUDIO PRESET \u2014 the film reads the body, not the backdrop.';
  }
  const schedule = () => { if(raf) return; raf = requestAnimationFrame(() => { raf = 0; render(); }); };
  img.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document.getElementById('vizBadge'), { childList: true, subtree: true, characterData: true });
  if('IntersectionObserver' in window){
    new IntersectionObserver(es => { if(es.some(e => e.isIntersecting)) schedule(); }, { rootMargin: '300px' }).observe(stage);
  }
  addEventListener('resize', schedule);
  if(img.complete && img.naturalWidth) schedule();
})();

/* ---------- v1.6: peel buttons breathe + whisper ---------- */
(() => {
  document.querySelectorAll('.btn.solid').forEach(b => {
    if(b.querySelector('.peel-msg')) return;
    if(!b.dataset.peel){
      b.dataset.peel = b.closest('#hero') ? 'ZERO BUBBLES. GUARANTEED.'
        : b.closest('.funnel') ? 'NO PAYMENT HERE \u2014 WE CALL YOU'
        : 'SHHHK \u2014 HEAR THAT? THAT\u2019S QUALITY';
    }
    const s = document.createElement('span');
    s.className = 'peel-msg'; s.textContent = b.dataset.peel; s.setAttribute('aria-hidden','true');
    b.appendChild(s);
  });
})();

/* ---------- v1.6: scrollspy — the doodle stays where you are ---------- */
(() => {
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  if(!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      const a = map.get(e.target.id);
      if(a && e.isIntersecting){
        links.forEach(x => x.classList.remove('here'));
        a.classList.add('here');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((a, id) => { const s = document.getElementById(id); if(s) obs.observe(s); });
})();

