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
  level,
  onFinish,
  onExit,
}: {
  game: GameEntry;
  dinos: Dino[];
  level: GameProps['level'];
  onFinish: GameProps['onFinish'];
  onExit: () => void;
}) {
  const Game = game.component;
  return (
    <main className="screen game-host">
      <h1 className="sr-only">{game.title}</h1>
      <ErrorBoundary
        fallback={
          <BigButton size="lg" emoji="🙈" variant="secondary" ariaLabel="Back" say={PHRASES.oops} onClick={onExit} />
        }
      >
        <Game dinos={dinos} level={level} speak={speak} onFinish={onFinish} onExit={onExit} />
      </ErrorBoundary>
    </main>
  );
}

export default GameScreen;
