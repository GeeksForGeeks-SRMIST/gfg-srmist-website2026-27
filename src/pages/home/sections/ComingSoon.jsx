import { SectionLabel } from '../../../components/ui/primitives';

// Temporary stand-in used by each home section until its real content is built
export default function ComingSoon({ id, label, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-b border-line py-20 md:py-30">
      <div className="container-site flex flex-wrap items-end justify-between gap-6">
        <SectionLabel>{label}</SectionLabel>
        <h2
          id={`${id}-title`}
          className="font-display text-[clamp(48px,9vw,128px)] font-light leading-[.85] tracking-[-.05em] lowercase text-transparent [-webkit-text-stroke:1px_rgba(217,220,218,.3)]"
        >
          coming soon
        </h2>
        {children}
      </div>
    </section>
  );
}
