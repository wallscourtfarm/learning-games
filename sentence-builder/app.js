/* Sentence Builder — core first, then add.
 * Build mode: children build a core sentence (who + doing, then what/where), hear it read
 * back, judge whether it makes sense, and only then add more:
 *   Step 3 extras (capped by the teacher) · Steps 4-5 a second idea with a joining word ·
 *   Step 6 a fronted adverbial + comma · Step 7 a relative clause in commas or brackets.
 * Fix it mode: generated run-on, comma-splice, missing-comma, "and… and…" and overloaded
 * sentences for children to repair.
 * Nothing about the child is stored; only teacher settings, on this device. Picture word
 * banks live in content.js; the sentence engine (parts, text, sense check) in engine.js.
 */
const VERSION = '10.10.26c';

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
     mini:[['who','The crowd'],['doing','cheers'],['subord','because'],['who','the rocket'],['doing','blasts off']]},
  6:{title:'Step 6', sub:'Fronted adverbial + comma', front:true,
     mini:[['when','After lunch'],['lit',','],['who','the astronaut'],['doing','eats'],['what','an apple']]},
  7:{title:'Step 7', sub:'Add more about the who (relative clause)', rel:true,
     mini:[['who','The astronaut'],['lit',','],['subord','who'],['doing','smiles'],['lit',','],['doing','floats']]}
};
const MAX_STEP = 7;
const GOAL = 5;   // sentences at one step before suggesting the next

const FIXES = {
  runon:  {title:'Run-on sentence', icon:'🏃', sub:'Two ideas squashed together with no full stop'},
  comma:  {title:'Comma splice',    icon:'✂️', sub:'A comma trying to join two ideas'},
  and:    {title:'And… and… and…',  icon:'🔗', sub:'Too many ideas joined with and'},
  extras: {title:'Too many extras', icon:'🎒', sub:'So many extras the sentence is muddled'},
  nocomma:{title:'Missing comma',   icon:'👆', sub:'A fronted adverbial with no comma after it'}
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
let s = null;            // the clause being built (+ front / rel at Steps 6-7)
let first = null;        // Steps 4-5: the locked first idea
let join = null;         // Steps 4-5: the joining word id
let phase = 'core';      // core | extras | join | core2 | front | comma | rel | ready | done
let heard = false;       // read back since the last change?
let stripped = false;    // extras hidden
let covered = false;
let problemSlot = null;
let editing = null;      // a filled block the child has tapped to change
let coachMsg = null;
let fx = null;           // fix-it state
let moveOpen = false;    // 'Move it' panel showing
let moveSel = null;      // which position the child last tried
const made = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, fix:0};   // this session only

const $ = q => document.querySelector(q);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const plural = n => n === 1 ? '' : 's';
const newClause = () => ({...blank(), front:null, frontComma:false, rel:null, relPunct:null});

/* ---------- tokens for the sentence being built ---------- */
function buildTokens(opts = {}){
  if (s.moved && !opts.core) return [...s.moved, ...(s.stop ? [{kind:'stop', t:'.'}] : [])];
  const tk = [];
  if (first){
    parts(first).forEach(p => tk.push({...p, clause:0}));
    if (join) tk.push({kind:'join', t:JOINS[join].t, clause:-1});
  }
  if (phase !== 'join'){
    const core = parts(s, opts).map(p => ({...p, clause:1}));
    if (s.front && !opts.core){
      tk.push({kind:'front', cat:s.front.cat, card:s.front.card, t:s.front.card.t, extra:true});
      if (s.frontComma) tk.push({kind:'punct', t:',', extra:true});
    }
    if (s.rel && !opts.core){
      const at = core.findIndex(p => p.kind === 'who') + 1;
      const r = s.rel, ins = [];
      const [open, close] = s.relPunct === 'brackets' ? ['(', ')'] : s.relPunct === 'commas' ? [',', ','] : [null, null];
      if (open) ins.push({kind:'punct', t:open, extra:true});
      if (r.pron) ins.push({kind:'relw', t:r.pron, extra:true});
      if (r.doing) ins.push({kind:'doing', card:r.doing, t:r.doing.t, rel:true, extra:true});
      if (r.what) ins.push({kind:'what', card:r.what, t:r.what.t, rel:true, extra:true});
      if (r.where) ins.push({kind:'where', card:r.where, t:r.where.t, rel:true, extra:true});
      if (close) ins.push({kind:'punct', t:close, extra:true});
      core.splice(at, 0, ...ins);
    }
    tk.push(...core);
  }
  if (s.stop) tk.push({kind:'stop', t:'.'});
  return tk;
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
  $('#fixNote').textContent = `Fix it sentences use the ${topic.label} pictures.`;
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
  s = newClause(); first = null; join = null;
  phase = 'core'; heard = false; stripped = false; covered = false; problemSlot = null; coachMsg = null; editing = null;
  moveOpen = false; moveSel = null;
  showBuildScreen(p, `<b>${STEPS[step].title}</b><span class="sub">: ${esc(STEPS[step].sub)}</span>`);
  try { history.replaceState(null, '', `?step=${step}&pic=${topic.id}.${p.id}`); } catch(e) {}
  render();
}

