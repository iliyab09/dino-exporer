import { BigButton } from '../components/BigButton';
import { Stars } from '../components/Stars';
import { TopBar } from '../components/TopBar';
import { PHRASES } from '../data/phrases';
import type { GameEntry } from '../lib/registry';
import './PlayScreen.css';

export function PlayScreen({
  games,
  dinoCount,
  best,
  onBack,
  onStart,
}: {
  games: GameEntry[];
  dinoCount: number;
  best: Record<string, number>;
  onBack: () => void;
  onStart: (id: string) => void;
}) {
  return (
    <main className="screen play">
      <h1 className="sr-only">Games</h1>
      <TopBar onBack={onBack}>
        <span aria-hidden="true">🎮</span>
      </TopBar>
      {games.length === 0 ? (
        <BigButton
          size="lg"
          emoji="🥚"
          variant="sun"
          ariaLabel="Games are hatching soon"
          say={PHRASES.gamesHatching}
          onClick={() => {}}
        />
      ) : (
        <ul className="play__list">
          {games.map((g) => {
            const ready = dinoCount >= g.minDinos;
            return (
              <li key={g.id} className="play__item">
                <BigButton
                  size="lg"
                  variant="accent"
                  className="play__tile"
                  emoji={g.emoji}
                  label={g.title}
                  disabled={!ready}
                  say={g.title}
                  onClick={() => onStart(g.id)}
                />
                <Stars count={best[g.id] ?? 0} size="sm" />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default PlayScreen;

