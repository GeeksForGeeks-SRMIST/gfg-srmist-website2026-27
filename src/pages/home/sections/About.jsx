import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { SectionLabel, SectionTitle } from '../../../components/ui/primitives';
import PolaroidStack from './PolaroidStack';

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-b border-line py-16 md:py-20"
    >
      <div className="container-site">
        <SectionLabel>// 01 — About</SectionLabel>

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16">
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

            <Link
              to="/team"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-green-bright transition-colors hover:text-white"
            >
              Meet the community
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <PolaroidStack />
        </div>
      </div>
    </section>
  );
}
