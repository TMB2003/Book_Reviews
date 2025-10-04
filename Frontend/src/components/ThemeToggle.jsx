import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button className="btn" onClick={() => setDark(v => !v)}>{dark ? 'Light' : 'Dark'}</button>
  );
}
