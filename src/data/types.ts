// Shared data contract for the whole team. Change only via a PR reviewed by QA.

export type Diet = 'herbivore' | 'carnivore' | 'omnivore';
export type Period = 'Triassic' | 'Jurassic' | 'Cretaceous';

export interface Dino {
  /** kebab-case id, also the SVG file name: /dinos/<id>.svg */
  id: string;
  /** Display name, e.g. "Triceratops" */
  name: string;
  /** Kid-friendly pronunciation, e.g. "try-SAIR-uh-tops" */
  pronunciation: string;
  /** Syllables for tap-to-hear, e.g. ["Tri", "cer", "a", "tops"] */
  syllables: string[];
  /** What the name means, e.g. "three-horned face" */
  meaning: string;
  diet: Diet;
  period: Period;
  /** Approximate adult size in meters (body length, or wingspan when sizeKind is 'wingspan') */
  lengthMeters: number;
  /** What lengthMeters measures. Defaults to 'length'. Flyers like Pteranodon use 'wingspan'. */
  sizeKind?: 'length' | 'wingspan';
  /** One short fun fact, max ~90 characters, reading level ~age 5 */
  funFact: string;
  /** Primary theme color for this dino's card (hex) */
  color: string;
  /** Difficulty tier for games: 1 = well known (T. rex), 3 = tricky */
  tier: 1 | 2 | 3;
}

/** Props every mini game receives from the app shell. */
export interface GameProps {
  dinos: Dino[];
  /** Speak text aloud (wraps Web Speech API, no-op if unsupported). */
  speak: (text: string) => void;
  /** Call when the round ends; stars 1..3 drives the reward screen. */
  onFinish: (result: {
    stars: 1 | 2 | 3;
    correct: number;
    total: number;
    /** Optional game-specific praise the reward screen shows and speaks instead of the default star message. */
    message?: string;
  }) => void;
  onExit: () => void;
}
