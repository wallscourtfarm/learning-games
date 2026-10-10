/* Sentence Builder — more Science and Geography pictures (CLF Y1–Y6 enquiries).
 * Added to the existing 'science' and 'geography' topics, so load this after science.js
 * and geography.js. Same word-bank schema as content.js (see the notes at the top of that file).
 */
TOPICS.find(t => t.id === 'science').pictures.push(
  {
    id:'waterproof', title:'Waterproof test (Y1)', img:'images/science-waterproof.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'water', det:'the', t:'water'},
      {id:'foil', det:'the', t:'foil'},
      {id:'paper', det:'the', t:'paper towel'},
      {id:'teddy', det:'the', t:'teddy'}
    ],
    doing:[
      {id:'pours', t:'pours', needs:'what', who:['girl']},
      {id:'tests', t:'tests', needs:'what', who:['girl','boy']},
      {id:'looks', t:'looks at', needs:'what', who:['girl','boy']},
      {id:'drips', t:'drips', needs:'none', who:['water','paper']},
      {id:'soaks', t:'soaks into', needs:'what', who:['water']},
      {id:'waterproof', t:'is waterproof', needs:'none', who:['foil']},
      {id:'soggy', t:'gets soggy', needs:'none', who:['paper']},
      {id:'sits', t:'sits', needs:'none', who:['teddy']},
      {id:'wears', t:'wears', needs:'what', who:['teddy']}
    ],
    what:[
      {id:'water', t:'water', doing:['pours']},
      {id:'foil', t:'the foil', doing:['tests','looks']},
      {id:'paper', t:'the paper towel', doing:['tests','looks','soaks']},
      {id:'each', t:'each material', doing:['tests','looks']},
      {id:'cups', t:'the plastic cups', doing:['looks']},
      {id:'raincoat', t:'a yellow raincoat', doing:['wears']}
    ],
    where:[
      {id:'onto', t:'onto the foil', who:['girl'], doing:['pours']},
      {id:'cup', t:'into the cup', doing:['drips']},
      {id:'table', t:'on the table', who:['girl','boy','teddy'], doing:['tests','looks','sits']},
      {id:'lens', t:'through a hand lens', who:['boy'], doing:['looks']},
      {id:'window', t:'by the rainy window', who:['girl','boy','teddy'], doing:['tests','looks','sits','wears']},
      {id:'classroom', t:'in the classroom', who:['girl','boy','teddy']}
    ],
    describe:[
      {id:'careful', t:'careful', who:['girl','boy']},
      {id:'curious', t:'curious', who:['girl','boy']},
      {id:'shiny', t:'shiny', who:['foil']},
      {id:'crinkly', t:'crinkly', who:['foil']},
      {id:'soggy', t:'soggy', who:['paper']},
      {id:'soft', t:'soft', who:['paper','teddy']},
      {id:'brown', t:'brown', who:['teddy']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['pours','tests','looks']},
      {id:'slowly', t:'slowly', doing:['pours','drips','soaks','soggy']},
      {id:'closely', t:'closely', doing:['looks']},
      {id:'quickly', t:'quickly', doing:['soaks','drips','soggy']},
      {id:'quietly', t:'quietly', doing:['sits','looks']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'lesson', t:'in the science lesson'},
      {id:'rainy', t:'on a rainy day'},
      {id:'lunch', t:'after lunch'}
    ]
  },
  {
    id:'sunflowers', title:'Sunflower garden (Y1)', img:'images/science-sunflowers.jpg',
    who:[
      {id:'gardener', det:'the', t:'gardener', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'sunflower', det:'the', t:'sunflower'},
      {id:'bee', det:'the', t:'bee'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'waters', t:'waters', needs:'what', who:['gardener']},
      {id:'looks', t:'looks up at', needs:'what', who:['girl']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','gardener']},
      {id:'grows', t:'grows', needs:'none', who:['sunflower']},
      {id:'turns', t:'turns towards', needs:'what', who:['sunflower']},
      {id:'stands', t:'stands', needs:'none', who:['sunflower','girl']},
      {id:'feeds', t:'feeds on', needs:'what', who:['bee']},
      {id:'buzzes', t:'buzzes', needs:'none', who:['bee']},
      {id:'shines', t:'shines', needs:'none', who:['sun']}
    ],
    what:[
      {id:'soil', t:'the soil', doing:['waters']},
      {id:'roots', t:'the roots', doing:['waters']},
      {id:'sunflower', t:'the tallest sunflower', doing:['looks']},
      {id:'flower', t:'the big yellow flower', doing:['looks']},
      {id:'bee', t:'the bee', doing:['looks']},
      {id:'sun', t:'the sun', doing:['turns']},
      {id:'nectar', t:'nectar', doing:['feeds']}
    ],
    where:[
      {id:'garden', t:'in the garden', who:['gardener','girl','sunflower','bee']},
      {id:'beside', t:'beside the sunflowers', who:['gardener','girl']},
      {id:'fence', t:'by the wooden fence', who:['sunflower']},
      {id:'sky', t:'towards the sky', who:['sunflower'], doing:['grows']},
      {id:'flower', t:'on a sunflower', who:['bee']},
      {id:'high', t:'high in the sky', who:['sun']},
      {id:'sunshine', t:'in the sunshine', who:['gardener','girl','sunflower','bee']}
    ],
    describe:[
      {id:'tall', t:'tall', who:['sunflower']},
      {id:'yellow', t:'yellow', who:['sunflower']},
      {id:'busy', t:'busy', who:['bee','gardener']},
      {id:'kind', t:'kind', who:['gardener']},
      {id:'small', t:'small', who:['girl','bee']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'bright', t:'bright', who:['sun']},
      {id:'warm', t:'warm', who:['sun']}
    ],
    how:[
      {id:'gently', t:'gently', doing:['waters']},
      {id:'carefully', t:'carefully', doing:['waters','looks']},
      {id:'slowly', t:'slowly', doing:['grows','turns']},
      {id:'happily', t:'happily', doing:['smiles','buzzes','looks']},
      {id:'busily', t:'busily', doing:['feeds','buzzes']},
      {id:'brightly', t:'brightly', doing:['shines']}
    ],
    when:[
      {id:'summer', t:'in summer'},
      {id:'morning', t:'every morning'},
      {id:'today', t:'today'},
      {id:'sunny', t:'on a sunny day'}
    ]
  },
  {
    id:'healthy', title:'Keeping healthy (Y2)', img:'images/science-healthy.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'dad', det:'the', t:'dad', person:true},
      {id:'dog', det:'the', t:'dog'}
    ],
    doing:[
      {id:'skips', t:'skips', needs:'none', who:['girl']},
      {id:'runs', t:'runs', needs:'none', who:['boy','dog']},
      {id:'jumps', t:'jumps', needs:'none', who:['girl','dog']},
      {id:'exercises', t:'exercises', needs:'none', who:['girl','boy','dad']},
      {id:'drinks', t:'drinks', needs:'what', who:['dad']},
      {id:'eats', t:'eats', needs:'what', who:['dad']},
      {id:'rests', t:'rests', needs:'none', who:['dad']},
      {id:'chases', t:'chases', needs:'what', who:['dog']}
    ],
    what:[
      {id:'water', t:'cold water', doing:['drinks']},
      {id:'apple', t:'a juicy apple', doing:['eats']},
      {id:'carrots', t:'some carrots', doing:['eats']},
      {id:'sandwich', t:'a sandwich', doing:['eats']},
      {id:'boy', t:'the boy', doing:['chases']}
    ],
    where:[
      {id:'path', t:'along the path', who:['girl'], doing:['skips','jumps']},
      {id:'grass', t:'across the grass', who:['boy','dog'], doing:['runs','chases']},
      {id:'blanket', t:'on the picnic blanket', who:['dad'], doing:['drinks','eats','rests']},
      {id:'pond', t:'near the pond', who:['boy','dog','dad']},
      {id:'park', t:'in the park'}
    ],
    describe:[
      {id:'fit', t:'fit', who:['girl','boy','dad']},
      {id:'healthy', t:'healthy', who:['girl','boy','dad']},
      {id:'energetic', t:'energetic', who:['girl','boy','dog']},
      {id:'thirsty', t:'thirsty', who:['dad']},
      {id:'hungry', t:'hungry', who:['dad']},
      {id:'playful', t:'playful', who:['dog']},
      {id:'excited', t:'excited', who:['dog','boy']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['runs','skips','chases']},
      {id:'happily', t:'happily', doing:['skips','runs','jumps']},
      {id:'energetically', t:'energetically', doing:['skips','jumps','runs','exercises']},
      {id:'thirstily', t:'thirstily', doing:['drinks']},
      {id:'hungrily', t:'hungrily', doing:['eats']},
      {id:'calmly', t:'calmly', doing:['rests','drinks','eats']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'morning', t:'this morning'},
      {id:'weekend', t:'at the weekend'},
      {id:'spring', t:'in spring'}
    ]
  },
  {
    id:'pollination', title:'Bee pollinating flowers (Y3)', img:'images/science-pollination.jpg',
    who:[
      {id:'bee', det:'the', t:'honeybee'},
      {id:'butterfly', det:'the', t:'butterfly'},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'pollen', det:'the', t:'pollen'}
    ],
    doing:[
      {id:'feeds', t:'feeds on', needs:'what', who:['bee','butterfly']},
      {id:'collects', t:'collects', needs:'what', who:['bee']},
      {id:'carries', t:'carries', needs:'what', who:['bee']},
      {id:'pollinates', t:'pollinates', needs:'what', who:['bee']},
      {id:'buzzes', t:'buzzes', needs:'none', who:['bee']},
      {id:'flies', t:'flies', needs:'none', who:['bee','butterfly']},
      {id:'rests', t:'rests', needs:'none', who:['butterfly']},
      {id:'crouches', t:'crouches', needs:'none', who:['girl']},
      {id:'looks', t:'looks at', needs:'what', who:['girl']},
      {id:'sticks', t:'sticks to', needs:'what', who:['pollen']}
    ],
    what:[
      {id:'nectar', t:'nectar', doing:['feeds','collects']},
      {id:'pollen', t:'pollen', doing:['collects','carries']},
      {id:'flowers', t:'the flowers', doing:['pollinates','looks']},
      {id:'knapweed', t:'the purple knapweed', doing:['pollinates','looks']},
      {id:'foxglove', t:'the pink foxglove', doing:['pollinates','looks']},
      {id:'bee', t:'the honeybee', doing:['looks']},
      {id:'butterfly', t:'the butterfly', doing:['looks']},
      {id:'body', t:"the bee's hairy body", doing:['sticks']}
    ],
    where:[
      {id:'knapweed', t:'on the knapweed', who:['bee'], doing:['feeds','collects','buzzes']},
      {id:'daisy', t:'on a white daisy', who:['butterfly'], doing:['rests','feeds']},
      {id:'flower', t:'from flower to flower', who:['bee'], doing:['flies','carries']},
      {id:'foxglove', t:'towards the foxglove', who:['bee'], doing:['flies']},
      {id:'grass', t:'in the long grass', who:['girl']},
      {id:'meadow', t:'in the meadow', who:['bee','butterfly','girl']}
    ],
    describe:[
      {id:'busy', t:'busy', who:['bee']},
      {id:'hairy', t:'hairy', who:['bee']},
      {id:'stripy', t:'stripy', who:['bee']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'patient', t:'patient', who:['girl']},
      {id:'colourful', t:'colourful', who:['butterfly']},
      {id:'delicate', t:'delicate', who:['butterfly']},
      {id:'sticky', t:'sticky', who:['pollen']}
    ],
    how:[
      {id:'busily', t:'busily', doing:['collects','feeds','flies','buzzes']},
      {id:'carefully', t:'carefully', doing:['looks','crouches']},
      {id:'closely', t:'closely', doing:['looks']},
      {id:'quietly', t:'quietly', doing:['crouches','looks','rests']},
      {id:'loudly', t:'loudly', doing:['buzzes']},
      {id:'easily', t:'easily', doing:['sticks']}
    ],
    when:[
      {id:'summer', t:'in summer'},
      {id:'afternoon', t:'on a sunny afternoon'},
      {id:'every', t:'every day'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'rockpool', title:'Rock pool sorting (Y4)', img:'images/science-rockpool.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'crab', det:'the', t:'crab'},
      {id:'starfish', det:'the', t:'starfish'},
      {id:'anemone', det:'the', t:'sea anemone'},
      {id:'fish', det:'the', t:'blenny'},
      {id:'gull', det:'the', t:'herring gull'}
    ],
    doing:[
      {id:'sorts', t:'sorts', needs:'what', who:['boy']},
      {id:'records', t:'records', needs:'what', who:['boy']},
      {id:'classifies', t:'classifies', needs:'what', who:['boy']},
      {id:'counts', t:'counts', needs:'what', who:['boy']},
      {id:'watches', t:'watches', needs:'what', who:['boy','gull']},
      {id:'scuttles', t:'scuttles', needs:'none', who:['crab']},
      {id:'hides', t:'hides', needs:'none', who:['crab','fish']},
      {id:'clings', t:'clings to', needs:'what', who:['starfish','anemone']},
      {id:'waves', t:'waves its tentacles', needs:'none', who:['anemone']},
      {id:'swims', t:'swims', needs:'none', who:['fish']},
      {id:'stands', t:'stands', needs:'none', who:['gull']}
    ],
    what:[
      {id:'animals', t:'the animals', doing:['sorts','records','watches']},
      {id:'each', t:'each animal', doing:['classifies','records']},
      {id:'crab', t:'the crab', doing:['classifies','watches']},
      {id:'invertebrates', t:'the invertebrates', doing:['sorts','records','counts']},
      {id:'legs', t:"the crab's legs", doing:['counts']},
      {id:'arms', t:"the starfish's arms", doing:['counts']},
      {id:'rock', t:'the rock', doing:['clings']},
      {id:'pool', t:'the rock pool', doing:['watches']}
    ],
    where:[
      {id:'pool', t:'in the rock pool', who:['crab','starfish','anemone','fish']},
      {id:'seaweed', t:'under the seaweed', who:['crab','fish'], doing:['hides','scuttles','swims']},
      {id:'sand', t:'across the sandy bottom', who:['crab'], doing:['scuttles']},
      {id:'barnacles', t:'among the barnacles', who:['anemone']},
      {id:'beside', t:'beside the rock pool', who:['boy']},
      {id:'rock', t:'on a high rock', who:['gull']},
      {id:'shore', t:'on the seashore', who:['boy','gull']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['boy']},
      {id:'careful', t:'careful', who:['boy']},
      {id:'green', t:'green', who:['crab']},
      {id:'orange', t:'orange', who:['starfish']},
      {id:'red', t:'red', who:['anemone']},
      {id:'tiny', t:'tiny', who:['fish']},
      {id:'speckled', t:'speckled', who:['fish']},
      {id:'hungry', t:'hungry', who:['gull']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['sorts','records','classifies','counts','watches']},
      {id:'sideways', t:'sideways', doing:['scuttles']},
      {id:'slowly', t:'slowly', doing:['waves','scuttles','swims']},
      {id:'quickly', t:'quickly', doing:['hides','swims','scuttles']},
      {id:'tightly', t:'tightly', doing:['clings']},
      {id:'patiently', t:'patiently', doing:['watches','stands']}
    ],
    when:[
      {id:'tide', t:'at low tide'},
      {id:'morning', t:'this morning'},
      {id:'today', t:'today'},
      {id:'trip', t:'on a school trip'}
    ]
  },
  {
    id:'skeleton', title:'Skeleton and muscles (Y4)', img:'images/science-skeleton.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'teacher', det:'the', t:'teacher', person:true},
      {id:'skeleton', det:'the', t:'skeleton'}
    ],
    doing:[
      {id:'points', t:'points to', needs:'what', who:['boy','teacher']},
      {id:'names', t:'names', needs:'what', who:['boy','girl','teacher']},
      {id:'studies', t:'studies', needs:'what', who:['boy','girl']},
      {id:'flexes', t:'flexes', needs:'what', who:['girl']},
      {id:'feels', t:'feels', needs:'what', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['teacher']},
      {id:'explains', t:'explains', needs:'what', who:['teacher']},
      {id:'hangs', t:'hangs', needs:'none', who:['skeleton']},
      {id:'protects', t:'protects', needs:'what', who:['skeleton']},
      {id:'supports', t:'supports', needs:'what', who:['skeleton']}
    ],
    what:[
      {id:'skull', t:'the skull', doing:['points','names','studies']},
      {id:'ribs', t:'the rib cage', doing:['points','names','studies']},
      {id:'spine', t:'the spine', doing:['points','names','studies']},
      {id:'pelvis', t:'the pelvis', doing:['points','names']},
      {id:'biceps', t:'the biceps muscle', doing:['flexes','feels']},
      {id:'model', t:'a model knee joint', doing:['holds']},
      {id:'knee', t:'the knee joint', doing:['explains','names']},
      {id:'xray', t:'the chest X-ray', doing:['studies','points','explains']},
      {id:'organs', t:'the organs', doing:['protects']},
      {id:'body', t:'the body', doing:['supports']}
    ],
    where:[
      {id:'classroom', t:'in the classroom', who:['boy','girl','teacher','skeleton'], doing:['points','names','studies','flexes','feels','holds','explains','hangs']},
      {id:'stand', t:'from a metal stand', who:['skeleton'], doing:['hangs']},
      {id:'beside', t:'beside the skeleton', who:['boy','girl']},
      {id:'table', t:'by the table', who:['teacher']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['boy','girl']},
      {id:'excited', t:'excited', who:['boy']},
      {id:'strong', t:'strong', who:['girl']},
      {id:'patient', t:'patient', who:['teacher']},
      {id:'tall', t:'tall', who:['skeleton','teacher']},
      {id:'white', t:'white', who:['skeleton']},
      {id:'lifesize', t:'life-size', who:['skeleton']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['points','names','studies','holds','feels']},
      {id:'clearly', t:'clearly', doing:['explains','names']},
      {id:'proudly', t:'proudly', doing:['flexes','names']},
      {id:'gently', t:'gently', doing:['feels','holds']},
      {id:'closely', t:'closely', doing:['studies']}
    ],
    when:[
      {id:'lesson', t:'in the science lesson'},
      {id:'afternoon', t:'this afternoon'},
      {id:'today', t:'today'},
      {id:'break', t:'after break'}
    ]
  },
  {
    id:'melting', title:'Melting ice investigation (Y4)', img:'images/science-melting.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'ice', det:'the', t:'ice cube'},
      {id:'kettle', det:'the', t:'kettle'},
      {id:'window', det:'the', t:'window'}
    ],
    doing:[
      {id:'measures', t:'measures', needs:'what', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['girl','boy']},
      {id:'unwraps', t:'unwraps', needs:'what', who:['boy']},
      {id:'checks', t:'checks', needs:'what', who:['girl','boy']},
      {id:'melts', t:'melts', needs:'none', who:['ice']},
      {id:'shrinks', t:'shrinks', needs:'none', who:['ice']},
      {id:'turns', t:'turns into', needs:'what', who:['ice']},
      {id:'boils', t:'boils', needs:'none', who:['kettle']},
      {id:'heats', t:'heats', needs:'what', who:['kettle']},
      {id:'mists', t:'mists up', needs:'none', who:['window']}
    ],
    what:[
      {id:'temp', t:'the temperature', doing:['measures','checks']},
      {id:'thermometer', t:'a thermometer', doing:['holds']},
      {id:'ice', t:'an ice cube', doing:['unwraps','checks','holds']},
      {id:'wool', t:'the woollen square', doing:['holds']},
      {id:'stopwatch', t:'the stopwatch', doing:['checks']},
      {id:'water', t:'water', doing:['turns','heats']}
    ],
    where:[
      {id:'bowl', t:'in a glass bowl', who:['ice']},
      {id:'sunshine', t:'in the sunshine', who:['ice']},
      {id:'table', t:'at the table', who:['girl','boy']},
      {id:'counter', t:'on the counter', who:['kettle']},
      {id:'above', t:'above the kettle', who:['window']},
      {id:'classroom', t:'in the classroom', who:['girl','boy','kettle']}
    ],
    describe:[
      {id:'careful', t:'careful', who:['girl','boy']},
      {id:'curious', t:'curious', who:['girl','boy']},
      {id:'cold', t:'cold', who:['ice','window']},
      {id:'solid', t:'solid', who:['ice']},
      {id:'slippery', t:'slippery', who:['ice']},
      {id:'hot', t:'hot', who:['kettle']},
      {id:'shiny', t:'shiny', who:['kettle']},
      {id:'misty', t:'misty', who:['window']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['measures','holds','unwraps','checks']},
      {id:'slowly', t:'slowly', doing:['melts','shrinks','turns','unwraps']},
      {id:'quickly', t:'quickly', doing:['boils','heats','checks']},
      {id:'loudly', t:'loudly', doing:['boils']},
      {id:'gradually', t:'gradually', doing:['mists','melts','shrinks','turns']}
    ],
    when:[
      {id:'ten', t:'after ten minutes'},
      {id:'today', t:'today'},
      {id:'morning', t:'this morning'},
      {id:'lesson', t:'in the science lesson'}
    ]
  },
  {
    id:'dissolving', title:'Dissolving and separating (Y5)', img:'images/science-dissolving.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'sugar', det:'the', t:'sugar'},
      {id:'sand', det:'the', t:'sand'},
      {id:'water', det:'the', t:'water'},
      {id:'salt', det:'the', t:'salt'}
    ],
    doing:[
      {id:'stirs', t:'stirs', needs:'what', who:['boy']},
      {id:'adds', t:'adds', needs:'what', who:['boy']},
      {id:'pours', t:'pours', needs:'what', who:['girl']},
      {id:'filters', t:'filters', needs:'what', who:['girl']},
      {id:'separates', t:'separates', needs:'what', who:['girl']},
      {id:'dissolves', t:'dissolves', needs:'none', who:['sugar']},
      {id:'notdissolve', t:'does not dissolve', needs:'none', who:['sand']},
      {id:'drips', t:'drips', needs:'none', who:['water']},
      {id:'evaporates', t:'evaporates', needs:'none', who:['water']},
      {id:'forms', t:'forms', needs:'what', who:['salt']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['salt']}
    ],
    what:[
      {id:'sugar', t:'the sugar', doing:['stirs']},
      {id:'spoon', t:'a spoonful of sugar', doing:['adds']},
      {id:'muddy', t:'the muddy water', doing:['pours','filters']},
      {id:'mixture', t:'the mixture', doing:['pours','filters']},
      {id:'sand', t:'the sand', doing:['separates']},
      {id:'crystals', t:'white crystals', doing:['forms']}
    ],
    where:[
      {id:'into', t:'into the water', who:['boy'], doing:['stirs']},
      {id:'to', t:'to the water', who:['boy'], doing:['adds']},
      {id:'glass', t:'in the glass', who:['sugar'], doing:['dissolves']},
      {id:'through', t:'through the filter paper', who:['girl','water'], doing:['pours','filters','drips']},
      {id:'jar', t:'into the jar', who:['girl','water'], doing:['pours','drips']},
      {id:'from', t:'from the water', who:['girl'], doing:['separates']},
      {id:'paper', t:'in the filter paper', who:['sand']},
      {id:'sill', t:'on the sunny windowsill', who:['salt','water'], doing:['evaporates','forms','sparkles']},
      {id:'table', t:'at the kitchen table', who:['boy','girl']}
    ],
    describe:[
      {id:'careful', t:'careful', who:['boy','girl']},
      {id:'curious', t:'curious', who:['boy','girl']},
      {id:'white', t:'white', who:['sugar','salt']},
      {id:'sweet', t:'sweet', who:['sugar']},
      {id:'sparkling', t:'sparkling', who:['salt']},
      {id:'gritty', t:'gritty', who:['sand']},
      {id:'clear', t:'clear', who:['water']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['pours','filters','stirs','adds','separates']},
      {id:'slowly', t:'slowly', doing:['pours','dissolves','evaporates','drips','forms']},
      {id:'quickly', t:'quickly', doing:['stirs','dissolves']},
      {id:'steadily', t:'steadily', doing:['drips','pours']},
      {id:'gradually', t:'gradually', doing:['evaporates','forms','dissolves']},
      {id:'completely', t:'completely', doing:['dissolves']}
    ],
    when:[
      {id:'morning', t:'this morning'},
      {id:'today', t:'today'},
      {id:'weekend', t:'at the weekend'},
      {id:'lunch', t:'after lunch'}
    ]
  },
  {
    id:'darwin', title:'Darwin on the Galápagos (Y6)', img:'images/science-darwin.jpg',
    who:[
      {id:'darwin', det:'', t:'Charles Darwin', person:true},
      {id:'tortoise', det:'the', t:'giant tortoise'},
      {id:'finch', det:'the', t:'finch'},
      {id:'iguana', det:'the', t:'marine iguana'},
      {id:'ship', det:'the', t:'Beagle'}
    ],
    doing:[
      {id:'sketches', t:'sketches', needs:'what', who:['darwin']},
      {id:'studies', t:'studies', needs:'what', who:['darwin']},
      {id:'observes', t:'observes', needs:'what', who:['darwin']},
      {id:'notices', t:'notices', needs:'what', who:['darwin']},
      {id:'sits', t:'sits', needs:'none', who:['darwin']},
      {id:'walks', t:'walks', needs:'none', who:['tortoise']},
      {id:'eats', t:'eats', needs:'what', who:['tortoise','finch','iguana']},
      {id:'cracks', t:'cracks', needs:'what', who:['finch']},
      {id:'perches', t:'perches', needs:'none', who:['finch']},
      {id:'basks', t:'basks', needs:'none', who:['iguana']},
      {id:'anchor', t:'lies at anchor', needs:'none', who:['ship']}
    ],
    what:[
      {id:'finches', t:'the finches', doing:['sketches','studies','observes']},
      {id:'beaks', t:'the different beaks', doing:['notices','studies','sketches']},
      {id:'tortoise', t:'the giant tortoise', doing:['sketches','observes','studies']},
      {id:'iguana', t:'the marine iguana', doing:['sketches','observes']},
      {id:'cactus', t:'the cactus pads', doing:['eats'], who:['tortoise']},
      {id:'seed', t:'a hard seed', doing:['cracks','eats'], who:['finch']},
      {id:'seaweed', t:'seaweed', doing:['eats'], who:['iguana']}
    ],
    where:[
      {id:'lava', t:'on the black lava rocks', who:['darwin','iguana'], doing:['sits','basks','sketches','studies','observes','notices']},
      {id:'cactus', t:'on a prickly pear cactus', who:['finch'], doing:['perches','cracks']},
      {id:'past', t:'past the cactus', who:['tortoise'], doing:['walks']},
      {id:'sea', t:'by the sea', who:['iguana','darwin']},
      {id:'bay', t:'in the bay', who:['ship']},
      {id:'islands', t:'on the Galápagos Islands', who:['darwin','tortoise','finch','iguana']}
    ],
    describe:[
      {id:'slow', t:'slow', who:['tortoise']},
      {id:'heavy', t:'heavy', who:['tortoise']},
      {id:'small', t:'small', who:['finch']},
      {id:'thick', t:'thick-beaked', who:['finch']},
      {id:'scaly', t:'scaly', who:['iguana','tortoise']},
      {id:'black', t:'black', who:['iguana','finch']},
      {id:'wooden', t:'wooden', who:['ship']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['sketches','studies','observes']},
      {id:'closely', t:'closely', doing:['studies','observes']},
      {id:'slowly', t:'slowly', doing:['walks','eats'], who:['tortoise']},
      {id:'patiently', t:'patiently', doing:['sits','observes','perches']},
      {id:'lazily', t:'lazily', doing:['basks']},
      {id:'quickly', t:'quickly', doing:['cracks','eats'], who:['finch']}
    ],
    when:[
      {id:'1835', t:'in 1835'},
      {id:'morning', t:'one hot morning'},
      {id:'every', t:'every day'},
      {id:'voyage', t:'during the voyage'}
    ]
  }
);

