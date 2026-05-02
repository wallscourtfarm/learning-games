// ═══════════════════════════════════════════════════════════════
//  CALLUM'S MINECRAFT QUEST — Question Bank
//  Ask Claude to add more questions to this file!
//
//  FORMAT:  { q:'Question', a:['Correct answer','Wrong answer'], c:0, lv:1 }
//  RULES:   • Correct answer is ALWAYS first in the array (index 0)
//           • The game shuffles display order automatically
//           • lv: 1 = Reception,  2 = Year 1
// ═══════════════════════════════════════════════════════════════

const QS = {

// ─── MATHS (Reception / Year 1) ───────────────────────────────
maths: [
  // Counting & number recognition
  {q:'Count the blocks: 🟫🟫🟫', a:['3','4'], c:0, lv:1},
  {q:'Count the hearts: ❤️❤️❤️❤️❤️', a:['5','4'], c:0, lv:1},
  {q:'How many apples?\n🍎🍎', a:['2','3'], c:0, lv:1},
  {q:'How many diamonds?\n💎💎💎💎', a:['4','3'], c:0, lv:1},
  {q:'What number comes after 5?', a:['6','4'], c:0, lv:1},
  {q:'What number comes before 3?', a:['2','4'], c:0, lv:1},
  {q:'What number comes after 9?', a:['10','8'], c:0, lv:1},
  {q:'Which number is bigger?\n7 or 4', a:['7','4'], c:0, lv:1},
  {q:'Which number is smaller?\n6 or 9', a:['6','9'], c:0, lv:1},
  {q:'What is the number ten?\n(in digits)', a:['10','01'], c:0, lv:1},

  // Addition within 10
  {q:'1 + 1 = ?', a:['2','3'], c:0, lv:1},
  {q:'2 + 2 = ?', a:['4','3'], c:0, lv:1},
  {q:'3 + 2 = ?', a:['5','4'], c:0, lv:1},
  {q:'4 + 1 = ?', a:['5','6'], c:0, lv:1},
  {q:'3 + 3 = ?', a:['6','5'], c:0, lv:1},
  {q:'5 + 2 = ?', a:['7','8'], c:0, lv:1},
  {q:'4 + 4 = ?', a:['8','7'], c:0, lv:1},
  {q:'5 + 5 = ?', a:['10','9'], c:0, lv:1},
  {q:'6 + 2 = ?', a:['8','9'], c:0, lv:1},
  {q:'3 + 4 = ?', a:['7','6'], c:0, lv:1},

  // Subtraction within 10
  {q:'5 - 1 = ?', a:['4','3'], c:0, lv:1},
  {q:'4 - 2 = ?', a:['2','3'], c:0, lv:1},
  {q:'6 - 3 = ?', a:['3','4'], c:0, lv:1},
  {q:'8 - 4 = ?', a:['4','5'], c:0, lv:1},
  {q:'10 - 5 = ?', a:['5','4'], c:0, lv:1},
  {q:'7 - 2 = ?', a:['5','6'], c:0, lv:1},
  {q:'9 - 3 = ?', a:['6','7'], c:0, lv:1},
  {q:'10 - 1 = ?', a:['9','8'], c:0, lv:1},

  // Doubles
  {q:'Double 1 = ?', a:['2','1'], c:0, lv:1},
  {q:'Double 2 = ?', a:['4','3'], c:0, lv:1},
  {q:'Double 3 = ?', a:['6','5'], c:0, lv:1},
  {q:'Double 4 = ?', a:['8','6'], c:0, lv:1},
  {q:'Double 5 = ?', a:['10','8'], c:0, lv:1},

  // Number bonds to 10
  {q:'? + 6 = 10', a:['4','3'], c:0, lv:1},
  {q:'? + 3 = 10', a:['7','8'], c:0, lv:1},
  {q:'? + 8 = 10', a:['2','3'], c:0, lv:1},
  {q:'? + 1 = 10', a:['9','8'], c:0, lv:1},
  {q:'? + 5 = 10', a:['5','4'], c:0, lv:1},

  // Shapes & patterns
  {q:'How many sides does a square have?', a:['4','3'], c:0, lv:1},
  {q:'How many sides does a triangle have?', a:['3','4'], c:0, lv:1},
  {q:'How many sides does a rectangle have?', a:['4','3'], c:0, lv:1},
  {q:'What is half of 4?', a:['2','3'], c:0, lv:2},
  {q:'What is half of 10?', a:['5','4'], c:0, lv:2},
  {q:'What is half of 8?', a:['4','5'], c:0, lv:2},

  // Addition within 20 (Y1)
  {q:'10 + 5 = ?', a:['15','14'], c:0, lv:2},
  {q:'10 + 8 = ?', a:['18','17'], c:0, lv:2},
  {q:'12 + 3 = ?', a:['15','14'], c:0, lv:2},
  {q:'11 + 4 = ?', a:['15','16'], c:0, lv:2},
  {q:'14 + 2 = ?', a:['16','15'], c:0, lv:2},
  {q:'6 + 7 = ?',  a:['13','12'], c:0, lv:2},
  {q:'8 + 9 = ?',  a:['17','16'], c:0, lv:2},
  {q:'9 + 9 = ?',  a:['18','17'], c:0, lv:2},

  // Subtraction within 20 (Y1)
  {q:'15 - 5 = ?', a:['10','9'], c:0, lv:2},
  {q:'20 - 10 = ?', a:['10','9'], c:0, lv:2},
  {q:'18 - 8 = ?', a:['10','9'], c:0, lv:2},
  {q:'14 - 4 = ?', a:['10','9'], c:0, lv:2},

  // Ordinal / position
  {q:'Steve is first in the queue.\nWhat position is he?', a:['1st','2nd'], c:0, lv:1},
  {q:'Which is the 2nd letter?\nA B C', a:['B','A'], c:0, lv:1},
],

// ─── ENGLISH / SPELLING (Reception / Year 1 CEW) ──────────────
english: [
  // Reception common exception words — spot the correct spelling
  {q:'Which is spelt correctly?', a:['the','teh'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['said','sed'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['come','cum'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['some','sum'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['love','luv'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['have','hav'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['they','thay'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['were','wer'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['once','wuns'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['friend','freind'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['school','skool'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['could','cud'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['would','wud'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['should','shud'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['because','becoz'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['water','woter'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['people','peeple'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['again','agen'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['their','thier'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['little','littel'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['where','wher'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['there','thare'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['here','heer'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['every','evry'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['great','grate'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['whole','hoal'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['laugh','laf'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['money','muny'], c:0, lv:2},
  {q:'Which is spelt correctly?', a:['after','aftur'], c:0, lv:1},
  {q:'Which is spelt correctly?', a:['called','cald'], c:0, lv:1},

  // Phonics / letter sounds
  {q:'What sound does "sh" make?\nas in "ship"', a:['shh','s + h separate'], c:0, lv:1},
  {q:'Which word rhymes with "cat"?', a:['bat','bag'], c:0, lv:1},
  {q:'Which word rhymes with "big"?', a:['pig','bin'], c:0, lv:1},
  {q:'Which word rhymes with "hot"?', a:['pot','hop'], c:0, lv:1},
  {q:'Which word rhymes with "run"?', a:['sun','rug'], c:0, lv:1},
  {q:'Which word rhymes with "bed"?', a:['red','bag'], c:0, lv:1},

  // Sentence / grammar
  {q:'Which starts a sentence?\n__ dog ran fast.', a:['The','the'], c:0, lv:1},
  {q:'How many words in:\n"The cat sat."', a:['3','4'], c:0, lv:1},
  {q:'Which needs a capital letter?', a:['monday','Monday'], c:0, lv:1},

  // Simple reading comprehension
  {q:'Steve digs with a pickaxe.\nWhat does Steve dig with?', a:['A pickaxe','A sword'], c:0, lv:1},
  {q:'The creeper is green.\nWhat colour is the creeper?', a:['Green','Blue'], c:0, lv:1},
  {q:'Alex eats an apple.\nWhat does Alex eat?', a:['An apple','A cake'], c:0, lv:1},
],

// ─── MINECRAFT TRIVIA ─────────────────────────────────────────
trivia: [
  {q:'What colour is a creeper?', a:['Green','Red'], c:0, lv:1},
  {q:'What does a creeper do\nwhen it gets close to you?', a:['Explodes','Flies away'], c:0, lv:1},
  {q:'What is the strongest\nmineral in Minecraft?', a:['Diamond','Wood'], c:0, lv:1},
  {q:'What animal gives you wool\nin Minecraft?', a:['Sheep','Pig'], c:0, lv:1},
  {q:'What do you use to\nmine stone?', a:['Pickaxe','Sword'], c:0, lv:1},
  {q:'What do skeletons\nshoot at you?', a:['Arrows','Fire'], c:0, lv:1},
  {q:'What do you plant to\ngrow wheat?', a:['Seeds','Sticks'], c:0, lv:1},
  {q:'What animal can you\nride in Minecraft?', a:['Horse','Cow'], c:0, lv:1},
  {q:"What is Minecraft's\nmain character called?", a:['Steve','Creeper'], c:0, lv:1},
  {q:'What colour is TNT?', a:['Red & white','Green'], c:0, lv:1},
  {q:'What do chickens drop\nin Minecraft?', a:['Eggs','Wool'], c:0, lv:1},
  {q:'Where do you sleep\nin Minecraft?', a:['A bed','A chest'], c:0, lv:1},
  {q:'What do spiders drop\nwhen defeated?', a:['String','Bone'], c:0, lv:1},
  {q:'What do zombies drop\nwhen defeated?', a:['Rotten flesh','Arrows'], c:0, lv:1},
  {q:'What do you use to\nchop down trees?', a:['Axe','Pickaxe'], c:0, lv:1},
  {q:'What colour is\ngrass in Minecraft?', a:['Green','Brown'], c:0, lv:1},
  {q:'What can you cook\nfood in?', a:['Furnace','Chest'], c:0, lv:1},
  {q:'What is a Creeper\nfrightened of?', a:['Cats','Dogs'], c:0, lv:1},
  {q:'What colour are\ndiamond gems?', a:['Blue/Cyan','Yellow'], c:0, lv:1},
  {q:'How many hearts do\nyou start with?', a:['10','5'], c:0, lv:1},
  {q:'What material is\na wooden sword made of?', a:['Wood','Stone'], c:0, lv:1},
  {q:'What do you need to\ncraft any tool?', a:['Sticks','String'], c:0, lv:1},
  {q:'What is the name of\nthe dark dimension?', a:['The Nether','The End'], c:0, lv:1},
  {q:'What do cows drop\nin Minecraft?', a:['Leather & beef','Wool'], c:0, lv:1},
  {q:'What colour is\nsteve\'s shirt?', a:['Blue','Green'], c:0, lv:1},
  {q:'What is Alex\'s\nhair colour?', a:['Orange','Brown'], c:0, lv:1},
  {q:'What glows in the dark\nand hurts you?', a:['Lava','Water'], c:0, lv:1},
  {q:'What do you find\ninside a dungeon?', a:['Spawner & chest','Just diamonds'], c:0, lv:1},
  {q:'What is the first\nthing you should craft?', a:['Crafting table','Sword'], c:0, lv:1},
  {q:'What do bees make\nin Minecraft?', a:['Honey','Milk'], c:0, lv:1},
],

};
