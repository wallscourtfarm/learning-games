/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Games OPEN PLAY

   Loaded by every game in spelling-games/open/ in place of ../roster.js.
   Open play has no login and keeps nothing about any child:
     - no roster, no ID, no PIN, no QR card, no named leaderboard
     - every player is the same anonymous "PLAY" player
     - nothing is sent to, or fetched from, the WFA API (any request to
       api.wallscourt-farm-academy.co.uk is blocked below)
     - scores, leaderboards and "last player" are never stored on the device

   The words and rules come from ../lessons-data.js (the same static file
   the live games use). The current week comes from OPEN_TERM_DATES below:
   a copy of the school calendar (TermDates in the WFA database, read
   12.11.26). It moves on by itself each Monday. Refresh it only if the
   term dates are changed, or for the new school year (September 2027).
   ════════════════════════════════════════════════════════════════ */

const OPEN_VERSION = "WFA-12.11.26a";
const OPEN_PLAYER_ID = "PLAY";
const OPEN_YEARS = ["Y2", "Y3", "Y4", "Y5", "Y6"];

/* [term, week, Monday the week starts] — TermDates, 2026-27 */
const OPEN_TERM_DATES = [
  ["T1","W1","2026-09-07"],
  ["T1","W2","2026-09-14"],
  ["T1","W3","2026-09-21"],
  ["T1","W4","2026-09-28"],
  ["T1","W5","2026-10-05"],
  ["T1","W6","2026-10-12"],
  ["T1","W7","2026-10-19"],
  ["T2","W1","2026-11-02"],
  ["T2","W2","2026-11-09"],
  ["T2","W3","2026-11-16"],
  ["T2","W4","2026-11-23"],
  ["T2","W5","2026-11-30"],
  ["T2","W6","2026-12-07"],
  ["T2","W7","2026-12-14"],
  ["T3","W1","2027-01-04"],
  ["T3","W2","2027-01-11"],
  ["T3","W3","2027-01-18"],
  ["T3","W4","2027-01-25"],
  ["T3","W5","2027-02-01"],
  ["T3","W6","2027-02-08"],
  ["T4","W1","2027-02-22"],
  ["T4","W2","2027-03-01"],
  ["T4","W3","2027-03-08"],
  ["T4","W4","2027-03-15"],
  ["T4","W5","2027-03-22"],
  ["T5","W1","2027-04-12"],
  ["T5","W2","2027-04-19"],
  ["T5","W3","2027-04-26"],
  ["T5","W4","2027-05-03"],
  ["T5","W5","2027-05-10"],
  ["T5","W6","2027-05-17"],
  ["T5","W7","2027-05-24"],
  ["T6","W1","2027-06-07"],
  ["T6","W2","2027-06-14"],
  ["T6","W3","2027-06-21"],
  ["T6","W4","2027-06-28"],
  ["T6","W5","2027-07-05"],
  ["T6","W6","2027-07-12"],
  ["T6","W7","2027-07-19"]
];

/* ── Hard stop: nothing in open play may talk to the WFA API ── */
(function blockApi() {
  const blocked = u => /(^|\/\/)api\.wallscourt-farm-academy\.co\.uk/i.test(String(u || ""));
  const realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    const url = input && input.url ? input.url : input;
    if (blocked(url)) return Promise.reject(new Error("Open play: no API calls"));
    return realFetch(input, init);
  };
  if (navigator.sendBeacon) {
    const realBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => blocked(url) ? false : realBeacon(url, data);
  }
})();

/* ── Nothing about a player is kept on the device ── */
(function noPlayerStorage() {
  const realSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (/leaderboard|-lb|last-id|verified|roster-cache/i.test(String(key))) return;
    return realSet.call(this, key, value);
  };
})();

/* ── Same names the games expect from roster.js, with nothing in them ── */
const BACKEND_URL = "";
let ROSTER = [];