TOPICS.find(t => t.id === 'geography').pictures.push(
  {
    id:'edinburgh', title:'Edinburgh Castle (Y1)', img:'images/geography-edinburgh.jpg',
    who:[
      {id:'castle', det:'the', t:'castle'},
      {id:'piper', det:'the', t:'piper', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'grandma', det:'the', t:'grandma', person:true},
      {id:'flag', det:'the', t:'flag'}
    ],
    doing:[
      {id:'stands', t:'stands', needs:'none', who:['castle','girl','grandma']},
      {id:'plays', t:'plays', needs:'what', who:['piper']},
      {id:'wears', t:'wears', needs:'what', who:['piper']},
      {id:'looks', t:'looks up at', needs:'what', who:['girl','grandma']},
      {id:'listens', t:'listens to', needs:'what', who:['girl','grandma']},
      {id:'flies', t:'flies', needs:'none', who:['flag']},
      {id:'flutters', t:'flutters', needs:'none', who:['flag']}
    ],
    what:[
      {id:'bagpipes', t:'the bagpipes', doing:['plays','listens']},
      {id:'tune', t:'a Scottish tune', doing:['plays','listens']},
      {id:'kilt', t:'a tartan kilt', doing:['wears']},
      {id:'castle', t:'the castle', doing:['looks']},
      {id:'piper', t:'the piper', doing:['looks','listens']},
      {id:'flag', t:'the flag', doing:['looks']}
    ],
    where:[
      {id:'rock', t:'high on Castle Rock', who:['castle'], doing:['stands']},
      {id:'above', t:'above the castle', who:['flag']},
      {id:'gardens', t:'in the gardens', who:['piper','girl','grandma']},
      {id:'grass', t:'on the grass', who:['piper','girl','grandma']},
      {id:'edinburgh', t:'in Edinburgh'},
      {id:'capital', t:'in the capital city of Scotland'}
    ],
    describe:[
      {id:'old', t:'old', who:['castle','grandma']},
      {id:'huge', t:'huge', who:['castle']},
      {id:'proud', t:'proud', who:['piper']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'small', t:'small', who:['girl']},
      {id:'kind', t:'kind', who:['grandma']},
      {id:'blue', t:'blue and white', who:['flag']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['plays']},
      {id:'proudly', t:'proudly', doing:['plays','stands','flies','wears']},
      {id:'quietly', t:'quietly', doing:['listens','looks','stands'], who:['girl','grandma']},
      {id:'happily', t:'happily', doing:['listens','looks','plays']},
      {id:'gently', t:'gently', doing:['flutters','flies']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'sunny', t:'on a sunny day'},
      {id:'holidays', t:'in the summer holidays'},
      {id:'morning', t:'this morning'}
    ]
  },
  {
    id:'cheddar', title:'Cheddar Gorge (Y3)', img:'images/geography-cheddar.jpg',
    who:[
      {id:'goat', det:'the', t:'goat'},
      {id:'climber', det:'the', t:'climber', person:true},
      {id:'walker', det:'the', t:'walker', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'buzzard', det:'the', t:'buzzard'},
      {id:'road', det:'the', t:'road'}
    ],
    doing:[
      {id:'climbs', t:'climbs', needs:'none', who:['climber','goat']},
      {id:'grips', t:'grips', needs:'what', who:['climber']},
      {id:'stands', t:'stands', needs:'none', who:['goat','walker','girl']},
      {id:'grazes', t:'grazes', needs:'none', who:['goat']},
      {id:'walks', t:'walks', needs:'none', who:['walker','girl']},
      {id:'looks', t:'looks down into', needs:'what', who:['walker','girl']},
      {id:'points', t:'points at', needs:'what', who:['girl']},
      {id:'soars', t:'soars', needs:'none', who:['buzzard']},
      {id:'hunts', t:'hunts for', needs:'what', who:['buzzard']},
      {id:'winds', t:'winds', needs:'none', who:['road']}
    ],
    what:[
      {id:'gorge', t:'the deep gorge', doing:['looks']},
      {id:'goat', t:'the wild goat', doing:['points']},
      {id:'climber', t:'the climber', doing:['points']},
      {id:'buzzard', t:'the buzzard', doing:['points']},
      {id:'rope', t:'the rope', doing:['grips']},
      {id:'rock', t:'the limestone rock', doing:['grips']},
      {id:'animals', t:'small animals', doing:['hunts']}
    ],
    where:[
      {id:'ledge', t:'on a rocky ledge', who:['goat'], doing:['stands','grazes']},
      {id:'path', t:'along the cliff-top path', who:['walker','girl'], doing:['walks','stands','looks','points']},
      {id:'cliff', t:'up the steep cliff', who:['climber','goat'], doing:['climbs']},
      {id:'above', t:'above the gorge', who:['buzzard'], doing:['soars','hunts']},
      {id:'bottom', t:'along the bottom of the gorge', who:['road'], doing:['winds']},
      {id:'somerset', t:'in Somerset'}
    ],
    describe:[
      {id:'wild', t:'wild', who:['goat']},
      {id:'shaggy', t:'shaggy', who:['goat']},
      {id:'brave', t:'brave', who:['climber']},
      {id:'careful', t:'careful', who:['climber','walker']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'sharp', t:'sharp-eyed', who:['buzzard']},
      {id:'narrow', t:'narrow', who:['road']},
      {id:'winding', t:'winding', who:['road']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['climbs','walks','grips']},
      {id:'slowly', t:'slowly', doing:['climbs','walks','grazes']},
      {id:'gracefully', t:'gracefully', doing:['soars']},
      {id:'tightly', t:'tightly', doing:['grips']},
      {id:'quietly', t:'quietly', doing:['grazes','stands','looks']},
      {id:'excitedly', t:'excitedly', doing:['points']}
    ],
    when:[
      {id:'summer', t:'in summer'},
      {id:'afternoon', t:'this afternoon'},
      {id:'trip', t:'on a school trip'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'harbour', title:'Bristol Floating Harbour (Y5)', img:'images/geography-harbour.jpg',
    who:[
      {id:'ferry', det:'the', t:'ferry'},
      {id:'kayaker', det:'the', t:'kayaker', person:true},
      {id:'swan', det:'the', t:'swan'},
      {id:'angler', det:'the', t:'angler', person:true},
      {id:'ship', det:'the', t:'SS Great Britain'},
      {id:'crane', det:'the', t:'crane'}
    ],
    doing:[
      {id:'carries', t:'carries', needs:'what', who:['ferry']},
      {id:'crosses', t:'crosses', needs:'what', who:['ferry','kayaker']},
      {id:'paddles', t:'paddles', needs:'none', who:['kayaker']},
      {id:'glides', t:'glides', needs:'none', who:['swan','kayaker','ferry']},
      {id:'swims', t:'swims', needs:'none', who:['swan']},
      {id:'fishes', t:'fishes', needs:'none', who:['angler']},
      {id:'waits', t:'waits for', needs:'what', who:['angler']},
      {id:'watches', t:'watches', needs:'what', who:['angler']},
      {id:'sits', t:'sits', needs:'none', who:['angler','ship']},
      {id:'stands', t:'stands', needs:'none', who:['crane']}
    ],
    what:[
      {id:'passengers', t:'passengers', doing:['carries']},
      {id:'harbour', t:'the harbour', doing:['crosses']},
      {id:'bite', t:'a bite', doing:['waits']},
      {id:'swans', t:'the swans', doing:['watches']},
      {id:'ferry', t:'the ferry', doing:['watches']},
      {id:'kayaker', t:'the kayaker', doing:['watches']}
    ],
    where:[
      {id:'across', t:'across the harbour', who:['ferry','kayaker','swan'], doing:['carries','paddles','glides','swims']},
      {id:'water', t:'on the calm water', who:['ferry','kayaker','swan'], doing:['glides','swims','paddles']},
      {id:'quay', t:'on the quayside', who:['angler','crane'], doing:['sits','fishes','waits','watches','stands']},
      {id:'dock', t:'in the dry dock', who:['ship']},
      {id:'warehouses', t:'beside the old warehouses', who:['crane','ship']},
      {id:'bristol', t:'in Bristol'}
    ],
    describe:[
      {id:'historic', t:'historic', who:['ship','crane']},
      {id:'huge', t:'huge', who:['ship']},
      {id:'yellow', t:'yellow', who:['ferry']},
      {id:'busy', t:'busy', who:['ferry']},
      {id:'white', t:'white', who:['swan']},
      {id:'graceful', t:'graceful', who:['swan']},
      {id:'patient', t:'patient', who:['angler']},
      {id:'strong', t:'strong', who:['kayaker']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['glides','swims','carries','crosses']},
      {id:'gracefully', t:'gracefully', doing:['glides','swims']},
      {id:'quickly', t:'quickly', doing:['paddles','crosses']},
      {id:'patiently', t:'patiently', doing:['waits','fishes','watches','sits'], who:['angler']},
      {id:'proudly', t:'proudly', doing:['stands','sits'], who:['ship','crane']},
      {id:'quietly', t:'quietly', doing:['fishes','watches','glides']}
    ],
    when:[
      {id:'morning', t:'on a sunny morning'},
      {id:'every', t:'every day'},
      {id:'weekend', t:'at the weekend'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'watercycle', title:'The water cycle (Y5)', img:'images/geography-watercycle.jpg',
    who:[
      {id:'sun', det:'the', t:'sun'},
      {id:'water', det:'the', t:'lake water'},
      {id:'vapour', det:'the', t:'water vapour'},
      {id:'cloud', det:'the', t:'cloud'},
      {id:'rain', det:'the', t:'rain'},
      {id:'stream', det:'the', t:'mountain stream'},
      {id:'river', det:'the', t:'river'}
    ],
    doing:[
      {id:'heats', t:'heats', needs:'what', who:['sun']},
      {id:'shines', t:'shines', needs:'none', who:['sun']},
      {id:'evaporates', t:'evaporates', needs:'none', who:['water']},
      {id:'rises', t:'rises', needs:'none', who:['vapour']},
      {id:'cools', t:'cools', needs:'none', who:['vapour']},
      {id:'condenses', t:'condenses', needs:'none', who:['vapour']},
      {id:'grows', t:'grows', needs:'none', who:['cloud']},
      {id:'drifts', t:'drifts', needs:'none', who:['cloud']},
      {id:'falls', t:'falls', needs:'none', who:['rain']},
      {id:'soaks', t:'soaks into', needs:'what', who:['rain']},
      {id:'runs', t:'runs off', needs:'none', who:['rain']},
      {id:'tumbles', t:'tumbles', needs:'none', who:['stream']},
      {id:'flows', t:'flows', needs:'none', who:['stream','river']},
      {id:'carries', t:'carries', needs:'what', who:['river','stream']}
    ],
    what:[
      {id:'lake', t:'the lake', doing:['heats']},
      {id:'ground', t:'the ground', doing:['soaks']},
      {id:'rainwater', t:'rainwater', doing:['carries']}
    ],
    where:[
      {id:'air', t:'into the air', who:['vapour','water'], doing:['rises','evaporates']},
      {id:'clouds', t:'into clouds', who:['vapour'], doing:['condenses']},
      {id:'mountains', t:'over the mountains', who:['cloud','rain'], doing:['drifts','grows','falls']},
      {id:'down', t:'down the mountain', who:['stream','rain'], doing:['tumbles','flows','runs']},
      {id:'lake', t:'into the lake', who:['river','stream'], doing:['flows','carries']},
      {id:'sky', t:'high in the sky', who:['sun','cloud','vapour'], doing:['shines','drifts','cools','grows']},
      {id:'valley', t:'across the valley', who:['river','cloud'], doing:['flows','drifts','carries']}
    ],
    describe:[
      {id:'warm', t:'warm', who:['sun','water']},
      {id:'bright', t:'bright', who:['sun']},
      {id:'invisible', t:'invisible', who:['vapour']},
      {id:'dark', t:'dark', who:['cloud']},
      {id:'grey', t:'grey', who:['cloud']},
      {id:'heavy', t:'heavy', who:['rain','cloud']},
      {id:'fast', t:'fast', who:['stream']},
      {id:'winding', t:'winding', who:['river']}
    ],
    how:[
      {id:'slowly', t:'slowly', doing:['evaporates','rises','drifts','flows','cools','grows']},
      {id:'steadily', t:'steadily', doing:['falls','flows','carries','heats']},
      {id:'quickly', t:'quickly', doing:['tumbles','flows','runs']},
      {id:'gently', t:'gently', doing:['falls','drifts','shines','rises']},
      {id:'heavily', t:'heavily', doing:['falls']},
      {id:'brightly', t:'brightly', doing:['shines']}
    ],
    when:[
      {id:'every', t:'every day'},
      {id:'year', t:'all year round'},
      {id:'storm', t:'after a storm'},
      {id:'afternoon', t:'on a warm afternoon'}
    ]
  },
  {
    id:'geyser', title:'Old Faithful geyser (Y6)', img:'images/geography-geyser.jpg',
    who:[
      {id:'geyser', det:'the', t:'geyser'},
      {id:'spring', det:'the', t:'hot spring'},
      {id:'photographer', det:'the', t:'photographer', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'bison', det:'the', t:'bison'}
    ],
    doing:[
      {id:'erupts', t:'erupts', needs:'none', who:['geyser']},
      {id:'shoots', t:'shoots', needs:'what', who:['geyser']},
      {id:'steams', t:'steams', needs:'none', who:['spring','geyser']},
      {id:'bubbles', t:'bubbles', needs:'none', who:['spring']},
      {id:'photographs', t:'photographs', needs:'what', who:['photographer']},
      {id:'watches', t:'watches', needs:'what', who:['photographer','boy']},
      {id:'leans', t:'leans on', needs:'what', who:['boy']},
      {id:'waits', t:'waits', needs:'none', who:['photographer','boy']},
      {id:'grazes', t:'grazes', needs:'none', who:['bison']}
    ],
    what:[
      {id:'water', t:'boiling water', doing:['shoots']},
      {id:'steam', t:'a cloud of steam', doing:['shoots']},
      {id:'geyser', t:'the geyser', doing:['photographs','watches']},
      {id:'eruption', t:'the eruption', doing:['photographs','watches']},
      {id:'bison', t:'the bison', doing:['photographs','watches']},
      {id:'railing', t:'the wooden railing', doing:['leans']}
    ],
    where:[
      {id:'sky', t:'into the sky', who:['geyser'], doing:['erupts','shoots']},
      {id:'ground', t:'from deep underground', who:['geyser'], doing:['erupts','shoots']},
      {id:'boardwalk', t:'on the boardwalk', who:['photographer','boy']},
      {id:'beside', t:'beside the geyser', who:['spring']},
      {id:'plain', t:'on the grassy plain', who:['bison']},
      {id:'park', t:'in Yellowstone National Park'}
    ],
    describe:[
      {id:'powerful', t:'powerful', who:['geyser']},
      {id:'famous', t:'famous', who:['geyser']},
      {id:'hot', t:'hot', who:['spring','geyser']},
      {id:'blue', t:'bright blue', who:['spring']},
      {id:'excited', t:'excited', who:['boy','photographer']},
      {id:'amazed', t:'amazed', who:['boy','photographer']},
      {id:'huge', t:'huge', who:['bison']},
      {id:'shaggy', t:'shaggy', who:['bison']}
    ],
    how:[
      {id:'suddenly', t:'suddenly', doing:['erupts','shoots']},
      {id:'powerfully', t:'powerfully', doing:['erupts','shoots']},
      {id:'gently', t:'gently', doing:['steams','bubbles']},
      {id:'excitedly', t:'excitedly', doing:['watches','photographs']},
      {id:'calmly', t:'calmly', doing:['grazes','waits','leans']},
      {id:'patiently', t:'patiently', doing:['waits','watches']}
    ],
    when:[
      {id:'afternoon', t:'this afternoon'},
      {id:'last', t:'at last'},
      {id:'today', t:'today'},
      {id:'summer', t:'in summer'}
    ]
  }
);
