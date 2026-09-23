/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Games shared roster

   The real roster (22.09.26 onward) syncs automatically from the
   school's Bromcom feed — see admin/index.html's "Sync roster" button.
   Every game and cards.html fetch the live roster + current week from
   BACKEND_URL first (spFetchLiveRoster in spelling-pool.js) and only
   fall back to the five made-up learners below if BACKEND_URL is empty
   or unreachable — so this file still works standalone for local
   testing or a demo.

   ROSTER / CURRENT_WEEK are declared with `let`, not `const`, because
   a successful live fetch replaces them in place.
   ════════════════════════════════════════════════════════════════ */
let ROSTER = [
  { id: "AM72", name: "Amelia", pin: "4821", year: "Y5" },
  { id: "NH19", name: "Noah",   pin: "1937", year: "Y5" },
  { id: "FR66", name: "Freya",  pin: "6650", year: "Y5" },
  { id: "RH33", name: "Rohan",  pin: "3308", year: "Y5" },
  { id: "IS91", name: "Isla",   pin: "9142", year: "Y5" }
];

/* Fallback week when there's no live Settings tab to read — every learner's
   card/session uses this same term/week, each within their own year
   group above. */
let CURRENT_WEEK = { term: "T1", week: "W1" };

/* Same backend for every spelling game — scores, leaderboards and the
   learner roster all live behind this one URL. Empty = local-only
   (localStorage scores, the static ROSTER above).

   CUT OVER 22.09.26 to the Postgres-backed store (wfa-data) — real live
   data (282 roster rows with real PINs, 149 score rows) backfilled and
   verified first, then a real roster sync run against the Bromcom hub
   (the old Sheet-typed roster was missing 30 real pupils never added by
   hand). Old Apps Script backend deliberately left running, untouched,
   as an instant one-line rollback if ever needed:
     "https://script.google.com/macros/s/AKfycbwP3s1LdhCV3FZCYwY8QPtGZ2xeJgY8ZlEzRY44Igw2Bvr_nGUJtx7uB7JOEIXwXsPb/exec" */
const BACKEND_URL = "https://api.wallscourt-farm-academy.co.uk/planning/spellinggames-db";

/* Every game cards.html should generate a QR code for, one row per
   learner. Add a new entry here when a new game is built — nothing else
   about the card-printing page needs to change.

   isAvailable(year, term, week) is optional — only needed for a game
   that doesn't work on every week (Grapheme Sort needs a "which
   spelling?" rule, most weeks aren't that). When it returns false,
   cards.html greys out that game's QR instead of printing a dead end. */
const GAMES = [
  { id: "spelling-pop",  label: "Spelling Pop",  icon: "🫧", path: "spelling-pop/index.html" },
  {
    id: "grapheme-sort", label: "Grapheme Sort", icon: "🗂️", path: "grapheme-sort/index.html",
    isAvailable: (year, term, week) => !!spGetGraphemeBuckets(spGetWeekPool(year, term, week))
  },
  {
    id: "look-write-check", label: "Look, Cover, Write, Check", icon: "✍️", path: "look-write-check/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  {
    id: "spelling-bee", label: "Spelling Bee", icon: "🐝", path: "spelling-bee/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  {
    id: "word-search", label: "Word Search", icon: "🔍", path: "word-search/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  {
    id: "letter-detective", label: "Letter Detective", icon: "🕵️", path: "letter-detective/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  {
    id: "volcano-escape", label: "Enoch's Lava Letters", icon: "🌋", path: "volcano-escape/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  {
    id: "word-maze", label: "Word Maze", icon: "🏛️", path: "word-maze/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  // No isAvailable — homophone pairs are a fixed key-stage list, not tied
  // to the week's hlWords, so these games are always ready to play.
  { id: "fill-the-gap", label: "Fill the Gap", icon: "📝", path: "fill-the-gap/index.html" },
  { id: "spot-the-mistake", label: "Spot the Mistake", icon: "🧐", path: "spot-the-mistake/index.html" },
  // Word Chomper practises the statutory CEW / NC word lists rather than
  // the week's pool, so like the games above it's always ready to play.
  { id: "word-chomper", label: "Word Chomper", icon: "🟡", path: "word-chomper/index.html" },
  // These six also work from fixed word lists — statutory CEW words,
  // contractions, homophone families — not the week's pool, so they're
  // always ready to play too.
  { id: "word-jumble", label: "Word Jumble", icon: "🔀", path: "word-jumble/index.html" },
  { id: "contraction-clinic", label: "Contraction Clinic", icon: "💊", path: "contraction-clinic/index.html" },
  { id: "dictionary-dash", label: "Dictionary Dash", icon: "📖", path: "dictionary-dash/index.html" },
  { id: "memory-pairs", label: "Memory Pairs", icon: "🃏", path: "memory-pairs/index.html" },
  { id: "syllable-split", label: "Syllable Split", icon: "✂️", path: "syllable-split/index.html" },
  { id: "phoneme-frames", label: "Phoneme Frame Builder", icon: "🧩", path: "phoneme-frames/index.html" }
];
