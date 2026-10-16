import { Link } from 'react-router';
import { ArrowUp, ArrowUpRight, Mail, Phone, Send } from 'lucide-react';
import { CONFIG, NAV_LINKS } from '../../config';
import { telHref } from '../../lib/utils';
import Button from '../ui/Button';
import { SocialLinks } from '../ui/Social';
import { useContact } from '../contact/ContactProvider';
import Brand from './Brand';

const heading = 'mb-5 font-mono text-[11px] font-medium leading-none tracking-[.16em] uppercase text-muted';
const link = 'inline-flex min-h-11 items-center gap-3 text-left text-[14px] text-text transition-colors hover:text-green-bright [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-green-bright';

export default function Footer({ onJoin }) {
  const { openContact } = useContact();
  const toTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2 bg-[radial-gradient(70%_70%_at_0%_0%,rgba(70,196,107,.07),transparent_70%)]">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-7 border-b border-line py-10 sm:py-12 lg:flex-row lg:items-center">
          <div>
            <p className="mb-4 flex items-center gap-2.5 font-mono text-[10px] tracking-[.18em] uppercase text-muted">
              <span className="size-1.5 rounded-full bg-green-bright" aria-hidden="true" />
              Your people. Your next chapter.
            </p>
            <h2 className="font-display text-[clamp(30px,3.4vw,48px)] font-medium leading-[1.08] tracking-[-.035em] text-text">
              Big ideas start with <span className="text-green-bright">a hello.</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">Come for the code. Stay for the community. Every branch, every year.</p>
          </div>
          <Button onClick={onJoin} aria-haspopup="dialog" className="min-h-12 shrink-0 px-7">Join the crew <ArrowUpRight aria-hidden="true" /></Button>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 sm:gap-x-12 sm:py-12 lg:grid-cols-[1.25fr_.85fr_1fr] lg:gap-16">
          <div>
            <Brand />
            <p className="mt-4 font-mono text-[11px] tracking-[.16em] text-green-bright">{CONFIG.college} / STUDENT CHAPTER</p>
            <p className="mt-3 max-w-[290px] text-sm leading-relaxed text-muted">{CONFIG.description}</p>
            <SocialLinks socials={CONFIG.socials} className="mt-5" />
          </div>

          <nav aria-label="Footer">
            <h2 className={heading}>Explore</h2>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}><Link className={link} to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h2 className={heading}>Let’s talk</h2>
            <ul className="grid gap-1">
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

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-5 font-mono text-[10px] leading-relaxed text-muted sm:text-[11px]">
          <p>© {new Date().getFullYear()} {CONFIG.clubName} · {CONFIG.college}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p>Built by the Tech Team.</p>
          <button type="button" onClick={toTop} className="inline-flex min-h-11 cursor-pointer items-center gap-2 transition-colors hover:text-green-bright">
            Back to top <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
