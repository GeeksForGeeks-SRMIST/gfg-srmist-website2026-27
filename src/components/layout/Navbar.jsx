import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Phone } from 'lucide-react';
import { CONFIG, NAV_LINKS } from '../../config';
import { cn } from '../../lib/utils';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import Button from '../ui/Button';
import { IconButton } from '../ui/primitives';
import { useContact } from '../contact/ContactProvider';
import Brand from './Brand';

export default function Navbar({ onJoin }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const { openContact } = useContact();
  const { pathname } = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 40);
      if (y > lastY + 6 && y > 160) setHidden(true);
      else if (y < lastY - 6 || y <= 160) setHidden(false);
      if (Math.abs(y - lastY) > 6) lastY = y;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useScrollLock(menuOpen);
  // menu first, so focus lands on the first menu link; the bar (logo, phone, close) stays reachable
  useFocusTrap([menuRef, navRef], menuOpen, { onEscape: () => setMenuOpen(false), initialFocus: 'a' });

  const isHidden = hidden && !menuOpen;

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[201] -translate-y-[200%] bg-green px-[18px] py-3 font-ui text-[13px] font-bold tracking-[.12em] uppercase text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        ref={navRef}
        onFocus={() => setHidden(false)}
        className={cn(
          'fixed inset-x-0 top-0 z-[100] h-[var(--nav-h)] border-b border-transparent transition-[translate,background-color,border-color] duration-450 ease-smooth',
          'in-[.is-locked]:pr-[var(--sbw)]',
          scrolled && !menuOpen && 'border-line bg-black/60 backdrop-blur-[16px] backdrop-saturate-[1.4]',
          isHidden && '-translate-y-full',
        )}
      >
        <div className="container-site grid h-full grid-cols-[1fr_auto] items-center gap-6 nav:grid-cols-[1fr_auto_1fr]">
          <Brand hideWordsBetween className="justify-self-start" />

          <nav aria-label="Primary" className="hidden nav:block">
            <ul className="flex items-center gap-[22px] xl:gap-[34px]">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative inline-flex min-h-11 items-center font-ui text-[13px] font-bold leading-none tracking-[.1em] uppercase xl:text-sm xl:tracking-[.14em]',
                        'transition-colors duration-250 hover:text-green-bright',
                        'after:absolute after:left-0 after:right-[.14em] after:top-[calc(50%+15px)] after:h-[3px] after:rounded-sm after:bg-green-bright',
                        'after:shadow-[0_0_12px_rgba(70,196,107,.45),0_0_4px_rgba(70,196,107,.45)] after:transition-[opacity,scale] after:duration-300',
                        isActive ? 'text-green-bright after:opacity-100 after:scale-x-100' : 'text-text/85 after:opacity-0 after:scale-x-40',
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-3 justify-self-end">
            <IconButton onClick={(e) => openContact(e.currentTarget)} aria-haspopup="dialog" aria-label="Contact us">
              <Phone aria-hidden="true" />
            </IconButton>
            <Button onClick={onJoin} aria-haspopup="dialog" className="hidden px-5 nav:inline-flex">Join Now</Button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative size-11 cursor-pointer rounded-[10px] glass nav:hidden"
            >
              <span className={cn('absolute inset-x-[13px] top-[17px] h-[1.5px] rounded bg-text transition-transform duration-350', menuOpen && 'translate-y-1 rotate-45')} />
              <span className={cn('absolute inset-x-[13px] top-[25px] h-[1.5px] rounded bg-text transition-transform duration-350', menuOpen && '-translate-y-1 -rotate-45')} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen glass menu (outside the header so `fixed` is relative to the viewport) */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-label="Menu"
        inert={!menuOpen}
        className={cn(
          'fixed inset-0 z-[99] flex flex-col overflow-y-auto bg-black/70 px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+24px)] backdrop-blur-[22px] backdrop-saturate-[1.4] nav:hidden',
          'duration-350 ease-smooth',
          // opening: visible instantly (so focus can move in); closing: fade, then hide
          menuOpen ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]',
        )}
      >
        <nav aria-label="Mobile">
          <ol className="grid gap-1">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.to}
                className={cn('transition-[opacity,translate] duration-450 ease-out-expo', menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
              >
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-baseline gap-4 border-b border-line py-2.5 font-display text-[clamp(40px,11vw,64px)] font-light leading-none tracking-[-.045em] lowercase',
                      isActive ? 'text-green-bright' : 'text-display-light',
                    )
                  }
                >
                  <span className="font-mono text-[11px] font-medium tracking-[.12em] text-muted">0{i + 1}</span>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
        <div
          className={cn('mt-auto grid gap-[18px] pt-8 transition-[opacity,translate] duration-450 ease-out-expo', menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}
          style={{ transitionDelay: menuOpen ? `${80 + NAV_LINKS.length * 60}ms` : '0ms' }}
        >
          <Button onClick={() => { setMenuOpen(false); onJoin(); }} aria-haspopup="dialog" className="min-h-[52px] w-full">Join Now</Button>
          <p className="font-mono text-xs leading-relaxed text-muted">
            {CONFIG.email}
            <br />
            {CONFIG.phone}
          </p>
        </div>
      </div>
    </>
  );
}
