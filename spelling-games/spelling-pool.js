/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Games shared word-pool helpers

   Turns LESSONS (lessons-data.js) into what a game actually needs:
   a year + week picker, the union of every word taught that week
   (not just one lesson's 5), the rule text to show, and a plausible
   "wrong" spelling for each word so games like Spelling Pop can ask
   "which one is right?" without a hand-authored word list.

   Any game on the site can include this file + lessons-data.js and
   get the same picker/pool behaviour for free.
   ════════════════════════════════════════════════════════════════ */

const TERM_LABELS = { T1: "Term 1", T2: "Term 2", T3: "Term 3", T4: "Term 4", T5: "Term 5", T6: "Term 6" };

function spGetYears() {
  return [...new Set(LESSONS.map(l => l.year))].sort();
}

function spGetWeeksForYear(year) {
  const seen = new Set();
  const out = [];
  LESSONS.filter(l => l.year === year).forEach(l => {
    const key = l.term + l.week;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ term: l.term, week: l.week, label: `${TERM_LABELS[l.term] || l.term} — Week ${l.week.replace("W", "")}` });
    }
  });
  out.sort((a, b) => a.term === b.term
    ? parseInt(a.week.slice(1), 10) - parseInt(b.week.slice(1), 10)
    : a.term.localeCompare(b.term));
  return out;
}

function spGetWeekLessons(year, term, week) {
  return LESSONS.filter(l => l.year === year && l.term === term && l.week === week)
    .sort((a, b) => a.weekLesson - b.weekLesson);
}

/**
 * The full word pool + distinct rules for a year/term/week, combining every
 * lesson that week — the "Mix (choose from all lessons)" behaviour already
 * used by the Home Learning picker in the Spelling Assessment tool.
 */
function spGetWeekPool(year, term, week) {
  const lessons = spGetWeekLessons(year, term, week);
  const words = [...new Set(lessons.flatMap(l => (l.hlWords || []).map(w => w.toLowerCase())))];

  // Dedupe by explanation text, not focus+explanation — several lessons in
  // a week often share identical explanation text but differ in their
  // (sometimes empty, sometimes truncated) focus label, which otherwise
  // shows the same rule card twice.
  const byExplanation = new Map();
  lessons.forEach(l => {
    if (!l.explanation) return;
    const existing = byExplanation.get(l.explanation);
    if (!existing || (!existing.focus && l.focus)) {
      byExplanation.set(l.explanation, { focus: l.focus, explanation: l.explanation, exampleWords: l.hlWords || [] });
    }
  });

  return { year, term, week, lessons, words, rules: [...byExplanation.values()] };
}

/* ── Heuristic "wrong spelling" generator ──
   There's no hand-authored list of common errors in the source data, so
   this guesses a plausible near-miss: known rule-shaped patterns first
   (the same families that show up across the curriculum — -tch/-ch,
   doubled consonants, silent letters, -dge/-ge, -ies), then a generic
   single-letter drop as a fallback for anything else. It's a heuristic,
   not a verified list — worth a quick glance before using with a class,
   the same way you'd skim any auto-generated resource. */
function spGuessWrongSpelling(word) {
  const w = String(word).toLowerCase();
  const patterns = [
    { test: /tch/, apply: s => s.replace("tch", "ch") },
    { test: /dge/, apply: s => s.replace("dge", "ge") },
    { test: /^kn/, apply: s => s.slice(1) },
    { test: /^gn/, apply: s => s.slice(1) },
    { test: /^wr/, apply: s => s.replace(/^wr/, "r") },
    { test: /ies$/, apply: s => s.replace(/ies$/, "ys") },
    { test: /ck/, apply: s => s.replace("ck", "k") },
    { test: /ph/, apply: s => s.replace("ph", "f") },
    { test: /([a-z])\1/, apply: s => s.replace(/([a-z])\1/, "$1") }
  ];
  for (const p of patterns) {
    if (p.test.test(w)) {
      const out = p.apply(w);
      if (out && out !== w) return out;
    }
  }
  // Generic fallback: drop one interior letter.
  if (w.length > 3) {
    const i = 1 + Math.floor(Math.random() * (w.length - 2));
    return w.slice(0, i) + w.slice(i + 1);
  }
  return w + w.slice(-1); // last resort for very short words
}

function spBuildWordPairs(words) {
  return words
    .map(w => ({ correct: w, wrong: spGuessWrongSpelling(w) }))
    .filter(p => p.wrong && p.wrong !== p.correct);
}

/* ── Sort buckets, for sorting-style games ──
   A week only has something to sort when its rule offers a genuine
   choice between several categories, tried in this order:

   1. "Alternative graphemes" rules — 'ai' (rain, pain), 'ay' (day, stay)
      — curriculum-authored example words right there in the rule text,
      the most reliable source available. Topped up with any of the
      week's own words that independently match the same pattern.

   2. Prefix families — un/dis/mis/... — detected from the week's own
      word list, but ONLY when that week's rule text actually mentions
      "prefix". Without that gate, a coincidental "re" at the start of
      an unrelated word (received, relief — really an ei/ie lesson) gets
      wrongly treated as the re- prefix; gating on the rule's own text
      cut that false-positive rate to near zero in testing.

   3. Suffix families — -ing/-ed/-ment/... — same idea, gated on the
      rule text mentioning "suffix".

   Roughly a third of weeks have one of these three structures. The
   rest (single-transformation rules like "double the consonant before
   -ing", or mixed revision weeks with no common thread) genuinely have
   nothing to sort into groups — this returns null rather than forcing
   a thin or unreliable set of buckets on them.
*/
const SP_PREFIXES = ["un","dis","mis","im","il","ir","in","re","sub","inter","super","anti","auto","de","over","under","pre","non","mid"];
const SP_SUFFIXES = ["ing","ed","er","est","ly","ment","ness","ful","less","tion","sion","cian","ssion","sure","ture","able","ible","ant","ance","ancy","ent","ence","ency","ous","ious","eous","ive","ary","ery","ory","al","ic","ist","ism","hood","ship","dom"];