const joinStep = () => !!STEPS[step].joins;
// Steps 2-3 practise what/where, so one is required; at Step 1 and Steps 4+ it is optional.
const coreDone = () => s.who && s.doing && (step === 1 || step >= 4 || s.what || s.where);
const extrasCount = () => EXTRAS.filter(k => s[k]).length;
const building = () => phase === 'core' || phase === 'core2';
// Does this phase end with the child adding the full stop? (Not the first idea at Steps 4-5.)
const needsStop = () => phase === 'core2' || (phase === 'core' && !joinStep());

function nextSlots(){
  if (editing) return [editing];
  if (!s.who) return ['who'];
  if (!s.doing) return ['doing'];
  if (step === 1) return [];
  return ['what', 'where'];
}

function changed(){ if (s) s.moved = null; moveOpen = false; moveSel = null; editing = null; heard = false; problemSlot = null; coachMsg = null; covered = false; }

function choose(cat, card){
  if (settings.readCards && canSpeak()) say(cat === 'who' ? np(card) : card.t);
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
  if (phase === 'join'){ phase = 'core2'; s = newClause(); }
  changed(); render();
}

/* Step 6: fronted adverbial */
function chooseFront(cat, card){
  if (settings.readCards && canSpeak()) say(card.t);
  if (cat === 'where' && s.where && s.where.id === card.id){ s.where = null; s.frontMoved = card; }
  s.front = {cat, card};
  phase = 'comma'; changed(); render();
}
function clearFront(){
  if (s.frontMoved){ s.where = s.frontMoved; s.frontMoved = null; }
  s.front = null; s.frontComma = false; phase = 'front'; changed(); render();
}

