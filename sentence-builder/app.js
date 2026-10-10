/* Sentence Builder — core first, then add.
 * Children build a core sentence (who + doing, then what/where), hear it read back, judge
 * whether it makes sense, and only then add extras (describe / how / when), up to a limit
 * the teacher sets. "Check the core" hides the extras so the child can see the core still
 * stands on its own. Nothing about the child is stored; only teacher settings, on this
 * device. Picture word banks live in content.js.
 */
const VERSION = '10.10.26a';

const CAT = {
  who:      {label:'who',      icon:'who',      q:() => 'Who or what is in the picture?'},
  doing:    {label:'doing',    icon:'doing',    q:s => `What is ${whoPhrase(s)} doing?`},
  what:     {label:'what',     icon:'what',     q:() => 'What?'},
  where:    {label:'where',    icon:'where',    q:() => 'Where?'},
  describe: {label:'describe', icon:'describe', q:s => `What is ${whoPhrase(s,true)} like?`},
  how:      {label:'how',      icon:'how',      q:s => `How does ${whoPhrase(s,true)} do it?`},
  when:     {label:'when',     icon:'when',     q:() => 'When?'}
};
const EXTRAS = ['describe','how','when'];

const STEPS = {
  1:{title:'Step 1', sub:'Who + doing', core:['who','doing'], extras:false,
     mini:[['who','The astronaut'],['doing','floats']]},
  2:{title:'Step 2', sub:'Who + doing + what or where', core:['who','doing','what','where'], extras:false,
     mini:[['who','The astronaut'],['doing','floats'],['where','in the space station']]},
  3:{title:'Step 3', sub:'Add extras (but not too many!)', core:['who','doing','what','where'], extras:true,
     mini:[['describe','happy'],['who','astronaut'],['doing','floats'],['how','slowly'],['where','in the space station']]}
};
const GOAL = 5;   // sentences at one step before suggesting the next

/* ---------- settings (teacher, this device only) ---------- */
const DEFAULTS = {extras:2, voice:true, rate:0.85, readCards:true, step:1};
let settings = {...DEFAULTS};
try { Object.assign(settings, JSON.parse(localStorage.getItem('wfa_sb_settings') || '{}')); } catch(e) {}
function saveSettings(){ try { localStorage.setItem('wfa_sb_settings', JSON.stringify(settings)); } catch(e) {} }

/* ---------- state ---------- */
let step = settings.step;
let topic = TOPICS[0];
let pic = null;
let s = null;            // the sentence being built
let phase = 'core';      // core | extras | done
let heard = false;       // read back since the last change?
let stripped = false;    // extras hidden
let covered = false;
let problemSlot = null;
let editing = null;     // a filled core block the child has tapped to change
let coachMsg = null;
const made = {1:0, 2:0, 3:0};   // this session only

const $ = q => document.querySelector(q);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap = t => t ? t[0].toUpperCase() + t.slice(1) : t;
function whoPhrase(st, lower){
  if (!st.who) return 'they';
  const d = st.describe ? st.describe.t + ' ' : '';
  return `${st.who.det} ${d}${st.who.t}`;
}

/* ---------- sentence text in order ---------- */
// The [describe] who doing what [how] where [when].
function parts(st, opts = {}){
  const hideExtras = opts.core;
  const out = [];
  if (st.who){
    if (st.describe && !hideExtras){
      out.push({kind:'lit', t:st.who.det});
      out.push({kind:'describe', card:st.describe, t:st.describe.t});
      out.push({kind:'who', card:st.who, t:st.who.t});
    } else out.push({kind:'who', card:st.who, t:`${st.who.det} ${st.who.t}`});
  }
  if (st.doing) out.push({kind:'doing', card:st.doing, t:st.doing.t});
  if (st.what) out.push({kind:'what', card:st.what, t:st.what.t});
  if (st.how && !hideExtras) out.push({kind:'how', card:st.how, t:st.how.t});
  if (st.where) out.push({kind:'where', card:st.where, t:st.where.t});
  if (st.when && !hideExtras) out.push({kind:'when', card:st.when, t:st.when.t});
  return out;
}
function sentenceText(st, opts){
  const t = parts(st, opts).map(p => p.t).join(' ');
  return cap(t) + (st.stop ? '.' : '');
}

