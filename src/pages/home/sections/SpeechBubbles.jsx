import { asset, cn } from '../../../lib/utils';

// Bubble colour, text colour, tilt and vertical offset, used in turn for each quote
const STYLES = [
  { bg: '#7ee2a8', ink: '#06351f', tilt: '-1.5deg', offset: 'md:mt-0' },
  { bg: '#f6d860', ink: '#3d2c00', tilt: '1deg', offset: 'md:mt-[30px]' },
  { bg: '#ff9d7a', ink: '#4a1505', tilt: '-.75deg', offset: 'md:mt-[10px]' },
];

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

// Colourful speech bubbles: each quote sits in a tilted bubble with a tail, the speaker below it.
// On hover the bubble straightens and lifts.
export default function SpeechBubbles({ people }) {
  if (!people.length) return null;
  return (
    <div className="mt-8 grid items-start gap-x-4 gap-y-8 md:grid-cols-3">
      {people.map((person, i) => {
        const s = STYLES[i % STYLES.length];
        return (
          <figure key={`${person.name}-${i}`} className={cn('group', s.offset)} style={{ '--c': s.bg }}>
            <blockquote
              className="relative flex min-h-[176px] flex-col rounded-[22px] px-4 pb-5 pt-3.5 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] [transform:rotate(var(--tilt))] group-hover:[transform:rotate(0deg)_translateY(-5px)] motion-reduce:transition-none after:absolute after:-bottom-[15px] after:left-[26px] after:border-r-[22px] after:border-t-[16px] after:border-r-transparent after:border-t-[var(--c)] after:content-['']"
              style={{ background: s.bg, color: s.ink, '--tilt': s.tilt }}
            >
              <span aria-hidden="true" className="h-[30px] font-serif text-[50px] leading-[.9] opacity-45">“</span>
              <p className="mt-1.5 font-display text-[clamp(19px,1.6vw,22px)] font-medium leading-[1.14] tracking-[-.025em]">{person.quote}</p>
            </blockquote>
            <figcaption className="ml-3 mt-6 flex items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--c)] bg-[#171c19] font-mono text-[11px] text-[#8d9591]">
                {person.photo ? <img src={asset(person.photo)} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" /> : initials(person.name)}
              </span>
              <span className="font-mono text-[11px] uppercase leading-snug tracking-[.03em]">
                <span className="block text-[#f1f3f2]">{person.name}</span>
                <span className="mt-0.5 block text-[var(--c)]">{person.role}</span>
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
