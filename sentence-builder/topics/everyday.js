/* Sentence Builder — Everyday life word banks (familiar scenes, simple vocabulary). Same schema as content.js. */
TOPICS.push({
  id:'everyday', label:'Everyday life', years:'All years', pictures:[
  {
    id:'playground', title:'Break time', img:'images/everyday-playground.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'teacher', det:'the', t:'teacher', person:true},
      {id:'leaf', det:'the', t:'leaf'}
    ],
    doing:[
      {id:'skips', t:'skips', needs:'none', who:['girl']},
      {id:'jumps', t:'jumps', needs:'none', who:['girl']},
      {id:'kicks', t:'kicks', needs:'what', who:['boy']},
      {id:'runs', t:'runs', needs:'none', who:['boy','girl']},
      {id:'climbs', t:'climbs', needs:'what', who:['boy','girl']},
      {id:'holds', t:'holds', needs:'what', who:['teacher','girl']},
      {id:'watches', t:'watches', needs:'what', who:['teacher']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','boy','teacher']},
      {id:'falls', t:'falls', needs:'none', who:['leaf']}
    ],
    what:[
      {id:'ball', t:'the ball', doing:['kicks','watches']},
      {id:'frame', t:'the climbing frame', doing:['climbs','watches']},
      {id:'rope', t:'a skipping rope', doing:['holds'], who:['girl']},
      {id:'cup', t:'a cup of tea', doing:['holds'], who:['teacher']},
      {id:'children', t:'the children', doing:['watches']}
    ],
    where:[
      {id:'playground', t:'in the playground', doing:['skips','jumps','kicks','runs','climbs','holds','watches','smiles']},
      {id:'across', t:'across the playground', doing:['runs','kicks']},
      {id:'tree', t:'by the tree', who:['teacher']},
      {id:'ground', t:'onto the ground', doing:['falls']}
    ],
    describe:[
      {id:'happy', t:'happy', who:['girl','boy','teacher']},
      {id:'fast', t:'fast', who:['girl','boy']},
      {id:'kind', t:'kind', who:['teacher']},
      {id:'friendly', t:'friendly', who:['teacher','girl','boy']},
      {id:'brown', t:'brown', who:['leaf']},
      {id:'golden', t:'golden', who:['leaf']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['skips','runs','kicks','climbs']},
      {id:'happily', t:'happily', doing:['skips','jumps','smiles','runs']},
      {id:'high', t:'high', doing:['jumps','kicks']},
      {id:'carefully', t:'carefully', doing:['climbs','watches','holds']},
      {id:'slowly', t:'slowly', doing:['falls','climbs']}
    ],
    when:[
      {id:'break', t:'at break time'},
      {id:'morning', t:'every morning'},
      {id:'today', t:'today'},
      {id:'lunch', t:'after lunch'}
    ]
  },
  {
    id:'dinner', title:'The dinner hall', img:'images/everyday-dinner.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'lady', det:'the', t:'dinner lady', person:true}
    ],
    doing:[
      {id:'eats', t:'eats', who:['girl','boy']},
      {id:'drinks', t:'drinks', who:['girl']},
      {id:'serves', t:'serves', needs:'what', who:['lady']},
      {id:'holds', t:'holds', needs:'what', who:['boy']},
      {id:'waits', t:'waits', needs:'none', who:['boy']},
      {id:'chats', t:'chats', needs:'none', who:['girl','boy']},
      {id:'sits', t:'sits', needs:'none', who:['girl','boy']},
      {id:'smiles', t:'smiles', needs:'none'}
    ],
    what:[
      {id:'peas', t:'some peas', doing:['eats','serves']},
      {id:'pasta', t:'some pasta', doing:['eats','serves']},
      {id:'lunch', t:'a hot lunch', doing:['eats','serves']},
      {id:'water', t:'some water', doing:['drinks']},
      {id:'tray', t:'a tray', doing:['holds']}
    ],
    where:[
      {id:'hall', t:'in the dinner hall'},
      {id:'table', t:'at the table', who:['girl','boy'], doing:['eats','drinks','chats','sits','smiles']},
      {id:'hatch', t:'by the hatch', doing:['waits','serves','holds','smiles']},
      {id:'line', t:'in the line', who:['boy'], doing:['waits','holds','smiles']}
    ],
    describe:[
      {id:'hungry', t:'hungry', who:['girl','boy']},
      {id:'thirsty', t:'thirsty', who:['girl']},
      {id:'polite', t:'polite', who:['girl','boy']},
      {id:'kind', t:'kind', who:['lady']},
      {id:'busy', t:'busy', who:['lady']},
      {id:'friendly', t:'friendly'}
    ],
    how:[
      {id:'hungrily', t:'hungrily', doing:['eats']},
      {id:'politely', t:'politely', doing:['waits','serves']},
      {id:'happily', t:'happily', doing:['smiles','chats','eats','serves']},
      {id:'quietly', t:'quietly', doing:['sits','eats','waits','chats']},
      {id:'carefully', t:'carefully', doing:['eats','drinks','holds']}
    ],
    when:[
      {id:'lunch', t:'at lunchtime'},
      {id:'every', t:'every day'},
      {id:'today', t:'today'},
      {id:'twelve', t:'at twelve o’clock'}
    ]
  },
  {
    id:'checkout', title:'At the checkout', img:'images/everyday-checkout.jpg',
    who:[
      {id:'dad', det:'the', t:'dad', person:true},
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'cashier', det:'the', t:'cashier', person:true},
      {id:'belt', det:'the', t:'belt'}
    ],
    doing:[
      {id:'puts', t:'puts', needs:'what', who:['dad','girl']},
      {id:'scans', t:'scans', needs:'what', who:['cashier']},
      {id:'holds', t:'holds', needs:'what', who:['dad','cashier']},
      {id:'packs', t:'packs', needs:'what', who:['dad']},
      {id:'pushes', t:'pushes', needs:'what', who:['dad']},
      {id:'smiles', t:'smiles', needs:'none', who:['dad','girl','cashier']},
      {id:'moves', t:'moves', needs:'none', who:['belt']}
    ],
    what:[
      {id:'apple', t:'an apple', doing:['puts','scans','holds']},
      {id:'bananas', t:'some bananas', doing:['puts','scans','packs']},
      {id:'bread', t:'a loaf of bread', doing:['puts','scans','packs']},
      {id:'milk', t:'a carton of milk', doing:['puts','scans','holds','packs']},
      {id:'trolley', t:'the trolley', doing:['pushes']}
    ],
    where:[
      {id:'belt', t:'on the belt', doing:['puts']},
      {id:'checkout', t:'at the checkout'},
      {id:'bag', t:'into a bag', doing:['packs']},
      {id:'shop', t:'in the supermarket'}
    ],
    describe:[
      {id:'helpful', t:'helpful', who:['girl','cashier']},
      {id:'careful', t:'careful', who:['girl','dad']},
      {id:'friendly', t:'friendly', who:['cashier','dad','girl']},
      {id:'busy', t:'busy', who:['cashier','dad']},
      {id:'patient', t:'patient', who:['dad','cashier']},
      {id:'black', t:'black', who:['belt']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['puts','packs','scans','holds']},
      {id:'quickly', t:'quickly', doing:['scans','packs','pushes']},
      {id:'slowly', t:'slowly', doing:['moves','pushes','puts']},
      {id:'happily', t:'happily', doing:['smiles']},
      {id:'gently', t:'gently', doing:['puts','holds','packs']}
    ],
    when:[
      {id:'saturday', t:'on Saturday'},
      {id:'school', t:'after school'},
      {id:'today', t:'today'},
      {id:'week', t:'every week'}
    ]
  },
  {
    id:'party', title:'A birthday party', img:'images/everyday-party.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'grandma', det:'the', t:'grandma', person:true},
      {id:'dog', det:'the', t:'dog'}
    ],
    doing:[
      {id:'blows', t:'blows out', needs:'what', who:['girl']},
      {id:'claps', t:'claps', needs:'none', who:['boy','grandma']},
      {id:'sings', t:'sings', needs:'none', who:['boy','grandma']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','boy','grandma']},
      {id:'holds', t:'holds', needs:'what', who:['grandma']},
      {id:'watches', t:'watches', needs:'what', who:['boy','grandma','dog']},
      {id:'sits', t:'sits', needs:'none', who:['dog']},
      {id:'waits', t:'waits', needs:'none', who:['dog']}
    ],
    what:[
      {id:'candles', t:'the candles', doing:['blows','watches']},
      {id:'cake', t:'the cake', doing:['watches']},
      {id:'plates', t:'some plates', doing:['holds']},
      {id:'girl', t:'the girl', doing:['watches']}
    ],
    where:[
      {id:'room', t:'in the living room'},
      {id:'table', t:'at the table', who:['girl','boy']},
      {id:'next', t:'next to the table', who:['dog','grandma']}
    ],
    describe:[
      {id:'excited', t:'excited', who:['girl','boy','dog']},
      {id:'happy', t:'happy', who:['girl','boy','grandma']},
      {id:'kind', t:'kind', who:['grandma']},
      {id:'proud', t:'proud', who:['grandma']},
      {id:'fluffy', t:'fluffy', who:['dog']},
      {id:'golden', t:'golden', who:['dog']}
    ],
    how:[
      {id:'loudly', t:'loudly', doing:['claps','sings']},
      {id:'happily', t:'happily', doing:['claps','sings','smiles']},
      {id:'quickly', t:'quickly', doing:['blows']},
      {id:'patiently', t:'patiently', doing:['waits','sits','watches']},
      {id:'proudly', t:'proudly', doing:['holds','watches','smiles']}
    ],
    when:[
      {id:'today', t:'today'},
      {id:'afternoon', t:'this afternoon'},
      {id:'tea', t:'after tea'},
      {id:'last', t:'at last'}
    ]
  },
  {
    id:'baking', title:'Baking a cake', img:'images/everyday-baking.jpg',
    who:[
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'mum', det:'the', t:'mum', person:true},
      {id:'cat', det:'the', t:'cat'}
    ],
    doing:[
      {id:'stirs', t:'stirs', needs:'what', who:['boy']},
      {id:'cracks', t:'cracks', needs:'what', who:['mum']},
      {id:'mixes', t:'mixes', needs:'what', who:['boy','mum']},
      {id:'bakes', t:'bakes', needs:'what', who:['mum','boy']},
      {id:'rolls', t:'rolls out', needs:'what', who:['mum']},
      {id:'watches', t:'watches', needs:'what', who:['cat','boy']},
      {id:'sits', t:'sits', needs:'none', who:['cat']},
      {id:'smiles', t:'smiles', needs:'none', who:['boy','mum']}
    ],
    what:[
      {id:'mixture', t:'the cake mixture', doing:['stirs','mixes','watches']},
      {id:'egg', t:'an egg', doing:['cracks']},
      {id:'cookies', t:'some cookies', doing:['bakes','watches']},
      {id:'dough', t:'the dough', doing:['rolls']},
      {id:'boy', t:'the boy', doing:['watches'], who:['cat']}
    ],
    where:[
      {id:'into', t:'into the bowl', doing:['cracks']},
      {id:'bowl', t:'in a big bowl', doing:['stirs','mixes']},
      {id:'kitchen', t:'in the kitchen'},
      {id:'chair', t:'on a chair', who:['cat']},
      {id:'oven', t:'in the oven', doing:['bakes']},
      {id:'table', t:'on the table', doing:['rolls']}
    ],
    describe:[
      {id:'busy', t:'busy', who:['boy','mum']},
      {id:'careful', t:'careful', who:['boy']},
      {id:'helpful', t:'helpful', who:['boy']},
      {id:'cheerful', t:'cheerful', who:['mum','boy']},
      {id:'stripy', t:'stripy', who:['cat']},
      {id:'curious', t:'curious', who:['cat']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['cracks','stirs','rolls']},
      {id:'slowly', t:'slowly', doing:['stirs','mixes','rolls']},
      {id:'quickly', t:'quickly', doing:['mixes','stirs']},
      {id:'happily', t:'happily', doing:['smiles','bakes']},
      {id:'quietly', t:'quietly', doing:['watches','sits']}
    ],
    when:[
      {id:'sunday', t:'on Sunday'},
      {id:'morning', t:'this morning'},
      {id:'school', t:'after school'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'library', title:'In the library', img:'images/everyday-library.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'librarian', det:'the', t:'librarian', person:true},
      {id:'grandad', det:'the', t:'grandad', person:true}
    ],
    doing:[
      {id:'reads', t:'reads', who:['girl','grandad']},
      {id:'reaches', t:'reaches up', needs:'none', who:['boy']},
      {id:'takes', t:'takes', needs:'what', who:['boy']},
      {id:'chooses', t:'chooses', needs:'what', who:['boy','girl']},
      {id:'stamps', t:'stamps', needs:'what', who:['librarian']},
      {id:'sits', t:'sits', needs:'none', who:['girl','grandad']},
      {id:'smiles', t:'smiles', needs:'none', who:['librarian','girl']}
    ],
    what:[
      {id:'book', t:'a book', doing:['reads','takes','stamps','chooses']},
      {id:'paper', t:'a newspaper', doing:['reads'], who:['grandad']},
      {id:'story', t:'a story', doing:['reads','chooses'], who:['girl','boy']}
    ],
    where:[
      {id:'beanbag', t:'on a beanbag', who:['girl'], doing:['reads','sits','smiles']},
      {id:'armchair', t:'in an armchair', who:['grandad'], doing:['reads','sits']},
      {id:'desk', t:'at the desk', who:['librarian']},
      {id:'shelf', t:'from the shelf', doing:['takes','chooses']},
      {id:'library', t:'in the library'},
      {id:'window', t:'by the window', who:['grandad']}
    ],
    describe:[
      {id:'quiet', t:'quiet', who:['girl','boy','grandad']},
      {id:'curious', t:'curious', who:['boy','girl']},
      {id:'calm', t:'calm', who:['girl','grandad']},
      {id:'helpful', t:'helpful', who:['librarian']},
      {id:'friendly', t:'friendly', who:['librarian','grandad']},
      {id:'busy', t:'busy', who:['librarian']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['reads','sits','takes','chooses']},
      {id:'carefully', t:'carefully', doing:['takes','stamps','reaches','chooses']},
      {id:'slowly', t:'slowly', doing:['reads','reaches']},
      {id:'happily', t:'happily', doing:['reads','smiles']},
      {id:'quickly', t:'quickly', doing:['stamps','takes']}
    ],
    when:[
      {id:'school', t:'after school'},
      {id:'saturday', t:'on Saturday'},
      {id:'week', t:'every week'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'pool', title:'Swimming lesson', img:'images/everyday-pool.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'teacher', det:'the', t:'swimming teacher', person:true},
      {id:'lifeguard', det:'the', t:'lifeguard', person:true}
    ],
    doing:[
      {id:'swims', t:'swims', needs:'none', who:['girl']},
      {id:'kicks', t:'kicks', needs:'none', who:['girl']},
      {id:'floats', t:'floats', needs:'none', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['girl']},
      {id:'jumps', t:'jumps', needs:'none', who:['boy']},
      {id:'splashes', t:'splashes', needs:'none', who:['boy','girl']},
      {id:'points', t:'points at', needs:'what', who:['teacher']},
      {id:'watches', t:'watches', needs:'what', who:['teacher','lifeguard']},
      {id:'sits', t:'sits', needs:'none', who:['lifeguard']},
      {id:'smiles', t:'smiles', needs:'none', who:['teacher','boy','girl']}
    ],
    what:[
      {id:'float', t:'a float', doing:['holds']},
      {id:'girl', t:'the girl', doing:['watches','points']},
      {id:'boy', t:'the boy', doing:['watches','points']},
      {id:'pool', t:'the pool', doing:['watches'], who:['lifeguard']}
    ],
    where:[
      {id:'pool', t:'in the pool', who:['girl','boy']},
      {id:'water', t:'into the water', doing:['jumps']},
      {id:'across', t:'across the pool', doing:['swims','kicks']},
      {id:'edge', t:'by the edge', who:['teacher']},
      {id:'chair', t:'on a tall chair', who:['lifeguard']}
    ],
    describe:[
      {id:'brave', t:'brave', who:['girl','boy']},
      {id:'wet', t:'wet', who:['girl','boy']},
      {id:'strong', t:'strong', who:['girl']},
      {id:'excited', t:'excited', who:['boy']},
      {id:'helpful', t:'helpful', who:['teacher']},
      {id:'careful', t:'careful', who:['lifeguard','teacher']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['swims','kicks']},
      {id:'bravely', t:'bravely', doing:['jumps','swims','floats']},
      {id:'carefully', t:'carefully', doing:['watches','holds']},
      {id:'loudly', t:'loudly', doing:['splashes']},
      {id:'happily', t:'happily', doing:['smiles','splashes','jumps']}
    ],
    when:[
      {id:'monday', t:'on Monday'},
      {id:'week', t:'every week'},
      {id:'school', t:'after school'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'busstop', title:'Bus stop in the rain', img:'images/everyday-busstop.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'mum', det:'the', t:'mum', person:true},
      {id:'man', det:'the', t:'man', person:true},
      {id:'bus', det:'the', t:'bus'},
      {id:'rain', det:'the', t:'rain'}
    ],
    doing:[
      {id:'splashes', t:'splashes', needs:'none', who:['girl','bus']},
      {id:'jumps', t:'jumps', needs:'none', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['mum']},
      {id:'waits', t:'waits', needs:'none', who:['mum','man','girl']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl','mum']},
      {id:'sits', t:'sits', needs:'none', who:['man']},
      {id:'comes', t:'comes', needs:'none', who:['bus']},
      {id:'stops', t:'stops', needs:'none', who:['bus']},
      {id:'falls', t:'falls', needs:'none', who:['rain']},
      {id:'pours', t:'pours', needs:'none', who:['rain']}
    ],
    what:[
      {id:'umbrella', t:'a big umbrella', doing:['holds']},
      {id:'bag', t:'a bag', doing:['holds']}
    ],
    where:[
      {id:'puddle', t:'in a puddle', doing:['splashes','jumps'], who:['girl']},
      {id:'stop', t:'at the bus stop', doing:['waits','smiles','sits','stops','holds','splashes']},
      {id:'shelter', t:'in the shelter', who:['man']},
      {id:'road', t:'down the road', who:['bus'], doing:['comes','splashes']},
      {id:'pavement', t:'on the pavement', who:['girl','mum'], doing:['waits','splashes','jumps','holds','smiles']},
      {id:'sky', t:'from the sky', doing:['falls','pours']}
    ],
    describe:[
      {id:'wet', t:'wet', who:['girl','mum','man']},
      {id:'cold', t:'cold', who:['man','mum','rain']},
      {id:'old', t:'old', who:['man']},
      {id:'cheerful', t:'cheerful', who:['girl','mum']},
      {id:'red', t:'red', who:['bus']},
      {id:'big', t:'big', who:['bus']},
      {id:'heavy', t:'heavy', who:['rain']}
    ],
    how:[
      {id:'happily', t:'happily', doing:['splashes','jumps','smiles']},
      {id:'patiently', t:'patiently', doing:['waits','sits']},
      {id:'tightly', t:'tightly', doing:['holds']},
      {id:'slowly', t:'slowly', doing:['comes','stops']},
      {id:'heavily', t:'heavily', doing:['falls','pours']}
    ],
    when:[
      {id:'rainy', t:'on a rainy day'},
      {id:'morning', t:'this morning'},
      {id:'school', t:'after school'},
      {id:'every', t:'every day'}
    ]
  },
  {
    id:'bedroom', title:'Reading by torchlight', img:'images/everyday-bedroom.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'cat', det:'the', t:'cat'},
      {id:'teddy', det:'the', t:'teddy bear'},
      {id:'torch', det:'the', t:'torch'},
      {id:'moon', det:'the', t:'moon'}
    ],
    doing:[
      {id:'reads', t:'reads', who:['girl']},
      {id:'holds', t:'holds', needs:'what', who:['girl']},
      {id:'hides', t:'hides', needs:'none', who:['girl']},
      {id:'smiles', t:'smiles', needs:'none', who:['girl']},
      {id:'sleeps', t:'sleeps', needs:'none', who:['cat']},
      {id:'purrs', t:'purrs', needs:'none', who:['cat']},
      {id:'sits', t:'sits', needs:'none', who:['teddy']},
      {id:'shines', t:'shines', needs:'none', who:['torch','moon']}
    ],
    what:[
      {id:'book', t:'a book', doing:['reads','holds']},
      {id:'story', t:'a story', doing:['reads']},
      {id:'torch', t:'a torch', doing:['holds']}
    ],
    where:[
      {id:'bed', t:'in bed', who:['girl']},
      {id:'duvet', t:'under the duvet', who:['girl']},
      {id:'onbed', t:'on the bed', who:['cat','teddy']},
      {id:'pillow', t:'by the pillow', who:['teddy']},
      {id:'sky', t:'in the sky', who:['moon']},
      {id:'window', t:'through the window', who:['moon']},
      {id:'page', t:'on the page', who:['torch']}
    ],
    describe:[
      {id:'sleepy', t:'sleepy', who:['girl','cat']},
      {id:'quiet', t:'quiet', who:['girl']},
      {id:'curious', t:'curious', who:['girl']},
      {id:'soft', t:'soft', who:['teddy','cat']},
      {id:'fluffy', t:'fluffy', who:['cat','teddy']},
      {id:'bright', t:'bright', who:['moon','torch']},
      {id:'round', t:'round', who:['moon']}
    ],
    how:[
      {id:'quietly', t:'quietly', doing:['reads','hides','sleeps','sits']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'peacefully', t:'peacefully', doing:['sleeps','sits']},
      {id:'softly', t:'softly', doing:['purrs','shines']},
      {id:'happily', t:'happily', doing:['reads','smiles','purrs']}
    ],
    when:[
      {id:'bedtime', t:'at bedtime'},
      {id:'every', t:'every night'},
      {id:'late', t:'late at night'},
      {id:'tonight', t:'tonight'}
    ]
  },
  {
    id:'football', title:'Football in the park', img:'images/everyday-football.jpg',
    who:[
      {id:'girl', det:'the', t:'girl', person:true},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'keeper', det:'the', t:'goalkeeper', person:true},
      {id:'referee', det:'the', t:'referee', person:true},
      {id:'crowd', det:'the', t:'crowd', person:true}
    ],
    doing:[
      {id:'kicks', t:'kicks', needs:'what', who:['girl','boy']},
      {id:'scores', t:'scores', needs:'none', who:['girl']},
      {id:'runs', t:'runs', needs:'none', who:['girl','boy','referee']},
      {id:'dives', t:'dives', needs:'none', who:['keeper']},
      {id:'saves', t:'saves', needs:'what', who:['keeper']},
      {id:'blows', t:'blows', needs:'what', who:['referee']},
      {id:'cheers', t:'cheers', needs:'none', who:['crowd']},
      {id:'watches', t:'watches', needs:'what', who:['crowd','referee']}
    ],
    what:[
      {id:'ball', t:'the ball', doing:['kicks','saves','watches']},
      {id:'whistle', t:'a whistle', doing:['blows']},
      {id:'match', t:'the match', doing:['watches']}
    ],
    where:[
      {id:'goal', t:'towards the goal', doing:['kicks','runs']},
      {id:'park', t:'in the park'},
      {id:'grass', t:'across the grass', doing:['runs']},
      {id:'across', t:'across the goal', doing:['dives']},
      {id:'side', t:'at the side', who:['crowd']}
    ],
    describe:[
      {id:'fast', t:'fast', who:['girl','boy']},
      {id:'strong', t:'strong', who:['girl','boy']},
      {id:'brave', t:'brave', who:['keeper']},
      {id:'fair', t:'fair', who:['referee']},
      {id:'noisy', t:'noisy', who:['crowd']},
      {id:'excited', t:'excited', who:['crowd','girl','boy']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['runs','kicks','dives']},
      {id:'loudly', t:'loudly', doing:['cheers','blows']},
      {id:'hard', t:'hard', doing:['kicks','blows']},
      {id:'bravely', t:'bravely', doing:['dives','saves']},
      {id:'carefully', t:'carefully', doing:['watches']}
    ],
    when:[
      {id:'saturday', t:'on Saturday'},
      {id:'afternoon', t:'this afternoon'},
      {id:'school', t:'after school'},
      {id:'today', t:'today'}
    ]
  },
  {
    id:'zoo', title:'Penguin feeding time', img:'images/everyday-zoo.jpg',
    who:[
      {id:'keeper', det:'the', t:'zookeeper', person:true},
      {id:'penguin', det:'the', t:'penguin'},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'grandma', det:'the', t:'grandma', person:true}
    ],
    doing:[
      {id:'feeds', t:'feeds', needs:'what', who:['keeper']},
      {id:'throws', t:'throws', needs:'what', who:['keeper']},
      {id:'holds', t:'holds', needs:'what', who:['keeper']},
      {id:'dives', t:'dives', needs:'none', who:['penguin']},
      {id:'swims', t:'swims', needs:'none', who:['penguin']},
      {id:'waddles', t:'waddles', needs:'none', who:['penguin']},
      {id:'catches', t:'catches', needs:'what', who:['penguin']},
      {id:'points', t:'points at', needs:'what', who:['boy']},
      {id:'watches', t:'watches', needs:'what', who:['boy','grandma','penguin']},
      {id:'smiles', t:'smiles', needs:'none', who:['grandma','boy','keeper']}
    ],
    what:[
      {id:'fish', t:'a fish', doing:['throws','catches','holds']},
      {id:'penguins', t:'the penguins', doing:['feeds','watches','points'], who:['keeper','boy','grandma']},
      {id:'keeper', t:'the zookeeper', doing:['watches','points'], who:['penguin','boy','grandma']},
      {id:'bucket', t:'a bucket', doing:['holds']}
    ],
    where:[
      {id:'pool', t:'into the pool', doing:['dives']},
      {id:'water', t:'in the water', doing:['swims']},
      {id:'rocks', t:'on the rocks', who:['penguin','keeper'], doing:['waddles','watches','feeds','holds','smiles']},
      {id:'zoo', t:'at the zoo'},
      {id:'glass', t:'by the glass', who:['boy','grandma']}
    ],
    describe:[
      {id:'hungry', t:'hungry', who:['penguin']},
      {id:'bw', t:'black and white', who:['penguin']},
      {id:'busy', t:'busy', who:['keeper']},
      {id:'kind', t:'kind', who:['keeper','grandma']},
      {id:'excited', t:'excited', who:['boy']},
      {id:'happy', t:'happy', who:['grandma','boy']}
    ],
    how:[
      {id:'quickly', t:'quickly', doing:['dives','swims','catches']},
      {id:'gently', t:'gently', doing:['throws','holds']},
      {id:'excitedly', t:'excitedly', doing:['points','watches']},
      {id:'happily', t:'happily', doing:['smiles','watches','waddles']},
      {id:'carefully', t:'carefully', doing:['feeds','throws','holds']}
    ],
    when:[
      {id:'feeding', t:'at feeding time'},
      {id:'afternoon', t:'every afternoon'},
      {id:'today', t:'today'},
      {id:'two', t:'at two o’clock'}
    ]
  },
  {
    id:'vet', title:'At the vet', img:'images/everyday-vet.jpg',
    who:[
      {id:'vet', det:'the', t:'vet', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'boy', det:'the', t:'boy', person:true},
      {id:'dad', det:'the', t:'dad', person:true},
      {id:'cat', det:'the', t:'cat'}
    ],
    doing:[
      {id:'checks', t:'checks', needs:'what', who:['vet']},
      {id:'listens', t:'listens to', needs:'what', who:['vet']},
      {id:'strokes', t:'strokes', needs:'what', who:['boy']},
      {id:'holds', t:'holds', needs:'what', who:['dad']},
      {id:'stands', t:'stands', needs:'none', who:['dog','dad','boy']},
      {id:'waits', t:'waits', needs:'none', who:['cat','dad','dog']},
      {id:'sits', t:'sits', needs:'none', who:['cat']},
      {id:'smiles', t:'smiles', needs:'none', who:['vet','dad','boy']}
    ],
    what:[
      {id:'dog', t:'the dog', doing:['checks','strokes']},
      {id:'heart', t:'the dog’s heart', doing:['listens']},
      {id:'lead', t:'the lead', doing:['holds']}
    ],
    where:[
      {id:'table', t:'on the table', who:['dog']},
      {id:'atable', t:'at the table', who:['vet']},
      {id:'basket', t:'in a basket', who:['cat']},
      {id:'next', t:'next to the table', who:['boy','dad']},
      {id:'room', t:'in the vet’s room', who:['dog','boy','dad','cat']}
    ],
    describe:[
      {id:'kind', t:'kind', who:['vet','boy']},
      {id:'gentle', t:'gentle', who:['vet','boy']},
      {id:'calm', t:'calm', who:['dog','dad','vet']},
      {id:'brave', t:'brave', who:['dog']},
      {id:'worried', t:'worried', who:['dad','boy']},
      {id:'fluffy', t:'fluffy', who:['cat']},
      {id:'sleepy', t:'sleepy', who:['cat']}
    ],
    how:[
      {id:'gently', t:'gently', doing:['checks','strokes','listens','holds']},
      {id:'carefully', t:'carefully', doing:['checks','listens','holds']},
      {id:'patiently', t:'patiently', doing:['waits','sits','stands']},
      {id:'calmly', t:'calmly', doing:['stands','waits','holds']},
      {id:'happily', t:'happily', doing:['smiles']}
    ],
    when:[
      {id:'morning', t:'this morning'},
      {id:'today', t:'today'},
      {id:'school', t:'after school'},
      {id:'monday', t:'on Monday'}
    ]
  }
]});
