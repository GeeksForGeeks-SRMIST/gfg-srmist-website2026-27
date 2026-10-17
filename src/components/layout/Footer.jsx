import { Link } from 'react-router';
import { ArrowUp, ArrowUpRight, Mail, Phone, Send } from 'lucide-react';
import { CONFIG, NAV_LINKS } from '../../config';
import { telHref } from '../../lib/utils';
import Button from '../ui/Button';
import { SectionLabel } from '../ui/primitives';
import { SocialLinks } from '../ui/Social';
import { useContact } from '../contact/ContactProvider';
import Brand from './Brand';

const link =
  'group/link inline-flex min-h-10 items-center gap-2.5 text-left text-[14px] text-text/85 transition-colors hover:text-green-bright ' +
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-green-bright';

export default function Footer({ onJoin }) {
  const { openContact } = useContact();
  const toTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <footer className="group/footer relative overflow-hidden bg-bg-2">
      {/* Glowing top edge, same green beam as the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(70,196,107,.7)_50%,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-32 w-[min(760px,90%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-bright/12 blur-3xl" />

      <div className="container-site relative">
        <div className="grid gap-7 pb-2 pt-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-14 lg:pt-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Brand />
            <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-muted">{CONFIG.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SocialLinks socials={CONFIG.socials} />
              <Button variant="ghost" onClick={onJoin} aria-haspopup="dialog" className="px-4 text-xs">
                Join the crew <ArrowUpRight className="text-green-bright" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <nav aria-label="Footer">
            <SectionLabel as="h2" className="mb-3 text-[11px]">// Explore</SectionLabel>
            <ul className="grid grid-cols-3 gap-x-4 sm:grid-cols-2 sm:gap-x-6">
              {NAV_LINKS.map((l, i) => (
                <li key={l.to}>
                  <Link className={link} to={l.to}>
                    <span aria-hidden="true" className="font-mono text-[10px] text-muted/60 transition-colors group-hover/link:text-green-bright">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <SectionLabel as="h2" className="mb-3 text-[11px]">// Say hello</SectionLabel>
            <ul className="grid">
              <li><a className={`${link} max-w-full`} href={`mailto:${CONFIG.email}`}><Mail aria-hidden="true" /><span className="min-w-0 break-words">{CONFIG.email}</span></a></li>
              <li><a className={link} href={telHref(CONFIG.phone)}><Phone aria-hidden="true" />{CONFIG.phone}</a></li>
              <li>
                <button type="button" className={`${link} cursor-pointer`} aria-haspopup="dialog" onClick={(e) => openContact(e.currentTarget)}>
                  <Send aria-hidden="true" />Send a message
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Outlined wordmark, same treatment as the page-header ghost titles */}
        <p
          aria-hidden="true"
          className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[clamp(48px,14.5vw,188px)] mb-[-0.2em] font-light lowercase leading-[1.1] tracking-[-.06em] text-transparent [-webkit-text-stroke:1px_rgba(217,220,218,.2)] mask-[linear-gradient(to_bottom,#000_55%,transparent_100%)] transition-[-webkit-text-stroke-color] duration-700 group-hover/footer:[-webkit-text-stroke-color:rgba(70,196,107,.55)]"
        >
          geeksforgeeks
        </p>

        <div className="relative flex flex-wrap items-center justify-between gap-x-6 border-t border-line font-mono text-[10px] tracking-[.04em] text-muted sm:text-[11px]">
          <p className="py-3">© {new Date().getFullYear()} {CONFIG.clubName} · {CONFIG.college}</p>
          <div className="flex flex-wrap items-center gap-x-6">
            <p className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--neon)] animate-led motion-reduce:animate-none" />
              Built by the Tech Team
            </p>
            <button type="button" onClick={toTop} className="inline-flex min-h-11 cursor-pointer items-center gap-2 transition-colors hover:text-green-bright">
              Back to top <ArrowUp className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
