import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PHRASES } from '../../data/phrases';
import type { Dino, GameProps } from '../../data/types';
import DinoImage from '../shared/DinoImage';
import { playChomp, playCrunch, playWrong } from '../shared/sound';
import { starsFor } from '../shared/util';
import { buildSortRounds, type Snack } from './rounds';
import '../shared/game.css';
import './DinoSoundsGame.css';

// TODO: move to PHRASES once Rex adds the snack keys.
const LINES = {
  intro: 'Help the dinos find their snacks!',
  question: (name: string) => `${name}! Did it eat plants or meat?`,
  wrong: 'Hmm, not that one. Try the other snack!',
};

const BINS: { diet: Snack; emoji: string; label: string }[] = [
  { diet: 'herbivore', emoji: '🌿', label: 'Plants' },
  { diet: 'carnivore', emoji: '🍖', label: 'Meat' },
];

const NEXT_ROUND_DELAY_MS = 2200;
const IDLE_REPROMPT_MS = 6000;

export default function DinoSoundsGame({ dinos, speak, onFinish, onExit }: GameProps) {
  const [rounds] = useState(() => buildSortRounds(dinos));
  const [index, setIndex] = useState(0);
  /** Bin the dino is flying into once answered correctly. */
  const [fed, setFed] = useState<Snack | null>(null);
  const [missed, setMissed] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  // Bumped on every wrong tap so the wobble replays; also restarts the idle timer.
  const [wrong, setWrong] = useState<{ diet: Snack; n: number } | null>(null);
  const [taps, setTaps] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current = speak;
  });

  const dino = rounds[index] as Dino | undefined;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!dino) return;
    speakRef.current(index === 0 ? `${LINES.intro} ${LINES.question(dino.name)}` : LINES.question(dino.name));
  }, [dino, index]);

  useEffect(() => {
    if (!dino || fed) return;
    const id = window.setTimeout(() => speakRef.current(LINES.question(dino.name)), IDLE_REPROMPT_MS);
    return () => window.clearTimeout(id);
  }, [dino, fed, taps]);

  if (!dino || rounds.length < 2) {
    return (
      <div className="game">
        <div className="game-top">
          <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        </div>
        <div className="game-empty">🥚</div>
      </div>
    );
  }

  const pick = (diet: Snack) => {
    if (fed) return;
    setTaps((n) => n + 1);
    if (diet !== dino.diet) {
      playWrong();
      speak(LINES.wrong);
      setMissed(true);
      setWrong((w) => ({ diet, n: (w?.n ?? 0) + 1 }));
      return;
    }

    if (diet === 'herbivore') playCrunch();
    else playChomp();
    speak(PHRASES.diet[diet]);
    setFed(diet);
    const score = firstTry + (missed ? 0 : 1);
    setFirstTry(score);

    timer.current = window.setTimeout(() => {
      if (index + 1 >= rounds.length) {
        onFinish({ stars: starsFor(score / rounds.length), correct: score, total: rounds.length });
      } else {
        setIndex(index + 1);
        setFed(null);
        setMissed(false);
        setWrong(null);
      }
    }, NEXT_ROUND_DELAY_MS);
  };

  const replay = () => {
    setTaps((n) => n + 1);
    speak(LINES.question(dino.name));
  };

  return (
    <div className="game">
      <div className="game-top">
        <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        <div className="game-progress" aria-hidden="true">
          {rounds.map((r, i) => {
            const done = i < index || (i === index && fed);
            return (
              <span key={r.id} className={done ? 'done' : i === index ? 'current' : ''}>
                {done ? '⭐' : '🥚'}
              </span>
            );
          })}
        </div>
      </div>

      <div className="ds-stage">
        <button
          type="button"
          // Remount per round so the next dino gets its entrance.
          key={dino.id}
          className={`ds-dino${fed ? ` to-${fed}` : ''}`}
          aria-label={`${dino.name}. Tap to hear the question again.`}
          style={{ '--dino-color': dino.color } as CSSProperties}
          onClick={replay}
          disabled={!!fed}
        >
          <DinoImage id={dino.id} />
        </button>
      </div>

      <div className="ds-bins">
        {BINS.map((bin) => {
          const classes = ['game-btn', 'ds-bin', `ds-bin-${bin.diet}`];
          if (fed === bin.diet) classes.push('gulp');
          if (wrong?.diet === bin.diet) classes.push('game-wobble');
          return (
            <button
              type="button"
              key={wrong?.diet === bin.diet ? `${bin.diet}-${wrong.n}` : bin.diet}
              className={classes.join(' ')}
              aria-label={bin.label}
              onClick={() => pick(bin.diet)}
            >
              <span className="ds-bin-emoji" aria-hidden="true">{bin.emoji}</span>
              <span>{bin.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
