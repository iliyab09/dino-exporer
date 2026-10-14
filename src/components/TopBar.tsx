import type { ReactNode } from 'react';
import { BigButton } from './BigButton';
import './TopBar.css';

/** Screen header: big back arrow on the left, optional title/children. */
export function TopBar({ onBack, children }: { onBack?: () => void; children?: ReactNode }) {
  return (
    <header className="top-bar">
      {onBack && (
        <BigButton onClick={onBack} emoji="⬅️" ariaLabel="Back" variant="secondary" />
      )}
      <div className="top-bar__title">{children}</div>
    </header>
  );
}

export default TopBar;
