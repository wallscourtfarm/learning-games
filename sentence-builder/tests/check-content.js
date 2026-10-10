// Usage: node check-content.js <topic-file.js> [more files]
// Loads content.js + engine.js from the sentence-builder folder, then the given topic files,
// and checks every picture's word bank is consistent and usable by the sentence engine.
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = path.join(__dirname, '..');
const ctx = {console, Math};
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(f, 'utf8').replace(/^const TOPICS/m, 'var TOPICS'), ctx, {filename:f});
load(path.join(DIR, 'content.js'));
vm.runInContext(fs.readFileSync(path.join(DIR, 'engine.js'), 'utf8').replace(/^const (\w+) =/mg, 'var $1 ='), ctx);
process.argv.slice(2).forEach(f => load(path.resolve(f)));
let bad = 0;
const err = (...a) => { bad++; console.log('PROBLEM', ...a); };
const ids = new Set();
for (const tp of ctx.TOPICS){
  for (const p of tp.pictures){
    const key = tp.id + '.' + p.id;
    if (ids.has(key)) err('duplicate picture id', key); ids.add(key);
    if (!fs.existsSync(path.join(DIR, p.img))) err(key, 'image file missing', p.img);
    for (const c of ['who','doing','what','where','describe','how','when']) if (!Array.isArray(p[c]) || !p[c].length) err(key, 'empty or missing', c);
    const W = new Set(p.who.map(x => x.id)), D = new Set(p.doing.map(x => x.id));
    for (const c of ['who','doing','what','where','describe','how','when']){
      const seen = new Set();
      for (const card of p[c] || []){
        if (!card.id || !card.t) err(key, c, 'card missing id or t', JSON.stringify(card));
        if (seen.has(card.id)) err(key, c, 'duplicate id', card.id); seen.add(card.id);
        (card.who || []).forEach(i => { if (!W.has(i)) err(key, c, card.id, 'unknown who id', i); });
        (card.doing || []).forEach(i => { if (!D.has(i)) err(key, c, card.id, 'unknown doing id', i); });
        if (c === 'who' && (card.det === undefined)) err(key, 'who card needs det', card.id);
        if (c !== 'who' && /^[A-Z]/.test(card.t) && !/^(King|Queen|Mars|Earth|the River|River|London|Bristol)/.test(card.t)) err(key, c, card.id, 'starts with a capital letter (cards are lower case):', card.t);
        if (/[.,!?]$/.test(card.t)) err(key, c, card.id, 'card has punctuation', card.t);
      }
    }
    p.who.forEach(w => { if (!p.doing.some(d => !d.who || d.who.includes(w.id))) err(key, 'who has no doing card', w.id); });
    p.doing.filter(d => d.needs === 'what').forEach(d => { if (!p.what.some(w => (!w.doing || w.doing.includes(d.id)))) err(key, 'doing needs a what but none fits', d.id); });
    for (let n = 0; n < 200; n++){
      const c = ctx.genClause(p); if (!c){ err(key, 'genClause failed'); break; }
      if (ctx.check(c, 'core', 2)) { err(key, 'generated clause fails check', ctx.textOf(ctx.parts(c)).text); break; }
    }
    if (!ctx.genFronted(p)) err(key, 'genFronted failed');
    const o = ctx.overloaded(p, 2); if (!o) err(key, 'overloaded failed');
    const sample = [0,1,2].map(() => ctx.textOf(ctx.parts(ctx.genClause(p))).text + '.').join(' | ');
    console.log('ok', key, '·', sample);
  }
}
console.log(bad ? `\n${bad} problem(s)` : '\nALL GOOD');
process.exit(bad ? 1 : 0);
