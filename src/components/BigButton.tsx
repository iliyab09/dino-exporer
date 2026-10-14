import type { ReactNode } from 'react';
import { playTap } from '../lib/sfx';
import { speak } from '../lib/speech';
import './BigButton.css';

export type BigButtonVariant = 'primary' | 'secondary' | 'accent' | 'berry' | 'sun';

export interface BigButtonProps {
  onClick: () => void;
  /** Big picture shown on the button (emoji or any node). Kids navigate by this. */
  emoji?: ReactNode;
  /** Short visible label; a bonus for readers. Also the accessible name. */
  label?: string;
  /** Spoken aloud on tap (e.g. "Learn"). Games that speak themselves can omit it. */
  say?: string;
  variant?: BigButtonVariant;
  /** 'md' = 64px min, 'lg' = 88px min (primary actions). */
  size?: 'md' | 'lg';
  /** Round icon-only button (e.g. the 🔊 speaker). */
  round?: boolean;
  /** Set false to skip the tap click sound. */
  sound?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Chunky kid-sized button, styled per DESIGN.md. */
export function BigButton({
  onClick,
  emoji,
  label,
  say,
  variant = 'primary',
  size = 'md',
  round = false,
  sound = true,
  disabled,
  className,
  ariaLabel,
}: BigButtonProps) {
  const classes = [
    'big-button',
    `big-button--${variant}`,
    `big-button--${size}`,
    round && 'big-button--round',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={classes}
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
