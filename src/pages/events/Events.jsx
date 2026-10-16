import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ArrowUpRight, CalendarX, MapPin } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import Reveal from '../../components/ui/Reveal';
import Media from '../../components/ui/Media';
import Button from '../../components/ui/Button';
import { Badge, EmptyState, GlassCard } from '../../components/ui/primitives';
import { formatDate } from '../../lib/utils';
import { PAST_EVENTS, UPCOMING_EVENTS } from './events.data';

function UpcomingCard({ ev }) {
  return (
    <GlassCard as="article" className="grid gap-2 p-3.5 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-10 md:p-5">
      <div className="relative overflow-hidden rounded-[10px]">
        <Media src={ev.image} alt={`${ev.title} poster`} label="Poster coming soon" className="aspect-[16/10] md:aspect-[4/5] md:h-full" />
        <Badge variant="upcoming" className="absolute left-3.5 top-3.5">Upcoming</Badge>
      </div>
      <div className="flex flex-col items-start px-2 pb-2.5 pt-4 md:py-4 md:pl-0 md:pr-4">
        <p className="font-mono text-[13px] font-medium leading-none tracking-[.12em] uppercase text-green-bright">
          <time dateTime={ev.date}>{formatDate(ev.date)}</time>
          {ev.time && <> <span aria-hidden="true">·</span> {ev.time}</>}
        </p>
        <h2 className="mt-4.5 font-display text-[clamp(34px,4.4vw,60px)] font-light leading-[.95] tracking-[-.045em] text-display-light">{ev.title}</h2>
        {ev.venue && (
          <p className="mt-4.5 inline-flex items-center gap-2 text-[15px]">
            <MapPin className="size-4 text-green-bright" aria-hidden="true" />
            {ev.venue}
          </p>
        )}
        <p className="mt-3.5 max-w-[560px] text-muted">{ev.description}</p>
        <div className="mt-auto pt-7">
          <Button href={ev.registerUrl || '#'}>
            Register <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function PastCard({ ev }) {
  return (
    <GlassCard as="article" className="group overflow-hidden">
      <div className="overflow-hidden rounded-t-card">
        <Media
          src={ev.image}
          alt={`${ev.title} poster`}
          label="Recap photo"
          className="aspect-[16/10] transition-transform duration-600 ease-smooth group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="px-5 pb-5.5 pt-5">
        <p className="font-mono text-xs font-medium leading-none tracking-[.12em] uppercase text-muted">
          <time dateTime={ev.date}>{formatDate(ev.date)}</time>
        </p>
        <h2 className="mt-3 font-display text-xl font-semibold leading-tight tracking-[-.02em]">{ev.title}</h2>
        <a href={ev.recapUrl || '#'} className="group/link mt-1.5 inline-flex min-h-11 items-center gap-1.5 font-ui text-xs font-bold tracking-[.12em] uppercase text-green-bright">
          View recap <span aria-hidden="true" className="transition-transform group-hover/link:translate-x-1">→</span>
        </a>
      </div>
    </GlassCard>
  );
}

export default function Events() {
  const { hash } = useLocation();
  const [tab, setTab] = useState(hash === '#past' ? 'past' : 'upcoming');
  useEffect(() => { if (hash === '#past') setTab('past'); }, [hash]);

  return (
    <>
      <PageHeader
        label="// 02 — Events"
        title="events"
        subtitle="Workshops, hackathons, contests and talks — what's coming up next and what we've already shipped."
      />

      <section aria-label="Events list" className="pb-30 pt-18">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Tabs
              label="Event timeline"
              idPrefix="ev"
              value={tab}
              onChange={setTab}
              items={[
                { id: 'upcoming', label: 'Upcoming', count: UPCOMING_EVENTS.length },
                { id: 'past', label: 'Past', count: PAST_EVENTS.length },
              ]}
            />
            <p className="font-mono text-xs tracking-[.12em] uppercase text-muted">// times in IST</p>
          </div>

          <div role="tabpanel" id="ev-panel-upcoming" aria-labelledby="ev-tab-upcoming" tabIndex={0} hidden={tab !== 'upcoming'} className="grid gap-7 focus-visible:outline-offset-8">
            {UPCOMING_EVENTS.length ? (
              UPCOMING_EVENTS.map((ev, i) => (
                <Reveal key={ev.title + ev.date} delay={i * 90}><UpcomingCard ev={ev} /></Reveal>
              ))
            ) : (
              <EmptyState icon={CalendarX} title="No upcoming events yet" hint="// something is compiling — check back soon" />
            )}
          </div>

          <div role="tabpanel" id="ev-panel-past" aria-labelledby="ev-tab-past" tabIndex={0} hidden={tab !== 'past'} className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-6 focus-visible:outline-offset-8">
            {PAST_EVENTS.length ? (
              PAST_EVENTS.map((ev, i) => (
                <Reveal key={ev.title + ev.date} delay={(i % 3) * 80}><PastCard ev={ev} /></Reveal>
              ))
            ) : (
              <EmptyState icon={CalendarX} title="No past events yet" hint="// history starts with the first commit" />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
