import { Braces, CalendarCheck, PenTool } from 'lucide-react';

export const DOMAINS = [
  { name: 'Technical', icon: Braces,
    description: 'Turn ideas into working projects. Code, solve problems, and build together.',
    points: [
      'Build and ship real projects, like this club website',
      'Learn new tools together in hands-on workshops',
      'Solve coding challenges and problems as a team',
      'Review each other\'s code and share what you learn',
    ],
    skills: ['Web development', 'Git & GitHub', 'Problem solving', 'Teamwork'],
  },
  { name: 'Events', icon: CalendarCheck,
    description: 'Bring the community together through hackathons, workshops, and experiences worth showing up for.',
    points: [
      'Plan and run hackathons, workshops and meetups',
      'Coordinate speakers, venues and schedules',
      'Manage registrations and on-the-day logistics',
      'Work with the other domains to deliver each event',
    ],
    skills: ['Event planning', 'Communication', 'Team management', 'Public speaking'],
  },
  { name: 'Creatives', icon: PenTool,
    description: 'Give the club its voice and visual identity through design, content, photography, and storytelling.',
    points: [
      'Design posters, banners and social media posts',
      'Shoot and edit photos and videos at events',
      'Write captions and stories for the club',
      'Keep the club\'s look and feel consistent',
    ],
    skills: ['Graphic design', 'Photography', 'Content writing', 'Video editing'],
  },
];
