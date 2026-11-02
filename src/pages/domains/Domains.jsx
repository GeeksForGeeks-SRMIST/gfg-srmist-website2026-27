import { useRef } from 'react';
import { ArrowRight, ChevronDown, Layers, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { EmptyState, GlassCard } from '../../components/ui/primitives';
import useReducedMotion from '../../hooks/useReducedMotion';
import { DOMAINS } from './domains.data';

const MAX_TILT = 4;

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const Label = ({ children }) => (
  <p className="font-mono text-[10px] font-medium leading-none tracking-[.16em] uppercase text-muted">{children}</p>
);

function Avatars({ names }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 -space-x-2">
      {names.slice(0, 3).map((n) => (
        <span
          key={n}
          className="grid size-8 place-items-center rounded-full border-2 border-bg-2 bg-[radial-gradient(circle_at_30%_25%,rgba(70,196,107,.55),rgba(47,141,70,.25))] font-mono text-[10px] font-medium text-white"
        >
          {initials(n)}
        </span>
      ))}
    </span>
  );
}

function DomainCard({ d, index, canTilt }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const Icon = d.icon;
  const num = String(index + 1).padStart(2, '0');

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

  const directors = d.lead ? d.lead.split(', ') : [];

  return (
    <GlassCard
      as="article"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group flex flex-col overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:bg-[radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,0%),rgba(70,196,107,.14),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100"
    >
      {/* Header: tinted panel with a dot grid and a big outlined number */}
      <header className="relative overflow-hidden border-b border-line bg-[radial-gradient(120%_100%_at_0%_0%,rgba(70,196,107,.2),transparent_60%)] p-5">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] bg-[length:14px_14px] mask-[linear-gradient(to_bottom,#000,transparent)]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-5 font-display text-[104px] font-light leading-none tracking-[-.07em] text-transparent [-webkit-text-stroke:1px_rgba(70,196,107,.3)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:rgba(70,196,107,.75)]"
        >
          {num}
        </span>
        <div className="relative flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-green-bright/45 bg-[radial-gradient(circle_at_30%_25%,rgba(70,196,107,.3),rgba(47,141,70,.08)_70%)] text-green-bright shadow-[0_0_22px_-6px_rgba(70,196,107,.5)]"
          >
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] font-medium tracking-[.16em] uppercase text-green-bright">Domain {num}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold leading-none tracking-[-.02em]">{d.name}</h2>
          </div>
        </div>
        <p className="relative mt-4 text-sm leading-relaxed text-muted">{d.description}</p>
      </header>

      <div className="relative flex flex-1 flex-col gap-5 p-5">
        {d.points?.length > 0 && (
          <ul className="grid gap-2.5 text-[13.5px] leading-snug text-text/85">
            {d.points.map((p) => (
              <li key={p} className="flex gap-2.5">
                <ArrowRight aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-green-bright" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}

        {d.skills?.length > 0 && (
          <div>
            <Label>Skills</Label>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {d.skills.map((s) => (
                <li key={s} className="rounded-full border border-green-bright/25 bg-green/10 px-2.5 py-1 text-[11.5px] text-green-bright">{s}</li>
              ))}
            </ul>
          </div>
        )}

        {(directors.length > 0 || d.associates?.length > 0 || d.members?.length > 0) && (
          <div className="mt-auto grid gap-3.5 rounded-[12px] border border-line bg-black/30 p-3.5">
            {directors.length > 0 && (
              <div className="flex items-center gap-3">
                <Avatars names={directors} />
                <div className="min-w-0">
                  <Label>Directors</Label>
                  <p className="mt-1.5 text-[13.5px] font-semibold leading-snug">{directors.join(' · ')}</p>
                </div>
              </div>
            )}
            {d.associates?.length > 0 && (
              <div>
                <Label>Associates</Label>
                <p className="mt-1.5 text-[13px] leading-snug text-muted">{d.associates.join(' · ')}</p>
              </div>
            )}
            {d.members?.length > 0 && (
              <details className="group/members border-t border-line pt-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex items-center gap-2">
                    <Users aria-hidden="true" className="size-4 text-green-bright" />
                    {d.members.length} members
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[.14em] uppercase text-green-bright">
                    <span className="group-open/members:hidden">View</span>
                    <span className="hidden group-open/members:inline">Hide</span>
                    <ChevronDown aria-hidden="true" className="size-3.5 transition-transform duration-300 group-open/members:rotate-180" />
                  </span>
                </summary>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {d.members.map((n) => (
                    <li key={n} className="rounded-md border border-white/10 bg-white/[.04] px-2.5 py-1 text-xs text-text/85">{n}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
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
        <div className="container-site grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.length ? (
            DOMAINS.map((d, i) => (
              <Reveal key={d.name} delay={(i % 4) * 70}><DomainCard d={d} index={i} canTilt={canTilt} /></Reveal>
            ))
          ) : (
            <EmptyState icon={Layers} title="No domains yet" hint="// add one to DOMAINS in domains.data.js" />
          )}
        </div>
      </section>
    </>
  );
}
