
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router';
import Media from '../../../components/ui/Media';
import {
  GlassCard,
  SectionLabel,
  SectionTitle,
} from '../../../components/ui/primitives';

const FLAGSHIP_EVENTS = [
  {
    title: 'Ideathon',
    description:
      'Our flagship 24-hour hackathon. Form a team, choose a track, and turn an idea into something real.',
    image: 'assets/events/ideathon.jpg',
    imageAlt: 'Ideathon event',
  },
  {
    title: 'Ignisia',
    description:
      'Discover the event, meet the community, and explore what is happening at GFG SRMIST.',
    image: '',
    imageAlt: 'Ignisia event poster',
  },
  {
    title: 'Java verse',
    description:
      'Explore Java, strengthen your programming skills, and connect with fellow developers.',
    image: '',
    imageAlt: 'Java verse event poster',
  },
];

export default function FlagshipEvents() {
  return (
    <section
      id="flagship-events"
      aria-labelledby="flagship-events-title"
      className="border-b border-line py-20 md:py-30"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>// 03 — Flagship events</SectionLabel>
            <SectionTitle
              id="flagship-events-title"
              className="max-w-3xl normal-case"
            >
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

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">
          {FLAGSHIP_EVENTS.map((event, index) => (
            <GlassCard
              key={event.title}
              as="article"
              className="overflow-hidden"
            >
              <Media
                src={event.image}
                alt={event.imageAlt}
                label="Event poster coming soon"
                className="aspect-[16/10]"
              />

              <div className="flex min-h-56 flex-col p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.12em] text-muted">
                    0{index + 1} / FEATURED
                  </span>
                  <CalendarDays
                    size={17}
                    className="text-green-bright"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 font-display text-3xl normal-case text-display-light">
                  {event.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                  {event.description}
                </p>

                <Link
                  to="/events"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-green-bright transition-colors hover:text-white"
                >
                  Explore events
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
