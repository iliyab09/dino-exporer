import type { CSSProperties } from 'react';
import type { Dino } from '../data/types';
import { playTap } from '../lib/sfx';
import { hyphenateName } from '../lib/syllables';
import { DinoArt } from './DinoArt';
import './DinoCard.css';

export interface DinoCardProps {
  dino: Dino;
  /** Tap on the card. The caller decides whether to speak / navigate. */
  onClick?: () => void;
  /** Show the name strip under the art (default true). Quiz games may hide it. */
  showName?: boolean;
  size?: 'md' | 'lg';
  /** Visual feedback for quiz answers. */
  state?: 'idle' | 'correct' | 'wrong';
  disabled?: boolean;
}

/** Dino tile per DESIGN.md: tinted color panel with art, name strip underneath. */
export function DinoCard({
  dino,
  onClick,
  showName = true,
  size = 'md',
  state = 'idle',
  disabled,
}: DinoCardProps) {
  return (
    <div
      className={`dino-card dino-card--${size} dino-card--${state}`}
      style={{ '--dino-color': dino.color } as CSSProperties}
    >
      <button
        type="button"
        className="dino-card__main"
        aria-label={showName ? undefined : dino.name}
        disabled={disabled || !onClick}
        onClick={() => {
          playTap();
          onClick?.();
        }}
      >
        <span className="dino-card__panel">
          <DinoArt dino={dino} className="dino-card__art" decorative />
        </span>
        {showName && <span className="dino-card__name">{hyphenateName(dino)}</span>}
      </button>
    </div>
  );
}

export default DinoCard;
