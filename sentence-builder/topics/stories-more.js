/* More Story pictures (narrative-adventure scenes). Added to the existing 'stories' topic.
 * Same schema as content.js — see the notes at the top of that file. */
TOPICS.find(t => t.id === 'stories').pictures.push(
  {
    id:'temple', title:'The hidden jungle temple', img:'images/story-temple.jpg',
    who:[
      {id:'explorer', det:'the', t:'explorer', person:true},
      {id:'monkey', det:'the', t:'monkey'},
      {id:'parrot', det:'the', t:'parrot'},
      {id:'waterfall', det:'the', t:'waterfall'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['explorer']},
      {id:'holds', t:'holds', needs:'what', who:['explorer']},
      {id:'explores', t:'explores', needs:'what', who:['explorer']},
      {id:'watches', t:'watches', needs:'what', who:['explorer','monkey']},
      {id:'sits', t:'sits', needs:'none', who:['monkey']},
      {id:'chatters', t:'chatters', needs:'none', who:['monkey','parrot']},
      {id:'flies', t:'flies', needs:'none', who:['parrot']},
      {id:'squawks', t:'squawks', needs:'none', who:['parrot']},
      {id:'tumbles', t:'tumbles', needs:'none', who:['waterfall']},
      {id:'splashes', t:'splashes', needs:'none', who:['waterfall']}
    ],
    what:[
      {id:'lantern', t:'a lantern', doing:['holds']},
      {id:'temple', t:'the ancient temple', doing:['explores','watches']},
      {id:'ruins', t:'the ruins', doing:['explores']},
      {id:'explorer', t:'the explorer', doing:['watches'], who:['monkey']},
      {id:'parrot', t:'the parrot', doing:['watches']},
      {id:'waterfall', t:'the waterfall', doing:['watches']}
    ],
    where:[
      {id:'towards', t:'towards the temple', doing:['walks']},
      {id:'steps', t:'up the stone steps', doing:['walks']},
      {id:'statue', t:'on the stone statue', who:['monkey'], doing:['sits','chatters','watches']},
      {id:'over', t:'over the jungle', doing:['flies','squawks']},
      {id:'rocks', t:'down the mossy rocks', doing:['tumbles','splashes']},
      {id:'jungle', t:'in the misty jungle'}
    ],
    describe:[
      {id:'brave', t:'brave', who:['explorer']},
      {id:'curious', t:'curious', who:['explorer','monkey']},
      {id:'tired', t:'tired', who:['explorer']},
      {id:'cheeky', t:'cheeky', who:['monkey']},
      {id:'colourful', t:'colourful', who:['parrot']},
      {id:'noisy', t:'noisy', who:['parrot','monkey','waterfall']},
      {id:'rushing', t:'rushing', who:['waterfall']},
      {id:'sparkling', t:'sparkling', who:['waterfall']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['walks','holds','explores','watches']},
      {id:'slowly', t:'slowly', doing:['walks','explores']},
      {id:'quietly', t:'quietly', doing:['walks','watches','sits']},
      {id:'noisily', t:'noisily', doing:['chatters','squawks','splashes','tumbles']},
      {id:'loudly', t:'loudly', doing:['chatters','squawks','splashes']},
      {id:'gracefully', t:'gracefully', doing:['flies']}
    ],
    when:[
      {id:'last', t:'at last'},
      {id:'dawn', t:'at dawn'},
      {id:'journey', t:'after a long journey'},
      {id:'suddenly', t:'suddenly'}
    ]
  },
  {
    id:'cottage', title:'The cottage in the wood', img:'images/story-cottage.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'wolf', det:'the', t:'wolf'},
      {id:'robin', det:'the', t:'robin'},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['girl']},
      {id:'carries', t:'carries', needs:'what', who:['girl']},
      {id:'watches', t:'watches', needs:'what', who:['wolf','robin','girl']},
      {id:'sits', t:'sits', needs:'none', who:['wolf','robin']},
      {id:'waits', t:'waits', needs:'none', who:['wolf']},
      {id:'sings', t:'sings', needs:'none', who:['robin']},
      {id:'curls', t:'curls', needs:'none', who:['smoke']},
      {id:'rises', t:'rises', needs:'none', who:['smoke']}
    ],
    what:[
      {id:'basket', t:'a wicker basket', doing:['carries']},
      {id:'girl', t:'the girl', doing:['watches'], who:['wolf','robin']},
      {id:'wolf', t:'the wolf', doing:['watches'], who:['robin']},
      {id:'cottage', t:'the cottage', doing:['watches']}
    ],
    where:[
      {id:'path', t:'along the path', doing:['walks','carries']},
      {id:'towards', t:'towards the cottage', doing:['walks']},
      {id:'trees', t:'under the tall trees', who:['wolf'], doing:['sits','waits','watches']},
      {id:'gate', t:'on the garden gate', who:['robin'], doing:['sits','sings','watches']},
      {id:'chimney', t:'from the chimney', doing:['curls','rises']},
      {id:'sky', t:'into the sky', doing:['curls','rises']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['girl']},
      {id:'curious', t:'curious', who:['girl','wolf']},
      {id:'grey', t:'grey', who:['wolf','smoke']},
      {id:'quiet', t:'quiet', who:['wolf','girl']},
      {id:'patient', t:'patient', who:['wolf']},
      {id:'little', t:'little', who:['robin']},
      {id:'cheerful', t:'cheerful', who:['robin']},
      {id:'wispy', t:'wispy', who:['smoke']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','rises','curls']},
      {id:'carefully', t:'carefully', doing:['carries','walks']},
      {id:'quietly', t:'quietly', doing:['watches','sits','waits','walks']},
      {id:'patiently', t:'patiently', doing:['waits','watches','sits']},
      {id:'sweetly', t:'sweetly', doing:['sings']},
      {id:'happily', t:'happily', doing:['sings','walks']}
    ],
    when:[
      {id:'autumn', t:'one autumn day'},
      {id:'last', t:'at last'},
      {id:'sunset', t:'before sunset'},
      {id:'every', t:'every afternoon'}
    ]
  },
  {
    id:'palace', title:'The ice palace', img:'images/story-palace.jpg',
    who:[
      {id:'queen', det:'the', t:'queen', person:true},
      {id:'fox', det:'the', t:'white fox'},
      {id:'palace', det:'the', t:'palace'},
      {id:'snow', det:'the', t:'snow'}
    ],
    doing:[
      {id:'stands', t:'stands', needs:'none', who:['queen']},
      {id:'looks', t:'looks at', needs:'what', who:['queen','fox']},
      {id:'wears', t:'wears', needs:'what', who:['queen']},
      {id:'rules', t:'rules', needs:'what', who:['queen']},
      {id:'sits', t:'sits', needs:'none', who:['fox']},
      {id:'waits', t:'waits', needs:'none', who:['queen','fox']},
      {id:'glitters', t:'glitters', needs:'none', who:['palace','snow']},
      {id:'glows', t:'glows', needs:'none', who:['palace']},
      {id:'falls', t:'falls', needs:'none', who:['snow']}
    ],
    what:[
      {id:'sky', t:'the night sky', doing:['looks']},
      {id:'lights', t:'the northern lights', doing:['looks']},
      {id:'palace', t:'the palace', doing:['looks']},
      {id:'fox', t:'the white fox', doing:['looks'], who:['queen']},
      {id:'queen', t:'the queen', doing:['looks'], who:['fox']},
      {id:'crown', t:'a silver crown', doing:['wears']},
      {id:'cloak', t:'a long cloak', doing:['wears']},
      {id:'land', t:'the frozen land', doing:['rules']}
    ],
    where:[
      {id:'steps', t:'on the icy steps', doing:['stands','sits','waits','falls']},
      {id:'outside', t:'outside the palace', who:['queen','fox'], doing:['stands','sits','waits','looks']},
      {id:'under', t:'under the northern lights'},
      {id:'over', t:'over the palace', doing:['falls']},
      {id:'snow', t:'in the snow', who:['fox'], doing:['sits','waits']}
    ],
    describe:[
      {id:'proud', t:'proud', who:['queen']},
      {id:'calm', t:'calm', who:['queen','fox']},
      {id:'graceful', t:'graceful', who:['queen']},
      {id:'loyal', t:'loyal', who:['fox']},
      {id:'fluffy', t:'fluffy', who:['fox']},
      {id:'soft', t:'soft', who:['snow']},
      {id:'glittering', t:'glittering', who:['palace','snow']},
      {id:'icy', t:'icy', who:['palace']}
    ],
    how:[
      {id:'calmly', t:'calmly', doing:['stands','waits','looks','sits']},
      {id:'proudly', t:'proudly', doing:['stands','wears','rules']},
      {id:'softly', t:'softly', doing:['falls','glows']},
      {id:'brightly', t:'brightly', doing:['glitters','glows']},
      {id:'silently', t:'silently', doing:['falls','sits','waits','looks']},
      {id:'wisely', t:'wisely', doing:['rules']}
    ],
    when:[
      {id:'midnight', t:'at midnight'},
      {id:'winter', t:'every winter'},
      {id:'tonight', t:'tonight'},
      {id:'all', t:'all night'}
    ]
  },
  {
    id:'ship', title:'Storm on the pirate ship', img:'images/story-ship.jpg',
    who:[
      {id:'captain', det:'the', t:'captain', person:true},
      {id:'sailor', det:'the', t:'sailor', person:true},
      {id:'parrot', det:'the', t:'parrot'},
      {id:'wave', det:'the', t:'wave'},
      {id:'wind', det:'the', t:'wind'}
    ],
    doing:[
      {id:'grips', t:'grips', needs:'what', who:['captain','sailor','parrot']},
      {id:'steers', t:'steers', needs:'what', who:['captain']},
      {id:'pulls', t:'pulls', needs:'what', who:['sailor']},
      {id:'shouts', t:'shouts', needs:'none', who:['captain','sailor']},
      {id:'clings', t:'clings', needs:'none', who:['parrot']},
      {id:'squawks', t:'squawks', needs:'none', who:['parrot']},
      {id:'crashes', t:'crashes', needs:'none', who:['wave']},
      {id:'howls', t:'howls', needs:'none', who:['wind']},
      {id:'tears', t:'tears', needs:'what', who:['wind']},
      {id:'rocks', t:'rocks', needs:'what', who:['wave','wind']}
    ],
    what:[
      {id:'wheel', t:'the wheel', doing:['grips'], who:['captain']},
      {id:'rope', t:'the rope', doing:['grips','pulls'], who:['sailor']},
      {id:'rail', t:'the rail', doing:['grips'], who:['parrot']},
      {id:'ship', t:'the ship', doing:['steers','rocks']},
      {id:'sails', t:'the sails', doing:['tears']}
    ],
    where:[
      {id:'deck', t:'on the deck', doing:['grips','pulls','shouts','squawks']},
      {id:'rail', t:'to the wooden rail', doing:['clings']},
      {id:'over', t:'over the deck', doing:['crashes']},
      {id:'against', t:'against the ship', doing:['crashes']},
      {id:'storm', t:'through the storm', doing:['steers']},
      {id:'sea', t:'across the sea', doing:['howls']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['captain','sailor']},
      {id:'fierce', t:'fierce', who:['captain','wave','wind']},
      {id:'young', t:'young', who:['sailor']},
      {id:'strong', t:'strong', who:['captain','sailor']},
      {id:'green', t:'green', who:['parrot']},
      {id:'wet', t:'wet', who:['captain','sailor','parrot']},
      {id:'huge', t:'huge', who:['wave']},
      {id:'icy', t:'icy', who:['wind']}
    ],
    how:[
      {id:'bravely', t:'bravely', doing:['steers','grips','pulls'], who:['captain','sailor']},
      {id:'loudly', t:'loudly', doing:['shouts','squawks','howls','crashes']},
      {id:'wildly', t:'wildly', doing:['crashes','howls','rocks']},
      {id:'tightly', t:'tightly', doing:['grips','clings']},
      {id:'fiercely', t:'fiercely', doing:['howls','crashes','tears']}
    ],
    when:[
      {id:'tonight', t:'tonight'},
      {id:'suddenly', t:'suddenly'},
      {id:'all', t:'all night'},
      {id:'midnight', t:'at midnight'}
    ]
  },
  {
    id:'dinos', title:'The valley of dinosaurs', img:'images/story-dinosaurs.jpg',
    who:[
      {id:'explorer', det:'the', t:'explorer', person:true},
      {id:'longneck', det:'the', t:'long-necked dinosaur'},
      {id:'tri', det:'the', t:'triceratops'},
      {id:'ptero', det:'the', t:'pterosaur'},
      {id:'volcano', det:'the', t:'volcano'}
    ],
    doing:[
      {id:'hides', t:'hides', needs:'none', who:['explorer']},
      {id:'crouches', t:'crouches', needs:'none', who:['explorer']},
      {id:'watches', t:'watches', needs:'what', who:['explorer']},
      {id:'looks', t:'looks through', needs:'what', who:['explorer']},
      {id:'eats', t:'eats', needs:'what', who:['longneck']},
      {id:'stretches', t:'stretches', needs:'none', who:['longneck']},
      {id:'drinks', t:'drinks', needs:'none', who:['tri']},
      {id:'glides', t:'glides', needs:'none', who:['ptero']},
      {id:'smokes', t:'smokes', needs:'none', who:['volcano']},
      {id:'rumbles', t:'rumbles', needs:'none', who:['volcano']}
    ],
    what:[
      {id:'longneck', t:'the long-necked dinosaur', doing:['watches']},
      {id:'tri', t:'the triceratops', doing:['watches']},
      {id:'ptero', t:'the pterosaur', doing:['watches']},
      {id:'valley', t:'the valley', doing:['watches']},
      {id:'binoculars', t:'the binoculars', doing:['looks']},
      {id:'leaves', t:'the leaves', doing:['eats']}
    ],
    where:[
      {id:'rocks', t:'behind the rocks', who:['explorer'], doing:['hides','crouches','watches','looks']},
      {id:'river', t:'from the river', doing:['drinks']},
      {id:'treetops', t:'up to the treetops', doing:['stretches']},
      {id:'over', t:'over the valley', doing:['glides']},
      {id:'distance', t:'in the distance', who:['volcano','longneck']},
      {id:'valley', t:'in the valley', doing:['eats','drinks','stretches']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['explorer']},
      {id:'careful', t:'careful', who:['explorer']},
      {id:'huge', t:'huge', who:['longneck','tri']},
      {id:'gentle', t:'gentle', who:['longneck','tri']},
      {id:'hungry', t:'hungry', who:['longneck']},
      {id:'thirsty', t:'thirsty', who:['tri']},
      {id:'graceful', t:'graceful', who:['ptero']},
      {id:'distant', t:'distant', who:['volcano']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['hides','crouches','watches','glides']},
      {id:'slowly', t:'slowly', doing:['eats','drinks','stretches','glides']},
      {id:'carefully', t:'carefully', doing:['watches','looks']},
      {id:'gracefully', t:'gracefully', doing:['glides']},
      {id:'peacefully', t:'peacefully', doing:['eats','drinks']},
      {id:'gently', t:'gently', doing:['rumbles','smokes']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'morning', t:'all morning'},
      {id:'trek', t:'after a long trek'},
      {id:'last', t:'at last'}
    ]
  },
  {
    id:'future', title:'The city of the future', img:'images/story-future.jpg',
    who:[
      {id:'robot', det:'the', t:'robot'},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'car', det:'the', t:'flying car'},
      {id:'drone', det:'the', t:'drone'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['robot','boy']},
      {id:'carries', t:'carries', needs:'what', who:['robot']},
      {id:'smiles', t:'smiles', needs:'none', who:['boy']},
      {id:'looks', t:'looks at', needs:'what', who:['boy','robot']},
      {id:'glides', t:'glides', needs:'none', who:['car','drone']},
      {id:'hovers', t:'hovers', needs:'none', who:['drone']},
      {id:'zooms', t:'zooms', needs:'none', who:['car']},
      {id:'hums', t:'hums', needs:'none', who:['drone','robot']},
      {id:'sets', t:'sets', needs:'none', who:['sun']}
    ],
    what:[
      {id:'shopping', t:'the shopping', doing:['carries']},
      {id:'bag', t:'a heavy bag', doing:['carries']},
      {id:'robot', t:'the robot', doing:['looks'], who:['boy']},
      {id:'boy', t:'the boy', doing:['looks'], who:['robot']},
      {id:'cars', t:'the flying cars', doing:['looks']},
      {id:'city', t:'the glittering city', doing:['looks']}
    ],
    where:[
      {id:'walkway', t:'along the walkway', doing:['walks','carries']},
      {id:'towers', t:'between the towers', doing:['glides','zooms']},
      {id:'sky', t:'through the sky', doing:['glides','zooms']},
      {id:'beside', t:'beside the walkway', doing:['hovers']},
      {id:'behind', t:'behind the towers', doing:['sets']},
      {id:'city', t:'in the city', who:['robot','boy','car','drone']}
    ],
    describe:[
      {id:'shiny', t:'shiny', who:['robot','car','drone']},
      {id:'silver', t:'silver', who:['robot','car']},
      {id:'helpful', t:'helpful', who:['robot','drone']},
      {id:'friendly', t:'friendly', who:['robot','boy']},
      {id:'happy', t:'happy', who:['boy']},
      {id:'sleek', t:'sleek', who:['car']},
      {id:'buzzing', t:'buzzing', who:['drone']},
      {id:'golden', t:'golden', who:['sun']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','sets','glides']},
      {id:'carefully', t:'carefully', doing:['carries','walks']},
      {id:'happily', t:'happily', doing:['smiles','walks','looks']},
      {id:'quickly', t:'quickly', doing:['zooms','glides']},
      {id:'quietly', t:'quietly', doing:['hums','hovers','glides','walks']},
      {id:'smoothly', t:'smoothly', doing:['glides','hovers','zooms']}
    ],
    when:[
      {id:'oneday', t:'one day'},
      {id:'evening', t:'this evening'},
      {id:'every', t:'every evening'},
      {id:'year', t:'in the year 3000'}
    ]
  },
  {
    id:'sub', title:'The underwater city', img:'images/story-submarine.jpg',
    who:[
      {id:'sub', det:'the', t:'submarine'},
      {id:'diver', det:'the', t:'diver', person:true},
      {id:'turtle', det:'the', t:'sea turtle'},
      {id:'shoal', det:'the', t:'shoal of fish'}
    ],
    doing:[
      {id:'explores', t:'explores', needs:'what', who:['sub','diver']},
      {id:'shines', t:'shines', needs:'none', who:['sub']},
      {id:'hums', t:'hums', needs:'none', who:['sub']},
      {id:'swims', t:'swims', needs:'none', who:['diver','turtle','shoal']},
      {id:'glides', t:'glides', needs:'none', who:['turtle','sub']},
      {id:'swirls', t:'swirls', needs:'none', who:['shoal']},
      {id:'looks', t:'looks at', needs:'what', who:['diver','turtle']}
    ],
    what:[
      {id:'ruins', t:'the ruins', doing:['explores','looks']},
      {id:'city', t:'the underwater city', doing:['explores']},
      {id:'statue', t:'the stone statue', doing:['looks']},
      {id:'sub', t:'the submarine', doing:['looks']},
      {id:'turtle', t:'the sea turtle', doing:['looks'], who:['diver']}
    ],
    where:[
      {id:'columns', t:'past the columns', doing:['swims','glides']},
      {id:'beside', t:'beside the submarine', who:['diver'], doing:['swims']},
      {id:'through', t:'through the ruins', doing:['swims','glides']},
      {id:'above', t:'above the ruins', doing:['glides']},
      {id:'around', t:'around the columns', doing:['swirls','swims']},
      {id:'floor', t:'across the sea floor', doing:['shines']},
      {id:'deep', t:'deep under the sea'}
    ],
    describe:[
      {id:'yellow', t:'yellow', who:['sub']},
      {id:'round', t:'round', who:['sub']},
      {id:'brave', t:'brave', who:['diver']},
      {id:'curious', t:'curious', who:['diver','turtle']},
      {id:'ancient', t:'ancient', who:['turtle']},
      {id:'gentle', t:'gentle', who:['turtle']},
      {id:'silver', t:'silver', who:['shoal']},
      {id:'shimmering', t:'shimmering', who:['shoal']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['explores','glides','swims']},
      {id:'gracefully', t:'gracefully', doing:['glides','swims','swirls']},
      {id:'carefully', t:'carefully', doing:['explores','looks']},
      {id:'quietly', t:'quietly', doing:['hums','glides','swims']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'quickly', t:'quickly', doing:['swirls','swims']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'last', t:'at last'},
      {id:'first', t:'for the first time'},
      {id:'all', t:'all day'}
    ]
  },
  {
    id:'balloon', title:'The hot-air balloon', img:'images/story-balloon.jpg',
    who:[
      {id:'balloon', det:'the', t:'balloon'},
      {id:'pilot', det:'the', t:'pilot', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'eagle', det:'the', t:'eagle'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'floats', t:'floats', needs:'none', who:['balloon']},
      {id:'drifts', t:'drifts', needs:'none', who:['balloon']},
      {id:'through', t:'looks through', needs:'what', who:['pilot']},
      {id:'looks', t:'looks at', needs:'what', who:['pilot','dog','eagle']},
      {id:'peers', t:'peers', needs:'none', who:['dog']},
      {id:'barks', t:'barks', needs:'none', who:['dog']},
      {id:'soars', t:'soars', needs:'none', who:['eagle']},
      {id:'rises', t:'rises', needs:'none', who:['sun','balloon']},
      {id:'glows', t:'glows', needs:'none', who:['sun']}
    ],
    what:[
      {id:'telescope', t:'a brass telescope', doing:['through']},
      {id:'mountains', t:'the mountains', doing:['looks']},
      {id:'lake', t:'the lake', doing:['looks']},
      {id:'balloon', t:'the balloon', doing:['looks'], who:['eagle']},
      {id:'eagle', t:'the eagle', doing:['looks'], who:['pilot','dog']}
    ],
    where:[
      {id:'mountains', t:'over the mountains', doing:['floats','drifts','soars','rises']},
      {id:'clouds', t:'above the clouds', doing:['floats','drifts','soars']},
      {id:'beside', t:'beside the balloon', who:['eagle'], doing:['soars']},
      {id:'basket', t:'in the basket', who:['pilot','dog'], doing:['barks','looks','through']},
      {id:'edge', t:'over the edge of the basket', doing:['peers']},
      {id:'sky', t:'in the sky', who:['balloon','eagle','sun']}
    ],
    describe:[
      {id:'striped', t:'striped', who:['balloon']},
      {id:'colourful', t:'colourful', who:['balloon']},
      {id:'curious', t:'curious', who:['pilot','dog']},
      {id:'adventurous', t:'adventurous', who:['pilot']},
      {id:'excited', t:'excited', who:['dog','pilot']},
      {id:'fluffy', t:'fluffy', who:['dog']},
      {id:'golden', t:'golden', who:['eagle','sun']},
      {id:'mighty', t:'mighty', who:['eagle']}
    ],
    how:[
      {id:'gently', t:'gently', doing:['floats','drifts','rises']},
      {id:'slowly', t:'slowly', doing:['floats','drifts','rises']},
      {id:'excitedly', t:'excitedly', doing:['barks','peers','looks'], who:['pilot','dog']},
      {id:'carefully', t:'carefully', doing:['through','looks']},
      {id:'proudly', t:'proudly', doing:['soars']},
      {id:'brightly', t:'brightly', doing:['glows']}
    ],
    when:[
      {id:'early', t:'early this morning'},
      {id:'last', t:'at last'},
      {id:'all', t:'all day'},
      {id:'hours', t:'for hours'}
    ]
  },
  {
    id:'garden', title:'The secret garden', img:'images/story-garden.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'door', det:'the', t:'door'},
      {id:'robin', det:'the', t:'robin'},
      {id:'butterfly', det:'the', t:'butterfly'},
      {id:'fountain', det:'the', t:'fountain'}
    ],
    doing:[
      {id:'opens', t:'opens', needs:'what', who:['boy']},
      {id:'holds', t:'holds', needs:'what', who:['boy']},
      {id:'peers', t:'peers', needs:'none', who:['boy']},
      {id:'looks', t:'looks at', needs:'what', who:['boy']},
      {id:'creaks', t:'creaks', needs:'none', who:['door']},
      {id:'sings', t:'sings', needs:'none', who:['robin']},
      {id:'sits', t:'sits', needs:'none', who:['robin']},
      {id:'watches', t:'watches', needs:'what', who:['robin']},
      {id:'flutters', t:'flutters', needs:'none', who:['butterfly']},
      {id:'trickles', t:'trickles', needs:'none', who:['fountain']}
    ],
    what:[
      {id:'door', t:'the old door', doing:['opens']},
      {id:'key', t:'an iron key', doing:['holds']},
      {id:'roses', t:'the roses', doing:['looks']},
      {id:'fountain', t:'the fountain', doing:['looks']},
      {id:'boy', t:'the boy', doing:['watches']}
    ],
    where:[
      {id:'into', t:'into the secret garden', doing:['peers']},
      {id:'doorway', t:'through the doorway', doing:['peers','flutters']},
      {id:'wall', t:'on top of the wall', who:['robin'], doing:['sits','sings','watches']},
      {id:'roses', t:'over the roses', doing:['flutters']},
      {id:'garden', t:'in the secret garden', who:['fountain','butterfly']},
      {id:'brick', t:'in the old brick wall', who:['door']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['boy']},
      {id:'quiet', t:'quiet', who:['boy']},
      {id:'wooden', t:'wooden', who:['door']},
      {id:'creaky', t:'creaky', who:['door']},
      {id:'old', t:'old', who:['door','fountain']},
      {id:'little', t:'little', who:['robin','butterfly']},
      {id:'delicate', t:'delicate', who:['butterfly']},
      {id:'mossy', t:'mossy', who:['fountain']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['opens','creaks','flutters']},
      {id:'carefully', t:'carefully', doing:['opens','holds','peers']},
      {id:'quietly', t:'quietly', doing:['peers','trickles','looks','watches','sits']},
      {id:'sweetly', t:'sweetly', doing:['sings']},
      {id:'gently', t:'gently', doing:['trickles','flutters']},
      {id:'curiously', t:'curiously', doing:['peers','watches','looks']}
    ],
    when:[
      {id:'summer', t:'one summer morning'},
      {id:'last', t:'at last'},
      {id:'first', t:'for the first time'},
      {id:'early', t:'early one morning'}
    ]
  },
  {
    id:'train', title:'The snowy viaduct', img:'images/story-train.jpg',
    who:[
      {id:'train', det:'the', t:'steam train'},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'deer', det:'the', t:'deer'},
      {id:'steam', det:'the', t:'steam'},
      {id:'snow', det:'the', t:'snow'}
    ],
    doing:[
      {id:'crosses', t:'crosses', needs:'what', who:['train']},
      {id:'puffs', t:'puffs', needs:'none', who:['train']},
      {id:'rumbles', t:'rumbles', needs:'none', who:['train']},
      {id:'out', t:'looks out of', needs:'what', who:['girl']},
      {id:'waves', t:'waves', needs:'none', who:['girl']},
      {id:'watches', t:'watches', needs:'what', who:['deer','girl']},
      {id:'stands', t:'stands', needs:'none', who:['deer']},
      {id:'billows', t:'billows', needs:'none', who:['steam']},
      {id:'falls', t:'falls', needs:'none', who:['snow']}
    ],
    what:[
      {id:'viaduct', t:'the stone viaduct', doing:['crosses']},
      {id:'window', t:'the window', doing:['out']},
      {id:'train', t:'the train', doing:['watches'], who:['deer']},
      {id:'deer', t:'the deer', doing:['watches'], who:['girl']},
      {id:'valley', t:'the snowy valley', doing:['watches']}
    ],
    where:[
      {id:'across', t:'across the viaduct', doing:['puffs','rumbles']},
      {id:'sky', t:'into the sky', doing:['billows']},
      {id:'snow', t:'in the snow', who:['deer'], doing:['stands','watches']},
      {id:'below', t:'below the viaduct', who:['deer']},
      {id:'over', t:'over the valley', doing:['falls','billows']},
      {id:'through', t:'through the snowy valley', doing:['rumbles','puffs']},
      {id:'carriage', t:'from the carriage', who:['girl'], doing:['waves','watches']}
    ],
    describe:[
      {id:'old', t:'old', who:['train']},
      {id:'green', t:'green', who:['train']},
      {id:'excited', t:'excited', who:['girl']},
      {id:'curious', t:'curious', who:['girl','deer']},
      {id:'gentle', t:'gentle', who:['deer']},
      {id:'white', t:'white', who:['steam','snow']},
      {id:'soft', t:'soft', who:['snow']},
      {id:'thick', t:'thick', who:['steam']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['crosses','puffs','rumbles','billows','falls']},
      {id:'noisily', t:'noisily', doing:['puffs','rumbles']},
      {id:'softly', t:'softly', doing:['falls']},
      {id:'happily', t:'happily', doing:['waves','watches','out'], who:['girl']},
      {id:'quietly', t:'quietly', doing:['stands','watches']},
      {id:'curiously', t:'curiously', doing:['watches','out']}
    ],
    when:[
      {id:'dusk', t:'at dusk'},
      {id:'every', t:'every evening'},
      {id:'night', t:'on a winter night'},
      {id:'journey', t:'after a long journey'}
    ]
  }
);
