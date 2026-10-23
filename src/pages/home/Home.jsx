import Hero from './Hero';
import Marquee from './Marquee';
import About from './sections/About';
import DomainsPreview from './sections/DomainsPreview';
import FlagshipEvents from './sections/FlagshipEvents';
import SponsorsStrip from './sections/SponsorsStrip';
import Community from './sections/Community';
import JoinCTA from './sections/JoinCTA';
import './home.css';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <DomainsPreview />
      <FlagshipEvents />
      <SponsorsStrip />
       <Community /> 
      <JoinCTA />
    </>
  );
}
