import { useEffect, useRef, useState } from 'react';

export default function useInView({ threshold = 0.12, rootMargin = '0px 0px -8% 0px', skip = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(skip);

  useEffect(() => {
    if (skip) { setInView(true); return undefined; }
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, skip]);

  return [ref, inView];
}
