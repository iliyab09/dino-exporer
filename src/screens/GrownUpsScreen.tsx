import { useState } from 'react';
import { BigButton } from '../components/BigButton';
import { TopBar } from '../components/TopBar';
import { ABOUT } from '../data/about';
import './GrownUpsScreen.css';

/** Read-only info for parents and teachers, plus "reset progress" behind a confirm. */
export function GrownUpsScreen({ onBack, onReset }: { onBack: () => void; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <main className="screen grownups">
      <TopBar onBack={onBack} />
      <article className="grownups__page">
        <h1 className="grownups__title">{ABOUT.title}</h1>
        <p className="grownups__intro">{ABOUT.intro}</p>
        {ABOUT.sections.map((section) => (
          <section key={section.title} className="grownups__section">
            <h2>{section.title}</h2>
            <ul>
              {section.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="grownups__section grownups__reset">
          <h2>Reset progress</h2>
          {done ? (
            <p role="status">Progress reset. Stars and stickers start again from zero.</p>
          ) : confirming ? (
            <>
              <p>Delete all stars and stickers on this device? This cannot be undone.</p>
              <div className="grownups__confirm">
                <BigButton
                  label="Yes, reset"
                  variant="accent"
                  onClick={() => {
                    onReset();
                    setConfirming(false);
                    setDone(true);
                  }}
                />
                <BigButton label="Cancel" variant="secondary" onClick={() => setConfirming(false)} />
              </div>
            </>
          ) : (
            <BigButton label="Reset progress" variant="secondary" onClick={() => setConfirming(true)} />
          )}
        </section>
      </article>
    </main>
  );
}

export default GrownUpsScreen;
