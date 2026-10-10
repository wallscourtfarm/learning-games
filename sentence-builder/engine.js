/* Sentence Builder — shared sentence engine (used by the app and the printables page).
 * Pure functions only: building sentence parts, turning them into text, the sense check and
 * the random sentence maker for Fix it. No DOM, no state.
 */

const JOINS = {
  stop:    {t:'.',       kind:'stop',   help:'two separate sentences'},
  and:     {t:'and',     kind:'coord',  help:'adds another idea'},
  but:     {t:'but',     kind:'coord',  help:'something different or surprising'},
  so:      {t:'so',      kind:'coord',  help:'what happens because of the first idea'},
  because: {t:'because', kind:'subord', help:'gives the reason'},
  when:    {t:'when',    kind:'subord', help:'tells you the time it happens'},
  if:      {t:'if',      kind:'subord', help:'it only happens if…'}
};

const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap = t => t ? t[0].toUpperCase() + t.slice(1) : t;
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const blank = () => ({who:null, doing:null, what:null, where:null, describe:null, how:null, when:null, stop:false});
const fits = (card, key, val) => !card[key] || !val || card[key].includes(val.id);

// "the astronaut", or just "King Henry" for a name with no "the".
const np = w => w.det ? `${w.det} ${w.t}` : w.t;
function whoPhrase(st){
  if (!st.who) return 'they';
  if (st.describe && st.who.det) return `${st.who.det} ${st.describe.t} ${st.who.t}`;
  return np(st.who);
}

