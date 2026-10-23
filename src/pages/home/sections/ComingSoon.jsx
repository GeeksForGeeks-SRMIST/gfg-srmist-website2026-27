import { SectionLabel } from '../../../components/ui/primitives';
export default function ComingSoon({ id, label, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-b border-line py-12 sm:py-16 md:py-20 lg:py-30">
      <div className="container-site flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <SectionLabel>{label}</SectionLabel>
        <h2
          id={`${id}-title`}
          className="font-display text-[clamp(36px,10vw,128px)] font-light leading-[.85] tracking-[-.05em] lowercase text-transparent [-webkit-text-stroke:1px_rgba(217,220,218,.3)] sm:text-[clamp(48px,9vw,128px)]"
        >
          Coming soon
        </h2>
        {children}
      </div>
    </section>
  );
}
