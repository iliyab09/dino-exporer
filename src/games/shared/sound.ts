// Tiny WebAudio cues for games. Silent if WebAudio is unavailable.
// TODO: switch to src/lib/sfx.ts once Sam publishes it.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Happy rising arpeggio. */
export function playCorrect() {
  tone(523, 0, 0.15);
  tone(659, 0.1, 0.15);
  tone(784, 0.2, 0.25);
}

/** Soft low "boop", never harsh. */
export function playWrong() {
  tone(220, 0, 0.25, 'triangle', 0.12);
}

/** Short pop for flips and taps. */
export function playPop() {
  tone(660, 0, 0.08, 'sine', 0.1);
}
