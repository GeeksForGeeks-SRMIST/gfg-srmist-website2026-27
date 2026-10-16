export const CONFIG = {
  clubName: 'GeeksforGeeks Student Chapter',
  college: 'SRMIST',

  description: 'A student-run community for coders who learn, build and grow together.',

  aboutLead: 'We turn “What if?” into “Why not?”',
  about:
    "From hackathon madness to workshop chaos, we build cool stuff, make questionable decisions, and make memories with a crew that feels like family!",

  logoMark: 'assets/logo/gfg-mark.svg',

  contactFormEmbedUrl: '',  
  heroImage: 'assets/hero/hero-robot.webp',

  email: 'gfg.srmist@gmail.com',
  phone: '8434561527',
  socials: { instagram: '#', linkedin: '#', github: '#' },

  stats: [
    { value: 50, suffix: '+', label: 'Active Members' },
    { value: 2, suffix: '+', label: 'Events per Year' },
  ],

  nextEvent: {
    title: 'Ideathon',
    date: 'Nov 2026',
    venue: 'Main Auditorium',
    blurb: '24-hour hackathon. Registrations are open — grab your spot.',
    image: 'assets/events/next.jpg',
    link: '/events',
    registerUrl: '#',
  },

  upcomingTicker: ['Java verse', 'Ideathon', 'Ignisia'],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Team', to: '/team' },
  { label: 'Domains', to: '/domains' },
  { label: 'Sponsors', to: '/sponsors' },
  { label: 'Gallery', to: '/gallery' },
];
