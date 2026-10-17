export const FACULTY = [
  {
    name: 'Dr. Faculty Name',
    role: 'Faculty Coordinator',
    department: 'Department of Computer Science & Engineering',
    quote: 'Build in public, help each other and never stop being curious.',
    photo: '',
  },
];

export const CORE_TEAM = [
  { name: 'Mrinal Paul', role: 'President', photo: 'assets/team/mrinal-paul.webp', quote: 'Dream big, ship fast, and never debug alone.' },
  { name: 'Member Name', role: 'Secretary', photo: '' },
  { name: 'Member Name', role: 'Joint Secretary', photo: '' },
];

export const TEAM_DOMAINS = [
  { id: 'technical', label: 'Technical' },
  { id: 'creatives', label: 'Creatives' },
  { id: 'events', label: 'Events' },
];

// domain: 'technical' | 'creatives' | 'events' — decides which tab the person shows under
// quote (optional, any section) — shown on the back of the card when it flips on hover
export const DOMAIN_LEADS = [
  { name: 'Akshara Kumari', role: 'Technical Director', domain: 'technical', photo: 'assets/team/akshara-kumari.webp', quote: 'I don’t know what’s happening, but I’m in charge of it.' },
  { name: 'MD Nayaj Mondal', role: 'Technical Director', domain: 'technical', photo: '' },
  { name: 'Lead Name', role: 'Creatives Lead', domain: 'creatives', photo: '' },
  { name: 'Lead Name', role: 'Events Lead', domain: 'events', photo: '' },
];

export const ASSOCIATE_LEADS = [
  { name: 'Associate Name', role: 'Associate Technical Lead', domain: 'technical', photo: '' },
  { name: 'Associate Name', role: 'Associate Creatives Lead', domain: 'creatives', photo: '' },
  { name: 'Associate Name', role: 'Associate Events Lead', domain: 'events', photo: '' },
];

export const MEMBERS = [
  { name: 'Member Name', role: 'Web Development', domain: 'technical', photo: '' },
  { name: 'Member Name', role: 'DSA & CP', domain: 'technical', photo: '' },
  { name: 'Member Name', role: 'Design', domain: 'creatives', photo: '' },
  { name: 'Member Name', role: 'Content', domain: 'creatives', photo: '' },
  { name: 'Member Name', role: 'Logistics', domain: 'events', photo: '' },
];
