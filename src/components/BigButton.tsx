import type { ReactNode } from 'react';
import { playTap } from '../lib/sfx';
import { speak } from '../lib/speech';
import './BigButton.css';

export interface BigButtonProps {
  onClick: () => void;
  /** Big picture shown on the button (emoji or any node). */
  emoji?: ReactNode;
  /** Short visible label. Also used as the accessible name. */
  label?: string;
  /** Spoken aloud on tap. Defaults to nothing (games often speak themselves). */
  say?: string;
  /** Any CSS color; defaults to the theme primary. */
  color?: string;
  size?: 'md' | 'lg';
  /** Set false to skip the tap click sound. */
  sound?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Chunky kid-sized button: at least 64px tall, 88px+ when size="lg". */
export function BigButton({
  onClick,
  emoji,
  label,
  say,
  color,
  size = 'md',
  sound = true,
  disabled,
  className,
  ariaLabel,
}: BigButtonProps) {
  return (
    <button
      type="button"
      className={`big-button big-button--${size} ${className ?? ''}`}
      style={color ? ({ '--bb-color': color } as React.CSSProperties) : undefined}
      disabled={disabled}
      aria-label={ariaLabel ?? label ?? say}
      onClick={() => {
        if (sound) playTap();
        if (say) speak(say);
        onClick();
      }}
    >
      {emoji != null && (
        <span className="big-button__emoji" aria-hidden="true">
          {emoji}
        </span>
      )}
      {label && <span className="big-button__label">{label}</span>}
    </button>
  );
}

export default BigButton;
