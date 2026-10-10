/* Sentence Builder — Characters set (All years). Character pictures for descriptive and
 * narrative writing. Same schema as content.js. */
TOPICS.push({
  id:'characters', label:'Characters', years:'All years', pictures:[
  {
    id:'fisherman', title:'Old fisherman', img:'images/characters-fisherman.jpg',
    who:[
      {id:'fisherman', det:'the', t:'fisherman', person:true},
      {id:'gull', det:'the', t:'seagull'},
      {id:'boat', det:'the', t:'rowing boat'},
      {id:'sun', det:'the', t:'sun'}
    ],
    doing:[
      {id:'mends', t:'mends', needs:'what', who:['fisherman']},
      {id:'pulls', t:'pulls', needs:'what', who:['fisherman']},
      {id:'hums', t:'hums', needs:'none', who:['fisherman']},
      {id:'sits', t:'sits', needs:'none', who:['fisherman','gull']},
      {id:'watches', t:'watches', needs:'what', who:['fisherman','gull']},
      {id:'squawks', t:'squawks', needs:'none', who:['gull']},
      {id:'flies', t:'flies', needs:'none', who:['gull']},
      {id:'bobs', t:'bobs', needs:'none', who:['boat']},
      {id:'rises', t:'rises', needs:'none', who:['sun']}
    ],
    what:[
      {id:'net', t:'a fishing net', doing:['mends','pulls']},
      {id:'rope', t:'a tangled rope', doing:['pulls']},
      {id:'boats', t:'the fishing boats', doing:['watches']},
      {id:'sea', t:'the calm sea', doing:['watches']},
      {id:'gulls', t:'the seagulls', doing:['watches'], who:['fisherman']}
    ],
    where:[
      {id:'wall', t:'on the harbour wall', who:['fisherman','gull'], doing:['mends','pulls','hums','sits','watches','squawks']},
      {id:'water', t:'on the calm water', who:['boat'], doing:['bobs']},
      {id:'harbour', t:'in the harbour', who:['boat'], doing:['bobs']},
      {id:'above', t:'above the harbour', who:['gull','sun'], doing:['flies','rises']},
      {id:'hills', t:'over the hills', who:['gull','sun'], doing:['flies','rises']}
    ],
    describe:[
      {id:'weathered', t:'weathered', who:['fisherman','boat']},
      {id:'wrinkled', t:'wrinkled', who:['fisherman']},
      {id:'bearded', t:'bearded', who:['fisherman']},
      {id:'patient', t:'patient', who:['fisherman']},
      {id:'hardworking', t:'hardworking', who:['fisherman']},
      {id:'old', t:'old', who:['fisherman','boat']},
      {id:'wooden', t:'wooden', who:['boat']},
      {id:'noisy', t:'noisy', who:['gull']},
      {id:'hungry', t:'hungry', who:['gull']},
      {id:'golden', t:'golden', who:['sun']}
    ],
    how:[
      {id:'patiently', t:'patiently', doing:['mends','watches','sits','pulls']},
      {id:'carefully', t:'carefully', doing:['mends','pulls','watches']},
      {id:'slowly', t:'slowly', doing:['mends','pulls','bobs','rises','flies']},
      {id:'gently', t:'gently', doing:['bobs','pulls','mends']},
      {id:'loudly', t:'loudly', doing:['squawks']},
      {id:'quietly', t:'quietly', doing:['hums','sits','watches','mends']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'every', t:'every morning'},
      {id:'breakfast', t:'before breakfast'},
      {id:'night', t:'after a long night'}
    ]
  },
  {
    id:'traveller', title:'Hooded traveller', img:'images/characters-traveller.jpg',
    who:[
      {id:'traveller', det:'the', t:'traveller', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'owl', det:'the', t:'owl'},
      {id:'lantern', det:'the', t:'lantern'},
      {id:'mist', det:'the', t:'mist'}
    ],
    doing:[
      {id:'walks', t:'walks', needs:'none', who:['traveller','dog']},
      {id:'carries', t:'carries', needs:'what', who:['traveller']},
      {id:'holds', t:'holds up', needs:'what', who:['traveller']},
      {id:'trots', t:'trots', needs:'none', who:['dog']},
      {id:'sniffs', t:'sniffs', needs:'what', who:['dog']},
      {id:'watches', t:'watches', needs:'what', who:['traveller','dog','owl']},
      {id:'hoots', t:'hoots', needs:'none', who:['owl']},
      {id:'perches', t:'perches', needs:'none', who:['owl']},
      {id:'glows', t:'glows', needs:'none', who:['lantern']},
      {id:'drifts', t:'drifts', needs:'none', who:['mist']}
    ],
    what:[
      {id:'lantern', t:'a glowing lantern', doing:['carries','holds']},
      {id:'stick', t:'a walking stick', doing:['carries','holds']},
      {id:'path', t:'the muddy path', doing:['sniffs','watches']},
      {id:'road', t:'the winding road', doing:['watches']},
      {id:'traveller', t:'the traveller', doing:['watches'], who:['dog','owl']}
    ],
    where:[
      {id:'road', t:'along the winding road', doing:['walks','trots','drifts']},
      {id:'fields', t:'across the misty fields', doing:['drifts','walks','trots']},
      {id:'fence', t:'on the old fence', who:['owl'], doing:['perches','hoots','watches']},
      {id:'beside', t:'beside the traveller', who:['dog'], doing:['trots','walks','sniffs']},
      {id:'dark', t:'in the dark', doing:['glows','hoots']},
      {id:'tree', t:'under the old tree', who:['traveller','dog'], doing:['walks','trots']}
    ],
    describe:[
      {id:'hooded', t:'hooded', who:['traveller']},
      {id:'mysterious', t:'mysterious', who:['traveller','owl']},
      {id:'lonely', t:'lonely', who:['traveller']},
      {id:'weary', t:'weary', who:['traveller','dog']},
      {id:'determined', t:'determined', who:['traveller']},
      {id:'loyal', t:'loyal', who:['dog']},
      {id:'scruffy', t:'scruffy', who:['dog']},
      {id:'wise', t:'wise', who:['owl']},
      {id:'flickering', t:'flickering', who:['lantern']},
      {id:'thick', t:'thick', who:['mist']}
    ],
    how:[
      {id:'wearily', t:'wearily', doing:['walks','trots','carries']},
      {id:'silently', t:'silently', doing:['walks','watches','drifts','perches']},
      {id:'slowly', t:'slowly', doing:['walks','drifts','trots']},
      {id:'steadily', t:'steadily', doing:['walks','glows','carries']},
      {id:'softly', t:'softly', doing:['hoots','glows']},
      {id:'bravely', t:'bravely', doing:['walks','holds']}
    ],
    when:[
      {id:'dusk', t:'at dusk'},
      {id:'tonight', t:'tonight'},
      {id:'evening', t:'all evening'},
      {id:'sets', t:'as the sun sets'}
    ]
  },
  {
    id:'explorer', title:'Jungle explorer', img:'images/characters-explorer.jpg',
    who:[
      {id:'explorer', det:'the', t:'explorer', person:true},
      {id:'parrot', det:'the', t:'parrot'},
      {id:'monkey', det:'the', t:'monkey'},
      {id:'waterfall', det:'the', t:'waterfall'}
    ],
    doing:[
      {id:'studies', t:'studies', needs:'what', who:['explorer']},
      {id:'reads', t:'reads', needs:'what', who:['explorer']},
      {id:'holds', t:'holds', needs:'what', who:['explorer']},
      {id:'explores', t:'explores', needs:'what', who:['explorer']},
      {id:'watches', t:'watches', needs:'what', who:['explorer','parrot','monkey']},
      {id:'climbs', t:'climbs', who:['explorer','monkey']},
      {id:'squawks', t:'squawks', needs:'none', who:['parrot']},
      {id:'perches', t:'perches', needs:'none', who:['parrot']},
      {id:'peers', t:'peers out', needs:'none', who:['monkey']},
      {id:'tumbles', t:'tumbles', needs:'none', who:['waterfall']}
    ],
    what:[
      {id:'map', t:'an old map', doing:['studies','holds','reads']},
      {id:'compass', t:'a brass compass', doing:['holds','studies']},
      {id:'ruins', t:'the ancient ruins', doing:['explores','studies','watches']},
      {id:'vine', t:'a twisting vine', doing:['climbs']},
      {id:'explorer', t:'the explorer', doing:['watches'], who:['parrot','monkey']}
    ],
    where:[
      {id:'ruins', t:'among the ancient ruins', who:['explorer','monkey'], doing:['studies','reads','holds','watches','climbs']},
      {id:'jungle', t:'in the steamy jungle', who:['explorer'], doing:['studies','reads','holds','explores']},
      {id:'pillar', t:'on a stone pillar', who:['parrot'], doing:['perches','squawks','watches']},
      {id:'trees', t:'in the trees', who:['monkey','parrot'], doing:['peers','climbs','squawks','watches']},
      {id:'cliff', t:'down the rocky cliff', who:['waterfall'], doing:['tumbles']}
    ],
    describe:[
      {id:'young', t:'young', who:['explorer']},
      {id:'curious', t:'curious', who:['explorer','monkey']},
      {id:'adventurous', t:'adventurous', who:['explorer']},
      {id:'determined', t:'determined', who:['explorer']},
      {id:'brave', t:'brave', who:['explorer']},
      {id:'cheeky', t:'cheeky', who:['monkey']},
      {id:'colourful', t:'colourful', who:['parrot']},
      {id:'noisy', t:'noisy', who:['parrot','monkey']},
      {id:'mighty', t:'mighty', who:['waterfall']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['studies','reads','holds','climbs','explores']},
      {id:'curiously', t:'curiously', doing:['watches','studies','peers','explores']},
      {id:'eagerly', t:'eagerly', doing:['explores','studies','reads']},
      {id:'quietly', t:'quietly', doing:['watches','perches','peers','reads']},
      {id:'loudly', t:'loudly', doing:['squawks','tumbles']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'trek', t:'after a long trek'},
      {id:'afternoon', t:'in the afternoon'},
      {id:'last', t:'at last'}
    ]
  },
  {
    id:'baker', title:'Old baker', img:'images/characters-baker.jpg',
    who:[
      {id:'baker', det:'the', t:'baker', person:true},
      {id:'cat', det:'the', t:'cat'},
      {id:'oven', det:'the', t:'oven'},
      {id:'loaf', det:'the', t:'loaf'}
    ],
    doing:[
      {id:'bakes', t:'bakes', needs:'what', who:['baker']},
      {id:'lifts', t:'lifts', needs:'what', who:['baker']},
      {id:'holds', t:'holds', needs:'what', who:['baker']},
      {id:'checks', t:'checks', needs:'what', who:['baker']},
      {id:'smiles', t:'smiles', needs:'none', who:['baker']},
      {id:'sleeps', t:'sleeps', needs:'none', who:['cat']},
      {id:'purrs', t:'purrs', needs:'none', who:['cat']},
      {id:'dreams', t:'dreams', needs:'none', who:['cat']},
      {id:'glows', t:'glows', needs:'none', who:['oven']},
      {id:'crackles', t:'crackles', needs:'none', who:['oven']},
      {id:'cools', t:'cools', needs:'none', who:['loaf']}
    ],
    what:[
      {id:'tray', t:'a tray of loaves', doing:['lifts','checks','holds']},
      {id:'bread', t:'fresh bread', doing:['bakes','checks']},
      {id:'oven', t:'the hot oven', doing:['checks']},
      {id:'paddle', t:'a long wooden paddle', doing:['holds','lifts']}
    ],
    where:[
      {id:'oven', t:'from the oven', who:['baker'], doing:['lifts']},
      {id:'bakery', t:'in the bakery'},
      {id:'stool', t:'on a wooden stool', who:['cat'], doing:['sleeps','purrs','dreams']},
      {id:'corner', t:'in the corner', who:['cat','oven'], doing:['sleeps','purrs','dreams','glows','crackles']},
      {id:'shelf', t:'on the shelf', who:['loaf'], doing:['cools']}
    ],
    describe:[
      {id:'elderly', t:'elderly', who:['baker']},
      {id:'floury', t:'floury', who:['baker']},
      {id:'kind', t:'kind', who:['baker']},
      {id:'hardworking', t:'hardworking', who:['baker']},
      {id:'cheerful', t:'cheerful', who:['baker']},
      {id:'sleepy', t:'sleepy', who:['cat']},
      {id:'ginger', t:'ginger', who:['cat']},
      {id:'crusty', t:'crusty', who:['loaf']},
      {id:'golden', t:'golden', who:['loaf']},
      {id:'warm', t:'warm', who:['loaf','oven']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['lifts','checks','holds','bakes']},
      {id:'proudly', t:'proudly', doing:['lifts','smiles','bakes','holds']},
      {id:'peacefully', t:'peacefully', doing:['sleeps','dreams','purrs']},
      {id:'softly', t:'softly', doing:['purrs','crackles','glows','smiles']},
      {id:'warmly', t:'warmly', doing:['smiles','glows']},
      {id:'slowly', t:'slowly', doing:['cools','lifts']}
    ],
    when:[
      {id:'dawn', t:'at dawn'},
      {id:'sunrise', t:'before sunrise'},
      {id:'every', t:'every morning'},
      {id:'opens', t:'before the shop opens'}
    ]
  },
  {
    id:'wizard', title:'Wise wizard', img:'images/characters-wizard.jpg',
    who:[
      {id:'wizard', det:'the', t:'wizard', person:true},
      {id:'owl', det:'the', t:'owl'},
      {id:'candle', det:'the', t:'candle'},
      {id:'ball', det:'the', t:'crystal ball'}
    ],
    doing:[
      {id:'reads', t:'reads', needs:'what', who:['wizard']},
      {id:'studies', t:'studies', needs:'what', who:['wizard']},
      {id:'turns', t:'turns', needs:'what', who:['wizard']},
      {id:'strokes', t:'strokes', needs:'what', who:['wizard']},
      {id:'thinks', t:'thinks', needs:'none', who:['wizard']},
      {id:'watches', t:'watches', needs:'what', who:['wizard','owl']},
      {id:'hoots', t:'hoots', needs:'none', who:['owl']},
      {id:'perches', t:'perches', needs:'none', who:['owl']},
      {id:'flickers', t:'flickers', needs:'none', who:['candle']},
      {id:'glows', t:'glows', needs:'none', who:['candle','ball']},
      {id:'shimmers', t:'shimmers', needs:'none', who:['ball']}
    ],
    what:[
      {id:'book', t:'a huge book', doing:['reads','studies']},
      {id:'spell', t:'an ancient spell', doing:['reads','studies']},
      {id:'page', t:'the page', doing:['turns']},
      {id:'beard', t:'a long silver beard', doing:['strokes']},
      {id:'ball', t:'the crystal ball', doing:['watches','studies']},
      {id:'wizard', t:'the wizard', doing:['watches'], who:['owl']}
    ],
    where:[
      {id:'library', t:'in the library'},
      {id:'chair', t:'on the carved chair', who:['owl'], doing:['perches','hoots','watches']},
      {id:'shelves', t:'by the tall shelves', who:['wizard'], doing:['reads','studies','thinks']},
      {id:'table', t:'on the table', who:['candle','ball'], doing:['flickers','glows','shimmers']},
      {id:'dark', t:'in the dark', who:['candle','ball'], doing:['flickers','glows','shimmers']}
    ],
    describe:[
      {id:'wise', t:'wise', who:['wizard','owl']},
      {id:'ancient', t:'ancient', who:['wizard']},
      {id:'thoughtful', t:'thoughtful', who:['wizard']},
      {id:'bearded', t:'bearded', who:['wizard']},
      {id:'mysterious', t:'mysterious', who:['wizard','ball']},
      {id:'watchful', t:'watchful', who:['owl']},
      {id:'speckled', t:'speckled', who:['owl']},
      {id:'flickering', t:'flickering', who:['candle']},
      {id:'magical', t:'magical', who:['ball']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['reads','studies','turns','strokes','watches']},
      {id:'slowly', t:'slowly', doing:['reads','turns','strokes']},
      {id:'quietly', t:'quietly', doing:['reads','thinks','hoots','watches','perches']},
      {id:'deeply', t:'deeply', doing:['thinks']},
      {id:'silently', t:'silently', doing:['watches','perches','glows','shimmers']},
      {id:'gently', t:'gently', doing:['flickers','glows','strokes','turns']}
    ],
    when:[
      {id:'midnight', t:'at midnight'},
      {id:'late', t:'late at night'},
      {id:'allnight', t:'all night'},
      {id:'dawn', t:'before dawn'}
    ]
  },
  {
    id:'musician', title:'Street musician', img:'images/characters-musician.jpg',
    who:[
      {id:'musician', det:'the', t:'musician', person:true},
      {id:'dog', det:'the', t:'dog'},
      {id:'passer', det:'a', t:'passer-by', person:true},
      {id:'rain', det:'the', t:'rain'}
    ],
    doing:[
      {id:'plays', t:'plays', needs:'what', who:['musician']},
      {id:'sways', t:'sways', needs:'none', who:['musician']},
      {id:'listens', t:'listens', needs:'none', who:['dog']},
      {id:'sits', t:'sits', needs:'none', who:['dog']},
      {id:'watches', t:'watches', needs:'what', who:['dog','passer']},
      {id:'walks', t:'walks', needs:'none', who:['passer']},
      {id:'hurries', t:'hurries', needs:'none', who:['passer']},
      {id:'carries', t:'carries', needs:'what', who:['passer']},
      {id:'falls', t:'falls', needs:'none', who:['rain']},
      {id:'patters', t:'patters', needs:'none', who:['rain']}
    ],
    what:[
      {id:'violin', t:'the violin', doing:['plays']},
      {id:'tune', t:'a sad tune', doing:['plays']},
      {id:'song', t:'a cheerful song', doing:['plays']},
      {id:'umbrella', t:'a red umbrella', doing:['carries']},
      {id:'musician', t:'the musician', doing:['watches']}
    ],
    where:[
      {id:'street', t:'on the cobbled street'},
      {id:'lamp', t:'under a street lamp', who:['musician','dog'], doing:['plays','sways','listens','sits']},
      {id:'case', t:'beside the violin case', who:['dog'], doing:['sits','listens','watches']},
      {id:'home', t:'towards home', who:['passer'], doing:['walks','hurries']},
      {id:'puddles', t:'into the puddles', who:['rain'], doing:['falls','patters']}
    ],
    describe:[
      {id:'talented', t:'talented', who:['musician']},
      {id:'dreamy', t:'dreamy', who:['musician']},
      {id:'patient', t:'patient', who:['musician','dog']},
      {id:'soaked', t:'soaked', who:['musician','dog']},
      {id:'scruffy', t:'scruffy', who:['musician','dog']},
      {id:'loyal', t:'loyal', who:['dog']},
      {id:'busy', t:'busy', who:['passer']},
      {id:'heavy', t:'heavy', who:['rain']},
      {id:'gentle', t:'gentle', who:['dog']},
      {id:'cold', t:'cold', who:['rain']}
    ],
    how:[
      {id:'beautifully', t:'beautifully', doing:['plays']},
      {id:'gently', t:'gently', doing:['plays','sways','falls','patters']},
      {id:'quietly', t:'quietly', doing:['listens','sits','watches','patters']},
      {id:'patiently', t:'patiently', doing:['sits','listens','watches','plays']},
      {id:'quickly', t:'quickly', doing:['hurries','walks']},
      {id:'steadily', t:'steadily', doing:['falls','patters','plays']}
    ],
    when:[
      {id:'dusk', t:'at dusk'},
      {id:'tonight', t:'tonight'},
      {id:'evening', t:'all evening'},
      {id:'night', t:'as night falls'}
    ]
  },
  {
    id:'detective', title:'Attic detective', img:'images/characters-detective.jpg',
    who:[
      {id:'detective', det:'the', t:'detective', person:true},
      {id:'mouse', det:'the', t:'mouse'},
      {id:'sunlight', det:'the', t:'sunlight'},
      {id:'dust', det:'the', t:'dust'}
    ],
    doing:[
      {id:'examines', t:'examines', needs:'what', who:['detective']},
      {id:'follows', t:'follows', needs:'what', who:['detective']},
      {id:'searches', t:'searches', who:['detective','mouse']},
      {id:'kneels', t:'kneels', needs:'none', who:['detective']},
      {id:'whispers', t:'whispers', needs:'none', who:['detective']},
      {id:'watches', t:'watches', needs:'what', who:['detective','mouse']},
      {id:'peeps', t:'peeps out', needs:'none', who:['mouse']},
      {id:'scurries', t:'scurries', needs:'none', who:['mouse']},
      {id:'shines', t:'shines', needs:'none', who:['sunlight']},
      {id:'floats', t:'floats', needs:'none', who:['dust']}
    ],
    what:[
      {id:'prints', t:'the tiny footprints', doing:['examines','follows','watches']},
      {id:'clue', t:'a clue', doing:['examines','follows']},
      {id:'trunk', t:'an old trunk', doing:['searches','examines']},
      {id:'attic', t:'the dusty attic', doing:['searches']},
      {id:'detective', t:'the detective', doing:['watches'], who:['mouse']}
    ],
    where:[
      {id:'floor', t:'on the dusty floor', who:['detective','mouse'], doing:['kneels','examines','scurries','searches']},
      {id:'attic', t:'in the attic', doing:['kneels','examines','follows','whispers','peeps','scurries','watches','shines','floats']},
      {id:'boxes', t:'behind the boxes', who:['mouse'], doing:['peeps','scurries','watches']},
      {id:'window', t:'through the round window', who:['sunlight'], doing:['shines']},
      {id:'light', t:'in the sunlight', who:['dust'], doing:['floats']}
    ],
    describe:[
      {id:'curious', t:'curious', who:['detective','mouse']},
      {id:'clever', t:'clever', who:['detective']},
      {id:'determined', t:'determined', who:['detective']},
      {id:'young', t:'young', who:['detective']},
      {id:'observant', t:'observant', who:['detective']},
      {id:'tiny', t:'tiny', who:['mouse']},
      {id:'nervous', t:'nervous', who:['mouse']},
      {id:'golden', t:'golden', who:['sunlight','dust']}
    ],
    how:[
      {id:'carefully', t:'carefully', doing:['examines','follows','searches']},
      {id:'closely', t:'closely', doing:['examines','watches','follows']},
      {id:'quietly', t:'quietly', doing:['kneels','whispers','searches','follows','watches','peeps']},
      {id:'nervously', t:'nervously', doing:['peeps','watches','scurries']},
      {id:'quickly', t:'quickly', doing:['scurries','follows','searches']},
      {id:'brightly', t:'brightly', doing:['shines']},
      {id:'slowly', t:'slowly', doing:['floats','follows']}
    ],
    when:[
      {id:'school', t:'after school'},
      {id:'afternoon', t:'this afternoon'},
      {id:'last', t:'at last'},
      {id:'tea', t:'before tea'}
    ]
  },
  {
    id:'toyshop', title:'Grumpy toyshop owner', img:'images/characters-toyshop.jpg',
    who:[
      {id:'owner', det:'the', t:'toyshop owner', person:true},
      {id:'cat', det:'the', t:'cat'},
      {id:'train', det:'the', t:'toy train'},
      {id:'bell', det:'the', t:'bell'}
    ],
    doing:[
      {id:'polishes', t:'polishes', needs:'what', who:['owner']},
      {id:'holds', t:'holds', needs:'what', who:['owner']},
      {id:'frowns', t:'frowns', needs:'none', who:['owner']},
      {id:'grumbles', t:'grumbles', needs:'none', who:['owner']},
      {id:'watches', t:'watches', needs:'what', who:['owner','cat']},
      {id:'stares', t:'stares at', needs:'what', who:['owner','cat']},
      {id:'sits', t:'sits', needs:'none', who:['cat']},
      {id:'chugs', t:'chugs', needs:'none', who:['train']},
      {id:'rattles', t:'rattles', needs:'none', who:['train']},
      {id:'rings', t:'rings', needs:'none', who:['bell']}
    ],
    what:[
      {id:'soldier', t:'a toy soldier', doing:['polishes','holds','watches','stares']},
      {id:'cloth', t:'a soft cloth', doing:['holds']},
      {id:'train', t:'the toy train', doing:['watches','stares']},
      {id:'cat', t:'the black cat', doing:['watches','stares'], who:['owner']},
      {id:'owner', t:'the owner', doing:['watches','stares'], who:['cat']}
    ],
    where:[
      {id:'shop', t:'in the toyshop'},
      {id:'behind', t:'behind the counter', who:['owner'], doing:['polishes','holds','frowns','grumbles','watches','stares']},
      {id:'counter', t:'on the counter', who:['cat','train'], doing:['sits','chugs','rattles','watches','stares']},
      {id:'track', t:'along the track', who:['train'], doing:['chugs','rattles']},
      {id:'door', t:'above the door', who:['bell'], doing:['rings']}
    ],
    describe:[
      {id:'grumpy', t:'grumpy', who:['owner']},
      {id:'old', t:'old', who:['owner','train']},
      {id:'frowning', t:'frowning', who:['owner']},
      {id:'fussy', t:'fussy', who:['owner']},
      {id:'badtempered', t:'bad-tempered', who:['owner']},
      {id:'wrinkled', t:'wrinkled', who:['owner']},
      {id:'black', t:'black', who:['cat']},
      {id:'curious', t:'curious', who:['cat']},
      {id:'little', t:'little', who:['train']},
      {id:'brass', t:'brass', who:['bell']}
    ],
    how:[
      {id:'grumpily', t:'grumpily', doing:['frowns','grumbles','polishes','watches','stares'], who:['owner']},
      {id:'carefully', t:'carefully', doing:['polishes','holds','watches']},
      {id:'crossly', t:'crossly', doing:['frowns','grumbles','stares'], who:['owner']},
      {id:'curiously', t:'curiously', doing:['watches','stares']},
      {id:'noisily', t:'noisily', doing:['chugs','rattles','rings']},
      {id:'slowly', t:'slowly', doing:['chugs','polishes']}
    ],
    when:[
      {id:'every', t:'every morning'},
      {id:'closing', t:'at closing time'},
      {id:'allday', t:'all day'},
      {id:'opens', t:'before the shop opens'}
    ]
  },
  {
    id:'climber', title:'Mountain climber', img:'images/characters-climber.jpg',
    who:[
      {id:'climber', det:'the', t:'climber', person:true},
      {id:'eagle', det:'the', t:'eagle'},
      {id:'flag', det:'the', t:'flag'},
      {id:'wind', det:'the', t:'wind'}
    ],
    doing:[
      {id:'reaches', t:'reaches', needs:'what', who:['climber']},
      {id:'climbs', t:'climbs', needs:'none', who:['climber']},
      {id:'raises', t:'raises', needs:'what', who:['climber']},
      {id:'grips', t:'grips', needs:'what', who:['climber']},
      {id:'cheers', t:'cheers', needs:'none', who:['climber']},
      {id:'watches', t:'watches', needs:'what', who:['climber','eagle']},
      {id:'soars', t:'soars', needs:'none', who:['eagle']},
      {id:'glides', t:'glides', needs:'none', who:['eagle']},
      {id:'flaps', t:'flaps', needs:'none', who:['flag']},
      {id:'howls', t:'howls', needs:'none', who:['wind']}
    ],
    what:[
      {id:'summit', t:'the snowy summit', doing:['reaches']},
      {id:'top', t:'the top', doing:['reaches']},
      {id:'arm', t:'an arm', doing:['raises']},
      {id:'axe', t:'an ice axe', doing:['grips','raises']},
      {id:'rope', t:'a rope', doing:['grips']},
      {id:'peaks', t:'the snowy peaks', doing:['watches'], who:['climber']},
      {id:'climber', t:'the climber', doing:['watches'], who:['eagle']}
    ],
    where:[
      {id:'summit', t:'on the summit', who:['climber','flag'], doing:['cheers','flaps','raises','grips','watches']},
      {id:'slope', t:'up the icy slope', who:['climber'], doing:['climbs']},
      {id:'clouds', t:'above the clouds', who:['eagle','climber'], doing:['soars','glides','cheers','watches']},
      {id:'mountain', t:'across the mountain', who:['wind','eagle'], doing:['howls','soars','glides']},
      {id:'wind', t:'in the wind', who:['flag'], doing:['flaps']}
    ],
    describe:[
      {id:'determined', t:'determined', who:['climber']},
      {id:'exhausted', t:'exhausted', who:['climber']},
      {id:'proud', t:'proud', who:['climber']},
      {id:'brave', t:'brave', who:['climber']},
      {id:'triumphant', t:'triumphant', who:['climber']},
      {id:'mighty', t:'mighty', who:['eagle']},
      {id:'golden', t:'golden', who:['eagle']},
      {id:'red', t:'red', who:['flag']},
      {id:'icy', t:'icy', who:['wind']},
      {id:'fierce', t:'fierce', who:['wind']}
    ],
    how:[
      {id:'proudly', t:'proudly', doing:['raises','cheers','reaches']},
      {id:'bravely', t:'bravely', doing:['climbs','reaches','grips']},
      {id:'wearily', t:'wearily', doing:['climbs','reaches']},
      {id:'tightly', t:'tightly', doing:['grips']},
      {id:'gracefully', t:'gracefully', doing:['soars','glides']},
      {id:'wildly', t:'wildly', doing:['flaps','howls']}
    ],
    when:[
      {id:'sunrise', t:'at sunrise'},
      {id:'last', t:'at last'},
      {id:'days', t:'after many days'},
      {id:'early', t:'early this morning'}
    ]
  },
  {
    id:'giant', title:'Gentle giant', img:'images/characters-giant.jpg',
    who:[
      {id:'giant', det:'the', t:'giant', person:true},
      {id:'robin', det:'the', t:'robin'},
      {id:'sheep', det:'the', t:'sheep'},
      {id:'stream', det:'the', t:'stream'}
    ],
    doing:[
      {id:'holds', t:'holds', needs:'what', who:['giant']},
      {id:'smiles', t:'smiles', needs:'none', who:['giant']},
      {id:'sits', t:'sits', needs:'none', who:['giant']},
      {id:'whispers', t:'whispers', needs:'none', who:['giant']},
      {id:'watches', t:'watches', needs:'what', who:['giant','robin']},
      {id:'chirps', t:'chirps', needs:'none', who:['robin']},
      {id:'sings', t:'sings', needs:'none', who:['robin']},
      {id:'hops', t:'hops', needs:'none', who:['robin']},
      {id:'grazes', t:'grazes', needs:'none', who:['sheep']},
      {id:'munches', t:'munches', needs:'what', who:['sheep']},
      {id:'bleats', t:'bleats', needs:'none', who:['sheep']},
      {id:'winds', t:'winds', needs:'none', who:['stream']},
      {id:'sparkles', t:'sparkles', needs:'none', who:['stream']}
    ],
    what:[
      {id:'robin', t:'the tiny robin', doing:['holds','watches'], who:['giant']},
      {id:'giant', t:'the giant', doing:['watches'], who:['robin']},
      {id:'valley', t:'the valley', doing:['watches'], who:['giant']},
      {id:'grass', t:'the grass', doing:['munches']}
    ],
    where:[
      {id:'hillside', t:'on the hillside', who:['giant','sheep'], doing:['sits','smiles','holds','watches','whispers','grazes','munches','bleats']},
      {id:'hand', t:'on a huge hand', who:['robin'], doing:['hops','chirps','sings']},
      {id:'feet', t:"by the giant's feet", who:['sheep'], doing:['grazes','munches','bleats']},
      {id:'valley', t:'through the valley', who:['stream'], doing:['winds']},
      {id:'sunshine', t:'in the sunshine', doing:['sits','smiles','grazes','bleats','sings','chirps','sparkles']}
    ],
    describe:[
      {id:'gentle', t:'gentle', who:['giant']},
      {id:'enormous', t:'enormous', who:['giant']},
      {id:'kind', t:'kind', who:['giant']},
      {id:'shaggy', t:'shaggy', who:['giant','sheep']},
      {id:'patient', t:'patient', who:['giant']},
      {id:'tiny', t:'tiny', who:['robin']},
      {id:'trusting', t:'trusting', who:['robin']},
      {id:'woolly', t:'woolly', who:['sheep']},
      {id:'winding', t:'winding', who:['stream']},
      {id:'peaceful', t:'peaceful', who:['giant','stream']}
    ],
    how:[
      {id:'gently', t:'gently', doing:['holds','whispers','smiles','watches']},
      {id:'softly', t:'softly', doing:['whispers','chirps','sings','smiles']},
      {id:'carefully', t:'carefully', doing:['holds','watches']},
      {id:'happily', t:'happily', doing:['sings','chirps','grazes','hops','smiles','munches']},
      {id:'peacefully', t:'peacefully', doing:['sits','grazes','winds']},
      {id:'quietly', t:'quietly', doing:['sits','watches','grazes','whispers']}
    ],
    when:[
      {id:'afternoon', t:'this afternoon'},
      {id:'sunny', t:'on a sunny day'},
      {id:'summer', t:'every summer'},
      {id:'sunset', t:'before sunset'}
    ]
  }
  ]
});
