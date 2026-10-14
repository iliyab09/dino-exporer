import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Runs in the node environment: we hand-roll the bits of window the module touches.
class FakeUtterance {
  text: string;
  voice: unknown = null;
  lang = '';
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

function fakeSynth(voices: { name: string; lang: string; localService: boolean }[]) {
  return {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: () => voices,
    addEventListener: vi.fn(),
  };
}

async function loadSpeech() {
  vi.resetModules();
  return import('./speech');
}

describe('speech', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('without speechSynthesis', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {});
    });

    it('is a silent no-op', async () => {
      const { speak, isSpeechSupported } = await loadSpeech();
      expect(isSpeechSupported()).toBe(false);
      expect(() => speak('Triceratops')).not.toThrow();
    });
  });

  describe('with speechSynthesis', () => {
    let synth: ReturnType<typeof fakeSynth>;

    beforeEach(() => {
      synth = fakeSynth([
        { name: 'Thomas', lang: 'fr-FR', localService: true },
        { name: 'Some voice', lang: 'en-GB', localService: true },
        { name: 'Samantha', lang: 'en-US', localService: true },
      ]);
      vi.stubGlobal('window', { speechSynthesis: synth });
      vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
    });

    it('cancels the previous utterance and speaks slowly in English', async () => {
      const { speak } = await loadSpeech();
      speak('Stegosaurus');
      expect(synth.cancel).toHaveBeenCalledTimes(1);
      expect(synth.speak).toHaveBeenCalledTimes(1);
      const u = synth.speak.mock.calls[0][0] as FakeUtterance;
      expect(u.text).toBe('Stegosaurus');
      expect(u.rate).toBeCloseTo(0.85);
      expect(u.lang).toBe('en-US');
      expect((u.voice as { name: string }).name).toBe('Samantha');
    });

    it('ignores empty text', async () => {
      const { speak } = await loadSpeech();
      speak('');
      expect(synth.speak).not.toHaveBeenCalled();
    });

    it('falls back to en-US with no voice when voices are not loaded yet', async () => {
      synth.getVoices = () => [];
      const { speak } = await loadSpeech();
      speak('Velociraptor');
      const u = synth.speak.mock.calls[0][0] as FakeUtterance;
      expect(u.voice).toBeNull();
      expect(u.lang).toBe('en-US');
    });

    it('never throws if the engine does', async () => {
      synth.speak.mockImplementation(() => {
        throw new Error('boom');
      });
      const { speak } = await loadSpeech();
      expect(() => speak('Pteranodon')).not.toThrow();
    });
  });
});
