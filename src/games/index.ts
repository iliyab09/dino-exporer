// Game registry. The app shell renders the Play menu from this list.
import type { ComponentType } from 'react';
import type { GameProps } from '../data/types';
import MemoryMatchGame from './memory-match/MemoryMatchGame';
import NameQuizGame from './name-quiz/NameQuizGame';

export interface GameEntry {
  id: string;
  /** Spoken on the Play menu tile. */
  title: string;
  emoji: string;
  component: ComponentType<GameProps>;
  /** Hide the game if fewer dinos than this are available. */
  minDinos: number;
}

export const GAMES: GameEntry[] = [
  { id: 'name-quiz', title: 'Name Quiz', emoji: '❓', component: NameQuizGame, minDinos: 3 },
  { id: 'memory-match', title: 'Memory Match', emoji: '🃏', component: MemoryMatchGame, minDinos: 3 },
];
