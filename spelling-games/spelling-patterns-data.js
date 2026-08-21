/* ════════════════════════════════════════════════════════════════
   Wallscourt Farm Academy — Spelling Patterns data

   Common spelling patterns that trip pupils up across every year group,
   not tied to the weekly hlWords progression in lessons-data.js — always
   available, unlike the week-scoped games. Two shapes:

   GRAPHEME_PATTERNS — "which spelling of this sound?" patterns, fed
   straight into Grapheme Sort's existing bucket-sort mechanic (same
   {grapheme, words} shape spGetGraphemeBuckets already produces).

   SUFFIX_PATTERNS — "combine the root + suffix correctly" patterns
   (doubling a consonant, changing y to i, forming a plural), fed into
   the Suffix Builder game as multiple-choice questions.

   Word lists and wrong-form distractors are hand-written for this game,
   not sourced from a dictionary — worth a skim before trusting them with
   a class, the same way you'd check any teaching resource.
   ════════════════════════════════════════════════════════════════ */

const GRAPHEME_PATTERNS = [
  {
    id: "k-ck", label: "K or CK endings",
    focus: "the /k/ sound at the end of a word",
    explanation: "After a short vowel in a short word, the /k/ sound is usually spelled -ck (back, sock, duck). After a long vowel sound, a consonant, or two vowels together, it's usually just -k (speak, milk, look).",
    buckets: [
      { grapheme: "ck", words: ["back","sock","duck","kick","neck","black","clock","trick","stick","thick","quick","crack","truck","luck","pack","rock","lock","sick","stack","brick"] },
      { grapheme: "k", words: ["speak","cook","book","look","bark","milk","thank","drink","think","pink","sink","dark","walk","talk","silk","work","park","desk","risk","cheek"] }
    ]
  },
  {
    id: "ch-tch", label: "CH or TCH endings",
    focus: "the /ch/ sound at the end of a word",
    explanation: "After a short vowel in a one-syllable word, the /ch/ sound is usually spelled -tch (catch, watch, stretch). After a long vowel, a consonant, or in most other cases, it's usually just -ch (each, teach, lunch, march). A few common exceptions (much, such, rich, which) just have to be learned.",
    buckets: [
      { grapheme: "tch", words: ["catch","watch","match","witch","fetch","stretch","hutch","patch","batch","ditch","notch","sketch","switch","snatch"] },
      { grapheme: "ch", words: ["each","reach","teach","beach","coach","speech","church","march","branch","lunch","bench","french","much","such","rich","which"] }
    ]
  },
  {
    id: "tion-family", label: "tion, sion, ssion, cian endings",
    focus: "the /shun/ sound at the end of a word",
    explanation: "The /shun/ sound at the end of a word has several spellings. -tion is the most common (station, action). -sion often follows a verb ending in -se or -de (television, division). -ssion often follows a verb ending in -ss or -mit (discussion, permission). -cian is used for a person with a particular skill (musician, magician).",
    buckets: [
      { grapheme: "tion", words: ["station","action","nation","motion","section","education","information","invitation","attention","question","creation","population","solution","addition"] },
      { grapheme: "sion", words: ["television","division","confusion","decision","occasion","explosion","tension","mansion","expansion","conclusion","invasion"] },
      { grapheme: "ssion", words: ["discussion","permission","admission","mission","session","expression","impression","possession","profession","passion"] },
      { grapheme: "cian", words: ["musician","magician","politician","electrician","physician","optician","technician"] }
    ]
  },
  {
    id: "l-endings", label: "le, el, al, il endings",
    focus: "the /l/ sound at the end of a word",
    explanation: "The /l/ sound at the end of a word can be spelled several ways. -le is the most common (table, little, apple). -el is fairly common too (travel, tunnel, camel). -al often follows a word that's also an adjective (animal, hospital, capital). -il is the least common (pencil, fossil, council).",
    buckets: [
      { grapheme: "le", words: ["table","little","apple","bottle","candle","purple","simple","uncle","ankle","middle","handle","bubble","puddle","cattle","gentle"] },
      { grapheme: "el", words: ["travel","tunnel","camel","squirrel","towel","level","tinsel","kennel","barrel","model","novel","vowel"] },
      { grapheme: "al", words: ["animal","hospital","pedal","capital","metal","petal","total","signal","normal","local","final"] },
      { grapheme: "il", words: ["pencil","fossil","nostril","tonsil","council","stencil","civil","evil"] }
    ]
  }
];

