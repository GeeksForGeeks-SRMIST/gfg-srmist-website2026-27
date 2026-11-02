import { useEffect, useRef, useState } from 'react';
import { asset, cn } from '../../../lib/utils';
import useReducedMotion from '../../../hooks/useReducedMotion';

export const ABOUT_PHOTOS = [
  { title: 'build', text: '24 hours, one idea, not much sleep.', src: 'assets/gallery/workshop-01.webp', alt: 'Sticky-note idea wall from a GfG SRMIST workshop' },
  { title: 'collaborate', text: 'Better ideas start with good people.', src: 'assets/gallery/fun-02.webp', alt: 'The GfG SRMIST crew smiling after a session' },
  { title: 'grow', text: 'Learn it here, use it everywhere.', src: 'assets/gallery/event-03.webp', alt: 'Felicitation at the Java Verse workshop' },
];

// All polaroids use the same white frame
const FRAME = { bg: '#f4f1ea', title: '#1c1f1d', text: '#4b504d' };

// Resting spot of each card in the pile: [rotation deg, x px, y px] for top, middle, bottom
const PILE = [[-3, 0, 0], [5, 20, 6], [-7, -20, 12]];

// A stack of polaroids. Click or drag the top one (or press Enter on it) to send it to the back.
// `photos` defaults to the About photos; `onTopChange(index)` reports which photo is on top.
export default function PolaroidStack({ photos = ABOUT_PHOTOS, onTopChange }) {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(() => photos.map((_, i) => i));   // order[0] is the card on top
  const [dragX, setDragX] = useState(null);         // live drag offset of the top card
  const [flying, setFlying] = useState(0);          // -1 / 1 while the top card is thrown off
  const start = useRef(null);
  useEffect(() => { onTopChange?.(order[0]); }, [order]);   // eslint-disable-line react-hooks/exhaustive-deps
  const moved = useRef(0);                          // drag distance, read on release (state may lag a frame)

  const advance = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
  };
  const next = (dir = 1) => {
    if (flying) return;
    if (reduced) { advance(); return; }
    setFlying(dir);
    setTimeout(() => { advance(); setFlying(0); }, 230);
  };

  const onDown = (e, isTop) => {
    if (!isTop || flying) return;
    start.current = e.clientX;
    moved.current = 0;
    setDragX(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (start.current === null) return;
    moved.current = e.clientX - start.current;
    setDragX(moved.current);
  };
  const onUp = () => {
    if (start.current === null) return;
    const d = moved.current;
    start.current = null;
    setDragX(null);
    if (Math.abs(d) > 50 || Math.abs(d) < 4) next(d < 0 ? -1 : 1);   // a real drag, or just a click
  };

  return (
    <div className="relative mx-auto h-[clamp(430px,38vw,480px)] w-full max-w-[500px] touch-pan-y" style={{ '--w': 'min(370px, 82vw)' }}>
      {photos.map((p, i) => {
        const pos = order.indexOf(i);
        const top = pos === 0;
        const frame = FRAME;
        let transform;
        if (top && flying) transform = `translate(${flying * 360}px,-10px) rotate(${flying * 16}deg)`;
        else if (top && dragX !== null) transform = `translate(${dragX}px,0) rotate(${-3 + dragX / 18}deg)`;
        else transform = `translate(${PILE[pos][1]}px,${PILE[pos][2]}px) rotate(${PILE[pos][0]}deg)`;
        return (
          <figure
            key={p.title}
            aria-hidden={!top}
            tabIndex={top ? 0 : -1}
            role={top ? 'button' : undefined}
            aria-label={top ? `${p.title}: ${p.text} Press to see the next photo.` : undefined}
            onKeyDown={(e) => { if (top && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); next(1); } }}
            onPointerDown={(e) => onDown(e, top)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => { start.current = null; setDragX(null); }}
            className={cn(
              'absolute left-1/2 top-2 select-none rounded-[3px] p-3.5 pb-5 shadow-[0_22px_45px_-18px_rgba(0,0,0,.85),0_2px_6px_rgba(0,0,0,.4)]',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-bright',
              top ? 'cursor-grab active:cursor-grabbing' : '',
              dragX !== null && top ? '' : 'transition-[transform,opacity,background-color] duration-400 ease-[cubic-bezier(.3,1.3,.5,1)] motion-reduce:transition-none',
            )}
            style={{ width: 'var(--w)', marginLeft: 'calc(var(--w) / -2)', zIndex: 3 - pos, transform, opacity: top && flying ? 0.15 : 1, background: frame.bg }}
          >
            <img
              src={asset(p.src)}
              alt={p.alt}
              draggable="false"
              loading="lazy"
              decoding="async"
              className="aspect-[1.24] w-full rounded-[2px] object-cover"
            />
            <figcaption>
              <span className="mt-3 block font-[Caveat,cursive] text-[46px] font-medium leading-none" style={{ color: frame.title }}>{p.title}</span>
              <span className="mt-1 block text-[15px] leading-snug" style={{ color: frame.text }}>{p.text}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