function spGetGraphemeBuckets(pool) {
  const grapheme = spFindBestBuckets(pool.rules, r => spExtractCuratedBuckets(r.explanation));
  if (grapheme) {
    // Top up with any of the week's own words that independently match —
    // only possible for this source, since prefix/suffix buckets are
    // already built from the week's own word list.
    const graphemes = grapheme.buckets.map(b => b.grapheme);
    pool.words.forEach(word => {
      const matches = graphemes.filter(g => spGraphemeMatches(word, g));
      if (matches.length === 1) {
        const bucket = grapheme.buckets.find(b => b.grapheme === matches[0]);
        if (!bucket.words.includes(word)) bucket.words.push(word);
      }
    });
    return grapheme;
  }

  const prefix = spFindBestBuckets(pool.rules, r =>
    spMentionsAffix(r, "prefix") ? spAffixBuckets(pool.words, SP_PREFIXES, true) : []
  );
  if (prefix) return prefix;

  const suffix = spFindBestBuckets(pool.rules, r =>
    spMentionsAffix(r, "suffix") ? spAffixBuckets(pool.words, SP_SUFFIXES, false) : []
  );
  if (suffix) return suffix;

  return null;
}

function spFindBestBuckets(rules, getBuckets) {
  let best = null;
  rules.forEach(r => {
    const buckets = getBuckets(r);
    if (buckets.length >= 2 && (!best || buckets.length > best.buckets.length)) {
      best = { focus: r.focus, explanation: r.explanation, buckets };
    }
  });
  return best;
}

function spMentionsAffix(rule, word) {
  return new RegExp(word, "i").test((rule.focus || "") + " " + (rule.explanation || ""));
}

function spExtractCuratedBuckets(explanation) {
  const buckets = [];
  const re = /'([a-z-]+)'\s*\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(explanation))) {
    const words = [...new Set(m[2].split(",").map(w => w.trim().toLowerCase()).filter(Boolean))];
    if (words.length >= 2) buckets.push({ grapheme: m[1], words });
  }
  return buckets;
}

function spGraphemeMatches(word, grapheme) {
  if (grapheme.startsWith("-")) return word.endsWith(grapheme.slice(1));
  if (grapheme.includes("-")) {
    const [a, b] = grapheme.split("-");
    return new RegExp(a + "[^aeiou]+" + b + "$").test(word);
  }
  return word.includes(grapheme);
}

/* Buckets words by which prefix/suffix they contain, from a fixed list —
   only called once the rule text has confirmed this week is actually
   about prefixes/suffixes (see spGetGraphemeBuckets). A word matching
   more than one candidate, or leaving too short a remainder to be a
   real root (e.g. "in" + "n"), is left out rather than guessed at. */
function spAffixBuckets(words, affixes, isPrefix) {
  const map = new Map();
  words.forEach(word => {
    const matches = affixes.filter(a => isPrefix ? word.startsWith(a) : word.endsWith(a));
    if (matches.length !== 1) return;
    const affix = matches[0];
    const remainder = isPrefix ? word.slice(affix.length) : word.slice(0, word.length - affix.length);
    if (remainder.length < 2) return;
    if (!map.has(affix)) map.set(affix, []);
    map.get(affix).push(word);
  });
  return [...map.entries()]
    .map(([grapheme, words]) => ({ grapheme, words }))
    .filter(b => b.words.length >= 2);
}

/* ── Live roster/settings fetch ──
   Pupil setup lives in the backend's Google Sheet (see setupRosterSheet()
   in Code.gs), not in a hand-edited JS file. Every game and cards.html
   call this once at load, before falling back to the static ROSTER /
   CURRENT_WEEK in roster.js if the backend isn't set or the fetch fails —
   so everything still works offline or before the Sheet is set up. */
async function spFetchLiveRoster(backendUrl) {
  if (!backendUrl) return null;
  try {
    const res = await fetch(`${backendUrl}?action=roster`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.roster || !data.roster.length) return null;
    return data;
  } catch (e) {
    console.warn("Live roster fetch failed, using the roster.js fallback:", e);
    return null;
  }
}

/* ── "Verified this tab" — once a pupil's code + PIN is checked anywhere
   in Spelling Games (the hub page or a game reached directly via QR),
   every other game/page in the same browser tab can trust that without
   asking again. sessionStorage clears when the tab closes, so handing an
   iPad to a different child (a fresh tab, or reopening the browser) still
   requires the PIN — this only removes repeat prompts within one sitting. */
const SP_VERIFIED_KEY = "wfa-spelling-verified-id";
function spSetVerifiedPupil(id) {
  try { sessionStorage.setItem(SP_VERIFIED_KEY, String(id).toUpperCase()); } catch (e) {}
}
function spGetVerifiedPupilId() {
  try { return sessionStorage.getItem(SP_VERIFIED_KEY) || ""; } catch (e) { return ""; }
}
function spClearVerifiedPupil() {
  try { sessionStorage.removeItem(SP_VERIFIED_KEY); } catch (e) {}
}
