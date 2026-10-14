import { BigButton } from '../components/BigButton';
import { DinoArt } from '../components/DinoArt';
import { TopBar } from '../components/TopBar';
import type { Dino } from '../data/types';
import { playTap } from '../lib/sfx';
import { speak } from '../lib/speech';
import './DinoScreen.css';

/**
 * TTS mangles bare syllables like "Pter" or "Ty", so each chip speaks the
 * matching phonetic chunk from `pronunciation` ("try-SAIR-uh-tops") when the
 * counts line up. Lowercased so "SAIR" is not spelled out letter by letter.
 */
export function syllableSounds(dino: Dino): string[] {
  const chunks = dino.pronunciation.split(/[-\s]+/).filter(Boolean);
  return chunks.length === dino.syllables.length
    ? chunks.map((c) => c.toLowerCase())
    : dino.syllables;
}

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
