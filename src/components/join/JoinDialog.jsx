import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CONFIG } from '../../config';
import { GeeMascot } from '../chatbot/GeeMascot';
import { SOCIAL_BRANDS } from '../ui/Social';

// Recruitment is closed: a sad Mr. Gee says so in a speech bubble
export default function JoinDialog({ open, onClose }) {
  const insta = SOCIAL_BRANDS.instagram;
  return (
    <Modal open={open} onClose={onClose} labelledBy="join-title" width={440} tint="rgba(0,0,0,.94)">
      <div className="px-5 pb-6 pt-7 sm:px-7">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[#ff6b6b] shadow-[0_0_8px_#ff6b6b]" />
          Recruitment closed
        </p>

        <div className="mt-6 flex items-start gap-3">
          <GeeMascot mood="sad" className="h-[172px] w-[90px] shrink-0" />

          {/* speech bubble, tail pointing at Mr. Gee */}
          <div className="relative mt-3 rounded-2xl bg-[#f4f1ea] px-4 py-3.5 text-[#1c1f1d] shadow-[0_14px_30px_-12px_rgba(0,0,0,.8)]">
            <span aria-hidden="true" className="absolute -left-2 top-5 size-4 rotate-45 rounded-[3px] bg-[#f4f1ea]" />
            <h2 id="join-title" className="relative font-display text-[19px] font-semibold leading-tight tracking-[-.02em]">
              Sorry, we're full!
            </h2>
            <p className="relative mt-1.5 text-[14px] leading-snug text-[#3d423f]">
              All spots for this year are taken. Come back next year and I'll save you a seat.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          {CONFIG.socials?.instagram && (
            <a
              href={CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-text/80 transition-colors hover:text-white"
            >
              <span aria-hidden="true" className={`grid size-7 place-items-center rounded-lg text-white [&_svg]:size-4 ${insta.bg}`}>{insta.icon}</span>
              Follow for the next round
            </a>
          )}
          <Button onClick={onClose} className="min-h-11 w-full sm:w-auto">Okay, see you!</Button>
        </div>
      </div>
    </Modal>
  );
}
