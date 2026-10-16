import { useState } from 'react';
import { Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { EmptyState, GlassCard, SectionLabel, SectionTitle } from '../../components/ui/primitives';
import { SocialLinks } from '../../components/ui/Social';
import { asset, cn } from '../../lib/utils';
import { CORE_TEAM, DOMAIN_LEADS, FACULTY, MEMBERS } from './team.data';

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
  <p className="mt-1.5 font-mono text-xs font-medium leading-snug tracking-[.08em] uppercase text-green-bright">// {children}</p>
);

function ProfileCard({ person }) {
  return (
    <GlassCard as="article" className="group px-3.5 pb-4.5 pt-3.5">
      <Photo person={person} />
      <h3 className="mt-4.5 font-display text-[19px] font-semibold leading-tight tracking-[-.02em]">{person.name}</h3>
      <Role>{person.role}</Role>
      <SocialLinks socials={person.socials} round={false} label={person.name} className="mt-3.5 gap-1.5" />
    </GlassCard>
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
        <SocialLinks socials={person.socials} round={false} label={person.name} className="mt-7 gap-1.5" />
      </div>
    </GlassCard>
  );
}

function Group({ id, label, title, people, small, faculty, emptyWhat }) {
  return (
    <section aria-labelledby={id} className="pt-18 last:pb-30 md:pt-24">
      <div className="container-site">
        <div className="mb-10">
          <SectionLabel>{label}</SectionLabel>
          <SectionTitle id={id}>{title}</SectionTitle>
        </div>
        {!people.length ? (
          <EmptyState icon={Users} title={`No ${emptyWhat} added yet`} hint="// add people to the array in team.data.js" />
        ) : faculty ? (
          people.map((p) => <Reveal key={p.name}><FacultyCard person={p} /></Reveal>)
        ) : (
          <div className={cn('grid gap-5', small ? 'grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))]')}>
            {people.map((p, i) => (
              <Reveal key={`${p.name}-${i}`} delay={(i % 4) * 70}><ProfileCard person={p} /></Reveal>
            ))}
          </div>
        )}
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
      <Group id="tm-leads" label="// Domain leads" title="domain leads" people={DOMAIN_LEADS} emptyWhat="domain leads" />
      <Group id="tm-members" label="// Members" title="members" people={MEMBERS} small emptyWhat="members" />
    </>
  );
}
