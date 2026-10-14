import { DinoArt } from '../components/DinoArt';
import { UiIcon } from '../components/UiIcon';
import { Stars } from '../components/Stars';
import { TopBar } from '../components/TopBar';
import { PHRASES } from '../data/phrases';
import type { Dino } from '../data/types';
import { playTap, playWrong } from '../lib/sfx';
import { speak } from '../lib/speech';
import { starsTowardNext, stickersUnlocked } from '../lib/stickers';
import './StickerScreen.css';

export function StickerScreen({
  dinos,
  totalStars,
  onBack,
}: {
  dinos: Dino[];
  totalStars: number;
  onBack: () => void;
}) {
  const unlocked = stickersUnlocked(totalStars, dinos.length);
  const toward = starsTowardNext(totalStars);
  const allDone = unlocked >= dinos.length;

  return (
    <main className="screen stickers">
      <h1 className="sr-only">Sticker book</h1>
      <TopBar onBack={onBack}>
        <button
          type="button"
          className="stickers__progress"
          aria-label={PHRASES.stickerBookIntro}
          onClick={() => {
            playTap();
            speak(PHRASES.stickerBookIntro);
          }}
        >
          <UiIcon name="sticker-book" />
          {!allDone && <Stars count={toward} size="sm" />}
        </button>
      </TopBar>

      <ul className="stickers__page">
        {dinos.map((dino, i) => {
          const owned = i < unlocked;
          return (
            <li key={dino.id} className="stickers__slot" style={{ ['--tilt' as string]: `${((i % 3) - 1) * 5}deg` }}>
              <button
                type="button"
                className={`stickers__sticker ${owned ? 'stickers__sticker--owned' : 'stickers__sticker--locked'}`}
                aria-label={owned ? dino.name : PHRASES.stickerLocked}
                onClick={() => {
                  if (owned) {
                    playTap();
                    speak(dino.name);
                  } else {
                    playWrong();
                    speak(PHRASES.stickerLocked);
                  }
                }}
              >
                <DinoArt dino={dino} className="stickers__art" decorative />
                {!owned && (
                  <span className="stickers__lock" aria-hidden="true">
                    ❓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default StickerScreen;
