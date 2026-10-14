// Tiny synthesized sound effects (WebAudio). No audio files.
// All functions are no-ops when WebAudio is unavailable.

type Wave = OscillatorType;

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  // Mobile browsers start the context suspended until a user gesture.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Play one note. `at` is seconds from now. */
function tone(freq: number, duration: number, at = 0, type: Wave = 'sine', volume = 0.2): void {
  const c = audio();
  if (!c) return;
  const start = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Soft pop for any button press. */
export function playTap(): void {
  tone(660, 0.08, 0, 'triangle', 0.15);
}

/** Happy rising two-note chime. */
export function playCorrect(): void {
  tone(784, 0.14, 0, 'triangle'); // G5
  tone(1047, 0.22, 0.12, 'triangle'); // C6
}

/** Gentle low "boop boop", never harsh. */
export function playWrong(): void {
  tone(330, 0.16, 0, 'sine', 0.18);
  tone(262, 0.24, 0.16, 'sine', 0.18);
}

/** Little fanfare for the reward screen. */
export function playWin(): void {
  const notes = [523, 659, 784, 1047]; // C E G C
  notes.forEach((f, i) => tone(f, 0.18, i * 0.13, 'triangle'));
  tone(1319, 0.5, notes.length * 0.13, 'triangle', 0.22);
}
