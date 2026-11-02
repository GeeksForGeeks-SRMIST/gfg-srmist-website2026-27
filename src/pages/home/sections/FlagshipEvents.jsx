import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import Media from '../../../components/ui/Media';
import { SectionLabel, SectionTitle } from '../../../components/ui/primitives';
import { cn } from '../../../lib/utils';

// accent = the poster's main colour, used for the hover border and glow
const FLAGSHIP_EVENTS = [
  {
    title: 'Idea Quest',
    tag: 'Flagship',
    description: 'Our 24-hour overnight hackathon for business and startup ideas, sponsored by Corporate Gurukul.',
    chips: ['24 hours', 'Overnight', 'Startup ideas'],
    image: 'assets/events/idea-quest.webp',
    to: '/events#idea-quest',
    accent: '249,115,22',
  },
  {
    title: 'Ignisia',
    tag: 'Oct 2025',
    description: 'A full-day workshop at the GN Ramachandran Hall, with hands-on sessions, mentorship and certificates.',
    image: 'assets/events/ignisia-25.webp',
    to: '/events#ignisia-25',
    accent: '245,158,11',
  },
  {
    title: 'Java Verse',
    tag: 'Feb 2026',
    description: 'A hands-on Java workshop to sharpen your programming skills alongside fellow developers.',
    image: 'assets/events/java-verse.webp',
    to: '/events#java-verse',
    accent: '70,196,107',
  },
];

// Dark glass card; on hover it lifts and the border picks up the poster's colour
const cardBase =
  'group relative flex overflow-hidden rounded-[18px] border border-[#232826] bg-[#0c100e] ' +
  'transition-[translate,border-color,box-shadow] duration-400 ease-smooth hover:-translate-y-1 ' +
  'hover:border-[rgba(var(--accent),.55)] hover:shadow-[0_18px_50px_-22px_rgba(var(--accent),.6)] ' +
  'motion-reduce:hover:translate-none';

function Poster({ event, className }) {
  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-[12px] border border-white/5', className)}>
      <Media
        src={event.image}
        alt={`${event.title} poster`}
        label="Event poster coming soon"
        className="size-full object-cover object-top transition-transform duration-500 ease-smooth group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

const Index = ({ n, tag }) => (
  <p className="font-mono text-[11px] font-medium tracking-[.14em] uppercase text-green-bright">
    {String(n).padStart(2, '0')} / {tag}
  </p>
);

const ViewLink = ({ to }) => (
  <Link
    to={to}
    className="inline-flex min-h-10 items-center gap-2 font-mono text-[11px] font-medium tracking-[.14em] uppercase text-green-bright transition-colors after:absolute after:inset-0 hover:text-white"
  >
    View event <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

function FeaturedCard({ event }) {
  return (
    <article style={{ '--accent': event.accent }} className={cn(cardBase, 'flex-col gap-5 p-4 sm:p-5 md:flex-row lg:row-span-2')}>
      <Poster event={event} className="aspect-[4/5] md:aspect-auto md:w-[44%]" />
      <div className="flex min-w-0 flex-1 flex-col md:py-2">
        <Index n={1} tag={event.tag} />
        <h3 className="mt-4 font-display text-[clamp(32px,3.4vw,46px)] font-light leading-[1] tracking-[-.035em] text-display-light">{event.title}</h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{event.description}</p>
        {event.chips && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {event.chips.map((c) => (
              <li key={c} className="rounded-full border border-[#2c322f] px-3 py-1 font-mono text-[11px] text-text/80">{c}</li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-[#232826] pt-4 lg:mt-auto">
          <ViewLink to={event.to} />
        </div>
      </div>
    </article>
  );
}

function SmallCard({ event, n }) {
  return (
    <article style={{ '--accent': event.accent }} className={cn(cardBase, 'gap-4 p-3.5 sm:gap-5 sm:p-4')}>
      <Poster event={event} className="aspect-[4/5] w-[110px] sm:w-[150px]" />
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <Index n={n} tag={event.tag} />
        <h3 className="mt-3 font-display text-2xl leading-tight tracking-[-.02em] text-display-light">{event.title}</h3>
        <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-muted">{event.description}</p>
        <div className="mt-auto pt-2">
          <ViewLink to={event.to} />
        </div>
      </div>
    </article>
  );
}

export default function FlagshipEvents() {
  const [featured, ...rest] = FLAGSHIP_EVENTS;
  return (
    <section id="flagship-events" aria-labelledby="flagship-events-title" className="border-b border-line py-16 md:py-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>// 03 — Flagship events</SectionLabel>
            <SectionTitle id="flagship-events-title" className="max-w-3xl normal-case">
              Built to bring
              <br />
              ideas to life.
            </SectionTitle>
          </div>
          <Link
            to="/events"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-green-bright/30 px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-green-bright transition-colors hover:border-green-bright hover:bg-green/10"
          >
            View all events
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Bento: the flagship event large on the left, the other two stacked on the right */}
        <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-[1.15fr_1fr]">
          <FeaturedCard event={featured} />
          {rest.map((event, i) => (
            <SmallCard key={event.title} event={event} n={i + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
