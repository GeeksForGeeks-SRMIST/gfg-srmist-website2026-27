import { useOutletContext } from 'react-router';
import { ArrowUpRight, Send } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Reveal from '../../../components/ui/Reveal';
import { SectionLabel } from '../../../components/ui/primitives';
import { useContact } from '../../../components/contact/ContactProvider';

// Raushan (#3): final "Join us" section.
// onJoin opens the same Join dialog as the navbar's Join Now button.
export default function JoinCTA() {
  const { onJoin } = useOutletContext();
  const { openContact } = useContact();

  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="border-b border-line py-20 md:py-28">
      <div className="container-site">
        <Reveal className="relative overflow-hidden rounded-[28px] border border-green-bright/30 bg-surface bg-[radial-gradient(70%_120%_at_100%_50%,rgba(70,196,107,.18),transparent_70%)] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <SectionLabel>// 06 — Join us</SectionLabel>
          <h2
            id="final-cta-title"
            className="mt-4 max-w-3xl font-display text-[clamp(40px,6.5vw,88px)] font-light leading-[.95] tracking-[-.045em] lowercase text-display-light"
          >
            your next chapter <span className="text-green-bright">starts here.</span>
          </h2>
          <p className="mt-5 max-w-xl text-muted">
            Coders, designers, organisers, storytellers: there’s a seat for you. Come learn, build and ship things with us.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onJoin} aria-haspopup="dialog" className="min-h-12 px-7">
              Join the crew <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button variant="ghost" onClick={(e) => openContact(e.currentTarget)} aria-haspopup="dialog" className="min-h-12 px-7">
              Say hello <Send aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
