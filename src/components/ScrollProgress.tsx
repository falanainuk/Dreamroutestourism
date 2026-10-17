import { useEffect, useState } from 'react';

/** Thin gold line at the very top that fills as the user scrolls */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 999,
        height: '2px',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #C8A96E, #E8D5A8, #C8A96E)',
        transition: 'width 0.08s linear',
        boxShadow: '0 0 10px rgba(200,169,110,0.7)',
        pointerEvents: 'none',
      }}
    />
  );
}
