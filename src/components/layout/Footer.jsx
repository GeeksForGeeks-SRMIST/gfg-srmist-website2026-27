import { Mail, Phone, Send } from 'lucide-react';
import { CONFIG } from '../../config';
import { telHref } from '../../lib/utils';
import { useContact } from '../contact/ContactProvider';
import { SOCIAL_BRANDS } from '../ui/Social';

const contactLink =
  'inline-flex min-h-10 items-center gap-2 text-[13.5px] text-text/85 transition-colors hover:text-green-bright ' +
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-green-bright';

// Slim see-through black footer strip: social links on one side, contact details on the other
export default function Footer() {
  const { openContact } = useContact();
  const socials = Object.entries(SOCIAL_BRANDS).filter(([name]) => CONFIG.socials?.[name]);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black/60 backdrop-blur-md">
      <div className="container-site relative flex flex-col items-center gap-4 py-5 md:flex-row md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-muted">Follow us on</p>
          <ul className="flex items-center gap-2.5">
            {socials.map(([name, s]) => (
              <li key={name}>
                <a
                  href={CONFIG.socials[name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GeeksforGeeks SRMIST on ${s.label} (opens in a new tab)`}
                  title={s.label}
                  className={`grid size-10 place-items-center rounded-xl text-white transition-[translate,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,.8)] [&_svg]:size-5 ${s.bg}`}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul aria-label="Contact" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:justify-end">
          <li><a className={contactLink} href={`mailto:${CONFIG.email}`}><Mail aria-hidden="true" /><span className="break-all">{CONFIG.email}</span></a></li>
          <li><a className={contactLink} href={telHref(CONFIG.phone)}><Phone aria-hidden="true" />{CONFIG.phone}</a></li>
          <li>
            <button type="button" className={`${contactLink} cursor-pointer`} aria-haspopup="dialog" onClick={(e) => openContact(e.currentTarget)}>
              <Send aria-hidden="true" />Send a message
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
