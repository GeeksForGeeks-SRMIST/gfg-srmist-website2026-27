import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import JoinDialog from '../join/JoinDialog';

export default function Layout() {
  const [joinOpen, setJoinOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const mainRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (hash) return;  
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <Navbar onJoin={() => setJoinOpen(true)} />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer onJoin={() => setJoinOpen(true)} />
      <JoinDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
}
