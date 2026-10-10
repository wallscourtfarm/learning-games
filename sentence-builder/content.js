/* Sentence Builder — picture word banks.
 *
 * Each picture has word cards in the colour-coded categories (the same colours and icons
 * as the staff Colour-Coded Sentence Builder). The sense check uses three optional fields:
 *   who:[ids]    this card only makes sense with these who cards
 *   doing:[ids]  this card only makes sense with these doing cards
 *   person:true  who cards only — a person, so Step 7 uses "who" (things use "which")
 *   det:''       who cards only — a name with no "the" (e.g. King Henry)
 *   needs:       doing cards only — 'what' (must have a what: "holds…"), 'none' (can't take
 *                a what: "floats"), or left out (works either way: "eats").
 * Leave a field out and the card fits everything. All verbs are present tense, singular,
 * so every who card must be singular ("the crowd", never "the children").
 */
const TOPICS = [
{
  id:'space', label:'Space', years:'Year 5', pictures:[
  {
    id:'station', title:'Space station', img:'images/space-station.jpg',
    who:[
      {id:'astro', det:'the', t:'astronaut', person:true},
      {id:'apple', det:'the', t:'apple'},
      {id:'bottle', det:'the', t:'water bottle'},
      {id:'earth', det:'the', t:'Earth'}
    ],
    doing:[
      {id:'floats', t:'floats', needs:'none', who:['astro','apple','bottle']},
      {id:'holds', t:'holds', needs:'what', who:['astro']},
      {id:'smiles', t:'smiles', needs:'none', who:['astro']},
      {id:'looks', t:'looks at', needs:'what', who:['astro']},
      {id:'eats', t:'eats', who:['astro']},
      {id:'spins', t:'spins', needs:'none'}
    ],
    what:[
      {id:'apple', t:'an apple', doing:['holds','eats','looks']},
      {id:'earth', t:'the Earth', doing:['looks']},
      {id:'bottle', t:'a water bottle', doing:['holds','looks']}
    ],
    where:[
      {id:'station', t:'in the space station', who:['astro','apple','bottle']},
      {id:'window', t:'by the window', who:['astro','apple','bottle']},
      {id:'above', t:'above the Earth', who:['astro','apple','bottle']}
    ],
    describe:[
      {id:'happy', t:'happy', who:['astro']},
      {id:'brave', t:'brave', who:['astro']},
      {id:'red', t:'red', who:['apple']},
      {id:'shiny', t:'shiny', who:['apple','bottle']},
      {id:'blue', t:'blue', who:['earth']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['floats','spins','eats']},
      {id:'gently', t:'gently', doing:['floats','holds','spins']},
      {id:'happily', t:'happily', doing:['smiles','floats','eats']},
      {id:'carefully', t:'carefully', doing:['holds','eats','looks']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'morning', t:'in the morning'},
      {id:'lunch', t:'after lunch'},
      {id:'every', t:'every day'}
    ]
  },
  {
    id:'launch', title:'Rocket launch', img:'images/rocket-launch.jpg',
    who:[
      {id:'rocket', det:'the', t:'rocket'},
      {id:'crowd', det:'the', t:'crowd', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'blasts', t:'blasts off', needs:'none', who:['rocket']},
      {id:'roars', t:'roars', needs:'none', who:['rocket','crowd']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd','boy']},
      {id:'waves', t:'waves', needs:'none', who:['crowd','boy']},
      {id:'watches', t:'watches', needs:'what', who:['crowd','boy']},
      {id:'rises', t:'rises', needs:'none', who:['rocket','smoke']},
      {id:'points', t:'points at', needs:'what', who:['boy']}
    ],
    what:[
      {id:'rocket', t:'the rocket', doing:['watches','points']},
      {id:'smoke', t:'the smoke', doing:['watches','points']},
      {id:'flames', t:'the flames', doing:['watches','points']}
    ],
    where:[
      {id:'sky', t:'into the sky', doing:['blasts','rises']},
      {id:'pad', t:'from the launch pad', doing:['blasts','rises']},
      {id:'fence', t:'behind the fence', who:['crowd','boy']},
      {id:'clouds', t:'above the clouds', doing:['rises']}
    ],
    describe:[
      {id:'tall', t:'tall', who:['rocket']},
      {id:'noisy', t:'noisy', who:['rocket','crowd']},
      {id:'excited', t:'excited', who:['crowd','boy']},
      {id:'white', t:'white', who:['rocket','smoke']},
      {id:'thick', t:'thick', who:['smoke']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['roars','cheers']},
      {id:'quickly', t:'quickly', doing:['blasts','rises']},
      {id:'slowly', t:'slowly', doing:['rises']},
      {id:'excitedly', t:'excitedly', doing:['cheers','waves','watches','points']},
      {id:'proudly', t:'proudly', doing:['watches','waves','cheers']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'morning', t:'this morning'},
      {id:'last', t:'at last'},
      {id:'countdown', t:'after the countdown'}
    ]
  },
  {
    id:'moon', title:'On the Moon', img:'images/moon-walk.jpg',
    who:[
      {id:'astro', det:'the', t:'astronaut', person:true},
      {id:'flag', det:'the', t:'flag'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['astro']},
      {id:'plants', t:'plants', needs:'what', who:['astro']},
      {id:'jumps', t:'jumps', needs:'none', who:['astro']},
      {id:'waves', t:'waves', needs:'none'},
      {id:'looks', t:'looks at', needs:'what', who:['astro']},
      {id:'stands', t:'stands', needs:'none'}
    ],
    what:[
      {id:'flag', t:'the flag', doing:['plants','looks']},
      {id:'earth', t:'the Earth', doing:['looks']},
      {id:'prints', t:'the footprints', doing:['looks']}
    ],
    where:[
      {id:'moon', t:'on the Moon'},
      {id:'crater', t:'by a crater'},
      {id:'dust', t:'in the grey dust', doing:['plants','walks','stands','jumps']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['astro']},
      {id:'tired', t:'tired', who:['astro']},
      {id:'yellow', t:'yellow', who:['flag']},
      {id:'bright', t:'bright', who:['flag']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','waves','plants']},
      {id:'carefully', t:'carefully', doing:['walks','plants','jumps']},
      {id:'proudly', t:'proudly', doing:['plants','stands','waves','looks']},
      {id:'high', t:'high', doing:['jumps']},
      {id:'bravely', t:'bravely', doing:['walks','jumps','stands']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'last', t:'at last'},
      {id:'first', t:'for the first time'},
      {id:'trip', t:'after a long trip'}
    ]
  },
  {
    id:'mars', title:'Mars rover', img:'images/mars-rover.jpg',
    who:[
      {id:'rover', det:'the', t:'Mars rover'},
      {id:'arm', det:'the', t:'robot arm'},
      {id:'dust', det:'the', t:'dust'}
    ],
    doing:[
      {id:'drives', t:'drives', needs:'none', who:['rover']},
      {id:'scoops', t:'scoops up', needs:'what', who:['rover','arm']},
      {id:'picks', t:'picks up', needs:'what', who:['rover','arm']},
      {id:'digs', t:'digs', who:['rover','arm']},
      {id:'rolls', t:'rolls', needs:'none', who:['rover']},
      {id:'swirls', t:'swirls', needs:'none', who:['dust']},
      {id:'carries', t:'carries', needs:'what', who:['rover','arm']},
      {id:'takes', t:'takes', needs:'what', who:['rover']}
    ],
    what:[
      {id:'rock', t:'a rock', doing:['scoops','carries','picks']},
      {id:'dust', t:'some red dust', doing:['scoops','carries']},
      {id:'samples', t:'a rock sample', doing:['picks','carries','scoops']},
      {id:'photo', t:'a photo', doing:['takes']},
      {id:'hole', t:'a hole', doing:['digs']}
    ],
    where:[
      {id:'across', t:'across Mars', doing:['drives','rolls','swirls']},
      {id:'rocks', t:'over the rocks', doing:['drives','rolls','swirls']},
      {id:'air', t:'into the air', who:['dust']},
      {id:'planet', t:'on the red planet'}
    ],
    describe:[
      {id:'clever', t:'clever', who:['rover','arm']},
      {id:'dusty', t:'dusty', who:['rover','arm']},
      {id:'metal', t:'metal', who:['rover','arm']},
      {id:'red', t:'red', who:['dust']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['drives','rolls','scoops','digs','swirls']},
      {id:'carefully', t:'carefully', doing:['scoops','digs','carries','drives','takes','picks']},
      {id:'noisily', t:'noisily', doing:['drives','digs','rolls']},
      {id:'gently', t:'gently', doing:['scoops','carries','swirls']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'allday', t:'all day'},
      {id:'sunrise', t:'after sunrise'},
      {id:'every', t:'every morning'}
    ]
  },
  {
    id:'telescope', title:'Stargazing', img:'images/telescope.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'moon', det:'the', t:'moon'},
      {id:'star', det:'a', t:'shooting star'}
    ],
    doing:[
      {id:'looks', t:'looks at', needs:'what', who:['girl']},
      {id:'shines', t:'shines', needs:'none', who:['moon','star']},
      {id:'zooms', t:'zooms', needs:'none', who:['star']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl']},
      {id:'sees', t:'sees', needs:'what', who:['girl']},
      {id:'glows', t:'glows', needs:'none', who:['moon','star']}
    ],
    what:[
      {id:'moon', t:'the moon', doing:['looks','sees']},
      {id:'stars', t:'the stars', doing:['looks','sees']},
      {id:'star', t:'a shooting star', doing:['looks','sees']}
    ],
    where:[
      {id:'garden', t:'in the garden', who:['girl']},
      {id:'sky', t:'in the sky', who:['moon','star']},
      {id:'across', t:'across the sky', doing:['zooms']},
      {id:'tree', t:'above the tree', who:['moon','star']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['girl']},
      {id:'bright', t:'bright', who:['moon','star']},
      {id:'full', t:'full', who:['moon']},
      {id:'silver', t:'silver', who:['moon','star']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['looks','sees']},
      {id:'brightly', t:'brightly', doing:['shines','glows']},
      {id:'quickly', t:'quickly', doing:['zooms']},
      {id:'quietly', t:'quietly', doing:['looks','smiles','zooms']},
      {id:'happily', t:'happily', doing:['smiles']}
    ],
    when:[
      {id:'tonight', t:'tonight'},
      {id:'midnight', t:'at midnight'},
      {id:'dark', t:'after dark'},
      {id:'bed', t:'before bedtime'}
    ]
  },
  {
    id:'spacewalk', title:'Spacewalk', img:'images/spacewalk.jpg',
    who:[
      {id:'astro', det:'the', t:'astronaut', person:true},
      {id:'station', det:'the', t:'space station'},
      {id:'satellite', det:'the', t:'satellite'},
      {id:'earth', det:'the', t:'Earth'}
    ],
    doing:[
      {id:'fixes', t:'fixes', needs:'what', who:['astro']},
      {id:'floats', t:'floats', needs:'none', who:['astro','satellite','station']},
      {id:'holds', t:'holds', needs:'what', who:['astro']},
      {id:'spins', t:'spins', needs:'none', who:['earth','satellite']},
      {id:'waves', t:'waves', needs:'none', who:['astro']},
      {id:'orbits', t:'orbits', who:['station','satellite']}
    ],
    what:[
      {id:'panel', t:'the solar panel', doing:['fixes','holds']},
      {id:'tool', t:'a tool', doing:['holds']},
      {id:'satellite', t:'the satellite', doing:['fixes','holds']},
      {id:'earth', t:'the Earth', doing:['orbits']}
    ],
    where:[
      {id:'outside', t:'outside the space station', who:['astro','satellite']},
      {id:'above', t:'above the Earth', who:['astro','satellite','station']},
      {id:'space', t:'in space'},
      {id:'below', t:'below the astronaut', who:['earth']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['astro']},
      {id:'huge', t:'huge', who:['station','earth']},
      {id:'blue', t:'blue', who:['earth']},
      {id:'broken', t:'broken', who:['satellite']},
      {id:'shiny', t:'shiny', who:['satellite','station']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['fixes','holds','floats']},
      {id:'slowly', t:'slowly', doing:['floats','spins','orbits']},
      {id:'safely', t:'safely', doing:['floats','fixes']},
      {id:'gently', t:'gently', doing:['holds','floats','spins']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'breakfast', t:'after breakfast'},
      {id:'hours', t:'for two hours'},
      {id:'last', t:'at last'}
    ]
  }
  ]
},
{
  id:'stories', label:'Stories', years:'All years', pictures:[
  {
    id:'forest', title:'Enchanted forest', img:'images/story-forest.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'fox', det:'the', t:'fox'},
      {id:'owl', det:'the', t:'owl'},
      {id:'stream', det:'the', t:'stream'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['girl','fox']},
      {id:'holds', t:'holds', needs:'what', who:['girl']},
      {id:'hoots', t:'hoots', needs:'none', who:['owl']},
      {id:'watches', t:'watches', needs:'what', who:['girl','fox','owl']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['stream']},
      {id:'crosses', t:'crosses', needs:'what', who:['girl','fox']},
      {id:'sniffs', t:'sniffs', needs:'what', who:['fox']}
    ],
    what:[
      {id:'lantern', t:'a lantern', doing:['holds']},
      {id:'bridge', t:'the bridge', doing:['crosses','watches']},
      {id:'girl', t:'the girl', doing:['watches'], who:['fox','owl']},
      {id:'fox', t:'the fox', doing:['watches'], who:['girl','owl']},
      {id:'mushrooms', t:'the mushrooms', doing:['sniffs','watches']}
    ],
    where:[
      {id:'path', t:'along the path', doing:['walks']},
      {id:'forest', t:'through the forest', doing:['walks']},
      {id:'tree', t:'in the tree', who:['owl']},
      {id:'under', t:'under the bridge', who:['stream']},
      {id:'dark', t:'in the dark forest'}
    ],
    describe:[
      {id:'brave', t:'brave', who:['girl']},
      {id:'curious', t:'curious', who:['girl','fox']},
      {id:'clever', t:'clever', who:['fox']},
      {id:'wise', t:'wise', who:['owl']},
      {id:'sleepy', t:'sleepy', who:['owl']},
      {id:'icy', t:'icy', who:['stream']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['walks','watches','crosses','sniffs']},
      {id:'carefully', t:'carefully', doing:['walks','crosses','holds','sniffs']},
      {id:'softly', t:'softly', doing:['hoots','walks']},
      {id:'brightly', t:'brightly', doing:['sparkles']}
    ],
    when:[
      {id:'dusk', t:'at dusk'},
      {id:'sunset', t:'after sunset'},
      {id:'tonight', t:'tonight'},
      {id:'every', t:'every evening'}
    ]
  },
  {
    id:'dragon', title:'The knight and the dragon', img:'images/story-dragon.jpg',
    who:[
      {id:'knight', det:'the', t:'knight', person:true},
      {id:'dragon', det:'the', t:'dragon'},
      {id:'queen', det:'the', t:'queen', person:true},
      {id:'castle', det:'the', t:'castle'}
    ],
    doing:[
      {id:'holds', t:'holds', needs:'what', who:['knight']},
      {id:'faces', t:'faces', needs:'what', who:['knight','dragon']},
      {id:'roars', t:'roars', needs:'none', who:['dragon']},
      {id:'waves', t:'waves', needs:'none', who:['queen']},
      {id:'watches', t:'watches', needs:'what', who:['queen','dragon','knight']},
      {id:'stands', t:'stands', needs:'none'},
      {id:'smiles', t:'smiles', needs:'none', who:['queen','dragon','knight']}
    ],
    what:[
      {id:'shield', t:'a shield', doing:['holds']},
      {id:'dragon', t:'the dragon', doing:['faces','watches'], who:['knight','queen']},
      {id:'knight', t:'the knight', doing:['faces','watches'], who:['dragon','queen']}
    ],
    where:[
      {id:'hill', t:'on the hill', who:['knight','dragon','castle']},
      {id:'tower', t:'from the tower', who:['queen']},
      {id:'by', t:'by the castle', who:['knight','dragon']},
      {id:'sun', t:'in the sunshine'}
    ],
    describe:[
      {id:'brave', t:'brave', who:['knight','queen']},
      {id:'shiny', t:'shiny', who:['knight']},
      {id:'green', t:'green', who:['dragon']},
      {id:'enormous', t:'enormous', who:['dragon','castle']},
      {id:'friendly', t:'friendly', who:['dragon','queen']},
      {id:'old', t:'old', who:['castle']}
    ],
    how:[
      {id:'bravely', t:'bravely', doing:['holds','faces','stands']},
      {id:'loudly', t:'loudly', doing:['roars']},
      {id:'happily', t:'happily', doing:['waves','smiles']},
      {id:'proudly', t:'proudly', doing:['stands','holds','waves']},
      {id:'nervously', t:'nervously', doing:['watches','faces','smiles']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'noon', t:'at noon'},
      {id:'last', t:'at last'},
      {id:'battle', t:'before the battle'}
    ]
  },
  {
    id:'lighthouse', title:'Stormy lighthouse', img:'images/story-lighthouse.jpg',
    who:[
      {id:'lighthouse', det:'the', t:'lighthouse'},
      {id:'boat', det:'the', t:'boat'},
      {id:'keeper', det:'the', t:'keeper', person:true},
      {id:'sea', det:'the', t:'sea'},
      {id:'lightning', det:'the', t:'lightning'}
    ],
    doing:[
      {id:'shines', t:'shines', needs:'none', who:['lighthouse']},
      {id:'flashes', t:'flashes', needs:'none', who:['lightning']},
      {id:'rocks', t:'rocks', needs:'none', who:['boat']},
      {id:'sails', t:'sails', needs:'none', who:['boat']},
      {id:'crashes', t:'crashes', needs:'none', who:['sea']},
      {id:'holds', t:'holds', needs:'what', who:['keeper']},
      {id:'watches', t:'watches', needs:'what', who:['keeper']}
    ],
    what:[
      {id:'lamp', t:'a lamp', doing:['holds']},
      {id:'boat', t:'the boat', doing:['watches']},
      {id:'storm', t:'the storm', doing:['watches']}
    ],
    where:[
      {id:'rocks', t:'on the rocks', who:['keeper','lighthouse']},
      {id:'across', t:'across the sea', doing:['shines','sails']},
      {id:'towards', t:'towards the rocks', doing:['sails']},
      {id:'sky', t:'in the sky', who:['lightning']},
      {id:'against', t:'against the rocks', doing:['crashes']}
    ],
    describe:[
      {id:'tall', t:'tall', who:['lighthouse']},
      {id:'tiny', t:'tiny', who:['boat']},
      {id:'brave', t:'brave', who:['keeper']},
      {id:'stormy', t:'stormy', who:['sea']},
      {id:'wild', t:'wild', who:['sea']},
      {id:'bright', t:'bright', who:['lightning','lighthouse']}
    ],
    how:[
      {id:'brightly', t:'brightly', doing:['shines','flashes']},
      {id:'wildly', t:'wildly', doing:['rocks','crashes']},
      {id:'carefully', t:'carefully', doing:['holds','watches','sails']},
      {id:'bravely', t:'bravely', doing:['sails','watches']},
      {id:'loudly', t:'loudly', doing:['crashes']}
    ],
    when:[
      {id:'tonight', t:'tonight'},
      {id:'midnight', t:'at midnight'},
      {id:'storm', t:'during the storm'},
      {id:'allnight', t:'all night'}
    ]
  },
  {
    id:'pirate', title:'Treasure island', img:'images/story-pirate.jpg',
    who:[
      {id:'captain', det:'the', t:'pirate captain', person:true},
      {id:'parrot', det:'the', t:'parrot'},
      {id:'ship', det:'the', t:'ship'},
      {id:'chest', det:'the', t:'treasure chest'}
    ],
    doing:[
      {id:'digs', t:'digs', who:['captain']},
      {id:'finds', t:'finds', needs:'what', who:['captain']},
      {id:'opens', t:'opens', needs:'what', who:['captain']},
      {id:'laughs', t:'laughs', needs:'none', who:['captain']},
      {id:'flies', t:'flies', needs:'none', who:['parrot']},
      {id:'squawks', t:'squawks', needs:'none', who:['parrot']},
      {id:'floats', t:'floats', needs:'none', who:['ship']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['chest']}
    ],
    what:[
      {id:'hole', t:'a hole', doing:['digs']},
      {id:'treasure', t:'the treasure', doing:['finds']},
      {id:'chest', t:'the chest', doing:['finds','opens']}
    ],
    where:[
      {id:'beach', t:'on the beach', who:['captain','chest']},
      {id:'palms', t:'above the palm trees', doing:['flies','squawks']},
      {id:'bay', t:'in the bay', who:['ship']},
      {id:'sand', t:'in the sand', who:['captain','chest']}
    ],
    describe:[
      {id:'greedy', t:'greedy', who:['captain']},
      {id:'happy', t:'happy', who:['captain']},
      {id:'colourful', t:'colourful', who:['parrot']},
      {id:'noisy', t:'noisy', who:['parrot']},
      {id:'old', t:'old', who:['ship','chest']},
      {id:'heavy', t:'heavy', who:['chest']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['digs','flies']},
      {id:'happily', t:'happily', doing:['laughs','squawks','finds']},
      {id:'loudly', t:'loudly', doing:['laughs','squawks']},
      {id:'gently', t:'gently', doing:['floats']},
      {id:'slowly', t:'slowly', doing:['opens','floats','digs']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'today', t:'today'},
      {id:'last', t:'at last'},
      {id:'search', t:'after a long search'}
    ]
  }
  ]
},
{
  id:'around', label:'Around us', years:'Year 1–2', pictures:[
  {
    id:'park', title:'Park in autumn', img:'images/around-park.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'squirrel', det:'the', t:'squirrel'}
    ],
    doing:[
      {id:'kicks', t:'kicks', needs:'what', who:['boy','girl']},
      {id:'swings', t:'swings', needs:'none', who:['girl','boy']},
      {id:'chases', t:'chases', needs:'what', who:['dog']},
      {id:'runs', t:'runs', needs:'none', who:['dog','boy','girl']},
      {id:'climbs', t:'climbs', who:['squirrel','boy']},
      {id:'barks', t:'barks', needs:'none', who:['dog']},
      {id:'laughs', t:'laughs', needs:'none', who:['boy','girl']}
    ],
    what:[
      {id:'leaves', t:'the leaves', doing:['kicks']},
      {id:'ball', t:'a ball', doing:['kicks','chases']},
      {id:'squirrel', t:'the squirrel', doing:['chases']},
      {id:'tree', t:'the tree', doing:['climbs']}
    ],
    where:[
      {id:'park', t:'in the park'},
      {id:'under', t:'under the tree', who:['boy','girl','dog']},
      {id:'up', t:'up the tree', doing:['climbs','runs'], who:['squirrel']},
      {id:'swing', t:'on the swing', doing:['swings','laughs']}
    ],
    describe:[
      {id:'happy', t:'happy', who:['boy','girl']},
      {id:'fluffy', t:'fluffy', who:['dog','squirrel']},
      {id:'little', t:'little'},
      {id:'playful', t:'playful', who:['dog','squirrel']},
      {id:'cheeky', t:'cheeky', who:['squirrel','boy','girl']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['runs','chases','climbs']},
      {id:'high', t:'high', doing:['swings','kicks','climbs']},
      {id:'happily', t:'happily', doing:['laughs','swings','kicks','runs']},
      {id:'loudly', t:'loudly', doing:['barks','laughs']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'autumn', t:'in autumn'},
      {id:'school', t:'after school'},
      {id:'weekend', t:'at the weekend'}
    ]
  },
  {
    id:'farm', title:'On the farm', img:'images/around-farm.jpg',
    who:[
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'cow', det:'the', t:'cow'},
      {id:'pig', det:'the', t:'pig'},
      {id:'hen', det:'the', t:'hen'}
    ],
    doing:[
      {id:'feeds', t:'feeds', needs:'what', who:['farmer']},
      {id:'eats', t:'eats', who:['cow','pig','hen']},
      {id:'rolls', t:'rolls', needs:'none', who:['pig']},
      {id:'pecks', t:'pecks', who:['hen']},
      {id:'moos', t:'moos', needs:'none', who:['cow']},
      {id:'drives', t:'drives', needs:'what', who:['farmer']},
      {id:'carries', t:'carries', needs:'what', who:['farmer']}
    ],
    what:[
      {id:'hens', t:'the hens', doing:['feeds']},
      {id:'grass', t:'the grass', doing:['eats'], who:['cow']},
      {id:'grain', t:'some grain', doing:['pecks','eats'], who:['hen','pig']},
      {id:'tractor', t:'the tractor', doing:['drives']},
      {id:'bucket', t:'a bucket', doing:['carries']}
    ],
    where:[
      {id:'mud', t:'in the mud', who:['pig']},
      {id:'field', t:'in the field', who:['cow','farmer']},
      {id:'barn', t:'by the barn'},
      {id:'farm', t:'on the farm'}
    ],
    describe:[
      {id:'busy', t:'busy', who:['farmer']},
      {id:'kind', t:'kind', who:['farmer']},
      {id:'spotty', t:'spotty', who:['cow']},
      {id:'pink', t:'pink', who:['pig']},
      {id:'muddy', t:'muddy', who:['pig','farmer']},
      {id:'brown', t:'brown', who:['hen','cow']}
    ],
    how:[
      {id:'happily', t:'happily', doing:['rolls','eats','moos','pecks']},
      {id:'loudly', t:'loudly', doing:['moos']},
      {id:'slowly', t:'slowly', doing:['eats','drives']},
      {id:'carefully', t:'carefully', doing:['feeds','carries','drives']},
      {id:'quickly', t:'quickly', doing:['pecks','eats']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'today', t:'today'},
      {id:'dawn', t:'at dawn'},
      {id:'breakfast', t:'before breakfast'}
    ]
  },
  {
    id:'seaside', title:'At the seaside', img:'images/around-seaside.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'crab', det:'the', t:'crab'},
      {id:'seagull', det:'the', t:'seagull'}
    ],
    doing:[
      {id:'builds', t:'builds', needs:'what', who:['girl','boy']},
      {id:'paddles', t:'paddles', needs:'none', who:['boy','girl']},
      {id:'walks', t:'walks', needs:'none', who:['crab','girl','boy']},
      {id:'flies', t:'flies', needs:'none', who:['seagull']},
      {id:'squawks', t:'squawks', needs:'none', who:['seagull']},
      {id:'digs', t:'digs', who:['girl','boy','crab']},
      {id:'splashes', t:'splashes', needs:'none', who:['boy','girl']}
    ],
    what:[
      {id:'castle', t:'a sandcastle', doing:['builds']},
      {id:'hole', t:'a hole', doing:['digs']}
    ],
    where:[
      {id:'sand', t:'on the sand', who:['girl','boy','crab']},
      {id:'sea', t:'in the sea', doing:['paddles','splashes']},
      {id:'over', t:'over the beach', doing:['flies','squawks']},
      {id:'umbrella', t:'by the umbrella', who:['girl','boy','crab']}
    ],
    describe:[
      {id:'happy', t:'happy', who:['girl','boy']},
      {id:'excited', t:'excited', who:['girl','boy']},
      {id:'red', t:'red', who:['crab']},
      {id:'tiny', t:'tiny', who:['crab']},
      {id:'noisy', t:'noisy', who:['seagull']},
      {id:'white', t:'white', who:['seagull']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['builds','digs','walks']},
      {id:'sideways', t:'sideways', doing:['walks'], who:['crab']},
      {id:'happily', t:'happily', doing:['paddles','splashes','builds']},
      {id:'loudly', t:'loudly', doing:['squawks','splashes']},
      {id:'high', t:'high', doing:['flies']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'summer', t:'in the summer'},
      {id:'lunch', t:'after lunch'},
      {id:'allday', t:'all day'}
    ]
  },
  {
    id:'minibeasts', title:'Minibeast hunt', img:'images/around-minibeasts.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'snail', det:'the', t:'snail'},
      {id:'ladybird', det:'the', t:'ladybird'},
      {id:'worm', det:'the', t:'worm'},
      {id:'butterfly', det:'the', t:'butterfly'}
    ],
    doing:[
      {id:'looks', t:'looks at', needs:'what', who:['girl']},
      {id:'crawls', t:'crawls', needs:'none', who:['snail','ladybird']},
      {id:'wriggles', t:'wriggles', needs:'none', who:['worm']},
      {id:'flies', t:'flies', needs:'none', who:['butterfly','ladybird']},
      {id:'eats', t:'eats', who:['snail']},
      {id:'sits', t:'sits', needs:'none', who:['snail','ladybird','butterfly']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl']}
    ],
    what:[
      {id:'snail', t:'the snail', doing:['looks']},
      {id:'ladybird', t:'the ladybird', doing:['looks']},
      {id:'leaf', t:'a leaf', doing:['eats']}
    ],
    where:[
      {id:'leaf', t:'on the leaf', who:['snail','ladybird','butterfly']},
      {id:'soil', t:'in the soil', who:['worm']},
      {id:'flower', t:'on the flower', who:['ladybird','butterfly']},
      {id:'garden', t:'in the garden'}
    ],
    describe:[
      {id:'curious', t:'curious', who:['girl']},
      {id:'slimy', t:'slimy', who:['snail','worm']},
      {id:'spotty', t:'spotty', who:['ladybird']},
      {id:'pink', t:'pink', who:['worm']},
      {id:'colourful', t:'colourful', who:['butterfly']},
      {id:'tiny', t:'tiny', who:['ladybird','snail','worm']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['crawls','wriggles','eats']},
      {id:'carefully', t:'carefully', doing:['looks']},
      {id:'gently', t:'gently', doing:['flies','sits']},
      {id:'quickly', t:'quickly', doing:['wriggles','flies','crawls']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'rain', t:'after the rain'},
      {id:'spring', t:'in the spring'},
      {id:'morning', t:'every morning'}
    ]
  }
  ]
},
{
  id:'history', label:'History', years:'Year 2–6', pictures:[
  {
    id:'fire', title:'Great Fire of London (Y2)', img:'images/history-fire.jpg',
    who:[
      {id:'man', det:'the', t:'man', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'fire', det:'the', t:'fire'},
      {id:'house', det:'the', t:'house'},
      {id:'boat', det:'the', t:'boat'}
    ],
    doing:[
      {id:'carries', t:'carries', needs:'what', who:['man','woman']},
      {id:'runs', t:'runs', needs:'none', who:['man','woman']},
      {id:'burns', t:'burns', needs:'none', who:['fire','house']},
      {id:'spreads', t:'spreads', needs:'none', who:['fire']},
      {id:'floats', t:'floats', needs:'none', who:['boat']},
      {id:'throws', t:'throws', needs:'what', who:['man']}
    ],
    what:[
      {id:'buckets', t:'two buckets of water', doing:['carries']},
      {id:'bag', t:'a heavy bag', doing:['carries']},
      {id:'water', t:'water', doing:['throws']}
    ],
    where:[
      {id:'street', t:'down the street', doing:['runs','spreads','carries']},
      {id:'thames', t:'on the River Thames', who:['boat']},
      {id:'city', t:'through the city', doing:['spreads']},
      {id:'onto', t:'onto the fire', doing:['throws']},
      {id:'london', t:'in London'}
    ],
    describe:[
      {id:'brave', t:'brave', who:['man','woman']},
      {id:'frightened', t:'frightened', who:['man','woman']},
      {id:'wooden', t:'wooden', who:['house','boat']},
      {id:'hot', t:'hot', who:['fire']},
      {id:'roaring', t:'roaring', who:['fire']},
      {id:'old', t:'old', who:['house','boat']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['runs','spreads','carries','burns']},
      {id:'bravely', t:'bravely', doing:['carries','throws']},
      {id:'fiercely', t:'fiercely', doing:['burns']},
      {id:'slowly', t:'slowly', doing:['floats']}
    ],
    when:[
      {id:'night', t:'in the night'},
      {id:'allnight', t:'all night'},
      {id:'days', t:'for four days'},
      {id:'dawn', t:'at dawn'}
    ]
  },
  {
    id:'victorian', title:'Victorian school (Y2)', img:'images/history-victorian.jpg',
    who:[
      {id:'teacher', det:'the', t:'teacher', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'stove', det:'the', t:'stove'}
    ],
    doing:[
      {id:'points', t:'points at', needs:'what', who:['teacher']},
      {id:'writes', t:'writes', who:['girl','boy']},
      {id:'sits', t:'sits', needs:'none', who:['girl','boy']},
      {id:'listens', t:'listens', needs:'none', who:['girl','boy']},
      {id:'glows', t:'glows', needs:'none', who:['stove']},
      {id:'shouts', t:'shouts', needs:'none', who:['teacher']}
    ],
    what:[
      {id:'board', t:'the blackboard', doing:['points']},
      {id:'sum', t:'a sum', doing:['writes']},
      {id:'name', t:'a list of words', doing:['writes']}
    ],
    where:[
      {id:'desk', t:'at a wooden desk', who:['girl','boy']},
      {id:'slate', t:'on a slate', doing:['writes']},
      {id:'front', t:'at the front', who:['teacher']},
      {id:'corner', t:'in the corner', who:['stove']},
      {id:'classroom', t:'in the classroom'}
    ],
    describe:[
      {id:'strict', t:'strict', who:['teacher']},
      {id:'stern', t:'stern', who:['teacher']},
      {id:'quiet', t:'quiet', who:['girl','boy']},
      {id:'tired', t:'tired', who:['girl','boy','teacher']},
      {id:'hot', t:'hot', who:['stove']},
      {id:'black', t:'black', who:['stove']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['sits','writes','listens']},
      {id:'carefully', t:'carefully', doing:['writes','listens']},
      {id:'sternly', t:'sternly', doing:['points','shouts']},
      {id:'loudly', t:'loudly', doing:['shouts']},
      {id:'warmly', t:'warmly', doing:['glows']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'today', t:'today'},
      {id:'lunch', t:'before lunch'},
      {id:'allday', t:'all day'}
    ]
  },
  {
    id:'tudor', title:'Tudor banquet (Y3)', img:'images/history-tudor.jpg',
    who:[
      {id:'king', det:'', t:'King Henry', person:true},
      {id:'jester', det:'the', t:'jester', person:true},
      {id:'musician', det:'the', t:'musician', person:true}
    ],
    doing:[
      {id:'eats', t:'eats', who:['king']},
      {id:'juggles', t:'juggles', who:['jester']},
      {id:'plays', t:'plays', needs:'what', who:['musician']},
      {id:'laughs', t:'laughs', needs:'none', who:['king','jester']},
      {id:'sings', t:'sings', needs:'none', who:['musician','jester']},
      {id:'feasts', t:'feasts', needs:'none', who:['king']},
      {id:'claps', t:'claps', needs:'none', who:['king']}
    ],
    what:[
      {id:'chicken', t:'a chicken leg', doing:['eats']},
      {id:'balls', t:'three balls', doing:['juggles']},
      {id:'lute', t:'the lute', doing:['plays']}
    ],
    where:[
      {id:'table', t:'at the long table', who:['king']},
      {id:'hall', t:'in the great hall'},
      {id:'fire', t:'by the fire', who:['jester','musician']},
      {id:'front', t:'in front of the king', who:['jester','musician']}
    ],
    describe:[
      {id:'funny', t:'funny', who:['jester']},
      {id:'colourful', t:'colourful', who:['jester']},
      {id:'skilful', t:'skilful', who:['jester','musician']},
      {id:'nervous', t:'nervous', who:['musician','jester']}
    ],
    how:[
      {id:'greedily', t:'greedily', doing:['eats','feasts']},
      {id:'loudly', t:'loudly', doing:['laughs','sings','claps']},
      {id:'cleverly', t:'cleverly', doing:['juggles']},
      {id:'sweetly', t:'sweetly', doing:['sings','plays']},
      {id:'happily', t:'happily', doing:['claps','laughs','feasts']}
    ],
    when:[
      {id:'tonight', t:'tonight'},
      {id:'hunt', t:'after the hunt'},
      {id:'evening', t:'all evening'},
      {id:'midnight', t:'until midnight'}
    ]
  },
  {
    id:'viking', title:'Viking longship (Y4)', img:'images/history-viking.jpg',
    who:[
      {id:'warrior', det:'the', t:'Viking warrior', person:true},
      {id:'chief', det:'the', t:'chief', person:true},
      {id:'ship', det:'the', t:'longship'},
      {id:'sail', det:'the', t:'sail'}
    ],
    doing:[
      {id:'jumps', t:'jumps', needs:'none', who:['warrior']},
      {id:'lands', t:'lands', needs:'none', who:['ship']},
      {id:'holds', t:'holds', needs:'what', who:['warrior','chief']},
      {id:'shouts', t:'shouts', needs:'none', who:['chief','warrior']},
      {id:'sails', t:'sails', needs:'none', who:['ship']},
      {id:'splashes', t:'splashes', needs:'none', who:['warrior']},
      {id:'flaps', t:'flaps', needs:'none', who:['sail']}
    ],
    what:[
      {id:'shield', t:'a round shield', doing:['holds']},
      {id:'axe', t:'an axe', doing:['holds']},
      {id:'spear', t:'a spear', doing:['holds']}
    ],
    where:[
      {id:'sea', t:'into the sea', doing:['jumps']},
      {id:'beach', t:'on the beach', doing:['lands']},
      {id:'village', t:'towards the village', doing:['sails','splashes']},
      {id:'front', t:'at the front of the ship', who:['chief']},
      {id:'wind', t:'in the wind', who:['sail']}
    ],
    describe:[
      {id:'fierce', t:'fierce', who:['warrior','chief']},
      {id:'strong', t:'strong', who:['warrior','chief']},
      {id:'wooden', t:'wooden', who:['ship']},
      {id:'long', t:'long', who:['ship']},
      {id:'striped', t:'striped', who:['sail']}
    ],
    how:[
      {id:'bravely', t:'bravely', doing:['jumps','holds']},
      {id:'loudly', t:'loudly', doing:['shouts','flaps','splashes']},
      {id:'quickly', t:'quickly', doing:['sails','jumps','lands']},
      {id:'proudly', t:'proudly', doing:['holds','sails','shouts']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'today', t:'today'},
      {id:'voyage', t:'after a long voyage'},
      {id:'last', t:'at last'}
    ]
  },
  {
    id:'stoneage', title:'Stone Age cave (Y6)', img:'images/history-stoneage.jpg',
    who:[
      {id:'man', det:'the', t:'man', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'child', det:'the', t:'child', person:true},
      {id:'mammoth', det:'the', t:'mammoth'},
      {id:'fire', det:'the', t:'fire'}
    ],
    doing:[
      {id:'lights', t:'lights', needs:'what', who:['man']},
      {id:'paints', t:'paints', needs:'what', who:['woman']},
      {id:'holds', t:'holds', needs:'what', who:['child','man']},
      {id:'walks', t:'walks', needs:'none', who:['mammoth']},
      {id:'crackles', t:'crackles', needs:'none', who:['fire']},
      {id:'watches', t:'watches', needs:'what', who:['child','woman']}
    ],
    what:[
      {id:'fire', t:'a fire', doing:['lights']},
      {id:'animals', t:'animals', doing:['paints']},
      {id:'flint', t:'a flint tool', doing:['holds']},
      {id:'mammoth', t:'the mammoth', doing:['watches']}
    ],
    where:[
      {id:'cave', t:'outside the cave', who:['man','woman','child','fire']},
      {id:'wall', t:'on the cave wall', doing:['paints']},
      {id:'snow', t:'in the snow', who:['mammoth']},
      {id:'fire', t:'by the fire', who:['man','woman','child']}
    ],
    describe:[
      {id:'hungry', t:'hungry', who:['man','woman','child','mammoth']},
      {id:'woolly', t:'woolly', who:['mammoth']},
      {id:'huge', t:'huge', who:['mammoth']},
      {id:'skilful', t:'skilful', who:['woman','man']},
      {id:'young', t:'young', who:['child']},
      {id:'warm', t:'warm', who:['fire']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['lights','paints','holds']},
      {id:'slowly', t:'slowly', doing:['walks','paints']},
      {id:'loudly', t:'loudly', doing:['crackles']},
      {id:'quietly', t:'quietly', doing:['watches','walks','paints']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'winter', t:'in winter'},
      {id:'every', t:'every day'},
      {id:'dark', t:'before dark'}
    ]
  },
  {
    id:'greek', title:'Ancient Greek Olympics (Y6)', img:'images/history-greek.jpg',
    who:[
      {id:'runner', det:'the', t:'runner', person:true},
      {id:'athlete', det:'the', t:'athlete', person:true},
      {id:'crowd', det:'the', t:'crowd', person:true},
      {id:'judge', det:'the', t:'judge', person:true}
    ],
    doing:[
      {id:'sprints', t:'sprints', needs:'none', who:['runner']},
      {id:'throws', t:'throws', needs:'what', who:['athlete']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd']},
      {id:'holds', t:'holds', needs:'what', who:['judge','athlete']},
      {id:'wins', t:'wins', who:['runner','athlete']},
      {id:'watches', t:'watches', needs:'what', who:['judge','crowd']}
    ],
    what:[
      {id:'discus', t:'a discus', doing:['throws','holds'], who:['athlete']},
      {id:'wreath', t:'an olive wreath', doing:['holds'], who:['judge']},
      {id:'race', t:'the race', doing:['wins'], who:['runner']},
      {id:'runner', t:'the runner', doing:['watches']}
    ],
    where:[
      {id:'track', t:'on the track', who:['runner']},
      {id:'stadium', t:'in the stadium'},
      {id:'seats', t:'on the stone seats', who:['crowd']},
      {id:'across', t:'across the stadium', doing:['throws','sprints']}
    ],
    describe:[
      {id:'fast', t:'fast', who:['runner']},
      {id:'strong', t:'strong', who:['athlete']},
      {id:'excited', t:'excited', who:['crowd']},
      {id:'wise', t:'wise', who:['judge']},
      {id:'proud', t:'proud', who:['runner','athlete']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['sprints']},
      {id:'powerfully', t:'powerfully', doing:['throws']},
      {id:'loudly', t:'loudly', doing:['cheers']},
      {id:'proudly', t:'proudly', doing:['holds','wins']},
      {id:'carefully', t:'carefully', doing:['watches','holds','throws']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'four', t:'every four years'},
      {id:'noon', t:'at noon'},
      {id:'last', t:'at last'}
    ]
  }
  ]
}
];
