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

const UI = `${import.meta.env.BASE_URL}ui/`;
/** Pixel's egg art per tap count (same outline in every stage, so swaps don't shift). */
const EGG_STAGES = [`${UI}egg.svg`, `${UI}egg-crack-1.svg`, `${UI}egg-crack-2.svg`];

/** Pixel's main crack line from egg-crack-2.svg; the hatched shell is the egg below it. */
const ZIGZAG = '44,110 60,100 72,114 86,98 100,116 114,98 128,114 142,100 157,110';

function ShellBottom() {
  return (
    <svg className="eh-shell-bottom" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <clipPath id="eh-shell-clip">
          <polygon points={`0,110 ${ZIGZAG} 200,110 200,200 0,200`} />
        </clipPath>
      </defs>
      <image href={EGG_STAGES[0]} width="200" height="200" clipPath="url(#eh-shell-clip)" />
      <polyline className="eh-crack" points={ZIGZAG} />
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
            // Alternate two identical wobbles so it replays on every tap without remounting.
            className={`eh-egg${taps > 0 ? ` wobble-${taps % 2}` : ''}`}
            aria-label="Egg. Tap to hatch it."
            onClick={tapEgg}
          >
            {/* All stages load up front and stay mounted, so a slow network never shows a blank egg. */}
            {EGG_STAGES.map((src, i) => (
              <img
                key={src}
                className={`eh-egg-img${i === Math.min(taps, EGG_STAGES.length - 1) ? ' on' : ''}`}
                src={src}
                alt=""
                draggable={false}
              />
            ))}
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
