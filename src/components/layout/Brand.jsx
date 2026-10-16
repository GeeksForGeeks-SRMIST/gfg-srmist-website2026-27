import { Link } from 'react-router';
import { CONFIG } from '../../config';
import { asset, cn } from '../../lib/utils';

export default function Brand({ hideWordsBetween = false, className }) {
  const name = CONFIG.clubName;
  const i = name.indexOf(' ');
  const top = i > 0 ? name.slice(0, i) : name;
  const bottom = i > 0 ? name.slice(i + 1) : '';

  return (
    <Link to="/" aria-label={`${name} — Home`} className={cn('inline-flex min-h-11 items-center gap-3', className)}>
      <img src={asset(CONFIG.logoMark)} alt="" width="48" height="24" className="h-auto w-12 shrink-0" />
      <span
        aria-hidden="true"
        className={cn('grid leading-none max-[359px]:hidden', hideWordsBetween && 'nav:max-[1100px]:hidden')}
      >
        <span className="font-display text-[19px] font-semibold tracking-[-.015em] text-white">{top}</span>
        {bottom && (
          <span className="mt-[5px] font-mono text-[10px] font-medium tracking-[.22em] uppercase text-muted">{bottom}</span>
        )}
      </span>
    </Link>
  );
}
