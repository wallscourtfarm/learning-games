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
  const SUB_OR_PREP = S('after before until since as once');   // a joining word only if a who + doing follows
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
  // punctuation checks
  const FRONT_WORDS = S('yesterday today tomorrow tonight suddenly meanwhile later finally eventually afterwards once soon earlier outside inside nearby somewhere everywhere silently slowly quickly carefully');
  const TIME_START = S('this every all one last next each that later early');
  const TIME_NOUN = S('morning afternoon evening night day week year summer winter spring autumn long weekend time');
  const Q_WORDS = S('what where why how who when which whose');
  const DAYS_MONTHS = S('monday tuesday wednesday thursday friday saturday sunday january february march april june july august september october november december');
  const CONTRACT = {dont:"don't", cant:"can't", didnt:"didn't", isnt:"isn't", wasnt:"wasn't", werent:"weren't", doesnt:"doesn't", havent:"haven't", hasnt:"hasn't", hadnt:"hadn't", couldnt:"couldn't", wouldnt:"wouldn't", shouldnt:"shouldn't", arent:"aren't", im:"I'm", ive:"I've", youre:"you're", thats:"that's", whats:"what's", theyve:"they've", weve:"we've", youve:"you've", shes:"she's", wouldve:"would've", couldve:"could've", shouldve:"should've"};
  const NOT_ED_VERB = S('red bed shed sled hundred sacred naked wicked beloved crooked ragged rugged jagged aged learned');
  const PUNCT_END = S('. ! ?');

  const tokenize = str => str.match(/[A-Za-z][A-Za-z'’-]*|[0-9]+|[.,!?;:()]/g) || [];

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
    const isPunct = i => /^[.,!?;:()]$/.test(raw[i]);
    const prevWord = i => { for (let k = i - 1; k >= 0; k--) if (!isPunct(k)) return k; return -1; };

    // a describing word before the doing word, e.g. "the scared runs" — but in "the chief holds" the word
    // straight after "the" must be the who itself, whatever the tagger thinks
    // is token i inside "under the northern lights" / "in the summer holidays"? Then it is not a doing word.
    function inPrepPhrase(i){
      let k = i - 1;
      while (k >= 0 && !isPunct(k) && !DET.has(low[k]) && !PREP.has(low[k]) && !SUB_OR_PREP.has(low[k])) k--;
      if (k >= 0 && DET.has(low[k])) k--;
      // only a phrase at the start of the sentence ("The shoal of fish swirls" is still a who + doing)
      return k >= 0 && (k === 0 || isPunct(k - 1)) && (PREP.has(low[k]) || (SUB_OR_PREP.has(low[k]) && !(k + 1 < n && (SUBJ_PRON.has(low[k + 1]) || AMBIG_PRON.has(low[k + 1])))));
    }
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
      if (needSubj && /[a-z]{3,}ed$/.test(w) && !NOT_ED_VERB.has(w) && !DET.has(pw) && !JJ_LIKE(p) && !inPrepPhrase(i)) return true;
      if (w.endsWith('ed') && !NOT_ED_VERB.has(w) && stemIsVerb(w)) return true;
      if (/^VB[DZ]$|^MD$/.test(tag(i)) && stemIsVerb(w) && (needSubj || tag(i) === 'VBD')) return true;
      // present tense: "the rocket roars". An -s word straight after the who is a doing word,
      // unless a clear doing word follows it ("the rock samples were tested").
      if (w.endsWith('s') && !w.endsWith('ss') && stemIsVerb(w) && needSubj && !JJ_LIKE(p) && !inPrepPhrase(i)){
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
            // (a comma in between means a new start; so does the end of a fronted "As the sun sets…")
            const afterDoing = i > 0 && !isPunct(i - 1) && p >= 0 && isVerb(p, true) && !(frontedSub && !ideas.some(x => x.kind === 'main'));
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
      // "as night falls": a bare word + doing word after the joining word also counts
      const bareSub = i + 2 < n && /^[a-z]+$/.test(raw[i + 1]) && !PREP.has(low[i + 1]) && !DET.has(low[i + 1]) && isVerb(i + 2, true);
      if (SUBORD.has(w) && (!SUB_OR_PREP.has(w) || subjectVerbAt(i + 1, false) >= 0 || bareSub)){
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
          if (cur.verb == null && VERB_BASES.has(w) && i === 0 && !(i + 1 < n && /^[A-Z]/.test(raw[i + 1])) && (!tags || tag(i).startsWith('VB')) && !PREP.has(w) && !FRONT_WORDS.has(w)) cur.verb = i;    // "Pick up the rock." (not "Lord Carnarvon…")
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

    /* ---- punctuation ---- */
    // extra information about the who, in the middle of the sentence, needs a comma (or bracket) on each side:
    // "The moon, which is a satellite, orbits the Earth."
    ideas.filter(x => x.kind === 'rel').forEach(r => {
      const host = main.find(m => m.start < r.start && m.verb != null && m.verb > r.start);
      const before = r.start > 0 ? raw[r.start - 1] : '';
      const pk = r.start - 1;
      const name = pk >= 0 && /^[A-Z]/.test(raw[pk]) && (pk > 0 || (tag(pk).startsWith('NNP') && !DET.has(low[pk]) && !SUBJ_PRON.has(low[pk])));   // "Tutankhamun who…"
      if (!host) return;                                            // "roads which were straight." — at the end, commas optional
      const opened = before === ',' || before === '(';
      const between = raw.slice(r.start, host.verb);
      const closed = between.includes(',') || between.includes(')');
      if (!opened && (r.w === 'which' || name)) problems.push({type:'relcomma', idea:r, at:r.start, close:host.verb, word:r.w});
      else if (opened && !closed) problems.push({type:'relclose', idea:r, at:host.verb, bracket: before === '('});
    });
    // a fronted adverbial ("After lunch", "Suddenly") needs a comma before the who
    const first = main[0];
    if (first && first.verb != null && !frontedSub){
      let k = first.verb - 1;
      while (k >= first.start && !isPunct(k) && !PREP.has(low[k]) && !DET.has(low[k]) && !SUBJ_PRON.has(low[k]) && !AMBIG_PRON.has(low[k])) k--;
      const ss = (k >= first.start && (DET.has(low[k]) || SUBJ_PRON.has(low[k]) || AMBIG_PRON.has(low[k]))) ? k : k + 1;
      const pre = raw.slice(first.start, ss);
      const objOfPrep = ss > 0 && PREP.has(low[ss - 1]);              // "Under the bridge lived a troll"
      const fw = low[first.start];
      if (ss > first.start && !pre.includes(',') && !objOfPrep && (PREP.has(fw) || SUB_OR_PREP.has(fw) || FRONT_WORDS.has(fw) || (TIME_START.has(fw) && TIME_NOUN.has(low[first.start + 1] || '')) || /ly$/.test(fw)) && !/^(then|so|and|but|also)$/.test(fw))
        problems.push({type:'frontcomma', at:ss, front: pre.join(' ')});
    }
    // questions end with a question mark
    const w0 = low[0], w1 = low[1] || '';
    const isQ = (Q_WORDS.has(w0) && (BE_HAVE_DO.has(w1) || MODAL.has(w1))) || ((BE_HAVE_DO.has(w0) || MODAL.has(w0)) && (SUBJ_PRON.has(w1) || AMBIG_PRON.has(w1) || DET.has(w1) || /^[A-Z]/.test(raw[1] || '')));
    if (isQ && raw[n - 1] === '.') problems.push({type:'question', at:n - 1});
    // capital letters for I, days and months; apostrophes in shortened words
    raw.forEach((w, i) => {
      if (w === 'i') problems.push({type:'capI', at:i});
      else if (DAYS_MONTHS.has(w) && !(w === 'march' && i > 0 && DET.has(low[i - 1]))) problems.push({type:'propercap', at:i, word:w});   // not "the march"
      else if (CONTRACT[w.toLowerCase()] && !/^i$/i.test(w)) problems.push({type:'apos', at:i, word:w, fix: /^[A-Z]/.test(w) ? CONTRACT[w.toLowerCase()].replace(/^./, c => c.toUpperCase()) : CONTRACT[w.toLowerCase()]});
    });
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
