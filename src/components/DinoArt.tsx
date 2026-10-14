import { useState } from 'react';
import type { Dino } from '../data/types';
import { PLACEHOLDER_ART, dinoArt } from '../lib/registry';

/** Dino SVG from /dinos/<id>.svg, falling back to the placeholder if missing. */
export function DinoArt({ dino, className }: { dino: Dino; className?: string }) {
  const [failedId, setFailedId] = useState<string | null>(null);
  const src = failedId === dino.id ? PLACEHOLDER_ART : dinoArt(dino.id);
  return (
    <img
      className={className}
      src={src}
      alt={dino.name}
      draggable={false}
      onError={() => {
        if (failedId !== dino.id) setFailedId(dino.id);
      }}
    />
  );
}

export default DinoArt;
