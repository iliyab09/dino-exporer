import { BigButton } from '../components/BigButton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PHRASES } from '../data/phrases';
import type { Dino, GameProps } from '../data/types';
import type { GameEntry } from '../lib/registry';
import { speak } from '../lib/speech';

/** Hosts one registry game full-screen. The game draws its own back button. */
export function GameScreen({
  game,
  dinos,
  onFinish,
  onExit,
}: {
  game: GameEntry;
  dinos: Dino[];
  onFinish: GameProps['onFinish'];
  onExit: () => void;
}) {
  const Game = game.component;
  return (
    <main className="screen game-host">
      <ErrorBoundary
        fallback={
          <BigButton size="lg" emoji="🙈" variant="secondary" ariaLabel="Back" say={PHRASES.oops} onClick={onExit} />
        }
      >
        <Game dinos={dinos} speak={speak} onFinish={onFinish} onExit={onExit} />
      </ErrorBoundary>
    </main>
  );
}

export default GameScreen;
