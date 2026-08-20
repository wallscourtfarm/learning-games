/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Homophones data

   Fixed National Curriculum homophone/near-homophone lists (not tied to
   the weekly hlWords progression in lessons-data.js — these are the same
   pairs every year, grouped by key stage). Each entry pairs a word with a
   one-sentence context that only that spelling fits, since a homophone
   can't be tested by sound alone.

   Sentences are hand-written for this game, not sourced from a dictionary
   — worth a skim before trusting them with a class, the same way you'd
   check any teaching resource.
   ════════════════════════════════════════════════════════════════ */

const HOMOPHONE_TIERS = [
  { id: "ks1", label: "Years 1 & 2 — common pairs" },
  { id: "y34", label: "Years 3 & 4" },
  { id: "y56", label: "Years 5 & 6" }
];

const HOMOPHONE_GROUPS = [
  // ── Years 1 & 2 ──────────────────────────────────────────────────────
  { id: "to-too-two", tier: "ks1", words: [
    { word: "to", sentence: "I am going ___ the park." },
    { word: "too", sentence: "Can I come ___?" },
    { word: "two", sentence: "She has ___ brothers." }
  ]},
  { id: "their-there-theyre", tier: "ks1", words: [
    { word: "their", sentence: "The children left ___ coats on the peg." },
    { word: "there", sentence: "Put the box over ___." },
    { word: "they're", sentence: "___ going to be late for school." }
  ]},
  { id: "one-won", tier: "ks1", words: [
    { word: "one", sentence: "I only have ___ pencil left." },
    { word: "won", sentence: "Our team ___ the match." }
  ]},
  { id: "see-sea", tier: "ks1", words: [
    { word: "see", sentence: "Can you ___ the bird in the tree?" },
    { word: "sea", sentence: "We swam in the ___ on holiday." }
  ]},
  { id: "be-bee", tier: "ks1", words: [
    { word: "be", sentence: "I want to ___ a doctor when I grow up." },
    { word: "bee", sentence: "A ___ landed on the flower." }
  ]},
  { id: "blue-blew", tier: "ks1", words: [
    { word: "blue", sentence: "The sky was bright ___ today." },
    { word: "blew", sentence: "The wind ___ the leaves off the tree." }
  ]},
  { id: "hear-here", tier: "ks1", words: [
    { word: "hear", sentence: "Can you ___ the music playing?" },
    { word: "here", sentence: "Come and sit ___ next to me." }
  ]},
  { id: "knight-night", tier: "ks1", words: [
    { word: "knight", sentence: "The ___ rode into battle on his horse." },
    { word: "night", sentence: "The stars come out at ___." }
  ]},
  { id: "write-right", tier: "ks1", words: [
    { word: "write", sentence: "Please ___ your name at the top of the page." },
    { word: "right", sentence: "Turn ___ at the end of the road." }
  ]},
  { id: "bear-bare", tier: "ks1", words: [
    { word: "bear", sentence: "We saw a ___ at the zoo." },
    { word: "bare", sentence: "His feet were ___ on the cold floor." }
  ]},
  { id: "flower-flour", tier: "ks1", words: [
    { word: "flower", sentence: "She picked a beautiful ___ from the garden." },
    { word: "flour", sentence: "We need more ___ to bake the cake." }
  ]},
  { id: "sun-son", tier: "ks1", words: [
    { word: "sun", sentence: "The ___ was shining brightly today." },
    { word: "son", sentence: "Mr Ahmed's ___ is in Year 3." }
  ]},

  // ── Years 3 & 4 ──────────────────────────────────────────────────────
  { id: "accept-except", tier: "y34", words: [
    { word: "accept", sentence: "I would like to ___ your kind invitation." },
    { word: "except", sentence: "Everyone was ready ___ Tom." }
  ]},
  { id: "affect-effect", tier: "y34", words: [
    { word: "affect", sentence: "The rain will ___ our plans for the picnic." },
    { word: "effect", sentence: "The medicine had an immediate ___." }
  ]},
  { id: "ball-bawl", tier: "y34", words: [
    { word: "ball", sentence: "He kicked the ___ into the goal." },
    { word: "bawl", sentence: "The toddler began to ___ when he dropped his toy." }
  ]},
  { id: "berry-bury", tier: "y34", words: [
    { word: "berry", sentence: "She picked a red ___ from the bush." },
    { word: "bury", sentence: "The dog likes to ___ its bones in the garden." }
  ]},
  { id: "brake-break", tier: "y34", words: [
    { word: "brake", sentence: "The cyclist pulled the ___ to stop suddenly." },
    { word: "break", sentence: "We have a ten-minute ___ between lessons." }
  ]},
  { id: "fair-fare", tier: "y34", words: [
    { word: "fair", sentence: "It isn't ___ that she got two turns." },
    { word: "fare", sentence: "The bus ___ went up by ten pence." }
  ]},
  { id: "grate-great", tier: "y34", words: [
    { word: "grate", sentence: "Can you ___ the cheese for the pasta?" },
    { word: "great", sentence: "That was a ___ performance!" }
  ]},
  { id: "groan-grown", tier: "y34", words: [
    { word: "groan", sentence: "He let out a ___ when he saw the homework." },
    { word: "grown", sentence: "You have ___ so much since last year!" }
  ]},
  { id: "heel-heal-hell", tier: "y34", words: [
    { word: "heel", sentence: "She hurt her ___ playing football." },
    { word: "heal", sentence: "The cut will ___ in a few days." },
    { word: "he'll", sentence: "___ be here in ten minutes." }
  ]},
  { id: "knot-not", tier: "y34", words: [
    { word: "knot", sentence: "Tie a ___ in the rope so it doesn't slip." },
    { word: "not", sentence: "I am ___ going to the party." }
  ]},
  { id: "mail-male", tier: "y34", words: [
    { word: "mail", sentence: "The postman delivered the ___ this morning." },
    { word: "male", sentence: "The ___ lion has a large mane." }
  ]},
  { id: "main-mane", tier: "y34", words: [
    { word: "main", sentence: "The ___ road was closed for repairs." },
    { word: "mane", sentence: "The horse's ___ was long and shiny." }
  ]},
  { id: "meat-meet", tier: "y34", words: [
    { word: "meat", sentence: "We had roast ___ for Sunday lunch." },
    { word: "meet", sentence: "Let's ___ outside the library at four o'clock." }
  ]},
  { id: "medal-meddle", tier: "y34", words: [
    { word: "medal", sentence: "She won a gold ___ at the sports day." },
    { word: "meddle", sentence: "It's rude to ___ in other people's business." }
  ]},
  { id: "missed-mist", tier: "y34", words: [
    { word: "missed", sentence: "I ___ the bus this morning." },
    { word: "mist", sentence: "A thick ___ covered the hills at dawn." }
  ]},
  { id: "peace-piece", tier: "y34", words: [
    { word: "peace", sentence: "The two countries finally agreed to make ___." },
    { word: "piece", sentence: "Can I have a ___ of cake, please?" }
  ]},
  { id: "plain-plane", tier: "y34", words: [
    { word: "plain", sentence: "She wore a ___ white t-shirt." },
    { word: "plane", sentence: "The ___ took off from the runway." }
  ]},
  { id: "rain-rein-reign", tier: "y34", words: [
    { word: "rain", sentence: "Heavy ___ fell all afternoon." },
    { word: "rein", sentence: "The rider held the ___ tightly." },
    { word: "reign", sentence: "Queen Victoria's ___ lasted over sixty years." }
  ]},
  { id: "scene-seen", tier: "y34", words: [
    { word: "scene", sentence: "The first ___ of the play was very funny." },
    { word: "seen", sentence: "Have you ___ my school bag anywhere?" }
  ]},
  { id: "weather-whether", tier: "y34", words: [
    { word: "weather", sentence: "The ___ forecast says it will be sunny tomorrow." },
    { word: "whether", sentence: "I don't know ___ we should go outside or stay in." }
  ]},
  { id: "whose-whos", tier: "y34", words: [
    { word: "whose", sentence: "___ coat is this on the floor?" },
    { word: "who's", sentence: "___ coming to the party on Saturday?" }
  ]},

  // ── Years 5 & 6 ──────────────────────────────────────────────────────
  { id: "advice-advise", tier: "y56", words: [
    { word: "advice", sentence: "My teacher gave me some useful ___." },
    { word: "advise", sentence: "I would ___ you to check your work carefully." }
  ]},
  { id: "device-devise", tier: "y56", words: [
    { word: "device", sentence: "She used an electronic ___ to record the sound." },
    { word: "devise", sentence: "The scientists had to ___ a new plan." }
  ]},
  { id: "father-farther", tier: "y56", words: [
    { word: "father", sentence: "My ___ works at the hospital." },
    { word: "farther", sentence: "The next village is ___ than I thought." }
  ]},
  { id: "guessed-guest", tier: "y56", words: [
    { word: "guessed", sentence: "I ___ the answer correctly." },
    { word: "guest", sentence: "We welcomed a special ___ to our assembly." }
  ]},
  { id: "heard-herd", tier: "y56", words: [
    { word: "heard", sentence: "I ___ a strange noise in the night." },
    { word: "herd", sentence: "A ___ of cows crossed the field." }
  ]},
  { id: "led-lead", tier: "y56", words: [
    { word: "led", sentence: "The captain ___ the team onto the pitch." },
    { word: "lead", sentence: "Pencils used to be made with a metal called ___." }
  ]},
  { id: "license-licence", tier: "y56", words: [
    { word: "license", sentence: "You must ___ this software before you can use it." },
    { word: "licence", sentence: "You need a ___ to drive a car." }
  ]},
  { id: "morning-mourning", tier: "y56", words: [
    { word: "morning", sentence: "We have maths first thing in the ___." },
    { word: "mourning", sentence: "The whole village was ___ the loss of their friend." }
  ]},
  { id: "past-passed", tier: "y56", words: [
    { word: "past", sentence: "The old mill has stood there for years ___." },
    { word: "passed", sentence: "She ___ her spelling test with full marks." }
  ]},
  { id: "practice-practise", tier: "y56", words: [
    { word: "practice", sentence: "Football ___ is on Tuesday after school." },
    { word: "practise", sentence: "You need to ___ your times tables every night." }
  ]},
  { id: "precede-proceed", tier: "y56", words: [
    { word: "precede", sentence: "A short introduction will ___ the main speech." },
    { word: "proceed", sentence: "Please ___ to the hall once you are ready." }
  ]},
  { id: "principal-principle", tier: "y56", words: [
    { word: "principal", sentence: "The school ___ welcomed the new pupils." },
    { word: "principle", sentence: "Honesty is an important ___ to live by." }
  ]},
  { id: "profit-prophet", tier: "y56", words: [
    { word: "profit", sentence: "The shop made a small ___ this month." },
    { word: "prophet", sentence: "The ___ warned the people of what was to come." }
  ]},
  { id: "prophecy-prophesy", tier: "y56", words: [
    { word: "prophecy", sentence: "The old ___ said a hero would return." },
    { word: "prophesy", sentence: "It is hard to ___ exactly what will happen." }
  ]},
  { id: "stationary-stationery", tier: "y56", words: [
    { word: "stationary", sentence: "The train remained ___ for over an hour." },
    { word: "stationery", sentence: "We bought new pens and paper from the ___ shop." }
  ]},
  { id: "steal-steel", tier: "y56", words: [
    { word: "steal", sentence: "It is wrong to ___ from a shop." },
    { word: "steel", sentence: "The bridge was built from strong ___." }
  ]},
  { id: "wary-weary", tier: "y56", words: [
    { word: "wary", sentence: "The cat was ___ of the loud vacuum cleaner." },
    { word: "weary", sentence: "By the end of the hike, we all felt ___." }
  ]}
];

/* Maps a pupil's year group to every tier they should practise —
   cumulative, not just their own year's tier. The pairs that trip up a Y2
   pupil ("their"/"there") still trip up a Y6 one, and the words introduced
   later in KS2 (e.g. "stationary"/"stationery") come up far less often in
   writing than the early ones — so an older pupil gets a mix of everything
   up to their year rather than being narrowed to only the hardest set. */
function spHomophoneTiersForYear(year) {
  const n = parseInt(String(year).replace(/[^0-9]/g, ""), 10);
  if (!n || n <= 2) return ["ks1"];
  if (n <= 4) return ["ks1", "y34"];
  return ["ks1", "y34", "y56"];
}
