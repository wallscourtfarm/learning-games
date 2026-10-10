/* Sentence Builder — "Check my writing" analyser.
 * Finds the IDEAS (someone/something + a doing word) in a child's own sentences, so the
 * tool can show them and ask questions:
 *   - two or more ideas with no full stop or joining word between them (run-on)
 *   - two ideas joined only by a comma (comma splice)
 *   - a who with no doing word, e.g. "The Mars rover, which is a robot." (incomplete)
 *   - only half a sentence, e.g. "Because it was raining."
 *   - a long chain of "and"s
 *   - missing capital letter / full stop
 * It is a heuristic helper, not a grammar checker: the UI always frames results as
 * questions, and the child decides by reading the sentence aloud.
 * Uses VERB_BASES (lib/verbs.js) and, if loaded, winkPOSTagger (lib/wink-pos-tagger.bundle.js).
 */
const WR = (() => {
  const S = a => new Set(a.split(' '));
  const SUBJ_PRON = S('i he she we they');
  const AMBIG_PRON = S('it you');
  const DET = S('the a an my his her their our your its this that these those some every each no another');
  const PREP = S('in on at over under of to from with into onto through across along around behind beside between by near past up down off out about during for without inside outside towards toward above below beneath against among within upon like than');
  const COORD = S('and but so or yet nor');
  const SUBORD = S('because if when although though while after before until since unless whereas once whenever wherever as');
  const SUB_OR_PREP = S('after before until since as');   // a joining word only if a who + doing follows
  const REL = S('who which whose whom');
  const WH = S('what why how where');
  const BE_HAVE_DO = S('is are was were am be been being has have had do does did');
  const MODAL = S('can could will would shall should may might must');
  // past tenses and other finite forms of common irregular verbs
  const IRREG = S('arose awoke bore beat became began bent bet bit bled blew broke brought built burnt burned burst bought caught chose clung came cost crept cut dealt dug dived dove drew dreamt dreamed drank drove ate fell fed felt fought found fled flew forbade forgot forgave froze got gave went ground grew hung heard hid hit held hurt kept knelt knew laid led leant leapt learnt left lent let lay lit lost made meant met paid put quit ran rang rose said sat saw sought sold sent set shook shone shot showed shrank shut sang sank slept slid slung smelt spoke sped spent spun spat split spread sprang stood stole stuck stung stank strode struck swore swept swam swung took taught tore told thought threw understood woke wore wove wept won wound wrote goes does has says');
  // common misspellings of doing words in children's writing
  const MISSPELT = S('bilt cort caught brang brung thort thot sor wos woz wuz wer sed sayd goed eated finded throwed catched runned swimmed bringed buyed tooked seed');
  // after these, a new who + doing word is what was said or thought ("I think the rover is cool")
  const SAY_THINK = S('think thinks thought know knows knew say says said hope hopes hoped wish wished believe believes believed guess guessed feel feels felt bet reckon reckons realised realized remember remembered noticed notice saw see sees heard hear hears decided decide shouted shouts whispered whispers told tell tells asked ask asks wondered wonder');
  // words that can sit between a joining word and the next who ("and then it", "and suddenly the door")
  const LINKERS = S('then suddenly also finally later soon quickly slowly afterwards next luckily unfortunately eventually');
  const ADVERB_LIKE = S('always never also then often sometimes all both just still even really not only quickly slowly suddenly');
  const NOT_ED_VERB = S('red bed shed sled hundred sacred naked wicked beloved crooked ragged rugged jagged aged learned');
  const PUNCT_END = S('. ! ?');

  const tokenize = str => str.match(/[A-Za-z][A-Za-z'’-]*|[0-9]+|[.,!?;:]/g) || [];

  function stemIsVerb(w){
    if (VERB_BASES.has(w)) return true;
    const tries = [];
    if (w.endsWith('ied')) tries.push(w.slice(0, -3) + 'y');
    if (w.endsWith('ies')) tries.push(w.slice(0, -3) + 'y');
    if (w.endsWith('ed')) { tries.push(w.slice(0, -2), w.slice(0, -1)); if (/(.)\1ed$/.test(w)) tries.push(w.slice(0, -3)); }
    if (w.endsWith('es')) tries.push(w.slice(0, -2));
    if (w.endsWith('s')) tries.push(w.slice(0, -1));
    return tries.some(t => VERB_BASES.has(t));
  }

  function analyseSentence(raw, tags){
    const n = raw.length, low = raw.map(w => w.toLowerCase());
    const tag = i => (tags && tags[i]) || '';
    const isPunct = i => /^[.,!?;:]$/.test(raw[i]);
    const prevWord = i => { for (let k = i - 1; k >= 0; k--) if (!isPunct(k)) return k; return -1; };

    // a describing word before the doing word, e.g. "the scared runs" — but in "the chief holds" the word
    // straight after "the" must be the who itself, whatever the tagger thinks
    const JJ_LIKE = k => k >= 0 && (tag(k) === 'JJ' || /ly$/.test(low[k])) && !(k > 0 && DET.has(low[k - 1]));
    // Is token i a finite doing word?  `needSubj` = we already know a subject is waiting.
    function isVerb(i, needSubj){
      const w = low[i];
      if (!w || isPunct(i)) return false;
      const p = prevWord(i), pw = p >= 0 ? low[p] : '';
      if (DET.has(pw) && !BE_HAVE_DO.has(w) && !MODAL.has(w)) return false;    // "the scared cat"
      if (pw === 'to') return false;                                              // "to find" — not finite
      if (PREP.has(pw) && !BE_HAVE_DO.has(w) && !MODAL.has(w) && !IRREG.has(w)) return false;   // "of mars" is not a doing word
      if (BE_HAVE_DO.has(w) || MODAL.has(w) || IRREG.has(w) || MISSPELT.has(w)) return true;
      // straight after I / he / she / we / they, a word is almost always the doing word,
      // even when it is misspelt ("we bilt", "he floted")
      if (SUBJ_PRON.has(pw) && needSubj && !ADVERB_LIKE.has(w) && !/ly$/.test(w) && !DET.has(w) && !PREP.has(w) && !COORD.has(w) && !SUBORD.has(w) && !REL.has(w) && /^[a-z]+$/.test(w)) return true;
      // an unknown -ed word straight after the who is a misspelt doing word ("the astronot floted")
      if (needSubj && /[a-z]{3,}ed$/.test(w) && !NOT_ED_VERB.has(w) && !DET.has(pw) && !JJ_LIKE(p)) return true;
      if (w.endsWith('ed') && !NOT_ED_VERB.has(w) && stemIsVerb(w)) return true;
      if (/^VB[DZ]$|^MD$/.test(tag(i)) && stemIsVerb(w) && (needSubj || tag(i) === 'VBD')) return true;
      // present tense: "the rocket roars". An -s word straight after the who is a doing word,
      // unless a clear doing word follows it ("the rock samples were tested").
      if (w.endsWith('s') && !w.endsWith('ss') && stemIsVerb(w) && needSubj && !JJ_LIKE(p)){
        const nx = i + 1 < n ? low[i + 1] : '';
        if (!(BE_HAVE_DO.has(nx) || MODAL.has(nx) || IRREG.has(nx) || (nx.endsWith('ed') && stemIsVerb(nx)))) return true;
      }
      if (VERB_BASES.has(w) && (SUBJ_PRON.has(pw) || AMBIG_PRON.has(pw)) && !w.endsWith('s')) return true;   // "they go"
      return false;
    }

    // Does a new who start at i, with its doing word soon after? Returns the verb index or -1.
    function subjectVerbAt(i, afterVerb){
      const w = low[i], p = prevWord(i), pw = p >= 0 ? low[p] : '';
      if (PREP.has(pw) && !SUB_OR_PREP.has(pw)) return -1;      // "over the surface", "of Mars"
      let start = false, strongOnly = false;
      if (SUBJ_PRON.has(w)) start = true;
      else if (AMBIG_PRON.has(w)) start = !(afterVerb && p >= 0 && (isVerb(p, true) || PREP.has(pw)));
      else if (DET.has(w)) { start = true; strongOnly = afterVerb; }
      else if (/^[A-Z]/.test(raw[i]) && i > 0 && tag(i).startsWith('NNP')) { start = true; strongOnly = afterVerb; }
      if (!start) return -1;
      for (let k = i + 1; k < Math.min(n, i + 6); k++){
        if (isPunct(k) || COORD.has(low[k]) || REL.has(low[k]) || SUBJ_PRON.has(low[k]) || AMBIG_PRON.has(low[k])) return -1;
        if (k > i + 1 && DET.has(low[k]) && !isVerb(k, true)) return -1;   // another who starts first
        if (isVerb(k, true)){
          if (strongOnly){
            const v = low[k];
            const strong = BE_HAVE_DO.has(v) || MODAL.has(v) || IRREG.has(v) || (v.endsWith('ed') && stemIsVerb(v));
            // a present-tense -s doing word only counts as a new idea in a short who ("the astronaut
            // looks at…"), when something follows it — "…picked up the rock samples." stays one idea
            const nx = k + 1 < n ? low[k + 1] : '.';
            const follows = PREP.has(nx) || DET.has(nx) || /ly$/.test(nx) || nx === ',' || COORD.has(nx);
            const atEnd = PUNCT_END.has(nx) || nx === '.';
            // straight after a doing word, "the …" is usually what was done ("picked the rock samples"),
            // so only a very short who with something after it counts there
            const afterDoing = p >= 0 && isVerb(p, true);
            const ok = afterDoing ? (k === i + 2 && follows && !COORD.has(nx)) : (k <= i + 3 && (follows || atEnd));
            if (!strong && !(v.endsWith('s') && ok)) return -1;
          }
          return k;
        }
      }
      return -1;
    }

    const ideas = [];
    let cur = null, rel = null, join = null, comma = -1, frontedSub = false;
    for (let i = 0; i < n; i++){
      const w = low[i];
      if (PUNCT_END.has(raw[i])) continue;
      if (raw[i] === ',' || raw[i] === ';'){ comma = i; if (rel && rel.verb != null) rel = null; continue; }
      if (COORD.has(w)){ join = {w, i, type:'coord'}; comma = -1; continue; }
      if (SUBORD.has(w) && (!SUB_OR_PREP.has(w) || subjectVerbAt(i + 1, false) >= 0)){
        join = {w, i, type:'sub'}; comma = -1;
        if (!ideas.length && !cur) frontedSub = true;
        continue;
      }
      if (REL.has(w) && cur){ rel = {kind:'rel', start:i, verb:null, w}; ideas.push(rel); continue; }
      if (WH.has(w) && cur && cur.verb != null){ join = {w, i, type:'wh'}; continue; }
      if (w === 'that' && cur){
        const p = prevWord(i);
        if (cur.verb != null && p === cur.verb || (cur.verb != null && subjectVerbAt(i + 1, false) >= 0)){ join = {w, i, type:'wh'}; continue; }   // "said that we…"
        if (i + 1 < n && isVerb(i + 1, true)){ rel = {kind:'rel', start:i, verb:null, w}; ideas.push(rel); continue; }   // "the rock that fell"
      }
      if (w === 'to' && i + 1 < n && VERB_BASES.has(low[i + 1])){ i++; continue; }   // infinitive

      if (rel && rel.verb == null && isVerb(i, true)){ rel.verb = i; continue; }

      // a new idea?
      if (!cur || cur.verb != null){
        const v = subjectVerbAt(i, !!cur);
        if (v >= 0){
          if (join){
            // "big and scary it breathed": the "and" joined describing words, not these ideas
            const between = low.slice(join.i + 1, i);
            if (!between.every(x => LINKERS.has(x) || x === ',')) join = null;
          }
          const pv = prevWord(i);
          if (!join && cur && pv >= 0 && pv === cur.verb && SAY_THINK.has(low[pv])) join = {w:'', i:pv, type:'wh'};   // "I think the rover is cool"
          const kind = join && join.type === 'sub' ? 'sub' : join && join.type === 'wh' ? 'wh' : 'main';
          const afterSub = frontedSub && kind === 'main' && !join;
          cur = {kind, start:i, subj:i, verb:v, join: join ? join.w : null, joinAt: join ? join.i : null,
                 comma: (!join && !afterSub && comma >= 0 && ideas.length) ? comma : null,
                 runon: !join && !afterSub && comma < 0 && ideas.some(x => x.kind !== 'rel'),
                 subComma: afterSub && comma < 0};
          if (afterSub) frontedSub = false;
          ideas.push(cur); join = null; comma = -1; rel = null; i = v; continue;
        }
        if (!cur){
          // sentence starts without a clear who+doing: open an idea anyway (imperative, or a
          // long who that we will find the doing word for later)
          cur = {kind: join && join.type === 'sub' ? 'sub' : 'main', start:i, subj:i, verb: isVerb(i, true) ? i : null, join: join ? join.w : null};
          if (cur.verb == null && VERB_BASES.has(w) && i === 0 && !(i + 1 < n && /^[A-Z]/.test(raw[i + 1]))) cur.verb = i;    // "Pick up the rock." (not "Lord Carnarvon…")
          ideas.push(cur); join = null;
          continue;
        }
      }
      if (cur && cur.verb == null && isVerb(i, true)){
        // "who were excited": a word straight after the extra-information verb still belongs to it
        const p = prevWord(i);
        if (rel && rel.verb != null && (p === rel.verb || BE_HAVE_DO.has(low[p]))) continue;
        cur.verb = i; rel = null;
      }
    }

    // problems, as questions
    const problems = [];
    const main = ideas.filter(x => x.kind === 'main');
    const clauses = ideas.filter(x => x.kind !== 'rel');
    const noVerbMain = main.find(x => x.verb == null);
    if (noVerbMain && !main.some(x => x.verb != null)){
      const relIdea = ideas.find(x => x.kind === 'rel');
      problems.push({type: relIdea ? 'fragment-rel' : 'fragment', idea: noVerbMain});
    }
    if (!main.length && clauses.some(x => x.kind === 'sub')) problems.push({type:'half', idea: clauses[0]});
    ideas.filter(x => x.runon).forEach(x => problems.push({type:'runon', idea:x, at:x.start}));
    ideas.filter(x => x.comma != null && x.kind === 'main').forEach(x => problems.push({type:'splice', idea:x, at:x.comma}));
    ideas.filter(x => x.subComma).forEach(x => problems.push({type:'subcomma', idea:x, at:x.start}));
    const ands = ideas.filter(x => x.join === 'and').length;
    if (clauses.length >= 3 && ands >= 2) problems.push({type:'ands', count: clauses.length});
    return {ideas, problems};
  }

  // Split into sentences, keep the original text spans so fixes can be applied.
  function analyse(text){
    const raw = tokenize(text);
    let tags = null;
    if (typeof winkPOSTagger !== 'undefined'){
      try { const t = winkPOSTagger.tagRawTokens(raw); if (t && t.length === raw.length) tags = t.map(x => x.pos); } catch(e) {}
    }
    // char offsets of each token
    const offs = []; let pos = 0;
    raw.forEach(tk => { const at = text.indexOf(tk, pos); offs.push([at, at + tk.length]); pos = at + tk.length; });
    const sentences = [];
    let s0 = 0;
    for (let i = 0; i <= raw.length; i++){
      if (i === raw.length || PUNCT_END.has(raw[i])){
        const end = i < raw.length ? i + 1 : i;
        if (end > s0){
          const toks = raw.slice(s0, end);
          if (toks.some(t => /[A-Za-z]/.test(t))){
            const r = analyseSentence(toks, tags && tags.slice(s0, end));
            const sp = {from:s0, to:end, tokens:toks, offs:offs.slice(s0, end), ...r};
            if (!/^[A-Z0-9]/.test(toks[0])) sp.problems.unshift({type:'capital'});
            if (!PUNCT_END.has(toks[toks.length - 1])) sp.problems.push({type:'stop'});
            sentences.push(sp);
          }
        }
        s0 = end;
      }
    }
    return {raw, sentences};
  }

  return {analyse, tokenize};
})();
