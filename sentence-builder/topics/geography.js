/* Sentence Builder — Geography pictures (CLF Y1–Y6 geography enquiries).
 * Same word-bank schema as content.js (see the notes at the top of that file).
 */
TOPICS.push({
  id:'geography', label:'Geography', years:'Year 1–6', pictures:[
  {
    id:'weather', title:'Wet and windy day (Y1)', img:'images/geography-weather.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'man', det:'the', t:'man', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'wind', det:'the', t:'wind'},
      {id:'rain', det:'the', t:'rain'},
      {id:'umbrella', det:'the', t:'umbrella'},
      {id:'leaf', det:'a', t:'leaf'}
    ],
    doing:[
      {id:'jumps', t:'jumps', needs:'none', who:['girl']},
      {id:'splashes', t:'splashes', needs:'none', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['man']},
      {id:'walks', t:'walks', needs:'none', who:['man','dog']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','man']},
      {id:'barks', t:'barks', needs:'none', who:['dog']},
      {id:'blows', t:'blows', who:['wind']},
      {id:'falls', t:'falls', needs:'none', who:['rain','leaf']},
      {id:'pours', t:'pours down', needs:'none', who:['rain']},
      {id:'flips', t:'turns inside out', needs:'none', who:['umbrella']},
      {id:'swirls', t:'swirls', needs:'none', who:['leaf']}
    ],
    what:[
      {id:'umbrella', t:'an umbrella', doing:['holds']},
      {id:'lead', t:'the dog lead', doing:['holds']},
      {id:'theumbrella', t:'the umbrella', doing:['blows']},
      {id:'leaves', t:'the leaves', doing:['blows']}
    ],
    where:[
      {id:'puddle', t:'in a puddle', who:['girl'], doing:['jumps','splashes']},
      {id:'street', t:'along the street', who:['man','dog','wind','leaf'], doing:['walks','blows','swirls']},
      {id:'pavement', t:'on the pavement', who:['rain','leaf','girl'], doing:['falls','splashes','jumps']},
      {id:'clouds', t:'from the dark clouds', who:['rain']},
      {id:'tree', t:'from the tree', who:['leaf'], doing:['falls']},
      {id:'air', t:'through the air', who:['leaf'], doing:['swirls']},
      {id:'town', t:'in the town'}
    ],
    describe:[
      {id:'wet', t:'wet', who:['girl','man','dog','leaf','umbrella']},
      {id:'happy', t:'happy', who:['girl','man']},
      {id:'excited', t:'excited', who:['girl','dog']},
      {id:'strong', t:'strong', who:['wind']},
      {id:'cold', t:'cold', who:['wind','rain']},
      {id:'heavy', t:'heavy', who:['rain']},
      {id:'black', t:'black', who:['umbrella']},
      {id:'orange', t:'orange', who:['leaf']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['barks','splashes','blows']},
      {id:'hard', t:'hard', doing:['blows','pours']},
      {id:'quickly', t:'quickly', doing:['walks','swirls','falls']},
      {id:'happily', t:'happily', doing:['jumps','splashes','smiles']},
      {id:'tightly', t:'tightly', doing:['holds']},
      {id:'suddenly', t:'suddenly', doing:['flips','blows']}
    ],
    when:[
      {id:'autumn', t:'in autumn'},
      {id:'today', t:'today'},
      {id:'school', t:'after school'},
      {id:'morning', t:'all morning'}
    ]
  },
  {
    id:'guizhou', title:'Rice terraces in China (Y2)', img:'images/geography-guizhou.jpg',
    who:[
      {id:'farmer', det:'the', t:'farmer', person:true},
      {id:'woman', det:'the', t:'woman', person:true},
      {id:'buffalo', det:'the', t:'water buffalo'},
      {id:'mist', det:'the', t:'mist'},
      {id:'water', det:'the', t:'water'}
    ],
    doing:[
      {id:'leads', t:'leads', needs:'what', who:['farmer']},
      {id:'plants', t:'plants', needs:'what', who:['woman']},
      {id:'walks', t:'walks', needs:'none', who:['farmer','buffalo']},
      {id:'works', t:'works', needs:'none', who:['farmer','woman']},
      {id:'bends', t:'bends down', needs:'none', who:['woman']},
      {id:'drifts', t:'drifts', needs:'none', who:['mist']},
      {id:'hangs', t:'hangs', needs:'none', who:['mist']},
      {id:'flows', t:'flows', needs:'none', who:['water']}
    ],
    what:[
      {id:'buffalo', t:'the water buffalo', doing:['leads']},
      {id:'rice', t:'rice seedlings', doing:['plants']}
    ],
    where:[
      {id:'terrace', t:'along the terrace', who:['farmer','buffalo'], doing:['walks','leads','works']},
      {id:'field', t:'in the flooded field', who:['woman']},
      {id:'mountains', t:'over the mountains', who:['mist']},
      {id:'hillside', t:'down the hillside', who:['water']},
      {id:'village', t:'near the village', who:['farmer','woman','buffalo']},
      {id:'guizhou', t:'in Guizhou'}
    ],
    describe:[
      {id:'hardworking', t:'hard-working', who:['farmer','woman']},
      {id:'patient', t:'patient', who:['farmer','woman']},
      {id:'strong', t:'strong', who:['buffalo']},
      {id:'heavy', t:'heavy', who:['buffalo']},
      {id:'grey', t:'grey', who:['buffalo','mist']},
      {id:'thick', t:'thick', who:['mist']},
      {id:'muddy', t:'muddy', who:['water','buffalo']},
      {id:'cool', t:'cool', who:['water','mist']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','leads','drifts','flows']},
      {id:'carefully', t:'carefully', doing:['plants','leads']},
      {id:'gently', t:'gently', doing:['leads','flows','drifts']},
      {id:'steadily', t:'steadily', doing:['works','walks','flows']},
      {id:'quickly', t:'quickly', doing:['plants','flows']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'spring', t:'in spring'},
      {id:'morning', t:'this morning'},
      {id:'rain', t:'after the rain'}
    ]
  },
  {
    id:'spain', title:'Mediterranean coast of Spain (Y3)', img:'images/geography-spain.jpg',
    who:[
      {id:'fisherman', det:'the', t:'fisherman', person:true},
      {id:'swimmer', det:'the', t:'swimmer', person:true},
      {id:'boat', det:'the', t:'fishing boat'},
      {id:'village', det:'the', t:'village'},
      {id:'sun', det:'the', t:'sun'},
      {id:'sea', det:'the', t:'sea'}
    ],
    doing:[
      {id:'mends', t:'mends', needs:'what', who:['fisherman']},
      {id:'sits', t:'sits', needs:'none', who:['fisherman','village']},
      {id:'swims', t:'swims', needs:'none', who:['swimmer']},
      {id:'floats', t:'floats', needs:'none', who:['swimmer']},
      {id:'rests', t:'rests', needs:'none', who:['boat']},
      {id:'shines', t:'shines', needs:'none', who:['sun']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['sea']},
      {id:'laps', t:'laps', needs:'none', who:['sea']}
    ],
    what:[
      {id:'net', t:'a fishing net', doing:['mends']},
      {id:'oldnet', t:'an old net', doing:['mends']}
    ],
    where:[
      {id:'sand', t:'on the sand', who:['fisherman','boat']},
      {id:'beside', t:'beside the boat', who:['fisherman']},
      {id:'hillside', t:'on the rocky hillside', who:['village']},
      {id:'sea', t:'in the turquoise sea', who:['swimmer']},
      {id:'rocks', t:'against the rocks', who:['sea'], doing:['laps']},
      {id:'bay', t:'over the bay', who:['sun']},
      {id:'coast', t:'on the coast of Spain'}
    ],
    describe:[
      {id:'patient', t:'patient', who:['fisherman']},
      {id:'old', t:'old', who:['fisherman','boat','village']},
      {id:'calm', t:'calm', who:['sea','swimmer']},
      {id:'turquoise', t:'turquoise', who:['sea']},
      {id:'wooden', t:'wooden', who:['boat']},
      {id:'white', t:'white', who:['village']},
      {id:'hot', t:'hot', who:['sun']},
      {id:'bright', t:'bright', who:['sun']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['mends']},
      {id:'slowly', t:'slowly', doing:['mends','swims','laps']},
      {id:'gently', t:'gently', doing:['laps','floats']},
      {id:'brightly', t:'brightly', doing:['shines','sparkles']},
      {id:'quietly', t:'quietly', doing:['sits','rests','mends']},
      {id:'happily', t:'happily', doing:['swims','floats']}
    ],
    when:[
      {id:'summer', t:'in summer'},
      {id:'afternoon', t:'this afternoon'},
      {id:'hot', t:'on a hot day'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'london', title:'London and the Thames (Y4)', img:'images/geography-london.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'grandad', det:'', t:'Grandad', person:true},
      {id:'bus', det:'the', t:'bus'},
      {id:'boat', det:'the', t:'tourist boat'},
      {id:'river', det:'', t:'the River Thames'},
      {id:'pigeon', det:'the', t:'pigeon'}
    ],
    doing:[
      {id:'looks', t:'looks at', needs:'what', who:['girl','grandad']},
      {id:'points', t:'points at', needs:'what', who:['girl']},
      {id:'stands', t:'stands', needs:'none', who:['girl','grandad']},
      {id:'crosses', t:'crosses', needs:'what', who:['bus']},
      {id:'carries', t:'carries', needs:'what', who:['bus','boat']},
      {id:'sails', t:'sails', needs:'none', who:['boat']},
      {id:'flows', t:'flows', needs:'none', who:['river']},
      {id:'pecks', t:'pecks', needs:'none', who:['pigeon']}
    ],
    what:[
      {id:'bridge', t:'the bridge', doing:['looks','points','crosses']},
      {id:'boat', t:'the tourist boat', doing:['looks','points']},
      {id:'bus', t:'the red bus', doing:['looks','points']},
      {id:'tower', t:'the Tower of London', doing:['looks','points']},
      {id:'passengers', t:'passengers', doing:['carries']}
    ],
    where:[
      {id:'under', t:'under Tower Bridge', who:['boat','river']},
      {id:'over', t:'over the river', who:['bus']},
      {id:'riverside', t:'by the riverside', who:['girl','grandad','pigeon']},
      {id:'through', t:'through London', who:['river','boat']},
      {id:'thames', t:'on the River Thames', who:['boat']},
      {id:'london', t:'in London'}
    ],
    describe:[
      {id:'curious', t:'curious', who:['girl']},
      {id:'excited', t:'excited', who:['girl']},
      {id:'red', t:'red', who:['bus']},
      {id:'double', t:'double-decker', who:['bus']},
      {id:'busy', t:'busy', who:['bus','boat']},
      {id:'white', t:'white', who:['boat']},
      {id:'grey', t:'grey', who:['pigeon']},
      {id:'hungry', t:'hungry', who:['pigeon']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['sails','flows','crosses','carries']},
      {id:'excitedly', t:'excitedly', doing:['points','looks']},
      {id:'carefully', t:'carefully', doing:['looks','crosses']},
      {id:'quickly', t:'quickly', doing:['pecks','sails']},
      {id:'gently', t:'gently', doing:['flows','sails']},
      {id:'proudly', t:'proudly', doing:['stands','looks']}
    ],
    when:[
      {id:'morning', t:'this morning'},
      {id:'today', t:'today'},
      {id:'holiday', t:'on holiday'},
      {id:'breakfast', t:'after breakfast'}
    ]
  },
  {
    id:'amazon', title:'Amazon rainforest, Peru (Y4)', img:'images/geography-amazon.jpg',
    who:[
      {id:'man', det:'the', t:'man', person:true},
      {id:'canoe', det:'the', t:'canoe'},
      {id:'toucan', det:'the', t:'toucan'},
      {id:'sloth', det:'the', t:'sloth'},
      {id:'river', det:'the', t:'Amazon river'},
      {id:'mist', det:'the', t:'mist'}
    ],
    doing:[
      {id:'paddles', t:'paddles', who:['man']},
      {id:'glides', t:'glides', needs:'none', who:['canoe']},
      {id:'perches', t:'perches', needs:'none', who:['toucan']},
      {id:'flies', t:'flies', needs:'none', who:['toucan']},
      {id:'hangs', t:'hangs', needs:'none', who:['sloth']},
      {id:'sleeps', t:'sleeps', needs:'none', who:['sloth']},
      {id:'climbs', t:'climbs', needs:'none', who:['sloth']},
      {id:'eats', t:'eats', who:['toucan','sloth']},
      {id:'flows', t:'flows', needs:'none', who:['river']},
      {id:'rises', t:'rises', needs:'none', who:['mist']}
    ],
    what:[
      {id:'canoe', t:'the canoe', doing:['paddles']},
      {id:'fruit', t:'fruit', doing:['eats'], who:['toucan']},
      {id:'leaves', t:'leaves', doing:['eats'], who:['sloth']}
    ],
    where:[
      {id:'along', t:'along the river', who:['man','canoe']},
      {id:'branch', t:'on a branch', who:['toucan','sloth'], doing:['perches','hangs','sleeps','eats']},
      {id:'from', t:'from a branch', who:['sloth'], doing:['hangs']},
      {id:'above', t:'above the river', who:['toucan','mist'], doing:['flies','rises']},
      {id:'through', t:'through the rainforest', who:['river','man','canoe','toucan'], doing:['flows','paddles','glides','flies']},
      {id:'rainforest', t:'in the rainforest'}
    ],
    describe:[
      {id:'calm', t:'calm', who:['man','river']},
      {id:'strong', t:'strong', who:['man']},
      {id:'colourful', t:'colourful', who:['toucan']},
      {id:'sleepy', t:'sleepy', who:['sloth']},
      {id:'furry', t:'furry', who:['sloth']},
      {id:'wide', t:'wide', who:['river']},
      {id:'brown', t:'brown', who:['river','sloth']},
      {id:'wooden', t:'wooden', who:['canoe']},
      {id:'long', t:'long', who:['canoe','river']},
      {id:'white', t:'white', who:['mist']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['paddles','glides','flows','climbs','eats']},
      {id:'quietly', t:'quietly', doing:['glides','paddles','sleeps']},
      {id:'lazily', t:'lazily', doing:['hangs','sleeps']},
      {id:'steadily', t:'steadily', doing:['paddles','flows']},
      {id:'quickly', t:'quickly', doing:['flies']},
      {id:'gently', t:'gently', doing:['rises','flows','glides']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'morning', t:'in the morning'},
      {id:'rain', t:'after the rain'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'river', title:'River from source to sea (Y5)', img:'images/geography-river.jpg',
    who:[
      {id:'river', det:'the', t:'river'},
      {id:'stream', det:'the', t:'mountain stream'},
      {id:'waterfall', det:'the', t:'waterfall'},
      {id:'heron', det:'the', t:'heron'}
    ],
    doing:[
      {id:'flows', t:'flows', needs:'none', who:['river','stream']},
      {id:'meanders', t:'meanders', needs:'none', who:['river']},
      {id:'tumbles', t:'tumbles', needs:'none', who:['stream','waterfall']},
      {id:'crashes', t:'crashes', needs:'none', who:['waterfall']},
      {id:'erodes', t:'erodes', needs:'what', who:['river','stream','waterfall']},
      {id:'carries', t:'carries', needs:'what', who:['river','stream']},
      {id:'stands', t:'stands', needs:'none', who:['heron']},
      {id:'catches', t:'catches', needs:'what', who:['heron']}
    ],
    what:[
      {id:'rock', t:'the rock', doing:['erodes'], who:['stream','waterfall']},
      {id:'bank', t:'the riverbank', doing:['erodes'], who:['river']},
      {id:'stones', t:'soil and stones', doing:['carries']},
      {id:'fish', t:'a fish', doing:['catches']}
    ],
    where:[
      {id:'down', t:'down the mountain', who:['stream'], doing:['flows','tumbles','carries']},
      {id:'rocks', t:'over the rocks', who:['waterfall','stream'], doing:['tumbles','crashes','flows']},
      {id:'floodplain', t:'across the floodplain', who:['river'], doing:['flows','meanders','carries']},
      {id:'bridge', t:'under the stone bridge', who:['river'], doing:['flows']},
      {id:'sea', t:'towards the sea', who:['river'], doing:['flows','meanders','carries']},
      {id:'shallow', t:'in the shallow water', who:['heron']},
      {id:'valley', t:'in the river valley'}
    ],
    describe:[
      {id:'wide', t:'wide', who:['river']},
      {id:'winding', t:'winding', who:['river']},
      {id:'fast', t:'fast', who:['stream']},
      {id:'narrow', t:'narrow', who:['stream']},
      {id:'noisy', t:'noisy', who:['waterfall','stream']},
      {id:'tall', t:'tall', who:['waterfall','heron']},
      {id:'grey', t:'grey', who:['heron']},
      {id:'patient', t:'patient', who:['heron']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['flows','tumbles','catches'], who:['stream','waterfall','heron']},
      {id:'slowly', t:'slowly', doing:['flows','meanders','erodes','carries'], who:['river']},
      {id:'loudly', t:'loudly', doing:['crashes','tumbles']},
      {id:'gently', t:'gently', doing:['flows','meanders'], who:['river']},
      {id:'patiently', t:'patiently', doing:['stands']},
      {id:'steadily', t:'steadily', doing:['erodes','flows','carries']},
      {id:'still', t:'very still', doing:['stands']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'rain', t:'after heavy rain'},
      {id:'year', t:'all year round'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'savannah', title:'African savannah (Y5)', img:'images/geography-savannah.jpg',
    who:[
      {id:'elephant', det:'the', t:'elephant'},
      {id:'calf', det:'the', t:'elephant calf'},
      {id:'giraffe', det:'the', t:'giraffe'},
      {id:'zebra', det:'the', t:'zebra'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['elephant','calf','giraffe','zebra']},
      {id:'eats', t:'eats', who:['giraffe','elephant','zebra']},
      {id:'drinks', t:'drinks', needs:'none', who:['zebra']},
      {id:'grazes', t:'grazes', needs:'none', who:['zebra']},
      {id:'follows', t:'follows', needs:'what', who:['calf']},
      {id:'stretches', t:'stretches up', needs:'none', who:['giraffe']},
      {id:'beats', t:'beats down', needs:'none', who:['sun']}
    ],
    what:[
      {id:'acacia', t:'acacia leaves', doing:['eats'], who:['giraffe']},
      {id:'grass', t:'dry grass', doing:['eats'], who:['elephant','zebra']},
      {id:'mother', t:'its mother', doing:['follows']}
    ],
    where:[
      {id:'across', t:'across the savannah', who:['elephant','calf','giraffe','zebra'], doing:['walks','follows']},
      {id:'waterhole', t:'at the waterhole', who:['zebra'], doing:['drinks']},
      {id:'tree', t:'from a flat-topped tree', who:['giraffe'], doing:['eats']},
      {id:'grass', t:'in the long grass', who:['elephant','calf','zebra'], doing:['walks','eats','grazes','follows']},
      {id:'plain', t:'on the wide plain', who:['sun'], doing:['beats']},
      {id:'kenya', t:'in Kenya'}
    ],
    describe:[
      {id:'huge', t:'huge', who:['elephant']},
      {id:'grey', t:'grey', who:['elephant','calf']},
      {id:'young', t:'young', who:['calf']},
      {id:'small', t:'small', who:['calf']},
      {id:'tall', t:'tall', who:['giraffe']},
      {id:'spotty', t:'spotty', who:['giraffe']},
      {id:'stripy', t:'stripy', who:['zebra']},
      {id:'thirsty', t:'thirsty', who:['zebra','elephant','calf']},
      {id:'hot', t:'hot', who:['sun']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['walks','eats','follows','grazes','drinks']},
      {id:'carefully', t:'carefully', doing:['follows','walks']},
      {id:'calmly', t:'calmly', doing:['walks','eats','grazes','drinks']},
      {id:'fiercely', t:'fiercely', doing:['beats']},
      {id:'gracefully', t:'gracefully', doing:['walks','stretches'], who:['giraffe']},
      {id:'thirstily', t:'thirstily', doing:['drinks']}
    ],
    when:[
      {id:'dry', t:'in the dry season'},
      {id:'every', t:'every day'},
      {id:'afternoon', t:'this afternoon'},
      {id:'midday', t:'at midday'}
    ]
  },
  {
    id:'highlands', title:'Scottish Highlands (Y6)', img:'images/geography-highlands.jpg',
    who:[
      {id:'stag', det:'the', t:'stag'},
      {id:'hiker', det:'the', t:'hiker', person:true},
      {id:'castle', det:'the', t:'castle'},
      {id:'loch', det:'the', t:'loch'},
      {id:'cloud', det:'the', t:'cloud'}
    ],
    doing:[
      {id:'stands', t:'stands', needs:'none', who:['stag','hiker','castle']},
      {id:'walks', t:'walks', needs:'none', who:['hiker']},
      {id:'looks', t:'looks at', needs:'what', who:['stag','hiker']},
      {id:'carries', t:'carries', needs:'what', who:['hiker']},
      {id:'roars', t:'roars', needs:'none', who:['stag']},
      {id:'grazes', t:'grazes', needs:'none', who:['stag']},
      {id:'reflects', t:'reflects', needs:'what', who:['loch']},
      {id:'lies', t:'lies', needs:'none', who:['loch']},
      {id:'covers', t:'covers', needs:'what', who:['cloud']},
      {id:'drifts', t:'drifts', needs:'none', who:['cloud']}
    ],
    what:[
      {id:'loch', t:'the loch', doing:['looks']},
      {id:'castle', t:'the castle', doing:['looks','reflects']},
      {id:'mountains', t:'the mountains', doing:['looks','reflects']},
      {id:'rucksack', t:'a rucksack', doing:['carries']},
      {id:'tops', t:'the mountain tops', doing:['covers']}
    ],
    where:[
      {id:'hillside', t:'on the hillside', who:['stag','hiker']},
      {id:'heather', t:'among the heather', who:['stag','hiker']},
      {id:'path', t:'along the path', who:['hiker'], doing:['walks','carries']},
      {id:'island', t:'on a small island', who:['castle']},
      {id:'between', t:'between the mountains', who:['loch','cloud'], doing:['lies','drifts']},
      {id:'highlands', t:'in the Highlands'}
    ],
    describe:[
      {id:'proud', t:'proud', who:['stag']},
      {id:'brown', t:'brown', who:['stag']},
      {id:'tired', t:'tired', who:['hiker']},
      {id:'old', t:'old', who:['castle']},
      {id:'stone', t:'stone', who:['castle']},
      {id:'calm', t:'calm', who:['loch','hiker']},
      {id:'deep', t:'deep', who:['loch']},
      {id:'long', t:'long', who:['loch']},
      {id:'grey', t:'grey', who:['cloud','castle']},
      {id:'low', t:'low', who:['cloud']}
    ],
    how:[
      {id:'proudly', t:'proudly', doing:['stands','roars','looks']},
      {id:'loudly', t:'loudly', doing:['roars']},
      {id:'slowly', t:'slowly', doing:['walks','drifts','grazes']},
      {id:'quietly', t:'quietly', doing:['walks','grazes','stands','looks','lies']},
      {id:'perfectly', t:'perfectly', doing:['reflects']},
      {id:'steadily', t:'steadily', doing:['walks','carries']}
    ],
    when:[
      {id:'autumn', t:'in autumn'},
      {id:'morning', t:'this morning'},
      {id:'rain', t:'after the rain'},
      {id:'today', t:'today'}
    ]
  }
]});
