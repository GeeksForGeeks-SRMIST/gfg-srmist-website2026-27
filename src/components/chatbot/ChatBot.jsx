import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, AtSign, CalendarDays, Layers, Mail, RotateCcw, Send, UserPlus, Users, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useContact } from '../contact/ContactProvider';
import { SOCIAL_BRANDS } from '../ui/Social';
import { DEFAULT_CHIPS, GREETING, getReply } from './knowledge';
import { GeeHead, GeeMascot } from './GeeMascot';

// Topic tiles shown on the welcome screen; each one asks Mr. Gee a question
const TOPICS = [
  { icon: Layers, label: 'Domains', q: 'What do you do?' },
  { icon: Users, label: 'Team', q: 'Who is on the team?' },
  { icon: CalendarDays, label: 'Events', q: 'Upcoming event' },
  { icon: Mail, label: 'Contact', q: 'Contact us' },
  { icon: AtSign, label: 'Socials', q: 'Social media' },
  { icon: UserPlus, label: 'Join us', q: 'Can I join the club?' },
];

const firstMessage = () => ({ id: 0, from: 'bot', text: GREETING, links: [], chips: DEFAULT_CHIPS });

const linkCls =
  'inline-flex min-h-7 items-center gap-1 rounded-full border border-green-bright/35 bg-green/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[.06em] uppercase text-green-bright transition-colors hover:border-green-bright hover:bg-green/20 hover:text-white';

