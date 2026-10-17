# GFG SRMIST Website 2026-27

Website for the GeeksforGeeks Student Chapter at SRMIST. Built with React, Vite and Tailwind CSS.

## Running it locally

You need Node.js 20.19 or newer.

```bash
git clone https://github.com/GeeksForGeeks-SRMIST/gfg-srmist-website2026-27.git
cd gfg-srmist-website2026-27
npm install
npm run dev
```

Open http://localhost:5173. The page reloads on its own when you save a file.

`npm run build` creates the production build in `dist/`, and `npm run preview` lets you check that build locally.

## Where things are

```
src/
  config.js          club name, email, phone, social links, next event
  pages/
    home/            home page
      sections/      one file per section below the hero
    events/          events page + events.data.js
    team/            team page + team.data.js
    domains/         domains page + domains.data.js
    sponsors/        sponsors page + sponsors.data.js
    gallery/         gallery page + gallery.data.js
  components/        navbar, footer, buttons and other shared pieces
public/assets/       images (team photos, posters, logos, gallery)
```

For most content changes you only need the `.data.js` file of that page. Adding a person, an event or a photo shouldn't need any changes to the page component itself.

## Images

- Put them in the right folder inside `public/assets/` and leave out `public/` when you use them, e.g. `assets/team/akshara-kumari.webp`.
- Use `.webp` and keep them small: around 150 KB for team photos, 300 KB for posters and gallery photos. [squoosh.app](https://squoosh.app) is good for converting and compressing.
- Team photos should be square with a plain background.

## Adding someone to the team page

Open `src/pages/team/team.data.js` and add an entry to the right list:

```js
{ name: 'Your Name', role: 'Web Development', domain: 'technical', photo: 'assets/team/your-name.webp', quote: 'Something short.' },
```

`domain` can be `technical`, `creatives` or `events`, and it decides which tab the person shows up under. The quote shows on the back of the card when you hover over it. If there's no quote, the card says it's coming soon.

## How we work

1. Find your issue in the Issues tab. Everything for the first release is under the **Launch v1** milestone.
2. Create a branch from your issue (right sidebar, Development → Create a branch) and work only on that branch. `main` is protected, so direct pushes won't go through.
3. Stick to the files mentioned in your issue so we don't overwrite each other's work. If you need to change something outside that, mention it in the group first.
4. Check your changes on a phone-sized screen too, not just on your laptop.
5. Open a pull request into `main` and write `Closes #<your issue number>` in the description. Akshara reviews and merges.

Stuck on something? Ask in the group or leave a comment on your issue.

## Before launch

- [ ] Contact form connected (`contactFormEmbedUrl` in `src/config.js`)
- [ ] Site deployed on Netlify (build command `npm run build`, publish directory `dist`)
- [ ] `og:image` in `index.html` changed to the full site link once we have the final address
- [ ] No "coming soon" sections or placeholder names left anywhere
