// Gee's brain. Every answer is built from the site's own data files, so when the team, events, sponsors
// or contact details change on the website, Gee's answers change with them. No external service involved.
import { CONFIG, NAV_LINKS } from '../../config';
import { DOMAINS } from '../../pages/domains/domains.data';
import { PAST_EVENTS, UPCOMING_EVENTS } from '../../pages/events/events.data';
import { SPONSORS } from '../../pages/sponsors/sponsors.data';
import { ASSOCIATE_LEADS, CORE_TEAM, DOMAIN_LEADS, FACULTY, MEMBERS } from '../../pages/team/team.data';
import { GALLERY, FILTERS } from '../../pages/gallery/gallery.data';
import { formatDate, telHref } from '../../lib/utils';

export const GREETING =
  "Hi, I'm Mr. Gee! Ask me anything about GfG SRMIST, or pick a topic below.";

export const DEFAULT_CHIPS = ['What do you do?', 'Who is the president?', 'Technical domain', 'Upcoming event', 'Contact us', 'Social media'];

// ---------- small helpers ----------
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const has = (q, ...words) => words.some((w) => new RegExp(`\\b${w}`).test(q));
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const andList = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}` : xs[0] || '');
const a = (role) => (/^[aeiou]/i.test(role) ? 'an' : 'a');
const eventId = (title) => String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const reply = (text, links = [], chips) => ({ text, links, chips });
const page = (label, to) => ({ label, to });
const ext = (label, href) => ({ label, href });
const act = (label, action) => ({ label, action });
const social = (k) => ({ label: SOCIAL_LABELS[k] || cap(k), href: CONFIG.socials[k], brand: k });

const ALL_PEOPLE = [...FACULTY, ...CORE_TEAM, ...DOMAIN_LEADS, ...ASSOCIATE_LEADS, ...MEMBERS];
const SOCIAL_LABELS = { instagram: 'Instagram', linkedin: 'LinkedIn', github: 'GitHub' };

// ---------- people ----------
const describe = (p) => {
  if (p.designation) return `${p.name} is our ${p.role} (${p.designation}, ${p.department}).`;
  const dom = p.domain && !norm(p.role).includes(p.domain) ? ` in the ${cap(p.domain)} domain` : '';
  const ours = !/^(member|associate lead)$/i.test(p.role);   // president, directors etc. are "our ..."
  return `${p.name} is ${ours ? 'our' : a(p.role)} ${p.role}${dom}.`;
};

function findPeople(q) {
  const tokens = new Set(q.split(' '));
  let best = 0;
  const scored = [];
  for (const p of ALL_PEOPLE) {
    const parts = norm(p.name).split(' ').filter((w) => w.length >= 3);
    const matched = parts.filter((w) => tokens.has(w));
    if (!matched.some((w) => w.length >= 4)) continue;
    best = Math.max(best, matched.length);
    scored.push({ p, n: matched.length });
  }
  return scored.filter((s) => s.n === best).map((s) => s.p);
}

function peopleAnswer(list) {
  const shown = list.slice(0, 4);
  const lines = shown.map(describe);
  if (list.length > shown.length) lines.push(`…and ${list.length - shown.length} more on the Team page.`);
  return reply(lines.join('\n'), [page('Meet the team', '/team')]);
}

const listPeople = (title, people) => `${title}\n${people.map((p) => `• ${p.name}${p.domain ? ` (${cap(p.domain)})` : ''}`).join('\n')}`;

// ---------- domains ----------
const domainOf = (q, loose = false) => {
  if (has(q, 'tech')) return 'technical';
  if (has(q, 'creativ', 'design', 'photograph', 'content')) return 'creatives';
  if (has(q, 'events? (domain|team|wing|department|director|lead)', 'domains? events?', 'event management')) return 'events';
  if (loose && has(q, 'events?')) return 'events';
  return null;
};

function domainAnswer(id) {
  const d = DOMAINS.find((x) => x.name.toLowerCase() === id);
  if (!d) return null;
  const dirs = DOMAIN_LEADS.filter((p) => p.domain === id).map((p) => p.name);
  const lines = [`${d.name}: ${d.description}`];
  if (d.skills?.length) lines.push(`Skills: ${d.skills.slice(0, 4).join(', ')}.`);
  if (dirs.length) lines.push(`Led by ${dirs.join(' & ')}.`);
  return reply(lines.join('\n'), [page('See all domains', '/domains'), page('Meet the team', '/team')], DOMAINS.filter((x) => x.name.toLowerCase() !== id).map((x) => `${x.name} domain`));
}

const allDomains = () =>
  reply(
    `We work across ${DOMAINS.length} domains: ${andList(DOMAINS.map((d) => d.name))}. Tap one to know more.`,
    [page('Explore domains', '/domains')],
    DOMAINS.map((d) => `${d.name} domain`),
  );

// ---------- events ----------
function upcomingAnswer() {
  if (!UPCOMING_EVENTS.length) {
    return reply('Nothing announced yet. Follow us on Instagram to hear first.', [social('instagram'), page('Past events', '/events#past')]);
  }
  const lines = UPCOMING_EVENTS.map((ev) => {
    const when = ev.date ? formatDate(ev.date) + (ev.time ? ` at ${ev.time}` : '') : 'Dates to be announced';
    const where = ev.venue ? ` · ${ev.venue}` : '';
    return `${ev.title}\n${when}${where}\n${ev.registerUrl ? 'Registration is open!' : 'Registrations open soon.'}`;
  });
  const links = [page('See the event', `/events#${eventId(UPCOMING_EVENTS[0].title)}`)];
  if (UPCOMING_EVENTS[0].registerUrl) links.unshift(ext('Register', UPCOMING_EVENTS[0].registerUrl));
  return reply(lines.join('\n\n'), links, ['Past events', 'Who sponsors you?']);
}