// Social links: the platform's own coloured logo next to its name
function BrandChip({ link }) {
  const b = SOCIAL_BRANDS[link.brand];
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow us on ${link.label} (opens in a new tab)`}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/[.1] bg-white/[.04] py-1 pl-1 pr-2.5 text-[11.5px] font-medium text-text/90 transition-[border-color,background-color,translate] duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.08] hover:text-white"
    >
      <span aria-hidden="true" className={cn('grid size-6 place-items-center rounded-full text-white [&_svg]:size-3.5', b.bg)}>{b.icon}</span>
      {link.label}
    </a>
  );
}

function LinkChip({ link, onAction }) {
  if (link.brand && SOCIAL_BRANDS[link.brand]) return <BrandChip link={link} />;
  const inner = <>{link.label}<ArrowUpRight aria-hidden="true" className="size-3" /></>;
  if (link.to) return <Link to={link.to} className={linkCls}>{inner}</Link>;
  if (link.href) {
    const web = /^https?:/.test(link.href);
    return <a href={link.href} className={linkCls} {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
  }
  return <button type="button" onClick={() => onAction(link.action)} className={cn(linkCls, 'cursor-pointer')}>{inner}</button>;
}

// A floating little helper (bottom right) that answers questions from the site's own data
export default function ChatBot({ onJoin }) {
  const { openContact } = useContact();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(() => [firstMessage()]);
  const [lift, setLift] = useState(0);
  const log = useRef(null);
  const input = useRef(null);
  const button = useRef(null);
  const timer = useRef(0);
  const nextId = useRef(1);

  // A small "hello" bubble a couple of seconds after the page loads, until the chat has been opened
  useEffect(() => {
    const on = setTimeout(() => setHint(true), 2500);
    const off = setTimeout(() => setHint(false), 11000);
    return () => { clearTimeout(on); clearTimeout(off); };
  }, []);

  // Keep Mr. Gee above the footer strip instead of covering its links
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const f = document.querySelector('footer');
      const top = f ? f.getBoundingClientRect().top : window.innerHeight;
      setLift(Math.max(0, Math.round(window.innerHeight - top)));
    };
    const onChange = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => { window.removeEventListener('scroll', onChange); window.removeEventListener('resize', onChange); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, typing, open]);
  useEffect(() => { if (open) { setHint(false); input.current?.focus({ preventScroll: true }); } }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = useCallback((question) => {
    const q = question.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: q }]);
    setText('');
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const r = getReply(q);
      setMessages((m) => [...m, { id: nextId.current++, from: 'bot', text: r.text, links: r.links, chips: r.chips || DEFAULT_CHIPS }]);
      setTyping(false);
    }, 450);
  }, [typing]);

  const restart = () => {
    clearTimeout(timer.current);
    setTyping(false);
    setText('');
    setMessages([firstMessage()]);
    input.current?.focus({ preventScroll: true });
  };

  const onAction = (action) => {
    setOpen(false);
    if (action === 'contact') openContact();
    if (action === 'join') onJoin?.();
  };

  const close = () => { setOpen(false); button.current?.focus(); };
  const last = messages[messages.length - 1];
  const welcome = messages.length === 1 && !typing;

  return (
    <div className="pointer-events-none fixed right-3 z-[150] flex flex-col items-end gap-2 md:right-5" style={{ bottom: `${12 + lift}px` }}>
      {open && (
        <section
          id="gee-panel"
          role="dialog"
          aria-label="Chat with Mr. Gee"
          onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
          className="pointer-events-auto flex h-[min(390px,calc(100svh-180px))] w-[min(290px,calc(100vw-24px))] animate-[gee-pop_.28s_ease-out] flex-col overflow-hidden rounded-[18px] border border-green-bright/25 bg-black shadow-[0_30px_70px_-20px_rgba(0,0,0,.95),0_0_36px_-16px_rgba(70,196,107,.45)]"
        >
          {/* header */}
          <header className="relative flex items-center gap-2 border-b border-white/[.07] px-3 py-2">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_140%_at_0%_0%,rgba(70,196,107,.14),transparent_60%)]" />
            <span className="relative">
              <GeeHead className="size-8" />
              <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-black bg-neon shadow-[0_0_6px_var(--neon)]" />
            </span>
            <div className="relative min-w-0 flex-1">
              <p className="font-display text-[14px] font-semibold leading-tight tracking-[-.02em] text-white">Mr. Gee</p>
              <p className="mt-0.5 font-mono text-[10px] tracking-[.04em] text-green-bright/85">
                Head of Hellos<span aria-hidden="true" className="ml-px animate-[gee-caret_1s_steps(1)_infinite]">_</span>
              </p>
            </div>
            <button type="button" onClick={restart} title="Start over" aria-label="Start a new chat" className="relative grid size-7 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-white/[.06] hover:text-white">
              <RotateCcw className="size-3.5" aria-hidden="true" />
            </button>
            <button type="button" onClick={close} title="Close" aria-label="Close chat" className="relative grid size-7 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-white/[.06] hover:text-white">
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          {/* conversation */}
          <div ref={log} role="log" aria-live="polite" className="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto bg-black px-2.5 py-2.5">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex animate-[gee-msg_.25s_ease-out] gap-1.5', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                {m.from === 'bot' && <GeeHead className="mt-0.5 size-5 shrink-0" />}
                <div className="min-w-0 max-w-[84%]">
                  <p
                    className={cn(
                      'whitespace-pre-line break-words rounded-2xl px-2.5 py-1.5 text-[12px] leading-relaxed',
                      m.from === 'user' ? 'rounded-br-md bg-green text-white' : 'rounded-bl-md border border-white/[.08] bg-[#0c110e] text-text/90',
                    )}
                  >
                    {m.text}
                  </p>
                  {m.links?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.links.map((l) => <LinkChip key={l.label + (l.to || l.href || l.action)} link={l} onAction={onAction} />)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* welcome: tap a topic */}
            {welcome && (
              <div className="mt-1 grid animate-[gee-msg_.35s_ease-out] grid-cols-2 gap-1.5 pl-[26px]">
                {TOPICS.map(({ icon: Icon, label, q }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(q)}
                    className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/[.08] bg-[#0a0f0c] px-1.5 py-1.5 text-left transition-[border-color,background-color,translate] duration-200 hover:-translate-y-0.5 hover:border-green-bright/50 hover:bg-[#0d1611]"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-green/15 text-green-bright">
                      <Icon className="size-3" aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-[11.5px] text-text/90">{label}</span>
                    <ArrowRight aria-hidden="true" className="size-3 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {typing && (
              <div className="flex items-center gap-2" aria-label="Mr. Gee is typing">
                <GeeHead className="size-5 shrink-0" />
                <span className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[.08] bg-[#0c110e] px-2.5 py-2">
                  {[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-[gee-dot_1s_ease-in-out_infinite] rounded-full bg-green-bright" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </span>
              </div>
            )}
          </div>

          {/* follow-up suggestions: one swipeable row */}
          {!welcome && !typing && last?.from === 'bot' && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-white/[.07] px-2.5 py-1.5">
              {(last.chips || DEFAULT_CHIPS).map((c) => (
                <button key={c} type="button" onClick={() => send(c)} className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-white/[.1] bg-white/[.03] px-2 py-0.5 text-[11px] text-text/85 transition-colors hover:border-green-bright/60 hover:text-green-bright">
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-1.5 border-t border-white/[.07] bg-black p-2">
            <label htmlFor="gee-input" className="sr-only">Ask Mr. Gee a question</label>
            <input
              id="gee-input"
              ref={input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              autoComplete="off"
              placeholder="Ask Mr. Gee anything…"
              className="min-h-9 min-w-0 flex-1 rounded-xl border border-white/[.1] bg-[#0a0d0b] px-2.5 text-[12px] text-text placeholder:text-muted/70 focus:border-green-bright/70 focus:shadow-[0_0_0_3px_rgba(70,196,107,.15)] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!text.trim() || typing}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl bg-green text-white transition-[background-color,scale,opacity] duration-200 enabled:hover:scale-105 enabled:hover:bg-green-bright disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <div className="relative flex flex-col items-end">
        {hint && !open && (
          <p className="pointer-events-none absolute bottom-[78%] right-[72%] w-max max-w-[200px] animate-[gee-pop_.3s_ease-out] rounded-2xl rounded-br-sm bg-[#f4f1ea] px-3.5 py-2 text-[13px] font-medium leading-snug text-[#1c1f1d] shadow-lg">
            Hi! I'm Mr. Gee. Ask me anything about the club
          </p>
        )}
        <button
          ref={button}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat with Mr. Gee' : 'Chat with Mr. Gee, the GfG SRMIST assistant'}
          aria-expanded={open}
          aria-controls="gee-panel"
          className="gee-btn pointer-events-auto cursor-pointer rounded-2xl p-1 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-bright"
        >
          <GeeMascot className="block h-[92px] w-12 md:h-[108px] md:w-14" />
        </button>
      </div>
    </div>
  );
}
