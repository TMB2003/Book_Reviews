export default function RatingStars({ value = 0 }) {
  const full = Math.round(value);
  return (
    <span aria-label={`rating ${value}`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= full ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
      <small style={{ marginLeft: 6, color: 'var(--muted)' }}>{value?.toFixed ? value.toFixed(1) : value}</small>
    </span>
  );
}
