import type { Dino } from '../data/types';
import { playTap } from '../lib/sfx';
import { DinoArt } from './DinoArt';
import './DinoCard.css';

export interface DinoCardProps {
  dino: Dino;
  onClick?: () => void;
  /** Show the name under the art (default true). Games may hide it. */
  showName?: boolean;
  size?: 'md' | 'lg';
  /** Visual state for quiz answers. */
  state?: 'idle' | 'correct' | 'wrong';
  disabled?: boolean;
}

/** Tappable dino tile: big art on the dino's color, name underneath. */
export function DinoCard({
  dino,
  onClick,
  showName = true,
  size = 'md',
  state = 'idle',
  disabled,
}: DinoCardProps) {
  return (
    <button
      type="button"
      className={`dino-card dino-card--${size} dino-card--${state}`}
      style={{ '--dino-color': dino.color } as React.CSSProperties}
      aria-label={dino.name}
      disabled={disabled || !onClick}
      onClick={() => {
        playTap();
        onClick?.();
      }}
    >
      <DinoArt dino={dino} className="dino-card__art" />
      {showName && <span className="dino-card__name">{dino.name}</span>}
    </button>
  );
}

export default DinoCard;
