import { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';

export default function CountUp({ value, suffix = '', duration = 1600, delay = 0, run, className }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.4 });
  const active = run === undefined ? inView : run;
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) { setN(value); return undefined; }
    let raf = 0;
    setN(0);
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [active, value, duration, delay, reduced]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{n.toLocaleString('en-IN')}{suffix}</span>
      <span className="sr-only">{value}{suffix}</span>
    </span>
  );
}
