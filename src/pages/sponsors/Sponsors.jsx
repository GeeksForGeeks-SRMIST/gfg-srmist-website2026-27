import { useState } from 'react';
import { Handshake } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import { EmptyState, SectionLabel } from '../../components/ui/primitives';
import { useContact } from '../../components/contact/ContactProvider';
import { asset } from '../../lib/utils';
import { SPONSORS } from './sponsors.data';

const tile =
  'group relative block aspect-[3/2] w-full overflow-hidden rounded-card glass ' +
  'transition-[transform,border-color,box-shadow] duration-300 ' +
  'hover:-translate-y-1 hover:border-green-bright/60 hover:shadow-[0_14px_40px_-14px_rgba(70,196,107,.5)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright';

function Tile({ s }) {
  const [failed, setFailed] = useState(false);
  return (
    <a href={s.url || '#'} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} (opens in a new tab)`} className={tile}>
      {s.logo && !failed ? (
        <img
          src={asset(s.logo)}
          alt={s.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="grid h-full place-items-center p-4 text-center font-ui text-[15px] font-bold leading-tight tracking-[.1em] text-muted uppercase">
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

      <section aria-label="Our sponsors" className="pb-18 pt-16">
        <div className="container-site">
          {!SPONSORS.length ? (
            <EmptyState icon={Handshake} title="Sponsor slots are open" hint="// be the first to back the chapter" />
          ) : (
            <>
              <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-6">
                <SectionLabel>// Backed by {String(SPONSORS.length).padStart(2, '0')} partners</SectionLabel>
                <p className="font-mono text-xs text-muted">// hover a logo to visit their site</p>
              </Reveal>
              <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {SPONSORS.map((s, i) => (
                  <li key={`${s.name}-${i}`}>
                    <Reveal delay={(i % 5) * 60}>
                      <Tile s={s} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </>
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