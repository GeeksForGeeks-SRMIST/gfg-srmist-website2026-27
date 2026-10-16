import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';

export default function useFocusTrap(refs, active, { onEscape, initialFocus } = {}) {
  const opener = useRef(null);
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const containers = () => (Array.isArray(refs) ? refs : [refs]).map((r) => r.current).filter(Boolean);
    opener.current = document.activeElement;

    const raf = requestAnimationFrame(() => {
      const [first] = containers();
      const target =
        (initialFocus && first?.querySelector(initialFocus)) ||
        containers().flatMap((c) => [...c.querySelectorAll(FOCUSABLE)]).find(visible) ||
        first;
      target?.focus({ preventScroll: true });
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        escRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = containers().flatMap((c) => [...c.querySelectorAll(FOCUSABLE)]).filter(visible);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const inside = containers().some((c) => c.contains(document.activeElement));
      if (!inside) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      const el = opener.current;
      if (el && document.contains(el)) el.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
