import { useState } from 'react';
import { Handshake, Plus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import { EmptyState, SectionLabel } from '../../components/ui/primitives';
import { useContact } from '../../components/contact/ContactProvider';
import { asset, cn } from '../../lib/utils';
import { SPONSORS } from './sponsors.data';

const TIERS = [
  { id: 'title', label: 'Title Sponsor', note: 'Powering the whole season', grid: 'grid-cols-1', tile: 'min-h-[220px]' },
  { id: 'gold', label: 'Gold', note: 'Headline partners', grid: 'grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))]', tile: 'min-h-[150px]' },
  { id: 'silver', label: 'Silver', note: 'Event partners', grid: 'grid-cols-[repeat(auto-fill,minmax(min(180px,100%),1fr))]', tile: 'min-h-[118px]' },
  { id: 'community', label: 'Community Partners', note: 'Friends of the chapter', grid: 'grid-cols-[repeat(auto-fill,minmax(min(150px,100%),1fr))]', tile: 'min-h-24' },
];

const tileBase =
  'group relative grid w-full place-items-center overflow-hidden rounded-card p-5 glass text-muted ' +
  'transition-[border-color,background-color,color] duration-350 hover:border-green-bright/55 hover:bg-surface-hover hover:text-text ' +
  'before:pointer-events-none before:absolute before:inset-0 before:backdrop-grayscale before:transition-opacity before:duration-450 hover:before:opacity-0 ' +
  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(80%_90%_at_50%_120%,rgba(70,196,107,.2),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-450 hover:after:opacity-100';

function Tile({ s, tier }) {
  const [failed, setFailed] = useState(false);
  const isTitle = tier.id === 'title';
  return (
    <a href={s.url || '#'} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} (opens in a new tab)`} className={cn(tileBase, tier.tile)}>
      {s.logo && !failed ? (
        <img src={asset(s.logo)} alt={s.name} loading="lazy" decoding="async" onError={() => setFailed(true)} className={cn('max-w-[70%] object-contain', isTitle ? 'max-h-[110px]' : 'max-h-16')} />
      ) : (
        <span
          className={cn(
            'text-center',
            isTitle
              ? 'font-display text-[clamp(32px,4vw,52px)] font-light leading-none tracking-[-.04em] lowercase'
              : 'font-ui text-[15px] font-bold leading-tight tracking-[.1em] uppercase',
          )}
        >
          {s.name}
        </span>
      )}
    </a>
  );
}

export default function Sponsors() {
  const { openContact } = useContact();

  return (
    <>
      <PageHeader
        label="// 05 — Sponsors"
        title="our sponsors"
        outline="sponsors"
        subtitle="The partners who fuel our hackathons, workshops and late-night pizza. Thank you."
      />

      <section aria-label="Sponsor tiers" className="pb-18 pt-20">
        <div className="container-site">
          {!SPONSORS.length ? (
            <EmptyState icon={Handshake} title="Sponsor slots are open" hint="// be the first to back the chapter" />
          ) : (
            TIERS.map((tier, i) => {
              const list = SPONSORS.filter((s) => s.tier === tier.id);
              return (
                <Reveal key={tier.id} delay={i * 60} className="grid gap-5 border-t border-line py-8 last:border-b md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 md:py-10">
                  <div>
                    <h2 className={cn('font-ui text-sm font-bold leading-tight tracking-[.14em] uppercase', tier.id === 'title' && 'text-green-bright')}>{tier.label}</h2>
                    <p className="mt-2.5 font-mono text-xs leading-snug text-muted">// {tier.note} · {String(list.length).padStart(2, '0')}</p>
                  </div>
                  <ul className={cn('grid gap-3.5', tier.grid)}>
                    {list.length ? (
                      list.map((s, j) => <li key={`${s.name}-${j}`}><Tile s={s} tier={tier} /></li>)
                    ) : (
                      <li>
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          onClick={(e) => openContact(e.currentTarget)}
                          className={cn(tileBase, tier.tile, 'cursor-pointer gap-2 border-dashed font-mono text-xs font-medium tracking-[.12em] uppercase')}
                        >
                          <Plus className="size-5 text-green-bright" aria-hidden="true" />
                          Your logo here
                        </button>
                      </li>
                    )}
                  </ul>
                </Reveal>
              );
            })
          )}
        </div>
      </section>

      <section aria-labelledby="sp-cta-title" className="pb-20 md:pb-30">
        <div className="container-site">
          <Reveal className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[20px] glass bg-[radial-gradient(60%_120%_at_100%_50%,rgba(70,196,107,.18),transparent_70%)] px-5.5 py-8 md:p-14">
            <div>
              <SectionLabel>// Partner with us</SectionLabel>
              <h2 id="sp-cta-title" className="mt-4 font-display text-[clamp(36px,5vw,72px)] font-light leading-[.95] tracking-[-.045em] text-display-light">
                want to partner with us?
              </h2>
              <p className="mt-3.5 max-w-[520px] text-muted">
                Reach 50+ student developers through hackathons, workshops and talks. Custom packages for every budget.
              </p>
            </div>
            <Button className="min-h-13 px-6.5" aria-haspopup="dialog" onClick={(e) => openContact(e.currentTarget)}>
              Become a Sponsor <Handshake aria-hidden="true" />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
