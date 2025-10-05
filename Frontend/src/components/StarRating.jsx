import { useMemo } from 'react';

export default function StarRating({ value = 0, onChange }) {
  const stars = useMemo(() => [1,2,3,4,5], []);
  const handle = (n) => {
    if (onChange) onChange(n);
  };
  return (
    <div role="radiogroup" aria-label="rating" style={{ display: 'inline-flex', gap: 4 }}>
      {stars.map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={n === value}
          onClick={() => handle(n)}
          style={{
            cursor: 'pointer',
            background: 'transparent',
            border: 0,
            color: n <= value ? '#f59e0b' : '#d1d5db',
            fontSize: 22,
            lineHeight: 1,
            padding: 2,
          }}
          aria-label={`${n} star${n>1?'s':''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
