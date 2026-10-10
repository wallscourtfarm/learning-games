/* Sentence Builder — Settings word banks (descriptive writing). Same schema as content.js. */
TOPICS.push({
  id:'settings', label:'Settings', years:'All years', pictures:[
  {
    id:'house', title:'The abandoned house', img:'images/settings-house.jpg',
    who:[
      {id:'owl', det:'the', t:'owl'},
      {id:'door', det:'the', t:'door'},
      {id:'lantern', det:'the', t:'lantern'},
      {id:'wind', det:'the', t:'wind'},
      {id:'ivy', det:'the', t:'ivy'}
    ],
    doing:[
      {id:'hoots', t:'hoots', needs:'none', who:['owl']},
      {id:'watches', t:'watches', needs:'what', who:['owl']},
      {id:'creaks', t:'creaks', needs:'none', who:['door']},
      {id:'swings', t:'swings', needs:'none', who:['door']},
      {id:'glows', t:'glows', needs:'none', who:['lantern']},
      {id:'flickers', t:'flickers', needs:'none', who:['lantern']},
      {id:'howls', t:'howls', needs:'none', who:['wind']},
      {id:'whistles', t:'whistles', needs:'none', who:['wind']},
      {id:'shakes', t:'shakes', needs:'what', who:['wind']},
      {id:'climbs', t:'climbs', needs:'none', who:['ivy']},
      {id:'covers', t:'covers', needs:'what', who:['ivy']}
    ],
    what:[
      {id:'path', t:'the path', doing:['watches']},
      {id:'door', t:'the door', doing:['watches','shakes','covers']},
      {id:'windows', t:'the broken windows', doing:['watches','shakes','covers']},
      {id:'walls', t:'the walls', doing:['covers']},
      {id:'branches', t:'the bare branches', doing:['shakes']}
    ],
    where:[
      {id:'branch', t:'on a bare branch', who:['owl']},
      {id:'bydoor', t:'by the door', who:['lantern']},
      {id:'trees', t:'through the trees', doing:['howls','whistles']},
      {id:'up', t:'up the crumbling walls', doing:['climbs']},
      {id:'wood', t:'in the dark wood'},
      {id:'outside', t:'outside the old house', who:['owl','lantern','wind']}
    ],
    describe:[
      {id:'silent', t:'silent', who:['owl']},
      {id:'shadowy', t:'shadowy', who:['owl','ivy']},
      {id:'creaking', t:'creaking', who:['door']},
      {id:'rotten', t:'rotten', who:['door']},
      {id:'rusty', t:'rusty', who:['lantern']},
      {id:'ancient', t:'ancient', who:['door','lantern']},
      {id:'icy', t:'icy', who:['wind']},
      {id:'tangled', t:'tangled', who:['ivy']}
    ],
    how:[
      {id:'softly', t:'softly', doing:['hoots','creaks','glows','whistles']},
      {id:'slowly', t:'slowly', doing:['swings','creaks','climbs','covers']},
      {id:'eerily', t:'eerily', doing:['hoots','creaks','howls','whistles']},
      {id:'faintly', t:'faintly', doing:['glows','flickers','hoots']},
      {id:'fiercely', t:'fiercely', doing:['howls','shakes']},
      {id:'silently', t:'silently', doing:['watches','climbs','swings']}
    ],
    when:[
      {id:'dusk', t:'at dusk'},
      {id:'every', t:'every night'},
      {id:'sunset', t:'after sunset'},
      {id:'moon', t:'when the moon rises'}
    ]
  },
  {
    id:'village', title:'Snowy mountain village', img:'images/settings-village.jpg',
    who:[
      {id:'villager', det:'the', t:'villager', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'snow', det:'the', t:'snow'},
      {id:'moon', det:'the', t:'moon'},
      {id:'bell', det:'the', t:'church bell'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['villager','dog']},
      {id:'trudges', t:'trudges', needs:'none', who:['villager']},
      {id:'carries', t:'carries', needs:'what', who:['villager']},
      {id:'follows', t:'follows', needs:'what', who:['dog']},
      {id:'sniffs', t:'sniffs', needs:'what', who:['dog']},
      {id:'falls', t:'falls', needs:'none', who:['snow']},
      {id:'covers', t:'covers', needs:'what', who:['snow']},
      {id:'shines', t:'shines', needs:'none', who:['moon']},
      {id:'rings', t:'rings', needs:'none', who:['bell']}
    ],
    what:[
      {id:'lantern', t:'a lantern', doing:['carries']},
      {id:'villager', t:'the villager', doing:['follows']},
      {id:'roofs', t:'the roofs', doing:['covers']},
      {id:'lane', t:'the lane', doing:['covers']},
      {id:'snow', t:'the snow', doing:['sniffs']},
      {id:'fence', t:'the fence', doing:['covers','sniffs']}
    ],
    where:[
      {id:'lane', t:'along the snowy lane', doing:['walks','trudges','follows','sniffs','carries']},
      {id:'cottages', t:'past the cottages', doing:['walks','trudges','follows','carries']},
      {id:'over', t:'over the village', doing:['falls','shines']},
      {id:'tower', t:'in the tower', who:['bell']},
      {id:'mountains', t:'above the mountains', who:['moon']}
    ],
    describe:[
      {id:'weary', t:'weary', who:['villager']},
      {id:'loyal', t:'loyal', who:['dog']},
      {id:'shaggy', t:'shaggy', who:['dog']},
      {id:'powdery', t:'powdery', who:['snow']},
      {id:'glittering', t:'glittering', who:['snow']},
      {id:'full', t:'full', who:['moon']},
      {id:'silver', t:'silver', who:['moon']},
      {id:'ancient', t:'ancient', who:['bell']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','trudges','falls','follows','covers']},
      {id:'softly', t:'softly', doing:['falls','walks','rings','covers']},
      {id:'silently', t:'silently', doing:['falls','shines','walks','follows','covers']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'carefully', t:'carefully', doing:['carries','walks','sniffs']},
      {id:'loudly', t:'loudly', doing:['rings']}
    ],
    when:[
      {id:'midnight', t:'at midnight'},
      {id:'winter', t:'every winter'},
      {id:'all', t:'all night'},
      {id:'dawn', t:'before dawn'}
    ]
  },
  {
    id:'city', title:'Rainy city street', img:'images/settings-city.jpg',
    who:[
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'cat', det:'the', t:'cat'},
      {id:'bus', det:'the', t:'bus'},
      {id:'rain', det:'the', t:'rain'},
      {id:'lamp', det:'the', t:'street lamp'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['woman']},
      {id:'holds', t:'holds', needs:'what', who:['woman']},
      {id:'watches', t:'watches', needs:'what', who:['woman','cat']},
      {id:'shelters', t:'shelters', needs:'none', who:['cat']},
      {id:'rumbles', t:'rumbles', needs:'none', who:['bus']},
      {id:'splashes', t:'splashes', needs:'none', who:['bus']},
      {id:'pours', t:'pours', needs:'none', who:['rain']},
      {id:'drums', t:'drums', needs:'none', who:['rain']},
      {id:'glows', t:'glows', needs:'none', who:['lamp']},
      {id:'shines', t:'shines', needs:'none', who:['lamp']}
    ],
    what:[
      {id:'umbrella', t:'a red umbrella', doing:['holds']},
      {id:'bag', t:'a bag', doing:['holds']},
      {id:'bus', t:'the bus', doing:['watches']},
      {id:'rain', t:'the rain', doing:['watches']},
      {id:'woman', t:'the woman', doing:['watches'], who:['cat']}
    ],
    where:[
      {id:'pavement', t:'along the wet pavement', doing:['walks']},
      {id:'doorway', t:'in a doorway', who:['cat']},
      {id:'street', t:'down the street', doing:['rumbles','splashes','walks']},
      {id:'puddles', t:'through the puddles', doing:['splashes','walks']},
      {id:'umbrella', t:'on the umbrella', doing:['drums']},
      {id:'city', t:'over the city', doing:['pours']},
      {id:'shop', t:'by the shop window', who:['woman','cat']},
      {id:'above', t:'above the pavement', who:['lamp']}
    ],
    describe:[
      {id:'thoughtful', t:'thoughtful', who:['woman']},
      {id:'fluffy', t:'fluffy', who:['cat']},
      {id:'patient', t:'patient', who:['cat']},
      {id:'red', t:'red', who:['bus']},
      {id:'gleaming', t:'gleaming', who:['bus','lamp']},
      {id:'steady', t:'steady', who:['rain']},
      {id:'icy', t:'icy', who:['rain']},
      {id:'tall', t:'tall', who:['lamp']}
    ],
    how:[
      {id:'briskly', t:'briskly', doing:['walks']},
      {id:'patiently', t:'patiently', doing:['shelters','watches']},
      {id:'noisily', t:'noisily', doing:['rumbles','splashes','drums']},
      {id:'steadily', t:'steadily', doing:['pours','drums','glows']},
      {id:'warmly', t:'warmly', doing:['glows','shines']},
      {id:'tightly', t:'tightly', doing:['holds']}
    ],
    when:[
      {id:'evening', t:'every evening'},
      {id:'dark', t:'after dark'},
      {id:'all', t:'all night'},
      {id:'late', t:'late at night'}
    ]
  },
  {
    id:'waterfall', title:'Rainforest waterfall', img:'images/settings-waterfall.jpg',
    who:[
      {id:'waterfall', det:'the', t:'waterfall'},
      {id:'parrot', det:'the', t:'parrot'},
      {id:'jaguar', det:'the', t:'jaguar'},
      {id:'mist', det:'the', t:'mist'},
      {id:'sunlight', det:'the', t:'sunlight'}
    ],
    doing:[
      {id:'tumbles', t:'tumbles', needs:'none', who:['waterfall']},
      {id:'roars', t:'roars', needs:'none', who:['waterfall']},
      {id:'thunders', t:'thunders', needs:'none', who:['waterfall']},
      {id:'perches', t:'perches', needs:'none', who:['parrot']},
      {id:'squawks', t:'squawks', needs:'none', who:['parrot']},
      {id:'watches', t:'watches', needs:'what', who:['parrot','jaguar']},
      {id:'drinks', t:'drinks', who:['jaguar']},
      {id:'prowls', t:'prowls', needs:'none', who:['jaguar']},
      {id:'rises', t:'rises', needs:'none', who:['mist']},
      {id:'drifts', t:'drifts', needs:'none', who:['mist']},
      {id:'shines', t:'shines', needs:'none', who:['sunlight']},
      {id:'streams', t:'streams', needs:'none', who:['sunlight']}
    ],
    what:[
      {id:'water', t:'the cool water', doing:['drinks']},
      {id:'jaguar', t:'the jaguar', doing:['watches'], who:['parrot']},
      {id:'parrot', t:'the parrot', doing:['watches'], who:['jaguar']},
      {id:'waterfall', t:'the waterfall', doing:['watches']}
    ],
    where:[
      {id:'rocks', t:'over the mossy rocks', who:['waterfall']},
      {id:'into', t:'into the pool', doing:['tumbles']},
      {id:'branch', t:'on a mossy branch', who:['parrot']},
      {id:'from', t:'from the pool', doing:['drinks','rises']},
      {id:'edge', t:'at the edge of the pool', who:['jaguar']},
      {id:'trees', t:'through the trees', doing:['streams','shines','drifts','prowls']},
      {id:'forest', t:'in the rainforest'}
    ],
    describe:[
      {id:'thundering', t:'thundering', who:['waterfall']},
      {id:'foaming', t:'foaming', who:['waterfall']},
      {id:'scarlet', t:'scarlet', who:['parrot']},
      {id:'colourful', t:'colourful', who:['parrot']},
      {id:'spotted', t:'spotted', who:['jaguar']},
      {id:'sleek', t:'sleek', who:['jaguar']},
      {id:'cool', t:'cool', who:['mist']},
      {id:'golden', t:'golden', who:['sunlight']}
    ],
    how:[
      {id:'endlessly', t:'endlessly', doing:['tumbles','roars','thunders']},
      {id:'loudly', t:'loudly', doing:['roars','thunders','squawks']},
      {id:'quietly', t:'quietly', doing:['drinks','prowls','watches','perches']},
      {id:'gently', t:'gently', doing:['drifts','rises','shines','streams']},
      {id:'proudly', t:'proudly', doing:['perches']},
      {id:'warmly', t:'warmly', doing:['shines']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'morning', t:'every morning'},
      {id:'rain', t:'after the rain'},
      {id:'day', t:'all day'}
    ]
  },
  {
    id:'reef', title:'The coral reef', img:'images/settings-reef.jpg',
    who:[
      {id:'turtle', det:'the', t:'turtle'},
      {id:'diver', det:'the', t:'diver', person:true},
      {id:'shoal', det:'the', t:'shoal of fish'},
      {id:'octopus', det:'the', t:'octopus'},
      {id:'sunlight', det:'the', t:'sunlight'}
    ],
    doing:[
      {id:'glides', t:'glides', needs:'none', who:['turtle']},
      {id:'swims', t:'swims', needs:'none', who:['turtle','diver','shoal']},
      {id:'darts', t:'darts', needs:'none', who:['shoal']},
      {id:'watches', t:'watches', needs:'what', who:['diver','turtle','octopus']},
      {id:'follows', t:'follows', needs:'what', who:['diver','turtle']},
      {id:'explores', t:'explores', needs:'what', who:['diver','turtle']},
      {id:'hides', t:'hides', needs:'none', who:['octopus']},
      {id:'ripples', t:'ripples', needs:'none', who:['sunlight']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['sunlight']}
    ],
    what:[
      {id:'turtle', t:'the turtle', doing:['watches','follows'], who:['diver','octopus']},
      {id:'diver', t:'the diver', doing:['watches'], who:['turtle','octopus']},
      {id:'shoal', t:'the shoal of fish', doing:['watches','follows']},
      {id:'reef', t:'the reef', doing:['explores','watches']},
      {id:'coral', t:'the coral', doing:['explores','watches']}
    ],
    where:[
      {id:'coral', t:'over the coral', doing:['glides','swims','darts','ripples']},
      {id:'rocks', t:'among the rocks', who:['octopus']},
      {id:'below', t:'below the surface', who:['turtle','diver','shoal','octopus']},
      {id:'water', t:'through the blue water', doing:['glides','swims','darts','ripples']},
      {id:'past', t:'past the diver', doing:['glides','swims','darts'], who:['turtle','shoal']}
    ],
    describe:[
      {id:'ancient', t:'ancient', who:['turtle']},
      {id:'graceful', t:'graceful', who:['turtle']},
      {id:'curious', t:'curious', who:['diver','octopus','turtle']},
      {id:'careful', t:'careful', who:['diver']},
      {id:'shy', t:'shy', who:['octopus']},
      {id:'speckled', t:'speckled', who:['octopus','turtle']},
      {id:'shimmering', t:'shimmering', who:['sunlight','shoal']},
      {id:'golden', t:'golden', who:['shoal','sunlight']}
    ],
    how:[
      {id:'gracefully', t:'gracefully', doing:['glides','swims']},
      {id:'slowly', t:'slowly', doing:['glides','swims','follows','explores']},
      {id:'quickly', t:'quickly', doing:['darts','swims','hides']},
      {id:'quietly', t:'quietly', doing:['watches','follows','hides','explores']},
      {id:'gently', t:'gently', doing:['ripples','sparkles','glides']},
      {id:'curiously', t:'curiously', doing:['watches','explores']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'midday', t:'at midday'},
      {id:'day', t:'all day long'},
      {id:'tide', t:'at high tide'}
    ]
  },
  {
    id:'desert', title:'Desert at sunset', img:'images/settings-desert.jpg',
    who:[
      {id:'camel', det:'the', t:'camel'},
      {id:'traveller', det:'the', t:'traveller', person:true},
      {id:'sun', det:'the', t:'sun'},
      {id:'wind', det:'the', t:'wind'},
      {id:'oasis', det:'the', t:'oasis'}
    ],
    doing:[
      {id:'plods', t:'plods', needs:'none', who:['camel']},
      {id:'walks', t:'walks', needs:'none', who:['camel','traveller']},
      {id:'carries', t:'carries', needs:'what', who:['camel']},
      {id:'leads', t:'leads', needs:'what', who:['traveller']},
      {id:'spots', t:'spots', needs:'what', who:['traveller']},
      {id:'sinks', t:'sinks', needs:'none', who:['sun']},
      {id:'glows', t:'glows', needs:'none', who:['sun']},
      {id:'blows', t:'blows', who:['wind']},
      {id:'whistles', t:'whistles', needs:'none', who:['wind']},
      {id:'shimmers', t:'shimmers', needs:'none', who:['oasis']}
    ],
    what:[
      {id:'camel', t:'the camel', doing:['leads']},
      {id:'bags', t:'heavy bags', doing:['carries']},
      {id:'sand', t:'the sand', doing:['blows']},
      {id:'oasis', t:'the oasis', doing:['spots']}
    ],
    where:[
      {id:'dunes', t:'across the dunes', doing:['plods','walks','leads','carries','blows','whistles']},
      {id:'towards', t:'towards the oasis', doing:['plods','walks','leads','carries']},
      {id:'horizon', t:'below the horizon', doing:['sinks']},
      {id:'sky', t:'in the orange sky', doing:['glows']},
      {id:'distance', t:'in the distance', doing:['shimmers','spots']}
    ],
    describe:[
      {id:'patient', t:'patient', who:['camel']},
      {id:'weary', t:'weary', who:['camel','traveller']},
      {id:'lone', t:'lone', who:['traveller']},
      {id:'dusty', t:'dusty', who:['traveller','wind']},
      {id:'fiery', t:'fiery', who:['sun']},
      {id:'hot', t:'hot', who:['wind']},
      {id:'green', t:'green', who:['oasis']},
      {id:'distant', t:'distant', who:['oasis']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['plods','walks','sinks','leads']},
      {id:'steadily', t:'steadily', doing:['plods','walks','leads','carries']},
      {id:'gently', t:'gently', doing:['blows','leads','glows']},
      {id:'fiercely', t:'fiercely', doing:['blows','glows']},
      {id:'softly', t:'softly', doing:['shimmers','glows','blows','whistles']},
      {id:'patiently', t:'patiently', doing:['carries','plods','walks']}
    ],
    when:[
      {id:'sunset', t:'at sunset'},
      {id:'evening', t:'every evening'},
      {id:'nightfall', t:'before nightfall'},
      {id:'end', t:'at the end of the day'}
    ]
  },
  {
    id:'arctic', title:'Arctic ice', img:'images/settings-arctic.jpg',
    who:[
      {id:'bear', det:'the', t:'polar bear'},
      {id:'seal', det:'the', t:'seal'},
      {id:'iceberg', det:'the', t:'iceberg'},
      {id:'sky', det:'the', t:'sky'},
      {id:'wind', det:'the', t:'wind'}
    ],
    doing:[
      {id:'prowls', t:'prowls', needs:'none', who:['bear']},
      {id:'walks', t:'walks', needs:'none', who:['bear']},
      {id:'sniffs', t:'sniffs', needs:'what', who:['bear']},
      {id:'watches', t:'watches', needs:'what', who:['bear','seal']},
      {id:'rests', t:'rests', needs:'none', who:['seal']},
      {id:'floats', t:'floats', needs:'none', who:['iceberg']},
      {id:'drifts', t:'drifts', needs:'none', who:['iceberg']},
      {id:'glows', t:'glows', needs:'none', who:['sky']},
      {id:'shimmers', t:'shimmers', needs:'none', who:['sky']},
      {id:'howls', t:'howls', needs:'none', who:['wind']},
      {id:'whistles', t:'whistles', needs:'none', who:['wind']}
    ],
    what:[
      {id:'seal', t:'the seal', doing:['watches'], who:['bear']},
      {id:'bear', t:'the polar bear', doing:['watches'], who:['seal']},
      {id:'air', t:'the cold air', doing:['sniffs']},
      {id:'sea', t:'the icy sea', doing:['watches']}
    ],
    where:[
      {id:'ice', t:'across the ice', doing:['prowls','walks','howls','whistles']},
      {id:'edge', t:'on the edge of the ice', who:['seal']},
      {id:'sea', t:'in the dark sea', who:['iceberg']},
      {id:'above', t:'above the icebergs', who:['sky']},
      {id:'distance', t:'in the distance', who:['iceberg']}
    ],
    describe:[
      {id:'powerful', t:'powerful', who:['bear']},
      {id:'white', t:'white', who:['bear']},
      {id:'sleek', t:'sleek', who:['seal']},
      {id:'grey', t:'grey', who:['seal']},
      {id:'jagged', t:'jagged', who:['iceberg']},
      {id:'enormous', t:'enormous', who:['iceberg','bear']},
      {id:'violet', t:'violet', who:['sky']},
      {id:'bitter', t:'bitter', who:['wind']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['prowls','walks','floats','drifts']},
      {id:'silently', t:'silently', doing:['prowls','drifts','floats','watches','glows']},
      {id:'lazily', t:'lazily', doing:['rests','floats']},
      {id:'carefully', t:'carefully', doing:['walks','sniffs','watches','prowls']},
      {id:'brightly', t:'brightly', doing:['glows','shimmers']},
      {id:'fiercely', t:'fiercely', doing:['howls','whistles']}
    ],
    when:[
      {id:'winter', t:'all winter'},
      {id:'night', t:'every night'},
      {id:'twilight', t:'at twilight'},
      {id:'storm', t:'before the storm'}
    ]
  },
  {
    id:'castle', title:'Castle ruin on the cliff', img:'images/settings-castle.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'tower', det:'the', t:'tower'},
      {id:'sea', det:'the', t:'sea'},
      {id:'seagull', det:'the', t:'seagull'},
      {id:'mist', det:'the', t:'mist'}
    ],
    doing:[
      {id:'climbs', t:'climbs', who:['girl']},
      {id:'looks', t:'looks at', needs:'what', who:['girl']},
      {id:'stands', t:'stands', needs:'none', who:['tower','girl']},
      {id:'crashes', t:'crashes', needs:'none', who:['sea']},
      {id:'roars', t:'roars', needs:'none', who:['sea']},
      {id:'circles', t:'circles', needs:'what', who:['seagull']},
      {id:'cries', t:'cries', needs:'none', who:['seagull']},
      {id:'swirls', t:'swirls', needs:'none', who:['mist']},
      {id:'drifts', t:'drifts', needs:'none', who:['mist']},
      {id:'hides', t:'hides', needs:'what', who:['mist']}
    ],
    what:[
      {id:'steps', t:'the stone steps', doing:['climbs']},
      {id:'tower', t:'the broken tower', doing:['circles','hides','looks']},
      {id:'castle', t:'the castle', doing:['hides','looks']},
      {id:'sea', t:'the sea', doing:['looks']}
    ],
    where:[
      {id:'cliff', t:'on the cliff', doing:['stands']},
      {id:'gate', t:'towards the gate', doing:['climbs']},
      {id:'steps', t:'from the steps', doing:['looks']},
      {id:'rocks', t:'against the rocks', who:['sea']},
      {id:'below', t:'below the castle', who:['sea']},
      {id:'waves', t:'above the waves', who:['seagull']},
      {id:'ruins', t:'around the ruins', doing:['swirls','drifts']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['girl']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'crumbling', t:'crumbling', who:['tower']},
      {id:'ancient', t:'ancient', who:['tower']},
      {id:'stormy', t:'stormy', who:['sea']},
      {id:'grey', t:'grey', who:['sea','mist','seagull']},
      {id:'white', t:'white', who:['seagull']},
      {id:'thick', t:'thick', who:['mist']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['climbs','looks']},
      {id:'slowly', t:'slowly', doing:['climbs','drifts','swirls','circles']},
      {id:'fiercely', t:'fiercely', doing:['crashes','roars']},
      {id:'proudly', t:'proudly', doing:['stands']},
      {id:'silently', t:'silently', doing:['drifts','swirls','hides','stands']},
      {id:'loudly', t:'loudly', doing:['cries','roars','crashes']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'morning', t:'every morning'},
      {id:'storm', t:'after the storm'},
      {id:'tide', t:'at high tide'}
    ]
  },
  {
    id:'cave', title:'The crystal cave', img:'images/settings-cave.jpg',
    who:[
      {id:'explorer', det:'the', t:'explorer', person:true},
      {id:'lantern', det:'the', t:'lantern'},
      {id:'lake', det:'the', t:'lake'},
      {id:'crystal', det:'the', t:'crystal'},
      {id:'boat', det:'the', t:'boat'}
    ],
    doing:[
      {id:'holds', t:'holds up', needs:'what', who:['explorer']},
      {id:'gazes', t:'gazes at', needs:'what', who:['explorer']},
      {id:'explores', t:'explores', needs:'what', who:['explorer']},
      {id:'glows', t:'glows', needs:'none', who:['lantern','crystal']},
      {id:'glitters', t:'glitters', needs:'none', who:['crystal']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['crystal','lake']},
      {id:'reflects', t:'reflects', needs:'what', who:['lake']},
      {id:'ripples', t:'ripples', needs:'none', who:['lake']},
      {id:'rests', t:'rests', needs:'none', who:['boat']},
      {id:'bobs', t:'bobs', needs:'none', who:['boat']}
    ],
    what:[
      {id:'lantern', t:'a lantern', doing:['holds']},
      {id:'crystals', t:'the crystals', doing:['gazes','reflects']},
      {id:'lake', t:'the dark lake', doing:['gazes']},
      {id:'cave', t:'the cave', doing:['explores']},
      {id:'light', t:'the lantern light', doing:['reflects']}
    ],
    where:[
      {id:'edge', t:'by the water’s edge', who:['explorer','boat']},
      {id:'walls', t:'on the cave walls', who:['crystal']},
      {id:'dark', t:'in the darkness', doing:['glows','glitters','sparkles']},
      {id:'deep', t:'deep underground'},
      {id:'water', t:'on the water', who:['boat']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['explorer']},
      {id:'curious', t:'curious', who:['explorer']},
      {id:'golden', t:'golden', who:['lantern']},
      {id:'still', t:'still', who:['lake']},
      {id:'deep', t:'deep', who:['lake']},
      {id:'purple', t:'purple', who:['crystal']},
      {id:'enormous', t:'enormous', who:['crystal']},
      {id:'wooden', t:'wooden', who:['boat']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['holds','explores','gazes']},
      {id:'brightly', t:'brightly', doing:['glows','glitters','sparkles']},
      {id:'gently', t:'gently', doing:['bobs','ripples','glows']},
      {id:'silently', t:'silently', doing:['reflects','rests','ripples','gazes']},
      {id:'quietly', t:'quietly', doing:['explores','rests','bobs','gazes']},
      {id:'perfectly', t:'perfectly', doing:['reflects']}
    ],
    when:[
      {id:'last', t:'at last'},
      {id:'hours', t:'for hours'},
      {id:'journey', t:'after a long journey'},
      {id:'night', t:'all night'}
    ]
  },
  {
    id:'volcano', title:'The erupting volcano', img:'images/settings-volcano.jpg',
    who:[
      {id:'volcano', det:'the', t:'volcano'},
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'goat', det:'the', t:'goat'},
      {id:'lava', det:'the', t:'lava'},
      {id:'eagle', det:'the', t:'eagle'}
    ],
    doing:[
      {id:'erupts', t:'erupts', needs:'none', who:['volcano']},
      {id:'rumbles', t:'rumbles', needs:'none', who:['volcano']},
      {id:'glows', t:'glows', needs:'none', who:['volcano','lava']},
      {id:'flows', t:'flows', needs:'none', who:['lava']},
      {id:'trickles', t:'trickles', needs:'none', who:['lava']},
      {id:'watches', t:'watches', needs:'what', who:['farmer','goat','eagle']},
      {id:'holds', t:'holds', needs:'what', who:['farmer']},
      {id:'stands', t:'stands', needs:'none', who:['farmer','goat']},
      {id:'bleats', t:'bleats', needs:'none', who:['goat']},
      {id:'soars', t:'soars', needs:'none', who:['eagle']}
    ],
    what:[
      {id:'volcano', t:'the volcano', doing:['watches']},
      {id:'lava', t:'the glowing lava', doing:['watches']},
      {id:'sky', t:'the smoky sky', doing:['watches'], who:['farmer','goat']},
      {id:'stick', t:'a walking stick', doing:['holds']}
    ],
    where:[
      {id:'slopes', t:'down the slopes', doing:['flows','trickles']},
      {id:'hill', t:'on the hill', who:['farmer','goat']},
      {id:'sky', t:'across the smoky sky', doing:['soars']},
      {id:'village', t:'above the village', who:['volcano','eagle']},
      {id:'distance', t:'in the distance', who:['volcano','lava']}
    ],
    describe:[
      {id:'mighty', t:'mighty', who:['volcano']},
      {id:'smoking', t:'smoking', who:['volcano']},
      {id:'fiery', t:'fiery', who:['lava','volcano']},
      {id:'redhot', t:'red-hot', who:['lava']},
      {id:'thoughtful', t:'thoughtful', who:['farmer']},
      {id:'shaggy', t:'shaggy', who:['goat']},
      {id:'white', t:'white', who:['goat']},
      {id:'lone', t:'lone', who:['eagle']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['erupts','rumbles','bleats']},
      {id:'slowly', t:'slowly', doing:['flows','trickles','soars']},
      {id:'brightly', t:'brightly', doing:['glows']},
      {id:'silently', t:'silently', doing:['watches','stands','soars']},
      {id:'calmly', t:'calmly', doing:['watches','stands','holds']},
      {id:'nervously', t:'nervously', doing:['bleats','watches']}
    ],
    when:[
      {id:'twilight', t:'at twilight'},
      {id:'dusk', t:'at dusk'},
      {id:'again', t:'once again'},
      {id:'dawn', t:'before dawn'}
    ]
  }
]});
