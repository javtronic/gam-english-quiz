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
      { id: "v1", sentence: "She ___ to the store yesterday.", options: ["go", "goes", "went"], correct: "went" },
      { id: "v2", sentence: "I have two ___ at home.", options: ["cat", "cats", "a cat"], correct: "cats" },
      { id: "v3", sentence: "The sun ___ in the east.", options: ["rise", "rises", "rising"], correct: "rises" }
    ],
    trivia: [
      { id: "t1", question: "What is the capital of the United States?", options: ["New York", "Washington D.C.", "Los Angeles", "Chicago"], correct: "Washington D.C." },
      { id: "t2", question: "How many days are there in a week?", options: ["Five", "Six", "Seven", "Eight"], correct: "Seven" },
      { id: "t3", question: "What color is the sky on a clear day?", options: ["Green", "Blue", "Red", "Brown"], correct: "Blue" }
    ],
    tongue_twister: [
      { id: "tt1", text: "Red lorry, yellow lorry." },
      { id: "tt2", text: "She sells seashells by the seashore." },
      { id: "tt3", text: "Fresh fried fish, fish fresh fried." }
    ],
    spelling: [
      { id: "s1", image_url: "assets/images/cat.svg", expected_text: "a black cat sitting on the mat" },
      { id: "s2", image_url: "assets/images/apple.svg", expected_text: "a red apple" }
    ]
  },

  medium: {
    vocabulary: [
      { id: "v4", sentence: "If it rains tomorrow, we ___ stay at home.", options: ["will", "would", "were"], correct: "will" },
      { id: "v5", sentence: "He has lived here ___ 2015.", options: ["for", "since", "during"], correct: "since" },
      { id: "v6", sentence: "I'm looking forward ___ you soon.", options: ["to see", "to seeing", "seeing"], correct: "to seeing" }
    ],
    trivia: [
      { id: "t4", question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars" },
      { id: "t5", question: "Which is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correct: "Pacific Ocean" },
      { id: "t6", question: "Who wrote \"Romeo and Juliet\"?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: "William Shakespeare" }
    ],
    tongue_twister: [
      { id: "tt4", text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?" },
      { id: "tt5", text: "Peter Piper picked a peck of pickled peppers." },
      { id: "tt6", text: "I scream, you scream, we all scream for ice cream." }
    ],
    spelling: [
      { id: "s3", image_url: "assets/images/house.svg", expected_text: "a small house with a red door" },
      { id: "s4", image_url: "assets/images/tree.svg", expected_text: "a tall green tree under the sun" }
    ]
  },

  hard: {
    vocabulary: [
      { id: "v7", sentence: "Had I known about the traffic, I ___ earlier.", options: ["would leave", "would have left", "had left"], correct: "would have left" },
      { id: "v8", sentence: "The new policy was met with widespread ___.", options: ["skepticism", "skeptical", "skeptically"], correct: "skepticism" },
      { id: "v9", sentence: "Hardly ___ the room when the phone rang.", options: ["I had entered", "had I entered", "I entered"], correct: "had I entered" }
    ],
    trivia: [
      { id: "t7", question: "What is the chemical symbol for gold?", options: ["Ag", "Au", "Gd", "Go"], correct: "Au" },
      { id: "t8", question: "In which year did people first walk on the Moon?", options: ["1965", "1969", "1972", "1975"], correct: "1969" },
      { id: "t9", question: "What is the longest river in Africa?", options: ["Congo", "Niger", "Nile", "Zambezi"], correct: "Nile" }
    ],
    tongue_twister: [
      { id: "tt7", text: "The sixth sick sheikh's sixth sheep's sick." },
      { id: "tt8", text: "Pad kid poured curd pulled cod." },
      { id: "tt9", text: "Irish wristwatch, Swiss wristwatch." }
    ],
    spelling: [
      { id: "s5", image_url: "assets/images/car_house.svg", expected_text: "a yellow car in front of a white house" },
      { id: "s6", image_url: "assets/images/beach.svg", expected_text: "two palm trees on a sunny beach by the sea" }
    ]
  }
};
