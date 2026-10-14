import { useState } from 'react';
import { PLACEHOLDER_URL, dinoImageUrl } from './util';

/** Dino SVG that falls back to the placeholder if the art is missing. */
export default function DinoImage({ id, className }: { id: string; className?: string }) {
  const [failedId, setFailedId] = useState<string | null>(null);
  const src = failedId === id ? PLACEHOLDER_URL : dinoImageUrl(id);
  return (
    <img
      className={className}
      src={src}
      alt=""
      draggable={false}
      onError={() => setFailedId(id)}
    />
  );
}