function openTodayIso() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function openCurrentWeek() {
  const today = openTodayIso();
  let best = null;
  OPEN_TERM_DATES.forEach(([term, week, start]) => { if (start <= today) best = { term, week }; });
  if (!best) best = { term: OPEN_TERM_DATES[0][0], week: OPEN_TERM_DATES[0][1] };
  return best;
}
let CURRENT_WEEK = openCurrentWeek();

/* The week a year group plays by default: this week, or, when this week has
   no words for that year (e.g. weeks 6-7 of a term), the latest earlier week
   that does. Null when the year has no weeks yet. */
function openDefaultWeek(year) {
  const weeks = spGetAvailableWeeksForYear(year, CURRENT_WEEK);
  return weeks.length ? weeks[weeks.length - 1] : null;
}

/* Every game roster.js lists for the live site. */
const GAMES = [
  {
    id: "spelling-pop",  label: "Spelling Pop",  icon: "🫧", path: "spelling-pop/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
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
  { id: "fill-the-gap", label: "Fill the Gap", icon: "📝", path: "fill-the-gap/index.html" },
  { id: "spot-the-mistake", label: "Spot the Mistake", icon: "🧐", path: "spot-the-mistake/index.html" },
  { id: "word-chomper", label: "Word Chomper", icon: "🟡", path: "word-chomper/index.html" },
  // Spelling Pop (top), Word Jumble and Dictionary Dash use the week's words (roster.js lists
  // them as always ready, which only works because the live menu never
  // offers a week with no words), so here they need words too.
  {
    id: "word-jumble", label: "Word Jumble", icon: "🔀", path: "word-jumble/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  { id: "contraction-clinic", label: "Contraction Clinic", icon: "💊", path: "contraction-clinic/index.html" },
  {
    id: "dictionary-dash", label: "Dictionary Dash", icon: "📖", path: "dictionary-dash/index.html",
    isAvailable: (year, term, week) => spGetWeekPool(year, term, week).words.length > 0
  },
  { id: "memory-pairs", label: "Memory Pairs", icon: "🃏", path: "memory-pairs/index.html" },
  { id: "syllable-split", label: "Syllable Split", icon: "✂️", path: "syllable-split/index.html" },
  { id: "phoneme-frames", label: "Phoneme Frame Builder", icon: "🧩", path: "phoneme-frames/index.html" }
];

/* ── Inside a game page: everyone is the anonymous player ── */
(function openPlayer() {
  if (!/\/open\/[^/]+\/(index\.html)?$/.test(location.pathname)) return; // only the game pages, not the open hub
  const params = new URLSearchParams(location.search);
  const year = OPEN_YEARS.includes(params.get("y")) ? params.get("y") : "Y5";
  if ((params.get("u") || "").toUpperCase() !== OPEN_PLAYER_ID) {
    params.set("u", OPEN_PLAYER_ID);
    try { history.replaceState(null, "", location.pathname + "?" + params.toString() + location.hash); } catch (e) {}
  }
  const player = { id: OPEN_PLAYER_ID, name: "Player", year };

  window.spFindLearnerOrTeacher = () => player;
  window.spGetVerifiedLearnerId = () => OPEN_PLAYER_ID;
  window.spGetVerifiedToken = () => "";
  window.spSetVerifiedLearner = () => {};
  window.spClearVerifiedLearner = () => {};
  window.spVerifyPin = async () => ({ ok: true, learner: player, token: "" });
  window.spFetchLiveRoster = async () => null;
  window.spFetchAdminRoster = async () => null;
  window.spFetchAdminStats = async () => null;
  window.spSyncRoster = async () => ({ error: "open play" });

  // Hide the leaderboards, the sign-in boxes and "next player sign in".
  const css = document.createElement("style");
  css.textContent = `
    .board-title, #leaderboard-list, #leaderboard-list-end, #leaderboard-over,
    #lb-setup, #lb-over,
    .panel:has(> #leaderboard-list), .panel:has(> #leaderboard-list-end),
    h2:has(+ #lb-setup), h2:has(+ #lb-over), #signout-btn, #manual-gate,
    #menu-btn, #guest-gate, #pin-gate, #bad-code-banner, footer.note { display: none !important; }`;
  document.head.appendChild(css);
})();