/* ---------- the sense check ---------- */
// Returns the first problem as {slot, msg}, or null. Never says "wrong": it asks the child
// to listen again and points at the block to change.
function check(st, scope){
  const who = st.who, doing = st.doing;
  const fits = (card, key, val) => !card[key] || !val || card[key].includes(val.id);
  const listen = t => `Listen again: <q>${esc(t)}</q>.`;
  if (doing && !fits(doing, 'who', who))
    return {slot:'doing', msg:`${listen(cap(whoPhrase(st)) + ' ' + doing.t)} Does that make sense? Try a different <b>doing</b> block.`};
  if (doing && doing.needs === 'what' && !st.what){
    if (step === 1) return {slot:'doing', msg:`<q>${esc(cap(whoPhrase(st)))} ${esc(doing.t)}…</q> ${esc(doing.t)} what? This doing word needs a <b>what</b> after it. Try a doing word that makes sense on its own.`};
    return {slot:'what', msg:`<q>${esc(cap(whoPhrase(st)))} ${esc(doing.t)}…</q> ${esc(doing.t)} what? This doing word needs a <b>what</b>. Add a what block.`};
  }
  if (doing && doing.needs === 'none' && st.what)
    return {slot:'what', msg:`${listen(doing.t + ' ' + st.what.t)} Does that go together? Take the <b>what</b> away, or try a different doing block.`};
  if (st.what && !fits(st.what, 'doing', doing))
    return {slot:'what', msg:`${listen(doing.t + ' ' + st.what.t)} Does that go together? Try a different <b>what</b> block.`};
  if (st.where && (!fits(st.where, 'who', who) || !fits(st.where, 'doing', doing)))
    return {slot:'where', msg:`${listen(cap(whoPhrase(st)) + ' ' + doing.t + ' ' + st.where.t)} Does that make sense? Try a different <b>where</b> block.`};
  if (scope === 'all'){
    if (st.describe && !fits(st.describe, 'who', who))
      return {slot:'describe', msg:`${listen(cap(whoPhrase(st)))} Does that word describe it? Try a different <b>describe</b> block.`};
    if (st.how && (!fits(st.how, 'doing', doing) || !fits(st.how, 'who', who)))
      return {slot:'how', msg:`${listen(doing.t + ' ' + st.how.t)} Does that go together? Try a different <b>how</b> block.`};
  }
  return null;
}

/* ---------- read aloud ---------- */
let voice = null;
function pickVoice(){
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /en-GB/i.test(v.lang) && /female|serena|kate|libby|sonia|martha|google uk english female/i.test(v.name))
       || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
const canSpeak = () => settings.voice && 'speechSynthesis' in window;