function pastAnswer() {
  const lines = PAST_EVENTS.slice(0, 4).map((ev) => `• ${ev.title}`);
  if (PAST_EVENTS.length > 4) lines.push(`…and ${PAST_EVENTS.length - 4} more.`);
  return reply(`Recent events:\n${lines.join('\n')}`, [page('Browse past events', '/events#past')], ['Upcoming event']);
}

function eventByName(q) {
  const tokens = new Set(q.split(' '));
  const all = [...UPCOMING_EVENTS.map((e) => ({ ...e, upcoming: true })), ...PAST_EVENTS];
  for (const ev of all) {
    const words = norm(ev.title).split(' ').filter((w) => w.length >= 4);
    if (words.some((w) => tokens.has(w))) return ev;
  }
  return null;
}

function eventAnswer(ev) {
  if (ev.upcoming) return upcomingAnswer();
  const lines = [`${ev.title}${ev.date ? `, held on ${formatDate(ev.date)}` : ''}.`];
  const links = [page('See it on the Events page', `/events#${eventId(ev.title)}`)];
  if (ev.recapUrl && ev.recapUrl !== '#') links.push(ext('Watch the recap', ev.recapUrl));
  return reply(lines.join('\n'), links, ['Upcoming event', 'Past events']);
}

// ---------- the rules, checked in order ----------
export function getReply(input) {
  const q = norm(input);
  if (!q) return reply('Type a question and I will answer it.');
  const words = q.split(' ');

  // chit-chat
  const greet = words.some((w) => ['hi', 'hii', 'hiii', 'hello', 'hey', 'hola', 'yo', 'namaste'].includes(w)) || has(q, 'good morning', 'good evening', 'good afternoon');
  if (greet && words.length <= 3) return reply('Hello! What would you like to know about the club?');
  if (has(q, 'thank', 'thx')) return reply("You're welcome! Anything else?");
  if (has(q, 'bye\\b', 'goodbye', 'see you', 'cya\\b')) return reply('Bye! Come back any time.');
  if (has(q, 'who are you\\b', 'your name', 'what are you', 'are you a bot', 'are you human')) {
    return reply("I'm Mr. Gee, the GfG SRMIST website helper. Ask me about our domains, team, events or how to reach us.");
  }
  if (has(q, 'help', 'what can you', 'what can i ask', 'commands')) {
    return reply('I can help with:\n• domains and what we do\n• the team and faculty\n• events and joining\n• sponsors, contact and socials', [], DEFAULT_CHIPS);
  }

  // a person's name
  const people = findPeople(q);
  if (people.length) return peopleAnswer(people);

  // roles and team
  if (has(q, 'joint secretary', 'joint sec')) {
    const p = CORE_TEAM.find((x) => /joint/i.test(x.role));
    if (p) return peopleAnswer([p]);
  }
  if (has(q, 'secretary')) {
    const p = CORE_TEAM.find((x) => /^secretary$/i.test(x.role));
    if (p) return peopleAnswer([p]);
  }
  if (has(q, 'president', 'head of the club', 'club head')) {
    const p = CORE_TEAM.find((x) => /president/i.test(x.role));
    if (p) return peopleAnswer([p]);
  }
  if (has(q, 'core team', 'leadership', 'office bearer', 'who runs', 'who leads', 'leaders', 'management')) {
    return reply(`${listPeople('Our core team:', CORE_TEAM.map((p) => ({ ...p, name: `${p.name}, ${p.role}`, domain: '' })))}`, [page('Meet the team', '/team')], ['Who are the directors?', 'Faculty']);
  }
  if (has(q, 'director', 'domain lead') || (has(q, 'lead', 'head') && domainOf(q))) {
    const id = domainOf(q, true);
    const dirs = DOMAIN_LEADS.filter((p) => !id || p.domain === id);
    if (dirs.length) {
      const head = id ? `${cap(id)} directors:` : 'Our domain directors:';
      return reply(listPeople(head, dirs), [page('Meet the team', '/team')]);
    }
  }
  if (has(q, 'associate')) {
    const id = domainOf(q, true);
    const list = ASSOCIATE_LEADS.filter((p) => !id || p.domain === id);
    if (list.length) return reply(listPeople(id ? `${cap(id)} associate leads:` : 'Our associate leads:', list), [page('Meet the team', '/team')]);
  }
  if (has(q, 'hod', 'head of department', 'convenor', 'convener', 'co convenor')) {
    const re = has(q, 'hod', 'head of department') ? /head of department/i : has(q, 'co convenor', 'co convener') ? /co-convenor/i : /^faculty convenor$/i;
    const hit = FACULTY.filter((p) => re.test(p.role));
    if (hit.length) return peopleAnswer(hit);
  }
  if (has(q, 'faculty', 'hod', 'head of department', 'convenor', 'convener', 'professor', 'teacher', 'staff')) {
    const lines = FACULTY.map((p) => `• ${p.name}: ${p.role}, ${p.designation}`);
    return reply(`Our faculty:\n${lines.join('\n')}`, [page('Meet the team', '/team')]);
  }
  if (has(q, 'members?\\b', 'member count', 'strength', 'students', 'how many (people|of you)')) {
    const stat = CONFIG.stats.find((s) => /member/i.test(s.label));
    const per = DOMAINS.map((d) => `${d.name}: ${MEMBERS.filter((m) => m.domain === d.name.toLowerCase()).length}`).join(' · ');
    return reply(`${stat ? `We have ${stat.value}${stat.suffix} ${stat.label.toLowerCase()}. ` : ''}Members by domain: ${per}.`, [page('Meet the team', '/team')]);
  }
  if (has(q, 'team', 'people', 'crew') && !domainOf(q)) {
    return reply(`Led by our President ${CORE_TEAM[0]?.name}, with ${CORE_TEAM.length} core members, ${DOMAIN_LEADS.length} directors, ${ASSOCIATE_LEADS.length} associate leads, ${MEMBERS.length} members and ${FACULTY.length} faculty.`, [page('Meet the team', '/team')], ['Who is the president?', 'Who are the directors?', 'Faculty']);
  }

  // domains
  const dom = domainOf(q);
  if (dom && (has(q, 'domain', 'wing', 'do\\b', 'does\\b', 'about', 'skills', 'learn', 'what', 'tell') || words.length <= 3)) {
    const ans = domainAnswer(dom);
    if (ans) return ans;
  }
  if (has(q, 'domain', 'wing', 'departments', 'what do you do', 'what does the club do', 'what do we do', 'activities', 'offer')) {
    return allDomains();
  }

  // events
  if (has(q, 'register', 'registration', 'sign up', 'signup', 'ticket')) {
    const ev = UPCOMING_EVENTS[0];
    if (ev) {
      return reply(ev.registerUrl ? `Registration for ${ev.title} is open!` : `Registrations for ${ev.title} open soon. Stay tuned!`, [ev.registerUrl ? ext('Register', ev.registerUrl) : social('instagram'), page('See the event', `/events#${eventId(ev.title)}`)]);
    }
  }
  const byName = eventByName(q);
  if (byName) return eventAnswer(byName);
  if (has(q, 'past event', 'previous event', 'old event', 'history', 'earlier')) return pastAnswer();
  if (has(q, 'upcoming', 'next event', 'hackathon', 'ideathon', 'event', 'workshop', 'happening')) return upcomingAnswer();

  // joining
  if (has(q, 'join', 'recruit', 'become a member', 'membership', 'apply', 'enrol', 'admission')) {
    return reply("Recruitment is closed for this year as all spots are filled. The next round opens next year, so follow us to catch it!", [act('Recruitment status', 'join'), social('instagram')]);
  }

  // contact and socials
  if (has(q, 'contact', 'email', 'e mail', 'mail', 'phone', 'call', 'number', 'reach', 'whatsapp', 'message', 'form', 'talk to', 'get in touch')) {
    return reply(`Mail us at ${CONFIG.email}, call ${CONFIG.phone}, or drop a message through the form.`, [act('Open contact form', 'contact'), ext('Email us', `mailto:${CONFIG.email}`), ext('Call us', telHref(CONFIG.phone))]);
  }
  if (has(q, 'instagram', 'insta', 'linkedin', 'github', 'social', 'follow', 'link', 'handle', 'profile')) {
    const asked = Object.keys(CONFIG.socials).filter((k) => has(q, k === 'instagram' ? 'insta' : k));
    const keys = asked.length ? asked : Object.keys(CONFIG.socials);
    return reply('Follow us for updates, events and behind-the-scenes!', keys.map(social));
  }

  // other pages
  if (has(q, 'sponsor', 'partner', 'supporter')) {
    const names = SPONSORS.map((s) => s.name);
    const shown = names.slice(0, 4).join(', ');
    return reply(`Backed by ${names.length} partners, including ${shown}${names.length > 4 ? ' and more' : ''}.`, [page('See all sponsors', '/sponsors'), act('Become a sponsor', 'contact')]);
  }
  if (has(q, 'gallery', 'photo', 'picture', 'image')) {
    return reply(`${GALLERY.length} photos from our ${andList(FILTERS.filter((f) => f.id !== 'all').map((f) => f.label.toLowerCase()))}.`, [page('Open the gallery', '/gallery')]);
  }
  if (has(q, 'where', 'location', 'venue', 'campus', 'college', 'university', 'srm', 'address', 'place')) {
    const venue = UPCOMING_EVENTS[0]?.venue || CONFIG.nextEvent?.venue;
    return reply(`We are the ${CONFIG.clubName} at ${CONFIG.college}.${venue ? ` Our next event, ${UPCOMING_EVENTS[0]?.title || CONFIG.nextEvent.title}, is at ${venue}.` : ''}`, [act('Contact us', 'contact')]);
  }
  if (has(q, 'page', 'website', 'site', 'navigate', 'menu', 'where can i find', 'sections')) {
    return reply('Jump to any page:', NAV_LINKS.map((l) => page(l.label, l.to)));
  }
  if (has(q, 'about', 'club', 'chapter', 'gfg', 'geeksforgeeks', 'community', 'mission')) {
    const stats = CONFIG.stats.map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join(' · ');
    return reply(`${CONFIG.description}\n${stats}`, [page('Our domains', '/domains'), page('Meet the team', '/team')], ['Domains', 'Upcoming event']);
  }

  return reply("Hmm, I'm not sure about that. Try one of these:", [], DEFAULT_CHIPS);
}
