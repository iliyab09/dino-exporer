import type { Dino } from '../data/types';

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
