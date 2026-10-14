import { useEffect, useState, type CSSProperties } from 'react';
import { BigButton } from '../components/BigButton';
import { Stars } from '../components/Stars';
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

const CHEERS: Record<1 | 2 | 3, string> = {
  1: 'Good try! You got one star!',
  2: 'Great job! You got two stars!',
  3: 'Wow! Three stars! You are a dino expert!',
};

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
  onAgain,
  onDone,
}: {
  stars: 1 | 2 | 3;
  onAgain: () => void;
  onDone: () => void;
}) {
  useEffect(() => {
    playWin();
    const t = window.setTimeout(() => speak(CHEERS[stars]), 700);
    return () => window.clearTimeout(t);
  }, [stars]);

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

      <button
        type="button"
        className="reward__stars"
        aria-label={CHEERS[stars]}
        onClick={() => speak(CHEERS[stars])}
      >
        <Stars count={stars} size="lg" pop />
      </button>

      <nav className="reward__actions">
        <BigButton size="lg" emoji="🔁" ariaLabel="Play again" say="Play again" variant="accent" onClick={onAgain} />
        <BigButton size="lg" emoji="✅" ariaLabel="Done" say="Done" variant="primary" onClick={onDone} />
      </nav>
    </main>
  );
}

export default RewardScreen;
