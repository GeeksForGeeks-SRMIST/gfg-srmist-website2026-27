import { ArrowDownRight } from 'lucide-react';
import { CONFIG } from '../../../config';
import { SectionLabel } from '../../../components/ui/primitives';
import CountUp from '../../../components/ui/CountUp';
import Reveal from '../../../components/ui/Reveal';
import { CORE_TEAM, DOMAIN_LEADS } from '../../team/team.data';
import SpeechBubbles from './SpeechBubbles';
import NeonSign from './NeonSign';

const TESTIMONIALS = [...CORE_TEAM, ...DOMAIN_LEADS].filter((member) => member.quote).slice(0, 3);

export default function Community() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="relative isolate overflow-hidden border-b border-line pb-16 md:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(217,220,218,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(217,220,218,.045) 1px, transparent 1px)',
          backgroundSize: 'min(8vw, 112px) min(8vw, 112px)',
          maskImage: 'linear-gradient(to bottom, black, transparent 100%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[18%] -z-10 size-[360px] rounded-full bg-green-bright/10 blur-[130px]" />

      <div className="container-site">
        <div className="flex flex-col border-x border-line/70">
          <Reveal className="grid min-h-12 grid-cols-2 items-center border-b border-line/70 px-4 font-mono text-[9px] tracking-[.14em] text-muted uppercase sm:grid-cols-3 sm:px-6">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
              GfG SRMIST
            </span>
            <span className="hidden justify-self-center sm:block">Learn · Build · Grow</span>
            <span className="justify-self-end">Community / 01</span>
          </Reveal>

          <div className="relative grid flex-1 grid-cols-1 grid-rows-[auto_1fr_auto] px-4 sm:px-6">
            <Reveal className="relative z-10 flex min-h-28 items-start justify-center pt-8 text-center sm:pt-10">
              <p className="max-w-[420px] text-sm leading-relaxed text-muted sm:text-base">
                A place to learn, create, and find your people.
                <span className="mt-1 block font-mono text-[10px] tracking-[.1em] text-muted/70 uppercase">
                  GeeksforGeeks Student Chapter · SRMIST
                </span> 
              </p>
            </Reveal>

            <div className="relative flex min-h-[260px] items-center justify-center py-12">
              <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line/70" />
              <Reveal className="relative z-10">
                <NeonSign id="community-title" />
              </Reveal>
            </div>

            <div className="grid gap-8 border-t border-line/70 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:py-8">
              <Reveal>
                <SectionLabel>Our community</SectionLabel>
                <p className="mt-3 max-w-[470px] text-sm leading-relaxed text-muted">
                  {CONFIG.description} Find your people, sharpen your skills, and turn ideas into things that work.
                </p>
                <a
                  href="#community-voices"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] font-medium tracking-[.1em] uppercase text-green-bright transition-colors hover:text-text"
                >
                  Meet the community <ArrowDownRight aria-hidden="true" className="size-4" />
                </a>
              </Reveal>

              <div role="group" aria-label="Community statistics" className="grid grid-cols-2 gap-6 sm:gap-8">
                {CONFIG.stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={index * 120} className="min-w-[100px] border-l border-green-bright/50 pl-4">
                    <CountUp
                      className="font-display text-[clamp(34px,5vw,58px)] font-semibold leading-none tracking-[-.06em] text-green-bright"
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={1400}
                      delay={index * 160}
                    />
                    <p className="mt-2 max-w-28 font-mono text-[9px] leading-relaxed tracking-[.1em] text-muted uppercase">
                      {stat.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="community-voices" className="scroll-mt-[calc(var(--nav-h)+16px)] border-t border-line pt-10 md:pt-14">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Made of many voices</SectionLabel>
              <h2 className="mt-3 font-display text-[clamp(34px,5vw,60px)] font-light leading-[.95] tracking-[-.05em] text-display-light">
                Learn from each other.
              </h2>
            </div>
            <p className="max-w-[280px] pb-1 font-mono text-xs leading-relaxed text-muted">
              Different paths, shared curiosity. Here’s what our members have to say.
            </p>
          </Reveal>

          <Reveal>
            <SpeechBubbles people={TESTIMONIALS} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
