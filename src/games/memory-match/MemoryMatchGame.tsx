import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PHRASES } from '../../data/phrases';
import type { GameProps } from '../../data/types';
import DinoImage from '../shared/DinoImage';
import { playCorrect, playPop } from '../shared/sound';
import { buildDeck, starsForMoves } from './deck';
import '../shared/game.css';
import './MemoryMatchGame.css';

const MISMATCH_FLIP_BACK_MS = 1300;
const FINISH_DELAY_MS = 2000;

export default function MemoryMatchGame({ dinos, speak, onFinish, onExit }: GameProps) {
  const [deck] = useState(() => buildDeck(dinos));
  /** Indexes of face-up cards that are not matched yet (0, 1 or 2). */
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const timers = useRef<number[]>([]);

  const pairs = deck.length / 2;

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Intro once on mount; ref so a new speak identity from the shell doesn't repeat it.
  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current(PHRASES.memoryIntro);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  if (pairs < 2) {
    return (
      <div className="game">
        <div className="game-top">
          <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        </div>
        <div className="game-empty">🥚</div>
      </div>
    );
  }

  const flip = (i: number) => {
    const card = deck[i];
    // Already showing: just say the name again.
    if (open.includes(i) || matched.includes(card.dino.id)) {
      speak(card.dino.name);
      return;
    }
    // Two cards are up and about to flip back.
    if (open.length === 2) return;

    playPop();
    if (open.length === 0) {
      speak(card.dino.name);
      setOpen([i]);
      return;
    }

    const first = deck[open[0]];
    const nextMoves = moves + 1;
    setMoves(nextMoves);

    if (first.dino.id !== card.dino.id) {
      speak(card.dino.name);
      setOpen([open[0], i]);
      later(() => setOpen([]), MISMATCH_FLIP_BACK_MS);
      return;
    }

    const nextMatched = [...matched, card.dino.id];
    setMatched(nextMatched);
    setOpen([]);
    later(playCorrect, 200);
    if (nextMatched.length === pairs) {
      speak(`${PHRASES.memoryMatch(card.dino.name)} ${PHRASES.allFound}`);
      later(() => onFinish({ stars: starsForMoves(nextMoves, pairs), correct: pairs, total: pairs }), FINISH_DELAY_MS);
    } else {
      speak(PHRASES.memoryMatch(card.dino.name));
    }
  };

  return (
    <div className="game">
      <div className="game-top">
        <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        <div className="game-progress" aria-hidden="true">
          {Array.from({ length: pairs }, (_, i) => (
            <span key={i} className={i < matched.length ? 'done' : ''}>
              {i < matched.length ? '⭐' : '🥚'}
            </span>
          ))}
        </div>
      </div>

      <div className="mm-grid">
        {deck.map((card, i) => {
          const isMatched = matched.includes(card.dino.id);
          const isUp = isMatched || open.includes(i);
          const classes = ['mm-card'];
          if (isUp) classes.push('up');
          if (isMatched) classes.push('matched');
          return (
            <button
              type="button"
              key={card.key}
              className={classes.join(' ')}
              aria-label={isUp ? card.dino.name : 'Face-down card'}
              style={{ '--dino-color': card.dino.color } as CSSProperties}
              onClick={() => flip(i)}
            >
              <span className="mm-inner">
                <span className="mm-face mm-back" aria-hidden="true">🥚</span>
                <span className="mm-face mm-front">
                  <DinoImage id={card.dino.id} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