/* ---------- being / having words (is, was, has, had, will) ---------- */
// Word cards hold the present tense ("fights", "picks up"). These turn it into the form that
// follows a being/having word: is/was + -ing, has/had + past participle, will + base.
const AUX_WORDS = ['is','was','has','had','will'];
const PARTICIPLE = (() => {
  const m = {};
  ('be:been have:had do:done go:gone see:seen eat:eaten fall:fallen fly:flown swim:swum run:run sit:sat stand:stood hold:held '+
   'find:found make:made take:taken give:given write:written ride:ridden drive:driven throw:thrown blow:blown grow:grown '+
   'know:known draw:drawn break:broken speak:spoken wake:woken freeze:frozen choose:chosen steal:stolen sing:sung ring:rung '+
   'drink:drunk begin:begun sink:sunk shrink:shrunk swing:swung sting:stung stick:stuck dig:dug spin:spun win:won catch:caught '+
   'teach:taught bring:brought buy:bought think:thought fight:fought seek:sought keep:kept sleep:slept sweep:swept weep:wept '+
   'feel:felt leave:left meet:met feed:fed lead:led read:read bleed:bled say:said pay:paid lay:laid tell:told sell:sold '+
   'hear:heard light:lit shine:shone shoot:shot lose:lost send:sent spend:spent build:built bend:bent lend:lent cut:cut hit:hit '+
   'put:put set:set let:let shut:shut hurt:hurt cost:cost burst:burst spread:spread split:split quit:quit come:come '+
   'become:become get:got forget:forgotten hide:hidden bite:bitten strike:struck wear:worn tear:torn beat:beaten mean:meant '+
   'deal:dealt kneel:knelt creep:crept leap:leapt slide:slid cling:clung fling:flung hang:hung rise:risen arise:arisen '+
   'shake:shaken forgive:forgiven lie:lain mow:mown sew:sewn sow:sown show:shown swell:swollen grind:ground wind:wound '+
   'bind:bound sweat:sweated weave:woven tread:trodden').split(' ').forEach(x => { const [a, b] = x.split(':'); m[a] = b; });
  return m;
})();
const IRREG_BASE = {has:'have', does:'do', goes:'go', is:'be'};
function verbBase(w){
  if (IRREG_BASE[w]) return IRREG_BASE[w];
  if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y';
  if (/(ches|shes|sses|xes|zzes|oes)$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
  return w;
}
const DOUBLE_LAST = new Set('begin forget admit permit refer prefer occur regret upset control patrol compel rebel propel equip kidnap worship'.split(' '));
// run -> running, sit -> sitting, begin -> beginning; British travel -> travelling
const cvc = b => DOUBLE_LAST.has(b) || (/^[^aeiou]*[aeiou][bdgklmnprtvz]$/.test(b) && !/(w|x|y)$/.test(b)) || /[^aeiou][aeiou]l$/.test(b) && b.length > 4;
function ingForm(b){
  if (b === 'be') return 'being';
  if (/ie$/.test(b)) return b.slice(0, -2) + 'ying';
  if (/[^eoy]e$/.test(b)) return b.slice(0, -1) + 'ing';
  if (cvc(b)) return b + b.slice(-1) + 'ing';
  return b + 'ing';
}
function participle(b){
  if (PARTICIPLE[b]) return PARTICIPLE[b];
  if (/e$/.test(b)) return b + 'd';
  if (/[^aeiou]y$/.test(b)) return b.slice(0, -1) + 'ied';
  if (cvc(b)) return b + b.slice(-1) + 'ed';
  return b + 'ed';
}
// "picks up" + "was" -> "picking up"
function doingWith(t, aux){
  if (!aux) return t;
  const [head, ...rest] = t.split(' ');
  const b = verbBase(head);
  const f = (aux === 'is' || aux === 'was') ? ingForm(b) : (aux === 'has' || aux === 'had') ? participle(b) : b;
  return [f, ...rest].join(' ');
}

// Core + extras in order: The [describe] who doing what [how] where [when]
function parts(st, opts = {}){
  const hideExtras = opts.core;
  const out = [];
  if (st.who){
    const ds = st.describes || (st.describe ? [st.describe] : []);
    if (ds.length && !hideExtras && st.who.det){
      out.push({kind:'lit', t:st.who.det});
      ds.forEach(d => out.push({kind:'describe', card:d, t:d.t}));
      out.push({kind:'who', card:st.who, t:st.who.t});
    } else out.push({kind:'who', card:st.who, t:np(st.who)});
  }
  if (st.doing){
    if (st.aux) out.push({kind:'aux', t:st.aux});
    out.push({kind:'doing', card:st.doing, t:doingWith(st.doing.t, st.aux)});
  }
  if (st.what) out.push({kind:'what', card:st.what, t:st.what.t});
  if (!hideExtras) (st.hows || (st.how ? [st.how] : [])).forEach(h => out.push({kind:'how', card:h, t:h.t}));
  if (st.where) out.push({kind:'where', card:st.where, t:st.where.t});
  if (st.when && !hideExtras) out.push({kind:'when', card:st.when, t:st.when.t});
  return out;
}

// Tokens -> text. '.' ',' ')' attach to the word before; '(' attaches to the word after; the
// word after a full stop gets a capital letter. Returns text + each token's char range.
function textOf(tokens){
  let text = '', ranges = [], capNext = true, glueNext = false;
  tokens.forEach((tk, i) => {
    let t = tk.t;
    const left = t === '.' || t === ',' || t === ')';
    const isWord = !left && t !== '(';
    if (isWord && capNext) t = cap(t);
    if (text && !left && !glueNext) text += ' ';
    ranges.push([text.length, text.length + t.length, i]);
    text += t;
    glueNext = t === '(';
    if (isWord || t === '.') capNext = t === '.';
  });
  return {text, ranges};
}

// The sense check. Returns the first problem as {slot, msg}, or null. Never says "wrong": it
// asks the child to listen again and points at the block to change. stp = the child's step.
function check(st, scope, stp){
  const who = st.who, doing = st.doing;
  const listen = t => `Listen again: <q>${esc(t)}</q>.`;
  if (doing && !fits(doing, 'who', who))
    return {slot:'doing', msg:`${listen(cap(whoPhrase(st)) + ' ' + doing.t)} Does that make sense? Try a different <b>doing</b> block.`};
  if (doing && doing.needs === 'what' && !st.what){
    if (stp === 1) return {slot:'doing', msg:`<q>${esc(cap(whoPhrase(st)))} ${esc(doing.t)}…</q> ${esc(doing.t)} what? This doing word needs a <b>what</b> after it. Try a doing word that makes sense on its own.`};
    return {slot:'what', msg:`<q>${esc(cap(whoPhrase(st)))} ${esc(doing.t)}…</q> ${esc(doing.t)} what? This doing word needs a <b>what</b>. Add a what block.`};
  }
  if (doing && doing.needs === 'none' && st.what)
    return {slot:'what', msg:`${listen(doing.t + ' ' + st.what.t)} Does that go together? Take the <b>what</b> away, or try a different doing block.`};
  if (st.what && (!fits(st.what, 'doing', doing) || !fits(st.what, 'who', who)))
    return {slot:'what', msg:`${listen(cap(whoPhrase(st)) + ' ' + doing.t + ' ' + st.what.t)} Does that go together? Try a different <b>what</b> block.`};
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

// Does a fronted adverbial card fit the core sentence?
function frontFits(st, f){
  if (!f) return true;
  return fits(f.card, 'who', st.who) && fits(f.card, 'doing', st.doing);
}

/* ---------- random sentences for Fix it and the printables ---------- */

// A random clause from the picture's word bank that passes the sense check.
function genClause(p, avoidWho){
  for (let n = 0; n < 200; n++){
    const st = blank();
    const whos = p.who.filter(w => !avoidWho || !avoidWho.includes(w.id));
    st.who = rnd(whos.length ? whos : p.who);
    const doings = p.doing.filter(d => fits(d, 'who', st.who));
    if (!doings.length) continue;
    st.doing = rnd(doings);
    const whats = p.what.filter(w => fits(w, 'doing', st.doing) && fits(w, 'who', st.who));
    const wheres = p.where.filter(w => fits(w, 'who', st.who) && fits(w, 'doing', st.doing));
    if (st.doing.needs === 'what'){ if (!whats.length) continue; st.what = rnd(whats); }
    else if (st.doing.needs !== 'none' && whats.length && Math.random() < .5) st.what = rnd(whats);
    if (!st.what && wheres.length && Math.random() < .6) st.where = rnd(wheres);
    if (check(st, 'core', 2)) continue;
    return st;
  }
  return null;
}

// A core clause stuffed with extras: two describes, two hows (where the bank allows) and a when.
function overloaded(p, limit){
  for (let n = 0; n < 200; n++){
    const st = genClause(p);
    if (!st.who.det) continue;
    const ds = shuffle(p.describe.filter(d => fits(d, 'who', st.who))).slice(0, 2);
    const hs = shuffle(p.how.filter(h => fits(h, 'doing', st.doing) && fits(h, 'who', st.who))).slice(0, 2);
    const total = ds.length + hs.length + 1;
    if (total < limit + 2 || (ds.length < 2 && hs.length < 2)) continue;
    st.describes = ds; st.hows = hs; st.when = rnd(p.when);
    return st;
  }
  return genClause(p);
}
const xCount = st => (st.describes || []).length + (st.hows || []).length + (st.when ? 1 : 0);

// A clause plus a fronted adverbial that fits it: {clause, front:{cat, card}}.
function genFronted(p){
  for (let n = 0; n < 200; n++){
    const st = genClause(p);
    const opts = [
      ...p.when.map(card => ({cat:'when', card})),
      ...p.how.filter(h => fits(h, 'doing', st.doing) && fits(h, 'who', st.who)).map(card => ({cat:'how', card}))
    ];
    if (st.where){ opts.push({cat:'where', card:st.where}); }
    const f = rnd(opts);
    if (!f) continue;
    if (f.cat === 'where') st.where = null;
    return {clause:st, front:f};
  }
  return null;
}

// Word tiles for one clause: [{t, clause}] — multi-word blocks split into single words.
function wordTiles(st, clause){
  const out = [];
  parts(st).forEach(p => p.t.split(' ').forEach(w => out.push({t:w, clause})));
  return out;
}
