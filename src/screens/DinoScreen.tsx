import { BigButton } from '../components/BigButton';
import { DinoArt } from '../components/DinoArt';
import { TopBar } from '../components/TopBar';
import { PHRASES } from '../data/phrases';
import type { Dino } from '../data/types';
import { playTap } from '../lib/sfx';
import { sizeComparison } from '../lib/size';
import { speak } from '../lib/speech';
import { syllableSounds } from '../lib/syllables';
import './DinoScreen.css';

const DIET_EMOJI: Record<Dino['diet'], string> = {
  herbivore: '🌿',
  carnivore: '🍖',
  omnivore: '🍽️',
};

export function DinoScreen({
  dino,
  prev,
  next,
  onBack,
  onOpen,
}: {
  dino: Dino;
  prev?: Dino;
  next?: Dino;
  onBack: () => void;
  onOpen: (id: string) => void;
}) {
  const sounds = syllableSounds(dino);
  const size = sizeComparison(dino);
  const go = (d: Dino) => {
    speak(d.name);
    onOpen(d.id);
  };
  return (
    <main className="screen dino" style={{ ['--dino-color' as string]: dino.color }}>
      <TopBar onBack={onBack} />

      <button
        type="button"
        className="dino__art-button"
        aria-label={`Say ${dino.name}`}
        onClick={() => {
          playTap();
          speak(dino.name);
        }}
      >
        <DinoArt key={dino.id} dino={dino} className="dino__art" />
      </button>

      <div className="dino__name-row">
        <h1 className="dino__name">{dino.name}</h1>
        <BigButton
          round
          size="lg"
          variant="secondary"
          emoji="🔊"
          ariaLabel={`Say ${dino.name}`}
          sound={false}
          onClick={() => speak(dino.name)}
        />
      </div>

      <div className="dino__syllables" aria-label="Syllables">
        {dino.syllables.map((syl, i) => (
          <button
            key={`${syl}-${i}`}
            type="button"
            className="dino__chip"
            onClick={() => {
              playTap();
              speak(sounds[i] ?? syl);
            }}
          >
            {syl}
          </button>
        ))}
      </div>

      <div className="dino__fact">
        <p className="dino__bubble">{dino.funFact}</p>
        <BigButton
          round
          size="lg"
          variant="accent"
          emoji="💬"
          ariaLabel="Hear a fun fact"
          sound={false}
          onClick={() => speak(dino.funFact)}
        />
      </div>

      <div className="dino__facts">
        <BigButton
          size="lg"
          round
          variant="primary"
          emoji={DIET_EMOJI[dino.diet]}
          ariaLabel={PHRASES.diet[dino.diet]}
          say={PHRASES.diet[dino.diet]}
          onClick={() => {}}
        />
        <BigButton
          size="lg"
          round
          variant="sun"
          emoji="💡"
          ariaLabel={PHRASES.meaning(dino.name, dino.meaning)}
          say={PHRASES.meaning(dino.name, dino.meaning)}
          onClick={() => {}}
        />
        <BigButton
          size="lg"
          round
          variant="berry"
          emoji="🌋"
          ariaLabel={PHRASES.period[dino.period]}
          say={PHRASES.period[dino.period]}
          onClick={() => {}}
        />
      </div>

      <button
        type="button"
        className="dino__size"
        aria-label={size.sentence}
        onClick={() => {
          playTap();
          speak(size.sentence);
        }}
      >
        <span className="dino__size-dino" aria-hidden="true">
          {dino.sizeKind === 'wingspan' ? '🪽' : '📏'}
        </span>
        <span aria-hidden="true">=</span>
        <span className="dino__size-things" aria-hidden="true">
          {size.emoji.repeat(size.count)}
        </span>
      </button>

      <nav className="dino__nav">
        <BigButton
          emoji="◀️"
          ariaLabel={prev ? `Go to ${prev.name}` : 'No more dinos'}
          variant="secondary"
          disabled={!prev}
          onClick={() => prev && go(prev)}
        />
        <BigButton
          emoji="▶️"
          ariaLabel={next ? `Go to ${next.name}` : 'No more dinos'}
          variant="secondary"
          disabled={!next}
          onClick={() => next && go(next)}
        />
      </nav>
    </main>
  );
}

export default DinoScreen;
