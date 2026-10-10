// Regression test for the "Check my writing" analyser.
//   node tests/test-writing.js            -> compares against tests/writing-expected.txt
//   node tests/test-writing.js --update   -> rewrites the expected file (after checking the changes are right)
const vm = require('vm'), fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..') + '/';
const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(D + f, 'utf8').replace(/^const (VERB_BASES|WR) =/m, 'var $1 ='), ctx);
run('lib/wink-pos-tagger.bundle.js'); run('lib/verbs.js'); run('writing.js');
const cases = fs.readFileSync(D + 'tests/writing-cases.txt', 'utf8').split('\n').filter(Boolean);
const out = cases.map(t => t + '  =>  ' + ctx.WR.analyse(t).sentences.map(s => s.problems.map(p => p.type).join(',') || 'ok').join(' | '));
const expFile = D + 'tests/writing-expected.txt';
if (process.argv.includes('--update') || !fs.existsSync(expFile)){ fs.writeFileSync(expFile, out.join('\n') + '\n'); console.log('expected file written:', out.length, 'cases'); process.exit(0); }
const exp = fs.readFileSync(expFile, 'utf8').split('\n').filter(Boolean);
let bad = 0;
out.forEach((o, i) => { if (o !== exp[i]){ bad++; console.log('CHANGED\n  was: ' + exp[i] + '\n  now: ' + o); } });
console.log(bad ? `${bad} of ${out.length} changed` : `all ${out.length} cases unchanged`);
process.exit(bad ? 1 : 0);