/* Step 7: relative clause */
function chooseRel(key, val){
  if (settings.readCards && canSpeak()) say(typeof val === 'string' ? val : val.t);
  s.rel = s.rel || {};
  if (key === 'pron'){
    const right = s.who.person ? 'who' : 'which';
    if (val !== right){
      coachMsg = {cls:'think', ic:'🤔', html: s.who.person
        ? `<b>${esc(cap(np(s.who)))}</b> is a person, so we use <b>who</b>.`
        : `<b>${esc(cap(np(s.who)))}</b> is not a person, so we use <b>which</b>.`};
      render(); return;
    }
  }
  if (key === 'punct'){ s.relPunct = val; phase = 'ready'; changed(); render(); return; }
  if (s.rel[key] && s.rel[key].id && val.id === s.rel[key].id) s.rel[key] = null; else s.rel[key] = val;
  if (key === 'doing'){ s.rel.what = null; s.rel.where = null; }
  changed(); render();
}
function clearRel(){ s.rel = null; s.relPunct = null; phase = 'rel'; changed(); render(); }

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
  if (kind === 'front') return clearFront();
  if (kind === 'rel') return clearRel();
  if (!building() && !EXTRAS.includes(kind)){
    coachMsg = {cls:'', ic:'🔒', html:'Your core sentence is locked because it makes sense. To change it, press <b>Start again</b>.'};
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

function finish(extraMsg){
  phase = 'done'; made[step]++;
  coachMsg = {cls:'good', ic:'🌟', html:`Yes! That makes sense.${extraMsg || ''} ✏️ Now write it in your book, with capital letters and full stops.`};
}

function judge(yes){
  let prob = check(s, phase === 'extras' ? 'all' : 'core', step);
  if (!prob && phase === 'ready' && s.front && !frontFits(s, s.front))
    prob = {slot:'front', msg:`Listen again: <q>${esc(textOf(buildTokens()).text)}</q> Does the fronted adverbial go with the rest? Tap it to choose a different one.`};
  if (!prob && phase === 'ready' && s.rel){
    const r = check({who:s.who, doing:s.rel.doing, what:s.rel.what, where:s.rel.where}, 'core', 2);
    if (r) prob = {slot:'rel', msg:r.msg.replace(/Try a different <b>\w+<\/b> block\.|Add a what block\.|Take the <b>what<\/b> away, or try a different doing block\./, 'Tap the extra information to build it again.')};
  }
  if (yes && !prob){
    problemSlot = null;
    if (phase === 'core' && STEPS[step].extras){
      phase = 'extras';
      coachMsg = {cls:'good', ic:'🌟', html:`Brilliant, your core sentence makes sense! It is now locked. Add up to <b>${settings.extras}</b> extra${plural(settings.extras)} to make it more interesting, and keep it making sense.`};
    } else if (phase === 'core' && joinStep()){
      first = s; s = newClause(); phase = 'join'; heard = false;
      coachMsg = {cls:'good', ic:'🌟', html:'Great first idea! It is now locked. Next, choose a <b>joining word</b> to add a second idea.'};
    } else if (phase === 'core' && STEPS[step].front){
      phase = 'front'; heard = false;
      coachMsg = {cls:'good', ic:'🌟', html:'Your sentence makes sense, so it is now locked. Now put a <b>when</b>, <b>where</b> or <b>how</b> at the front of it.'};
    } else if (phase === 'core' && STEPS[step].rel){
      phase = 'rel'; heard = false;
      coachMsg = {cls:'good', ic:'🌟', html:`Your sentence makes sense, so it is now locked. Now add some extra information about <b>${esc(np(s.who))}</b>.`};
    } else {
      const how = first ? (join === 'stop' ? ' Two ideas, two sentences.' : ` Two ideas, joined with <b>${JOINS[join].t}</b>.`)
        : s.front ? ' The comma shows where the fronted adverbial ends.'
        : s.rel ? ` The ${s.relPunct === 'brackets' ? 'brackets hold' : 'commas hold'} the extra information.` : '';
      finish(how);
    }
  } else if (yes && prob){
    problemSlot = prob.slot; heard = false;
    coachMsg = {cls:'think', ic:'👂', html:prob.msg};
  } else {
    heard = false;
    if (prob){ problemSlot = prob.slot; coachMsg = {cls:'think', ic:'👍', html:'Good listening! ' + prob.msg}; }
    else if (first) coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap a block in your second idea to change it, or tap the <b>joining word</b> to choose a different one.'};
    else if (s.front) coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap the <b>fronted adverbial</b> to choose a different one.'};
    else if (s.rel) coachMsg = {cls:'think', ic:'👍', html:'Good thinking. Tap the <b>extra information</b> to build it again.'};
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
  b.innerHTML = `<img src="icons/${c.icon}.png" alt=""><span class="w">${esc(text)}</span><span class="lab">${opts.label || c.label}</span>`;
  if (opts.empty){ b.classList.add('empty'); b.disabled = true; }
  if (opts.optional) b.classList.add('optional');
  if (opts.active) b.classList.add('active');
  const isExtra = opts.extra != null ? opts.extra : EXTRAS.includes(kind);
  if (isExtra) b.classList.add('extra');
  if (stripped && isExtra) b.classList.add('hiddenx');
  const locked = opts.locked != null ? opts.locked : (!building() && !isExtra);
  if (!opts.empty && locked) b.classList.add('locked');
  if (problemSlot && (problemSlot === kind || problemSlot === opts.slot) && !opts.locked) b.classList.add('problem');
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

function markEl(t, i, cls){
  const m = el('span', 'stop mark ' + (cls || ''), esc(t));
  if (i != null) m.dataset.i = i;
  return m;
}

// Appends the slots for the idea being built: filled chips plus empty dashed slots.
function appendBuildSlots(line, startIdx, capFirst){
  const order = step === 1 ? ['who','doing'] : ['who','doing','what','where'];
  const next = phase === 'join' ? [] : nextSlots();
  let i = startIdx;
  order.forEach(k => {
    if (phase !== 'join' && s[k]){
      const t = k === 'who' ? np(s.who) : s[k].t;
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
    line.appendChild(el('span', 'stop' + (s.stop ? '' : ' empty'), '.'));
    return;
  }
  // after the core: render from tokens so everything sits in the right place
  const tk = buildTokens().filter(t => t.kind !== 'stop');
  if (phase === 'front'){
    line.appendChild(chipEl('when', 'when, where or how?', null, {empty:true, active:true, label:'fronted adverbial'}));
    line.appendChild(markEl(',', null, 'empty'));
  }
  let capNext = phase !== 'front';
  const tappable = phase !== 'done';
  tk.forEach((p, i) => {
    const isWord = !['punct','stop'].includes(p.kind);
    const t = isWord && capNext ? cap(p.t) : p.t;
    if (isWord) capNext = false;
    if (p.t === '.') capNext = true;
    if (p.kind === 'lit'){ const l = el('span', 'lit', esc(t)); l.dataset.i = i; line.appendChild(l); }
    else if (p.kind === 'join') line.appendChild(joinEl(join, i, {onTap:false}));
    else if (p.kind === 'punct') line.appendChild(markEl(p.t, i, 'extra' + (stripped ? ' hiddenx' : '')));
    else if (p.kind === 'front'){
      line.appendChild(chipEl(p.cat, t, i, {label:`${p.cat} · fronted`, extra:true, slot:'front', onTap: tappable ? () => tapChip('front') : false}));
      if (phase === 'comma') line.appendChild(markEl(',', null, 'empty active'));
    }
    else if (p.kind === 'relw'){
      const b = el('button', 'chip join-chip j-subord extra' + (stripped ? ' hiddenx' : '') + (problemSlot === 'rel' ? ' problem' : ''),
        `<img src="icons/subord.png" alt=""><span class="w">${esc(t)}</span><span class="lab">extra info</span>`);
      b.dataset.i = i; if (tappable) b.onclick = () => tapChip('rel');
      line.appendChild(b);
    }
    else if (p.rel) line.appendChild(chipEl(p.kind, t, i, {extra:true, slot:'rel', label:`${p.kind} · extra info`, onTap: tappable ? () => tapChip('rel') : false}));
    else line.appendChild(chipEl(p.kind, t, i, p.clause === 0 ? {locked:true, onTap:() => tapChip(p.kind, 0)} : {}));
    // empty placeholders while the relative clause is being started
    if (phase === 'rel' && p.kind === 'who' && !s.rel){
      line.appendChild(markEl(',', null, 'empty'));
      line.appendChild(chipEl('doing', 'who / which…?', null, {empty:true, active:true, label:'extra info'}));
      line.appendChild(markEl(',', null, 'empty'));
    }
  });
  line.appendChild(el('span', 'stop' + (s.stop ? '' : ' empty'), '.'));
}

function renderTools(){
  const t = $('#lineTools'); t.innerHTML = '';
  const add = (html, cls, fn, dis) => { const b = el('button', 'btn ' + (cls || ''), html); b.onclick = fn; b.disabled = !!dis; t.appendChild(b); return b; };
  const ready = coreDone() && (needsStop() ? s.stop : true);
  if ((building() && ready) || (phase === 'extras' && extrasCount() > 0) || phase === 'ready'){
    if (canSpeak()) add('🔊 Read it to me', heard ? '' : 'primary pulse', () => readSentence());
    add('✅ It makes sense', 'good', () => judge(true), canSpeak() && !heard);
    add('🤔 Not yet', 'think', () => judge(false), canSpeak() && !heard);
  }
  const hasExtras = phase === 'extras' || phase === 'ready' || (phase === 'done' && (STEPS[step].extras || s.front || s.rel));
  if (hasExtras){
    add(stripped ? '👀 Show it all' : '🔍 Check the core', '', () => {
      stripped = !stripped; render();
      if (stripped){
        coachMsg = {cls:'', ic:'🔍', html:`Without the extras, your core sentence says: <q>${esc(textOf(buildTokens({core:true})).text)}</q> It still makes sense on its own. The extras just add detail.`};
        renderCoach(); readSentence({core:true});
      } else { coachMsg = null; renderCoach(); }
    });
  }
  if (phase === 'done'){
    if (canSpeak()) add('🔊 Read it to me', '', () => readSentence());
    if (moveGroups().length) add(moveOpen ? '✖ Close Move it' : '🔀 Move it', moveOpen ? '' : 'primary', () => { moveOpen = !moveOpen; moveSel = null; render(); });
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
      else if (step > 1 && step < 4 && !s.what && !s.where) m = {ic:'👉', html:'Now add a <b>what</b> or a <b>where</b> (or both).'};
      else if (needsStop() && !s.stop) m = {ic:'⏺️', html:'Finish your sentence with a <b>full stop</b>.'};
      else if (canSpeak() && !heard) m = {ic:'🔊', html:'Press <b>Read it to me</b> and listen carefully.'};
      else m = {ic:'🤔', html:canSpeak() ? 'Does it make sense?' : 'Read it aloud quietly to yourself. Does it make sense?'};
    } else if (phase === 'join'){
      m = {ic:'🔗', html:'Choose a <b>joining word</b> for your second idea.'};
    } else if (phase === 'front'){
      m = {ic:'⬅️', html:'Choose a <b>fronted adverbial</b>: when, where or how it happens. It goes at the front of the sentence.'};
    } else if (phase === 'comma'){
      m = {ic:'👆', html:'A fronted adverbial needs a <b>comma</b> after it. Add the comma.'};
    } else if (phase === 'rel'){
      const r = s.rel || {};
      if (!r.pron) m = {ic:'➕', html:`Add extra information about <b>${esc(np(s.who))}</b>. Start with <b>who</b> or <b>which</b>.`};
      else if (!r.doing) m = {ic:'👉', html:`What else is ${esc(np(s.who))} doing? Choose a <b>doing</b> block.`};
      else m = {ic:'✌️', html:'Extra information sits inside <b>two commas</b> or <b>brackets</b>. Choose one. You can add a what or a where first.'};
    } else if (phase === 'ready'){
      m = {ic:'🔊', html: canSpeak() ? 'Press <b>Read it to me</b>. Does it still make sense?' : 'Read it aloud quietly. Does it still make sense?'};
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

function cardGroup(b, iconHtml, q, cards){
  const g = el('div', 'bank-group');
  g.appendChild(el('div', 'bank-q', `${iconHtml}<span>${q}</span>`));
  const row = el('div', 'cards');
  cards.forEach(x => row.appendChild(x));
  g.appendChild(row); b.appendChild(g);
  return g;
}
const icon = n => `<img src="icons/${n}.png" alt="">`;
function wordCard(cat, card, chosen, fn){
  const btn = el('button', `card c-${cat}` + (chosen ? ' chosen' : ''), esc(cat === 'who' ? np(card) : card.t));
  btn.onclick = fn; return btn;
}
function plainCard(cls, html, fn){ const b = el('button', 'card ' + cls, html); b.onclick = fn; return b; }

function joinBank(b){
  cardGroup(b, icon(STEPS[step].joins[0] === 'because' ? 'subord' : 'coord'), 'How does the second idea join on?',
    STEPS[step].joins.map(id => {
      const j = JOINS[id];
      return plainCard(`join-card j-${j.kind}` + (join === id ? ' chosen' : ''),
        `<span class="jw">${id === 'stop' ? '⏺ Full stop' : esc(j.t)}</span><small>${esc(j.help)}</small>`, () => chooseJoin(id));
    }));
}

function frontBank(b){
  const groups = [
    ['when', 'When does it happen?', pic.when],
    ['where', s.where ? 'Where? (move it to the front)' : 'Where does it happen?', s.where ? [s.where] : pic.where.filter(w => fits(w, 'who', s.who) && fits(w, 'doing', s.doing))],
    ['how', 'How does it happen?', pic.how]
  ];
  groups.forEach(([cat, q, list]) => {
    if (!list.length) return;
    cardGroup(b, icon(cat), q, list.map(card => wordCard(cat, {...card, t:cap(card.t)}, false, () => chooseFront(cat, card))));
  });
}

function relBank(b){
  const r = s.rel || {};
  if (!r.pron){
    cardGroup(b, icon('subord'), `Which word starts the extra information about ${esc(np(s.who))}?`, [
      plainCard('join-card j-subord', '<span class="jw">who</span><small>for a person</small>', () => chooseRel('pron', 'who')),
      plainCard('join-card j-subord', '<span class="jw">which</span><small>for a thing or an animal</small>', () => chooseRel('pron', 'which'))
    ]);
    return;
  }
  if (!r.doing){
    const list = pic.doing.filter(d => fits(d, 'who', s.who) && d.id !== s.doing.id);
    cardGroup(b, icon('doing'), `What else is ${esc(np(s.who))} doing?`, list.map(card => wordCard('doing', card, false, () => chooseRel('doing', card))));
    return;
  }
  if (r.doing.needs !== 'none'){
    const whats = pic.what.filter(w => fits(w, 'doing', r.doing) && fits(w, 'who', s.who));
    if (whats.length) cardGroup(b, icon('what'), r.doing.needs === 'what' ? `${esc(r.doing.t)}… what?` : 'What? (you can skip this)',
      whats.map(card => wordCard('what', card, r.what && r.what.id === card.id, () => chooseRel('what', card))));
  }
  if (!(r.doing.needs === 'what' && !r.what)){
    const wheres = pic.where.filter(w => fits(w, 'who', s.who) && fits(w, 'doing', r.doing) && (!s.where || w.id !== s.where.id));
    if (wheres.length && !r.what) cardGroup(b, icon('where'), 'Where? (you can skip this)',
      wheres.map(card => wordCard('where', card, r.where && r.where.id === card.id, () => chooseRel('where', card))));
    cardGroup(b, icon('comma'), 'Put the extra information inside…', [
      plainCard('stop-card', 'two commas&nbsp; , &nbsp;,', () => chooseRel('punct', 'commas')),
      plainCard('stop-card', 'brackets&nbsp; ( &nbsp;)', () => chooseRel('punct', 'brackets'))
    ]);
  }
}

function renderBank(){
  const b = $('#bank'); b.innerHTML = '';
  if (phase === 'done' && moveOpen) return moveBank(b);
  if (phase === 'done' || phase === 'ready') return;
  if (phase === 'join' || editing === 'join') return joinBank(b);
  if (phase === 'front') return frontBank(b);
  if (phase === 'comma'){
    cardGroup(b, icon('comma'), 'Add the comma after the fronted adverbial.', [
      plainCard('stop-card', '<b>,</b>&nbsp; Comma', () => { s.frontComma = true; phase = 'ready'; changed(); render(); })
    ]);
    return;
  }
  if (phase === 'rel') return relBank(b);
  const cats = building() ? nextSlots() : EXTRAS;
  cats.forEach(cat => {
    const q = phase === 'extras' && cat === 'describe' ? `Describe ${esc(np(s.who))}:` : esc(CAT[cat].q(s));
    let list = pic[cat] || [];
    if (phase === 'extras' && cat === 'describe' && !s.who.det) list = [];   // no "the" to put it after
    if (!list.length) return;
    const g = cardGroup(b, icon(CAT[cat].icon), q, list.map(card => {
      const btn = wordCard(cat, card, s[cat] && s[cat].id === card.id, () => choose(cat, card));
      if (phase === 'extras' && !s[cat] && extrasCount() >= settings.extras) btn.disabled = true;
      return btn;
    }));
    if (editing === cat && (cat === 'what' || cat === 'where')){
      const x = el('button', 'btn', '✖ Take it away');
      x.style.marginLeft = '4px';
      x.onclick = () => { s[cat] = null; if (!coreDone()) s.stop = false; changed(); render(); };
      g.querySelector('.cards').appendChild(x);
    }
  });
  if (phase === 'extras'){
    const q = b.querySelector('.bank-q');
    if (q) q.appendChild(el('span', 'count', `Extras: ${extrasCount()} of ${settings.extras}`));
  }
  if (building() && needsStop() && coreDone() && !s.stop){
    cardGroup(b, icon('fullstop'), 'Finished? Add a full stop.', [
      plainCard('stop-card', '⏺ Full stop', () => { s.stop = true; changed(); render(); })
    ]);
  }
}

/* ================= MOVE IT ================= */
// Shows where a movable part (a when / where / how, a fronted adverbial, or a because/when/if
// clause) can go in the sentence, with the comma it needs at the front, plus one place it
// cannot go, for contrast. Each position is read aloud when tapped.

const strip = list => list.map(({mv, ...rest}) => rest);
const COMMA = () => ({kind:'punct', t:',', mv:true});

// One movable part inside one clause's tokens.
function moveGroupFor(cat, list, unit){
  const rest = list.filter(p => !unit.includes(p));
  const u = unit.map(p => ({...p, kind:cat, mv:true}));
  const di = rest.findIndex(p => p.kind === 'doing');
  const wi = rest.findIndex(p => p.kind === 'what');
  const opts = [];
  opts.push({tokens:[...u, COMMA(), ...rest], good:true, note:'When it moves to the <b>front</b>, it needs a <b>comma</b> after it.'});
  if (cat === 'how' && /ly$/.test(unit[0].t) && di >= 0)
    opts.push({tokens:[...rest.slice(0, di), ...u, ...rest.slice(di)], good:true, note:'A how word can sit just <b>before the doing</b> word.'});
  if (cat === 'how' && di >= 0){
    const after = wi >= 0 ? wi + 1 : di + 1;
    opts.push({tokens:[...rest.slice(0, after), ...u, ...rest.slice(after)], good:true, note:`It can come straight after the ${wi >= 0 ? '<b>what</b>' : '<b>doing</b> word'}.`});
    if (wi >= 0) opts.push({tokens:[...rest.slice(0, di + 1), ...u, ...rest.slice(di + 1)], good:false, note:'It gets between the <b>doing</b> word and the <b>what</b>. It does not work there.'});
  }
  // a how word after a when sounds clumsy ("…after lunch carefully"), so don't offer it
  if (!(cat === 'how' && rest.length && rest[rest.length - 1].kind === 'when'))
    opts.push({tokens:[...rest, ...u], good:true, note:'It can go at the <b>end</b>.'});
  return {cat, label: textOf(unit).text.toLowerCase(), opts};
}

function moveGroups(){
  if (phase !== 'done') return [];
  const groups = [];
  if (step === 3){
    const list = parts(s);
    ['when','how','where'].forEach(cat => {
      const unit = list.filter(p => p.kind === cat);
      if (unit.length) groups.push(moveGroupFor(cat, list, unit));
    });
  }
  if (step === 6 && s.front){
    const f = {kind:s.front.cat, card:s.front.card, t:s.front.card.t};
    const list = [f, ...parts(s)];
    groups.push(moveGroupFor(s.front.cat, list, [f]));
  }
  if (step === 5 && first && join){
    const A = parts(first);
    const unit = [{kind:'join', t:JOINS[join].t, mv:true}, ...parts(s).map(p => ({...p, mv:true}))];
    const wi = A.findIndex(p => p.kind === 'who');
    groups.push({cat:'subord', label:`${JOINS[join].t}…`, opts:[
      {tokens:[...unit, COMMA(), ...A], good:true, note:`The <b>${JOINS[join].t}</b> part can go at the <b>front</b>. Then it needs a <b>comma</b> after it.`},
      {tokens:[...A.slice(0, wi + 1), ...unit, ...A.slice(wi + 1)], good:false, note:'It splits the <b>who</b> from the <b>doing</b> word. It does not work there.'},
      {tokens:[...A, ...unit], good:true, note:'It can go at the <b>end</b>.'}
    ]});
  }
  // drop duplicates and mark the child's current order
  const now = textOf(strip(buildTokens()).filter(p => p.kind !== 'stop')).text;
  groups.forEach(g => {
    const seen = new Set();
    g.opts = g.opts.filter(o => { const k = textOf(o.tokens).text; if (seen.has(k)) return false; seen.add(k); o.key = k; o.current = k === now; return true; });
  });
  return groups;
}

// A sentence strip: each token in its colour, the moving part outlined.
function stripHtml(tokens){
  const {text, ranges} = textOf([...tokens, {t:'.'}]);
  return ranges.map(([a, b, i]) => {
    const tk = tokens[i] || {kind:'stop'};
    const w = esc(text.slice(a, b));
    const sp = i > 0 && !['.', ',', ')'].includes(text.slice(a, b)) && tokens[i - 1] && tokens[i - 1].t !== '(' ? ' ' : '';
    if (['punct','stop','lit'].includes(tk.kind)) return `${sp}<span class="sp-mark${tk.mv ? ' mv' : ''}">${w}</span>`;
    if (tk.kind === 'join') return `${sp}<span class="sp-join${tk.mv ? ' mv' : ''}">${w}</span>`;
    return `${sp}<span class="c-${tk.kind}${tk.kind === 'doing' ? ' dark' : ''}${tk.mv ? ' mv' : ''}">${w}</span>`;
  }).join('');
}

function moveBank(b){
  const groups = moveGroups();
  groups.forEach((g, gi) => {
    const box = el('div', 'bank-group');
    box.appendChild(el('div', 'bank-q', `<span>🔀 Where else can <q>${esc(g.label)}</q> go? Tap each one to hear it.</span>`));
    g.opts.forEach((o, oi) => {
      const id = gi + ':' + oi;
      const row = el('button', 'move-opt' + (moveSel === id ? ' sel' : '') + (moveSel === id ? (o.good ? ' good' : ' bad') : ''));
      row.innerHTML = `<div class="mini move-mini">${stripHtml(o.tokens)}</div>` + (o.current ? '<span class="tag-now">your sentence</span>' : '')
        + (moveSel === id ? `<div class="verdict">${o.good ? '✅ It still makes sense. ' : '🤔 Listen: does that make sense? '}${o.note}</div>` : '');
      row.onclick = () => { moveSel = id; render(); say(textOf([...o.tokens, {t:'.'}]).text); };
      box.appendChild(row);
      if (moveSel === id && o.good && !o.current){
        const use = el('button', 'btn good', '👍 Use this order');
        use.style.margin = '0 0 10px';
        use.onclick = () => { s.moved = strip(o.tokens); moveSel = null; heard = false;
          coachMsg = {cls:'good', ic:'🔀', html:'Same sentence, new order, and it still makes sense. ✏️ Write this version in your book.'}; render(); };
        box.appendChild(use);
      }
    });
    b.appendChild(box);
  });
}

/* ================= FIX-IT MODE ================= */

function startFix(type, p){
  mode = 'fix';
  p = p || rnd(topic.pictures);
  heard = false; covered = false; coachMsg = null; problemSlot = null; stripped = false;
  fx = {type, stage:'find', tries:0};
  if (type === 'runon' || type === 'comma'){
    const a = genClause(p), b = genClause(p, [a.who.id]);
    fx.clauses = [a, b];
    fx.words = [...wordTiles(a, 0), ...(type === 'comma' ? [{t:',', clause:-1}] : []), ...wordTiles(b, 1)];
    fx.split = fx.words.findIndex(w => w.clause === 1);
    fx.fix = null;
  } else if (type === 'nocomma'){
    const g = genFronted(p);
    fx.clause = g.clause; fx.front = g.front;
    const fw = g.front.card.t.split(' ').map(t => ({t, clause:0}));
    fx.words = [...fw, ...wordTiles(g.clause, 1)];
    fx.split = fw.length - 1;   // the comma goes after this word
  } else if (type === 'and'){
    const n = p.who.length >= 3 ? 4 : 3;
    const cs = [], used = [], seen = new Set();
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
    fx.clause = overloaded(p, settings.extras);
  }
  showBuildScreen(p, `<b>${FIXES[type].icon} Fix it</b><span class="sub">: ${esc(FIXES[type].title)}</span>`);
  try { history.replaceState(null, '', `?fix=${type}&pic=${topic.id}.${p.id}`); } catch(e) {}
  render();
}

function fixTokens(opts = {}){
  const t = fx.type;
  if ((t === 'runon' || t === 'comma' || t === 'nocomma') && fx.stage === 'find') return [...fx.words.map(w => ({t:w.t})), {t:'.'}];
  if (t === 'runon' || t === 'comma'){
    const tk = [...parts(fx.clauses[0])];
    if (fx.fix) tk.push({kind:'join', t:JOINS[fx.fix].t});
    else if (t === 'comma') tk.push({kind:'comma', t:','});
    tk.push(...parts(fx.clauses[1]), {t:'.'});
    return tk;
  }
  if (t === 'nocomma') return [{kind:'front', cat:fx.front.cat, t:fx.front.card.t}, {kind:'punct', t:','}, ...parts(fx.clause), {t:'.'}];
  if (t === 'and'){
    const tk = [];
    fx.clauses.forEach((c, i) => {
      if (i) tk.push({kind:'join', t:JOINS[fx.joins[i - 1]].t, j:i - 1});
      tk.push(...parts(c));
    });
    tk.push({t:'.'});
    return tk;
  }
  return [...parts(fx.clause, opts), {t:'.'}];
}

function renderFix(){
  const line = $('#line'); line.innerHTML = '';
  line.classList.toggle('covered', covered);
  const tk = fixTokens();
  const body = tk.slice(0, -1);
  let capNext = true;
  body.forEach((p, i) => {
    const isWord = p.t !== ',' && p.t !== '.';
    const t = isWord && capNext ? cap(p.t) : p.t;
    if (isWord) capNext = false;
    if (p.t === '.') capNext = true;
    if (fx.type !== 'extras' && fx.type !== 'and' && fx.stage === 'find'){
      // plain word tiles
      if (p.t === ','){ line.appendChild(markEl(',', i, 'comma-mark')); return; }
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
    if (p.kind === 'punct'){ line.appendChild(markEl(p.t, i, 'added')); return; }
    if (p.kind === 'front'){ line.appendChild(chipEl(p.cat, t, i, {label:`${p.cat} · fronted`, locked:false, extra:false, onTap:false})); return; }
    if (p.kind === 'lit'){ const l = el('span', 'lit', esc(t)); l.dataset.i = i; line.appendChild(l); return; }
    const isX = EXTRAS.includes(p.kind);
    const c = chipEl(p.kind, t, i, {locked: fx.type === 'extras' && !isX,
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
    fx.hint = false; heard = false; fx.stage = 'fix';
    coachMsg = {cls:'good', ic:'🌟', html:
        fx.type === 'nocomma' ? 'Yes! The fronted adverbial ends there, so the <b>comma</b> goes after it. Listen to the fixed sentence.'
      : fx.type === 'comma' ? 'Yes! That is where the second idea starts. A <b>comma</b> is not strong enough to join two ideas. Choose a fix below.'
      : 'Yes! That is where the second idea starts. Two ideas need a <b>full stop</b> or a <b>joining word</b> between them. Choose a fix below.'};
  } else {
    fx.tries++;
    if (fx.tries >= 2) fx.hint = true;
    coachMsg = {cls:'think', ic:'👂', html:(fx.type === 'nocomma'
      ? 'Not quite. Listen again: which words tell you <b>when</b>, <b>where</b> or <b>how</b>? Tap the <b>last word</b> of them.'
      : 'Not quite. Listen again and find the <b>second who</b>: who else is doing something?') + (fx.hint ? ' Look at the glowing word.' : '')};
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
  if (fx.type === 'nocomma') return null;
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
    coachMsg = {cls:'think', ic:'👍', html: prob || (fx.type === 'and' ? 'Good thinking. Tap an <b>and</b> to change it.' : fx.type === 'extras' ? 'Good thinking. Tap an extra to take it away.' : fx.type === 'nocomma' ? 'Listen again. The comma shows where the fronted adverbial ends.' : 'Good thinking. Choose a different fix.')};
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
      const core = [...parts(fx.clause, {core:true}), {t:'.'}];
      if (stripped){ coachMsg = {cls:'', ic:'🔍', html:`The core sentence is <q>${esc(textOf(core).text)}</q> Keep the extras that help, and take away the rest.`}; renderFixCoach(); speakTokens(core); }
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
    if (fx.stage === 'find') m = {ic:'🔎', html:
        fx.type === 'comma' ? 'This sentence has <b>two ideas</b> joined with just a comma. Listen, then tap the word where the <b>second idea</b> starts.'
      : fx.type === 'nocomma' ? 'This sentence starts with a <b>fronted adverbial</b> but the comma is missing. Listen, then tap the word that the <b>comma</b> should go after.'
      : 'This sentence has <b>two ideas</b> squashed together. Listen, then tap the word where the <b>second idea</b> starts.'};
    else if (fx.type === 'and') m = {ic:'🔗', html:'Too many <b>and</b>s! A sentence should have no more than <b>two</b> ideas. Tap an <b>and</b> to change it to a full stop.'};
    else if (fx.type === 'extras') m = {ic:'🎒', html:`This sentence has so many extras it is muddled. Tap extras to take them away until there are no more than <b>${settings.extras}</b>.`};
    else if (!fx.fix && fx.type !== 'nocomma') m = {ic:'🔧', html:'Choose a fix.'};
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
    cardGroup(b, icon('coord'), 'How will you fix it?', ['stop','and','but','so'].map(id => {
      const j = JOINS[id];
      return plainCard(`join-card j-${j.kind}` + (fx.fix === id ? ' chosen' : ''),
        `<span class="jw">${id === 'stop' ? '⏺ Full stop' : esc(j.t)}</span><small>${esc(j.help)}</small>`, () => chooseFix(id));
    }));
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
    <p><a class="btn primary" href="print.html" target="_blank" rel="noopener">🖨️ Printable resources</a></p>
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
      <li><b>Fronted adverbials (Step 6).</b> The sentence must make sense first. Then the child puts a when, where or how at the front (an existing where can be moved), and must add the comma themselves.</li>
      <li><b>Relative clauses (Step 7).</b> After the core makes sense, the child adds extra information about the who: <i>who</i> for a person, <i>which</i> for a thing (the tool explains if they pick the other), one more doing block, then two commas or brackets. Check the core hides it again.</li>
      <li><b>Move it.</b> When a sentence at Step 3, 5 or 6 makes sense, <b>Move it</b> shows every place its when / where / how or its because/when/if part can go, adds the comma when it moves to the front, and includes one place it cannot go for contrast. Each position is read aloud. The child can choose the order they want to write.</li>
      <li><b>Fix it.</b> Sentences are made from the picture's word cards, so there is always a new one: run-on, comma splice, missing comma after a fronted adverbial, "and… and…" chains, and too many extras.</li>
      <li><b>Steps are by need, not year group.</b> After ${GOAL} sentences at a step the child is told to ask you about moving on. You decide.</li>
    </ul>
    <h3>Setting a child's activity</h3>
    <p>Open a picture or a Fix it activity, then bookmark the page or save it to the iPad home screen. The address remembers it, e.g. <code>?step=4&amp;pic=space.launch</code> or <code>?fix=runon&amp;pic=stories.forest</code>.</p>
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
