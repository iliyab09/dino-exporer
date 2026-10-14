import './Stars.css';

/** Row of 3 stars, `count` of them lit. */
export function Stars({ count, size = 'md', pop = false }: { count: number; size?: 'sm' | 'md' | 'lg'; pop?: boolean }) {
  return (
    <span className={`stars stars--${size} ${pop ? 'stars--pop' : ''}`} aria-label={`${count} of 3 stars`} role="img">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`stars__star ${i <= count ? 'stars__star--on' : ''}`} style={{ animationDelay: `${i * 220}ms` }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default Stars;
