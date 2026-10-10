/* More History pictures (CLF curriculum, Y1–Y6). Added to the existing 'history' topic.
 * Same schema as content.js — see the notes at the top of that file. */
TOPICS.find(t => t.id === 'history').pictures.push(
  {
    id:'highstreet', title:'1950s high street (Y1)', img:'images/history-highstreet.jpg',
    who:[
      {id:'bus', det:'the', t:'bus'},
      {id:'car', det:'the', t:'car'},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'milkman', det:'the', t:'milkman', person:true},
      {id:'boy', det:'the', t:'boy', person:true}
    ],
    doing:[
      {id:'rumbles', t:'rumbles', needs:'none', who:['bus']},
      {id:'waits', t:'waits', needs:'none', who:['car','woman']},
      {id:'pushes', t:'pushes', needs:'what', who:['milkman']},
      {id:'carries', t:'carries', needs:'what', who:['woman','milkman']},
      {id:'delivers', t:'delivers', needs:'what', who:['milkman']},
      {id:'rides', t:'rides', needs:'what', who:['boy']},
      {id:'walks', t:'walks', needs:'none', who:['woman','milkman']},
      {id:'shops', t:'shops', needs:'none', who:['woman']},
      {id:'looks', t:'looks at', needs:'what', who:['woman','boy']}
    ],
    what:[
      {id:'cart', t:'the milk cart', doing:['pushes']},
      {id:'basket', t:'a wicker basket', doing:['carries'], who:['woman']},
      {id:'bottles', t:'bottles of milk', doing:['carries','delivers']},
      {id:'bike', t:'a bicycle', doing:['rides']},
      {id:'window', t:'the shop window', doing:['looks']},
      {id:'bus', t:'the red bus', doing:['looks']},
      {id:'bread', t:'the fresh bread', doing:['looks']}
    ],
    where:[
      {id:'street', t:'along the high street', doing:['rumbles','walks','rides','pushes','carries','delivers']},
      {id:'road', t:'down the road', doing:['rumbles','rides']},
      {id:'pavement', t:'on the pavement', who:['woman','milkman'], doing:['walks','pushes','waits','carries']},
      {id:'kerb', t:'by the kerb', who:['car'], doing:['waits']},
      {id:'bakery', t:'past the bakery', doing:['walks','rides','pushes','rumbles']},
      {id:'town', t:'in the town'}
    ],
    describe:[
      {id:'red', t:'red', who:['bus']},
      {id:'noisy', t:'noisy', who:['bus']},
      {id:'black', t:'black', who:['car']},
      {id:'shiny', t:'shiny', who:['car','bus']},
      {id:'busy', t:'busy', who:['woman','milkman']},
      {id:'cheerful', t:'cheerful', who:['milkman','woman','boy']},
      {id:'smart', t:'smart', who:['woman']},
      {id:'young', t:'young', who:['boy']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['rumbles','walks','pushes','rides']},
      {id:'carefully', t:'carefully', doing:['pushes','carries','rides','delivers']},
      {id:'quickly', t:'quickly', doing:['rides','walks']},
      {id:'noisily', t:'noisily', doing:['rumbles']},
      {id:'patiently', t:'patiently', doing:['waits'], who:['woman']},
      {id:'happily', t:'happily', doing:['shops','walks','rides']},
      {id:'closely', t:'closely', doing:['looks']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'saturday', t:'on Saturday'},
      {id:'lunch', t:'before lunch'},
      {id:'early', t:'early in the morning'}
    ]
  },
  {
    id:'telly', title:'Television and telephone (Y1)', img:'images/history-telly.jpg',
    who:[
      {id:'grandma', det:'the', t:'grandmother', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'father', det:'the', t:'father', person:true},
      {id:'tv', det:'the', t:'television'},
      {id:'phone', det:'the', t:'telephone'},
      {id:'fire', det:'the', t:'fire'}
    ],
    doing:[
      {id:'knits', t:'knits', who:['grandma']},
      {id:'watches', t:'watches', needs:'what', who:['grandma','girl']},
      {id:'talks', t:'talks on', needs:'what', who:['father']},
      {id:'dials', t:'dials', needs:'what', who:['father']},
      {id:'sits', t:'sits', needs:'none', who:['grandma','girl']},
      {id:'listens', t:'listens', needs:'none', who:['grandma','girl','father']},
      {id:'glows', t:'glows', needs:'none', who:['tv','fire']},
      {id:'flickers', t:'flickers', needs:'none', who:['tv','fire']},
      {id:'rings', t:'rings', needs:'none', who:['phone']}
    ],
    what:[
      {id:'scarf', t:'a woolly scarf', doing:['knits']},
      {id:'tv', t:'the television', doing:['watches']},
      {id:'show', t:'a black and white programme', doing:['watches']},
      {id:'phone', t:'the telephone', doing:['talks']},
      {id:'number', t:'a number', doing:['dials']}
    ],
    where:[
      {id:'room', t:'in the living room'},
      {id:'armchair', t:'in a cosy armchair', who:['grandma'], doing:['knits','sits','watches','listens']},
      {id:'rug', t:'on the rug', who:['girl'], doing:['sits','watches','listens']},
      {id:'byfire', t:'by the fire', who:['girl','grandma','father'], doing:['sits','knits','watches','listens']},
      {id:'fireplace', t:'in the fireplace', who:['fire']},
      {id:'corner', t:'in the corner', who:['tv']},
      {id:'table', t:'on the side table', who:['phone']}
    ],
    describe:[
      {id:'old', t:'old', who:['grandma']},
      {id:'young', t:'young', who:['girl']},
      {id:'quiet', t:'quiet', who:['girl','grandma']},
      {id:'busy', t:'busy', who:['father']},
      {id:'black', t:'black', who:['phone']},
      {id:'loud', t:'loud', who:['phone']},
      {id:'wooden', t:'wooden', who:['tv']},
      {id:'small', t:'small', who:['tv']},
      {id:'crackling', t:'crackling', who:['fire']},
      {id:'warm', t:'warm', who:['fire']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['knits','dials']},
      {id:'slowly', t:'slowly', doing:['knits','dials']},
      {id:'quietly', t:'quietly', doing:['sits','watches','listens','talks']},
      {id:'loudly', t:'loudly', doing:['rings','talks']},
      {id:'brightly', t:'brightly', doing:['glows','flickers']},
      {id:'happily', t:'happily', doing:['watches','knits','sits','talks']}
    ],
    when:[
      {id:'evening', t:'every evening'},
      {id:'tea', t:'after tea'},
      {id:'tonight', t:'tonight'},
      {id:'bedtime', t:'at bedtime'}
    ]
  },
  {
    id:'matthew', title:"John Cabot's Matthew (Y3)", img:'images/history-matthew.jpg',
    who:[
      {id:'cabot', det:'', t:'John Cabot', person:true},
      {id:'sailor', det:'the', t:'sailor', person:true},
      {id:'ship', det:'the', t:'ship'},
      {id:'crowd', det:'the', t:'crowd', person:true},
      {id:'gull', det:'a', t:'seagull'}
    ],
    doing:[
      {id:'sails', t:'sails', needs:'none', who:['ship','cabot']},
      {id:'leaves', t:'leaves', needs:'what', who:['ship','cabot']},
      {id:'climbs', t:'climbs', needs:'what', who:['sailor']},
      {id:'pulls', t:'pulls', needs:'what', who:['sailor']},
      {id:'waves', t:'waves', needs:'none', who:['crowd']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd']},
      {id:'watches', t:'watches', needs:'what', who:['crowd','cabot']},
      {id:'looks', t:'looks for', needs:'what', who:['cabot']},
      {id:'explores', t:'explores', needs:'what', who:['cabot']},
      {id:'flies', t:'flies', needs:'none', who:['gull']}
    ],
    what:[
      {id:'bristol', t:'Bristol', doing:['leaves']},
      {id:'harbour', t:'the harbour', doing:['leaves']},
      {id:'rigging', t:'the rigging', doing:['climbs']},
      {id:'mast', t:'the tall mast', doing:['climbs']},
      {id:'rope', t:'a rope', doing:['pulls']},
      {id:'ship', t:'the ship', doing:['watches'], who:['crowd']},
      {id:'sea', t:'the open sea', doing:['watches']},
      {id:'lands', t:'new lands', doing:['looks','explores']}
    ],
    where:[
      {id:'river', t:'down the river', doing:['sails']},
      {id:'out', t:'out of the harbour', doing:['sails']},
      {id:'atlantic', t:'across the Atlantic Ocean', doing:['sails']},
      {id:'quay', t:'on the quay', who:['crowd']},
      {id:'deck', t:'on the deck', who:['sailor'], doing:['pulls']},
      {id:'fromdeck', t:'from the deck', who:['cabot'], doing:['watches','looks']},
      {id:'above', t:'above the ship', who:['gull']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['sailor']},
      {id:'strong', t:'strong', who:['sailor']},
      {id:'wooden', t:'wooden', who:['ship']},
      {id:'small', t:'small', who:['ship']},
      {id:'sturdy', t:'sturdy', who:['ship']},
      {id:'excited', t:'excited', who:['crowd']},
      {id:'noisy', t:'noisy', who:['crowd','gull']},
      {id:'white', t:'white', who:['gull']}
    ],
    how:[
      {id:'bravely', t:'bravely', doing:['sails','climbs','explores']},
      {id:'slowly', t:'slowly', doing:['sails','climbs','flies']},
      {id:'quickly', t:'quickly', doing:['climbs','pulls','flies']},
      {id:'hard', t:'hard', doing:['pulls']},
      {id:'loudly', t:'loudly', doing:['cheers']},
      {id:'excitedly', t:'excitedly', doing:['waves','cheers','watches']},
      {id:'proudly', t:'proudly', doing:['sails','leaves','watches']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'sunrise', t:'at sunrise'},
      {id:'today', t:'today'},
      {id:'weeks', t:'for many weeks', doing:['sails','explores']}
    ]
  },
  {
    id:'gunpowder', title:'Gunpowder Plot (Y3)', img:'images/history-gunpowder.jpg',
    who:[
      {id:'guy', det:'', t:'Guy Fawkes', person:true},
      {id:'guard', det:'the', t:'guard', person:true},
      {id:'lantern', det:'the', t:'lantern'},
      {id:'torch', det:'the', t:'torch'}
    ],
    doing:[
      {id:'guards', t:'guards', needs:'what', who:['guy']},
      {id:'hides', t:'hides', needs:'what', who:['guy']},
      {id:'holds', t:'holds', needs:'what', who:['guy','guard']},
      {id:'waits', t:'waits', needs:'none', who:['guy']},
      {id:'listens', t:'listens', needs:'none', who:['guy']},
      {id:'creeps', t:'creeps', needs:'none', who:['guy','guard']},
      {id:'discovers', t:'discovers', needs:'what', who:['guard']},
      {id:'glows', t:'glows', needs:'none', who:['lantern']},
      {id:'flickers', t:'flickers', needs:'none', who:['lantern','torch']}
    ],
    what:[
      {id:'barrels', t:'the barrels', doing:['guards','hides','discovers']},
      {id:'gunpowder', t:'the gunpowder', doing:['guards','hides','discovers']},
      {id:'plot', t:'the secret plot', doing:['discovers']},
      {id:'lantern', t:'a lantern', doing:['holds'], who:['guy']},
      {id:'torch', t:'a flaming torch', doing:['holds'], who:['guard']}
    ],
    where:[
      {id:'cellar', t:'in the dark cellar'},
      {id:'under', t:'under the firewood', doing:['hides']},
      {id:'parliament', t:'beneath the Houses of Parliament'},
      {id:'steps', t:'down the stone steps', doing:['creeps']},
      {id:'beside', t:'beside the barrels', who:['guy','lantern'], doing:['waits','listens','holds','glows']}
    ],
    describe:[
      {id:'watchful', t:'watchful', who:['guard']},
      {id:'suspicious', t:'suspicious', who:['guard']},
      {id:'small', t:'small', who:['lantern']},
      {id:'dim', t:'dim', who:['lantern']},
      {id:'flaming', t:'flaming', who:['torch']},
      {id:'bright', t:'bright', who:['torch']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['creeps','waits','listens','hides']},
      {id:'nervously', t:'nervously', doing:['waits','listens','hides','guards']},
      {id:'carefully', t:'carefully', doing:['hides','holds','creeps']},
      {id:'secretly', t:'secretly', doing:['hides','guards']},
      {id:'suddenly', t:'suddenly', doing:['discovers']},
      {id:'dimly', t:'dimly', doing:['glows','flickers']}
    ],
    when:[
      {id:'midnight', t:'at midnight'},
      {id:'dark', t:'in the dark'},
      {id:'late', t:'late at night'},
      {id:'fifth', t:'on the fifth of November'}
    ]
  },
  {
    id:'saxon', title:'Anglo-Saxon village (Y4)', img:'images/history-saxon.jpg',
    who:[
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'smith', det:'the', t:'blacksmith', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'ox', det:'the', t:'ox'},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'weaves', t:'weaves', who:['woman']},
      {id:'ploughs', t:'ploughs', who:['farmer']},
      {id:'leads', t:'leads', needs:'what', who:['farmer']},
      {id:'pulls', t:'pulls', needs:'what', who:['ox']},
      {id:'hammers', t:'hammers', needs:'what', who:['smith']},
      {id:'feeds', t:'feeds', needs:'what', who:['boy']},
      {id:'works', t:'works', needs:'none', who:['woman','farmer','smith','boy']},
      {id:'rises', t:'rises', needs:'none', who:['smoke']}
    ],
    what:[
      {id:'cloth', t:'woollen cloth', doing:['weaves']},
      {id:'field', t:'the strip field', doing:['ploughs']},
      {id:'ox', t:'the ox', doing:['leads']},
      {id:'plough', t:'the wooden plough', doing:['pulls']},
      {id:'metal', t:'hot metal', doing:['hammers']},
      {id:'chickens', t:'the chickens', doing:['feeds']},
      {id:'pigs', t:'the hungry pigs', doing:['feeds']}
    ],
    where:[
      {id:'loom', t:'at the loom', who:['woman'], doing:['weaves','works']},
      {id:'field', t:'in the field', who:['farmer','ox'], doing:['ploughs','pulls','works','leads']},
      {id:'anvil', t:'at the anvil', who:['smith'], doing:['hammers','works']},
      {id:'sty', t:'by the pigsty', who:['boy'], doing:['feeds','works']},
      {id:'thatch', t:'through the thatch', who:['smoke'], doing:['rises']},
      {id:'village', t:'in the village'}
    ],
    describe:[
      {id:'hardworking', t:'hardworking', who:['woman','farmer','smith','boy']},
      {id:'strong', t:'strong', who:['smith','ox','farmer']},
      {id:'skilful', t:'skilful', who:['woman','smith']},
      {id:'young', t:'young', who:['boy']},
      {id:'muddy', t:'muddy', who:['farmer','boy','ox']},
      {id:'brown', t:'brown', who:['ox']},
      {id:'grey', t:'grey', who:['smoke']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['weaves','feeds','hammers','leads']},
      {id:'slowly', t:'slowly', doing:['pulls','ploughs','rises','leads']},
      {id:'loudly', t:'loudly', doing:['hammers']},
      {id:'hard', t:'hard', doing:['works','hammers','pulls','ploughs']},
      {id:'patiently', t:'patiently', doing:['weaves','leads']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'dawn', t:'at dawn'},
      {id:'morning', t:'all morning'},
      {id:'harvest', t:'before the harvest'}
    ]
  },
  {
    id:'maya', title:'Maya city (Y4)', img:'images/history-maya.jpg',
    who:[
      {id:'priest', det:'the', t:'priest', person:true},
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'potter', det:'the', t:'potter', person:true},
      {id:'toucan', det:'the', t:'toucan'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'prays', t:'prays', needs:'none', who:['priest']},
      {id:'raises', t:'raises', needs:'what', who:['priest']},
      {id:'climbs', t:'climbs', needs:'what', who:['priest']},
      {id:'carries', t:'carries', needs:'what', who:['farmer']},
      {id:'grinds', t:'grinds', needs:'what', who:['woman']},
      {id:'shapes', t:'shapes', needs:'what', who:['potter']},
      {id:'works', t:'works', needs:'none', who:['farmer','woman','potter']},
      {id:'sits', t:'sits', needs:'none', who:['toucan']},
      {id:'squawks', t:'squawks', needs:'none', who:['toucan']},
      {id:'rises', t:'rises', needs:'none', who:['sun']},
      {id:'shines', t:'shines', needs:'none', who:['sun']}
    ],
    what:[
      {id:'arms', t:'both arms', doing:['raises']},
      {id:'steps', t:'the steep steps', doing:['climbs']},
      {id:'basket', t:'a basket of maize', doing:['carries']},
      {id:'maize', t:'the maize', doing:['grinds']},
      {id:'pot', t:'a clay pot', doing:['shapes']}
    ],
    where:[
      {id:'top', t:'at the top of the pyramid', who:['priest'], doing:['prays','raises']},
      {id:'temple', t:'by the temple', who:['priest'], doing:['prays']},
      {id:'plaza', t:'across the plaza', who:['farmer'], doing:['carries']},
      {id:'stone', t:'on a grinding stone', who:['woman'], doing:['grinds']},
      {id:'branch', t:'on a branch', who:['toucan'], doing:['sits','squawks']},
      {id:'jungle', t:'above the jungle', who:['sun'], doing:['rises','shines']},
      {id:'city', t:'in the Maya city'}
    ],
    describe:[
      {id:'holy', t:'holy', who:['priest']},
      {id:'powerful', t:'powerful', who:['priest']},
      {id:'colourful', t:'colourful', who:['toucan']},
      {id:'hardworking', t:'hardworking', who:['farmer','woman','potter']},
      {id:'skilful', t:'skilful', who:['potter','woman']},
      {id:'strong', t:'strong', who:['farmer']},
      {id:'hot', t:'hot', who:['sun']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['climbs','rises','carries','grinds']},
      {id:'carefully', t:'carefully', doing:['shapes','carries','grinds','climbs']},
      {id:'proudly', t:'proudly', doing:['raises','prays']},
      {id:'quietly', t:'quietly', doing:['prays','sits','works']},
      {id:'hard', t:'hard', doing:['works','grinds']},
      {id:'loudly', t:'loudly', doing:['squawks']},
      {id:'brightly', t:'brightly', doing:['shines']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'morning', t:'every morning'},
      {id:'today', t:'today'},
      {id:'allday', t:'all day', doing:['works','sits','shines','carries','grinds','shapes']}
    ]
  },
  {
    id:'hadrian', title:"Hadrian's Wall (Y5)", img:'images/history-hadrian.jpg',
    who:[
      {id:'legionary', det:'the', t:'legionary', person:true},
      {id:'centurion', det:'the', t:'centurion', person:true},
      {id:'crane', det:'the', t:'crane'},
      {id:'sheep', det:'the', t:'sheep'}
    ],
    doing:[
      {id:'carries', t:'carries', needs:'what', who:['legionary']},
      {id:'mixes', t:'mixes', needs:'what', who:['legionary']},
      {id:'builds', t:'builds', needs:'what', who:['legionary']},
      {id:'lifts', t:'lifts', needs:'what', who:['crane','legionary']},
      {id:'marches', t:'marches', needs:'none', who:['legionary','centurion']},
      {id:'points', t:'points', needs:'none', who:['centurion']},
      {id:'orders', t:'gives orders', needs:'none', who:['centurion']},
      {id:'shouts', t:'shouts', needs:'none', who:['centurion']},
      {id:'grazes', t:'grazes', needs:'none', who:['sheep']}
    ],
    what:[
      {id:'stone', t:'a heavy stone', doing:['carries','lifts']},
      {id:'block', t:'a stone block', doing:['carries','lifts']},
      {id:'mortar', t:'the mortar', doing:['mixes']},
      {id:'wall', t:'the wall', doing:['builds']},
      {id:'milecastle', t:'a milecastle', doing:['builds']}
    ],
    where:[
      {id:'hills', t:'across the hills', doing:['marches','builds']},
      {id:'frontier', t:'along the frontier', doing:['marches','builds']},
      {id:'top', t:'on top of the wall', who:['centurion'], doing:['points','orders','shouts']},
      {id:'trough', t:'in a wooden trough', doing:['mixes']},
      {id:'hillside', t:'on the hillside', who:['sheep'], doing:['grazes']},
      {id:'britain', t:'in northern Britain'}
    ],
    describe:[
      {id:'tired', t:'tired', who:['legionary']},
      {id:'strong', t:'strong', who:['legionary','crane']},
      {id:'strict', t:'strict', who:['centurion']},
      {id:'proud', t:'proud', who:['centurion']},
      {id:'tall', t:'tall', who:['crane']},
      {id:'wooden', t:'wooden', who:['crane']},
      {id:'woolly', t:'woolly', who:['sheep']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['lifts','builds','carries','mixes']},
      {id:'slowly', t:'slowly', doing:['lifts','carries','marches','grazes']},
      {id:'quickly', t:'quickly', doing:['mixes','builds','marches']},
      {id:'loudly', t:'loudly', doing:['shouts','orders']},
      {id:'firmly', t:'firmly', doing:['points','orders']},
      {id:'peacefully', t:'peacefully', doing:['grazes']}
    ],
    when:[
      {id:'allday', t:'all day'},
      {id:'every', t:'every day'},
      {id:'dawn', t:'at dawn'},
      {id:'wind', t:'in the cold wind'}
    ]
  },
  {
    id:'bath', title:'Roman baths (Y5)', img:'images/history-bath.jpg',
    who:[
      {id:'citizen', det:'the', t:'citizen', person:true},
      {id:'swimmer', det:'the', t:'swimmer', person:true},
      {id:'slave', det:'the', t:'slave', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'steam', det:'the', t:'steam'}
    ],
    doing:[
      {id:'relaxes', t:'relaxes', needs:'none', who:['citizen','swimmer']},
      {id:'swims', t:'swims', needs:'none', who:['swimmer']},
      {id:'watches', t:'watches', needs:'what', who:['citizen','slave']},
      {id:'carries', t:'carries', needs:'what', who:['slave']},
      {id:'throws', t:'throws', needs:'what', who:['woman']},
      {id:'offers', t:'offers', needs:'what', who:['woman']},
      {id:'prays', t:'prays', needs:'none', who:['woman']},
      {id:'rises', t:'rises', needs:'none', who:['steam']}
    ],
    what:[
      {id:'swimmer', t:'the swimmer', doing:['watches']},
      {id:'pool', t:'the steaming pool', doing:['watches']},
      {id:'towels', t:'clean towels', doing:['carries']},
      {id:'jug', t:'a jug of oil', doing:['carries']},
      {id:'coin', t:'a small coin', doing:['throws','offers']}
    ],
    where:[
      {id:'pool', t:'in the warm pool', who:['swimmer'], doing:['swims','relaxes']},
      {id:'steps', t:'on the stone steps', who:['citizen'], doing:['relaxes','watches']},
      {id:'edge', t:'by the edge of the pool', who:['citizen','slave','woman'], doing:['watches','prays','carries']},
      {id:'into', t:'into the water', doing:['throws']},
      {id:'above', t:'above the pool', who:['steam'], doing:['rises']},
      {id:'sulis', t:'in Aquae Sulis'}
    ],
    describe:[
      {id:'wealthy', t:'wealthy', who:['citizen']},
      {id:'relaxed', t:'relaxed', who:['citizen','swimmer']},
      {id:'busy', t:'busy', who:['slave']},
      {id:'hopeful', t:'hopeful', who:['woman']},
      {id:'warm', t:'warm', who:['steam']},
      {id:'white', t:'white', who:['steam']}
    ],
    how:[
      {id:'lazily', t:'lazily', doing:['relaxes','swims']},
      {id:'slowly', t:'slowly', doing:['swims','rises','carries']},
      {id:'gently', t:'gently', doing:['throws','rises']},
      {id:'carefully', t:'carefully', doing:['carries','throws','offers']},
      {id:'quietly', t:'quietly', doing:['prays','relaxes','watches']}
    ],
    when:[
      {id:'afternoon', t:'every afternoon'},
      {id:'allafternoon', t:'all afternoon'},
      {id:'today', t:'today'},
      {id:'work', t:'after work', who:['citizen','swimmer','woman']}
    ]
  },
  {
    id:'pyramid', title:'Building a pyramid (Y5)', img:'images/history-pyramid.jpg',
    who:[
      {id:'worker', det:'the', t:'worker', person:true},
      {id:'team', det:'the', t:'team', person:true},
      {id:'overseer', det:'the', t:'overseer', person:true},
      {id:'mason', det:'the', t:'stonemason', person:true},
      {id:'boat', det:'the', t:'boat'},
      {id:'block', det:'the', t:'stone block'}
    ],
    doing:[
      {id:'pulls', t:'pulls', needs:'what', who:['team','worker']},
      {id:'heaves', t:'heaves', needs:'none', who:['team','worker']},
      {id:'pours', t:'pours', needs:'what', who:['worker']},
      {id:'works', t:'works', needs:'none', who:['team','mason']},
      {id:'chisels', t:'chisels', needs:'what', who:['mason']},
      {id:'watches', t:'watches', needs:'what', who:['overseer']},
      {id:'shouts', t:'shouts', needs:'none', who:['overseer']},
      {id:'slides', t:'slides', needs:'none', who:['block']},
      {id:'sails', t:'sails', needs:'none', who:['boat']},
      {id:'carries', t:'carries', needs:'what', who:['boat']}
    ],
    what:[
      {id:'block', t:'a heavy block', doing:['pulls']},
      {id:'sledge', t:'the wooden sledge', doing:['pulls']},
      {id:'water', t:'water', doing:['pours']},
      {id:'limestone', t:'a limestone block', doing:['chisels']},
      {id:'team', t:'the team', doing:['watches']},
      {id:'stones', t:'stone blocks', doing:['carries']}
    ],
    where:[
      {id:'ramp', t:'up the ramp', doing:['pulls','slides','heaves']},
      {id:'sand', t:'onto the sand', doing:['pours']},
      {id:'nile', t:'along the River Nile', doing:['sails','carries']},
      {id:'giza', t:'at Giza', who:['worker','team','overseer','mason']},
      {id:'sun', t:'in the hot sun'}
    ],
    describe:[
      {id:'strong', t:'strong', who:['worker','team']},
      {id:'tired', t:'tired', who:['worker','team','mason']},
      {id:'strict', t:'strict', who:['overseer']},
      {id:'skilful', t:'skilful', who:['mason']},
      {id:'heavy', t:'heavy', who:['block']},
      {id:'huge', t:'huge', who:['block']},
      {id:'wooden', t:'wooden', who:['boat']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['pulls','slides','sails','heaves']},
      {id:'together', t:'together', who:['team'], doing:['pulls','heaves','works']},
      {id:'carefully', t:'carefully', doing:['chisels','pours','carries']},
      {id:'hard', t:'hard', doing:['works','pulls','heaves']},
      {id:'loudly', t:'loudly', doing:['shouts']},
      {id:'closely', t:'closely', doing:['watches']}
    ],
    when:[
      {id:'allday', t:'all day'},
      {id:'every', t:'every day'},
      {id:'noon', t:'at noon'},
      {id:'dawn', t:'at dawn'}
    ]
  },
  {
    id:'carter', title:"Tutankhamun's tomb (Y5)", img:'images/history-carter.jpg',
    who:[
      {id:'carter', det:'', t:'Howard Carter', person:true},
      {id:'carnarvon', det:'', t:'Lord Carnarvon', person:true},
      {id:'workman', det:'the', t:'workman', person:true},
      {id:'candle', det:'the', t:'candle'},
      {id:'torch', det:'the', t:'torch'}
    ],
    doing:[
      {id:'peers', t:'peers into', needs:'what', who:['carter','carnarvon']},
      {id:'holds', t:'holds', needs:'what', who:['carter','carnarvon','workman']},
      {id:'sees', t:'sees', needs:'what', who:['carter','carnarvon']},
      {id:'discovers', t:'discovers', needs:'what', who:['carter']},
      {id:'gasps', t:'gasps', needs:'none', who:['carter','carnarvon','workman']},
      {id:'waits', t:'waits', needs:'none', who:['carnarvon','workman']},
      {id:'flickers', t:'flickers', needs:'none', who:['candle']},
      {id:'shines', t:'shines', needs:'none', who:['torch','candle']}
    ],
    what:[
      {id:'chamber', t:'the dark chamber', doing:['peers']},
      {id:'hole', t:'a small hole', doing:['peers']},
      {id:'candle', t:'a candle', doing:['holds'], who:['carter']},
      {id:'torch', t:'an electric torch', doing:['holds'], who:['carnarvon']},
      {id:'lantern', t:'a lantern', doing:['holds'], who:['workman']},
      {id:'treasure', t:'golden treasure', doing:['sees','discovers']},
      {id:'throne', t:'a golden throne', doing:['sees']},
      {id:'tomb', t:'the lost tomb', doing:['discovers']}
    ],
    where:[
      {id:'inside', t:'inside the tomb'},
      {id:'valley', t:'in the Valley of the Kings', who:['carter','carnarvon','workman']},
      {id:'behind', t:'behind Howard Carter', who:['carnarvon','workman'], doing:['waits','holds','gasps']},
      {id:'through', t:'through the hole', doing:['peers','sees','shines']},
      {id:'darkness', t:'in the darkness', who:['candle','torch'], doing:['flickers','shines']}
    ],
    describe:[
      {id:'patient', t:'patient', who:['workman']},
      {id:'curious', t:'curious', who:['workman']},
      {id:'small', t:'small', who:['candle']},
      {id:'tiny', t:'tiny', who:['candle']},
      {id:'bright', t:'bright', who:['torch']},
      {id:'electric', t:'electric', who:['torch']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['peers','holds']},
      {id:'excitedly', t:'excitedly', doing:['peers','sees','discovers']},
      {id:'nervously', t:'nervously', doing:['waits','holds']},
      {id:'patiently', t:'patiently', doing:['waits']},
      {id:'loudly', t:'loudly', doing:['gasps']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'gently', t:'gently', doing:['flickers']}
    ],
    when:[
      {id:'last', t:'at last'},
      {id:'today', t:'today'},
      {id:'november', t:'in November'},
      {id:'years', t:'after years of searching', doing:['discovers','sees','peers']}
    ]
  },
  {
    id:'hillfort', title:'Iron Age hillfort (Y6)', img:'images/history-hillfort.jpg',
    who:[
      {id:'warrior', det:'the', t:'warrior', person:true},
      {id:'smith', det:'the', t:'blacksmith', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'flock', det:'the', t:'flock'},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'guards', t:'guards', needs:'what', who:['warrior']},
      {id:'stands', t:'stands', needs:'none', who:['warrior']},
      {id:'watches', t:'watches', needs:'what', who:['warrior']},
      {id:'hammers', t:'hammers', needs:'what', who:['smith']},
      {id:'grinds', t:'grinds', needs:'what', who:['woman']},
      {id:'herds', t:'herds', needs:'what', who:['boy']},
      {id:'works', t:'works', needs:'none', who:['smith','woman','boy']},
      {id:'trots', t:'trots', needs:'none', who:['flock']},
      {id:'rises', t:'rises', needs:'none', who:['smoke']}
    ],
    what:[
      {id:'hillfort', t:'the hillfort', doing:['guards']},
      {id:'gate', t:'the wooden gateway', doing:['guards']},
      {id:'valley', t:'the valley below', doing:['watches']},
      {id:'tool', t:'a glowing iron tool', doing:['hammers']},
      {id:'grain', t:'the grain', doing:['grinds']},
      {id:'sheep', t:'the sheep', doing:['herds']}
    ],
    where:[
      {id:'rampart', t:'on the rampart', who:['warrior'], doing:['stands','guards','watches']},
      {id:'gate', t:'through the gate', doing:['herds','trots']},
      {id:'quern', t:'on a stone quern', doing:['grinds']},
      {id:'roundhouse', t:'by the roundhouse', who:['smith','woman'], doing:['hammers','grinds','works']},
      {id:'roof', t:'through the thatched roof', who:['smoke'], doing:['rises']},
      {id:'hilltop', t:'on the hilltop'}
    ],
    describe:[
      {id:'fierce', t:'fierce', who:['warrior']},
      {id:'watchful', t:'watchful', who:['warrior']},
      {id:'strong', t:'strong', who:['smith','warrior']},
      {id:'busy', t:'busy', who:['woman','smith']},
      {id:'young', t:'young', who:['boy']},
      {id:'woolly', t:'woolly', who:['flock']},
      {id:'grey', t:'grey', who:['smoke']}
    ],
    how:[
      {id:'proudly', t:'proudly', doing:['stands','guards']},
      {id:'carefully', t:'carefully', doing:['watches','guards','herds','grinds']},
      {id:'loudly', t:'loudly', doing:['hammers']},
      {id:'hard', t:'hard', doing:['hammers','works','grinds']},
      {id:'slowly', t:'slowly', doing:['rises','trots','herds','grinds']},
      {id:'gently', t:'gently', doing:['herds']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'dawn', t:'at dawn'},
      {id:'allday', t:'all day'},
      {id:'sunset', t:'at sunset'}
    ]
  },
  {
    id:'brunel', title:'SS Great Britain (Y2)', img:'images/history-brunel.jpg',
    who:[
      {id:'brunel', det:'', t:'Isambard Kingdom Brunel', person:true},
      {id:'worker', det:'the', t:'dock worker', person:true},
      {id:'crowd', det:'the', t:'crowd', person:true},
      {id:'ship', det:'the', t:'ship'},
      {id:'horse', det:'the', t:'horse'},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'looks', t:'looks at', needs:'what', who:['brunel','crowd']},
      {id:'designs', t:'designs', needs:'what', who:['brunel']},
      {id:'stands', t:'stands', needs:'none', who:['brunel']},
      {id:'smiles', t:'smiles', needs:'none', who:['brunel']},
      {id:'pulls', t:'pulls', needs:'what', who:['worker','horse']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd']},
      {id:'waves', t:'waves', needs:'none', who:['crowd']},
      {id:'floats', t:'floats', needs:'none', who:['ship']},
      {id:'billows', t:'billows', needs:'none', who:['smoke']}
    ],
    what:[
      {id:'ship', t:'the huge iron ship', doing:['looks','designs']},
      {id:'bridges', t:'bridges and railways', doing:['designs']},
      {id:'rope', t:'a thick rope', doing:['pulls'], who:['worker']},
      {id:'cart', t:'a cart of coal', doing:['pulls'], who:['horse']}
    ],
    where:[
      {id:'harbour', t:'in the harbour', who:['ship']},
      {id:'dock', t:'on the dockside', who:['brunel','worker','crowd','horse'], doing:['looks','pulls','cheers','waves','stands','smiles']},
      {id:'quay', t:'along the quay', who:['horse','worker'], doing:['pulls']},
      {id:'funnel', t:'from the funnel', who:['smoke']},
      {id:'bristol', t:'in Bristol'}
    ],
    describe:[
      {id:'excited', t:'excited', who:['crowd']},
      {id:'noisy', t:'noisy', who:['crowd']},
      {id:'strong', t:'strong', who:['worker','horse']},
      {id:'brown', t:'brown', who:['horse']},
      {id:'huge', t:'huge', who:['ship']},
      {id:'iron', t:'iron', who:['ship']},
      {id:'black', t:'black', who:['ship','smoke']},
      {id:'thick', t:'thick', who:['smoke']}
    ],
    how:[
      {id:'proudly', t:'proudly', doing:['looks','stands','smiles']},
      {id:'loudly', t:'loudly', doing:['cheers']},
      {id:'excitedly', t:'excitedly', doing:['cheers','waves','looks']},
      {id:'cleverly', t:'cleverly', doing:['designs']},
      {id:'hard', t:'hard', doing:['pulls']},
      {id:'slowly', t:'slowly', doing:['pulls','floats','billows']},
      {id:'gently', t:'gently', doing:['floats']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'morning', t:'this morning'},
      {id:'last', t:'at last'},
      {id:'launch', t:'on launch day', doing:['looks','stands','smiles','pulls','cheers','waves','floats','billows']}
    ]
  }
);
