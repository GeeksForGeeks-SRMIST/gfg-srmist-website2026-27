import { useEffect } from 'react';

let locks = 0;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    if (locks === 0) root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`);
    locks += 1;
    root.classList.add('is-locked');
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) root.classList.remove('is-locked');
    };
  }, [active]);
}
