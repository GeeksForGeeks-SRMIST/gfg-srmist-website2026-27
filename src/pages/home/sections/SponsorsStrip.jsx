import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '../../../lib/utils';
import { SectionLabel } from '../../../components/ui/primitives';
import Reveal from '../../../components/ui/Reveal';
import { SPONSORS } from '../../sponsors/sponsors.data';

function SponsorMark({ sponsor }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="grid aspect-[3/2] place-items-center overflow-hidden rounded-card border border-line bg-surface/50 text-muted transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-green-bright/50 hover:text-text">
      {sponsor.logo && !failed ? (
        <img
          src={asset(sponsor.logo)}
          alt={sponsor.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span className="px-3 text-center font-ui text-sm font-bold leading-tight tracking-[.1em] uppercase">
          {sponsor.name}
        </span>
      )}
    </li>
  );
}

// The Home page shows the first 10; the Sponsors page has all of them
const PREVIEW = SPONSORS.slice(0, 10);

export default function SponsorsStrip() {
  return (
    <section id="sponsors-strip" aria-labelledby="sponsors-strip-title" className="border-b border-line py-16 md:py-20">
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
          <Link
            to="/sponsors"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium tracking-[.1em] uppercase text-muted transition-colors hover:text-green-bright"
          >
            All sponsors <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
        <Reveal>
        {SPONSORS.length ? (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-10 md:gap-4 lg:grid-cols-5">
            {PREVIEW.map((sponsor, index) => (
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
