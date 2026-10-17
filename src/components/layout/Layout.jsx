import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { CONFIG, NAV_LINKS } from '../../config';
import Navbar from './Navbar';
import Footer from './Footer';
import JoinDialog from '../join/JoinDialog';

export default function Layout() {
  const [joinOpen, setJoinOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const mainRef = useRef(null);
  const first = useRef(true);
  const openJoin = () => setJoinOpen(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  // Browser tab title, e.g. "Team · GeeksforGeeks Student Chapter · SRMIST"
  useEffect(() => {
    const site = `${CONFIG.clubName} · ${CONFIG.college}`;
    const page = NAV_LINKS.find((l) => l.to === (pathname.replace(/\/+$/, '') || '/'));
    document.title = !page ? `Page not found · ${site}` : page.to === '/' ? site : `${page.label} · ${site}`;
  }, [pathname]);

  return (
    <>
      <Navbar onJoin={openJoin} />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet context={{ onJoin: openJoin }} />
      </main>
      <Footer onJoin={openJoin} />
      <JoinDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
}
