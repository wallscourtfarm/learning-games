// ═══════════════════════════════════════════════════════════════
//  KARATE QUEST — QUESTION BANK
//  questions.js
//
//  This file contains ALL the questions for the game.
//  The main game code (index.html) reads from this file automatically.
//
//  TO ADD MORE QUESTIONS
//  ─────────────────────
//  Each question is one line like this:
//
//    {q:'Question text', a:['Correct answer','Wrong','Wrong','Wrong'], c:0, lv:3},
//
//  q  = The question text. Use \n to add a line break.
//  a  = Exactly 4 answers. CORRECT answer MUST be first (index 0).
//       The game shuffles the order so Sam never sees it in the same spot.
//  c  = Always 0 (correct answer is always at position 0 in the list).
//  lv = Year group: 1 = Y1, 2 = Y2, 3 = Y3, 4 = Y4
//
//  Distractor tips (the 3 wrong answers):
//  • Use common mistakes, not obvious nonsense.
//  • For maths: nearby numbers, or the answer to a similar question.
//  • For spelling: plausible misspellings of the correct word.
//  • For vocabulary: same word class, similar meaning but wrong.
//
//  SECTIONS IN THIS FILE
//  ─────────────────────
//  QS.maths   → Maths questions (Y1–Y3) + Number Sequences
//  QS.english → English questions (Y1–Y3) + Y4 Spelling/Grammar + Anagrams
//  QS.trivia  → Odd One Out + General Trivia (included in Mixed dojo)
//
//  Just ask to have more questions added — no need to edit this yourself.
// ═══════════════════════════════════════════════════════════════

