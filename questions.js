/*
 * English Quiz - Local question bank.
 *
 * Loaded as a classic <script> (not fetch / not ES module) so the app works
 * when index.html is opened by double click (file:// protocol).
 *
 * Structure:  QUESTIONS[difficulty][category] = [ item, item, ... ]
 *   - vocabulary:     { id, sentence (use ___ for the blank), options[3], correct }
 *   - trivia:         { id, question, options[4], correct }
 *   - tongue_twister: { id, text }
 *   - spelling:       { id, image_url, expected_text }
 *
 * `correct` must match one of the `options` exactly.
 * At game start one random item per category is picked for the chosen difficulty.
 */

window.CONFIG = {
  // Tongue Twister countdown (seconds) per difficulty
  timers: { easy: 10, medium: 7, hard: 5 }
};

window.QUESTIONS = {
  easy: {
    vocabulary: [
      { id: "v1", sentence: "I am very ___; can I have a glass of water?", options: ["hungry", "thirsty", "sleepy"], correct: "thirsty" },
      { id: "v2", sentence: "She wears a warm ___ when it snows outside.", options: ["coat", "swimsuit", "sandal"], correct: "coat" },
      { id: "v3", sentence: "Please ___ the door when you leave the room.", options: ["close", "eat", "write"], correct: "close" },
      { id: "v4", sentence: "My brother is very ___; he always makes everyone laugh.", options: ["angry", "funny", "tired"], correct: "funny" },
      { id: "v5", sentence: "We use a ___ to cut paper.", options: ["spoon", "pair of scissors", "pillow"], correct: "pair of scissors" },
      { id: "v6", sentence: "The opposite of \"expensive\" is ___.", options: ["cheap", "heavy", "fast"], correct: "cheap" },
      { id: "v7", sentence: "I need to buy some bread at the ___.", options: ["library", "bakery", "pharmacy"], correct: "bakery" },
      { id: "v8", sentence: "He forgot his ___ and got completely wet in the rain.", options: ["umbrella", "sunglasses", "wallet"], correct: "umbrella" },
      { id: "v9", sentence: "Birds use their ___ to fly.", options: ["fins", "paws", "wings"], correct: "wings" },
      { id: "v10", sentence: "Breakfast is the first ___ of the day.", options: ["meal", "sport", "season"], correct: "meal" }
    ],
    trivia: [
      { id: "t1", question: "What is the capital city of France?", options: ["Madrid", "Paris", "Rome", "Berlin"], correct: "Paris" },
      { id: "t2", question: "How many days are there in a leap year?", options: ["364", "365", "366", "360"], correct: "366" },
      { id: "t3", question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Saturn", "Mars"], correct: "Mars" },
      { id: "t4", question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: "Pacific Ocean" },
      { id: "t5", question: "Which animal is the tallest in the world?", options: ["Elephant", "Giraffe", "Rhino", "Ostrich"], correct: "Giraffe" },
      { id: "t6", question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correct: "7" },
      { id: "t7", question: "What do bees produce?", options: ["Milk", "Honey", "Silk", "Wax only"], correct: "Honey" },
      { id: "t8", question: "Which color is NOT in a standard rainbow?", options: ["Red", "Indigo", "Pink", "Yellow"], correct: "Pink" },
      { id: "t9", question: "What is the freezing point of water in Celsius?", options: ["0°C", "10°C", "-10°C", "100°C"], correct: "0°C" },
      { id: "t10", question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: "Leonardo da Vinci" }
    ],
    tongue_twister: [
      { id: "tt1", text: "Red lorry, yellow lorry." },
      { id: "tt2", text: "Eleven benevolent elephants." },
      { id: "tt3", text: "Big black bug bit a big black bear." },
      { id: "tt4", text: "She sells seashells by the seashore." },
      { id: "tt5", text: "Fresh fried fish, fish fresh fried." },
      { id: "tt6", text: "Toy boat, toy boat, toy boat." },
      { id: "tt7", text: "Unique New York, you know you need unique New York." },
      { id: "tt8", text: "Four fine fresh fish for you." },
      { id: "tt9", text: "Blue bluebird, black blackbird." },
      { id: "tt10", text: "Six slippery snails slid slowly seaward." }
    ],
    spelling: [
      { id: "s1", image_url: "assets/images/apple.svg", expected_text: "apple" },
      { id: "s2", image_url: "assets/images/bridge.svg", expected_text: "bridge" },
      { id: "s3", image_url: "assets/images/school.svg", expected_text: "school" },
      { id: "s4", image_url: "assets/images/turtle.svg", expected_text: "turtle" },
      { id: "s5", image_url: "assets/images/island.svg", expected_text: "island" },
      { id: "s6", image_url: "assets/images/water.svg", expected_text: "water" },
      { id: "s7", image_url: "assets/images/rocket.svg", expected_text: "rocket" },
      { id: "s8", image_url: "assets/images/family.svg", expected_text: "family" },
      { id: "s9", image_url: "assets/images/garden.svg", expected_text: "garden" },
      { id: "s10", image_url: "assets/images/window.svg", expected_text: "window" }
    ]
  },

  medium: {
    vocabulary: [
      { id: "v11", sentence: "The concert was ___ because the lead singer got sick.", options: ["postponed", "invented", "borrowed"], correct: "postponed" },
      { id: "v12", sentence: "She is a very ___ person who never gives up on her goals.", options: ["fragile", "determined", "careless"], correct: "determined" },
      { id: "v13", sentence: "Before signing the contract, make sure you read it ___.", options: ["thoroughly", "loudly", "rarely"], correct: "thoroughly" },
      { id: "v14", sentence: "The view from the top of the mountain was absolutely ___.", options: ["breathtaking", "exhausted", "predictable"], correct: "breathtaking" },
      { id: "v15", sentence: "He tried to ___ his mistake by blaming someone else.", options: ["celebrate", "conceal", "expand"], correct: "conceal" },
      { id: "v16", sentence: "Regular exercise and a balanced diet are ___ for good health.", options: ["optional", "essential", "temporary"], correct: "essential" },
      { id: "v17", sentence: "The company decided to ___ two new employees for the marketing team.", options: ["hire", "resign", "retire"], correct: "hire" },
      { id: "v18", sentence: "Despite the heavy traffic, we managed to arrive on ___.", options: ["clock", "schedule", "hour"], correct: "schedule" },
      { id: "v19", sentence: "His explanation was so ___ that nobody understood what he meant.", options: ["transparent", "vague", "precise"], correct: "vague" },
      { id: "v20", sentence: "You need a valid ___ to travel to another country.", options: ["receipt", "passport", "license"], correct: "passport" }
    ],
    trivia: [
      { id: "t11", question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: "Au" },
      { id: "t12", question: "In which year did the Titanic sink?", options: ["1905", "1912", "1918", "1923"], correct: "1912" },
      { id: "t13", question: "Which country has the largest population in the world?", options: ["China", "United States", "India", "Indonesia"], correct: "India" },
      { id: "t14", question: "What is the hardest natural substance on Earth?", options: ["Quartz", "Iron", "Diamond", "Titanium"], correct: "Diamond" },
      { id: "t15", question: "Who wrote the play \"Romeo and Juliet\"?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: "William Shakespeare" },
      { id: "t16", question: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Stomach"], correct: "Pancreas" },
      { id: "t17", question: "What is the currency of Japan?", options: ["Won", "Yuan", "Baht", "Yen"], correct: "Yen" },
      { id: "t18", question: "Which gas do plants absorb from the atmosphere for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: "Carbon dioxide" },
      { id: "t19", question: "How many bones are in an adult human body?", options: ["196", "206", "216", "226"], correct: "206" },
      { id: "t20", question: "Which desert is the largest hot desert in the world?", options: ["Gobi", "Kalahari", "Arabian", "Sahara"], correct: "Sahara" }
    ],
    tongue_twister: [
      { id: "tt11", text: "Peter Piper picked a peck of pickled peppers." },
      { id: "tt12", text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?" },
      { id: "tt13", text: "Betty Botter bought some butter, but she said the butter's bitter." },
      { id: "tt14", text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't very fuzzy, was he?" },
      { id: "tt15", text: "I scream, you scream, we all scream for ice cream!" },
      { id: "tt16", text: "Lesser leather never weathered wetter weather better." },
      { id: "tt17", text: "A proper copper coffee pot." },
      { id: "tt18", text: "Fred fed Ted bread, and Ted fed Fred bread." },
      { id: "tt19", text: "Which wristwatches are Swiss wristwatches?" },
      { id: "tt20", text: "Can you can a can as a canner can can a can?" }
    ],
    spelling: [
      { id: "s11", image_url: "assets/images/umbrella.svg", expected_text: "umbrella" },
      { id: "s12", image_url: "assets/images/volcano.svg", expected_text: "volcano" },
      { id: "s13", image_url: "assets/images/bicycle.svg", expected_text: "bicycle" },
      { id: "s14", image_url: "assets/images/calendar.svg", expected_text: "calendar" },
      { id: "s15", image_url: "assets/images/diamond.svg", expected_text: "diamond" },
      { id: "s16", image_url: "assets/images/mountain.svg", expected_text: "mountain" },
      { id: "s17", image_url: "assets/images/scissors.svg", expected_text: "scissors" },
      { id: "s18", image_url: "assets/images/castle.svg", expected_text: "castle" },
      { id: "s19", image_url: "assets/images/compass.svg", expected_text: "compass" },
      { id: "s20", image_url: "assets/images/thermometer.svg", expected_text: "thermometer" }
    ]
  },

  hard: {
    vocabulary: [
      { id: "v21", sentence: "The scientist's groundbreaking theory was initially met with ___ by her peers.", options: ["skepticism", "enthusiasm", "obedience"], correct: "skepticism" },
      { id: "v22", sentence: "His ___ remarks during the meeting offended several board members.", options: ["diplomatic", "tactless", "complimentary"], correct: "tactless" },
      { id: "v23", sentence: "The ancient manuscript was so ___ that researchers had to wear gloves to touch it.", options: ["resilient", "fragile", "opaque"], correct: "fragile" },
      { id: "v24", sentence: "After hours of negotiation, both parties finally reached a ___.", options: ["compromise", "catastrophe", "contradiction"], correct: "compromise" },
      { id: "v25", sentence: "She has an ___ memory and can recall details from years ago effortlessly.", options: ["impeccable", "erratic", "obsolete"], correct: "impeccable" },
      { id: "v26", sentence: "The CEO's speech was meant to ___ the employees during the company restructuring.", options: ["alienate", "reassure", "intimidate"], correct: "reassure" },
      { id: "v27", sentence: "Due to the ___ nature of the evidence, the jury could not reach a verdict.", options: ["ambiguous", "undeniable", "straightforward"], correct: "ambiguous" },
      { id: "v28", sentence: "His generosity is well known; he is a major ___ to several local charities.", options: ["benefactor", "spectator", "rival"], correct: "benefactor" },
      { id: "v29", sentence: "The new policy will ___ the way small businesses file their taxes.", options: ["streamline", "complicate", "abolish"], correct: "streamline" },
      { id: "v30", sentence: "Chronic lack of sleep can have a ___ effect on cognitive performance.", options: ["beneficial", "detrimental", "negligible"], correct: "detrimental" }
    ],
    trivia: [
      { id: "t21", question: "What is the smallest bone in the human body?", options: ["Stapes", "Femur", "Ulna", "Clavicle"], correct: "Stapes" },
      { id: "t22", question: "Which element has the atomic number 1?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correct: "Hydrogen" },
      { id: "t23", question: "In what year was the first iPhone released?", options: ["2005", "2007", "2009", "2010"], correct: "2007" },
      { id: "t24", question: "Who was the first woman to win a Nobel Prize?", options: ["Rosalind Franklin", "Marie Curie", "Ada Lovelace", "Mother Teresa"], correct: "Marie Curie" },
      { id: "t25", question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: "Canberra" },
      { id: "t26", question: "Which blood type is known as the universal donor?", options: ["AB+", "A-", "B+", "O-"], correct: "O-" },
      { id: "t27", question: "How many time zones does Russia span across?", options: ["7", "9", "11", "13"], correct: "11" },
      { id: "t28", question: "What is the name of the deepest known point in Earth's oceans?", options: ["Java Trench", "Puerto Rico Trench", "Mariana Trench", "Tonga Trench"], correct: "Mariana Trench" },
      { id: "t29", question: "Which scientist proposed the three laws of motion?", options: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Nikola Tesla"], correct: "Isaac Newton" },
      { id: "t30", question: "In Greek mythology, who was the god of the underworld?", options: ["Zeus", "Poseidon", "Ares", "Hades"], correct: "Hades" }
    ],
    tongue_twister: [
      { id: "tt21", text: "The sixth sick sheik's sixth sheep's sick." },
      { id: "tt22", text: "Pad kid poured curd pulled cod." },
      { id: "tt23", text: "Rory the warrior and Roger the worrier were reared wrongly in a rural brewery." },
      { id: "tt24", text: "Brisk brave brigadiers brandished broad bright blades, blunderbusses, and bludgeons." },
      { id: "tt25", text: "Imagine an imaginary menagerie manager managing an imaginary menagerie." },
      { id: "tt26", text: "Amidst the mists and coldest frosts, with stoutest wrists and loudest boasts, he thrusts his fists against the posts and still insists he sees the ghosts." },
      { id: "tt27", text: "To sit in solemn silence in a dull, dark dock, in a pestilential prison, with a life-long lock." },
      { id: "tt28", text: "Three free throws for three free-throw shooters." },
      { id: "tt29", text: "Rory's lawn rake rarely rakes really right." },
      { id: "tt30", text: "If a dog chews shoes, whose shoes does he choose?" }
    ],
    spelling: [
      { id: "s21", image_url: "assets/images/chameleon.svg", expected_text: "chameleon" },
      { id: "s22", image_url: "assets/images/chandelier.svg", expected_text: "chandelier" },
      { id: "s23", image_url: "assets/images/stethoscope.svg", expected_text: "stethoscope" },
      { id: "s24", image_url: "assets/images/xylophone.svg", expected_text: "xylophone" },
      { id: "s25", image_url: "assets/images/wheelbarrow.svg", expected_text: "wheelbarrow" },
      { id: "s26", image_url: "assets/images/silhouette.svg", expected_text: "silhouette" },
      { id: "s27", image_url: "assets/images/hippopotamus.svg", expected_text: "hippopotamus" },
      { id: "s28", image_url: "assets/images/pharaoh.svg", expected_text: "pharaoh" },
      { id: "s29", image_url: "assets/images/guillotine.svg", expected_text: "guillotine" },
      { id: "s30", image_url: "assets/images/accordion.svg", expected_text: "accordion" }
    ]
  }
};
