// Copy for the "For grown-ups" screen. Owner: Rex. Written for parents and
// teachers, so unlike PHRASES it is read, not spoken. Sam renders it.
import { DINOS } from './dinos';

export interface AboutSection {
  /** Short heading, e.g. "Play together" */
  title: string;
  /** One short sentence per line; render as a list or paragraphs. */
  lines: string[];
}

const dinosaurCount = DINOS.filter((d) => d.id !== 'pteranodon').length;

export const ABOUT: { title: string; intro: string; sections: AboutSection[] } = {
  title: 'For grown-ups',
  intro:
    `Dino Explorer helps children aged 4 to 8 learn the names of ${DINOS.length} prehistoric animals: ` +
    `${dinosaurCount} dinosaurs and Pteranodon, a flying reptile. No reading is needed: every name and fact is spoken aloud.`,
  sections: [
    {
      title: 'What your child learns',
      lines: [
        'To say long dinosaur names, one syllable at a time.',
        'What each dinosaur ate, when it lived, and how big it was compared with things they know.',
        'Listening and memory skills through short, simple games.',
      ],
    },
    {
      title: 'Play together',
      lines: [
        'Tap a dinosaur, listen, then say its name out loud together.',
        'Tap the syllable buttons one by one, then try the whole name in one go.',
        'Ask questions: "Did it eat plants or meat?" "Was it bigger than our car?"',
        'Keep it short: a few minutes and one game is plenty.',
        'Turn the sound up. The app talks, so it works best with sound on.',
      ],
    },
    {
      title: 'Privacy',
      lines: [
        'No accounts, no ads, no tracking. Stars and progress are saved only on this device.',
        'Names are spoken by your device\'s text-to-speech; some browsers use online voices for this.',
      ],
    },
    {
      title: 'Where the facts come from',
      lines: [
        'Every fact was checked against museum and science sources:',
        'Natural History Museum, London (Dino Directory)',
        'Smithsonian National Museum of Natural History',
        'American Museum of Natural History',
        'Carnegie Museum of Natural History',
        'Published research papers and Wikipedia articles for each animal',
        'Sizes are typical adult estimates; scientists still debate some of them.',
      ],
    },
    {
      title: 'Credits',
      lines: [
        'Dinosaur pictures: drawn by hand for this app.',
        'Sounds: made inside the app, no recordings.',
        'Voices: your device\'s built-in text-to-speech.',
        'Made with React and Vite by the Dino Explorer team.',
      ],
    },
  ],
};
