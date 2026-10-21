import { ArrowUpRight, Code2, Users, Lightbulb } from 'lucide-react';
import {
  GlassCard,
  SectionLabel,
  SectionTitle,
} from '../../../components/ui/primitives';

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: 'Build',
    description:
      'Turn ideas into practical projects, experiment with technology, and strengthen your problem-solving skills.',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description:
      'Learn alongside a community of curious developers, exchange ideas, and create things together.',
  },
  {
    icon: Lightbulb,
    title: 'Grow',
    description:
      'Explore new concepts, take on challenges, and develop skills that extend beyond the classroom.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-b border-line py-20 md:py-30"
    >
      <div className="container-site">
        <SectionLabel>// 01 — About</SectionLabel>

        <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div>
            <SectionTitle
              id="about-title"
              className="max-w-3xl normal-case"
            >
              More Than
              <br />
              Just Code.
            </SectionTitle>

            <p className="mt-7 max-w-xl text-base leading-8 text-muted md:text-lg">
              GeeksforGeeks SRMIST is a student community built around
              technology, creativity, and collaboration. We bring students
              together to explore ideas, learn by doing, and turn curiosity
              into meaningful work.
            </p>

            <a
              href="/team"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-green-bright transition-colors hover:text-white"
            >
              Meet the community
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }, index) => (
              <GlassCard
                key={title}
                className="flex gap-4 p-5 md:p-6"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-green-bright/20 bg-green/10 text-green-bright">
                  <Icon size={21} aria-hidden="true" />
                </div>

                <div>
                  <p className="font-mono text-xs tracking-[0.12em] text-muted">
                    0{index + 1} / {title.toUpperCase()}
                  </p>
                  <h3 className="mt-2 font-display text-2xl lowercase text-display-light">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
