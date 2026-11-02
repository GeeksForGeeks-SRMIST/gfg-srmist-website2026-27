import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { CONFIG } from '../../config';
import { asset, cn, isExternal } from '../../lib/utils';
import useReducedMotion from '../../hooks/useReducedMotion';
import Media from '../../components/ui/Media';
import CountUp from '../../components/ui/CountUp';
import RegisterButton from '../../components/ui/RegisterButton';

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
  const trackingRef = useRef(false);   // any mouse (at any width): panels follow the robot's gaze instead of hover zones

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
    // Gaze: -1..1 on each axis, worked out from the angle between the robot's eyes and the pointer
    const gazeTarget = { x: 0, y: 0 };
    const gaze = { x: 0, y: 0 };
    let eyes = null;   // cached screen position of the point between the robot's eyes
    let heroBox = null;
    let robotBox = null;   // the robot plus a small margin: the only area where looking around opens panels
    let nearRobot = false;
    let overPanel = false;
    let scrollY = 0;
    let raf = 0;
    let parallax = false;   // title / robot / card drift: only on the wide desktop layout

    const ROBOT_MARGIN = 40;
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const measureEyes = () => {
      const r = robot?.getBoundingClientRect();
      eyes = r && r.width ? { x: r.left + r.width * 0.5, y: r.top + r.height * 0.314 } : null;
      robotBox = r && r.width ? { l: r.left - ROBOT_MARGIN, r: r.right + ROBOT_MARGIN, t: r.top - ROBOT_MARGIN, b: r.bottom } : null;
      heroBox = hero?.getBoundingClientRect() || null;
    };
    // Near the robot, open the panel it's looking at: right = next event, left = stats, straight ahead = who we are.
    // Further away it only follows the pointer with its head and eyes. An open panel stays open while the
    // pointer is on it, so its buttons can be clicked. Slightly different thresholds for opening and closing
    // stop it flickering at the edges.
    const followGaze = () => {
      if (!trackingRef.current || overPanel) return;
      const now = lookRef.current;
      const { x, y } = gaze;
      let next = null;
      if (nearRobot) {
        if (now === 'right' && x > 0.2) next = 'right';
        else if (now === 'left' && x < -0.2) next = 'left';
        else if (now === 'center' && Math.abs(x) < 0.3 && y > -0.42) next = 'center';
        else if (x > 0.3) next = 'right';
        else if (x < -0.3) next = 'left';
        else if (Math.abs(x) < 0.12 && y > -0.32) next = 'center';
      }
      if (next !== now) setLook(next);
    };
    const aimAt = (px, py) => {
      if (!eyes) measureEyes();
      if (!eyes) return;
      // Treat the screen as a wall in front of the robot: the further the pointer, the bigger the angle
      const depth = window.innerWidth * 0.55;
      gazeTarget.x = clamp(Math.atan2(px - eyes.x, depth) / Math.atan2(window.innerWidth * 0.5, depth));
      gazeTarget.y = clamp(Math.atan2(py - eyes.y, depth) / Math.atan2(window.innerHeight * 0.6, depth));
    };

    const apply = () => {
      const h = hero?.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, scrollY / h));
      const { x: mx, y: my } = cur;
      if (parallax && title) {
        title.style.transform = `translate3d(${(mx * 10).toFixed(2)}px,${(my * 10).toFixed(2)}px,0) scale(${(1 - p * 0.1).toFixed(4)})`;
        title.style.opacity = (1 - p * 0.9).toFixed(3);
      }
      if (robot) {
        if (parallax) {
          robot.style.transform = `translate3d(${(-mx * 18).toFixed(2)}px,${(-my * 18 + scrollY * 0.3).toFixed(2)}px,0)`;
          if (holo) holo.style.transform = robot.style.transform;
        }
        robot.style.setProperty('--hm-look-x', `${(gaze.x * 5).toFixed(2)}px`);
        robot.style.setProperty('--hm-look-y', `${(gaze.y * 4).toFixed(2)}px`);
      }
      if (hero) {
        hero.style.setProperty('--gx', gaze.x.toFixed(4));
        hero.style.setProperty('--gy', gaze.y.toFixed(4));
        hero.style.setProperty('--gax', Math.abs(gaze.x).toFixed(4));
        hero.style.setProperty('--gl', Math.max(0, -gaze.x).toFixed(4));
        hero.style.setProperty('--gr', Math.max(0, gaze.x).toFixed(4));
      }
      if (parallax) cards.forEach((el) => { el.style.transform = `translate3d(${(mx * 6).toFixed(2)}px,${(my * 6).toFixed(2)}px,0)`; });
    };
    const frame = () => {
      raf = 0;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      gaze.x += (gazeTarget.x - gaze.x) * 0.18;
      gaze.y += (gazeTarget.y - gaze.y) * 0.18;
      apply();
      followGaze();
      const moving = (a, b) => Math.abs(a.x - b.x) > 0.001 || Math.abs(a.y - b.y) > 0.001;
      if (moving(target, cur) || moving(gazeTarget, gaze)) request();
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onPointer = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      const px = e.clientX;
      const py = e.clientY;
      aimAt(px, py);
      // Panels only open near the robot (and never over the navbar or further down the page)
      const inHero = !!heroBox && py > heroBox.top + 80 && py < heroBox.bottom;
      nearRobot = inHero && !!robotBox && px > robotBox.l && px < robotBox.r && py > robotBox.t && py < robotBox.b;
      const open = lookRef.current && panelRefs.current[lookRef.current];
      const pr = open ? open.getBoundingClientRect() : null;
      overPanel = !!pr && px >= pr.left && px <= pr.right && py >= pr.top && py <= pr.bottom;
      request();
    };
    const onScroll = () => {
      const y = window.scrollY;
      const h = hero?.offsetHeight || 0;
      if (y > h * 1.2 && scrollY > h * 1.2) return;
      scrollY = y;
      eyes = null;
      request();
    };
    const onResize = () => { eyes = null; };
    const onLeave = () => { target.x = 0; target.y = 0; gazeTarget.x = 0; gazeTarget.y = 0; nearRobot = false; overPanel = false; request(); };

    // Touch screens: while a finger is on the hero the head follows it, then it turns back to the front
    // shortly after the finger lifts. Tapping the left / middle / right of the robot still opens its panels.
    let touchTimer = 0;
    let touching = false;
    const onTouchDown = (e) => {
      if (e.pointerType === 'mouse') return;
      clearTimeout(touchTimer);
      touching = true;
      measureEyes();
      hero?.setAttribute('data-tracking', '');
      aimAt(e.clientX, e.clientY);
      request();
    };
    const onTouchMove = (e) => {
      if (!touching || e.pointerType === 'mouse') return;
      aimAt(e.clientX, e.clientY);
      request();
    };
    const onTouchUp = (e) => {
      if (!touching || e.pointerType === 'mouse') return;
      touching = false;
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        gazeTarget.x = 0;
        gazeTarget.y = 0;
        request();
        // once the head is back in front, hand over to the tap-zone poses again
        touchTimer = setTimeout(() => { if (!touching) hero?.removeAttribute('data-tracking'); }, 500);
      }, 900);
    };
    const touchOff = () => {
      clearTimeout(touchTimer);
      touching = false;
      hero?.removeEventListener('pointerdown', onTouchDown);
      window.removeEventListener('pointermove', onTouchMove);
      window.removeEventListener('pointerup', onTouchUp);
      window.removeEventListener('pointercancel', onTouchUp);
    };
    const reset = () => {
      target.x = target.y = cur.x = cur.y = 0;
      gazeTarget.x = gazeTarget.y = gaze.x = gaze.y = 0;
      scrollY = 0;
      [title, robot, holo, ...cards].forEach((el) => { if (el) { el.style.transform = ''; el.style.opacity = ''; } });
      robot?.style.removeProperty('--hm-look-x');
      robot?.style.removeProperty('--hm-look-y');
      hero?.removeAttribute('data-tracking');
      trackingRef.current = false;
      ['--gx', '--gy', '--gax', '--gl', '--gr'].forEach((v) => hero?.style.removeProperty(v));
    };

    // With a mouse the head follows the pointer at every width (narrow desktop windows included);
    // touch screens follow the finger while it's down, plus the tap zones. The parallax drift is only for the wide desktop layout.
    let mode = '';
    const setMode = () => {
      const track = finePointer.matches;
      const wide = desktop.matches;
      const next = `${track}/${wide}`;
      if (next === mode) return;
      mode = next;
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseleave', onLeave);
      touchOff();
      reset();
      parallax = wide;
      if (!track) {
        hero?.addEventListener('pointerdown', onTouchDown);
        window.addEventListener('pointermove', onTouchMove, { passive: true });
        window.addEventListener('pointerup', onTouchUp);
        window.addEventListener('pointercancel', onTouchUp);
      }
      if (!track && !wide) return;
      if (track) {
        window.addEventListener('pointermove', onPointer, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        hero?.setAttribute('data-tracking', '');   // head follows the exact pointer instead of the three zones (an attribute, so React's className updates don't wipe it)
        trackingRef.current = true;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      onScroll();
    };
    setMode();
    desktop.addEventListener('change', setMode);
    finePointer.addEventListener('change', setMode);
    return () => {
      desktop.removeEventListener('change', setMode);
      finePointer.removeEventListener('change', setMode);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseleave', onLeave);
      touchOff();
      cancelAnimationFrame(raf);
    };
  }, [reduced, setLook]);

  const panelProps = (dir, label) => ({
    id: `hm-holo-${dir}`,
    ref: (el) => { panelRefs.current[dir] = el; },
    'aria-label': label,
    inert: look !== dir,
    className: cn('hm-holo__panel', `hm-holo__panel--${dir}`, look === dir && 'is-active'),
    onPointerEnter: () => clearTimeout(hideTimer.current),
    onPointerLeave: (e) => { if (e.pointerType === 'mouse' && !trackingRef.current) hideSoon(); },
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
                onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !trackingRef.current) setLook(dir); }}
                onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !trackingRef.current) hideSoon(); }}
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
            <RegisterButton url={ev.registerUrl} className="hm-holo__cta">Register now</RegisterButton>
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
                <p className="hm-mini-label hm-a" style={{ '--i': 2 }}>// Upcoming event</p>
                <SmartLink to={ev.link || '/events'} className="hm-next hm-a" style={{ '--i': 2 }} aria-label={`Upcoming event: ${ev.title}, ${ev.date}`}>
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
