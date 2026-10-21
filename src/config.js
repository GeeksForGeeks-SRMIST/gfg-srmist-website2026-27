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
  socials: {
    instagram: 'https://www.instagram.com/gfgsrmist/',
    linkedin: 'https://www.linkedin.com/company/gfgsrmist/',
    github: 'https://github.com/GeeksForGeeks-SRMIST',
  },

  stats: [
    { value: 50, suffix: '+', label: 'Active Members' },
    { value: 2, suffix: '+', label: 'Events per Year' },
  ],

  nextEvent: {
    title: 'Idea Quest',
    date: 'Nov 2026',
    venue: '',
    blurb: 'Our Flagship Ideathon. Coming Soon',
    image: '/assets/events/idea-quest.webp',
    link: '/events',
    registerUrl: 'https://www.instagram.com/gfgsrmist/',
  },

  upcomingTicker: ['Idea Quest'],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Team', to: '/team' },
  { label: 'Domains', to: '/domains' },
  { label: 'Sponsors', to: '/sponsors' },
  { label: 'Gallery', to: '/gallery' },
];
