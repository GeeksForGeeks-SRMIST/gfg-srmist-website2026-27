import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ['card'],
      shadow: ['glow', 'brutal', 'brutal-hover'],
      font: ['display', 'ui', 'mono'],
      ease: ['smooth', 'out-expo'],
      animate: ['led', 'marquee', 'holo-in'],
    },
  },
});

export const cn = (...classes) => twMerge(...classes);

// is deployed in a sub-folder (vite.config.js → base).
export const asset = (path) => {
  if (!path || /^(https?:|data:|blob:|\/)/.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, '');
};

export const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href || '');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!m || !MONTHS[+m[2] - 1]) return String(value || '');
  return `${m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`;
};

export const telHref = (phone) => 'tel:' + String(phone || '').replace(/[^\d+]/g, '');
