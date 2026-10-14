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

const SOFT_HYPHEN = '­';

/**
 * The display name with soft hyphens at syllable boundaries, so a long name
 * that has to wrap breaks as "Pachy-cephalosaurus" instead of mid-syllable.
 * Boundaries are found by counting letters, so spaces and case in the name are kept.
 * Returns the plain name if the syllables don't spell it.
 */
export function hyphenateName(dino: Pick<Dino, 'name' | 'syllables'>): string {
  const letters = (s: string) => s.replace(/[^a-z]/gi, '');
  if (letters(dino.syllables.join('')).toLowerCase() !== letters(dino.name).toLowerCase()) return dino.name;

  // Letter counts after which a syllable ends (except the last one).
  const breaks = new Set<number>();
  let count = 0;
  for (const syl of dino.syllables.slice(0, -1)) {
    count += letters(syl).length;
    breaks.add(count);
  }

  let out = '';
  let seen = 0;
  for (let i = 0; i < dino.name.length; i++) {
    const ch = dino.name[i];
    out += ch;
    if (/[a-z]/i.test(ch)) {
      seen += 1;
      // No hyphen right before a space: the space is already a break point.
      const next = dino.name[i + 1];
      if (breaks.has(seen) && next !== undefined && next !== ' ') out += SOFT_HYPHEN;
    }
  }
  return out;
}
