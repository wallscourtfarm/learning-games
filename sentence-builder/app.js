/* Sentence Builder — core first, then add.
 * Build mode: children build a core sentence (who + doing, then what/where), hear it read
 * back, judge whether it makes sense, and only then add more: extras (Step 3, capped by the
 * teacher) or a second idea joined with and/but/so (Step 4) or because/when/if (Step 5).
 * Fix-it mode: generated run-on, comma-splice, "and… and… and…" and overloaded sentences
 * for children to repair.
 * Nothing about the child is stored; only teacher settings, on this device. Picture word
 * banks live in content.js.
 */
const VERSION = '10.10.26b';

const CAT = {
  who:      {label:'who',      icon:'who',      q:() => 'Who or what is in the picture?'},
  doing:    {label:'doing',    icon:'doing',    q:s => `What is ${whoPhrase(s)} doing?`},
  what:     {label:'what',     icon:'what',     q:() => 'What?'},
  where:    {label:'where',    icon:'where',    q:() => 'Where?'},
  describe: {label:'describe', icon:'describe', q:s => `What is ${whoPhrase(s)} like?`},
  how:      {label:'how',      icon:'how',      q:s => `How does ${whoPhrase(s)} do it?`},
  when:     {label:'when',     icon:'when',     q:() => 'When?'}
};
const EXTRAS = ['describe','how','when'];

// Joining words. 'stop' means "end the sentence and start a new one".
const JOINS = {
  stop:    {t:'.',       kind:'stop',   help:'two separate sentences'},
  and:     {t:'and',     kind:'coord',  help:'adds another idea'},
  but:     {t:'but',     kind:'coord',  help:'something different or surprising'},
  so:      {t:'so',      kind:'coord',  help:'what happens because of the first idea'},
  because: {t:'because', kind:'subord', help:'gives the reason'},
  when:    {t:'when',    kind:'subord', help:'tells you the time it happens'},
  if:      {t:'if',      kind:'subord', help:'it only happens if…'}
};

const STEPS = {
  1:{title:'Step 1', sub:'Who + doing',
     mini:[['who','The astronaut'],['doing','floats']]},
  2:{title:'Step 2', sub:'Who + doing + what or where',
     mini:[['who','The astronaut'],['doing','floats'],['where','in the space station']]},
  3:{title:'Step 3', sub:'Add extras (but not too many!)', extras:true,
     mini:[['lit','The'],['describe','happy'],['who','astronaut'],['doing','floats'],['how','slowly']]},
  4:{title:'Step 4', sub:'Join two ideas: and, but, so', joins:['stop','and','but','so'],
     mini:[['who','The rocket'],['doing','blasts off'],['coord','so'],['who','the crowd'],['doing','cheers']]},
  5:{title:'Step 5', sub:'Join two ideas: because, when, if', joins:['because','when','if'],
     mini:[['who','The crowd'],['doing','cheers'],['subord','because'],['who','the rocket'],['doing','blasts off']]}
};
const MAX_STEP = 5;
const GOAL = 5;   // sentences at one step before suggesting the next

const FIXES = {
  runon: {title:'Run-on sentence', icon:'🏃', sub:'Two ideas squashed together with no full stop'},
  comma: {title:'Comma splice',    icon:'✂️', sub:'A comma trying to join two ideas'},
  and:   {title:'And… and… and…',  icon:'🔗', sub:'Too many ideas joined with and'},
  extras:{title:'Too many extras', icon:'🎒', sub:'So many extras the sentence is muddled'}
};

/* ---------- settings (teacher, this device only) ---------- */
const DEFAULTS = {extras:2, voice:true, rate:0.85, readCards:true, step:1};
let settings = {...DEFAULTS};
try { Object.assign(settings, JSON.parse(localStorage.getItem('wfa_sb_settings') || '{}')); } catch(e) {}
if (!STEPS[settings.step]) settings.step = 1;
function saveSettings(){ try { localStorage.setItem('wfa_sb_settings', JSON.stringify(settings)); } catch(e) {} }

/* ---------- state ---------- */
let mode = 'build';      // build | fix
let step = settings.step;
let topic = TOPICS[0];
let pic = null;
let s = null;            // the clause being built
let first = null;        // Steps 4-5: the locked first idea
let join = null;         // Steps 4-5: the joining word id
let phase = 'core';      // core | extras | join | core2 | done
let heard = false;       // read back since the last change?
let stripped = false;    // extras hidden
let covered = false;
let problemSlot = null;
let editing = null;      // a filled block the child has tapped to change
let coachMsg = null;
let fx = null;           // fix-it state
const made = {1:0, 2:0, 3:0, 4:0, 5:0, fix:0};   // this session only

const $ = q => document.querySelector(q);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap = t => t ? t[0].toUpperCase() + t.slice(1) : t;
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const blank = () => ({who:null, doing:null, what:null, where:null, describe:null, how:null, when:null, stop:false});
const plural = n => n === 1 ? '' : 's';
function whoPhrase(st){
  if (!st.who) return 'they';
  const d = st.describe ? st.describe.t + ' ' : '';
  return `${st.who.det} ${d}${st.who.t}`;
}

