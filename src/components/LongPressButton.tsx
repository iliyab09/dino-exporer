import { useEffect, useRef, useState, type ReactNode } from 'react';
import './LongPressButton.css';

/**
 * A button that only fires after being held for `holdMs` (default 1.5 s), so
 * young kids tapping around don't wander into grown-up screens. A ring fills
 * while held. Keyboard users can activate it with Enter.
 */
export function LongPressButton({
  onLongPress,
  ariaLabel,
  children,
  holdMs = 1500,
  className,
}: {
  onLongPress: () => void;
  ariaLabel: string;
  children: ReactNode;
  holdMs?: number;
  className?: string;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const cancel = () => {
    window.clearTimeout(timer.current);
    setHolding(false);
  };
  const start = () => {
    cancel();
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      onLongPress();
    }, holdMs);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      className={`long-press ${holding ? 'long-press--holding' : ''} ${className ?? ''}`}
      style={{ ['--hold-ms' as string]: `${holdMs}ms` }}
      aria-label={ariaLabel}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onLongPress();
      }}
    >
      <svg className="long-press__ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16" pathLength="100" />
      </svg>
      <span className="long-press__content">{children}</span>
    </button>
  );
}

export default LongPressButton;
