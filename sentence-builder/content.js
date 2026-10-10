/* Sentence Builder — picture word banks.
 *
 * Each picture has word cards in the colour-coded categories (the same colours and icons
 * as the staff Colour-Coded Sentence Builder). The sense check uses three optional fields:
 *   who:[ids]    this card only makes sense with these who cards
 *   doing:[ids]  this card only makes sense with these doing cards
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
      {id:'astro', det:'the', t:'astronaut'},
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
      {id:'crowd', det:'the', t:'crowd'},
      {id:'boy', det:'the', t:'boy'},
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
      {id:'astro', det:'the', t:'astronaut'},
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
      {id:'rover', det:'the', t:'rover'},
      {id:'arm', det:'the', t:'robot arm'},
      {id:'dust', det:'the', t:'dust'}
    ],
    doing:[
      {id:'drives', t:'drives', needs:'none', who:['rover']},
      {id:'scoops', t:'scoops up', needs:'what', who:['rover','arm']},
      {id:'digs', t:'digs', who:['rover','arm']},
      {id:'rolls', t:'rolls', needs:'none', who:['rover']},
      {id:'swirls', t:'swirls', needs:'none', who:['dust']},
      {id:'carries', t:'carries', needs:'what', who:['rover','arm']},
      {id:'takes', t:'takes', needs:'what', who:['rover']}
    ],
    what:[
      {id:'rock', t:'a rock', doing:['scoops','carries']},
      {id:'dust', t:'some red dust', doing:['scoops','carries']},
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
      {id:'carefully', t:'carefully', doing:['scoops','digs','carries','drives','takes']},
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
      {id:'girl', det:'the', t:'girl'},
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
      {id:'astro', det:'the', t:'astronaut'},
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
}
];
