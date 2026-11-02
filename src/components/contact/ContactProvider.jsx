import { createContext, useCallback, useContext, useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { CONFIG } from '../../config';
import { telHref } from '../../lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { SOCIAL_BRANDS } from '../ui/Social';
import { useToast } from '../ui/Toast';

const ContactContext = createContext({ openContact: () => {} });
export const useContact = () => useContext(ContactContext);

const fieldLabel = 'font-mono text-[10px] font-medium leading-none tracking-[.14em] uppercase text-muted';
const fieldInput =
  'w-full min-h-10 rounded-[10px] border border-white/10 bg-white/[.03] px-3 py-2 text-[14px] text-text placeholder:text-muted/70 ' +
  'transition-[border-color,box-shadow,background-color] duration-250 hover:border-white/20 ' +
  'focus:border-green-bright/80 focus:bg-green/6 focus:shadow-[0_0_0_3px_rgba(70,196,107,.18)] focus:outline-none';

// One column: name, email, subject and message, then a full-width send button.
// With CONFIG.contactSheetUrl set, each message is posted to a Google Sheet (see apps-script/contact-form.gs).
function ContactForm({ onDone }) {
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (CONFIG.contactSheetUrl) {
      setSending(true);
      try {
        // Apps Script answers through a redirect without CORS headers, so the response can't be read;
        // a network failure still throws and lands in catch
        await fetch(CONFIG.contactSheetUrl, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
      } catch {
        setSending(false);
        toast(`Couldn't send that. Please email us at ${CONFIG.email}.`);
        return;
      }
      setSending(false);
    }
    form.reset();
    onDone();
    toast("Thanks! We'll get back to you soon.");
  };
  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-3">
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Name</span>
        <input className={fieldInput} name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Email</span>
        <input className={fieldInput} name="email" type="email" autoComplete="email" placeholder="you@college.edu" required />
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Subject</span>
        <select
          className={`${fieldInput} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_viewBox='0_0_24_24'_fill='none'_stroke='%2346C46B'_stroke-width='2'_stroke-linecap='round'_stroke-linejoin='round'%3E%3Cpath_d='m6_9_6_6_6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9 [&>option]:bg-bg-2`}
          name="subject"
          defaultValue="General"
        >
          <option>General</option>
          <option>Collaboration</option>
          <option>Sponsorship</option>
          <option>Joining</option>
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className={fieldLabel}>Message</span>
        <textarea className={`${fieldInput} min-h-[88px] resize-y`} name="message" rows={3} placeholder="Tell us what you have in mind…" required />
      </label>
      <Button type="submit" disabled={sending} className="mt-1 min-h-11 w-full">
        {sending ? 'Sending…' : 'Send message'} <Send aria-hidden="true" />
      </Button>
    </form>
  );
}

// Compact contact card: a small "Contact" heading above a single-column form
export function ContactProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const socials = Object.entries(SOCIAL_BRANDS).filter(([name]) => CONFIG.socials?.[name]);

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <Modal open={open} onClose={close} labelledBy="contact-title" initialFocus="input" width={420} tint="rgba(0,0,0,.94)">
        <div className="px-5 pb-6 pt-7 sm:px-7">
          <h2 id="contact-title" className="flex items-center gap-2 font-mono text-[10px] font-normal tracking-[.18em] uppercase text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-green-bright shadow-[0_0_8px_#46c46b]" />
            Contact
          </h2>

          {CONFIG.contactFormEmbedUrl ? (
            <div className="mt-5 overflow-hidden rounded-[14px] border border-white/10 bg-bg-2">
              <iframe
                src={CONFIG.contactFormEmbedUrl}
                title="Contact form"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="block h-[min(60vh,520px)] w-full border-0"
              />
            </div>
          ) : (
            <ContactForm onDone={close} />
          )}

          {/* other ways to reach us */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="grid gap-1 text-[12.5px] text-text/80">
              <a className="inline-flex items-center gap-1.5 break-all transition-colors hover:text-green-bright" href={`mailto:${CONFIG.email}`}>
                <Mail aria-hidden="true" className="size-3.5 shrink-0 text-green-bright" />{CONFIG.email}
              </a>
              <a className="inline-flex items-center gap-1.5 transition-colors hover:text-green-bright" href={telHref(CONFIG.phone)}>
                <Phone aria-hidden="true" className="size-3.5 shrink-0 text-green-bright" />{CONFIG.phone}
              </a>
            </div>
            <div className="flex gap-2">
              {socials.map(([name, s]) => (
                <a
                  key={name}
                  href={CONFIG.socials[name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GeeksforGeeks SRMIST on ${s.label} (opens in a new tab)`}
                  className={`grid size-8 place-items-center rounded-lg text-white transition-transform hover:-translate-y-0.5 [&_svg]:size-4 ${s.bg}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </ContactContext.Provider>
  );
}
