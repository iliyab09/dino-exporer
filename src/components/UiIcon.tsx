import './UiIcon.css';

/** Pixel's UI art from public/ui/<name>.svg, sized to the surrounding font. Decorative. */
export type UiIconName =
  | 'sticker-book'
  | 'star'
  | 'star-empty'
  | 'badge-level-1'
  | 'badge-level-2'
  | 'badge-level-3'
  | 'levelup-burst'
  | 'hero-trex-blink';

export function UiIcon({ name, className }: { name: UiIconName; className?: string }) {
  return (
    <img
      className={`ui-icon ${className ?? ''}`}
      src={`${import.meta.env.BASE_URL}ui/${name}.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

export default UiIcon;
