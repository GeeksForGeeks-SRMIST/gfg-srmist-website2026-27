import { useRef } from 'react';
import { Layers } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import { EmptyState, GlassCard } from '../../components/ui/primitives';
import useReducedMotion from '../../hooks/useReducedMotion';
import { DOMAINS } from './domains.data';

const MAX_TILT = 4;  

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

  return (
    <GlassCard
      as="article"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group flex min-h-80 flex-col overflow-hidden p-6.5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,0%),rgba(70,196,107,.16),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="grid size-13 place-items-center rounded-xl border border-green-bright/45 bg-[radial-gradient(circle_at_30%_25%,rgba(70,196,107,.28),rgba(47,141,70,.08)_70%)] text-green-bright shadow-[0_0_24px_-6px_rgba(70,196,107,.45),inset_0_0_14px_-6px_rgba(70,196,107,.45)]"
        >
          <Icon className="size-6" />
        </span>
        <span aria-hidden="true" className="font-mono text-xs font-medium tracking-[.12em] text-muted">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="mt-7 font-display text-[22px] font-semibold leading-tight tracking-[-.02em]">{d.name}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{d.description}</p>
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
        <div className="container-site grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5">
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
