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

function noise(start: number, dur: number, freq: number, vol: number, type: BiquadFilterType = 'bandpass') {
  const ac = audio();
  if (!ac) return;
  const len = Math.floor(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const gain = ac.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(ac.currentTime + start);
}

/** Leafy "crunch crunch crunch" for plant-eaters. */
export function playCrunch() {
  for (let i = 0; i < 3; i++) noise(i * 0.16, 0.1, 3000, 0.45, 'highpass');
}

/** Two low "chomp" bites for meat-eaters. */
export function playChomp() {
  const ac = audio();
  if (!ac) return;
  for (let i = 0; i < 2; i++) {
    const t = ac.currentTime + i * 0.22;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.16);
    noise(i * 0.22, 0.06, 900, 0.3);
  }
}

/** Eggshell crack: a short filtered noise burst. Louder for bigger cracks (0..1). */
export function playCrack(strength = 0.5) {
  noise(0, 0.12, 1800, 0.25 + 0.35 * strength);
}
