import { useState } from 'react';
import { Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Tabs from '../../components/ui/Tabs';
import { EmptyState, GlassCard, SectionLabel, SectionTitle } from '../../components/ui/primitives';
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

function Photo({ person, large }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-[10px] bg-bg-2',
        'before:absolute before:inset-0 before:z-[1] before:backdrop-grayscale before:transition-opacity before:duration-500 group-hover:before:opacity-0',
        'after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-400',
        'after:shadow-[inset_0_0_0_2px_var(--green-bright),inset_0_0_24px_-6px_rgba(70,196,107,.45)] group-hover:after:opacity-100',
        large && 'max-w-[320px] md:max-w-none',
      )}
    >
      {person.photo && !failed ? (
        <img src={asset(person.photo)} alt={`Photo of ${person.name}`} loading="lazy" decoding="async" width="480" height="480" onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        <div role="img" aria-label={`${person.name} (photo coming soon)`} className="grid size-full place-items-center bg-[radial-gradient(70%_60%_at_30%_20%,rgba(70,196,107,.16),transparent_70%),repeating-linear-gradient(135deg,rgba(255,255,255,.035)_0_1px,transparent_1px_12px)] bg-bg-2">
          <span aria-hidden="true" className="font-display text-[clamp(40px,5vw,64px)] font-light tracking-[-.04em] text-muted">{initials(person.name)}</span>
        </div>
      )}
    </div>
  );
}

const Role = ({ children }) => (
  <p className="mt-1.5 font-mono text-xs font-medium leading-snug tracking-[.08em] uppercase text-green-bright">{children}</p>
);

const bracket = 'absolute size-4 border-green-bright/70 transition-all duration-500 group-hover/card:size-5 group-hover/card:border-green-bright';

// Front: full-bleed photo (black & white until hover), HUD corner brackets, jersey number, name + role over a gradient
function CardFront({ person, index }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-white/10 bg-bg-2 backface-hidden transition-colors duration-500 group-hover/card:border-green-bright/60">
      {person.photo && !failed ? (
        <img
          src={asset(person.photo)}
          alt={`Photo of ${person.name}`}
          loading="lazy"
          decoding="async"
          width="480"
          height="640"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover object-top grayscale transition-[transform,filter] duration-700 ease-out-expo group-hover/card:scale-[1.06] group-hover/card:grayscale-0"
        />
      ) : (
        <div role="img" aria-label={`${person.name} (photo coming soon)`} className="absolute inset-0 grid place-items-center bg-[radial-gradient(70%_60%_at_30%_20%,rgba(70,196,107,.16),transparent_70%),repeating-linear-gradient(135deg,rgba(255,255,255,.03)_0_1px,transparent_1px_12px)] pb-12">
          <span aria-hidden="true" className="font-display text-[clamp(40px,4.5vw,56px)] font-light tracking-[-.04em] text-muted">{initials(person.name)}</span>
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black from-5% via-black/35 via-40% to-transparent to-70%" />

      <span aria-hidden="true" className={`${bracket} left-2.5 top-2.5 rounded-tl-[3px] border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${bracket} bottom-2.5 right-2.5 rounded-br-[3px] border-b-2 border-r-2`} />
      <span aria-hidden="true" className="absolute left-5 top-4 font-mono text-[10px] font-medium tracking-[.14em] text-white/85 [text-shadow:0_1px_6px_rgba(0,0,0,.9)]">
        #{String(index + 1).padStart(2, '0')}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3.5 pr-8">
        <h3 className="font-display text-[15px] font-semibold leading-tight tracking-[-.02em] text-white sm:text-[17px]">{person.name}</h3>
        <p className="mt-1 font-mono text-[10px] font-medium leading-snug tracking-[.1em] uppercase text-green-bright sm:text-[11px]">{person.role}</p>
      </div>
    </div>
  );
}

// Back (shown on hover): the quote, with a small avatar, name and role
function CardBack({ person }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-card border border-green-bright/50 bg-bg-2 bg-[radial-gradient(120%_70%_at_0%_0%,rgba(70,196,107,.22),transparent_60%),repeating-linear-gradient(135deg,rgba(255,255,255,.03)_0_1px,transparent_1px_12px)] p-3.5 shadow-[0_0_0_1px_rgba(70,196,107,.15),0_18px_50px_-14px_rgba(70,196,107,.55)] rotate-y-180 backface-hidden sm:p-4">
      <span className="font-mono text-[9px] font-medium tracking-[.16em] uppercase text-muted sm:text-[10px]">// in their words</span>
      {person.quote ? (
        <blockquote className="my-auto line-clamp-6 py-3 font-display text-[14px] font-light leading-snug tracking-[-.01em] text-display-light sm:text-[16px]">
          “{person.quote}”
        </blockquote>
      ) : (
        <p className="my-auto py-3 font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
          // quote still compiling…
          <br />
          <span className="text-green-bright">check back soon</span>
        </p>
      )}
      <div aria-hidden="true" className="flex items-center gap-2.5 border-t border-line pt-3">
        {person.photo ? (
          <img src={asset(person.photo)} alt="" loading="lazy" decoding="async" width="36" height="36" className="size-9 shrink-0 rounded-full object-cover object-top grayscale ring-2 ring-green-bright/60 ring-offset-2 ring-offset-bg-2" />
        ) : (
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-green/20 font-display text-xs text-green-bright ring-2 ring-green-bright/60">{initials(person.name)}</span>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-[13px] font-semibold leading-tight sm:text-[14px]">{person.name}</p>
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

function FacultyCard({ person }) {
  return (
    <GlassCard as="article" className="group grid items-center gap-5 p-3.5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-12 md:p-5">
      <Photo person={person} large />
      <div className="px-1.5 pb-2 md:py-3 md:pl-0 md:pr-6">
        <Role>{person.role}</Role>
        <h3 className="mt-4 font-display text-[clamp(36px,5vw,64px)] font-light leading-[.95] tracking-[-.045em] text-display-light">{person.name}</h3>
        {person.department && <p className="mt-3 text-muted">{person.department}</p>}
        {person.quote && <blockquote className="mt-7 max-w-[520px] border-l-2 border-green pl-4.5 text-lg leading-normal">“{person.quote}”</blockquote>}
      </div>
    </GlassCard>
  );
}

function Group({ id, label, title, people, small, faculty, byDomain, emptyWhat }) {
  const [domain, setDomain] = useState(TEAM_DOMAINS[0].id);

  const list = (group, what) =>
    !group.length ? (
      <EmptyState icon={Users} title={`No ${what} added yet`} hint="// add people to the array in team.data.js" />
    ) : faculty ? (
      group.map((p) => <Reveal key={p.name}><FacultyCard person={p} /></Reveal>)
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
  return (
    <>
      <PageHeader label="// 03 — Team" title="team" subtitle="The people who plan the events, run the domains and keep the club shipping." />
      <Group id="tm-faculty" label="// Faculty coordinator" title="guiding us" people={FACULTY} faculty emptyWhat="faculty coordinator" />
      <Group id="tm-core" label="// Core team" title="core team" people={CORE_TEAM} emptyWhat="core team members" />
      <Group id="tm-leads" label="// Domain leads" title="domain leads" people={DOMAIN_LEADS} byDomain emptyWhat="domain leads" />
      <Group id="tm-associates" label="// Associate leads" title="associate leads" people={ASSOCIATE_LEADS} byDomain emptyWhat="associate leads" />
      <Group id="tm-members" label="// Members" title="members" people={MEMBERS} small byDomain emptyWhat="members" />
    </>
  );
}
