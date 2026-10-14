import { DinoCard } from '../components/DinoCard';
import { TopBar } from '../components/TopBar';
import type { Dino } from '../data/types';
import { speak } from '../lib/speech';
import './LearnScreen.css';

export function LearnScreen({
  dinos,
  onBack,
  onOpen,
}: {
  dinos: Dino[];
  onBack: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <main className="screen learn">
      <TopBar onBack={onBack}>
        <span aria-hidden="true">📖</span>
      </TopBar>
      <ul className="learn__grid">
        {dinos.map((dino) => (
          <li key={dino.id}>
            <DinoCard
              dino={dino}
              onSpeak={() => speak(dino.name)}
              onClick={() => {
                speak(dino.name);
                onOpen(dino.id);
              }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default LearnScreen;
