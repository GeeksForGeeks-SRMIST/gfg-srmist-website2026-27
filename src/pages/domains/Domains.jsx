import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Layers } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/primitives';
import { asset, cn } from '../../lib/utils';
import { DOMAIN_LEADS } from '../team/team.data';
import { DOMAINS } from './domains.data';
import './domains.css';

// Per domain: arch photo (and its focal point), tagline and accent colour
const DOORS = {
  technical: { src: 'assets/gallery/workshop-06.webp', pos: '72% 50%', tagline: 'Code it, break it, ship it.', accent: '#22c55e', alt: 'A speaker presenting a technology session' },
  events: { src: 'assets/gallery/fun-03.webp', pos: '50% 40%', tagline: 'Hackathons, workshops, full houses.', accent: '#f6d860', alt: 'A packed room of students at a club event' },
  creatives: { src: 'assets/gallery/workshop-01.webp', pos: '50% 50%', tagline: 'The club, in its own voice.', accent: '#ff9d7a', alt: 'Sticky notes covering a wall in the shape of the words Java Verse' },
};

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

// One arched "door" per domain: photo, name, tagline, its directors, and a link to that domain on the Team page
function Door({ d, tall }) {
  const id = d.name.toLowerCase();
  const door = DOORS[id] || {};
  // People come from the Team page data, so both pages always list the same crew
  const directors = DOMAIN_LEADS.filter((p) => p.domain === id);

  return (
    <Link to={`/team?domain=${id}#tm-leads`} className={cn('dd-door', tall && 'dd-door--tall')} style={{ '--a': door.accent }}>
      <div className="dd-frame">
        <div className="dd-arch">
          <div className="dd-photo">
            {door.src && <img src={asset(door.src)} alt={door.alt} loading="lazy" decoding="async" style={{ '--p': door.pos }} />}
          </div>
        </div>
      </div>
      <div className="dd-txt">
        <h2 className="dd-name">{d.name}</h2>
        {door.tagline && <p className="dd-tag">{door.tagline}</p>}
        {directors.length > 0 && (
          <ul className="dd-dirs" aria-label="Directors">
            {directors.map((p) => (
              <li key={p.name}>
                <span className="dd-face">
                  {p.photo ? <img src={asset(p.photo)} alt="" loading="lazy" decoding="async" /> : initials(p.name)}
                </span>
                {p.name}
              </li>
            ))}
          </ul>
        )}
        <span className="dd-more">Meet the {id} team</span>
      </div>
    </Link>
  );
}

export default function Domains() {
  const row = useRef(null);

  // Photos rise into their arches the first time the row scrolls into view
  useEffect(() => {
    const el = row.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    el.classList.add('dd-js');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { el.classList.add('dd-in'); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <PageHeader
        label="// 04 — Domains"
        title="domains"
        subtitle="Three domains, one crew. Build with Technical, bring people together with Events, or tell our story with Creatives."
      />
      <section aria-label="All domains" className="pb-30 pt-16 md:pt-20">
        <div className="container-site">
          {DOMAINS.length ? (
            <div ref={row} className="dd-row">
              {DOMAINS.map((d, i) => <Door key={d.name} d={d} tall={i === 1} />)}
            </div>
          ) : (
            <EmptyState icon={Layers} title="No domains yet" hint="// add one to DOMAINS in domains.data.js" />
          )}
        </div>
      </section>
    </>
  );
}
