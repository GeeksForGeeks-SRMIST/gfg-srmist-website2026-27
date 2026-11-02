import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { DOMAINS } from '../../domains/domains.data';
import { SectionLabel, SectionTitle } from '../../../components/ui/primitives';
import DomainPanels from './DomainPanels';

// One photo panel per domain, in the same order as DOMAINS (Technical, Events, Creatives)
const PANEL_PHOTOS = [
  { text: 'Code it, break it, ship it.', src: 'assets/gallery/workshop-03.webp' },
  { text: 'Hackathons, workshops, full houses.', src: 'assets/gallery/workshop-05.webp' },
  { text: 'The club, in its own voice.', src: 'assets/gallery/fun-01.webp' },
];
const PANELS = DOMAINS.map((d, i) => ({ name: d.name, icon: d.icon, ...PANEL_PHOTOS[i] }));

// Expanding photo panels on the left, text on the right.
// The paragraph follows whichever domain panel is open.
export default function DomainsPreview() {
  const [top, setTop] = useState(0);
  const domain = DOMAINS[top] ?? DOMAINS[0];

  return (
    <section
      id="domains-preview"
      aria-labelledby="domains-preview-title"
      className="border-b border-line py-16 md:py-20"
    >
      <div className="container-site">
        <SectionLabel>// 02 — Domains</SectionLabel>

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16">
          <div className="md:order-2">
            <SectionTitle
              id="domains-preview-title"
              className="max-w-3xl normal-case"
            >
              Find your
              <br />
              domain.
            </SectionTitle>

            <p
              key={domain.name}
              aria-live="polite"
              className="mt-7 min-h-16 max-w-xl animate-[domain-in_.45s_ease-out] text-base leading-8 text-muted md:text-lg"
            >
              {domain.description}
            </p>

            <Link
              to="/domains"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-green-bright transition-colors hover:text-white"
            >
              View all domains
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="md:order-1">
            <DomainPanels panels={PANELS} onChange={setTop} />
          </div>
        </div>
      </div>
    </section>
  );
}