function say(text, onWord, onEnd){
  if (!canSpeak()){ onEnd && onEnd(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = 'en-GB'; u.rate = settings.rate;
  if (onWord) u.onboundary = e => { if (e.name === 'word' || e.name === undefined) onWord(e.charIndex); };
  let done = false;
  const fin = () => { if (!done){ done = true; onEnd && onEnd(); } };
  u.onend = fin; u.onerror = fin;
  speechSynthesis.speak(u);
}

// Reads the sentence, lifting each coloured block as it is spoken.
function readSentence(opts = {}){
  const ps = parts(s, opts);
  const chips = [...document.querySelectorAll('#line [data-i]')];
  const ranges = []; let pos = 0;
  ps.forEach((p, i) => { ranges.push([pos, pos + p.t.length, i]); pos += p.t.length + 1; });
  const text = sentenceText(s, opts);
  const light = i => chips.forEach(c => c.classList.toggle('speaking', +c.dataset.i === i));
  say(text, ci => { const r = ranges.find(r => ci >= r[0] && ci < r[1]); if (r) light(r[2]); },
      () => { light(-1); heard = true; render(); });
  if (!canSpeak()){ heard = true; }
}

/* ---------- home ---------- */
function showHome(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#home').hidden = false; $('#build').hidden = true; $('#homeBtn').hidden = true; $('#stepTag').hidden = true;
  const sc = $('#stepCards'); sc.innerHTML = '';
  Object.entries(STEPS).forEach(([n, st]) => {
    const b = el('button', 'step-card' + (+n === step ? ' on' : ''));
    const mini = st.mini.map(([c, t]) => `<span class="c-${c}${c === 'doing' ? ' dark' : ''}">${esc(t)}</span>`).join('')
      + '<span class="dot">.</span>';
    b.innerHTML = `<h3>${st.title}</h3><p>${st.sub}</p><div class="mini">${n === '3' ? '<span class="dot" style="font-weight:400;font-family:Andika">The</span>' : ''}${mini}</div>`;
    b.onclick = () => { step = +n; settings.step = step; saveSettings(); showHome(); };
    sc.appendChild(b);
  });
  const tt = $('#topicTabs'); tt.innerHTML = '';
  TOPICS.forEach(t => {
    const b = el('button', t === topic ? 'on' : '', `${esc(t.label)} <small>(${esc(t.years)})</small>`);
    b.onclick = () => { topic = t; showHome(); };
    tt.appendChild(b);
  });
  const g = $('#picGrid'); g.innerHTML = '';
  topic.pictures.forEach(p => {
    const b = el('button', 'pic-card', `<img src="${p.img}" alt="" loading="lazy"><div>${esc(p.title)}</div>`);
    b.onclick = () => start(p);
    g.appendChild(b);
  });
}

/* ---------- build ---------- */
function start(p){
  pic = p;
  s = {who:null, doing:null, what:null, where:null, describe:null, how:null, when:null, stop:false};
  phase = 'core'; heard = false; stripped = false; covered = false; problemSlot = null; coachMsg = null; editing = null;
  $('#home').hidden = true; $('#build').hidden = false; $('#homeBtn').hidden = false;
  $('#stepTag').hidden = false; $('#stepTag').innerHTML = `<b>${STEPS[step].title}</b><span class="sub">: ${esc(STEPS[step].sub)}</span>`;
  $('#pic').src = p.img; $('#picTitle').textContent = p.title;
  try { history.replaceState(null, '', `?step=${step}&pic=${topic.id}.${p.id}`); } catch(e) {}
  render();
  window.scrollTo(0, 0);
}

const coreDone = () => s.who && s.doing && (step === 1 || s.what || s.where);
const extrasCount = () => EXTRAS.filter(k => s[k]).length;

// Which category should the child fill next during the core phase?
function nextSlots(){
  if (editing) return [editing];
  if (!s.who) return ['who'];
  if (!s.doing) return ['doing'];
  if (step === 1) return [];
  return ['what', 'where'];
}

function changed(){ editing = null; heard = false; problemSlot = null; coachMsg = null; covered = false; }

function choose(cat, card){
  if (settings.readCards && canSpeak()) say(cat === 'who' ? `${card.det} ${card.t}` : card.t);
  if (phase === 'extras' && EXTRAS.includes(cat)){
    if (s[cat] && s[cat].id === card.id) s[cat] = null;
    else if (!s[cat] && extrasCount() >= settings.extras){ coachMsg = {cls:'think', ic:'✋', html:`That's ${settings.extras} extra${settings.extras > 1 ? 's' : ''} already. Too many extras can muddle a sentence! Tap an extra in your sentence to take it away first.`}; render(); return; }
    else s[cat] = card;
    stripped = false; changed(); render(); return;
  }
  if (editing === cat) s[cat] = card;            // replacing a tapped block
  else if (s[cat] && s[cat].id === card.id) s[cat] = null; else s[cat] = card;
  if (!coreDone()) s.stop = false;
  changed(); render();
}

function tapChip(kind){
  if (phase === 'done' && !STEPS[step].extras) return;
  if (phase !== 'core' && !EXTRAS.includes(kind)){
    coachMsg = {cls:'', ic:'🔒', html:'Your core sentence is locked because it makes sense. You can change the extras. To change the core, press <b>Start again</b>.'};
    render(); return;
  }
  if (phase === 'core'){
    // Tapping a core block opens it for changing; the full stop stays put.
    editing = editing === kind ? null : kind;
    problemSlot = editing ? problemSlot : null;
    coachMsg = editing ? {cls:'', ic:'🔄', html:`Choose a new <b>${CAT[kind].label}</b> block.`} : null;
    render(); return;
  }
  if (phase === 'done'){ phase = 'extras'; }
  s[kind] = null;
  changed(); render();
}

function judge(yes){
  const scope = phase === 'core' ? 'core' : 'all';
  const prob = check(s, scope);
  if (yes && !prob){
    problemSlot = null;
    if (phase === 'core' && STEPS[step].extras){
      phase = 'extras';
      coachMsg = {cls:'good', ic:'🌟', html:`Brilliant, your core sentence makes sense! It is now locked. Add up to <b>${settings.extras}</b> extra${settings.extras > 1 ? 's' : ''} to make it more interesting, and keep it making sense.`};
    } else {
      phase = 'done'; made[step]++;
      coachMsg = {cls:'good', ic:'🌟', html:`Yes! That sentence makes sense. ✏️ Now write it in your book, with a capital letter and a full stop.`};
    }
  } else if (yes && prob){
    problemSlot = prob.slot; heard = false;
    coachMsg = {cls:'think', ic:'👂', html:prob.msg};
  } else {
    heard = false;
    if (prob){ problemSlot = prob.slot; coachMsg = {cls:'think', ic:'👍', html:'Good listening! ' + prob.msg}; }
    else coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap the block you want to change, then choose a new one.'};
  }
  render();
}

function render(){
  renderLine(); renderTools(); renderCoach(); renderBank();
}

function chipEl(kind, text, i, opts = {}){
  const c = CAT[kind];
  const b = el('button', `chip c-${kind}`);
  b.style.setProperty('--slot', `var(--${kind})`);
  if (i != null) b.dataset.i = i;
  b.innerHTML = `<img src="icons/${c.icon}.png" alt=""><span class="w">${esc(text)}</span><span class="lab">${c.label}</span>`;
  if (opts.empty){ b.classList.add('empty'); b.disabled = true; }
  if (opts.optional) b.classList.add('optional');
  if (opts.active) b.classList.add('active');
  if (EXTRAS.includes(kind)) b.classList.add('extra');
  if (stripped && EXTRAS.includes(kind)) b.classList.add('hiddenx');
  if (!opts.empty && phase !== 'core' && !EXTRAS.includes(kind)) b.classList.add('locked');
  if (problemSlot === kind) b.classList.add('problem');
  if (!opts.empty) b.onclick = () => tapChip(kind);
  return b;
}

function renderLine(){
  const line = $('#line'); line.innerHTML = '';
  line.classList.toggle('covered', covered);
  if (phase === 'core'){
    // Show every slot for this step from the start, so the child sees the shape of the sentence.
    const order = step === 1 ? ['who','doing'] : ['who','doing','what','where'];
    const next = nextSlots();
    let i = 0;
    order.forEach(k => {
      if (s[k]){
        const t = k === 'who' ? `${s.who.det} ${s.who.t}` : s[k].t;
        const c = chipEl(k, i === 0 ? cap(t) : t, i); if (editing === k) c.classList.add('active');
        line.appendChild(c); i++;
      } else {
        const opt = k === 'what' || k === 'where';
        line.appendChild(chipEl(k, k + '?', null, {empty:true, optional:opt, active:next.includes(k)}));
      }
    });
  } else {
    parts(s).forEach((p, i) => {
      const t = i === 0 ? cap(p.t) : p.t;
      if (p.kind === 'lit'){ const l = el('span', 'lit', esc(t)); l.dataset.i = i; line.appendChild(l); }
      else line.appendChild(chipEl(p.kind, t, i));
    });
  }
  line.appendChild(el('span', 'stop' + (s.stop ? '' : ' empty'), '.'));
}

function renderTools(){
  const t = $('#lineTools'); t.innerHTML = '';
  const add = (html, cls, fn, dis) => { const b = el('button', 'btn ' + (cls || ''), html); b.onclick = fn; b.disabled = !!dis; t.appendChild(b); return b; };
  const ready = coreDone() && s.stop;
  if (ready && phase !== 'done' && (phase === 'core' || extrasCount() > 0)){
    if (canSpeak()) add('🔊 Read it to me', heard ? '' : 'primary pulse', () => readSentence());
    add('✅ It makes sense', 'good', () => judge(true), canSpeak() && !heard);
    add('🤔 Not yet', 'think', () => judge(false), canSpeak() && !heard);
  }
  if (phase === 'extras' || (phase === 'done' && STEPS[step].extras)){
    add(stripped ? '👀 Show the extras' : '🔍 Check the core', '', () => {
      stripped = !stripped; render();
      if (stripped){
        coachMsg = {cls:'', ic:'🔍', html:`Without the extras, your core sentence says: <q>${esc(sentenceText(s, {core:true}))}</q> It still makes sense on its own. The extras just add detail.`};
        renderCoach(); readSentence({core:true});
      } else { coachMsg = null; renderCoach(); }
    });
  }
  if (phase === 'done'){
    if (canSpeak()) add('🔊 Read it to me', '', () => readSentence());
    add(covered ? '👀 Show me again' : '🙈 Cover it and write', '', () => { covered = !covered; render(); });
    add('➕ Make another', 'primary', () => start(pic));
    add('🖼️ Next picture', '', () => { const ps = topic.pictures; start(ps[(ps.indexOf(pic) + 1) % ps.length]); });
  } else if (s.who){
    add('↺ Start again', '', () => start(pic));
  }
}

function renderCoach(){
  const c = $('#coach');
  let m = coachMsg;
  if (!m){
    if (phase === 'core'){
      if (!s.who) m = {ic:'👀', html:'Look at the picture. Start with <b>who</b>: tap a who block below.'};
      else if (!s.doing) m = {ic:'👉', html:'Now choose a <b>doing</b> block.'};
      else if (step > 1 && !s.what && !s.where) m = {ic:'👉', html:'Now add a <b>what</b> or a <b>where</b> (or both).'};
      else if (!s.stop) m = {ic:'⏺️', html:'Finish your sentence with a <b>full stop</b>.'};
      else if (canSpeak() && !heard) m = {ic:'🔊', html:'Press <b>Read it to me</b> and listen carefully.'};
      else m = {ic:'🤔', html:canSpeak() ? 'Does your sentence make sense?' : 'Read your sentence aloud quietly to yourself. Does it make sense?'};
    } else if (phase === 'extras'){
      if (!heard && extrasCount() > 0) m = {ic:'🔊', html:'Read it again with your extras. Does it still make sense?'};
      else m = {ic:'➕', html:`Add up to <b>${settings.extras}</b> extra${settings.extras > 1 ? 's' : ''}. You have used <b>${extrasCount()}</b>.`};
    }
  }
  if (phase === 'done' && !coachMsg) m = {cls:'good', ic:'✏️', html:'Now write it in your book.'};
  c.className = 'coach ' + (m && m.cls ? m.cls : '');
  let extra = '';
  if (phase === 'done'){
    const n = made[step];
    extra = `<div class="stars">${'⭐'.repeat(Math.min(n, GOAL))}${'☆'.repeat(Math.max(0, GOAL - n))}</div>`;
    if (n >= GOAL && step < 3) extra += `<div>You've made ${n} sentences that make sense at ${STEPS[step].title}! Ask your teacher if you're ready for <b>${STEPS[step + 1].title}</b>.</div>`;
  }
  c.innerHTML = m ? `<span class="ic">${m.ic}</span><div>${m.html}${extra}</div>` : '';
  c.hidden = !m;
}

function renderBank(){
  const b = $('#bank'); b.innerHTML = '';
  if (phase === 'done') return;
  let cats = [];
  if (phase === 'core') cats = nextSlots();
  else cats = EXTRAS;
  // allow changing a filled core part: show its bank while core is being built
  cats.forEach(cat => {
    const g = el('div', 'bank-group');
    const q = el('div', 'bank-q', `<img src="icons/${CAT[cat].icon}.png" alt=""><span>${esc(CAT[cat].q(s))}</span>`);
    if (phase === 'extras' && cat === 'describe') q.querySelector('span').textContent = `Describe ${whoPhrase({...s, describe:null})}:`;
    g.appendChild(q);
    const cards = el('div', 'cards');
    (pic[cat] || []).forEach(card => {
      const btn = el('button', `card c-${cat}` + (s[cat] && s[cat].id === card.id ? ' chosen' : ''), esc(cat === 'who' ? `${card.det} ${card.t}` : card.t));
      if (phase === 'extras' && !s[cat] && extrasCount() >= settings.extras) btn.disabled = true;
      btn.onclick = () => choose(cat, card);
      cards.appendChild(btn);
    });
    if (editing === cat && (cat === 'what' || cat === 'where')){
      const x = el('button', 'btn', '✖ Take it away');
      x.style.marginLeft = '4px';
      x.onclick = () => { s[cat] = null; if (!coreDone()) s.stop = false; changed(); render(); };
      cards.appendChild(x);
    }
    g.appendChild(cards);
    b.appendChild(g);
  });
  if (phase === 'extras'){
    b.querySelectorAll('.bank-q').forEach((q, i) => { if (i === 0){ const c = el('span', 'count', `Extras: ${extrasCount()} of ${settings.extras}`); q.appendChild(c); } });
  }
  if (phase === 'core' && coreDone() && !s.stop){
    const g = el('div', 'bank-group');
    g.appendChild(el('div', 'bank-q', `<img src="icons/fullstop.png" alt=""><span>Finished? Add a full stop.</span>`));
    const btn = el('button', 'card stop-card', '⏺ Full stop');
    btn.onclick = () => { s.stop = true; changed(); render(); };
    g.appendChild(btn);
    b.appendChild(g);
  }
}

/* ---------- teacher settings ---------- */
function openSettings(){
  const m = $('#modalBox');
  const seg = (key, opts) => `<div class="seg" data-k="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(settings[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  m.innerHTML = `
    <h2>⚙️ Teacher settings</h2>
    <div class="row"><label>Extras allowed (Step 3)</label>${seg('extras', [[1,'1'],[2,'2'],[3,'3']])}</div>
    <div class="row"><label>Read aloud</label>${seg('voice', [[true,'On'],[false,'Off']])}</div>
    <div class="row"><label>Reading speed</label>${seg('rate', [[0.7,'Slow'],[0.85,'Steady'],[1,'Normal']])}</div>
    <div class="row"><label>Say each block when tapped</label>${seg('readCards', [[true,'On'],[false,'Off']])}</div>
    <h3>How it works</h3>
    <ul>
      <li><b>Core first.</b> Children build who + doing (Step 1), then what or where (Step 2). Nothing else is offered until the core is done.</li>
      <li><b>Hear it, judge it.</b> The sentence is read back block by block. The child decides whether it makes sense. If it doesn't, the tool asks them to listen again and points at the block to change. It never says "wrong".</li>
      <li><b>Some doing words need a what</b> ("holds…what?") and some can't take one ("floats"). The word banks know which, so children meet this idea through listening.</li>
      <li><b>Extras last (Step 3).</b> The core locks once it makes sense. Extras (describe, how, when) are capped at the number above. <b>Check the core</b> hides the extras to show the core still stands on its own.</li>
      <li><b>Steps are by need, not year group.</b> After ${GOAL} sentences at a step the child is told to ask you about moving on. You decide.</li>
    </ul>
    <h3>Setting a child's step</h3>
    <p>Open a picture, then bookmark the page or save it to the iPad home screen. The address remembers the step and picture, e.g. <code>?step=1&amp;pic=space.station</code>.</p>
    <p style="font-size:.9rem;color:#666">No pupil information is stored. Settings are saved on this device only. Version ${VERSION}.</p>
    <div style="text-align:right;margin-top:14px"><button class="btn primary" id="closeSet">Done</button></div>`;
  m.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
    const k = sg.dataset.k, v = b.dataset.v;
    settings[k] = v === 'true' ? true : v === 'false' ? false : Number(v);
    saveSettings(); openSettings(); if (pic && !$('#build').hidden) render();
  }));
  $('#closeSet').onclick = () => { $('#modal').hidden = true; };
  $('#modal').hidden = false;
}

/* ---------- boot ---------- */
$('#ver').textContent = VERSION;
$('#homeLink').onclick = e => { e.preventDefault(); showHome(); try { history.replaceState(null, '', location.pathname); } catch(_) {} };
$('#homeBtn').onclick = () => $('#homeLink').click();
$('#setBtn').onclick = openSettings;
$('#modal').onclick = e => { if (e.target.id === 'modal') $('#modal').hidden = true; };

(function boot(){
  const p = new URLSearchParams(location.search);
  const st = +p.get('step'); if (STEPS[st]) step = st;
  const [tid, pid] = (p.get('pic') || '').split('.');
  const t = TOPICS.find(x => x.id === tid);
  if (t){ topic = t; const pp = t.pictures.find(x => x.id === pid); if (pp){ start(pp); return; } }
  showHome();
})();
