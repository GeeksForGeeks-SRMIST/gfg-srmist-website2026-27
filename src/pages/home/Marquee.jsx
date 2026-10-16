import { CONFIG } from '../../config';

export default function Marquee() {
  const items = CONFIG.upcomingTicker?.filter(Boolean).length ? CONFIG.upcomingTicker.filter(Boolean) : ['Stay tuned'];
  // Repeat so one half is always wider than the screen; two identical halves loop seamlessly.
  const half = Array.from({ length: items.length > 3 ? 2 : 4 }, () => ['Upcoming', ...items]).flat();

  const Group = ({ hidden }) => (
    <ul className="flex flex-none items-center" aria-hidden={hidden || undefined}>
      {half.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-[22px] font-mono text-[13px] font-medium tracking-[.14em] uppercase ${t === 'Upcoming' ? 'text-muted' : 'text-text'}`}>
            {t}
          </span>
          <span aria-hidden="true" className="px-[22px] text-green-bright [text-shadow:0_0_10px_rgba(70,196,107,.45)]">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div role="region" aria-label="Upcoming events" className="group relative border-y border-line bg-bg">
      <div className="flex h-14 items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:no-scrollbar">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <Group />
          <Group hidden />
        </div>
      </div>
    </div>
  );
}
