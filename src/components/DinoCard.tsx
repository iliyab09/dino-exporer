import type { CSSProperties } from 'react';
import type { Dino } from '../data/types';
import { playTap } from '../lib/sfx';
import { BigButton } from './BigButton';
import { DinoArt } from './DinoArt';
import './DinoCard.css';

export interface DinoCardProps {
  dino: Dino;
  /** Tap on the card. The caller decides whether to speak / navigate. */
  onClick?: () => void;
  /** When given, shows the round 🔊 button that calls it (usually `() => speak(dino.name)`). */
  onSpeak?: () => void;
  /** Show the name strip under the art (default true). Quiz games may hide it. */
  showName?: boolean;
  size?: 'md' | 'lg';
  /** Visual feedback for quiz answers. */
  state?: 'idle' | 'correct' | 'wrong';
  disabled?: boolean;
}

/** Dino tile per DESIGN.md: color panel with art, name strip, optional speaker button. */
export function DinoCard({
  dino,
  onClick,
  onSpeak,
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
        aria-label={dino.name}
        disabled={disabled || !onClick}
        onClick={() => {
          playTap();
          onClick?.();
        }}
      >
        <span className="dino-card__panel">
          <DinoArt dino={dino} className="dino-card__art" />
        </span>
        {showName && <span className="dino-card__name">{dino.name}</span>}
      </button>
      {onSpeak && (
        <span className="dino-card__speak-anchor">
          <BigButton
            className="dino-card__speak"
            round
            variant="secondary"
            emoji="🔊"
            ariaLabel={`Say ${dino.name}`}
            sound={false}
            onClick={onSpeak}
          />
        </span>
      )}
    </div>
  );
}

export default DinoCard;