/* ---------- sentence parts in order ---------- */
// The [describe] who doing what [how] where [when]
function parts(st, opts = {}){
  const hideExtras = opts.core;
  const out = [];
  if (st.who){
    const ds = st.describes || (st.describe ? [st.describe] : []);
    if (ds.length && !hideExtras){
      out.push({kind:'lit', t:st.who.det});
      ds.forEach(d => out.push({kind:'describe', card:d, t:d.t}));
      out.push({kind:'who', card:st.who, t:st.who.t});
    } else out.push({kind:'who', card:st.who, t:`${st.who.det} ${st.who.t}`});
  }
  if (st.doing) out.push({kind:'doing', card:st.doing, t:st.doing.t});
  if (st.what) out.push({kind:'what', card:st.what, t:st.what.t});
  if (!hideExtras) (st.hows || (st.how ? [st.how] : [])).forEach(h => out.push({kind:'how', card:h, t:h.t}));
  if (st.where) out.push({kind:'where', card:st.where, t:st.where.t});
  if (st.when && !hideExtras) out.push({kind:'when', card:st.when, t:st.when.t});
  return out;
}

// Turns a list of tokens into spoken/written text. Punctuation tokens ('.' ',') attach to the
// word before; the word after a full stop gets a capital letter. Returns text + char ranges.
function textOf(tokens){
  let text = '', ranges = [], capNext = true;
  tokens.forEach((tk, i) => {
    let t = tk.t;
    const punct = t === '.' || t === ',';
    if (!punct && capNext) t = cap(t);
    if (!punct && text) text += ' ';
    ranges.push([text.length, text.length + t.length, i]);
    text += t;
    capNext = t === '.';
  });
  return {text, ranges};
}

// All tokens for the sentence being built (both ideas at Steps 4-5).
function buildTokens(opts = {}){
  const tk = [];
  if (first){
    parts(first).forEach(p => tk.push({...p, clause:0}));
    if (join) tk.push({kind:'join', t:JOINS[join].t, clause:-1});
  }
  if (phase !== 'join') parts(s, opts).forEach(p => tk.push({...p, clause:1}));
  if (s.stop) tk.push({kind:'stop', t:'.'});
  return tk;
}

