import { useState } from 'react';
import type { Dino } from '../data/types';
import { PLACEHOLDER_ART, dinoArt } from '../lib/registry';

/** Dino SVG from /dinos/<id>.svg, falling back to the placeholder if missing. */
export function DinoArt({
  dino,
  className,
  decorative = false,
}: {
  dino: Dino;
  className?: string;
  /** Set when a parent control already carries the dino's name (avoids a doubled label). */
  decorative?: boolean;
}) {
  const [failedId, setFailedId] = useState<string | null>(null);
  const src = failedId === dino.id ? PLACEHOLDER_ART : dinoArt(dino.id);
  return (
    <img
      className={className}
      src={src}
      alt={decorative ? '' : dino.name}
      draggable={false}
      onError={() => {
        if (failedId !== dino.id) setFailedId(dino.id);
      }}
    />
  );
}

export default DinoArt;
