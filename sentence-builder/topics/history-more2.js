/* More History pictures, set 2 (CLF curriculum, Y1–Y6). Added to the existing 'history' topic.
 * Same schema as content.js — see the notes at the top of that file. */
TOPICS.find(t => t.id === 'history').pictures.push(
  {
    id:'seaside', title:'1950s seaside holiday (Y1)', img:'images/history-seaside.jpg',
    who:[
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'man', det:'the', t:'man', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'donkey', det:'the', t:'donkey'},
      {id:'gull', det:'a', t:'seagull'}
    ],
    doing:[
      {id:'sits', t:'sits', needs:'none', who:['woman']},
      {id:'builds', t:'builds', needs:'what', who:['girl']},
      {id:'paddles', t:'paddles', needs:'none', who:['man']},
      {id:'rides', t:'rides', needs:'what', who:['boy']},
      {id:'watches', t:'watches', needs:'what', who:['woman','man']},
      {id:'trots', t:'trots', needs:'none', who:['donkey']},
      {id:'carries', t:'carries', needs:'what', who:['donkey']},
      {id:'flies', t:'flies', needs:'none', who:['gull']},
      {id:'squawks', t:'squawks', needs:'none', who:['gull']}
    ],
    what:[
      {id:'castle', t:'a sandcastle', doing:['builds','watches']},
      {id:'donkey', t:'a grey donkey', doing:['rides','watches']},
      {id:'boy', t:'a young boy', doing:['carries']},
      {id:'waves', t:'the waves', doing:['watches']},
      {id:'girl', t:'the little girl', doing:['watches']}
    ],
    where:[
      {id:'beach', t:'on the beach', doing:['sits','builds','rides','watches','trots','carries']},
      {id:'sea', t:'in the shallow sea', who:['man'], doing:['paddles','watches']},
      {id:'sand', t:'on the sand', doing:['sits','builds','trots']},
      {id:'deckchair', t:'in a striped deckchair', who:['woman'], doing:['sits','watches']},
      {id:'pier', t:'near the pier', doing:['paddles','rides','trots','flies','carries']},
      {id:'above', t:'above the beach', doing:['flies','squawks']}
    ],
    describe:[
      {id:'cheerful', t:'cheerful', who:['woman','man','girl','boy']},
      {id:'young', t:'young', who:['girl','boy']},
      {id:'relaxed', t:'relaxed', who:['woman','man']},
      {id:'busy', t:'busy', who:['girl']},
      {id:'grey', t:'grey', who:['donkey']},
      {id:'patient', t:'patient', who:['donkey']},
      {id:'noisy', t:'noisy', who:['gull']},
      {id:'white', t:'white', who:['gull']}
    ],
    how:[
      {id:'happily', t:'happily', doing:['sits','builds','paddles','rides','watches','trots']},
      {id:'carefully', t:'carefully', doing:['builds','rides','carries']},
      {id:'slowly', t:'slowly', doing:['paddles','trots','carries','flies']},
      {id:'gently', t:'gently', doing:['trots','carries']},
      {id:'proudly', t:'proudly', doing:['rides','builds']},
      {id:'noisily', t:'noisily', doing:['squawks']}
    ],
    when:[
      {id:'holidays', t:'in the summer holidays'},
      {id:'summer', t:'every summer'},
      {id:'lunch', t:'after lunch'},
      {id:'sunny', t:'on a sunny day'}
    ]
  },
  {
    id:'nightingale', title:'Florence Nightingale (Y2)', img:'images/history-nightingale.jpg',
    who:[
      {id:'florence', det:'', t:'Florence Nightingale', person:true},
      {id:'nurse', det:'the', t:'nurse', person:true},
      {id:'soldier', det:'the', t:'soldier', person:true},
      {id:'lamp', det:'the', t:'lamp'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['florence','nurse']},
      {id:'carries', t:'carries', needs:'what', who:['florence','nurse']},
      {id:'checks', t:'checks on', needs:'what', who:['florence']},
      {id:'cares', t:'cares for', needs:'what', who:['florence','nurse']},
      {id:'folds', t:'folds', needs:'what', who:['nurse']},
      {id:'sleeps', t:'sleeps', needs:'none', who:['soldier']},
      {id:'rests', t:'rests', needs:'none', who:['soldier']},
      {id:'watches', t:'watches', needs:'what', who:['soldier']},
      {id:'glows', t:'glows', needs:'none', who:['lamp']},
      {id:'flickers', t:'flickers', needs:'none', who:['lamp']}
    ],
    what:[
      {id:'lamp', t:'a lamp', doing:['carries']},
      {id:'bandages', t:'clean bandages', doing:['carries','folds']},
      {id:'blankets', t:'the blankets', doing:['carries','folds']},
      {id:'soldiers', t:'the soldiers', doing:['checks','cares']},
      {id:'sick', t:'a sick soldier', doing:['checks','cares']},
      {id:'lady', t:'the lady with the lamp', doing:['watches']}
    ],
    where:[
      {id:'ward', t:'in the hospital ward'},
      {id:'between', t:'between the beds', doing:['walks','carries','checks','glows']},
      {id:'bed', t:'in a narrow bed', who:['soldier']},
      {id:'table', t:'at the wooden table', who:['nurse'], doing:['folds']},
      {id:'army', t:'in the army hospital'}
    ],
    describe:[
      {id:'kind', t:'kind', who:['nurse']},
      {id:'busy', t:'busy', who:['nurse']},
      {id:'tired', t:'tired', who:['soldier','nurse']},
      {id:'brave', t:'brave', who:['soldier']},
      {id:'thankful', t:'thankful', who:['soldier']},
      {id:'small', t:'small', who:['lamp']},
      {id:'bright', t:'bright', who:['lamp']}
    ],
    how:[
      {id:'gently', t:'gently', doing:['carries','cares','checks','folds']},
      {id:'quietly', t:'quietly', doing:['walks','sleeps','rests','watches']},
      {id:'carefully', t:'carefully', doing:['carries','folds','checks']},
      {id:'slowly', t:'slowly', doing:['walks']},
      {id:'peacefully', t:'peacefully', doing:['sleeps','rests']},
      {id:'softly', t:'softly', doing:['glows','flickers']}
    ],
    when:[
      {id:'night', t:'at night'},
      {id:'every', t:'every night'},
      {id:'dark', t:'in the dark'},
      {id:'dawn', t:'before dawn'}
    ]
  },
  {
    id:'pepys', title:'Samuel Pepys and the cheese (Y2)', img:'images/history-pepys.jpg',
    who:[
      {id:'pepys', det:'', t:'Samuel Pepys', person:true},
      {id:'servant', det:'the', t:'servant', person:true},
      {id:'cat', det:'the', t:'cat'},
      {id:'fire', det:'the', t:'fire'},
      {id:'smoke', det:'the', t:'smoke'}
    ],
    doing:[
      {id:'buries', t:'buries', needs:'what', who:['pepys','servant']},
      {id:'hides', t:'hides', needs:'what', who:['pepys']},
      {id:'kneels', t:'kneels', needs:'none', who:['pepys']},
      {id:'digs', t:'digs', needs:'what', who:['servant']},
      {id:'holds', t:'holds', needs:'what', who:['pepys','servant']},
      {id:'watches', t:'watches', needs:'what', who:['pepys','cat']},
      {id:'sits', t:'sits', needs:'none', who:['cat']},
      {id:'burns', t:'burns', needs:'none', who:['fire']},
      {id:'spreads', t:'spreads', needs:'none', who:['fire']},
      {id:'rises', t:'rises', needs:'none', who:['smoke']},
      {id:'drifts', t:'drifts', needs:'none', who:['smoke']}
    ],
    what:[
      {id:'cheese', t:'a wheel of cheese', doing:['buries','hides','holds']},
      {id:'wine', t:'bottles of wine', doing:['buries','hides']},
      {id:'hole', t:'a deep hole', doing:['digs']},
      {id:'spade', t:'a spade', doing:['holds'], who:['servant']},
      {id:'fire', t:'the fire', doing:['watches']},
      {id:'men', t:'the two men', doing:['watches'], who:['cat']}
    ],
    where:[
      {id:'garden', t:'in the garden', who:['pepys','servant','cat']},
      {id:'ground', t:'in the ground', doing:['buries','hides']},
      {id:'wall', t:'on the garden wall', who:['cat']},
      {id:'city', t:'across the city', doing:['burns','spreads','drifts']},
      {id:'sky', t:'into the sky', doing:['rises']},
      {id:'london', t:'over London', doing:['rises','drifts']}
    ],
    describe:[
      {id:'strong', t:'strong', who:['servant']},
      {id:'busy', t:'busy', who:['servant']},
      {id:'curious', t:'curious', who:['cat']},
      {id:'stripy', t:'stripy', who:['cat']},
      {id:'roaring', t:'roaring', who:['fire']},
      {id:'enormous', t:'enormous', who:['fire']},
      {id:'thick', t:'thick', who:['smoke']},
      {id:'grey', t:'grey', who:['smoke']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['buries','hides','holds','kneels']},
      {id:'quickly', t:'quickly', doing:['digs','buries','spreads']},
      {id:'secretly', t:'secretly', doing:['buries','hides']},
      {id:'nervously', t:'nervously', doing:['watches','kneels','sits']},
      {id:'fiercely', t:'fiercely', doing:['burns','spreads']},
      {id:'slowly', t:'slowly', doing:['rises','drifts']}
    ],
    when:[
      {id:'evening', t:'in the evening'},
      {id:'tonight', t:'tonight'},
      {id:'before', t:'before the fire arrives'},
      {id:'sunset', t:'at sunset'}
    ]
  },
  {
    id:'globe', title:'The Globe Theatre (Y3)', img:'images/history-globe.jpg',
    who:[
      {id:'actor', det:'the', t:'actor', person:true},
      {id:'boy', det:'the', t:'boy actor', person:true},
      {id:'musician', det:'the', t:'musician', person:true},
      {id:'seller', det:'the', t:'apple seller', person:true},
      {id:'crowd', det:'the', t:'crowd', person:true}
    ],
    doing:[
      {id:'performs', t:'performs', who:['actor','boy']},
      {id:'speaks', t:'speaks', needs:'none', who:['actor']},
      {id:'listens', t:'listens', needs:'none', who:['boy','crowd']},
      {id:'wears', t:'wears', needs:'what', who:['actor','boy']},
      {id:'plays', t:'plays', needs:'what', who:['musician']},
      {id:'sells', t:'sells', needs:'what', who:['seller']},
      {id:'offers', t:'offers', needs:'what', who:['seller']},
      {id:'watches', t:'watches', needs:'what', who:['crowd','seller']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd']},
      {id:'claps', t:'claps', needs:'none', who:['crowd']}
    ],
    what:[
      {id:'crown', t:'a golden crown', doing:['wears'], who:['actor']},
      {id:'gown', t:'a long gown', doing:['wears'], who:['boy']},
      {id:'lute', t:'the lute', doing:['plays']},
      {id:'tune', t:'a merry tune', doing:['plays']},
      {id:'apples', t:'red apples', doing:['sells','offers']},
      {id:'play', t:'a play', doing:['performs','watches']},
      {id:'actors', t:'the actors', doing:['watches']}
    ],
    where:[
      {id:'stage', t:'on the stage', who:['actor','boy']},
      {id:'yard', t:'in the yard', who:['crowd','seller']},
      {id:'balcony', t:'on the balcony', who:['musician']},
      {id:'globe', t:'in the Globe Theatre'},
      {id:'below', t:'below the stage', who:['crowd','seller']}
    ],
    describe:[
      {id:'proud', t:'proud', who:['actor']},
      {id:'loud', t:'loud', who:['actor','crowd']},
      {id:'young', t:'young', who:['boy']},
      {id:'shy', t:'shy', who:['boy']},
      {id:'skilful', t:'skilful', who:['musician','actor']},
      {id:'cheerful', t:'cheerful', who:['seller','musician']},
      {id:'excited', t:'excited', who:['crowd']},
      {id:'noisy', t:'noisy', who:['crowd']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['speaks','cheers','claps','performs']},
      {id:'proudly', t:'proudly', doing:['performs','speaks','wears']},
      {id:'sweetly', t:'sweetly', doing:['plays']},
      {id:'cheerfully', t:'cheerfully', doing:['sells','offers','plays','cheers']},
      {id:'quietly', t:'quietly', doing:['listens','watches']},
      {id:'carefully', t:'carefully', doing:['listens','watches']}
    ],
    when:[
      {id:'afternoon', t:'this afternoon'},
      {id:'two', t:"at two o'clock"},
      {id:'week', t:'every week'},
      {id:'lunch', t:'after lunch'}
    ]
  },
  {
    id:'civilwar', title:'English Civil War camp (Y3)', img:'images/history-civilwar.jpg',
    who:[
      {id:'pikeman', det:'the', t:'pikeman', person:true},
      {id:'drummer', det:'the', t:'drummer boy', person:true},
      {id:'soldier', det:'the', t:'soldier', person:true},
      {id:'horseman', det:'the', t:'horseman', person:true},
      {id:'horse', det:'the', t:'horse'},
      {id:'campfire', det:'the', t:'campfire'}
    ],
    doing:[
      {id:'holds', t:'holds', needs:'what', who:['pikeman','horseman']},
      {id:'stands', t:'stands', needs:'none', who:['pikeman','horse']},
      {id:'waits', t:'waits', needs:'none', who:['pikeman','horse']},
      {id:'beats', t:'beats', needs:'what', who:['drummer']},
      {id:'practises', t:'practises', needs:'none', who:['drummer']},
      {id:'stirs', t:'stirs', needs:'what', who:['soldier']},
      {id:'cooks', t:'cooks', needs:'what', who:['soldier']},
      {id:'strokes', t:'strokes', needs:'what', who:['horseman']},
      {id:'feeds', t:'feeds', needs:'what', who:['horseman']},
      {id:'burns', t:'burns', needs:'none', who:['campfire']},
      {id:'crackles', t:'crackles', needs:'none', who:['campfire']}
    ],
    what:[
      {id:'pike', t:'a long pike', doing:['holds'], who:['pikeman']},
      {id:'reins', t:'the reins', doing:['holds'], who:['horseman']},
      {id:'drum', t:'a wooden drum', doing:['beats']},
      {id:'pot', t:'the iron pot', doing:['stirs']},
      {id:'porridge', t:'thick porridge', doing:['stirs','cooks']},
      {id:'horse', t:'the brown horse', doing:['strokes','feeds']}
    ],
    where:[
      {id:'camp', t:'in the army camp'},
      {id:'tents', t:'beside the tents', who:['pikeman','drummer','soldier','horseman','horse']},
      {id:'fire', t:'by the campfire', who:['soldier']},
      {id:'field', t:'in the green field'},
      {id:'under', t:'under the pot', who:['campfire']}
    ],
    describe:[
      {id:'tall', t:'tall', who:['pikeman','horse']},
      {id:'young', t:'young', who:['drummer']},
      {id:'brave', t:'brave', who:['pikeman','drummer','horseman']},
      {id:'hungry', t:'hungry', who:['soldier','horse']},
      {id:'patient', t:'patient', who:['horse','pikeman']},
      {id:'brown', t:'brown', who:['horse']},
      {id:'hot', t:'hot', who:['campfire']},
      {id:'crackling', t:'crackling', who:['campfire']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['beats','crackles']},
      {id:'steadily', t:'steadily', doing:['beats','practises','stirs','burns']},
      {id:'patiently', t:'patiently', doing:['waits','stands']},
      {id:'gently', t:'gently', doing:['strokes','feeds']},
      {id:'slowly', t:'slowly', doing:['stirs','cooks']},
      {id:'firmly', t:'firmly', doing:['holds']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'breakfast', t:'before breakfast'},
      {id:'morning', t:'every morning'},
      {id:'march', t:'before the march'}
    ]
  },
  {
    id:'lindisfarne', title:'Vikings reach Lindisfarne (Y4)', img:'images/history-lindisfarne.jpg',
    who:[
      {id:'oldmonk', det:'the', t:'old monk', person:true},
      {id:'youngmonk', det:'the', t:'young monk', person:true},
      {id:'monk', det:'a', t:'monk', person:true},
      {id:'longship', det:'a', t:'longship'},
      {id:'wind', det:'the', t:'wind'}
    ],
    doing:[
      {id:'rings', t:'rings', needs:'what', who:['oldmonk']},
      {id:'carries', t:'carries', needs:'what', who:['youngmonk']},
      {id:'protects', t:'protects', needs:'what', who:['youngmonk']},
      {id:'hurries', t:'hurries', needs:'none', who:['oldmonk','youngmonk','monk']},
      {id:'points', t:'points at', needs:'what', who:['monk']},
      {id:'warns', t:'warns', needs:'what', who:['oldmonk','monk']},
      {id:'sails', t:'sails', needs:'none', who:['longship']},
      {id:'approaches', t:'approaches', needs:'what', who:['longship']},
      {id:'blows', t:'blows', needs:'none', who:['wind']},
      {id:'howls', t:'howls', needs:'none', who:['wind']}
    ],
    what:[
      {id:'bell', t:'the bell', doing:['rings']},
      {id:'books', t:'the precious books', doing:['carries','protects']},
      {id:'chest', t:'a wooden chest', doing:['carries','protects']},
      {id:'ships', t:'the longships', doing:['points']},
      {id:'brothers', t:'the other monks', doing:['warns']},
      {id:'island', t:'the island', doing:['approaches']},
      {id:'monastery', t:'the monastery', doing:['approaches']}
    ],
    where:[
      {id:'path', t:'up the path', doing:['hurries','carries']},
      {id:'church', t:'towards the church', doing:['hurries','carries']},
      {id:'sea', t:'across the grey sea', who:['longship']},
      {id:'shore', t:'towards the shore', doing:['sails']},
      {id:'island', t:'on the island', who:['oldmonk','youngmonk','monk']},
      {id:'grass', t:'over the grass', doing:['blows','howls']}
    ],
    describe:[
      {id:'worried', t:'worried', who:['oldmonk','youngmonk','monk']},
      {id:'frightened', t:'frightened', who:['youngmonk','monk']},
      {id:'wise', t:'wise', who:['oldmonk']},
      {id:'bearded', t:'bearded', who:['oldmonk']},
      {id:'fast', t:'fast', who:['longship']},
      {id:'striped', t:'striped', who:['longship']},
      {id:'cold', t:'cold', who:['wind']},
      {id:'strong', t:'strong', who:['wind']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['hurries','carries','sails']},
      {id:'loudly', t:'loudly', doing:['rings','warns','howls']},
      {id:'urgently', t:'urgently', doing:['warns','points','rings']},
      {id:'carefully', t:'carefully', doing:['carries','protects']},
      {id:'fiercely', t:'fiercely', doing:['blows','howls']},
      {id:'silently', t:'silently', doing:['sails','approaches']}
    ],
    when:[
      {id:'morning', t:'this morning'},
      {id:'suddenly', t:'suddenly'},
      {id:'storm', t:'before the storm'},
      {id:'light', t:'at first light'}
    ]
  },
  {
    id:'alfred', title:'Alfred the Great builds a burh (Y4)', img:'images/history-alfred.jpg',
    who:[
      {id:'alfred', det:'', t:'King Alfred', person:true},
      {id:'worker', det:'the', t:'worker', person:true},
      {id:'carpenter', det:'the', t:'carpenter', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'ox', det:'the', t:'ox'}
    ],
    doing:[
      {id:'points', t:'points at', needs:'what', who:['alfred']},
      {id:'watches', t:'watches', needs:'what', who:['alfred']},
      {id:'orders', t:'gives orders', needs:'none', who:['alfred']},
      {id:'digs', t:'digs', needs:'what', who:['worker']},
      {id:'hammers', t:'hammers', needs:'what', who:['carpenter']},
      {id:'builds', t:'builds', needs:'what', who:['carpenter','worker']},
      {id:'carries', t:'carries', needs:'what', who:['woman']},
      {id:'pulls', t:'pulls', needs:'what', who:['ox']},
      {id:'plods', t:'plods', needs:'none', who:['ox']}
    ],
    what:[
      {id:'ditch', t:'a deep ditch', doing:['digs','points','watches']},
      {id:'posts', t:'the wooden posts', doing:['hammers']},
      {id:'fence', t:'a tall fence', doing:['builds','points','watches'], who:['carpenter','alfred']},
      {id:'bank', t:'an earth bank', doing:['builds','watches'], who:['worker','alfred']},
      {id:'turf', t:'a basket of turf', doing:['carries']},
      {id:'cart', t:'a cart of logs', doing:['pulls']},
      {id:'workers', t:'the workers', doing:['watches','points']}
    ],
    where:[
      {id:'hill', t:'on the hill', who:['alfred']},
      {id:'inditch', t:'in the ditch', who:['worker']},
      {id:'town', t:'around the town', doing:['builds','digs']},
      {id:'wall', t:'along the wall', doing:['hammers','builds','carries','plods','pulls']},
      {id:'river', t:'near the river'},
      {id:'track', t:'along the track', who:['ox','woman']}
    ],
    describe:[
      {id:'strong', t:'strong', who:['worker','carpenter','ox']},
      {id:'muddy', t:'muddy', who:['worker']},
      {id:'tired', t:'tired', who:['worker','woman']},
      {id:'skilful', t:'skilful', who:['carpenter']},
      {id:'busy', t:'busy', who:['woman','carpenter']},
      {id:'brown', t:'brown', who:['ox']},
      {id:'heavy', t:'heavy', who:['ox']}
    ],
    how:[
      {id:'hard', t:'hard', doing:['digs','hammers','builds']},
      {id:'carefully', t:'carefully', doing:['builds','hammers','carries','watches']},
      {id:'slowly', t:'slowly', doing:['plods','pulls','carries']},
      {id:'proudly', t:'proudly', doing:['watches','points']},
      {id:'wisely', t:'wisely', doing:['orders']},
      {id:'loudly', t:'loudly', doing:['hammers','orders']}
    ],
    when:[
      {id:'day', t:'every day'},
      {id:'winter', t:'before winter'},
      {id:'morning', t:'all morning'},
      {id:'vikings', t:'before the Vikings return'}
    ]
  },
  {
    id:'legion', title:'Roman legion on the march (Y5)', img:'images/history-legion.jpg',
    who:[
      {id:'centurion', det:'the', t:'centurion', person:true},
      {id:'soldier', det:'the', t:'legionary', person:true},
      {id:'standard', det:'the', t:'standard bearer', person:true},
      {id:'builder', det:'the', t:'road builder', person:true},
      {id:'horse', det:'the', t:'horse'}
    ],
    doing:[
      {id:'marches', t:'marches', needs:'none', who:['centurion','soldier','standard']},
      {id:'leads', t:'leads', needs:'what', who:['centurion']},
      {id:'carries', t:'carries', needs:'what', who:['soldier','standard']},
      {id:'holds', t:'holds', needs:'what', who:['centurion','standard']},
      {id:'lays', t:'lays', needs:'what', who:['builder']},
      {id:'hammers', t:'hammers', needs:'what', who:['builder']},
      {id:'pulls', t:'pulls', needs:'what', who:['horse']},
      {id:'plods', t:'plods', needs:'none', who:['horse']}
    ],
    what:[
      {id:'legion', t:'the legion', doing:['leads']},
      {id:'shield', t:'a red shield', doing:['carries'], who:['soldier']},
      {id:'pack', t:'a heavy pack', doing:['carries'], who:['soldier']},
      {id:'eagle', t:'the golden eagle', doing:['holds','carries'], who:['standard']},
      {id:'stick', t:'a vine stick', doing:['holds'], who:['centurion']},
      {id:'slabs', t:'flat stone slabs', doing:['lays']},
      {id:'stones', t:'the paving stones', doing:['hammers','lays']},
      {id:'cart', t:'a cart of gravel', doing:['pulls']}
    ],
    where:[
      {id:'road', t:'along the Roman road', doing:['marches','plods','leads','carries','pulls']},
      {id:'fort', t:'towards the fort', doing:['marches','leads','plods','pulls']},
      {id:'side', t:'by the roadside', who:['builder']},
      {id:'britain', t:'across Britain', doing:['marches','leads']},
      {id:'country', t:'through the countryside', doing:['marches','leads','plods','pulls']},
      {id:'march', t:'on the march', who:['centurion','soldier','standard']}
    ],
    describe:[
      {id:'strict', t:'strict', who:['centurion']},
      {id:'proud', t:'proud', who:['centurion','standard']},
      {id:'tired', t:'tired', who:['soldier','horse','builder']},
      {id:'strong', t:'strong', who:['soldier','builder','horse']},
      {id:'disciplined', t:'disciplined', who:['soldier','centurion']},
      {id:'busy', t:'busy', who:['builder']},
      {id:'skilful', t:'skilful', who:['builder']}
    ],
    how:[
      {id:'steadily', t:'steadily', doing:['marches','plods','pulls','carries']},
      {id:'proudly', t:'proudly', doing:['marches','leads','holds','carries']},
      {id:'carefully', t:'carefully', doing:['lays','hammers','carries']},
      {id:'firmly', t:'firmly', doing:['hammers','holds']},
      {id:'instep', t:'in step', doing:['marches']},
      {id:'slowly', t:'slowly', doing:['plods','pulls']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'every', t:'every day'},
      {id:'all', t:'all day'},
      {id:'sunset', t:'before sunset'}
    ]
  },
  {
    id:'nile', title:'Farming by the Nile (Y5)', img:'images/history-nile.jpg',
    who:[
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'ploughman', det:'the', t:'ploughman', person:true},
      {id:'ox', det:'the', t:'ox'},
      {id:'boat', det:'the', t:'boat'},
      {id:'river', det:'the', t:'river'}
    ],
    doing:[
      {id:'lifts', t:'lifts', needs:'what', who:['farmer']},
      {id:'pulls', t:'pulls', needs:'what', who:['farmer','ox']},
      {id:'pours', t:'pours', needs:'what', who:['farmer']},
      {id:'carries', t:'carries', needs:'what', who:['woman']},
      {id:'walks', t:'walks', needs:'none', who:['woman']},
      {id:'ploughs', t:'ploughs', needs:'what', who:['ploughman']},
      {id:'guides', t:'guides', needs:'what', who:['ploughman']},
      {id:'sails', t:'sails', needs:'none', who:['boat']},
      {id:'floats', t:'floats', needs:'none', who:['boat']},
      {id:'flows', t:'flows', needs:'none', who:['river']}
    ],
    what:[
      {id:'water', t:'water', doing:['lifts','pours','carries']},
      {id:'bucket', t:'a bucket', doing:['lifts']},
      {id:'pole', t:'the long pole', doing:['pulls'], who:['farmer']},
      {id:'plough', t:'the wooden plough', doing:['pulls'], who:['ox']},
      {id:'jar', t:'a clay jar', doing:['carries']},
      {id:'field', t:'the field', doing:['ploughs']},
      {id:'oxen', t:'the oxen', doing:['guides']}
    ],
    where:[
      {id:'nile', t:'beside the River Nile', who:['farmer','woman','ploughman','ox','boat']},
      {id:'channel', t:'into the channel', doing:['pours']},
      {id:'fromriver', t:'from the river', doing:['lifts','carries']},
      {id:'field', t:'in the field', who:['ploughman','ox'], doing:['guides','pulls']},
      {id:'down', t:'down the river', who:['boat']},
      {id:'bank', t:'along the riverbank', who:['woman'], doing:['walks','carries']},
      {id:'past', t:'past the fields', who:['river','boat']}
    ],
    describe:[
      {id:'strong', t:'strong', who:['farmer','ploughman','ox']},
      {id:'busy', t:'busy', who:['farmer','woman','ploughman']},
      {id:'muddy', t:'muddy', who:['ploughman','ox']},
      {id:'patient', t:'patient', who:['ox']},
      {id:'white', t:'white', who:['boat']},
      {id:'wide', t:'wide', who:['river']},
      {id:'blue', t:'blue', who:['river']}
    ],
    how:[
      {id:'steadily', t:'steadily', doing:['pulls','ploughs','lifts','flows','sails']},
      {id:'carefully', t:'carefully', doing:['pours','carries','guides','lifts']},
      {id:'slowly', t:'slowly', doing:['walks','ploughs','pulls','floats','sails','flows']},
      {id:'gently', t:'gently', doing:['floats','flows','pours']},
      {id:'gracefully', t:'gracefully', doing:['walks','carries','sails']}
    ],
    when:[
      {id:'flood', t:'after the flood'},
      {id:'morning', t:'every morning'},
      {id:'sun', t:'in the hot sun'},
      {id:'midday', t:'before midday'}
    ]
  },
  {
    id:'stonehenge', title:'Building Stonehenge (Y6)', img:'images/history-stonehenge.jpg',
    who:[
      {id:'team', det:'the', t:'team', person:true},
      {id:'worker', det:'the', t:'worker', person:true},
      {id:'leader', det:'the', t:'leader', person:true},
      {id:'child', det:'the', t:'child', person:true},
      {id:'stone', det:'the', t:'sarsen stone'}
    ],
    doing:[
      {id:'hauls', t:'hauls', needs:'what', who:['team']},
      {id:'pulls', t:'pulls', needs:'what', who:['team']},
      {id:'heaves', t:'heaves', needs:'none', who:['team']},
      {id:'digs', t:'digs', needs:'what', who:['worker']},
      {id:'directs', t:'directs', needs:'what', who:['leader']},
      {id:'points', t:'points at', needs:'what', who:['leader']},
      {id:'carries', t:'carries', needs:'what', who:['child']},
      {id:'slides', t:'slides', needs:'none', who:['stone']},
      {id:'moves', t:'moves', needs:'none', who:['stone']}
    ],
    what:[
      {id:'stone', t:'a giant sarsen stone', doing:['hauls','pulls']},
      {id:'sledge', t:'the wooden sledge', doing:['hauls','pulls']},
      {id:'ropes', t:'the ropes', doing:['pulls']},
      {id:'pit', t:'a deep pit', doing:['digs']},
      {id:'team', t:'the team', doing:['directs']},
      {id:'workers', t:'the workers', doing:['directs','points']},
      {id:'circle', t:'the stone circle', doing:['points']},
      {id:'rope', t:'a bundle of rope', doing:['carries']}
    ],
    where:[
      {id:'plain', t:'across Salisbury Plain', doing:['hauls','pulls','slides','moves']},
      {id:'rollers', t:'over the log rollers', doing:['hauls','slides','moves']},
      {id:'circle', t:'towards the circle', doing:['hauls','pulls','heaves','slides','moves','carries']},
      {id:'chalk', t:'in the white chalk', doing:['digs']},
      {id:'path', t:'beside the path', who:['leader','child']}
    ],
    describe:[
      {id:'strong', t:'strong', who:['team','worker']},
      {id:'tired', t:'tired', who:['team','worker']},
      {id:'muddy', t:'muddy', who:['worker']},
      {id:'wise', t:'wise', who:['leader']},
      {id:'old', t:'old', who:['leader']},
      {id:'helpful', t:'helpful', who:['child']},
      {id:'young', t:'young', who:['child']},
      {id:'enormous', t:'enormous', who:['stone']},
      {id:'grey', t:'grey', who:['stone']}
    ],
    how:[
      {id:'together', t:'together', doing:['hauls','pulls','heaves']},
      {id:'slowly', t:'slowly', doing:['hauls','pulls','slides','moves']},
      {id:'steadily', t:'steadily', doing:['hauls','pulls','digs','heaves']},
      {id:'carefully', t:'carefully', doing:['directs','carries','digs']},
      {id:'loudly', t:'loudly', doing:['directs']}
    ],
    when:[
      {id:'day', t:'all day'},
      {id:'sunrise', t:'at sunrise'},
      {id:'summer', t:'every summer'},
      {id:'midsummer', t:'before midsummer'}
    ]
  },
  {
    id:'agora', title:'The agora in Athens (Y6)', img:'images/history-agora.jpg',
    who:[
      {id:'philosopher', det:'the', t:'philosopher', person:true},
      {id:'student', det:'the', t:'student', person:true},
      {id:'potter', det:'the', t:'potter', person:true},
      {id:'seller', det:'the', t:'olive seller', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'donkey', det:'the', t:'donkey'}
    ],
    doing:[
      {id:'talks', t:'talks', needs:'none', who:['philosopher']},
      {id:'teaches', t:'teaches', needs:'what', who:['philosopher']},
      {id:'listens', t:'listens', needs:'none', who:['student']},
      {id:'asks', t:'asks', needs:'what', who:['student']},
      {id:'sells', t:'sells', needs:'what', who:['potter','seller']},
      {id:'buys', t:'buys', needs:'what', who:['woman']},
      {id:'leads', t:'leads', needs:'what', who:['boy']},
      {id:'carries', t:'carries', needs:'what', who:['donkey']},
      {id:'plods', t:'plods', needs:'none', who:['donkey']}
    ],
    what:[
      {id:'students', t:'the young men', doing:['teaches']},
      {id:'philosophy', t:'philosophy', doing:['teaches']},
      {id:'question', t:'a question', doing:['asks']},
      {id:'vases', t:'painted vases', doing:['sells'], who:['potter']},
      {id:'olives', t:'black olives', doing:['sells','buys'], who:['seller','woman']},
      {id:'figs', t:'baskets of figs', doing:['carries']},
      {id:'donkey', t:'the grey donkey', doing:['leads']}
    ],
    where:[
      {id:'stoa', t:'in the shade of the stoa', who:['philosopher','student','potter']},
      {id:'agora', t:'in the agora'},
      {id:'stall', t:'at the market stall', who:['seller','woman']},
      {id:'square', t:'across the square', who:['boy','donkey']},
      {id:'acropolis', t:'below the Acropolis'}
    ],
    describe:[
      {id:'wise', t:'wise', who:['philosopher']},
      {id:'bearded', t:'bearded', who:['philosopher']},
      {id:'curious', t:'curious', who:['student']},
      {id:'young', t:'young', who:['student','boy']},
      {id:'skilful', t:'skilful', who:['potter']},
      {id:'busy', t:'busy', who:['seller','woman','potter']},
      {id:'grey', t:'grey', who:['donkey']},
      {id:'patient', t:'patient', who:['donkey']}
    ],
    how:[
      {id:'wisely', t:'wisely', doing:['talks','teaches']},
      {id:'carefully', t:'carefully', doing:['listens','carries','leads']},
      {id:'politely', t:'politely', doing:['asks','buys','sells']},
      {id:'loudly', t:'loudly', doing:['sells','talks']},
      {id:'slowly', t:'slowly', doing:['plods','leads','carries']},
      {id:'curiously', t:'curiously', doing:['asks','listens']}
    ],
    when:[
      {id:'morning', t:'every morning'},
      {id:'sun', t:'in the morning sun'},
      {id:'midday', t:'at midday'},
      {id:'assembly', t:'before the assembly'}
    ]
  }
);