/* ---------- the sense check ---------- */
// Returns the first problem as {slot, msg}, or null. Never says "wrong": it asks the child
// to listen again and points at the block to change.
const fits = (card, key, val) => !card[key] || !val || card[key].includes(val.id);
function check(st, scope){
  const who = st.who, doing = st.doing;
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

// Reads tokens aloud, lifting each block in #line (matched by data-i) as it is spoken.
function speakTokens(tokens, after){
  const {text, ranges} = textOf(tokens);
  const chips = [...document.querySelectorAll('#line [data-i]')];
  const light = i => chips.forEach(c => c.classList.toggle('speaking', +c.dataset.i === i));
  say(text, ci => { const r = ranges.find(r => ci >= r[0] && ci < r[1]); if (r) light(r[2]); },
      () => { light(-1); after && after(); });
}
function readSentence(opts = {}){ speakTokens(buildTokens(opts), () => { heard = true; render(); }); }

/* ---------- home ---------- */
function showHome(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  mode = 'build'; pic = null;
  $('#home').hidden = false; $('#build').hidden = true; $('#homeBtn').hidden = true; $('#stepTag').hidden = true;
  const sc = $('#stepCards'); sc.innerHTML = '';
  Object.entries(STEPS).forEach(([n, st]) => {
    const b = el('button', 'step-card' + (+n === step ? ' on' : ''));
    const mini = st.mini.map(([c, t]) => `<span class="c-${c}${c === 'doing' ? ' dark' : ''}">${esc(t)}</span>`).join('')
      + '<span class="dot">.</span>';
    b.innerHTML = `<h3>${st.title}</h3><p>${st.sub}</p><div class="mini">${mini}</div>`;
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
  const fg = $('#fixCards'); fg.innerHTML = '';
  Object.entries(FIXES).forEach(([id, f]) => {
    const b = el('button', 'step-card fix-card', `<h3>${f.icon} ${esc(f.title)}</h3><p>${esc(f.sub)}</p>`);
    b.onclick = () => startFix(id);
    fg.appendChild(b);
  });
}

function showBuildScreen(p, tag){
  pic = p;
  $('#home').hidden = true; $('#build').hidden = false; $('#homeBtn').hidden = false;
  $('#stepTag').hidden = false; $('#stepTag').innerHTML = tag;
  $('#pic').src = p.img; $('#picTitle').textContent = p.title;
  window.scrollTo(0, 0);
}

/* ---------- build ---------- */
function start(p){
  mode = 'build';
  s = blank(); first = null; join = null;
  phase = 'core'; heard = false; stripped = false; covered = false; problemSlot = null; coachMsg = null; editing = null;
  showBuildScreen(p, `<b>${STEPS[step].title}</b><span class="sub">: ${esc(STEPS[step].sub)}</span>`);
  try { history.replaceState(null, '', `?step=${step}&pic=${topic.id}.${p.id}`); } catch(e) {}
  render();
}

const joinStep = () => !!STEPS[step].joins;
// Step 2-3 practise what/where, so one is required; at Steps 4-5 they are optional again.
const coreDone = () => s.who && s.doing && (step === 1 || joinStep() || s.what || s.where);
const extrasCount = () => EXTRAS.filter(k => s[k]).length;
const building = () => phase === 'core' || phase === 'core2';
// Does this phase end with the child adding the full stop? (Not the first idea at Steps 4-5.)
const needsStop = () => phase === 'core2' || (phase === 'core' && !joinStep());

// Which category should the child fill next while building an idea?
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
    else if (!s[cat] && extrasCount() >= settings.extras){ coachMsg = {cls:'think', ic:'✋', html:`That's ${settings.extras} extra${plural(settings.extras)} already. Too many extras can muddle a sentence! Tap an extra in your sentence to take it away first.`}; render(); return; }
    else s[cat] = card;
    stripped = false; changed(); render(); return;
  }
  if (editing === cat) s[cat] = card;            // replacing a tapped block
  else if (s[cat] && s[cat].id === card.id) s[cat] = null; else s[cat] = card;
  if (!coreDone()) s.stop = false;
  changed(); render();
}

function chooseJoin(id){
  if (settings.readCards && canSpeak() && id !== 'stop') say(JOINS[id].t);
  join = id;
  if (phase === 'join'){ phase = 'core2'; s = blank(); }
  changed(); render();
}

function tapChip(kind, clause){
  if (phase === 'done' && !STEPS[step].extras) return;
  if (clause === 0){
    coachMsg = {cls:'', ic:'🔒', html:'Your first idea is locked because it makes sense. To change it, press <b>Start again</b>.'};
    render(); return;
  }
  if (kind === 'join'){
    editing = editing === 'join' ? null : 'join';
    coachMsg = editing ? {cls:'', ic:'🔄', html:'Choose a different joining word.'} : null;
    render(); return;
  }
  if (!building() && !EXTRAS.includes(kind)){
    coachMsg = {cls:'', ic:'🔒', html:'Your core sentence is locked because it makes sense. You can change the extras. To change the core, press <b>Start again</b>.'};
    render(); return;
  }
  if (building()){
    // Tapping a block opens it for changing; the full stop stays put.
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
  const prob = check(s, phase === 'extras' ? 'all' : 'core');
  if (yes && !prob){
    problemSlot = null;
    if (phase === 'core' && STEPS[step].extras){
      phase = 'extras';
      coachMsg = {cls:'good', ic:'🌟', html:`Brilliant, your core sentence makes sense! It is now locked. Add up to <b>${settings.extras}</b> extra${plural(settings.extras)} to make it more interesting, and keep it making sense.`};
    } else if (phase === 'core' && joinStep()){
      first = s; s = blank(); phase = 'join'; heard = false;
      coachMsg = {cls:'good', ic:'🌟', html:'Great first idea! It is now locked. Next, choose a <b>joining word</b> to add a second idea.'};
    } else {
      phase = 'done'; made[step]++;
      const how = phase === 'done' && first ? (join === 'stop' ? ' Two ideas, two sentences.' : ` Two ideas, joined with <b>${JOINS[join].t}</b>.`) : '';
      coachMsg = {cls:'good', ic:'🌟', html:`Yes! That makes sense.${how} ✏️ Now write it in your book, with capital letters and full stops.`};
    }
  } else if (yes && prob){
    problemSlot = prob.slot; heard = false;
    coachMsg = {cls:'think', ic:'👂', html:prob.msg};
  } else {
    heard = false;
    if (prob){ problemSlot = prob.slot; coachMsg = {cls:'think', ic:'👍', html:'Good listening! ' + prob.msg}; }
    else if (first) coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap a block in your second idea to change it, or tap the <b>joining word</b> to choose a different one.'};
    else coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap the block you want to change, then choose a new one.'};
  }
  render();
}

function render(){
  if (mode === 'fix') return renderFix();
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
  const locked = opts.locked != null ? opts.locked : (!building() && !EXTRAS.includes(kind));
  if (!opts.empty && locked) b.classList.add('locked');
  if (problemSlot === kind && !opts.locked) b.classList.add('problem');
  if (!opts.empty && opts.onTap !== false) b.onclick = opts.onTap || (() => tapChip(kind));
  return b;
}

function joinEl(id, i, opts = {}){
  const j = id ? JOINS[id] : null;
  const kind = j ? j.kind : (opts.kind || (STEPS[step].joins && STEPS[step].joins[0] === 'because' ? 'subord' : 'coord'));
  const b = el('button', `chip join-chip j-${kind}` + (j ? '' : ' empty') + (opts.active ? ' active' : ''));
  if (i != null) b.dataset.i = i;
  const label = !j ? 'joining word' : j.kind === 'stop' ? 'new sentence' : 'joining word';
  b.innerHTML = `<img src="icons/${kind === 'stop' ? 'fullstop' : kind}.png" alt=""><span class="w">${j ? esc(j.t) : '?'}</span><span class="lab">${label}</span>`;
  if (j && opts.onTap !== false) b.onclick = opts.onTap || (() => tapChip('join'));
  else if (!j) b.disabled = true;
  return b;
}

// Appends the slots for the idea being built: filled chips plus empty dashed slots.
function appendBuildSlots(line, startIdx, capFirst){
  const order = step === 1 ? ['who','doing'] : ['who','doing','what','where'];
  const next = phase === 'join' ? [] : nextSlots();
  let i = startIdx;
  order.forEach(k => {
    if (phase !== 'join' && s[k]){
      const t = k === 'who' ? `${s.who.det} ${s.who.t}` : s[k].t;
      const c = chipEl(k, i === startIdx && capFirst ? cap(t) : t, i); if (editing === k) c.classList.add('active');
      line.appendChild(c); i++;
    } else {
      const opt = k === 'what' || k === 'where';
      line.appendChild(chipEl(k, k + '?', null, {empty:true, optional:opt, active:next.includes(k)}));
    }
  });
}

function renderLine(){
  const line = $('#line'); line.innerHTML = '';
  line.classList.toggle('covered', covered);
  if (building() || phase === 'join'){
    let i = 0;
    if (first){
      parts(first).forEach(p => {
        line.appendChild(chipEl(p.kind, i === 0 ? cap(p.t) : p.t, i, {locked:true, onTap:() => tapChip(p.kind, 0)}));
        i++;
      });
      line.appendChild(joinEl(join, join ? i : null, {active: phase === 'join' || editing === 'join'}));
      if (join) i++;
      appendBuildSlots(line, i, join === 'stop');
    } else {
      appendBuildSlots(line, 0, true);
      if (joinStep()){
        line.appendChild(joinEl(null));
        line.appendChild(el('span', 'lit faint', '…'));
      }
    }
  } else {
    // extras / done: render from tokens so describe/how/when sit in the right places
    const tk = buildTokens().filter(t => t.kind !== 'stop');
    tk.forEach((p, i) => {
      const t = (i === 0 || (tk[i - 1] && tk[i - 1].t === '.')) ? cap(p.t) : p.t;
      if (p.kind === 'lit'){ const l = el('span', 'lit', esc(t)); l.dataset.i = i; line.appendChild(l); }
      else if (p.kind === 'join') line.appendChild(joinEl(join, i, {onTap:false}));
      else line.appendChild(chipEl(p.kind, t, i, p.clause === 0 ? {locked:true, onTap:() => tapChip(p.kind, 0)} : {}));
    });
  }
  line.appendChild(el('span', 'stop' + (s.stop ? '' : ' empty'), '.'));
}

function renderTools(){
  const t = $('#lineTools'); t.innerHTML = '';
  const add = (html, cls, fn, dis) => { const b = el('button', 'btn ' + (cls || ''), html); b.onclick = fn; b.disabled = !!dis; t.appendChild(b); return b; };
  const ready = coreDone() && (needsStop() ? s.stop : true);
  if ((building() && ready) || (phase === 'extras' && extrasCount() > 0)){
    if (canSpeak()) add('🔊 Read it to me', heard ? '' : 'primary pulse', () => readSentence());
    add('✅ It makes sense', 'good', () => judge(true), canSpeak() && !heard);
    add('🤔 Not yet', 'think', () => judge(false), canSpeak() && !heard);
  }
  if (phase === 'extras' || (phase === 'done' && STEPS[step].extras)){
    add(stripped ? '👀 Show the extras' : '🔍 Check the core', '', () => {
      stripped = !stripped; render();
      if (stripped){
        coachMsg = {cls:'', ic:'🔍', html:`Without the extras, your core sentence says: <q>${esc(textOf(buildTokens({core:true})).text)}</q> It still makes sense on its own. The extras just add detail.`};
        renderCoach(); readSentence({core:true});
      } else { coachMsg = null; renderCoach(); }
    });
  }
  if (phase === 'done'){
    if (canSpeak()) add('🔊 Read it to me', '', () => readSentence());
    add(covered ? '👀 Show me again' : '🙈 Cover it and write', '', () => { covered = !covered; render(); });
    add('➕ Make another', 'primary', () => start(pic));
    add('🖼️ Next picture', '', () => { const ps = topic.pictures; start(ps[(ps.indexOf(pic) + 1) % ps.length]); });
  } else if (s.who || first){
    add('↺ Start again', '', () => start(pic));
  }
}

function renderCoach(){
  const c = $('#coach');
  let m = coachMsg;
  if (!m){
    if (building()){
      const second = phase === 'core2' ? ' in your second idea' : '';
      if (!s.who) m = {ic:'👀', html: phase === 'core2' ? 'Now build your second idea. Start with <b>who</b>.' : 'Look at the picture. Start with <b>who</b>: tap a who block below.'};
      else if (!s.doing) m = {ic:'👉', html:`Now choose a <b>doing</b> block${second}.`};
      else if (step > 1 && !joinStep() && !s.what && !s.where) m = {ic:'👉', html:'Now add a <b>what</b> or a <b>where</b> (or both).'};
      else if (needsStop() && !s.stop) m = {ic:'⏺️', html:'Finish your sentence with a <b>full stop</b>.'};
      else if (canSpeak() && !heard) m = {ic:'🔊', html:'Press <b>Read it to me</b> and listen carefully.'};
      else m = {ic:'🤔', html:canSpeak() ? 'Does it make sense?' : 'Read it aloud quietly to yourself. Does it make sense?'};
    } else if (phase === 'join'){
      m = {ic:'🔗', html:'Choose a <b>joining word</b> for your second idea.'};
    } else if (phase === 'extras'){
      if (!heard && extrasCount() > 0) m = {ic:'🔊', html:'Read it again with your extras. Does it still make sense?'};
      else m = {ic:'➕', html:`Add up to <b>${settings.extras}</b> extra${plural(settings.extras)}. You have used <b>${extrasCount()}</b>.`};
    }
  }
  if (phase === 'done' && !coachMsg) m = {cls:'good', ic:'✏️', html:'Now write it in your book.'};
  c.className = 'coach ' + (m && m.cls ? m.cls : '');
  let extra = '';
  if (phase === 'done'){
    const n = made[step];
    extra = `<div class="stars">${'⭐'.repeat(Math.min(n, GOAL))}${'☆'.repeat(Math.max(0, GOAL - n))}</div>`;
    if (n >= GOAL && step < MAX_STEP) extra += `<div>You've made ${n} sentences that make sense at ${STEPS[step].title}! Ask your teacher if you're ready for <b>${STEPS[step + 1].title}</b>.</div>`;
  }
  c.innerHTML = m ? `<span class="ic">${m.ic}</span><div>${m.html}${extra}</div>` : '';
  c.hidden = !m;
}

function joinBank(b){
  const g = el('div', 'bank-group');
  g.appendChild(el('div', 'bank-q', `<img src="icons/${STEPS[step].joins[0] === 'because' ? 'subord' : 'coord'}.png" alt=""><span>How does the second idea join on?</span>`));
  const cards = el('div', 'cards');
  STEPS[step].joins.forEach(id => {
    const j = JOINS[id];
    const btn = el('button', `card join-card j-${j.kind}` + (join === id ? ' chosen' : ''),
      `<span class="jw">${id === 'stop' ? '⏺ Full stop' : esc(j.t)}</span><small>${esc(j.help)}</small>`);
    btn.onclick = () => chooseJoin(id);
    cards.appendChild(btn);
  });
  g.appendChild(cards);
  b.appendChild(g);
}

function renderBank(){
  const b = $('#bank'); b.innerHTML = '';
  if (phase === 'done') return;
  if (phase === 'join' || editing === 'join') return joinBank(b);
  const cats = building() ? nextSlots() : EXTRAS;
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
    const q = b.querySelector('.bank-q');
    if (q) q.appendChild(el('span', 'count', `Extras: ${extrasCount()} of ${settings.extras}`));
  }
  if (building() && needsStop() && coreDone() && !s.stop){
    const g = el('div', 'bank-group');
    g.appendChild(el('div', 'bank-q', `<img src="icons/fullstop.png" alt=""><span>Finished? Add a full stop.</span>`));
    const btn = el('button', 'card stop-card', '⏺ Full stop');
    btn.onclick = () => { s.stop = true; changed(); render(); };
    g.appendChild(btn);
    b.appendChild(g);
  }
}

/* ================= FIX-IT MODE ================= */

// A random clause from the picture's word bank that passes the sense check.
function genClause(p, avoidWho){
  for (let n = 0; n < 200; n++){
    const st = blank();
    const whos = p.who.filter(w => !avoidWho || !avoidWho.includes(w.id));
    st.who = rnd(whos.length ? whos : p.who);
    const doings = p.doing.filter(d => fits(d, 'who', st.who));
    if (!doings.length) continue;
    st.doing = rnd(doings);
    const whats = p.what.filter(w => fits(w, 'doing', st.doing));
    const wheres = p.where.filter(w => fits(w, 'who', st.who) && fits(w, 'doing', st.doing));
    if (st.doing.needs === 'what'){ if (!whats.length) continue; st.what = rnd(whats); }
    else if (st.doing.needs !== 'none' && whats.length && Math.random() < .5) st.what = rnd(whats);
    if (!st.what && wheres.length && Math.random() < .6) st.where = rnd(wheres);
    if (check(st, 'core')) continue;
    return st;
  }
  return null;
}

// Word tiles for one clause: [{t, clause}] — splits multi-word blocks into single words.
function wordTiles(st, clause){
  const out = [];
  parts(st).forEach(p => p.t.split(' ').forEach(w => out.push({t:w, clause})));
  return out;
}

function startFix(type, p){
  mode = 'fix';
  p = p || rnd(topic.pictures);
  heard = false; covered = false; coachMsg = null; problemSlot = null;
  fx = {type, stage:'find', tries:0};
  if (type === 'runon' || type === 'comma'){
    const a = genClause(p), b = genClause(p, [a.who.id]);
    fx.clauses = [a, b];
    fx.words = [...wordTiles(a, 0), ...(type === 'comma' ? [{t:',', clause:-1}] : []), ...wordTiles(b, 1)];
    fx.split = fx.words.findIndex(w => w.clause === 1);
    fx.fix = null;
  } else if (type === 'and'){
    const n = p.who.length >= 3 ? 4 : 3;
    const cs = []; const used = [];
    const seen = new Set();
    for (let i = 0, tries = 0; i < n && tries < 300; tries++){
      const c = genClause(p, used.length < p.who.length ? used : null);
      const key = c.who.id + '|' + c.doing.id;          // never the same idea twice
      if (seen.has(key)) continue;
      seen.add(key); cs.push(c); used.push(c.who.id); i++;
    }
    fx.clauses = cs;
    fx.joins = cs.slice(1).map(() => 'and');   // each is 'and' or 'stop'
    fx.stage = 'fix';
  } else if (type === 'extras'){
    fx.stage = 'fix';
    fx.clause = overloaded(p);
  }
  showBuildScreen(p, `<b>${FIXES[type].icon} Fix it</b><span class="sub">: ${esc(FIXES[type].title)}</span>`);
  try { history.replaceState(null, '', `?fix=${type}&pic=${topic.id}.${p.id}`); } catch(e) {}
  render();
}

// A core clause stuffed with extras: two describes, two hows (if the bank allows) and a when.
function overloaded(p){
  for (let n = 0; n < 200; n++){
    const st = genClause(p);
    const ds = shuffle(p.describe.filter(d => fits(d, 'who', st.who))).slice(0, 2);
    const hs = shuffle(p.how.filter(h => fits(h, 'doing', st.doing) && fits(h, 'who', st.who))).slice(0, 2);
    const total = ds.length + hs.length + 1;
    if (total < settings.extras + 2 || (ds.length < 2 && hs.length < 2)) continue;
    st.describes = ds; st.hows = hs; st.when = rnd(p.when);
    return st;
  }
  return genClause(p);
}
const xCount = st => (st.describes || []).length + (st.hows || []).length + (st.when ? 1 : 0);

function fixTokens(){
  if (fx.type === 'runon' || fx.type === 'comma'){
    if (fx.stage === 'find') return [...fx.words.map(w => ({t:w.t})), {t:'.'}];
    const tk = [];
    parts(fx.clauses[0]).forEach(p => tk.push(p));
    if (fx.fix) tk.push({kind:'join', t:JOINS[fx.fix].t});
    else if (fx.type === 'comma') tk.push({kind:'comma', t:','});
    parts(fx.clauses[1]).forEach(p => tk.push(p));
    tk.push({t:'.'});
    return tk;
  }
  if (fx.type === 'and'){
    const tk = [];
    fx.clauses.forEach((c, i) => {
      if (i) tk.push({kind:'join', t:JOINS[fx.joins[i - 1]].t, j:i - 1});
      parts(c).forEach(p => tk.push(p));
    });
    tk.push({t:'.'});
    return tk;
  }
  return [...parts(fx.clause), {t:'.'}];
}

function renderFix(){
  const line = $('#line'); line.innerHTML = '';
  line.classList.toggle('covered', covered);
  const tk = fixTokens();
  const body = tk[tk.length - 1].t === '.' ? tk.slice(0, -1) : tk;
  let capNext = true;
  body.forEach((p, i) => {
    const t = capNext ? cap(p.t) : p.t;
    capNext = p.t === '.';
    if (fx.type !== 'extras' && fx.stage === 'find'){
      // plain word tiles: the child taps where the second idea starts
      if (p.t === ','){ const c = el('span', 'stop comma-mark', ','); c.dataset.i = i; line.appendChild(c); return; }
      const w = el('button', 'word' + (fx.hint && i === fx.split ? ' hint' : ''), esc(t));
      w.dataset.i = i; w.onclick = () => tapWord(i);
      line.appendChild(w); return;
    }
    if (p.kind === 'join'){
      const id = fx.type === 'and' ? fx.joins[p.j] : fx.fix;
      const b = joinEl(id, i, {onTap: fx.type === 'and' && fx.stage !== 'done' ? () => toggleAnd(p.j) : false});
      if (fx.type === 'and' && fx.stage !== 'done') b.classList.add('tappable');
      line.appendChild(b); return;
    }
    if (p.kind === 'comma'){
      const c = el('button', 'chip join-chip j-comma active', `<img src="icons/comma.png" alt=""><span class="w">,</span><span class="lab">comma</span>`);
      c.dataset.i = i; c.disabled = true; line.appendChild(c); return;
    }
    if (p.kind === 'lit'){ const l = el('span', 'lit', esc(t)); l.dataset.i = i; line.appendChild(l); return; }
    const isX = EXTRAS.includes(p.kind);
    const c = chipEl(p.kind, t, i, {locked: fx.type === 'extras' && !isX && !stripped,
      onTap: fx.type === 'extras' && isX && fx.stage !== 'done' ? () => removeExtra(p.kind, p.card) : false});
    if (fx.type === 'extras' && isX && fx.stage !== 'done') c.classList.add('removable');
    line.appendChild(c);
  });
  line.appendChild(el('span', 'stop', '.'));
  if (fx.type === 'runon' && fx.stage === 'fix' && !fx.fix){
    // show the gap where the fix goes
    const gap = joinEl(null, null, {active:true, kind:'coord'});
    const chips = [...line.children];
    const at = chips.findIndex((c, idx) => idx > 0 && c.dataset.i != null && +c.dataset.i === parts(fx.clauses[0]).length);
    if (at > 0) line.insertBefore(gap, chips[at]);
  }
  renderFixTools(); renderFixCoach(); renderFixBank();
}

function tapWord(i){
  if (i === fx.split){
    fx.stage = 'fix'; fx.hint = false; heard = false;
    coachMsg = {cls:'good', ic:'🌟', html: fx.type === 'comma'
      ? 'Yes! That is where the second idea starts. A <b>comma</b> is not strong enough to join two ideas. Choose a fix below.'
      : 'Yes! That is where the second idea starts. Two ideas need a <b>full stop</b> or a <b>joining word</b> between them. Choose a fix below.'};
  } else {
    fx.tries++;
    if (fx.tries >= 2) fx.hint = true;
    coachMsg = {cls:'think', ic:'👂', html:'Not quite. Listen again and find the <b>second who</b>: who else is doing something?' + (fx.hint ? ' Look at the glowing word.' : '')};
  }
  render();
}

function chooseFix(id){
  if (settings.readCards && canSpeak() && id !== 'stop') say(JOINS[id].t);
  fx.fix = id; heard = false; coachMsg = null; render();
}
function toggleAnd(j){
  fx.joins[j] = fx.joins[j] === 'and' ? 'stop' : 'and';
  heard = false; coachMsg = null; render();
}
function removeExtra(kind, card){
  const st = fx.clause;
  if (kind === 'describe') st.describes = st.describes.filter(d => d !== card);
  if (kind === 'how') st.hows = st.hows.filter(h => h !== card);
  if (kind === 'when') st.when = null;
  heard = false; coachMsg = null; stripped = false; render();
}

// Is the fix done? Returns null if fine, or a message.
function fixProblem(){
  if (fx.type === 'runon' || fx.type === 'comma') return fx.fix ? null : 'Choose a fix first.';
  if (fx.type === 'and'){
    let run = 1, most = 1;
    fx.joins.forEach(j => { run = j === 'and' ? run + 1 : 1; most = Math.max(most, run); });
    if (most > 2) return `Listen: one of your sentences still has <b>${most}</b> ideas joined with <b>and</b>. Change another <b>and</b> to a full stop.`;
    return null;
  }
  const st = fx.clause;
  if ((st.hows || []).length > 1) return `<q>${esc(st.hows.map(h => h.t).join(' '))}</q> Two <b>how</b> words side by side muddle the sentence. Take one away.`;
  if ((st.describes || []).length > 1 && xCount(st) > settings.extras) return `Two <b>describe</b> words is a lot. Take one away.`;
  if (xCount(st) > settings.extras) return `There are still <b>${xCount(st)}</b> extras. Take some away until there are no more than <b>${settings.extras}</b>.`;
  return null;
}

function fixJudge(yes){
  const prob = fixProblem();
  if (yes && !prob){
    fx.stage = 'done'; made.fix++;
    coachMsg = {cls:'good', ic:'🌟', html:'You fixed it! ✏️ Now write the fixed sentence in your book.'};
  } else if (yes){
    heard = false; coachMsg = {cls:'think', ic:'👂', html:prob};
  } else {
    heard = false;
    coachMsg = {cls:'think', ic:'👍', html: prob || (fx.type === 'and' ? 'Good thinking. Tap an <b>and</b> to change it.' : fx.type === 'extras' ? 'Good thinking. Tap an extra to take it away.' : 'Good thinking. Choose a different fix.')};
  }
  render();
}

function renderFixTools(){
  const t = $('#lineTools'); t.innerHTML = '';
  const add = (html, cls, fn, dis) => { const b = el('button', 'btn ' + (cls || ''), html); b.onclick = fn; b.disabled = !!dis; t.appendChild(b); return b; };
  const read = () => speakTokens(fixTokens(), () => { heard = true; render(); });
  if (fx.stage === 'find'){
    if (canSpeak()) add('🔊 Read it to me', 'primary', read);
  } else if (fx.stage === 'fix'){
    const ready = fx.type === 'runon' || fx.type === 'comma' ? !!fx.fix : true;
    if (ready){
      if (canSpeak()) add('🔊 Read it to me', heard ? '' : 'primary pulse', read);
      add('✅ It makes sense now', 'good', () => fixJudge(true), canSpeak() && !heard);
      add('🤔 Not yet', 'think', () => fixJudge(false), canSpeak() && !heard);
    }
    if (fx.type === 'extras') add(stripped ? '👀 Show the extras' : '🔍 Check the core', '', () => {
      stripped = !stripped; render();
      if (stripped){ coachMsg = {cls:'', ic:'🔍', html:`The core sentence is <q>${esc(textOf([...parts(fx.clause, {core:true}), {t:'.'}]).text)}</q> Keep the extras that help, and take away the rest.`}; renderFixCoach(); speakTokens([...parts(fx.clause, {core:true}), {t:'.'}]); }
      else { coachMsg = null; renderFixCoach(); }
    });
  } else {
    if (canSpeak()) add('🔊 Read it to me', '', read);
    add(covered ? '👀 Show me again' : '🙈 Cover it and write', '', () => { covered = !covered; render(); });
    add('➕ Fix another', 'primary', () => startFix(fx.type));
  }
  if (fx.stage !== 'done') add('↺ A different one', '', () => startFix(fx.type));
}

function renderFixCoach(){
  const c = $('#coach');
  let m = coachMsg;
  if (!m){
    if (fx.stage === 'find') m = {ic:'🔎', html: fx.type === 'comma'
      ? 'This sentence has <b>two ideas</b> joined with just a comma. Listen, then tap the word where the <b>second idea</b> starts.'
      : 'This sentence has <b>two ideas</b> squashed together. Listen, then tap the word where the <b>second idea</b> starts.'};
    else if (fx.type === 'and') m = {ic:'🔗', html:'Too many <b>and</b>s! A sentence should have no more than <b>two</b> ideas. Tap an <b>and</b> to change it to a full stop.'};
    else if (fx.type === 'extras') m = {ic:'🎒', html:`This sentence has so many extras it is muddled. Tap extras to take them away until there are no more than <b>${settings.extras}</b>.`};
    else if (!fx.fix) m = {ic:'🔧', html:'Choose a fix.'};
    else m = {ic:'🔊', html: canSpeak() ? 'Listen to your fixed sentence. Does it make sense now?' : 'Read it aloud quietly. Does it make sense now?'};
  }
  if (fx.stage === 'done'){
    const n = made.fix;
    m = {...m, html: m.html + `<div class="stars">${'⭐'.repeat(Math.min(n, GOAL))}${'☆'.repeat(Math.max(0, GOAL - n))}</div>`};
  }
  c.className = 'coach ' + (m.cls || '');
  c.innerHTML = `<span class="ic">${m.ic}</span><div>${m.html}</div>`;
  c.hidden = false;
}

function renderFixBank(){
  const b = $('#bank'); b.innerHTML = '';
  if (fx.stage === 'done') return;
  if ((fx.type === 'runon' || fx.type === 'comma') && fx.stage === 'fix'){
    const g = el('div', 'bank-group');
    g.appendChild(el('div', 'bank-q', `<img src="icons/coord.png" alt=""><span>How will you fix it?</span>`));
    const cards = el('div', 'cards');
    ['stop','and','but','so'].forEach(id => {
      const j = JOINS[id];
      const btn = el('button', `card join-card j-${j.kind}` + (fx.fix === id ? ' chosen' : ''),
        `<span class="jw">${id === 'stop' ? '⏺ Full stop' : esc(j.t)}</span><small>${esc(j.help)}</small>`);
      btn.onclick = () => chooseFix(id);
      cards.appendChild(btn);
    });
    g.appendChild(cards); b.appendChild(g);
  } else if (fx.type === 'extras'){
    const g = el('div', 'bank-group');
    g.appendChild(el('div', 'bank-q', `<span>Tap an extra in the sentence to take it away.</span><span class="count">Extras: ${xCount(fx.clause)} (keep ${settings.extras} or fewer)</span>`));
    b.appendChild(g);
  }
}

/* ---------- teacher settings ---------- */
function openSettings(){
  const m = $('#modalBox');
  const seg = (key, opts) => `<div class="seg" data-k="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(settings[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  m.innerHTML = `
    <h2>⚙️ Teacher settings</h2>
    <div class="row"><label>Extras allowed (Step 3 and Fix it)</label>${seg('extras', [[1,'1'],[2,'2'],[3,'3']])}</div>
    <div class="row"><label>Read aloud</label>${seg('voice', [[true,'On'],[false,'Off']])}</div>
    <div class="row"><label>Reading speed</label>${seg('rate', [[0.7,'Slow'],[0.85,'Steady'],[1,'Normal']])}</div>
    <div class="row"><label>Say each block when tapped</label>${seg('readCards', [[true,'On'],[false,'Off']])}</div>
    <h3>How it works</h3>
    <ul>
      <li><b>Core first.</b> Children build who + doing (Step 1), then what or where (Step 2). Nothing else is offered until the core is done.</li>
      <li><b>Hear it, judge it.</b> The sentence is read back block by block. The child decides whether it makes sense. If it doesn't, the tool asks them to listen again and points at the block to change. It never says "wrong".</li>
      <li><b>Some doing words need a what</b> ("holds…what?") and some can't take one ("floats"). The word banks know which, so children meet this idea through listening.</li>
      <li><b>Extras last (Step 3).</b> The core locks once it makes sense. Extras (describe, how, when) are capped at the number above. <b>Check the core</b> hides the extras to show the core still stands on its own.</li>
      <li><b>One idea at a time (Steps 4–5).</b> The first idea must make sense and lock before a joining word is offered. Step 4 gives a full stop, <i>and</i>, <i>but</i> or <i>so</i>; Step 5 gives <i>because</i>, <i>when</i> or <i>if</i>. Each joining word shows what it means. The tool checks each idea; the child judges whether the joining word fits.</li>
      <li><b>Fix it.</b> Sentences are made from the picture's word cards, so there is always a new one. <b>Run-on</b> and <b>comma splice</b>: find where the second idea starts, then fix it. <b>And… and…</b>: change ands to full stops until no sentence has more than two ideas. <b>Too many extras</b>: take extras away until there are no more than the number above.</li>
      <li><b>Steps are by need, not year group.</b> After ${GOAL} sentences at a step the child is told to ask you about moving on. You decide.</li>
    </ul>
    <h3>Setting a child's activity</h3>
    <p>Open a picture or a Fix it activity, then bookmark the page or save it to the iPad home screen. The address remembers it, e.g. <code>?step=4&amp;pic=space.launch</code> or <code>?fix=runon</code>.</p>
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
  if (t) topic = t;
  const pp = t && t.pictures.find(x => x.id === pid);
  const fix = p.get('fix');
  if (FIXES[fix]){ startFix(fix, pp || null); return; }
  if (pp){ start(pp); return; }
  showHome();
})();
