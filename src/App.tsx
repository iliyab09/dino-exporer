import { useCallback, useEffect, useState } from 'react';
import { DINOS, GAMES } from './lib/registry';
import { levelFor, loadProgress, recordStars, resetProgress, type Progress } from './lib/progress';
import { HOME, isHistoryEntry, parentOf, type HistoryEntry, type Route } from './lib/route';
import { stopSpeaking } from './lib/speech';
import { newlyUnlocked } from './lib/stickers';
import { DinoScreen } from './screens/DinoScreen';
import { GameScreen } from './screens/GameScreen';
import { GrownUpsScreen } from './screens/GrownUpsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LearnScreen } from './screens/LearnScreen';
import { PlayScreen } from './screens/PlayScreen';
import { RewardScreen } from './screens/RewardScreen';
import { StickerScreen } from './screens/StickerScreen';
import './App.css';

function initialEntry(): HistoryEntry {
  const state: unknown = window.history.state;
  if (isHistoryEntry(state)) return state;
  const entry = { route: HOME, depth: 0 };
  window.history.replaceState(entry, '');
  return entry;
}

export default function App() {
  const [entry, setEntry] = useState<HistoryEntry>(initialEntry);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const { route } = entry;

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      stopSpeaking();
      setEntry(isHistoryEntry(e.state) ? e.state : { route: HOME, depth: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  /** Go to a new screen. `replace` swaps the current history entry instead of adding one. */
  const go = useCallback(
    (next: Route, replace = false) => {
      const nextEntry = { route: next, depth: replace ? entry.depth : entry.depth + 1 };
      if (replace) window.history.replaceState(nextEntry, '');
      else window.history.pushState(nextEntry, '');
      setEntry(nextEntry);
    },
    [entry.depth],
  );

  const back = useCallback(() => {
    stopSpeaking();
    if (entry.depth > 0) window.history.back();
    else go(parentOf(route), true);
  }, [entry.depth, go, route]);

  switch (route.name) {
    case 'home':
      return (
        <HomeScreen
          totalStars={progress.totalStars}
          onLearn={() => go({ name: 'learn' })}
          onPlay={() => go({ name: 'play' })}
          onStickers={() => go({ name: 'stickers' })}
          onGrownUps={() => go({ name: 'grownups' })}
        />
      );

    case 'learn':
      return <LearnScreen dinos={DINOS} onBack={back} onOpen={(id) => go({ name: 'dino', id })} />;

    case 'dino': {
      const i = DINOS.findIndex((d) => d.id === route.id);
      if (i < 0) return <LearnScreen dinos={DINOS} onBack={back} onOpen={(id) => go({ name: 'dino', id }, true)} />;
      return (
        <DinoScreen
          dino={DINOS[i]}
          prev={DINOS[i - 1]}
          next={DINOS[i + 1]}
          onBack={back}
          onOpen={(id) => go({ name: 'dino', id }, true)}
        />
      );
    }

    case 'play':
      return (
        <PlayScreen
          games={GAMES}
          dinoCount={DINOS.length}
          best={progress.best}
          onBack={back}
          onStart={(id) => go({ name: 'game', id })}
        />
      );

    case 'game': {
      const game = GAMES.find((g) => g.id === route.id);
      if (!game) {
        return (
          <PlayScreen games={GAMES} dinoCount={DINOS.length} best={progress.best} onBack={back} onStart={(id) => go({ name: 'game', id }, true)} />
        );
      }
      return (
        <GameScreen
          key={entry.depth /* fresh round on "play again" */}
          game={game}
          dinos={DINOS}
          onExit={back}
          level={levelFor(progress.totalStars)}
          onFinish={({ stars, correct, total, message }) => {
            const before = progress.totalStars;
            const next = recordStars(game.id, stars);
            setProgress(next);
            const newStickers = newlyUnlocked(DINOS, before, next.totalStars).map((d) => d.id);
            const newLevel = levelFor(next.totalStars);
            const levelUp = newLevel > levelFor(before) ? (newLevel as 2 | 3) : undefined;
            go({ name: 'reward', gameId: game.id, stars, correct, total, message, newStickers, levelUp }, true);
          }}
        />
      );
    }

    case 'reward':
      return (
        <RewardScreen
          stars={route.stars}
          message={route.message}
          newStickers={DINOS.filter((d) => route.newStickers?.includes(d.id))}
          levelUp={route.levelUp}
          onStickers={() => go({ name: 'stickers' }, true)}
          onAgain={() => go({ name: 'game', id: route.gameId }, true)}
          onDone={back}
        />
      );

    case 'grownups':
      return (
        <GrownUpsScreen
          onBack={back}
          onReset={() => {
            resetProgress();
            setProgress(loadProgress());
          }}
        />
      );

    case 'stickers':
      return <StickerScreen dinos={DINOS} totalStars={progress.totalStars} onBack={back} />;
  }
}
