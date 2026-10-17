import Hero from './Hero';
import Marquee from './Marquee';
import { SectionLabel } from '../../components/ui/primitives';
import './home.css';

const PLACEHOLDERS = [
  { id: 'about', label: '// 01 — About' },             
  { id: 'domains-preview', label: '// 02 — Domains' },  
  { id: 'flagship-events', label: '// 03 — Flagship events' },
  { id: 'sponsors-strip', label: '// 04 — Sponsors' },
  { id: 'community', label: '// 05 — Our community' },
  { id: 'final-cta', label: '// 06 — Join us' },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {PLACEHOLDERS.map((p) => (
        <section key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="border-b border-line py-20 md:py-30">
          <div className="container-site flex flex-wrap items-end justify-between gap-6">
            <SectionLabel>{p.label}</SectionLabel>
            <h2
              id={`${p.id}-title`}
              className="font-display text-[clamp(48px,9vw,128px)] font-light leading-[.85] tracking-[-.05em] lowercase text-transparent [-webkit-text-stroke:1px_rgba(217,220,218,.3)]"
            >
              coming soon
            </h2>
          </div>
        </section>
      ))}
    </>
  );
}
