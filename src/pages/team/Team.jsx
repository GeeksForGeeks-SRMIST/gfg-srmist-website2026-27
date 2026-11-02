import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Tabs from '../../components/ui/Tabs';
import { EmptyState, SectionLabel, SectionTitle } from '../../components/ui/primitives';
import { asset, cn } from '../../lib/utils';
import { ASSOCIATE_LEADS, CORE_TEAM, DOMAIN_LEADS, FACULTY, MEMBERS, TEAM_DOMAINS } from './team.data';

const initials = (name) =>
  String(name || '?')
    .replace(/^(dr|prof|mr|ms|mrs)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const bracket = 'absolute size-4 border-green-bright/70 transition-all duration-500 group-hover/card:size-5 group-hover/card:border-green-bright';

// Front: full-bleed photo as it is, HUD corner brackets, jersey number, name + role over a gradient
function CardFront({ person, index }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative isolate aspect-[3/4] overflow-hidden rounded-card border border-green-bright/20 bg-bg-2 shadow-[0_18px_40px_-24px_rgba(70,196,107,.45)] backface-hidden transition-colors duration-500 group-hover/card:border-green-bright/60">
      {person.photo && !failed ? (
        <img
          src={asset(person.photo)}
          alt={`Photo of ${person.name}`}
          loading="lazy"
          decoding="async"
          width="480"
          height="640"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover/card:scale-[1.06]"
        />
      ) : (
        <div role="img" aria-label={`${person.name} (photo coming soon)`} className="absolute inset-0 grid place-items-center bg-[radial-gradient(70%_60%_at_30%_20%,rgba(70,196,107,.16),transparent_70%),repeating-linear-gradient(135deg,rgba(255,255,255,.03)_0_1px,transparent_1px_12px)] pb-12">
          <span aria-hidden="true" className="font-display text-[clamp(40px,4.5vw,56px)] font-light tracking-[-.04em] text-muted">{initials(person.name)}</span>
        </div>
      )}
      {/* Photos are shown as they are; only a neutral dark fade at the bottom keeps the name readable */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-black/85 via-black/35 to-transparent" />

      <span aria-hidden="true" className={`${bracket} left-2.5 top-2.5 rounded-tl-[3px] border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${bracket} bottom-2.5 right-2.5 rounded-br-[3px] border-b-2 border-r-2`} />
      <span aria-hidden="true" className="absolute left-5 top-4 rounded-full bg-black/55 px-1.5 py-px font-mono text-[10px] font-medium tracking-[.14em] text-white/90 backdrop-blur-sm">
        #{String(index + 1).padStart(2, '0')}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3.5 pr-8">
        <h3 className="font-display text-[15px] font-semibold leading-tight tracking-[-.02em] text-white sm:text-[17px]">{person.name}</h3>
        <p className="mt-1 font-mono text-[10px] font-medium leading-snug tracking-[.1em] uppercase text-green-bright sm:text-[11px]">{person.role}</p>
      </div>
    </div>
  );
}

// Back (shown on hover): plain black with a thin white border, a big quote mark, the quote and a signature line.
// Faculty cards show their designation and department instead.
function CardBack({ person }) {
  const isFaculty = Boolean(person.designation);
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-card border border-white/70 bg-black p-4 rotate-y-180 backface-hidden sm:p-5">
      <span
        aria-hidden="true"
        className="relative -mb-4 -ml-1 block font-[Georgia,serif] text-[72px] leading-none text-green-bright sm:text-[84px]"
      >
        {isFaculty ? '' : '“'}
      </span>

      {isFaculty ? (
        <div className="relative my-auto">
          <span className="font-mono text-[9px] font-medium tracking-[.16em] uppercase text-muted sm:text-[10px]">// faculty</span>
          <p className="mt-2 font-display text-[17px] font-light leading-snug tracking-[-.01em] text-display-light sm:text-[20px]">{person.designation}</p>
          {person.department && <p className="mt-2 text-[12.5px] leading-relaxed text-muted sm:text-[13px]">{person.department}</p>}
          <p className="mt-3 font-mono text-[10px] tracking-[.12em] uppercase text-green-bright">SRMIST</p>
        </div>
      ) : person.quote ? (
        <blockquote className="relative my-auto line-clamp-6 font-display text-[16px] font-normal leading-[1.35] tracking-[-.015em] text-white sm:text-[19px]">
          {person.quote}
        </blockquote>
      ) : (
        <p className="relative my-auto font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
          // quote still compiling…
          <br />
          <span className="text-green-bright">check back soon</span>
        </p>
      )}

      {/* signature */}
      <div aria-hidden="true" className="relative mt-3 flex items-center gap-2.5">
        {person.photo ? (
          <img src={asset(person.photo)} alt="" loading="lazy" decoding="async" width="32" height="32" className="size-8 shrink-0 rounded-full object-cover object-top ring-2 ring-green-bright/60" />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-green/20 font-display text-[11px] text-green-bright ring-2 ring-green-bright/60">{initials(person.name)}</span>
        )}
        <div className="min-w-0">
          <p className="line-clamp-2 font-display text-[12.5px] font-semibold leading-tight text-white/90 sm:text-[13.5px]">— {person.name}</p>
          <p className="mt-0.5 truncate font-mono text-[9px] tracking-[.1em] uppercase text-green-bright sm:text-[10px]">{person.role}</p>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ person, index }) {
  const [flipped, setFlipped] = useState(false);  // tap-to-flip on touch screens, where there is no hover

  // Every card flips on hover (or tap / keyboard focus) to its quote.
  // The article itself never moves, so its hover area stays steady while the inner card lifts and flips.
  return (
    <article
      tabIndex={0}
      onPointerUp={(e) => { if (e.pointerType !== 'mouse') setFlipped((f) => !f); }}
      onBlur={() => setFlipped(false)}
      className="group/card relative rounded-card perspective-[900px]"
    >
      <div
        className={cn(
          'relative rounded-card transition-[transform,translate] duration-700 ease-out-expo transform-3d motion-reduce:transition-none',
          'group-hover/card:-translate-y-1.5 group-hover/card:rotate-y-180 group-focus-visible/card:rotate-y-180',
          flipped && 'rotate-y-180',
        )}
      >
        <CardFront person={person} index={index} />
        <CardBack person={person} />
      </div>
    </article>
  );
}

