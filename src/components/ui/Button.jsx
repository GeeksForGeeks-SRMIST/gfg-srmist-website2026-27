import { Link } from 'react-router';
import { cn, isExternal } from '../../lib/utils';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2.5 min-h-11 px-[22px] border border-transparent ' +
  'font-ui text-[13px] font-bold leading-none tracking-[.12em] uppercase whitespace-nowrap ' +
  'transition-[translate,box-shadow,border-color,background-color,color] duration-250 ease-smooth [&_svg]:size-4';

const variants = {
  primary:
    'rounded-[2px] bg-green text-white shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover ' +
    'active:translate-x-px active:translate-y-px motion-reduce:hover:translate-none',
  ghost:
    'rounded glass text-text hover:border-green-bright/70 hover:text-white ' +
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
