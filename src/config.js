export const CONFIG = {
  clubName: 'GeeksforGeeks Student Chapter',
  college: 'SRMIST',

  description: 'A student-run community for coders who learn, build and grow together.',

  aboutLead: 'We turn “What if?” into “Why not?”',
  about:
    "From hackathon madness to workshop chaos, we build cool stuff, make questionable decisions, and make memories with a crew that feels like family!",

  logoMark: 'assets/logo/gfg-mark.svg',

  contactFormEmbedUrl: '',
  // Google Apps Script web-app URL that saves contact messages to a Google Sheet
  // (setup steps in apps-script/contact-form.gs). Leave empty and the form only shows a thank-you.
  contactSheetUrl: 'https://script.google.com/macros/s/AKfycby2d_1EEvfGo0FhTODbRcDpvpjq3sUj2HJpmfpzA8TVxbcIuqg5xxeBIMQDruDaa9fw/exec',
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
    venue: 'SRM KTR Campus',
    blurb: '24-hour overnight hackathon for business & startup ideas, with Corporate Gurukul.',
    image: 'assets/events/idea-quest.webp',
    link: '/events#idea-quest',
    registerUrl: '',
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