function Group({ id, label, title, people, small, byDomain, emptyWhat, startDomain }) {
  const [domain, setDomain] = useState(startDomain || TEAM_DOMAINS[0].id);

  const list = (group, what) =>
    !group.length ? (
      <EmptyState icon={Users} title={`No ${what} added yet`} hint="// add people to the array in team.data.js" />
    ) : (
      <div className={cn('grid grid-cols-2 gap-3 sm:gap-4', small ? 'sm:grid-cols-[repeat(auto-fill,minmax(170px,190px))]' : 'sm:grid-cols-[repeat(auto-fill,minmax(190px,220px))]')}>
        {group.map((p, i) => (
          <Reveal key={`${p.name}-${i}`} delay={(i % 5) * 60}><ProfileCard person={p} index={i} /></Reveal>
        ))}
      </div>
    );

  return (
    <section aria-labelledby={id} className="pt-18 last:pb-30 md:pt-24">
      <div className="container-site">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <SectionLabel>{label}</SectionLabel>
            <SectionTitle id={id}>{title}</SectionTitle>
          </div>
          {byDomain && (
            <Tabs
              label={`Filter ${title} by domain`}
              idPrefix={id}
              value={domain}
              onChange={setDomain}
              items={TEAM_DOMAINS.map((d) => ({ ...d, count: people.filter((p) => p.domain === d.id).length }))}
              className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto"
              itemClassName="justify-center px-2 text-[11px] sm:px-[22px] sm:text-[13px] [&>span]:hidden sm:[&>span]:inline"
            />
          )}
        </div>
        {byDomain
          ? TEAM_DOMAINS.map((d) => (
              <div key={d.id} role="tabpanel" id={`${id}-panel-${d.id}`} aria-labelledby={`${id}-tab-${d.id}`} tabIndex={0} hidden={domain !== d.id} className="focus-visible:outline-offset-8">
                {list(people.filter((p) => p.domain === d.id), `${d.label.toLowerCase()} ${emptyWhat}`)}
              </div>
            ))
          : list(people, emptyWhat)}
      </div>
    </section>
  );
}

export default function Team() {
  // /team?domain=technical#tm-leads (from the Domains page): open that domain's tabs and jump to its leads
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const asked = params.get('domain');
  const startDomain = TEAM_DOMAINS.some((d) => d.id === asked) ? asked : undefined;

  useEffect(() => {
    if (!hash) return undefined;
    const raf = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.closest('section')?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(raf);
  }, [hash, asked]);

  return (
    <>
      <PageHeader label="// 03 — Team" title="team" subtitle="The people who plan the events, run the domains and keep the club shipping." />
      <Group id="tm-faculty" label="// Faculty" title="guiding us" people={FACULTY} emptyWhat="faculty" />
      <Group id="tm-core" label="// Core team" title="core team" people={CORE_TEAM} emptyWhat="core team members" />
      <Group id="tm-leads" label="// Domain leads" title="domain leads" people={DOMAIN_LEADS} byDomain startDomain={startDomain} key={`${startDomain}`} emptyWhat="domain leads" />
      <Group id="tm-associates" label="// Associate leads" title="associate leads" people={ASSOCIATE_LEADS} byDomain startDomain={startDomain} key={`${startDomain}`} emptyWhat="associate leads" />
      <Group id="tm-members" label="// Members" title="members" people={MEMBERS} small byDomain startDomain={startDomain} key={`${startDomain}`} emptyWhat="members" />
    </>
  );
}
