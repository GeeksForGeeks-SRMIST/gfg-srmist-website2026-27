import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { CONFIG } from '../../config';
import { asset, cn, isExternal } from '../../lib/utils';
import useReducedMotion from '../../hooks/useReducedMotion';
import Media from '../../components/ui/Media';
import CountUp from '../../components/ui/CountUp';
import Button from '../../components/ui/Button';

const ROBOT_COMMANDS = { left: 'stats --live', center: 'whoami', right: 'events --next' };
const ZONES = [
  { dir: 'left', label: 'Robot: show club stats' },
  { dir: 'center', label: 'Robot: who are we?' },
  { dir: 'right', label: 'Robot: show the upcoming event' },
];
const STATUS = { left: 'Showing club stats', center: 'Who are we', right: 'Showing the upcoming event' };

function TypingText({ text, reduced }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (reduced || !text) { setOut(text || ''); return undefined; }
    let i = 0;
    setOut('');
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [text, reduced]);
  return out;
}

function SmartLink({ to, className, children, ...rest }) {
  if (isExternal(to) || to === '#') return <a href={to} className={className} {...rest}>{children}</a>;
  return <Link to={to} className={className} {...rest}>{children}</Link>;
}

export default function Hero() {
  const reduced = useReducedMotion();
  const ev = CONFIG.nextEvent;
  const stats = CONFIG.stats.slice(0, 2);
  const heroImg = asset(CONFIG.heroImage);

  const [ready, setReady] = useState(false);
  const [broken, setBroken] = useState(false);
  const [look, setLookState] = useState(null);
  const [awake, setAwake] = useState(false);
  const [command, setCommand] = useState('');

  const titleRef = useRef(null);
  const robotRef = useRef(null);
  const holoRef = useRef(null);
  const nextRef = useRef(null);
  const statsRef = useRef(null);
  const zoneRefs = useRef({});
  const panelRefs = useRef({});
  const lookRef = useRef(null);
  const hideTimer = useRef(0);
  const lastPointer = useRef('mouse');

  /* 1. Start the intro once fonts are ready (so the headline doesn't swap mid-animation) */
  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    (document.fonts?.ready ?? Promise.resolve()).then(go);
    const t = setTimeout(go, 900);
    return () => clearTimeout(t);
  }, []);

  const setLook = useCallback((dir) => {
    clearTimeout(hideTimer.current);
    if (dir === lookRef.current) return;
    lookRef.current = dir;
    setLookState(dir);
    if (dir) setCommand(`> ${ROBOT_COMMANDS[dir]}`);
  }, []);
  const hideSoon = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setLook(null), 380);
  }, [setLook]);
  const isInside = (node) =>
    !!node &&
    (Object.values(zoneRefs.current).some((z) => z?.contains(node)) ||
      Object.values(panelRefs.current).some((p) => p?.contains(node)));

  // Eye flare + wake scan restart for every new look (two frames later = no forced layout)
  useEffect(() => {
    setAwake(false);
    if (!look) return undefined;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setAwake(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [look]);

  useEffect(() => {
    const onDown = (e) => {
      lastPointer.current = e.pointerType || 'mouse';
      if (lookRef.current && !isInside(e.target)) setLook(null);
    };
    const onKey = (e) => {
      if (e.key === 'Tab') lastPointer.current = 'keyboard';
      if (e.key === 'Escape' && lookRef.current) {
        const zone = zoneRefs.current[lookRef.current];
        setLook(null);
        zone?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLook]);

  useEffect(() => {
    if (reduced) return undefined;
    const timers = [];
    let alive = true;
    const blinkOnce = () => {
      const el = robotRef.current;
      if (!el) return;
      el.classList.add('is-blink');
      timers.push(setTimeout(() => el.classList.remove('is-blink'), 130));
    };
    const schedule = () => {
      timers.push(setTimeout(() => {
        if (!alive) return;
        if (!document.hidden && !lookRef.current) {
          blinkOnce();
          if (Math.random() < 0.25) timers.push(setTimeout(blinkOnce, 240));  
        }
        schedule();
      }, 2600 + Math.random() * 4200));
    };
    timers.push(setTimeout(schedule, 1800));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    const desktop = window.matchMedia('(min-width: 1025px)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hero = robotRef.current?.closest('.hm-hero');
    const title = titleRef.current;
    const robot = robotRef.current;
    const holo = holoRef.current;
    const cards = [nextRef.current, statsRef.current].filter(Boolean);
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let scrollY = 0;
    let raf = 0;

    const apply = () => {
      const h = hero?.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, scrollY / h));
      const { x: mx, y: my } = cur;
      if (title) {
        title.style.transform = `translate3d(${(mx * 10).toFixed(2)}px,${(my * 10).toFixed(2)}px,0) scale(${(1 - p * 0.1).toFixed(4)})`;
        title.style.opacity = (1 - p * 0.9).toFixed(3);
      }
      if (robot) {
        robot.style.transform = `translate3d(${(-mx * 18).toFixed(2)}px,${(-my * 18 + scrollY * 0.3).toFixed(2)}px,0)`;
        robot.style.setProperty('--hm-look-x', `${(mx * 4).toFixed(2)}px`);
        robot.style.setProperty('--hm-look-y', `${(my * 3).toFixed(2)}px`);
        if (holo) holo.style.transform = robot.style.transform;  
      }
      cards.forEach((el) => { el.style.transform = `translate3d(${(mx * 6).toFixed(2)}px,${(my * 6).toFixed(2)}px,0)`; });
    };
    const frame = () => {
      raf = 0;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      apply();
      if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) request();
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onPointer = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      request();
    };
    const onScroll = () => {
      const y = window.scrollY;
      const h = hero?.offsetHeight || 0;
      if (y > h * 1.2 && scrollY > h * 1.2) return;
      scrollY = y;
      request();
    };
    const onLeave = () => { target.x = 0; target.y = 0; request(); };
    const reset = () => {
      target.x = target.y = cur.x = cur.y = 0;
      scrollY = 0;
      [title, robot, holo, ...cards].forEach((el) => { if (el) { el.style.transform = ''; el.style.opacity = ''; } });
      robot?.style.removeProperty('--hm-look-x');
      robot?.style.removeProperty('--hm-look-y');
    };

    let active = false;
    const setMode = () => {
      if (desktop.matches === active) return;
      active = desktop.matches;
      if (active) {
        if (finePointer.matches) window.addEventListener('pointermove', onPointer, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        onScroll();
      } else {
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('mouseleave', onLeave);
        reset();
      }
    };
    setMode();
    desktop.addEventListener('change', setMode);
    return () => {
      desktop.removeEventListener('change', setMode);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const panelProps = (dir, label) => ({
    id: `hm-holo-${dir}`,
    ref: (el) => { panelRefs.current[dir] = el; },
    'aria-label': label,
    inert: look !== dir,
    className: cn('hm-holo__panel', `hm-holo__panel--${dir}`, look === dir && 'is-active'),
    onPointerEnter: () => clearTimeout(hideTimer.current),
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') hideSoon(); },
    onBlur: (e) => { if (!isInside(e.relatedTarget)) hideSoon(); },
  });

  return (
    <section className={cn('hm-hero', ready && 'is-ready')} data-look={look || undefined} aria-labelledby="hm-hero-title">
      <div className="hm-hero__visual">
        <div className="hm-hero__glow" aria-hidden="true" />

        <h1 className="hm-hero__title" id="hm-hero-title" ref={titleRef}>
          <span className="hm-hero__line hm-hero__line--1">
            <span className="hm-hero__line-inner">
              <span className="hm-hero__dash" aria-hidden="true" />
              <span className="hm-hero__word">GeeksforGeeks</span>
              <span className="hm-hero__dash" aria-hidden="true" />
            </span>
          </span>
          <span className="hm-hero__line hm-hero__line--2">
            <span className="hm-hero__line-inner">student chapter</span>
          </span>
        </h1>

        <div className="hm-hero__hairline" aria-hidden="true" />

        <figure className={cn('hm-hero__robot', broken && 'is-broken', awake && 'is-awake is-talking')} ref={robotRef}>
          <div className="hm-hero__robot-inner">
            <div className="hm-hero__robot-breath">
              <div className="hm-hero__body">
                <img
                  className="hm-hero__robot-img hm-hero__robot-img--body"
                  src={heroImg}
                  width="1145"
                  height="1374"
                  alt="Glossy black humanoid robot with glowing green eyes and a green light strip down its chest"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => setBroken(true)}
                />
                <span className="hm-hero__beam" aria-hidden="true"><span className="hm-hero__pulse" /></span>
              </div>
              <div className="hm-hero__head">
                <img className="hm-hero__robot-img hm-hero__robot-img--head" src={heroImg} width="1145" height="1374" alt="" decoding="async" onError={() => setBroken(true)} />
                <span className="hm-hero__eyecover hm-hero__eyecover--l" aria-hidden="true" />
                <span className="hm-hero__eyecover hm-hero__eyecover--r" aria-hidden="true" />
                <span className="hm-hero__strip hm-hero__strip--l" aria-hidden="true" />
                <span className="hm-hero__strip hm-hero__strip--r" aria-hidden="true" />
                <div className="hm-hero__face">
                  <img className="hm-hero__robot-img hm-hero__robot-img--face" src={heroImg} width="1145" height="1374" alt="" decoding="async" />
                  <span className="hm-hero__lid hm-hero__lid--l" aria-hidden="true" />
                  <span className="hm-hero__lid hm-hero__lid--r" aria-hidden="true" />
                  <span className="hm-hero__eye hm-hero__eye--l" aria-hidden="true" />
                  <span className="hm-hero__eye hm-hero__eye--r" aria-hidden="true" />
                </div>
                <span className="hm-hero__shade hm-hero__shade--l" aria-hidden="true" />
                <span className="hm-hero__shade hm-hero__shade--r" aria-hidden="true" />
                <span className="hm-hero__spec" aria-hidden="true" />
              </div>
              <div className="hm-hero__fx" aria-hidden="true">
                <span className="hm-hero__sweep" />
                <span className="hm-hero__scan" />
                <span className="hm-hero__scan hm-hero__scan--wake" />
              </div>
              <div className="hm-hero__fallback" aria-hidden="true">
                <span className="hm-hero__ring" />
                <span className="hm-hero__orb" />
              </div>
            </div>
          </div>

          <div className="hm-hero__zones" role="group" aria-label="Ask the robot">
            {ZONES.map(({ dir, label }) => (
              <button
                key={dir}
                ref={(el) => { zoneRefs.current[dir] = el; }}
                type="button"
                className={`hm-hero__zone hm-hero__zone--${dir}`}
                aria-controls={`hm-holo-${dir}`}
                aria-expanded={look === dir}
                aria-label={label}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setLook(dir); }}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse') hideSoon(); }}
                onClick={() => {
                  // Touch / pen: tap toggles. Mouse: hover already opened it.
                  if (lastPointer.current !== 'mouse' && lookRef.current === dir) setLook(null);
                  else setLook(dir);
                }}
                onFocus={() => { if (lastPointer.current === 'keyboard') setLook(dir); }}
                onBlur={(e) => { if (!isInside(e.relatedTarget)) hideSoon(); }}
              />
            ))}
          </div>
          <p className="hm-hero__hint" aria-hidden="true">
            <span className="hm-hero__hint-dot" />
            <span className="hm-hero__hint-mouse">hover my face</span>
            <span className="hm-hero__hint-touch">tap my face</span>
          </p>
          <p className="hm-hero__bubble" aria-hidden="true">
            <span><TypingText text={command} reduced={reduced} /></span>
            <span className="hm-hero__caret">_</span>
          </p>
          <span className="sr-only" role="status">{look ? STATUS[look] : ''}</span>
        </figure>

        <div className="hm-holo" ref={holoRef}>
          <section {...panelProps('left', 'Club stats')}>
            <p className="hm-holo__label">// stats --live</p>
            <div className="hm-holo__stats">
              {stats.map((s) => (
                <div className="hm-holo__stat" key={s.label}>
                  <CountUp className="hm-holo__num" value={s.value} suffix={s.suffix} duration={900} run={look === 'left'} />
                  <span className="hm-holo__k">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section {...panelProps('center', 'Who are we')}>
            <p className="hm-holo__label">// whoami</p>
            <h2 className="hm-holo__heading">Who are we?</h2>
            <p className="hm-about-lead hm-about-lead--panel">{CONFIG.aboutLead}</p>
            <p className="hm-holo__text">{CONFIG.about || CONFIG.description}</p>
            <Link className="hm-holo__link" to="/team">Meet the team <span aria-hidden="true">→</span></Link>
          </section>

          <section {...panelProps('right', 'Upcoming event')}>
            <p className="hm-holo__label">// events --next</p>
            <div className="hm-holo__event">
              <div className="hm-holo__thumb"><Media src={ev.image} alt="" label=" " /></div>
              <div>
                <p className="hm-holo__date">{ev.date}</p>
                <h2 className="hm-holo__title">{ev.title}</h2>
                {ev.venue && <p className="hm-holo__venue">{ev.venue}</p>}
              </div>
            </div>
            {ev.blurb && <p className="hm-holo__text">{ev.blurb}</p>}
            <Button href={ev.registerUrl || '#'} className="hm-holo__cta">
              Register now <ArrowUpRight aria-hidden="true" />
            </Button>
          </section>
        </div>
      </div>

      <div className="hm-hero__ui">
        <div className="container-site hm-hero__layout">
          <div className="hm-hero__intro">
            <p className="hm-hero__motto hm-a" style={{ '--i': 0 }}>Who are we?</p>
            <div className="hm-hero__about hm-a" style={{ '--i': 1 }}>
              <p className="hm-about-lead">{CONFIG.aboutLead}</p>
              <p className="hm-hero__tagline">{CONFIG.about || CONFIG.description}</p>
            </div>
          </div>

          <div className="hm-hero__cards">
            {ev?.title && (
              <div className="hm-hero__next" ref={nextRef}>
                <p className="hm-mini-label hm-a" style={{ '--i': 2 }}>// Next event</p>
                <SmartLink to={ev.link || '/events'} className="hm-next hm-a" style={{ '--i': 2 }} aria-label={`Next event: ${ev.title}, ${ev.date}`}>
                  <span className="hm-next__thumb"><Media src={ev.image} alt="" label=" " /></span>
                  <span className="hm-next__arrow" aria-hidden="true"><ArrowUpRight /></span>
                  <span className="hm-next__meta">
                    <span className="hm-next__date">{ev.date}</span>
                    <span className="hm-next__title">{ev.title}</span>
                  </span>
                </SmartLink>
              </div>
            )}
            <div className="hm-hero__stats" ref={statsRef}>
              {stats.map((s, i) => (
                <div className="hm-stat hm-a" style={{ '--i': 3 + i }} key={s.label}>
                  <CountUp className="hm-stat__num" value={s.value} suffix={s.suffix} delay={900} />
                  <span className="hm-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
