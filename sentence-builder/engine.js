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
  if (st.doing) out.push({kind:'doing', card:st.doing, t:st.doing.t});
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
