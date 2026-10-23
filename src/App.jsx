import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import Events from './pages/events/Events';
import Team from './pages/team/Team';
import Domains from './pages/domains/Domains';
import Sponsors from './pages/sponsors/Sponsors';
import Gallery from './pages/gallery/Gallery';
import NotFound from './pages/NotFound';
import SponsorsStrip from './pages/home/sections/SponsorsStrip';
import Community from './pages/home/sections/Community';
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="team" element={<Team />} />
        <Route path="domains" element={<Domains />} />
        <Route path="sponsors" element={<Sponsors />} />
         <Route path="sponsorsStrip" element={<SponsorsStrip />} />
        <Route path="community" element={<Community />} /> 
        <Route path="gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
