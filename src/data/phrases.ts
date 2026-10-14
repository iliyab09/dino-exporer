// Spoken UI copy. Owner: Rex. Screens and games read lines from here so the app
// always talks to kids the same way. Rules: short, cheerful, words a 4 year old
// knows, never scold. Everything here is meant to be passed to speak().
import type { Diet, Period } from './types';

export const PHRASES = {
  // App shell
  homeIntro: 'Dino Explorer! Tap the book to learn. Tap the game to play.',
  learnHint: 'Tap a dinosaur to hear its name!',
  playHint: 'Pick a game to play!',
  gamesHatching: 'The games are still hatching. Come back soon!',
  learn: 'Learn',
  play: 'Play',
  oops: "Oops! Let's go back.",

  // Dino details
  meaning: (name: string, meaning: string) => `${name} means ${meaning}.`,
  diet: {
    herbivore: 'It ate plants. Crunch, crunch!',
    carnivore: 'It ate meat. Chomp, chomp!',
    omnivore: 'It ate plants and meat. Yum!',
  } satisfies Record<Diet, string>,
  period: {
    Triassic: 'It lived in the Triassic, when dinosaurs were brand new!',
    Jurassic: 'It lived in the Jurassic, the time of giant long necks!',
    Cretaceous: 'It lived in the Cretaceous, the last time of the dinosaurs!',
  } satisfies Record<Period, string>,

  // Name Quiz
  quizQuestion: (name: string) => `Which one is the ${name}?`,
  quizCorrect: (name: string) => `Yay! That's the ${name}!`,
  quizWrong: (picked: string, target: string) => `That's the ${picked}. Find the ${target}!`,

  // Memory Match
  memoryIntro: 'Find two dinos that match!',
  memoryMatch: (name: string) => `You found two ${name}!`,
  memoryNoMatch: 'Not a match. Try again!',

  // Egg Hatch ("baby" also avoids "a Iguanodon")
  eggIntro: 'Tap the egg to help it hatch!',
  eggKeepGoing: 'Keep tapping! Crack, crack!',
  eggHatched: (name: string) => `It's a baby ${name}!`,
  hatchAnother: 'Hatch another egg!',

  // Any game
  tryAgain: 'Try again!',
  allFound: 'You found them all!',
  praise: ['Awesome!', 'Great job!', 'You did it!', 'Roar-some!', 'Super!'],

  // Rewards
  stars: {
    1: 'Good try! You got one star!',
    2: 'Great job! You got two stars!',
    3: 'Wow! Three stars! You are a dino expert!',
  } satisfies Record<1 | 2 | 3, string>,
  starCount: (n: number) =>
    n === 0 ? "No stars yet. Let's play a game!" : n === 1 ? 'You have one star!' : `You have ${n} stars!`,
  playAgain: 'Play again',
  done: 'Done',
  newSticker: (name: string) => `New sticker! You got the ${name}!`,
  stickerBookIntro: 'Here are all your dino stickers!',
  stickerLocked: 'Play a game to win this sticker!',
} as const;

/** A random short cheer, e.g. after a correct answer. */
export function pickPraise(random: () => number = Math.random): string {
  const list = PHRASES.praise;
  return list[Math.floor(random() * list.length) % list.length];
}
