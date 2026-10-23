import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '../../../lib/utils';
import { SectionLabel } from '../../../components/ui/primitives';
import Reveal from '../../../components/ui/Reveal';
import { SPONSORS } from '../../sponsors/sponsors.data';

function SponsorMark({ sponsor }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="grid min-h-20 min-w-36 place-items-center rounded-card border border-line bg-surface/50 px-6 py-4 text-muted transition-colors duration-300 hover:border-green-bright/40 hover:text-text before:inset-0 "
   >
      {sponsor.logo && !failed ? (
        <img
          src={asset(sponsor.logo)}
          alt={sponsor.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="max-h-12 max-w-36 object-contain transition-[opacity,translate] "
        />
      ) : (
        <span className="text-center font-ui text-sm font-bold leading-tight tracking-[.1em] uppercase">
          {sponsor.name}
        </span>
      )}
    </li>
  );
}

export default function SponsorsStrip() {
  return (
    <section aria-labelledby="sponsors-strip-title" className="border-b border-line py-16 md:py-20">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SectionLabel>// 04 — Sponsors</SectionLabel>
            <h2
              id="sponsors-strip-title"
              className="mt-3 font-display text-[clamp(32px,5vw,60px)] font-light leading-[.95] tracking-[-.045em] text-display-light"
            >
              Partners who power us
            </h2>
          </div>
          <a
            href="/sponsors"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium tracking-[.1em] uppercase text-muted transition-colors hover:text-green-bright"
          >
            All sponsors <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </Reveal>
        <Reveal>
        {SPONSORS.length ? (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4 duration-800 ease-out-expo">
            {SPONSORS.map((sponsor, index) => (
              <SponsorMark key={`${sponsor.name}-${index}`} sponsor={sponsor} />
            ))}
          </ul>
        ) : (
          <p className="mt-8 font-mono text-xs tracking-[.08em] text-muted">
            Sponsor announcements coming soon.
          </p>
        )}
        </Reveal>
      </div>
    </section>
  );
}
