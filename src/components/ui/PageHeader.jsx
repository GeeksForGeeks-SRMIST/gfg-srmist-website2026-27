import { SectionLabel } from './primitives';

export default function PageHeader({ label, title, outline, subtitle }) {
  return (
    <header className="relative isolate flex min-h-[60svh] items-end overflow-hidden border-b border-line pb-16 pt-[calc(var(--nav-h)+48px)]">
      <div className="container-site relative">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="relative mt-[22px] font-display text-[clamp(56px,12vw,160px)] font-light leading-[.85] tracking-[-.05em] lowercase text-display-light [overflow-wrap:anywhere]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[.04em] -bottom-[.18em] -z-10 whitespace-nowrap text-[2.1em] leading-[.85] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.07)]"
          >
            {outline || title}
          </span>
          {title}
        </h1>
        {subtitle && <p className="mt-7 max-w-[560px] text-[17px] text-muted">{subtitle}</p>}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[8vw] -top-[12vw] -z-10 aspect-square w-[38vw] max-w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(70,196,107,.28),rgba(70,196,107,.08)_55%,transparent)]"
      />
    </header>
  );
}
