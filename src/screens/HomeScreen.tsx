import { useState, type CSSProperties } from 'react';
import { BigButton } from '../components/BigButton';
import { DinoArt } from '../components/DinoArt';
import { LongPressButton } from '../components/LongPressButton';
import { UiIcon } from '../components/UiIcon';
import { DINOS } from '../lib/registry';
import { PHRASES } from '../data/phrases';
import { levelFor } from '../lib/progress';
import { playTap } from '../lib/sfx';
import { speak } from '../lib/speech';
import './HomeScreen.css';

const TITLE = 'Dino Explorer';

export function HomeScreen({
  onLearn,
  onPlay,
  onStickers,
  onGrownUps,
  totalStars,
}: {
  onLearn: () => void;
  onPlay: () => void;
  onStickers: () => void;
  onGrownUps: () => void;
  totalStars: number;
}) {
  const hero = DINOS[0];
  const level = levelFor(totalStars);
  const [bob, setBob] = useState(false);
  return (
    <main className="screen home">
      <section className="home__scene">
        <span className="home__sun" aria-hidden="true" />
        <button
          type="button"
          className="home__badge"
          aria-label={PHRASES.levelName[level]}
          onClick={() => {
            playTap();
            speak(PHRASES.levelName[level]);
          }}
        >
          <UiIcon name={`badge-level-${level}`} />
        </button>
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
        {hero && (
          <button
            type="button"
            className="home__hero"
            aria-label={hero.name}
            onClick={() => {
              setBob(true);
              speak(hero.name);
            }}
          >
            <span className={`hero__bob${bob ? ' is-bobbing' : ''}`} onAnimationEnd={() => setBob(false)}>
              <DinoArt dino={hero} className="hero__img" decorative />
              {hero.id === 'tyrannosaurus-rex' && <UiIcon name="hero-trex-blink" className="hero__blink" />}
            </span>
          </button>
        )}
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
          ariaLabel={PHRASES.stickerBookIntro}
          say={`${PHRASES.starCount(totalStars)} ${PHRASES.stickerBookIntro}`}
          onClick={onStickers}
        />
      </nav>

      <footer className="home__footer">
        <LongPressButton ariaLabel="For grown-ups (press and hold)" onLongPress={onGrownUps}>
          <span aria-hidden="true">⚙️</span>
        </LongPressButton>
      </footer>
    </main>
  );
}

export default HomeScreen;
