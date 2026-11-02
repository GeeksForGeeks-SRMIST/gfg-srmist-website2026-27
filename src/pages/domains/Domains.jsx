import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Layers } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { EmptyState, GlassCard } from '../../components/ui/primitives';
import useReducedMotion from '../../hooks/useReducedMotion';
import { asset } from '../../lib/utils';
import { ASSOCIATE_LEADS, DOMAIN_LEADS, MEMBERS } from '../team/team.data';
import { DOMAINS } from './domains.data';

const MAX_TILT = 4;

// People come from the Team page data, so both pages always list the same crew
const inDomain = (list, domain) => list.filter((p) => p.domain === domain);

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const Label = ({ children }) => (
  <p className="font-mono text-[10px] font-medium leading-none tracking-[.16em] uppercase text-muted">{children}</p>
);

function Avatars({ people, max = 4 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span aria-hidden="true" className="flex shrink-0 -space-x-2">
      {shown.map((p) => (
        <span key={p.name} className="grid size-8 place-items-center overflow-hidden rounded-full border-2 border-bg-2 bg-green/25 font-mono text-[10px] text-white">
          {p.photo ? <img src={asset(p.photo)} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" /> : initials(p.name)}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid size-8 place-items-center rounded-full border-2 border-bg-2 bg-surface-hover font-mono text-[10px] text-green-bright">+{extra}</span>
      )}
    </span>
  );
}

function Crew({ label, people }) {
  if (!people.length) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="flex w-20 shrink-0"><Avatars people={people} max={2} /></span>
      <div className="min-w-0">
        <Label>{label}</Label>
        <p className="mt-1.5 text-[13px] leading-snug text-text/90">{people.map((p) => p.name).join(' · ')}</p>
      </div>
    </div>
  );
}

function DomainCard({ d, index, canTilt }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const Icon = d.icon;
  const id = d.name.toLowerCase();
  const directors = inDomain(DOMAIN_LEADS, id);
  const associates = inDomain(ASSOCIATE_LEADS, id);
  const members = inDomain(MEMBERS, id);

  const onMove = (e) => {
    if (!canTilt || e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      el.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg)`;
      el.style.transition = 'transform .12s linear, border-color .4s, background-color .4s';
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    el.style.transform = '';
    el.style.transition = '';
  };

  return (
    <GlassCard
      as="article"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group flex h-full flex-col p-6 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,0%),rgba(70,196,107,.14),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100"
    >
      <div className="relative flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-green-bright/45 bg-[radial-gradient(circle_at_30%_25%,rgba(70,196,107,.28),rgba(47,141,70,.08)_70%)] text-green-bright shadow-[0_0_22px_-6px_rgba(70,196,107,.45)]"
        >
          <Icon className="size-5" />
        </span>
        <h2 className="font-display text-2xl font-semibold leading-none tracking-[-.02em]">{d.name}</h2>
        <span aria-hidden="true" className="ml-auto font-mono text-xs tracking-[.12em] text-muted">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className="relative mt-4 text-sm leading-relaxed text-muted">{d.description}</p>

      {d.points?.length > 0 && (
        <ul className="relative mt-5 grid gap-2.5 border-t border-line pt-5 text-[13.5px] leading-snug text-text/85">
          {d.points.map((p) => (
            <li key={p} className="flex gap-2.5">
              <ArrowRight aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-green-bright" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {d.skills?.length > 0 && (
        <ul className="relative mb-6 mt-5 flex flex-wrap gap-1.5" aria-label={`${d.name} skills`}>
          {d.skills.map((s) => (
            <li key={s} className="rounded-full border border-green-bright/25 bg-green/10 px-2.5 py-1 text-[11.5px] text-green-bright">{s}</li>
          ))}
        </ul>
      )}

      {(directors.length > 0 || associates.length > 0 || members.length > 0) && (
        <div className="relative mt-auto grid gap-4 border-t border-line pt-5">
          <Crew label="Directors" people={directors} />
          <Crew label="Associates" people={associates} />
          {members.length > 0 && (
            <Link to="/team" className="group/link flex items-center gap-3">
              <Avatars people={members} max={5} />
              <span className="text-[13px] text-text/90">{members.length} members</span>
              <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] tracking-[.14em] uppercase text-green-bright">
                Meet them <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </span>
            </Link>
          )}
        </div>
      )}
    </GlassCard>
  );
}

export default function Domains() {
  const reduced = useReducedMotion();
  const canTilt = !reduced && typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <>
      <PageHeader
        label="// 04 — Domains"
        title="domains"
        subtitle="Three domains, one crew. Build with Technical, bring people together with Events, or tell our story with Creatives."
      />
      <section aria-label="All domains" className="pb-30 pt-20">
        <div className="container-site grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.length ? (
            DOMAINS.map((d, i) => (
              <Reveal key={d.name} delay={(i % 4) * 70} className="h-full"><DomainCard d={d} index={i} canTilt={canTilt} /></Reveal>
            ))
          ) : (
            <EmptyState icon={Layers} title="No domains yet" hint="// add one to DOMAINS in domains.data.js" />
          )}
        </div>
      </section>
    </>
  );
}
