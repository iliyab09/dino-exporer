import './UiIcon.css';

/** Pixel's UI art from public/ui/<name>.svg, sized to the surrounding font. Decorative. */
export function UiIcon({ name, className }: { name: 'sticker-book' | 'star' | 'star-empty'; className?: string }) {
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
