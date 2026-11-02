import { useEffect, useState } from 'react';
import { asset, cn } from '../../../lib/utils';
import useReducedMotion from '../../../hooks/useReducedMotion';

const STEP = 4500;   // ms each panel stays open while auto-playing

// Tall photo panels side by side: the open one is wide, the others fold into slim strips.
// Hover, focus or tap a strip to open it; it also moves on by itself until the pointer is over it.
// `onChange(index)` reports which panel is open.
export default function DomainPanels({ panels, onChange }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { onChange?.(active); }, [active]);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (reduced || paused) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % panels.length), STEP);
    return () => clearTimeout(t);
  }, [active, reduced, paused, panels.length]);

  return (
    <div
      className="flex h-[clamp(380px,36vw,470px)] w-full gap-2 md:gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {panels.map((p, i) => {
        const on = i === active;
        const Icon = p.icon;
        return (
          <button
            key={p.name}
            type="button"
            aria-pressed={on}
            aria-label={`${p.name} domain`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            style={{ flexBasis: 0 }}
            className={cn(
              'group relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] border text-left',
              'transition-[flex-grow,border-color,box-shadow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-bright',
              on
                ? 'grow-[5] border-green-bright/45 shadow-[0_26px_60px_-28px_rgba(70,196,107,.55)]'
                : 'grow border-white/10 hover:border-white/30',
            )}
          >
            <img
              src={asset(p.src)}
              alt=""
              draggable="false"
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 size-full object-cover transition-[transform,filter] duration-700 ease-out motion-reduce:transition-none',
                on ? 'scale-100' : 'scale-110 brightness-[.45] grayscale',
              )}
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.15)_0%,transparent_35%,rgba(0,0,0,.85)_100%)]" />

            <span aria-hidden="true" className="absolute left-4 top-4 font-mono text-[11px] tracking-[.16em] text-white/75">
              0{i + 1}
            </span>

            {/* folded strip: the name, written upwards */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute bottom-6 left-1/2 -translate-x-1/2 rotate-180 font-display text-lg font-semibold tracking-[-.01em] whitespace-nowrap text-white/85 [writing-mode:vertical-rl]',
                'transition-opacity duration-300',
                on ? 'opacity-0' : 'opacity-100',
              )}
            >
              {p.name}
            </span>

            {/* open panel: icon, name and tagline */}
            <span
              className={cn(
                'absolute inset-x-5 bottom-6 block transition-[opacity,translate] duration-500 md:inset-x-6',
                on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-3 opacity-0',
              )}
            >
              <span className="mb-3 grid size-10 place-items-center rounded-xl bg-green-bright/90 text-black shadow-[0_0_24px_rgba(70,196,107,.5)]">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="block whitespace-nowrap font-display text-3xl font-semibold leading-none tracking-[-.03em] text-white md:text-4xl">{p.name}</span>
              <span className="mt-2 block text-sm leading-snug text-white/75 md:text-[15px]">{p.text}</span>
            </span>

            {/* auto-play progress */}
            {on && !paused && !reduced && (
              <span
                key={active}
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[3px] bg-green-bright shadow-[0_0_10px_var(--color-green-bright,#46c46b)]"
                style={{ animation: `domain-progress ${STEP}ms linear forwards` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
