/*
 * Survey questions for Family Feud: Gender Reveal Edition.
 *
 * Each question has an array of answers. Points are survey-style and
 * roughly sum to 100 per question. Answers are listed top (most popular)
 * to bottom. The board sorts by points automatically.
 *
 * Want to customize? Edit this file — add, remove, or reword anything.
 * Keep 5-8 answers per question so they fit the board nicely.
 *
 * IMPORTANT: after editing, regenerate HOST-KEY.md so the host's cue
 * card matches the board (see the note at the bottom of HOST-KEY.md).
 */
const QUESTIONS = [
  {
    prompt: "What foods has Casey craved during her pregnancy so far?",
    answers: [
      { text: "Pickles with Tajín", points: 28 },
      { text: "Melons", points: 22 },
      { text: "Enchiladas & Tacos", points: 18 },
      { text: "Hot Buffalo Wings", points: 14 },
      { text: "Tuna Salad + Vinegar", points: 10 },
      { text: "Pizza with Mustard", points: 8 },
    ],
  },
  {
    prompt: "Name something a baby spends a lot of time doing.",
    answers: [
      { text: "Sleeping", points: 34 },
      { text: "Crying", points: 24 },
      { text: "Eating", points: 18 },
      { text: "Pooping", points: 12 },
      { text: "Drooling", points: 7 },
      { text: "Staring at Things", points: 5 },
    ],
  },
  {
    prompt: "Name a popular brand of diapers.",
    answers: [
      { text: "Pampers", points: 38 },
      { text: "Huggies", points: 30 },
      { text: "Luvs", points: 12 },
      { text: "Honest", points: 9 },
      { text: "Kirkland", points: 6 },
      { text: "Hello Bello", points: 5 },
    ],
  },
  {
    prompt: "What's the best-tasting baby food flavor?",
    answers: [
      { text: "Banana", points: 30 },
      { text: "Applesauce", points: 24 },
      { text: "Sweet Potato", points: 18 },
      { text: "Peach", points: 12 },
      { text: "Pear", points: 9 },
      { text: "Carrot", points: 7 },
    ],
  },
  {
    prompt: "What about their pre-baby lives do parents miss most?",
    answers: [
      { text: "Sleep", points: 36 },
      { text: "Free Time", points: 22 },
      { text: "Date Nights", points: 16 },
      { text: "Traveling", points: 12 },
      { text: "Peace & Quiet", points: 8 },
      { text: "Spontaneity", points: 6 },
    ],
  },
  {
    prompt: "Name a classic lullaby.",
    answers: [
      { text: "Twinkle Twinkle Little Star", points: 32 },
      { text: "Rock-a-Bye Baby", points: 26 },
      { text: "Hush Little Baby", points: 18 },
      { text: "You Are My Sunshine", points: 12 },
      { text: "Brahms' Lullaby", points: 7 },
      { text: "Itsy Bitsy Spider", points: 5 },
    ],
  },
  {
    prompt: "What's the most common nickname for a grandmother?",
    answers: [
      { text: "Grandma", points: 30 },
      { text: "Nana", points: 24 },
      { text: "Granny", points: 16 },
      { text: "Mimi", points: 12 },
      { text: "Gigi", points: 10 },
      { text: "Abuela", points: 8 },
    ],
  },
  {
    prompt: "What do new moms wish new dads would help with more?",
    answers: [
      { text: "Diaper Changes", points: 30 },
      { text: "Night Feedings", points: 26 },
      { text: "Housework", points: 16 },
      { text: "Getting Baby to Sleep", points: 12 },
      { text: "Laundry", points: 9 },
      { text: "Bath Time", points: 7 },
    ],
  },
  {
    prompt: "Name something a parent does to get their baby to sleep.",
    answers: [
      { text: "Rocking", points: 30 },
      { text: "Singing a Lullaby", points: 24 },
      { text: "Feeding a Bottle", points: 16 },
      { text: "Driving Around", points: 12 },
      { text: "White Noise", points: 10 },
      { text: "Pacifier", points: 8 },
    ],
  },
  {
    prompt: "Name something you buy for a new baby.",
    answers: [
      { text: "Diapers", points: 32 },
      { text: "Crib", points: 21 },
      { text: "Stroller", points: 16 },
      { text: "Clothes", points: 13 },
      { text: "Car Seat", points: 10 },
      { text: "Bottles", points: 8 },
    ],
  },
  {
    prompt: "Name an old wives' tale for guessing a baby's gender.",
    answers: [
      { text: "Carrying High or Low", points: 29 },
      { text: "Baby's Heart Rate", points: 22 },
      { text: "Sweet vs. Salty Cravings", points: 18 },
      { text: "Ring on a String", points: 14 },
      { text: "Morning Sickness", points: 10 },
      { text: "Mom's Glow", points: 7 },
    ],
  },
  {
    prompt: "Name something that keeps new parents up at night.",
    answers: [
      { text: "Crying", points: 34 },
      { text: "Feedings", points: 24 },
      { text: "Diaper Changes", points: 16 },
      { text: "Worrying", points: 14 },
      { text: "Baby Monitor", points: 7 },
      { text: "Teething", points: 5 },
    ],
  },
  {
    prompt: "Name a word people blurt out when they see a cute baby.",
    answers: [
      { text: "Awww", points: 33 },
      { text: "Cute", points: 26 },
      { text: "Adorable", points: 17 },
      { text: "Precious", points: 12 },
      { text: "So Tiny!", points: 8 },
      { text: "Sweet", points: 4 },
    ],
  },
  {
    prompt: "Name something that is BLUE.",
    answers: [
      { text: "The Sky", points: 30 },
      { text: "The Ocean", points: 24 },
      { text: "Jeans", points: 16 },
      { text: "Blueberry", points: 13 },
      { text: "A Sapphire", points: 10 },
      { text: "Blue Jay", points: 7 },
    ],
  },
  {
    prompt: "Name something that is PINK.",
    answers: [
      { text: "Flamingo", points: 26 },
      { text: "Cotton Candy", points: 22 },
      { text: "Bubblegum", points: 18 },
      { text: "A Pig", points: 15 },
      { text: "A Rose", points: 12 },
      { text: "Cupcake Frosting", points: 7 },
    ],
  },
  {
    prompt: "Name a reason a toddler throws a tantrum.",
    answers: [
      { text: "Tired / Needs a Nap", points: 31 },
      { text: "Hungry", points: 23 },
      { text: "Told 'No'", points: 18 },
      { text: "Wants a Toy", points: 14 },
      { text: "Wrong Color Cup", points: 8 },
      { text: "Nothing at All", points: 6 },
    ],
  },
  {
    prompt: "Name something grandparents love to do with a new grandbaby.",
    answers: [
      { text: "Spoil Them", points: 28 },
      { text: "Babysit", points: 22 },
      { text: "Take Photos", points: 18 },
      { text: "Buy Gifts", points: 15 },
      { text: "Brag About Them", points: 11 },
      { text: "Cuddle", points: 6 },
    ],
  },
  {
    prompt: "Besides 'Mama' or 'Dada', name a baby's first word.",
    answers: [
      { text: "Hi / Bye", points: 26 },
      { text: "No", points: 22 },
      { text: "Dog / Doggy", points: 18 },
      { text: "Ball", points: 15 },
      { text: "Uh-oh", points: 12 },
      { text: "Baba (Bottle)", points: 7 },
    ],
  },
];
