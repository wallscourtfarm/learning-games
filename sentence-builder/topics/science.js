/* Sentence Builder — Science pictures (CLF Y1–Y6 science enquiries).
 * Same word-bank schema as content.js (see the notes at the top of that file).
 */
TOPICS.push({
  id:'science', label:'Science', years:'Year 1–6', pictures:[
  {
    id:'winter', title:'Winter in the park (Y1)', img:'images/science-winter.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'robin', det:'the', t:'robin'},
      {id:'snowman', det:'the', t:'snowman'},
      {id:'sun', det:'the', t:'sun'},
      {id:'snow', det:'the', t:'snow'}
    ],
    doing:[
      {id:'rolls', t:'rolls', needs:'what', who:['girl']},
      {id:'builds', t:'builds', needs:'what', who:['girl']},
      {id:'shivers', t:'shivers', needs:'none', who:['girl']},
      {id:'sings', t:'sings', needs:'none', who:['robin']},
      {id:'perches', t:'perches', needs:'none', who:['robin']},
      {id:'stands', t:'stands', needs:'none', who:['snowman','girl']},
      {id:'shines', t:'shines', needs:'none', who:['sun']},
      {id:'melts', t:'melts', needs:'none', who:['snowman','snow']},
      {id:'covers', t:'covers', needs:'what', who:['snow']},
      {id:'falls', t:'falls', needs:'none', who:['snow']}
    ],
    what:[
      {id:'snowball', t:'a big snowball', doing:['rolls']},
      {id:'snowman', t:'a snowman', doing:['builds']},
      {id:'grass', t:'the grass', doing:['covers']},
      {id:'bench', t:'the bench', doing:['covers']}
    ],
    where:[
      {id:'park', t:'in the park', who:['girl','robin','snowman','snow']},
      {id:'branch', t:'on a bare branch', who:['robin']},
      {id:'pond', t:'by the frozen pond', who:['girl','snowman']},
      {id:'sky', t:'low in the sky', who:['sun']},
      {id:'ground', t:'on the ground', who:['snow'], doing:['falls','melts']}
    ],
    describe:[
      {id:'cold', t:'cold', who:['girl','snow']},
      {id:'cheerful', t:'cheerful', who:['girl','robin']},
      {id:'tiny', t:'tiny', who:['robin']},
      {id:'red', t:'red', who:['robin']},
      {id:'round', t:'round', who:['snowman']},
      {id:'white', t:'white', who:['snowman','snow']},
      {id:'soft', t:'soft', who:['snow']},
      {id:'pale', t:'pale', who:['sun']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['rolls','melts','falls']},
      {id:'carefully', t:'carefully', doing:['builds','rolls']},
      {id:'gently', t:'gently', doing:['falls','shines']},
      {id:'weakly', t:'weakly', doing:['shines']},
      {id:'sweetly', t:'sweetly', doing:['sings']},
      {id:'happily', t:'happily', doing:['builds','rolls','sings']},
      {id:'quietly', t:'quietly', doing:['falls','perches','stands']}
    ],
    when:[
      {id:'winter', t:'in winter'},
      {id:'morning', t:'this morning'},
      {id:'cold', t:'on a cold day'},
      {id:'lunch', t:'after lunch'}
    ]
  },
  {
    id:'woodland', title:'Woodland habitat (Y2)', img:'images/science-woodland.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'hedgehog', det:'the', t:'hedgehog'},
      {id:'squirrel', det:'the', t:'squirrel'},
      {id:'owl', det:'the', t:'owl'},
      {id:'woodlouse', det:'the', t:'woodlouse'},
      {id:'beetle', det:'the', t:'beetle'}
    ],
    doing:[
      {id:'looks', t:'looks at', needs:'what', who:['boy']},
      {id:'hides', t:'hides', needs:'none', who:['woodlouse','beetle','hedgehog','owl']},
      {id:'climbs', t:'climbs', needs:'none', who:['squirrel']},
      {id:'sleeps', t:'sleeps', needs:'none', who:['owl','hedgehog']},
      {id:'eats', t:'eats', who:['hedgehog','squirrel']},
      {id:'crawls', t:'crawls', needs:'none', who:['woodlouse','beetle']},
      {id:'snuffles', t:'snuffles', needs:'none', who:['hedgehog']},
      {id:'watches', t:'watches', needs:'what', who:['owl','boy']}
    ],
    what:[
      {id:'woodlice', t:'the woodlice', doing:['looks','watches'], who:['boy']},
      {id:'beetle', t:'a black beetle', doing:['looks','eats','watches'], who:['boy','hedgehog','owl']},
      {id:'acorn', t:'an acorn', doing:['eats','looks'], who:['squirrel','boy']},
      {id:'hedgehog', t:'the hedgehog', doing:['looks','watches'], who:['boy','owl']},
      {id:'squirrel', t:'the squirrel', doing:['looks','watches'], who:['boy','owl']},
      {id:'boy', t:'the boy', doing:['watches'], who:['owl']}
    ],
    where:[
      {id:'log', t:'under the rotting log', who:['woodlouse','beetle','hedgehog']},
      {id:'leaves', t:'in the fallen leaves', who:['hedgehog','beetle','woodlouse']},
      {id:'hole', t:'in a hole in the tree', who:['owl']},
      {id:'trunk', t:'up the tree trunk', who:['squirrel'], doing:['climbs']},
      {id:'branch', t:'on a branch', who:['squirrel'], doing:['eats']},
      {id:'beside', t:'beside the log', who:['boy']},
      {id:'wood', t:'in the wood'}
    ],
    describe:[
      {id:'curious', t:'curious', who:['boy']},
      {id:'quiet', t:'quiet', who:['boy','owl']},
      {id:'prickly', t:'prickly', who:['hedgehog']},
      {id:'brown', t:'brown', who:['hedgehog','owl']},
      {id:'sleepy', t:'sleepy', who:['owl','hedgehog']},
      {id:'grey', t:'grey', who:['squirrel','woodlouse']},
      {id:'busy', t:'busy', who:['squirrel']},
      {id:'tiny', t:'tiny', who:['woodlouse','beetle']},
      {id:'shiny', t:'shiny', who:['beetle']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['looks','climbs','watches']},
      {id:'slowly', t:'slowly', doing:['crawls','snuffles']},
      {id:'quickly', t:'quickly', doing:['climbs','hides','crawls']},
      {id:'quietly', t:'quietly', doing:['watches','looks','sleeps','hides']},
      {id:'hungrily', t:'hungrily', doing:['eats']},
      {id:'peacefully', t:'peacefully', doing:['sleeps']}
    ],
    when:[
      {id:'autumn', t:'in autumn'},
      {id:'today', t:'today'},
      {id:'morning', t:'in the morning'},
      {id:'afternoon', t:'this afternoon'}
    ]
  },
  {
    id:'fossils', title:'Fossil hunting (Y3)', img:'images/science-fossils.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'hunter', det:'the', t:'fossil hunter', person:true},
      {id:'cliff', det:'the', t:'cliff'},
      {id:'sea', det:'the', t:'sea'},
      {id:'seagull', det:'the', t:'seagull'}
    ],
    doing:[
      {id:'holds', t:'holds', needs:'what', who:['girl','hunter']},
      {id:'finds', t:'finds', needs:'what', who:['girl','hunter']},
      {id:'studies', t:'studies', needs:'what', who:['girl','hunter']},
      {id:'crouches', t:'crouches', needs:'none', who:['girl','hunter']},
      {id:'towers', t:'towers', needs:'none', who:['cliff']},
      {id:'crumbles', t:'crumbles', needs:'none', who:['cliff']},
      {id:'crashes', t:'crashes', needs:'none', who:['sea']},
      {id:'erodes', t:'erodes', needs:'what', who:['sea']},
      {id:'squawks', t:'squawks', needs:'none', who:['seagull']},
      {id:'stands', t:'stands', needs:'none', who:['seagull']}
    ],
    what:[
      {id:'ammonite', t:'an ammonite fossil', doing:['holds','finds','studies']},
      {id:'rock', t:'a rock', doing:['holds','finds','studies']},
      {id:'layers', t:'the rock layers', doing:['studies']},
      {id:'cliff', t:'the cliff', doing:['erodes','studies']}
    ],
    where:[
      {id:'beach', t:'on the beach', who:['girl','hunter','seagull']},
      {id:'pebbles', t:'on the pebbles', who:['girl','hunter','seagull']},
      {id:'shore', t:'by the shore', who:['girl','hunter','seagull']},
      {id:'above', t:'above the beach', who:['cliff'], doing:['towers']},
      {id:'onto', t:'onto the beach', doing:['crumbles','crashes']},
      {id:'coast', t:'on the Jurassic Coast'}
    ],
    describe:[
      {id:'curious', t:'curious', who:['girl','hunter']},
      {id:'patient', t:'patient', who:['girl','hunter']},
      {id:'careful', t:'careful', who:['girl','hunter']},
      {id:'tall', t:'tall', who:['cliff']},
      {id:'layered', t:'layered', who:['cliff']},
      {id:'grey', t:'grey', who:['cliff','sea','seagull']},
      {id:'rough', t:'rough', who:['sea']},
      {id:'noisy', t:'noisy', who:['seagull','sea']},
      {id:'white', t:'white', who:['seagull']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['holds','studies','crouches']},
      {id:'closely', t:'closely', doing:['studies']},
      {id:'gently', t:'gently', doing:['holds']},
      {id:'proudly', t:'proudly', doing:['holds']},
      {id:'excitedly', t:'excitedly', doing:['finds']},
      {id:'slowly', t:'slowly', doing:['crumbles','erodes']},
      {id:'loudly', t:'loudly', doing:['crashes','squawks']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'tide', t:'at low tide'},
      {id:'storm', t:'after the storm'},
      {id:'morning', t:'this morning'}
    ]
  },
  {
    id:'circuit', title:'Building a circuit (Y4)', img:'images/science-circuit.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'bulb', det:'the', t:'bulb'},
      {id:'battery', det:'the', t:'battery'},
      {id:'switch', det:'the', t:'switch'},
      {id:'electricity', det:'the', t:'electricity'}
    ],
    doing:[
      {id:'presses', t:'presses', needs:'what', who:['boy']},
      {id:'watches', t:'watches', needs:'what', who:['girl','boy']},
      {id:'builds', t:'builds', needs:'what', who:['girl','boy']},
      {id:'connects', t:'connects', needs:'what', who:['girl','boy']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','boy']},
      {id:'lights', t:'lights up', needs:'none', who:['bulb']},
      {id:'glows', t:'glows', needs:'none', who:['bulb']},
      {id:'powers', t:'powers', needs:'what', who:['battery']},
      {id:'closes', t:'closes', needs:'what', who:['switch']},
      {id:'flows', t:'flows', needs:'none', who:['electricity']}
    ],
    what:[
      {id:'switch', t:'the switch', doing:['presses','watches']},
      {id:'bulb', t:'the bulb', doing:['watches','powers']},
      {id:'circuit', t:'a series circuit', doing:['builds']},
      {id:'gap', t:'the circuit', doing:['closes']},
      {id:'wires', t:'the wires', doing:['connects','watches']},
      {id:'clips', t:'the crocodile clips', doing:['connects']}
    ],
    where:[
      {id:'table', t:'on the table', doing:['presses','watches','builds','connects','glows','lights','powers','closes']},
      {id:'wires', t:'through the wires', who:['electricity']},
      {id:'around', t:'around the circuit', who:['electricity']},
      {id:'classroom', t:'in the classroom', who:['boy','girl','bulb','battery','switch']},
      {id:'holder', t:'in the bulb holder', who:['bulb']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['boy','girl']},
      {id:'clever', t:'clever', who:['boy','girl']},
      {id:'bright', t:'bright', who:['bulb']},
      {id:'small', t:'small', who:['bulb','switch','battery']},
      {id:'black', t:'black', who:['switch','battery']},
      {id:'metal', t:'metal', who:['switch']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['presses','connects','builds']},
      {id:'firmly', t:'firmly', doing:['presses','connects']},
      {id:'brightly', t:'brightly', doing:['glows','lights']},
      {id:'closely', t:'closely', doing:['watches']},
      {id:'proudly', t:'proudly', doing:['smiles','watches']},
      {id:'quickly', t:'quickly', doing:['flows','builds','connects']}
    ],
    when:[
      {id:'science', t:'in science'},
      {id:'afternoon', t:'this afternoon'},
      {id:'today', t:'today'},
      {id:'last', t:'at last'}
    ]
  },
  {
    id:'band', title:'Sound and the school band (Y4)', img:'images/science-band.jpg',
    who:[
      {id:'drummer', det:'the', t:'drummer', person:true},
      {id:'trumpeter', det:'the', t:'trumpet player', person:true},
      {id:'xylo', det:'the', t:'xylophone player', person:true},
      {id:'teacher', det:'the', t:'teacher', person:true},
      {id:'drum', det:'the', t:'drum'},
      {id:'cymbal', det:'the', t:'cymbal'},
      {id:'sound', det:'the', t:'sound'}
    ],
    doing:[
      {id:'plays', t:'plays', needs:'what', who:['drummer','trumpeter','xylo']},
      {id:'hits', t:'hits', needs:'what', who:['drummer','xylo']},
      {id:'blows', t:'blows', needs:'what', who:['trumpeter']},
      {id:'listens', t:'listens to', needs:'what', who:['teacher']},
      {id:'smiles', t:'smiles', needs:'none', who:['teacher','drummer','trumpeter','xylo']},
      {id:'vibrates', t:'vibrates', needs:'none', who:['drum','cymbal']},
      {id:'booms', t:'booms', needs:'none', who:['drum']},
      {id:'crashes', t:'crashes', needs:'none', who:['cymbal']},
      {id:'travels', t:'travels', needs:'none', who:['sound']}
    ],
    what:[
      {id:'drums', t:'the drums', doing:['plays','hits'], who:['drummer']},
      {id:'cymbal', t:'the cymbal', doing:['hits'], who:['drummer']},
      {id:'trumpet', t:'the trumpet', doing:['plays','blows'], who:['trumpeter']},
      {id:'xylophone', t:'the xylophone', doing:['plays'], who:['xylo']},
      {id:'bars', t:'the wooden bars', doing:['hits'], who:['xylo']},
      {id:'tune', t:'a tune', doing:['plays'], who:['trumpeter','xylo']},
      {id:'band', t:'the band', doing:['listens']},
      {id:'music', t:'the music', doing:['listens']}
    ],
    where:[
      {id:'hall', t:'in the school hall'},
      {id:'side', t:'at the side', who:['teacher']},
      {id:'air', t:'through the air', who:['sound']},
      {id:'across', t:'across the hall', who:['sound']}
    ],
    describe:[
      {id:'talented', t:'talented', who:['drummer','trumpeter','xylo']},
      {id:'busy', t:'busy', who:['drummer','trumpeter','xylo']},
      {id:'proud', t:'proud', who:['teacher','drummer','trumpeter','xylo']},
      {id:'loud', t:'loud', who:['drum','cymbal','sound']},
      {id:'shiny', t:'shiny', who:['cymbal']},
      {id:'round', t:'round', who:['drum','cymbal']},
      {id:'deep', t:'deep', who:['sound']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['plays','hits','blows','booms','crashes']},
      {id:'quietly', t:'quietly', doing:['plays','listens','hits']},
      {id:'quickly', t:'quickly', doing:['vibrates','travels','hits']},
      {id:'carefully', t:'carefully', doing:['plays','hits','listens']},
      {id:'happily', t:'happily', doing:['smiles','plays']},
      {id:'gently', t:'gently', doing:['hits','plays','blows']}
    ],
    when:[
      {id:'assembly', t:'in assembly'},
      {id:'today', t:'today'},
      {id:'lunch', t:'after lunch'},
      {id:'friday', t:'every Friday'}
    ]
  },
  {
    id:'frog', title:'Frog life cycle (Y5)', img:'images/science-frog.jpg',
    who:[
      {id:'frog', det:'the', t:'frog'},
      {id:'froglet', det:'the', t:'froglet'},
      {id:'tadpole', det:'the', t:'tadpole'},
      {id:'frogspawn', det:'the', t:'frogspawn'}
    ],
    doing:[
      {id:'sits', t:'sits', needs:'none', who:['frog','froglet']},
      {id:'swims', t:'swims', needs:'none', who:['tadpole','frog','froglet']},
      {id:'wriggles', t:'wriggles', needs:'none', who:['tadpole']},
      {id:'floats', t:'floats', needs:'none', who:['frogspawn']},
      {id:'hatches', t:'hatches', needs:'none', who:['frogspawn']},
      {id:'grows', t:'grows', needs:'none', who:['tadpole','froglet']},
      {id:'changes', t:'changes', needs:'none', who:['tadpole','froglet']},
      {id:'eats', t:'eats', who:['tadpole','frog','froglet']},
      {id:'lays', t:'lays', needs:'what', who:['frog']},
      {id:'croaks', t:'croaks', needs:'none', who:['frog']},
      {id:'jumps', t:'jumps', needs:'none', who:['frog','froglet']}
    ],
    what:[
      {id:'algae', t:'algae', doing:['eats'], who:['tadpole']},
      {id:'pondweed', t:'pondweed', doing:['eats'], who:['tadpole']},
      {id:'fly', t:'a fly', doing:['eats'], who:['frog','froglet']},
      {id:'frogspawn', t:'frogspawn', doing:['lays'], who:['frog']}
    ],
    where:[
      {id:'pond', t:'in the pond', doing:['swims','wriggles','floats','hatches','grows','changes','eats','lays']},
      {id:'lilypad', t:'on a lily pad', who:['froglet','frog'], doing:['sits','croaks','eats','jumps']},
      {id:'stone', t:'on a mossy stone', who:['frog','froglet'], doing:['sits','croaks','eats']},
      {id:'shallow', t:'in the shallow water', who:['frogspawn','tadpole']},
      {id:'bank', t:'onto the bank', who:['frog','froglet'], doing:['jumps']},
      {id:'reeds', t:'among the reeds', who:['tadpole','frogspawn','frog','froglet'], doing:['swims','wriggles','floats','eats']}
    ],
    describe:[
      {id:'brown', t:'brown', who:['frog','froglet']},
      {id:'speckled', t:'speckled', who:['frog']},
      {id:'tiny', t:'tiny', who:['froglet','tadpole']},
      {id:'black', t:'black', who:['tadpole']},
      {id:'young', t:'young', who:['froglet','tadpole']},
      {id:'slippery', t:'slippery', who:['frogspawn','frog','tadpole']},
      {id:'clear', t:'clear', who:['frogspawn']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['grows','swims','floats','changes','hatches']},
      {id:'quickly', t:'quickly', doing:['swims','wriggles','jumps','eats']},
      {id:'quietly', t:'quietly', doing:['sits','floats']},
      {id:'loudly', t:'loudly', doing:['croaks']},
      {id:'gently', t:'gently', doing:['floats','swims']},
      {id:'hungrily', t:'hungrily', doing:['eats']}
    ],
    when:[
      {id:'spring', t:'in spring'},
      {id:'every', t:'every spring'},
      {id:'morning', t:'this morning'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'tug', title:'Tug of war forces (Y5)', img:'images/science-tug.jpg',
    who:[
      {id:'blue', det:'the', t:'blue team', person:true},
      {id:'red', det:'the', t:'red team', person:true},
      {id:'teacher', det:'the', t:'teacher', person:true},
      {id:'rope', det:'the', t:'rope'},
      {id:'ribbon', det:'the', t:'ribbon'}
    ],
    doing:[
      {id:'pulls', t:'pulls', who:['blue','red']},
      {id:'grips', t:'grips', needs:'what', who:['blue','red']},
      {id:'leans', t:'leans back', needs:'none', who:['blue','red']},
      {id:'digs', t:'digs in', needs:'none', who:['blue','red']},
      {id:'wins', t:'wins', needs:'none', who:['blue','red']},
      {id:'watches', t:'watches', needs:'what', who:['teacher']},
      {id:'cheers', t:'cheers', needs:'none', who:['teacher']},
      {id:'tightens', t:'tightens', needs:'none', who:['rope']},
      {id:'moves', t:'moves', needs:'none', who:['ribbon','rope']},
      {id:'still', t:'stays still', needs:'none', who:['ribbon','rope']}
    ],
    what:[
      {id:'rope', t:'the rope', doing:['pulls','grips','watches']},
      {id:'ribbon', t:'the ribbon', doing:['watches']},
      {id:'other', t:'the other team', doing:['pulls'], who:['blue','red']},
      {id:'teams', t:'the two teams', doing:['watches']}
    ],
    where:[
      {id:'line', t:'across the line', who:['blue','red','ribbon'], doing:['pulls','moves']},
      {id:'grass', t:'on the grass', who:['blue','red'], doing:['pulls','grips','leans','digs','wins']},
      {id:'field', t:'on the school field'},
      {id:'above', t:'above the white line', who:['ribbon']},
      {id:'side', t:'at the side', who:['teacher']},
      {id:'tored', t:'towards the red team', who:['ribbon','rope'], doing:['moves']},
      {id:'toblue', t:'towards the blue team', who:['ribbon','rope'], doing:['moves']}
    ],
    describe:[
      {id:'strong', t:'strong', who:['blue','red']},
      {id:'determined', t:'determined', who:['blue','red']},
      {id:'excited', t:'excited', who:['blue','red','teacher']},
      {id:'fair', t:'fair', who:['teacher']},
      {id:'thick', t:'thick', who:['rope']},
      {id:'tight', t:'tight', who:['rope']},
      {id:'red', t:'red', who:['ribbon']}
    ],
    how:[
      {id:'hard', t:'hard', doing:['pulls','grips']},
      {id:'firmly', t:'firmly', doing:['grips','pulls','digs']},
      {id:'together', t:'together', doing:['pulls','leans']},
      {id:'slowly', t:'slowly', doing:['moves','tightens']},
      {id:'steadily', t:'steadily', doing:['pulls','moves']},
      {id:'loudly', t:'loudly', doing:['cheers']},
      {id:'carefully', t:'carefully', doing:['watches']}
    ],
    when:[
      {id:'sports', t:'on sports day'},
      {id:'today', t:'today'},
      {id:'lunch', t:'after lunch'},
      {id:'whistle', t:'after the whistle'}
    ]
  },
  {
    id:'shadow', title:'Light and shadows (Y6)', img:'images/science-shadow.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'torch', det:'the', t:'torch'},
      {id:'light', det:'the', t:'light'},
      {id:'dinosaur', det:'the', t:'toy dinosaur'},
      {id:'mirror', det:'the', t:'mirror'},
      {id:'shadow', det:'the', t:'shadow'}
    ],
    doing:[
      {id:'holds', t:'holds', needs:'what', who:['girl','boy']},
      {id:'looks', t:'looks at', needs:'what', who:['girl','boy']},
      {id:'shines', t:'shines', needs:'none', who:['torch','light']},
      {id:'travels', t:'travels', needs:'none', who:['light']},
      {id:'blocks', t:'blocks', needs:'what', who:['dinosaur']},
      {id:'stands', t:'stands', needs:'none', who:['dinosaur']},
      {id:'reflects', t:'reflects', needs:'what', who:['mirror']},
      {id:'appears', t:'appears', needs:'none', who:['shadow']}
    ],
    what:[
      {id:'torch', t:'the torch', doing:['holds','looks'], who:['girl']},
      {id:'mirror', t:'a mirror', doing:['holds'], who:['boy']},
      {id:'light', t:'the light', doing:['blocks','reflects']},
      {id:'shadow', t:'the shadow', doing:['looks']},
      {id:'dinosaur', t:'the toy dinosaur', doing:['looks']}
    ],
    where:[
      {id:'line', t:'in a straight line', who:['light'], doing:['travels']},
      {id:'fromtorch', t:'from the torch', who:['light'], doing:['travels','shines']},
      {id:'screen', t:'on the white screen', who:['shadow']},
      {id:'behind', t:'behind the dinosaur', who:['shadow']},
      {id:'wall', t:'onto the wall', who:['mirror']},
      {id:'table', t:'on the table', who:['dinosaur'], doing:['stands']},
      {id:'dark', t:'in the dark classroom'}
    ],
    describe:[
      {id:'curious', t:'curious', who:['girl','boy']},
      {id:'bright', t:'bright', who:['torch','light']},
      {id:'dark', t:'dark', who:['shadow']},
      {id:'large', t:'large', who:['shadow']},
      {id:'opaque', t:'opaque', who:['dinosaur']},
      {id:'plastic', t:'plastic', who:['dinosaur']},
      {id:'small', t:'small', who:['dinosaur','mirror']},
      {id:'shiny', t:'shiny', who:['mirror']}
    ],
    how:[
      {id:'steadily', t:'steadily', doing:['holds','shines']},
      {id:'carefully', t:'carefully', doing:['holds','looks']},
      {id:'closely', t:'closely', doing:['looks']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'quickly', t:'quickly', doing:['travels']},
      {id:'clearly', t:'clearly', doing:['appears']}
    ],
    when:[
      {id:'science', t:'in science'},
      {id:'today', t:'today'},
      {id:'afternoon', t:'this afternoon'},
      {id:'lights', t:'with the lights off'}
    ]
  }
]});
