import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { BigButton } from '../components/BigButton';
import { DinoArt } from '../components/DinoArt';
import { Stars } from '../components/Stars';
import { UiIcon } from '../components/UiIcon';
import { PHRASES } from '../data/phrases';
import type { Dino } from '../data/types';
import { playWin } from '../lib/sfx';
import { speak } from '../lib/speech';
import './RewardScreen.css';

const CONFETTI_COLORS = [
  'var(--color-sun)',
  'var(--color-berry)',
  'var(--color-sky)',
  'var(--color-primary)',
  'var(--color-accent)',
];

/** Random confetti pieces; more stars, bigger party. */
function makeConfetti(stars: number) {
  return Array.from({ length: 14 + stars * 10 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.2 + Math.random() * 1.8,
    drift: (Math.random() - 0.5) * 120,
    spin: Math.random() * 720 - 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
  }));
}

export function RewardScreen({
  stars,
  message,
  newStickers = [],
  onStickers,
  onAgain,
  onDone,
}: {
  stars: 1 | 2 | 3;
  /** Game-specific praise (e.g. no-fail games); replaces the default star line. */
  message?: string;
  /** Stickers this round unlocked; the first one flies into the sticker book. */
  newStickers?: Dino[];
  onStickers?: () => void;
  onAgain: () => void;
  onDone: () => void;
}) {
  const praise = message || PHRASES.stars[stars];
  const sticker = newStickers[0];
  // speak() cancels whatever is playing, so the cheer and the sticker news are one line.
  const cheer = sticker ? `${praise} ${PHRASES.newSticker(sticker.name)}` : praise;

  useEffect(() => {
    playWin();
    const t = window.setTimeout(() => speak(cheer), 700);
    return () => window.clearTimeout(t);
  }, [cheer]);

  // Aim the new sticker's flight at the sticker book button (vars live on the sticker itself).
  const stickerRef = useRef<HTMLSpanElement>(null);
  const bookRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = stickerRef.current;
    const from = el?.getBoundingClientRect();
    const to = bookRef.current?.getBoundingClientRect();
    if (!el || !from || !to) return;
    el.style.setProperty('--fly-x', `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
    el.style.setProperty('--fly-y', `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
  }, [sticker]);

  const [confetti] = useState(() => makeConfetti(stars));

  return (
    <main className="screen reward">
      <div className="reward__confetti" aria-hidden="true">
        {confetti.map((c, i) => (
          <span
            key={i}
            className={`reward__bit ${c.round ? 'reward__bit--round' : ''}`}
            style={
              {
                left: `${c.left}%`,
                background: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                '--drift': `${c.drift}px`,
                '--spin': `${c.spin}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <h1 className="sr-only">{praise}</h1>
      <button type="button" className="reward__stars" aria-label={praise} onClick={() => speak(praise)}>
        <Stars count={stars} size="lg" pop showEmpty={!message} />
        {message && <span className="reward__message">{message}</span>}
      </button>

      {sticker && (
        <span ref={stickerRef} className="reward__sticker" aria-hidden="true">
          <DinoArt dino={sticker} className="reward__sticker-art" decorative />
        </span>
      )}

      <nav className="reward__actions">
        {sticker && onStickers && (
          <span ref={bookRef} className="reward__book">
            <BigButton
              size="lg"
              emoji={<UiIcon name="sticker-book" />}
              ariaLabel={PHRASES.newSticker(sticker.name)}
              say={PHRASES.newSticker(sticker.name)}
              variant="berry"
              onClick={onStickers}
            />
          </span>
        )}
        <BigButton size="lg" emoji="🔁" ariaLabel={PHRASES.playAgain} say={PHRASES.playAgain} variant="accent" onClick={onAgain} />
        <BigButton size="lg" emoji="✅" ariaLabel={PHRASES.done} say={PHRASES.done} variant="primary" onClick={onDone} />
      </nav>
    </main>
  );
}

export default RewardScreen;
