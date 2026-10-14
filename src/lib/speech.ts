// Text to speech for kids who cannot read yet. Wraps window.speechSynthesis.
// Safe to call anywhere: no-op when the browser has no speech support.

const RATE = 0.85;
const PITCH = 1.1;

const PREFERRED_VOICES = [
  'Samantha', // iOS / macOS
  'Google US English', // Chrome desktop / Android
  'Microsoft Aria', // Edge
  'Microsoft Jenny',
  'Karen',
  'Daniel',
];

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function synth(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return window.speechSynthesis;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const s = synth();
  if (!s) return null;
  const voices = s.getVoices();
  if (voices.length === 0) return null; // not loaded yet; try again next call
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const preferred = PREFERRED_VOICES.map((name) =>
    english.find((v) => v.name.startsWith(name)),
  ).find(Boolean);
  cachedVoice =
    preferred ??
    english.find((v) => v.lang.toLowerCase() === 'en-us' && v.localService) ??
    english.find((v) => v.lang.toLowerCase() === 'en-us') ??
    english[0] ??
    null;
  return cachedVoice;
}

// Voices arrive asynchronously in Chrome; reset the cache when they do.
const s0 = synth();
if (s0 && typeof s0.addEventListener === 'function') {
  s0.addEventListener('voiceschanged', () => {
    cachedVoice = undefined;
  });
}

export function isSpeechSupported(): boolean {
  return synth() !== null;
}

/** Speak text aloud, cancelling whatever was being said. */
export function speak(text: string): void {
  const s = synth();
  if (!s || !text) return;
  try {
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = 'en-US';
    }
    u.rate = RATE;
    u.pitch = PITCH;
    s.speak(u);
  } catch {
    // Speech is a nice-to-have; never crash the app over it.
  }
}

/** Stop any speech in progress. */
export function stopSpeaking(): void {
  synth()?.cancel();
}
