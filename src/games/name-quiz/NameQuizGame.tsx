import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Dino, GameProps } from '../../data/types';
import DinoImage from '../shared/DinoImage';
import { playCorrect, playWrong } from '../shared/sound';
import { starsFor } from '../shared/util';
import { buildRounds, type Round } from './rounds';
import '../shared/game.css';
import './NameQuizGame.css';

const NEXT_ROUND_DELAY_MS = 1800;
// Kids often miss the first utterance: repeat the question after this long without a tap.
const IDLE_REPROMPT_MS = 6000;
const MAX_REPROMPTS = 2;

const question = (d: Dino) => `Which one is the ${d.name}?`;

export default function NameQuizGame({ dinos, speak, onFinish, onExit }: GameProps) {
  const [rounds] = useState(() => buildRounds(dinos));
  const [index, setIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  // Bumped on every wrong tap so the shake animation replays.
  const [shake, setShake] = useState<{ id: string; n: number } | null>(null);
  // Bumped on every tap; restarts the idle re-prompt timer.
  const [taps, setTaps] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  // The shell may pass a new speak function each render; only speak when the round changes.
  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current = speak;
  });

  const round = rounds[index] as Round | undefined;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (round) speakRef.current(question(round.target));
  }, [round]);

  useEffect(() => {
    if (!round || solved) return;
    let repeats = 0;
    const id = window.setInterval(() => {
      speakRef.current(question(round.target));
      if (++repeats >= MAX_REPROMPTS) window.clearInterval(id);
    }, IDLE_REPROMPT_MS);
    return () => window.clearInterval(id);
  }, [round, solved, taps]);

  if (!round) {
    return (
      <div className="game">
        <div className="game-top">
          <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        </div>
        <div className="game-empty">🥚</div>
      </div>
    );
  }

  const replay = () => {
    setTaps((n) => n + 1);
    speak(question(round.target));
  };

  const pick = (d: Dino) => {
    if (solved) return;
    setTaps((n) => n + 1);
    if (d.id !== round.target.id) {
      playWrong();
      speak(`That's the ${d.name}. Find the ${round.target.name}!`);
      setShake((s) => ({ id: d.id, n: (s?.n ?? 0) + 1 }));
      if (!wrongIds.includes(d.id)) setWrongIds([...wrongIds, d.id]);
      return;
    }

    playCorrect();
    speak(`Yes! That's the ${d.name}!`);
    setSolved(true);
    const score = firstTry + (wrongIds.length === 0 ? 1 : 0);
    setFirstTry(score);

    timer.current = window.setTimeout(() => {
      if (index + 1 >= rounds.length) {
        onFinish({ stars: starsFor(score / rounds.length), correct: score, total: rounds.length });
      } else {
        setIndex(index + 1);
        setWrongIds([]);
        setSolved(false);
        setShake(null);
      }
    }, NEXT_ROUND_DELAY_MS);
  };

  return (
    <div className="game">
      <div className="game-top">
        <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        <div className="game-progress" aria-hidden="true">
          {rounds.map((r, i) => (
            <span key={r.target.id} className={i < index || (i === index && solved) ? 'done' : i === index ? 'current' : ''}>
              {i < index || (i === index && solved) ? '⭐' : '🥚'}
            </span>
          ))}
        </div>
      </div>

      <button type="button" className="game-btn nq-prompt" onClick={replay}>
        <span className="nq-prompt-icon" aria-hidden="true">🔊</span>
        <span>{round.target.name}?</span>
      </button>

      <div className="nq-options" key={index}>
        {round.options.map((d) => {
          const isWrong = wrongIds.includes(d.id);
          const isRight = solved && d.id === round.target.id;
          const classes = ['game-btn', 'nq-option'];
          if (isWrong) classes.push('wrong');
          if (isRight) classes.push('right', 'game-pop');
          if (shake?.id === d.id) classes.push('game-wobble');
          return (
            <button
              type="button"
              key={shake?.id === d.id ? `${d.id}-${shake.n}` : d.id}
              className={classes.join(' ')}
              aria-label={d.name}
              style={{ '--dino-color': d.color } as CSSProperties}
              onClick={() => pick(d)}
            >
              <DinoImage id={d.id} />
              {/* Names show only once heard, so the kid has to recognise the dino, not match text. */}
              {(isWrong || isRight) && <span className="nq-option-name">{d.name}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
