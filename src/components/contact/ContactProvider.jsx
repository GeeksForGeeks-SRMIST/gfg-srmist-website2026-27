import { createContext, useCallback, useContext, useState } from 'react';
import { Send } from 'lucide-react';
import { CONFIG } from '../../config';
import { telHref } from '../../lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { SectionLabel } from '../ui/primitives';
import { SocialLinks } from '../ui/Social';
import { useToast } from '../ui/Toast';

const ContactContext = createContext({ openContact: () => {} });
export const useContact = () => useContext(ContactContext);

const fieldLabel = 'font-mono text-[11px] font-medium leading-none tracking-[.14em] uppercase text-muted';
const fieldInput =
  'w-full min-h-12 rounded-[10px] border border-border bg-white/[.03] px-3.5 py-3 text-[15px] text-text placeholder:text-muted/70 ' +
  'transition-[border-color,box-shadow,background-color] duration-250 hover:border-white/20 ' +
  'focus:border-green-bright/80 focus:bg-green/6 focus:shadow-[0_0_0_3px_rgba(70,196,107,.18)] focus:outline-none';

function ContactForm({ onDone }) {
  const toast = useToast();
  const onSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    onDone();
    toast("Thanks! We'll get back to you soon.");
  };
  return (
    <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2">
        <span className={fieldLabel}>Name</span>
        <input className={fieldInput} name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required />
      </label>
      <label className="grid gap-2">
        <span className={fieldLabel}>Email</span>
        <input className={fieldInput} name="email" type="email" autoComplete="email" placeholder="you@college.edu" required />
      </label>
      <label className="grid gap-2">
        <span className={fieldLabel}>Phone</span>
        <input className={fieldInput} name="phone" type="tel" autoComplete="tel" placeholder="+91" />
      </label>
      <label className="grid gap-2">
        <span className={fieldLabel}>Subject</span>
        <select
          className={`${fieldInput} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_viewBox='0_0_24_24'_fill='none'_stroke='%2346C46B'_stroke-width='2'_stroke-linecap='round'_stroke-linejoin='round'%3E%3Cpath_d='m6_9_6_6_6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10 [&>option]:bg-bg-2`}
          name="subject"
          defaultValue="General"
        >
          <option>General</option>
          <option>Collaboration</option>
          <option>Sponsorship</option>
          <option>Joining</option>
        </select>
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className={fieldLabel}>Message</span>
        <textarea className={`${fieldInput} min-h-[120px] resize-y`} name="message" rows={4} placeholder="Tell us what you have in mind…" required />
      </label>
      <Button type="submit" className="mt-1 justify-self-start">
        Submit <Send aria-hidden="true" />
      </Button>
    </form>
  );
}

export function ContactProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <Modal open={open} onClose={close} labelledBy="contact-title" initialFocus="input">
        <div className="grid md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="px-5 pb-6 pt-7 md:p-10">
            <SectionLabel>// Contact</SectionLabel>
            <h2 id="contact-title" className="mt-3.5 font-display text-[clamp(36px,5vw,56px)] font-light leading-[.95] tracking-[-.045em] lowercase text-display-light">
              Get in touch
            </h2>
            <p className="mt-2.5 text-[15px] text-muted">Questions, collabs or sponsorships — drop us a line.</p>
            {CONFIG.contactFormEmbedUrl ? (
              <div className="mt-6 overflow-hidden rounded-card border border-border bg-bg-2">
                <iframe
                  src={CONFIG.contactFormEmbedUrl}
                  title="Contact form"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="block h-[min(70vh,640px)] w-full border-0"
                />
              </div>
            ) : (
              <ContactForm onDone={close} />
            )}
          </div>
          <aside
            aria-label="Other ways to reach us"
            className="flex flex-col gap-[26px] border-t border-line bg-[radial-gradient(90%_60%_at_100%_100%,rgba(70,196,107,.12),transparent_70%)] px-5 pb-7 pt-6 md:border-l md:border-t-0 md:px-8 md:pb-10 md:pt-[88px]"
          >
            <div>
              <span className={`mb-2 block ${fieldLabel}`}>Email</span>
              <a className="break-words text-[15px] hover:text-green-bright" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
            </div>
            <div>
              <span className={`mb-2 block ${fieldLabel}`}>Phone</span>
              <a className="text-[15px] hover:text-green-bright" href={telHref(CONFIG.phone)}>{CONFIG.phone}</a>
            </div>
            <div>
              <span className={`mb-2 block ${fieldLabel}`}>Follow</span>
              <SocialLinks socials={CONFIG.socials} />
            </div>
          </aside>
        </div>
      </Modal>
    </ContactContext.Provider>
  );
}
