/*
 * Survey questions for Family Feud: Gender Reveal Edition.
 *
 * Each question has an array of answers. Points are survey-style and
 * roughly sum to 100 per question. Answers are listed top (most popular)
 * to bottom. The board sorts by points automatically.
 *
 * Want to customize? Edit this file — add, remove, or reword anything.
 * Keep 5-8 answers per question so they fit the board nicely.
 */
const QUESTIONS = [
  {
    prompt: "Name something people crave during pregnancy.",
    answers: [
      { text: "Ice Cream", points: 30 },
      { text: "Pickles", points: 24 },
      { text: "Chocolate", points: 18 },
      { text: "Chips / Salty Snacks", points: 12 },
      { text: "Fruit", points: 9 },
      { text: "Sour Candy", points: 7 },
    ],
  },
  {
    prompt: "Name a popular baby BOY name.",
    answers: [
      { text: "Liam", points: 27 },
      { text: "Noah", points: 23 },
      { text: "James", points: 18 },
      { text: "Oliver", points: 14 },
      { text: "Elijah", points: 10 },
      { text: "Mason", points: 8 },
    ],
  },
  {
    prompt: "Name a popular baby GIRL name.",
    answers: [
      { text: "Olivia", points: 28 },
      { text: "Emma", points: 22 },
      { text: "Ava", points: 17 },
      { text: "Sophia", points: 14 },
      { text: "Isabella", points: 11 },
      { text: "Mia", points: 8 },
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
