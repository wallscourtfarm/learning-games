/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Games shared roster

   The real source of pupil setup is the Google Sheet behind BACKEND_URL
   below — see "Set up Roster tab" in that Sheet's menu. Every game and
   cards.html fetch the live roster + current week from there first
   (spFetchLiveRoster in spelling-pool.js) and only fall back to the
   five made-up pupils below if BACKEND_URL is empty or unreachable —
   so this file still works standalone for local testing or a demo.

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

/* Fallback week when there's no live Settings tab to read — every pupil's
   card/session uses this same term/week, each within their own year
   group above. */
let CURRENT_WEEK = { term: "T1", week: "W1" };

/* Same deployed Apps Script backend for every spelling game — scores,
   leaderboards and the pupil roster all live behind this one URL.
   Empty = local-only (localStorage scores, the static ROSTER above). */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwP3s1LdhCV3FZCYwY8QPtGZ2xeJgY8ZlEzRY44Igw2Bvr_nGUJtx7uB7JOEIXwXsPb/exec";

/* Every game cards.html should generate a QR code for, one row per
   pupil. Add a new entry here when a new game is built — nothing else
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
  }
];
