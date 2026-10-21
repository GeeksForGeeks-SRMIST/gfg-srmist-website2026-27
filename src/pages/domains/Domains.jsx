import { useRef } from 'react';
import { Layers } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { EmptyState, GlassCard } from '../../components/ui/primitives';
import useReducedMotion from '../../hooks/useReducedMotion';
import { DOMAINS } from './domains.data';

const MAX_TILT = 4;

function NameChips({ names, size = 'sm' }) {
  const text = size === 'sm' ? 'text-sm' : 'text-[15px]';
  return (
    <ul className="flex flex-wrap gap-2.5">
      {names.map((n) => (
        <li key={n} className={`rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 ${text}`}>{n}</li>
      ))}
    </ul>
  );
}

function DomainCard({ d, index, canTilt }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const Icon = d.icon;

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
      className="group flex min-h-[32rem] flex-col overflow-hidden p-8 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgba(70,196,107,.16),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-xl border border-green-bright/45 bg-[radial-gradient(circle_at_30%_25%,rgba(70,196,107,.28),rgba(47,141,70,.08)_70%)] text-green-bright shadow-[0_0_24px_-6px_rgba(70,196,107,.45),inset_0_0_14px_-6px_rgba(70,196,107,.45)]"
        >
          <Icon className="size-7" />
        </span>
        <span aria-hidden="true" className="font-mono text-xs font-medium tracking-[.12em] text-muted">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h2 className="mt-8 font-display text-[28px] font-semibold leading-tight tracking-[-.02em]">{d.name}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted">{d.description}</p>

      {d.points?.length > 0 && (
        <ul className="mt-7 space-y-3.5 text-[15px] leading-relaxed text-muted">
          {d.points.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-green-bright" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {d.skills?.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-xs tracking-[.12em] text-muted">// SKILLS</p>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {d.skills.map((s) => (
              <li key={s} className="rounded-full border border-green-bright/35 px-3.5 py-1.5 text-[13px] text-green-bright">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {(directors.length > 0 || d.associates?.length > 0 || d.members?.length > 0) && (
        <div className="mt-auto space-y-6 border-t border-white/10 pt-8">
          {directors.length > 0 && (
            <div>
              <p className="font-mono text-xs tracking-[.12em] text-muted">// DIRECTORS</p>
              <div className="mt-3 space-y-1.5">
                {directors.map((n) => (
                  <p key={n} className="text-lg font-semibold leading-snug">{n}</p>
                ))}
              </div>
            </div>
          )}
          {d.associates?.length > 0 && (
            <div>
              <p className="font-mono text-xs tracking-[.12em] text-muted">// ASSOCIATES</p>
              <div className="mt-3"><NameChips names={d.associates} size="md" /></div>
            </div>
          )}
                  {d.members?.length > 0 && (
            <div>
              <p className="font-mono text-xs tracking-[.12em] text-muted">// MEMBERS ({d.members.length})</p>
              <div className="mt-3"><NameChips names={d.members} /></div>
            </div>
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
        <div className="container-site grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-8">
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