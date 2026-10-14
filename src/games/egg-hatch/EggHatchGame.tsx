import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PHRASES } from '../../data/phrases';
import type { Dino, GameProps } from '../../data/types';
import DinoImage from '../shared/DinoImage';
import { playCorrect, playCrack } from '../shared/sound';
import { TAPS_TO_HATCH, loadHatched, pickNextDino, saveHatched } from './hatchery';
import '../shared/game.css';
import './EggHatchGame.css';

// Hatch-count line for the reward screen (Rex: candidate for PHRASES).
const hatchResult = (n: number) => (n === 1 ? 'You hatched a baby dinosaur!' : `You hatched ${n} baby dinosaurs!`);

const IDLE_REPROMPT_MS = 6000;
const WOBBLE_DEG_PER_TAP = 6;

/** Cracks drawn after each tap (index = taps so far). */
const CRACKS = ['', 'M70 120 L85 108 L95 124 L108 110', 'M48 128 L70 120 L85 108 L95 124 L108 110 L122 126 L138 112 L152 124'];

function Egg({ taps }: { taps: number }) {
  return (
    <svg className="eh-egg-svg" viewBox="0 0 200 240" aria-hidden="true">
      <path
        className="eh-shell"
        d="M100 10 C160 10 190 120 190 160 C190 210 150 234 100 234 C50 234 10 210 10 160 C10 120 40 10 100 10 Z"
      />
      <circle className="eh-spot" cx="70" cy="70" r="12" />
      <circle className="eh-spot" cx="135" cy="95" r="16" />
      <circle className="eh-spot" cx="60" cy="175" r="14" />
      <circle className="eh-spot" cx="140" cy="190" r="10" />
      {taps > 0 && <path className="eh-crack" d={CRACKS[Math.min(taps, CRACKS.length - 1)]} />}
    </svg>
  );
}

function ShellBottom() {
  return (
    <svg className="eh-shell-bottom" viewBox="0 0 200 110" aria-hidden="true">
      <path
        className="eh-shell"
        d="M10 36 L30 20 L48 38 L70 18 L88 38 L108 16 L126 38 L146 18 L166 38 L190 22 C192 80 150 104 100 104 C50 104 8 80 10 36 Z"
      />
      <circle className="eh-spot" cx="60" cy="70" r="12" />
      <circle className="eh-spot" cx="140" cy="76" r="9" />
    </svg>
  );
}

export default function EggHatchGame({ dinos, speak, onFinish, onExit }: GameProps) {
  const [hatchedIds, setHatchedIds] = useState(loadHatched);
  const [dino, setDino] = useState<Dino | undefined>(() => pickNextDino(dinos, hatchedIds));
  const [taps, setTaps] = useState(0);
  const [hatchCount, setHatchCount] = useState(0);
  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current = speak;
  });

  const isHatched = taps >= TAPS_TO_HATCH;

  // Intro for every new egg, and one reminder if the egg sits untouched.
  useEffect(() => {
    if (!dino) return;
    speakRef.current(PHRASES.eggIntro);
  }, [dino]);

  useEffect(() => {
    if (!dino || taps > 0) return;
    const id = window.setTimeout(() => speakRef.current(PHRASES.eggIntro), IDLE_REPROMPT_MS);
    return () => window.clearTimeout(id);
  }, [dino, taps]);

  // Leaving after at least one hatch counts as a finished play for the shell.
  const back = () => {
    if (hatchCount > 0) onFinish({ stars: 1, correct: hatchCount, total: hatchCount, message: hatchResult(hatchCount) });
    else onExit();
  };

  if (!dino) {
    return (
      <div className="game">
        <div className="game-top">
          <button type="button" className="game-btn game-back" aria-label="Back" onClick={onExit}>⬅️</button>
        </div>
        <div className="game-empty">🥚</div>
      </div>
    );
  }

  const tapEgg = () => {
    const next = taps + 1;
    setTaps(next);
    playCrack(next / TAPS_TO_HATCH);
    if (next < TAPS_TO_HATCH) {
      if (next === 1) speak(PHRASES.eggKeepGoing);
      return;
    }
    window.setTimeout(playCorrect, 150);
    speak(PHRASES.eggHatched(dino.name));
    setHatchedIds(saveHatched(hatchedIds, dino.id));
    setHatchCount((n) => n + 1);
  };

  const tapDino = () => speak(`${dino.name}! ${dino.funFact}`);

  const another = () => {
    setTaps(0);
    setDino(pickNextDino(dinos, hatchedIds, dino.id));
  };

  const style = {
    '--dino-color': dino.color,
    '--wobble': `${taps * WOBBLE_DEG_PER_TAP}deg`,
  } as CSSProperties;

  return (
    <div className="game eh" style={style}>
      <div className="game-top">
        <button type="button" className="game-btn game-back" aria-label="Back" onClick={back}>⬅️</button>
      </div>

      <div className="eh-stage">
        {isHatched ? (
          <>
            <button type="button" className="eh-dino" aria-label={`${dino.name}. Tap to hear a fun fact.`} onClick={tapDino}>
              <DinoImage id={dino.id} />
            </button>
            <ShellBottom />
            <p className="eh-name" aria-hidden="true">{dino.name}</p>
          </>
        ) : (
          <button
            type="button"
            // Remount on each tap so the wobble animation replays, bigger each time.
            key={taps}
            className={`eh-egg${taps > 0 ? ' wobble' : ''}`}
            aria-label="Egg. Tap to hatch it."
            onClick={tapEgg}
          >
            <Egg taps={taps} />
          </button>
        )}
      </div>

      {isHatched && (
        <button
          type="button"
          className="game-btn eh-another"
          // The new egg speaks its own intro, so no extra line here.
          onClick={another}
        >
          <span aria-hidden="true">🥚</span> Hatch another
        </button>
      )}
    </div>
  );
}