const QS = {

// ───────────────────────────────────────────────────────────────
//  MATHS
//  Includes: Addition, Subtraction, Doubles/Halves, Times Tables,
//  Fractions, Place Value, Time, Shape, Number Sequences
// ───────────────────────────────────────────────────────────────
maths: [

  // ── Y1: Addition within 20 ────────────────────────────────────
  {q:'What is\n5 + 3?',          a:['8','6','9','7'],            c:0,lv:1},
  {q:'What is\n7 + 4?',          a:['11','10','12','9'],          c:0,lv:1},
  {q:'What is\n6 + 7?',          a:['13','12','14','11'],         c:0,lv:1},
  {q:'What is\n8 + 5?',          a:['13','12','14','15'],         c:0,lv:1},
  {q:'What is\n3 + 8?',          a:['11','10','12','9'],          c:0,lv:1},
  {q:'What is\n4 + 9?',          a:['13','12','14','11'],         c:0,lv:1},
  {q:'What is\n6 + 6?',          a:['12','11','13','10'],         c:0,lv:1},
  {q:'What is\n9 + 8?',          a:['17','16','18','15'],         c:0,lv:1},
  {q:'? + 5 = 12',               a:['7','6','8','5'],             c:0,lv:1},
  {q:'10 + ? = 18',              a:['8','7','9','6'],             c:0,lv:1},
  // ── Y1: Subtraction within 20 ─────────────────────────────────
  {q:'What is\n9 − 4?',          a:['5','4','6','3'],             c:0,lv:1},
  {q:'What is\n10 − 7?',         a:['3','4','2','5'],             c:0,lv:1},
  {q:'What is\n14 − 6?',         a:['8','7','9','6'],             c:0,lv:1},
  {q:'What is\n17 − 9?',         a:['8','7','9','6'],             c:0,lv:1},
  {q:'What is\n16 − 9?',         a:['7','6','8','5'],             c:0,lv:1},
  {q:'What is\n15 − 5?',         a:['10','9','11','5'],           c:0,lv:1},
  {q:'What is\n20 − 13?',        a:['7','6','8','9'],             c:0,lv:1},
  // ── Y1: Doubles & Halves ──────────────────────────────────────
  {q:'Double 4 = ?',             a:['8','6','10','4'],            c:0,lv:1},
  {q:'Double 6 = ?',             a:['12','10','14','8'],          c:0,lv:1},
  {q:'Double 7 = ?',             a:['14','12','16','10'],         c:0,lv:1},
  {q:'Double 9 = ?',             a:['18','16','20','14'],         c:0,lv:1},
  {q:'Half of 10 = ?',           a:['5','4','6','2'],             c:0,lv:1},
  {q:'Half of 8 = ?',            a:['4','3','5','6'],             c:0,lv:1},
  {q:'Half of 14 = ?',           a:['7','6','8','9'],             c:0,lv:1},
  {q:'Half of 18 = ?',           a:['9','8','10','6'],            c:0,lv:1},
  // ── Y1: Number & Shape ────────────────────────────────────────
  {q:'What comes\nafter 19?',    a:['20','18','21','10'],         c:0,lv:1},
  {q:'What comes\nbefore 10?',   a:['9','11','8','10'],           c:0,lv:1},
  {q:'Sides on\na triangle?',    a:['3','4','5','2'],             c:0,lv:1},
  {q:'Sides on\na square?',      a:['4','3','5','6'],             c:0,lv:1},
  {q:'Sides on\na rectangle?',   a:['4','3','5','6'],             c:0,lv:1},
  {q:'Sides on\na pentagon?',    a:['5','4','6','3'],             c:0,lv:1},
  {q:'Sides on\na hexagon?',     a:['6','5','7','8'],             c:0,lv:1},
  // ── Y2: Times tables 2×, 5×, 10× ─────────────────────────────
  {q:'3 × 2 = ?',                a:['6','5','8','4'],             c:0,lv:2},
  {q:'5 × 2 = ?',                a:['10','8','12','6'],           c:0,lv:2},
  {q:'8 × 2 = ?',                a:['16','14','18','12'],         c:0,lv:2},
  {q:'9 × 2 = ?',                a:['18','16','20','14'],         c:0,lv:2},
  {q:'2 × 2 = ?',                a:['4','2','6','8'],             c:0,lv:2},
  {q:'11 × 2 = ?',               a:['22','20','24','21'],         c:0,lv:2},
  {q:'4 × 5 = ?',                a:['20','15','25','10'],         c:0,lv:2},
  {q:'6 × 5 = ?',                a:['30','25','35','20'],         c:0,lv:2},
  {q:'9 × 5 = ?',                a:['45','40','50','35'],         c:0,lv:2},
  {q:'7 × 5 = ?',                a:['35','30','40','25'],         c:0,lv:2},
  {q:'3 × 10 = ?',               a:['30','20','40','13'],         c:0,lv:2},
  {q:'7 × 10 = ?',               a:['70','60','80','17'],         c:0,lv:2},
  {q:'11 × 10 = ?',              a:['110','100','120','111'],     c:0,lv:2},
  // ── Y2: Fractions ─────────────────────────────────────────────
  {q:'½ of 20 = ?',              a:['10','8','12','5'],           c:0,lv:2},
  {q:'½ of 16 = ?',              a:['8','6','10','4'],            c:0,lv:2},
  {q:'½ of 12 = ?',              a:['6','5','7','4'],             c:0,lv:2},
  {q:'½ of 24 = ?',              a:['12','10','14','8'],          c:0,lv:2},
  // ── Y2: Addition & Subtraction to 100 ────────────────────────
  {q:'24 + 35 = ?',              a:['59','49','69','58'],         c:0,lv:2},
  {q:'67 − 23 = ?',              a:['44','34','54','43'],         c:0,lv:2},
  {q:'46 + 37 = ?',              a:['83','73','93','84'],         c:0,lv:2},
  {q:'75 − 38 = ?',              a:['37','27','47','36'],         c:0,lv:2},
  {q:'53 + 29 = ?',              a:['82','72','92','81'],         c:0,lv:2},
  {q:'91 − 46 = ?',              a:['45','35','55','44'],         c:0,lv:2},
  // ── Y3: Times tables 3×, 4×, 8× ──────────────────────────────
  {q:'4 × 3 = ?',                a:['12','9','15','8'],           c:0,lv:3},
  {q:'6 × 3 = ?',                a:['18','15','21','12'],         c:0,lv:3},
  {q:'9 × 3 = ?',                a:['27','24','30','21'],         c:0,lv:3},
  {q:'7 × 3 = ?',                a:['21','18','24','15'],         c:0,lv:3},
  {q:'8 × 3 = ?',                a:['24','21','27','18'],         c:0,lv:3},
  {q:'7 × 4 = ?',                a:['28','24','32','20'],         c:0,lv:3},
  {q:'5 × 4 = ?',                a:['20','16','24','15'],         c:0,lv:3},
  {q:'8 × 4 = ?',                a:['32','28','36','24'],         c:0,lv:3},
  {q:'9 × 4 = ?',                a:['36','32','40','28'],         c:0,lv:3},
  {q:'11 × 4 = ?',               a:['44','40','48','36'],         c:0,lv:3},
  {q:'3 × 8 = ?',                a:['24','20','28','16'],         c:0,lv:3},
  {q:'6 × 8 = ?',                a:['48','40','56','42'],         c:0,lv:3},
  {q:'7 × 8 = ?',                a:['56','48','64','42'],         c:0,lv:3},
  {q:'9 × 8 = ?',                a:['72','64','80','56'],         c:0,lv:3},
  // ── Y3: Fractions ─────────────────────────────────────────────
  {q:'¼ of 20 = ?',              a:['5','4','10','8'],            c:0,lv:3},
  {q:'¼ of 12 = ?',              a:['3','4','2','6'],             c:0,lv:3},
  {q:'¼ of 8 = ?',               a:['2','4','1','3'],             c:0,lv:3},
  {q:'¼ of 24 = ?',              a:['6','8','4','12'],            c:0,lv:3},
  {q:'¾ of 12 = ?',              a:['9','6','8','3'],             c:0,lv:3},
  {q:'1/3 of 9 = ?',             a:['3','4','2','6'],             c:0,lv:3},
  {q:'1/3 of 15 = ?',            a:['5','3','6','4'],             c:0,lv:3},
  // ── Y3: Time ──────────────────────────────────────────────────
  {q:'Minutes in\nhalf an hour?',    a:['30','15','45','60'],     c:0,lv:3},
  {q:'Hours in a day?',              a:['24','12','20','48'],     c:0,lv:3},
  {q:'Minutes in an hour?',          a:['60','30','45','100'],   c:0,lv:3},
  {q:'Days in a week?',              a:['7','5','6','8'],         c:0,lv:3},
  {q:'Months in a year?',            a:['12','10','11','13'],    c:0,lv:3},
  {q:'Seconds in a minute?',         a:['60','30','100','50'],   c:0,lv:3},
  {q:'Days in January?',             a:['31','28','30','29'],    c:0,lv:3},
  // ── Y3: Place Value ───────────────────────────────────────────
  {q:'Hundreds digit\nin 347?',      a:['3','4','7','34'],       c:0,lv:3},
  {q:'Tens digit\nin 256?',          a:['5','2','6','25'],       c:0,lv:3},
  {q:'100 + 40 + 7 = ?',            a:['147','174','471','417'],c:0,lv:3},
  {q:'Round 47 to\nnearest 10?',    a:['50','40','45','47'],    c:0,lv:3},
  {q:'Round 83 to\nnearest 10?',    a:['80','90','85','83'],    c:0,lv:3},
  {q:'Round 65 to\nnearest 10?',    a:['70','60','65','75'],    c:0,lv:3},

  // ── 🔢 NUMBER SEQUENCES ───────────────────────────────────────
  {q:'🔢 SEQUENCE\n2, 4, 6, 8, ?',          a:['10','9','11','12'],       c:0,lv:1},
  {q:'🔢 SEQUENCE\n5, 10, 15, 20, ?',        a:['25','22','24','30'],      c:0,lv:1},
  {q:'🔢 SEQUENCE\n1, 3, 5, 7, ?',           a:['9','8','10','11'],        c:0,lv:1},
  {q:'🔢 SEQUENCE\n10, 8, 6, 4, ?',          a:['2','0','3','1'],          c:0,lv:1},
  {q:'🔢 SEQUENCE\n100, 90, 80, 70, ?',      a:['60','65','55','50'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n3, 6, 9, 12, ?',          a:['15','13','14','16'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n4, 8, 12, 16, ?',         a:['20','18','19','24'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n10, 20, 30, 40, ?',       a:['50','45','55','60'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n50, 45, 40, 35, ?',       a:['30','25','32','28'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n0, 7, 14, 21, ?',         a:['28','25','27','30'],      c:0,lv:2},
  {q:'🔢 SEQUENCE\n8, 16, 24, 32, ?',        a:['40','36','38','42'],      c:0,lv:3},
  {q:'🔢 SEQUENCE\n2, 4, 8, 16, ?',          a:['32','24','20','28'],      c:0,lv:3},
  {q:'🔢 SEQUENCE\n1, 4, 9, 16, ?',          a:['25','20','23','24'],      c:0,lv:3},
  {q:'🔢 SEQUENCE\n100, 75, 50, 25, ?',      a:['0','10','15','20'],       c:0,lv:3},
  {q:'🔢 SEQUENCE\n1, 2, 4, 7, 11, ?',       a:['16','14','15','17'],      c:0,lv:3},
  {q:'🔢 SEQUENCE\n24, 20, 16, 12, ?',       a:['8','4','10','6'],         c:0,lv:2},
  {q:'🔢 SEQUENCE\n5, 10, 20, 40, ?',        a:['80','60','70','50'],      c:0,lv:3},
],

// ───────────────────────────────────────────────────────────────
//  ENGLISH
//  Includes: Nouns/Verbs/Adjectives/Adverbs (Y1–Y3),
//  Punctuation, Spelling, Homophones, Prefixes/Suffixes,
//  Y4 Spelling & Grammar, Anagrams
// ───────────────────────────────────────────────────────────────
english: [

  // ── Y1: Nouns ─────────────────────────────────────────────────
  {q:'Which is a NOUN\n(naming word)?',       a:['cat','run','big','quickly'],    c:0,lv:1},
  {q:'Which is a NOUN?',                      a:['house','jump','happy','slow'],  c:0,lv:1},
  {q:'Which is a NOUN?',                      a:['dog','blue','fast','eat'],      c:0,lv:1},
  {q:'Which is a NOUN?',                      a:['pencil','loudly','run','tiny'], c:0,lv:1},
  {q:'Which is a NOUN?',                      a:['moon','dark','swim','softly'],  c:0,lv:1},
  // ── Y1: Verbs ─────────────────────────────────────────────────
  {q:'Which is a VERB\n(action word)?',       a:['jump','dog','happy','blue'],    c:0,lv:1},
  {q:'Which is a VERB?',                      a:['run','loud','house','big'],     c:0,lv:1},
  {q:'Which is a VERB?',                      a:['swim','red','cup','tall'],      c:0,lv:1},
  {q:'Which is a VERB?',                      a:['sleep','happy','pencil','quick'],c:0,lv:1},
  // ── Y1: Capital Letters & Punctuation ─────────────────────────
  {q:'Which needs a\nCAPITAL LETTER?',        a:['monday','apple','run','big'],   c:0,lv:1},
  {q:'Which needs a\nCAPITAL LETTER?',        a:['london','cat','tall','jump'],   c:0,lv:1},
  {q:'Which sentence\nis correct?',           a:['I like cats.','i like cats.','I like cats','i Like cats'],c:0,lv:1},
  {q:'Which is CORRECT?',                     a:['My name is Bob.','my name is Bob.','My name is bob.','my name is bob'],c:0,lv:1},
  // ── Y1: Phonics & Rhyme ───────────────────────────────────────
  {q:'Which rhymes\nwith CAT?',               a:['mat','cup','bit','top'],        c:0,lv:1},
  {q:'Which rhymes\nwith NIGHT?',             a:['light','bag','dog','fun'],      c:0,lv:1},
  {q:'Which rhymes\nwith KING?',              a:['ring','cap','log','sun'],       c:0,lv:1},
  {q:'Which rhymes\nwith LOOK?',              a:['book','cap','sat','win'],       c:0,lv:1},
  {q:'Which starts\nwith "sh"?',              a:['ship','cat','dog','tree'],      c:0,lv:1},
  {q:'Which starts\nwith "ch"?',              a:['chin','fish','walk','boot'],    c:0,lv:1},
  {q:'Which ends\nwith "ck"?',                a:['duck','fish','hand','lamp'],    c:0,lv:1},
  {q:'Which ends\nwith "ng"?',                a:['sing','help','park','sled'],    c:0,lv:1},
  // ── Y1: Plurals ───────────────────────────────────────────────
  {q:'More than one\nCAT is…?',               a:['cats','cates','catses','catt'], c:0,lv:1},
  {q:'More than one\nBOX is…?',               a:['boxes','boxs','boxies','boxxes'],c:0,lv:1},
  {q:'More than one\nBUSH is…?',              a:['bushes','bushs','bushies','bush'],c:0,lv:1},
  {q:'More than one\nCHILD is…?',             a:['children','childs','childes','childer'],c:0,lv:1},
  {q:'More than one\nFOOT is…?',              a:['feet','foots','feets','foot'],  c:0,lv:1},
  {q:'Letters in\nthe alphabet?',             a:['26','24','25','27'],            c:0,lv:1},
  // ── Y2: Adjectives ────────────────────────────────────────────
  {q:'Which is an\nADJECTIVE\n(describing word)?',  a:['fluffy','quickly','dog','ran'],  c:0,lv:2},
  {q:'Which is an\nADJECTIVE?',              a:['tiny','jump','house','slowly'],  c:0,lv:2},
  {q:'Which is an\nADJECTIVE?',              a:['sparkly','run','table','eat'],   c:0,lv:2},
  {q:'Which is an\nADJECTIVE?',              a:['enormous','swim','stone','quickly'],c:0,lv:2},
  // ── Y2: Conjunctions ──────────────────────────────────────────
  {q:'Which is a\nCONJUNCTION?',             a:['because','run','big','dog'],     c:0,lv:2},
  {q:'Which is a\nCONJUNCTION?',             a:['but','happy','fast','house'],    c:0,lv:2},
  {q:'"I like cats ___ dogs"',               a:['and','is','the','run'],          c:0,lv:2},
  {q:'"Tired ___ I slept"',                  a:['so','the','cat','but'],          c:0,lv:2},
  {q:'"Cold ___ I wore a coat"',             a:['so','big','the','run'],          c:0,lv:2},
  {q:'"I ate lunch ___\nI was hungry"',      a:['because','and','but','so'],      c:0,lv:2},
  // ── Y2: Punctuation ───────────────────────────────────────────
  {q:'Which needs a\nQUESTION MARK?',        a:['What time is it','I like pizza','Stop that','I am happy'],c:0,lv:2},
  {q:'Which needs an\nEXCLAMATION MARK?',    a:['Watch out','I have a cat','The sky is blue','She sat down'],c:0,lv:2},
  // ── Y2: Spelling ──────────────────────────────────────────────
  {q:'Spelt correctly?',                     a:['was','woz','wus','waz'],         c:0,lv:2},
  {q:'Spelt correctly?',                     a:['they','thay','thei','tey'],      c:0,lv:2},
  {q:'Spelt correctly?',                     a:['said','sed','sayd','sayed'],     c:0,lv:2},
  {q:'Spelt correctly?',                     a:['friend','freind','frend','friand'],c:0,lv:2},
  {q:'Spelt correctly?',                     a:['because','becaus','becoz','becauze'],c:0,lv:2},
  {q:'Spelt correctly?',                     a:['could','coud','culd','colud'],   c:0,lv:2},
  {q:'Spelt correctly?',                     a:['school','skool','scool','shcool'],c:0,lv:2},
  {q:'Spelt correctly?',                     a:['people','peopel','peepul','peeple'],c:0,lv:2},
  // ── Y2: Tense & Grammar ───────────────────────────────────────
  {q:'Which is CORRECT?',                    a:['I went home','I wented home','I goed home','I go home'],c:0,lv:2},
  {q:'Past tense of JUMP?',                  a:['jumped','jumpt','jumpd','jump'], c:0,lv:2},
  {q:'Past tense of RUN?',                   a:['ran','runned','runed','run'],    c:0,lv:2},
  {q:'Past tense of SEE?',                   a:['saw','seed','sawed','seen'],     c:0,lv:2},
  // ── Y2: Opposites ─────────────────────────────────────────────
  {q:'Opposite of HOT?',                     a:['cold','warm','big','fast'],      c:0,lv:2},
  {q:'Opposite of HAPPY?',                   a:['sad','glad','joyful','kind'],    c:0,lv:2},
  {q:'Opposite of BIG?',                     a:['small','large','huge','fast'],   c:0,lv:2},
  {q:'Opposite of DARK?',                    a:['light','dim','gloomy','black'],  c:0,lv:2},
  {q:'Opposite of FAST?',                    a:['slow','quick','speedy','run'],   c:0,lv:2},
  // ── Y2: Prefixes ──────────────────────────────────────────────
  {q:'"un" + "happy" = ?',                   a:['unhappy','rehappy','prehappy','dishappy'],c:0,lv:2},
  {q:'"re" + "play" = ?',                    a:['replay','unplay','preplay','misplay'],c:0,lv:2},
  {q:'"un" + "kind" = ?',                    a:['unkind','rekind','prekind','diskind'],c:0,lv:2},
  // ── Y3: Adverbs ───────────────────────────────────────────────
  {q:'Which is an ADVERB\n(tells us HOW)?',  a:['slowly','cat','big','house'],    c:0,lv:3},
  {q:'Which is an ADVERB?',                  a:['quickly','dog','blue','jump'],   c:0,lv:3},
  {q:'Which is an ADVERB?',                  a:['loudly','table','green','eat'],  c:0,lv:3},
  {q:'Which is an ADVERB?',                  a:['carefully','happy','run','tree'],c:0,lv:3},
  {q:'Which is an ADVERB?',                  a:['bravely','moon','big','sleep'],  c:0,lv:3},
  // ── Y3: Homophones ────────────────────────────────────────────
  {q:'"I can ___ you"\nhear or here?',       a:['hear','here','her','heer'],      c:0,lv:3},
  {q:'"___ are my shoes"\nthere or their?',  a:['There','Their',"They're",'Thier'],c:0,lv:3},
  {q:'"___ going home"\nthey\'re / their?',  a:["They're",'Their','There','Theyre'],c:0,lv:3},
  {q:'"I ___ the answer"\nknew or new?',     a:['knew','new','nu','knoo'],        c:0,lv:3},
  {q:'"Two ___ of shoes"\npair or pear?',    a:['pair','pear','pare','par'],      c:0,lv:3},
  {q:'"___ of cake please"\npiece or peace?',a:['piece','peace','peice','pees'],  c:0,lv:3},
  // ── Y3: Apostrophes ───────────────────────────────────────────
  {q:'Which is CORRECT?',                    a:["the cat's toy","the cats toy","the cats' toy","the cat toy's"],c:0,lv:3},
  {q:'Which is CORRECT?',                    a:["it's sunny","its sunny","its' sunny","Its sunny"],c:0,lv:3},
  {q:'"do not" shortened?',                  a:["don't","dont","do'nt","d'ont"],  c:0,lv:3},
  {q:'"I am" shortened?',                    a:["I'm","Im","I'am","Iam"],         c:0,lv:3},
  {q:'"she will" shortened?',                a:["she'll","shell","she'l","shel"], c:0,lv:3},
  {q:'"we are" shortened?',                  a:["we're","were","we'r","weare"],   c:0,lv:3},
  // ── Y3: Prefixes & Suffixes ───────────────────────────────────
  {q:'Prefix meaning NOT?\n(__ + kind)',      a:['un–','re–','pre–','mis–'],      c:0,lv:3},
  {q:'Prefix meaning AGAIN?\n(__ + do)',      a:['re–','un–','dis–','pre–'],      c:0,lv:3},
  {q:'"dis" + "appear" = ?',                 a:['disappear','unappear','reappear','misappear'],c:0,lv:3},
  {q:'"mis" + "take" = ?',                   a:['mistake','unmistake','premistake','retake'],c:0,lv:3},
  // ── Y3: Word types & synonyms ─────────────────────────────────
  {q:'A SYNONYM for BIG?',                   a:['huge','tiny','slow','cold'],     c:0,lv:3},
  {q:'A SYNONYM for HAPPY?',                 a:['joyful','sad','angry','bored'],  c:0,lv:3},
  {q:'A SYNONYM for QUICK?',                 a:['fast','slow','tired','loud'],    c:0,lv:3},
  {q:'An ANTONYM for ANCIENT?',              a:['modern','old','historic','past'],c:0,lv:3},
  {q:'"BEAUTIFUL" is what\ntype of word?',   a:['adjective','noun','verb','adverb'],c:0,lv:3},
  // ── Y3: Suffix spelling rules ─────────────────────────────────
  {q:'"run" + "ing" = ?',                    a:['running','runing','runnning','runeing'],c:0,lv:3},
  {q:'"jump" + "ed" = ?',                    a:['jumped','jumpped','jumpd','jumpeed'],c:0,lv:3},
  {q:'"hop" + "ing" = ?',                    a:['hopping','hoping','hoppping','hopeing'],c:0,lv:3},
  {q:'"make" + "ing" = ?',                   a:['making','makeing','makking','makinging'],c:0,lv:3},
  {q:'"happy" + "ly" = ?',                   a:['happily','happyly','happilly','happyily'],c:0,lv:3},

  // ── Y4: Spelling (National Curriculum word list) ──────────────
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['necessary','neccessary','necesary','neccesary'],c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['February','Febuary','Febrary','Feburary'],      c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['believe','beleive','belive','beleeve'],         c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['separate','seperate','separrate','seprate'],    c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['accident','accedent','acsident','acident'],     c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['address','adress','addres','adres'],            c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['answer','ansser','anser','awnsir'],             c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['business','buisness','bussiness','bizness'],    c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['calendar','calender','calander','calandar'],    c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['caught','cort','caugt','caight'],               c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['continue','continewe','continew','continu'],    c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['describe','discribe','describ','desribe'],      c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['different','diferent','diffrent','diferant'],   c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['enough','enuff','enuf','ennough'],              c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['experience','experiance','experence','expirience'],c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['favourite','favrite','favorit','favuorite'],    c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['grammar','grammer','gramer','gramar'],          c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['height','hieght','heigth','hight'],             c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['imagine','imagin','imajen','imagene'],          c:0,lv:4},
  {q:'Y4 SPELLING\nSpelt correctly?',        a:['knowledge','knowlege','nowledge','knowledje'],  c:0,lv:4},
  // ── Y4: Prefixes ──────────────────────────────────────────────
  {q:'Y4 PREFIX\n"super" + "hero" = ?',      a:['superhero','supehero','supperhero','souperhero'],c:0,lv:4},
  {q:'Y4 PREFIX\n"auto" means…?',            a:['self','against','between','above'],c:0,lv:4},
  {q:'Y4 PREFIX\n"inter" means…?',           a:['between','above','against','self'],c:0,lv:4},
  {q:'Y4 PREFIX\n"anti" means…?',            a:['against','above','between','self'],c:0,lv:4},
  {q:'Y4 PREFIX\n"anti" + "clockwise" = ?',  a:['anticlockwise','anticklockwise','ancipclockwise','anttclockwise'],c:0,lv:4},
  // ── Y4: Suffixes ──────────────────────────────────────────────
  {q:'Y4 SUFFIX\n"fame" + "ous" = ?',        a:['famous','fameous','famious','famese'],  c:0,lv:4},
  {q:'Y4 SUFFIX\n"danger" + "ous" = ?',      a:['dangerous','dangrous','dangerus','dangerious'],c:0,lv:4},
  {q:'Y4 SUFFIX\n"poison" + "ous" = ?',      a:['poisonous','poisonus','poisonious','poisonouss'],c:0,lv:4},
  {q:'Y4 SUFFIX\n"attract" + "ion" = ?',     a:['attraction','attractoin','attracton','attracion'],c:0,lv:4},
  {q:'Y4 SUFFIX\n"discuss" + "ion" = ?',     a:['discussion','discusson','disscusion','discusion'],c:0,lv:4},
  // ── Y4: Grammar ───────────────────────────────────────────────
  {q:'Y4 GRAMMAR\nWhich is a\nDETERMINER?',  a:['the','run','big','quickly'],    c:0,lv:4},
  {q:'Y4 GRAMMAR\nWhich is a\nPREPOSITION?', a:['under','run','happy','because'],c:0,lv:4},
  {q:'Y4 GRAMMAR\nWhich is a\nPOSSESSIVE\nPRONOUN?', a:['mine','run','the','and'],c:0,lv:4},
  {q:'Y4 GRAMMAR\nWhich is STANDARD\nENGLISH?', a:['I was not there','I were not there','I ain\'t there','I never went there'],c:0,lv:4},
  {q:'Y4 GRAMMAR\n"Quick" is an\nadjective. "Quickly"\nis an…?', a:['adverb','adjective','noun','verb'],c:0,lv:4},
  // ── Y4: Homophones ────────────────────────────────────────────
  {q:'Y4 HOMOPHONE\n"The wind ___\nmy kite"\nblew or blue?',     a:['blew','blue','blou','bloo'],c:0,lv:4},
  {q:'Y4 HOMOPHONE\n"Please ___\nthe door"\nclosed or close?',   a:['close','closed','claose','cloze'],c:0,lv:4},
  {q:'Y4 HOMOPHONE\n"She ___ a\nbeautiful song"\nsung or sang?', a:['sang','sung','sunge','singed'],c:0,lv:4},
  {q:'Y4 HOMOPHONE\n"The ___\nof the dog"\ntail or tale?',       a:['tail','tale','tael','tial'],c:0,lv:4},
  {q:'Y4 HOMOPHONE\n"___ of the\ntree"\nbark or dark?',          a:['bark','dark','barc','barck'],c:0,lv:4},

  // ── 🔤 ANAGRAMS ───────────────────────────────────────────────
  {q:'🔤 ANAGRAM\nUnscramble O-M-U-S\n(a maths word)',           a:['SUMS','MOUS','OSMU','SUMO'],   c:0,lv:1},
  {q:'🔤 ANAGRAM\nUnscramble E-G-M-A\n(something you play)',     a:['GAME','MAGE','AMEG','EGAM'],   c:0,lv:1},
  {q:'🔤 ANAGRAM\nUnscramble S-H-I-F\n(lives in the sea)',       a:['FISH','SHIF','ISHI','HIFS'],   c:0,lv:1},
  {q:'🔤 ANAGRAM\nUnscramble E-L-B-U\n(a colour)',               a:['BLUE','LUBE','ULBE','ELUB'],   c:0,lv:1},
  {q:'🔤 ANAGRAM\nUnscramble N-O-I-L\n(a big cat)',              a:['LION','LINO','NOIL','ILON'],   c:0,lv:1},
  {q:'🔤 ANAGRAM\nUnscramble D-R-O-W\n(made of letters)',        a:['WORD','ROWDM','OWRD','DROW'],  c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble T-A-R-S\n(shines in the sky)',      a:['STAR','RATS','TSAR','ARTS'],   c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble E-V-L-O\n(opposite of hate)',       a:['LOVE','VOLE','EVOL','OVEL'],   c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble C-A-M-I-G\n(a spell or trick)',     a:['MAGIC','GAMIC','CIGMA','MAGCI'],c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble P-L-A-N-E\n(a vehicle that flies)', a:['PLANE','PANEL','NEAPL','LEAPN'],c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble E-P-S-E-L\n(to slumber)',           a:['SLEEP','SEELP','ESPLE','PLESE'],c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble A-R-T-E-H\n(pumps your blood)',     a:['HEART','HATER','EARTH','RATHE'],c:0,lv:3},
  {q:'🔤 ANAGRAM\nUnscramble T-H-A-E-R\n(our planet)',           a:['EARTH','HEART','HATER','RATHE'],c:0,lv:3},
  {q:'🔤 ANAGRAM\nUnscramble G-I-T-S-H\n(you do this with eyes)',a:['SIGHT','SIGTH','THIGS','GISHT'],c:0,lv:3},
  {q:'🔤 ANAGRAM\nUnscramble N-E-R-G-E\n(a colour)',             a:['GREEN','GENRE','GRENE','NEGER'],c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble O-S-N-I-C\n(a speedy hedgehog!)',   a:['SONIC','COINS','ICONS','CIONS'],c:0,lv:2},
  {q:'🔤 ANAGRAM\nUnscramble G-R-A-D-O\n(a mythical beast)',     a:['DRAGON','GRANDO','NADRGO','DRANAG'],c:0,lv:3},
  {q:'🔤 ANAGRAM\nUnscramble E-L-C-S-A\n(to climb)',             a:['SCALE','LACES','ALECS','CALES'],c:0,lv:3},
],

// ───────────────────────────────────────────────────────────────
//  TRIVIA
//  Includes: Odd One Out, General Knowledge for 8-year-olds
//  Used in the Mixed dojo alongside maths and english
// ───────────────────────────────────────────────────────────────
trivia: [

  // ── 🔍 ODD ONE OUT ────────────────────────────────────────────
  {q:'🔍 ODD ONE OUT\nA / E / P / I',               a:['P','A','E','I'],          c:0,lv:1},
  {q:'🔍 ODD ONE OUT\nRed / Blue / Fast / Green',    a:['Fast','Red','Blue','Green'],c:0,lv:1},
  {q:'🔍 ODD ONE OUT\nRun / Jump / Swim / Cat',      a:['Cat','Run','Jump','Swim'], c:0,lv:1},
  {q:'🔍 ODD ONE OUT\nHappy / Sad / Tree / Angry',   a:['Tree','Happy','Sad','Angry'],c:0,lv:1},
  {q:'🔍 ODD ONE OUT\n2 / 4 / 7 / 8\n(odd number)',  a:['7','2','4','8'],          c:0,lv:1},
  {q:'🔍 ODD ONE OUT\nEurope / Africa / London / Asia', a:['London','Europe','Africa','Asia'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nDog / Cat / Shark / Cow\n(not a mammal)', a:['Shark','Dog','Cat','Cow'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nOak / Rose / Daisy / Tulip\n(not a flower)', a:['Oak','Rose','Daisy','Tulip'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\n3 / 6 / 9 / 10\n(not in the 3× table)', a:['10','3','6','9'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nTriangle / Square\nCircle / Pentagon\n(no straight sides)', a:['Circle','Triangle','Square','Pentagon'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nBee / Ant / Spider / Butterfly\n(not an insect)', a:['Spider','Bee','Ant','Butterfly'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nRed / Yellow / White / Blue\n(not a primary colour)', a:['White','Red','Yellow','Blue'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nFrance / Italy / London / Spain\n(not a country)', a:['London','France','Italy','Spain'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nAnd / But / So / Run\n(not a conjunction)', a:['Run','And','But','So'],c:0,lv:2},
  {q:'🔍 ODD ONE OUT\nMercury / Venus / Moon / Mars\n(not a planet)', a:['Moon','Mercury','Venus','Mars'],c:0,lv:3},
  {q:'🔍 ODD ONE OUT\nJanuary / March / April / July\n(has only 30 days)', a:['April','January','March','July'],c:0,lv:3},
  {q:'🔍 ODD ONE OUT\nNoun / Verb / Adjective / Comma\n(not a word class)', a:['Comma','Noun','Verb','Adjective'],c:0,lv:3},
  {q:'🔍 ODD ONE OUT\nKitten / Puppy / Foal / Adult\n(not a baby animal)', a:['Adult','Kitten','Puppy','Foal'],c:0,lv:2},

  // ── ⭐ GENERAL TRIVIA ──────────────────────────────────────────
  {q:'⭐ TRIVIA\nCapital\nof England?',                a:['London','Manchester','Bristol','Oxford'],  c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat colour is\na flamingo?',          a:['Pink','Red','White','Orange'],             c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat do bees make?',                   a:['Honey','Wax','Silk','Milk'],               c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat do caterpillars\nturn into?',     a:['Butterflies','Moths','Bees','Flies'],      c:0,lv:1},
  {q:'⭐ TRIVIA\nFastest land animal?',                 a:['Cheetah','Lion','Horse','Tiger'],          c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat do you call\na baby cat?',        a:['Kitten','Cub','Foal','Pup'],               c:0,lv:1},
  {q:'⭐ TRIVIA\nPlayers in a\nfootball team?',         a:['11','10','9','12'],                        c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat colour\nis a ruby?',              a:['Red','Blue','Green','Yellow'],             c:0,lv:1},
  {q:'⭐ TRIVIA\nWhich bird\ncannot fly?',              a:['Penguin','Robin','Eagle','Sparrow'],       c:0,lv:1},
  {q:'⭐ TRIVIA\nWhat animal\nis the tallest?',         a:['Giraffe','Elephant','Camel','Horse'],      c:0,lv:1},
  {q:'⭐ TRIVIA\nSonic the Hedgehog\nis which colour?', a:['Blue','Red','Green','Yellow'],             c:0,lv:1},
  {q:'⭐ TRIVIA\nHow many legs\ndoes a spider have?',   a:['8','6','4','10'],                          c:0,lv:2},
  {q:'⭐ TRIVIA\nClosest planet\nto the Sun?',          a:['Mercury','Venus','Mars','Earth'],          c:0,lv:2},
  {q:'⭐ TRIVIA\nHow many continents\nare there?',      a:['7','6','5','8'],                           c:0,lv:2},
  {q:'⭐ TRIVIA\nEiffel Tower is in\nwhich country?',   a:['France','Spain','Italy','Germany'],        c:0,lv:2},
  {q:'⭐ TRIVIA\nCapital of France?',                   a:['Paris','Rome','Berlin','Madrid'],          c:0,lv:2},
  {q:'⭐ TRIVIA\nH₂O is the\nformula for?',             a:['Water','Oxygen','Helium','Salt'],          c:0,lv:2},
  {q:'⭐ TRIVIA\nWhich planet is\nfamous for its rings?',a:['Saturn','Jupiter','Mars','Neptune'],      c:0,lv:2},
  {q:'⭐ TRIVIA\nWhich season\ncomes after summer?',    a:['Autumn','Winter','Spring','Summer'],       c:0,lv:2},
  {q:'⭐ TRIVIA\nWhat is NOT a\nprimary colour?',       a:['Green','Red','Yellow','Blue'],             c:0,lv:2},
  {q:'⭐ TRIVIA\nHow many sides\ndoes a 50p coin have?',a:['7','6','8','5'],                           c:0,lv:2},
  {q:'⭐ TRIVIA\nHow many players\nin a basketball team?',a:['5','6','7','11'],                        c:0,lv:2},
  {q:'⭐ TRIVIA\nLargest ocean\nin the world?',         a:['Pacific','Atlantic','Indian','Arctic'],    c:0,lv:3},
  {q:'⭐ TRIVIA\nHighest mountain\nin the world?',      a:['Everest','K2','Kilimanjaro','Mont Blanc'], c:0,lv:3},
  {q:'⭐ TRIVIA\nHow many bones\nin the human body?',   a:['206','100','300','150'],                   c:0,lv:3},
  {q:'⭐ TRIVIA\nLongest river\nin the world?',         a:['Nile','Amazon','Thames','Mississippi'],    c:0,lv:3},
  {q:'⭐ TRIVIA\nWhat gas do plants\nneed to make food?',a:['Carbon dioxide','Oxygen','Nitrogen','Helium'],c:0,lv:3},
  {q:'⭐ TRIVIA\nHow many players\nin a rugby union team?',a:['15','11','13','7'],                     c:0,lv:3},
  {q:'⭐ TRIVIA\nWhich is the\nbiggest planet?',        a:['Jupiter','Saturn','Earth','Mars'],         c:0,lv:2},
  {q:'⭐ TRIVIA\nWhat type of animal\nis a dolphin?',   a:['Mammal','Fish','Reptile','Amphibian'],     c:0,lv:3},
],

};
