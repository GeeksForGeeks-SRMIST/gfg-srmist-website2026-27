
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { DOMAINS } from '../../domains/domains.data';
import {
  GlassCard,
  SectionLabel,
  SectionTitle,
} from '../../../components/ui/primitives';

export default function DomainsPreview() {
  return (
    <section
      id="domains-preview"
      aria-labelledby="domains-preview-title"
      className="border-b border-line py-20 md:py-30"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>// 02 — Domains</SectionLabel>
            <SectionTitle
              id="domains-preview-title"
              className="max-w-3xl normal-case"
            >
              Find your
              <br />
              domain.
            </SectionTitle>
          </div>

          <Link
            to="/domains"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-green-bright/30 px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-green-bright transition-colors hover:border-green-bright hover:bg-green/10"
          >
            View all domains
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          {DOMAINS.map(({ name, icon: Icon, description }, index) => (
            <Link
              key={name}
              to="/domains"
              aria-label={`Explore the ${name} domain`}
              className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-bright"
            >
              <GlassCard className="flex min-h-64 flex-col p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <div className="grid size-12 place-items-center rounded-xl border border-green-bright/20 bg-green/10 text-green-bright">
                    <Icon size={23} aria-hidden="true" />
                  </div>

                  <span className="font-mono text-xs text-muted">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-3xl normal-case text-display-light">
                  {name}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                  {description}
                </p>

                <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-green-bright">
                  Explore domain
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