const SUFFIX_PATTERNS = [
  {
    id: "doubling", label: "Doubling the consonant before a suffix",
    focus: "doubling the last consonant before -ing/-ed/-er/-est",
    explanation: "When a short word ends in one vowel + one consonant, double that consonant before adding a suffix that starts with a vowel (hop → hopping, big → bigger). This keeps the vowel sound short.",
    items: [
      { root: "hop", instruction: "add -ing", correct: "hopping", wrong: ["hoping"] },
      { root: "run", instruction: "add -ing", correct: "running", wrong: ["runing"] },
      { root: "sit", instruction: "add -ing", correct: "sitting", wrong: ["siting"] },
      { root: "swim", instruction: "add -ing", correct: "swimming", wrong: ["swiming"] },
      { root: "plan", instruction: "add -ed", correct: "planned", wrong: ["planed"] },
      { root: "drop", instruction: "add -ed", correct: "dropped", wrong: ["droped"] },
      { root: "big", instruction: "add -er", correct: "bigger", wrong: ["biger"] },
      { root: "thin", instruction: "add -est", correct: "thinnest", wrong: ["thinest"] },
      { root: "fit", instruction: "add -ed", correct: "fitted", wrong: ["fited"] },
      { root: "shop", instruction: "add -ing", correct: "shopping", wrong: ["shoping"] },
      { root: "wet", instruction: "add -er", correct: "wetter", wrong: ["weter"] },
      { root: "sad", instruction: "add -est", correct: "saddest", wrong: ["sadest"] },
      { root: "hot", instruction: "add -est", correct: "hottest", wrong: ["hotest"] },
      { root: "win", instruction: "add -ing", correct: "winning", wrong: ["wining"] },
      { root: "rob", instruction: "add -ed", correct: "robbed", wrong: ["robed"] },
      { root: "chat", instruction: "add -ing", correct: "chatting", wrong: ["chating"] },
      { root: "grab", instruction: "add -ed", correct: "grabbed", wrong: ["grabed"] },
      { root: "slip", instruction: "add -ed", correct: "slipped", wrong: ["sliped"] },
      { root: "stop", instruction: "add -ing", correct: "stopping", wrong: ["stoping"] },
      { root: "get", instruction: "add -ing", correct: "getting", wrong: ["geting"] },
      { root: "beg", instruction: "add -ing", correct: "begging", wrong: ["beging"] },
      { root: "admit", instruction: "add -ed", correct: "admitted", wrong: ["admited"] },
      { root: "forget", instruction: "add -ing", correct: "forgetting", wrong: ["forgeting"] },
      { root: "occur", instruction: "add -ed", correct: "occurred", wrong: ["occured"] },
      { root: "prefer", instruction: "add -ed", correct: "preferred", wrong: ["prefered"] }
    ]
  },
  {
    id: "y-suffix", label: "Adding -ing, -ed, -er, -ly to words ending in Y",
    focus: "changing y to i before a suffix (except -ing)",
    explanation: "When a word ends in a consonant + y, change the y to i before adding -ed, -er, -est or -ly (happy → happier, carry → carried). But keep the y before -ing, since \"iing\" isn't a real spelling (carry → carrying). If the word ends in a vowel + y, just add the suffix with no change at all (play → played).",
    items: [
      { root: "happy", instruction: "add -ly", correct: "happily", wrong: ["happyly"] },
      { root: "happy", instruction: "add -er", correct: "happier", wrong: ["happyer"] },
      { root: "happy", instruction: "add -est", correct: "happiest", wrong: ["happyest"] },
      { root: "carry", instruction: "add -ed", correct: "carried", wrong: ["carryed"] },
      { root: "hurry", instruction: "add -ed", correct: "hurried", wrong: ["hurryed"] },
      { root: "try", instruction: "add -ed", correct: "tried", wrong: ["tryed"] },
      { root: "cry", instruction: "add -ed", correct: "cried", wrong: ["cryed"] },
      { root: "funny", instruction: "add -er", correct: "funnier", wrong: ["funnyer"] },
      { root: "funny", instruction: "add -est", correct: "funniest", wrong: ["funnyest"] },
      { root: "easy", instruction: "add -ly", correct: "easily", wrong: ["easyly"] },
      { root: "easy", instruction: "add -er", correct: "easier", wrong: ["easyer"] },
      { root: "busy", instruction: "add -er", correct: "busier", wrong: ["busyer"] },
      { root: "angry", instruction: "add -er", correct: "angrier", wrong: ["angryer"] },
      { root: "lazy", instruction: "add -er", correct: "lazier", wrong: ["lazyer"] },
      { root: "dry", instruction: "add -ed", correct: "dried", wrong: ["dryed"] },
      { root: "study", instruction: "add -ed", correct: "studied", wrong: ["studyed"] },
      { root: "apply", instruction: "add -ed", correct: "applied", wrong: ["applyed"] },
      { root: "marry", instruction: "add -ed", correct: "married", wrong: ["marryed"] },
      { root: "worry", instruction: "add -ed", correct: "worried", wrong: ["worryed"] },
      { root: "empty", instruction: "add -ed", correct: "emptied", wrong: ["emptyed"] },
      { root: "copy", instruction: "add -ed", correct: "copied", wrong: ["copyed"] },
      { root: "reply", instruction: "add -ed", correct: "replied", wrong: ["replyed"] },
      { root: "carry", instruction: "add -ing", correct: "carrying", wrong: ["carriing"] },
      { root: "hurry", instruction: "add -ing", correct: "hurrying", wrong: ["hurriing"] },
      { root: "try", instruction: "add -ing", correct: "trying", wrong: ["triing"] },
      { root: "cry", instruction: "add -ing", correct: "crying", wrong: ["criing"] },
      { root: "study", instruction: "add -ing", correct: "studying", wrong: ["studiing"] },
      { root: "apply", instruction: "add -ing", correct: "applying", wrong: ["appliing"] },
      { root: "worry", instruction: "add -ing", correct: "worrying", wrong: ["worriing"] },
      { root: "copy", instruction: "add -ing", correct: "copying", wrong: ["copiing"] },
      { root: "reply", instruction: "add -ing", correct: "replying", wrong: ["repliing"] },
      { root: "play", instruction: "add -ed", correct: "played", wrong: ["plaied"] },
      { root: "play", instruction: "add -ing", correct: "playing", wrong: ["plaing"] },
      { root: "enjoy", instruction: "add -ed", correct: "enjoyed", wrong: ["enjoied"] },
      { root: "enjoy", instruction: "add -ing", correct: "enjoying", wrong: ["enjoing"] },
      { root: "stay", instruction: "add -ed", correct: "stayed", wrong: ["staied"] },
      { root: "employ", instruction: "add -ed", correct: "employed", wrong: ["emploied"] }
    ]
  },
  {
    id: "plurals", label: "Plurals",
    focus: "changing a word to mean more than one",
    explanation: "Most words just add -s (cat → cats). Words ending in s, x, ch, sh or z add -es (bus → buses, box → boxes). Words ending in a consonant + y change y to ies (baby → babies), but words ending in a vowel + y just add -s (day → days). Some words ending in f or fe change to -ves (leaf → leaves). A few plurals are irregular and just have to be learned (child → children, mouse → mice).",
    items: [
      { root: "cat", instruction: "make it plural", correct: "cats", wrong: ["cates"] },
      { root: "dog", instruction: "make it plural", correct: "dogs", wrong: ["dogies"] },
      { root: "book", instruction: "make it plural", correct: "books", wrong: ["bookes"] },
      { root: "bus", instruction: "make it plural", correct: "buses", wrong: ["buss"] },
      { root: "box", instruction: "make it plural", correct: "boxes", wrong: ["boxs"] },
      { root: "church", instruction: "make it plural", correct: "churches", wrong: ["churchs"] },
      { root: "wish", instruction: "make it plural", correct: "wishes", wrong: ["wishs"] },
      { root: "buzz", instruction: "make it plural", correct: "buzzes", wrong: ["buzzs"] },
      { root: "baby", instruction: "make it plural", correct: "babies", wrong: ["babys"] },
      { root: "city", instruction: "make it plural", correct: "cities", wrong: ["citys"] },
      { root: "party", instruction: "make it plural", correct: "parties", wrong: ["partys"] },
      { root: "family", instruction: "make it plural", correct: "families", wrong: ["familys"] },
      { root: "lady", instruction: "make it plural", correct: "ladies", wrong: ["ladys"] },
      { root: "story", instruction: "make it plural", correct: "stories", wrong: ["storys"] },
      { root: "country", instruction: "make it plural", correct: "countries", wrong: ["countrys"] },
      { root: "fairy", instruction: "make it plural", correct: "fairies", wrong: ["fairys"] },
      { root: "penny", instruction: "make it plural", correct: "pennies", wrong: ["pennys"] },
      { root: "day", instruction: "make it plural", correct: "days", wrong: ["dayies"] },
      { root: "boy", instruction: "make it plural", correct: "boys", wrong: ["boies"] },
      { root: "key", instruction: "make it plural", correct: "keys", wrong: ["keies"] },
      { root: "monkey", instruction: "make it plural", correct: "monkeys", wrong: ["monkies"] },
      { root: "toy", instruction: "make it plural", correct: "toys", wrong: ["toies"] },
      { root: "leaf", instruction: "make it plural", correct: "leaves", wrong: ["leafs"] },
      { root: "knife", instruction: "make it plural", correct: "knives", wrong: ["knifes"] },
      { root: "wife", instruction: "make it plural", correct: "wives", wrong: ["wifes"] },
      { root: "life", instruction: "make it plural", correct: "lives", wrong: ["lifes"] },
      { root: "half", instruction: "make it plural", correct: "halves", wrong: ["halfs"] },
      { root: "shelf", instruction: "make it plural", correct: "shelves", wrong: ["shelfs"] },
      { root: "wolf", instruction: "make it plural", correct: "wolves", wrong: ["wolfs"] },
      { root: "loaf", instruction: "make it plural", correct: "loaves", wrong: ["loafs"] },
      { root: "thief", instruction: "make it plural", correct: "thieves", wrong: ["thiefs"] },
      { root: "child", instruction: "make it plural", correct: "children", wrong: ["childs"] },
      { root: "man", instruction: "make it plural", correct: "men", wrong: ["mans"] },
      { root: "woman", instruction: "make it plural", correct: "women", wrong: ["womans"] },
      { root: "mouse", instruction: "make it plural", correct: "mice", wrong: ["mouses"] },
      { root: "foot", instruction: "make it plural", correct: "feet", wrong: ["foots"] },
      { root: "tooth", instruction: "make it plural", correct: "teeth", wrong: ["tooths"] },
      { root: "person", instruction: "make it plural", correct: "people", wrong: ["persons"] }
    ]
  }
];
