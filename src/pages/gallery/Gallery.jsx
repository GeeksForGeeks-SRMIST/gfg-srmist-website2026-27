import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageOff } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/primitives';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import { asset, cn } from '../../lib/utils';
import { FILTERS, GALLERY } from './gallery.data';
import './gallery.css';

// The "photo room": two rings of N panels curving round the viewer. The bottom ring is offset by half a
// panel and turns a little slower. Each slot shows photo seq[i] % count, so any number of photos fills it.
const N = 10;
const TOP = [0, 1, 3, 5, 2, 0, 4, 2, 5, 4];
const BOTTOM = [3, 5, 0, 4, 1, 2, 5, 3, 1, 2];
const SLOTS = [0, 1].flatMap((row) => Array.from({ length: N }, (_, i) => ({ row, i, a: (i * 360) / N + (row ? 180 / N : 0) })));
const speed = (row) => (row ? 0.72 : 1);

// Place every panel for the current turn (st.th); panels more than 78° off-centre are hidden
function paint(st, els) {
  const { H, G, R, C, P } = st;
  SLOTS.forEach((s, k) => {
    const el = els[k];
    if (!el) return;
    const a = s.a + st.th * speed(s.row);
    const off = ((((a + 180) % 360) + 360) % 360) - 180;
    const show = Math.abs(off) < 78;
    if (el.dataset.show !== String(show)) {
      el.dataset.show = String(show);
      el.style.visibility = show ? 'visible' : 'hidden';
    }
    if (show) {
      const y = ((s.row ? 1 : -1) * (H + G)) / 2;
      el.style.transform = `perspective(${P}px) translateZ(${P - C}px) rotateY(${a}deg) translate3d(0,${y}px,${-R}px)`;
    }
  });
}

// Full-screen viewer: photo, caption, Previous / count / Next / Close. Arrow keys step, Escape or the backdrop closes.
function Lightbox({ photos, index, onIndex, onClose }) {
  const ref = useRef(null);
  const isOpen = index !== null;
  useScrollLock(isOpen);
  useFocusTrap(ref, isOpen, { onEscape: onClose, initialFocus: '[data-close]' });
  const count = photos.length;
  const go = (d) => onIndex((((index + d) % count) + count) % count);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!isOpen) return null;
  const p = photos[index];
  return createPortal(
    <div ref={ref} className="pr-lb" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <img src={asset(p.src)} alt={p.caption} />
      <p className="pr-cap">{p.caption}</p>
      <div className="pr-lbbar">
        <button type="button" onClick={() => go(-1)}>Previous</button>
        <span aria-live="polite">{index + 1} of {count}</span>
        <button type="button" onClick={() => go(1)}>Next</button>
        <button type="button" data-close onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}

