import { Link } from 'react-router';
import { cn, isExternal } from '../../lib/utils';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2.5 min-h-11 px-[22px] border border-transparent ' +
  'font-ui text-[13px] font-bold leading-none tracking-[.12em] uppercase whitespace-nowrap ' +
  'transition-[translate,box-shadow,border-color,background-color,color] duration-250 ease-smooth [&_svg]:size-4';

const variants = {
  // Rounded green pill-card with a soft glow, the same shape language as the cards and chat
  primary:
    'rounded-xl border-green-bright/40 bg-green text-white shadow-[0_10px_28px_-14px_rgba(70,196,107,.9)] ' +
    'hover:-translate-y-0.5 hover:border-green-bright hover:bg-[#35a052] hover:shadow-[0_0_0_3px_rgba(70,196,107,.18),0_12px_30px_-10px_rgba(70,196,107,.85)] ' +
    'active:translate-y-0 motion-reduce:hover:translate-none',
  ghost:
    'rounded-xl glass text-text hover:border-green-bright/70 hover:text-white ' +
    'hover:shadow-[0_0_0_1px_rgba(70,196,107,.25),0_0_24px_-4px_rgba(70,196,107,.45)]',
  text: 'px-1 text-text hover:text-green-bright',
};

export default function Button({ variant = 'primary', to, href, className, children, ...rest }) {
  const cls = cn(base, variants[variant], className);
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) {
    const ext = isExternal(href);
    return (
      <a href={href} className={cls} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
