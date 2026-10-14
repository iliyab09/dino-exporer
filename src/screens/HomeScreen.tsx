import type { CSSProperties } from 'react';
import { BigButton } from '../components/BigButton';
import { DinoArt } from '../components/DinoArt';
import { UiIcon } from '../components/UiIcon';
import { DINOS } from '../lib/registry';
import { PHRASES } from '../data/phrases';
import { speak } from '../lib/speech';
import './HomeScreen.css';

const TITLE = 'Dino Explorer';

export function HomeScreen({
  onLearn,
  onPlay,
  onStickers,
  totalStars,
}: {
  onLearn: () => void;
  onPlay: () => void;
  onStickers: () => void;
  totalStars: number;
}) {
  const hero = DINOS[0];
  return (
    <main className="screen home">
      <section className="home__scene">
        <span className="home__sun" aria-hidden="true" />
        <h1 className="home__heading">
          <button type="button" className="home__title" onClick={() => speak(PHRASES.homeIntro)}>
            {TITLE.split('').map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="home__gap">
                  {' '}
                </span>
              ) : (
                <span
                  key={i}
                  className="home__letter"
                  style={
                    {
                      '--i': i,
                      '--tilt': `${((i % 3) - 1) * 6}deg`,
                      '--lift': `${(i % 2) * 4}px`,
                    } as CSSProperties
                  }
                >
                  {ch}
                </span>
              ),
            )}
          </button>
        </h1>
        {hero && <DinoArt dino={hero} className="home__hero" />}
        <span className="home__hill" aria-hidden="true" />
      </section>

      <nav className="home__actions">
        <BigButton
          size="lg"
          emoji="📖"
          label="Learn"
          say={PHRASES.learn}
          variant="primary"
          onClick={onLearn}
        />
        <BigButton size="lg" emoji="🎮" label="Play" say={PHRASES.play} variant="accent" onClick={onPlay} />
        <BigButton
          size="lg"
          emoji={
            <>
              <UiIcon name="sticker-book" />
              <span className="home__star-count">
                {totalStars}
                <UiIcon name="star" />
              </span>
            </>
          }
          variant="berry"
          ariaLabel={`${totalStars} stars, sticker book`}
          say={`${PHRASES.starCount(totalStars)} ${PHRASES.stickerBookIntro}`}
          onClick={onStickers}
        />
      </nav>
    </main>
  );
}

export default HomeScreen;