export default function Gallery() {
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [filter, setFilter] = useState('all');   // pill that is pressed
  const [shown, setShown] = useState('all');     // filter the room shows (switches once the veil is down)
  const [veil, setVeil] = useState(false);
  const [asGrid, setAsGrid] = useState(reduce);  // reduced motion starts on the flat grid
  const [open, setOpen] = useState(null);
  const [hintOff, setHintOff] = useState(false);

  const filters = FILTERS.filter((f) => f.id === 'all' || GALLERY.some((p) => p.category === f.id));
  const photos = useMemo(() => GALLERY.filter((p) => shown === 'all' || p.category === shown), [shown]);

  const stageRef = useRef(null);
  const els = useRef([]);
  const openRef = useRef(false);
  openRef.current = open !== null;
  // Mutable room state; changing it never re-renders
  const st = useRef({ th: 0, v: 0, moved: 0, drag: false, hover: false, seen: false, W: 380, H: 270, G: 14, R: 600, C: 150, P: 730 }).current;

  const pick = (id) => {
    if (id === filter) return;
    setFilter(id);
    if (reduce || asGrid) { setShown(id); st.th = 0; st.v = 0; return; }
    setVeil(true);
    setTimeout(() => { setShown(id); st.th = 0; st.v = 0; setVeil(false); }, 220);
  };

  // Sizing, dragging, inertia and the slow auto-turn (room view only)
  useEffect(() => {
    const stage = stageRef.current;
    if (asGrid || !stage) return undefined;
    const draw = () => paint(st, els.current);
    st.draw = draw;
    els.current.forEach((el) => { if (el) delete el.dataset.show; });

    const size = () => {
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      let W = Math.round(Math.max(250, Math.min(vw * 0.26, 430)));
      const H = Math.round(Math.min(W * 0.72, (vh - 40) / 2.5));
      W = Math.round(Math.min(W, H / 0.66));
      const G = Math.round(W * 0.04);
      const R = (W + G) / (2 * Math.tan(Math.PI / N));
      Object.assign(st, { W, H, G, R, C: R * 0.25, P: R * 1.22 });
      stage.style.setProperty('--W', `${W}px`);
      stage.style.setProperty('--H', `${H}px`);
      draw();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    // pause while the room is scrolled out of view
    let visible = true;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }) : null;
    io?.observe(stage);

    let sx = 0, lastx = 0, lastt = 0, pid = null;
    const seen = () => { if (!st.seen) { st.seen = true; setHintOff(true); } };
    const down = (e) => {
      if (e.button) return;
      st.drag = true; pid = e.pointerId; sx = lastx = e.clientX; lastt = performance.now(); st.moved = 0; st.v = 0;
      stage.classList.add('pr-drag');
    };
    const move = (e) => {
      if (!st.drag || e.pointerId !== pid) return;
      const dx = e.clientX - lastx;
      const now = performance.now();
      const deg = 180 / (Math.PI * ((st.P * st.R) / (st.R + st.C)));  // degrees per pixel at the front of the ring
      st.moved = Math.max(st.moved, Math.abs(e.clientX - sx));
      st.th -= dx * deg;
      st.v = Math.max(-1.6, Math.min(1.6, ((-dx * deg) / Math.max(1, now - lastt)) * 16));
      lastx = e.clientX; lastt = now;
      if (st.moved > 6) seen();
      draw();
    };
    const up = (e) => {
      if (!st.drag || e.pointerId !== pid) return;
      st.drag = false;
      stage.classList.remove('pr-drag');
    };
    const enter = (e) => { if (e.pointerType === 'mouse') st.hover = true; };
    const leave = () => { st.hover = false; };
    const key = (e) => {
      st.moved = 0;
      if (e.key === 'ArrowLeft') { st.v = -2.6; seen(); }
      if (e.key === 'ArrowRight') { st.v = 2.6; seen(); }
    };
    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    stage.addEventListener('pointerenter', enter);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('keydown', key);

    let raf;
    const tick = () => {
      if (visible && !st.drag && !openRef.current) {
        if (Math.abs(st.v) > 0.01) { st.th += st.v; st.v *= 0.92; draw(); }
        else if (!reduce && !st.hover) { st.th -= 0.035; draw(); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      stage.removeEventListener('pointerenter', enter);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('keydown', key);
    };
  }, [asGrid, reduce, st]);

  // New photos in the slots: put the panels back in place
  useEffect(() => { st.draw?.(); }, [photos, st]);

  return (
    <>
      <PageHeader label="// 06 — Gallery" title="gallery" subtitle="Late nights, demo days and everything in between. Step into the room and look around." />

      <section aria-label="Photo gallery" className="pb-24 pt-10 md:pt-14">
        {!GALLERY.length ? (
          <div className="container-site">
            <EmptyState icon={ImageOff} title="No photos here yet" hint="// add photos to GALLERY in gallery.data.js" />
          </div>
        ) : (
          <>
            <div className="container-site">
              <div className="pr-bar" role="group" aria-label="Filter photos">
                {filters.map((f) => (
                  <button key={f.id} type="button" className="pr-pill" aria-pressed={filter === f.id} onClick={() => pick(f.id)}>
                    {f.label}
                  </button>
                ))}
                <button type="button" className="pr-view" aria-pressed={asGrid} onClick={() => setAsGrid((g) => !g)}>
                  {asGrid ? 'Show as room' : 'Show as grid'}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">{photos.length} photo{photos.length === 1 ? '' : 's'}</p>
            </div>

            {asGrid ? (
              <div className="container-site">
                <div className="pr-grid">
                  {photos.map((p, i) => (
                    <button key={p.src} type="button" aria-label={`Open photo: ${p.caption}`} onClick={() => setOpen(i)}>
                      <img src={asset(p.src)} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div ref={stageRef} className="pr-stage" tabIndex={0} aria-label="Photo room. Use the left and right arrow keys to look around.">
                <div className="pr-ring">
                  {SLOTS.map((s, k) => {
                    const seq = s.row ? BOTTOM : TOP;
                    const idx = seq[s.i] % photos.length;
                    const p = photos[idx];
                    return (
                      <button
                        key={k}
                        ref={(el) => { els.current[k] = el; }}
                        type="button"
                        className="pr-panel"
                        aria-label={`Open photo: ${p.caption}`}
                        onClick={(e) => { if (st.moved > 6) { e.preventDefault(); return; } setOpen(idx); }}
                        onFocus={(e) => {
                          // keyboard focus turns the room so that panel faces the viewer
                          if (!e.currentTarget.matches(':focus-visible')) return;
                          st.th = -s.a / speed(s.row); st.v = 0; st.draw?.();
                        }}
                      >
                        <img src={asset(p.src)} alt="" draggable={false} decoding="async" />
                      </button>
                    );
                  })}
                </div>
                <div className="pr-shade" aria-hidden="true" />
                <div className={cn('pr-veil', veil && 'pr-veil--on')} aria-hidden="true" />
                <div className={cn('pr-hint', hintOff && 'pr-hint--off')} aria-hidden="true">Drag to look around</div>
              </div>
            )}
          </>
        )}
      </section>

      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
