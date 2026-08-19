/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Games shared roster (PROOF OF CONCEPT)
   Five made-up pupils standing in for a real class list.

   Shared by every game under spelling-games/ — one file to edit, not
   one per game. Each pupil gets:
     id   — short code used both as a QR code's "?u=" value and as
             something they can type by hand if a device has no camera
     name — shown on screen once they're identified
     pin  — 4-digit PIN, printed on their card, given out by the teacher
     year — Y2–Y6, picks which year group's word lists they see

   In a real deployment this file would be generated from the class
   list already held in the Spelling Assessment tool, with PINs
   randomly generated once per pupil and never shown again outside
   their printed card.
   ════════════════════════════════════════════════════════════════ */
const ROSTER = [
  { id: "AM72", name: "Amelia", pin: "4821", year: "Y5" },
  { id: "NH19", name: "Noah",   pin: "1937", year: "Y5" },
  { id: "FR66", name: "Freya",  pin: "6650", year: "Y5" },
  { id: "RH33", name: "Rohan",  pin: "3308", year: "Y5" },
  { id: "IS91", name: "Isla",   pin: "9142", year: "Y5" }
];

/* The week currently being taught — the one thing to change here each
   week when printing new cards. Every pupil's card uses this same
   term/week, each within their own year group above. */
const CURRENT_WEEK = { term: "T1", week: "W1" };

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
  }
];
