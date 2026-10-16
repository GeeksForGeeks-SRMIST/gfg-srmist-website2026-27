import { cn } from '../../lib/utils';

export function Pill({ as: Tag = 'span', className, children, ...rest }) {
  const interactive = Tag !== 'span';
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-2 min-h-9 px-4 rounded-full glass whitespace-nowrap pointer-coarse:min-h-11',
        'font-mono text-xs font-medium leading-none tracking-[.08em] uppercase text-text',
        'transition-[color,border-color,background-color] duration-250',
        interactive && 'cursor-pointer hover:border-green-bright/70 hover:text-green-bright',
        'aria-pressed:border-green-bright/70 aria-pressed:bg-green/20 aria-pressed:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function IconButton({ className, children, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-[10px] glass text-green-bright [&_svg]:size-[18px]',
        'transition-[border-color,background-color,box-shadow] duration-250',
        'hover:border-green-bright/70 hover:bg-green/12 hover:shadow-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function GlassCard({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        'relative rounded-card glass transition-[translate,border-color,background-color] duration-400 ease-smooth',
        'hover:-translate-y-1 hover:border-green-bright/45 hover:bg-surface-hover motion-reduce:hover:translate-none',
        'after:pointer-events-none after:absolute after:-inset-px after:rounded-[inherit] after:opacity-0',
        'after:shadow-[0_0_0_1px_rgba(70,196,107,.35),0_18px_50px_-18px_rgba(70,196,107,.45)]',
        'after:transition-opacity after:duration-400 hover:after:opacity-100',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Badge({ variant = 'past', className, children }) {
  const upcoming = variant === 'upcoming';
  return (
    <span
      className={cn(
        'inline-flex h-[26px] items-center gap-2 px-[11px] rounded-full border bg-black/60 backdrop-blur-[16px] whitespace-nowrap',
        'font-mono text-[11px] font-medium leading-none tracking-[.12em] uppercase',
        upcoming ? 'border-green-bright/40 text-green-bright' : 'border-border text-muted',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          upcoming ? 'bg-neon shadow-[0_0_8px_var(--neon)] animate-led motion-reduce:animate-none' : 'bg-muted',
        )}
      />
      {children}
    </span>
  );
}

export function SectionLabel({ as: Tag = 'p', className, children }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-2.5 font-mono text-xs font-medium leading-tight tracking-[.14em] uppercase text-muted',
        'before:size-1.5 before:shrink-0 before:rounded-full before:bg-neon before:shadow-[0_0_8px_var(--neon)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionTitle({ as: Tag = 'h2', className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        'mt-[18px] font-display text-[clamp(40px,6vw,88px)] font-light leading-[.95] tracking-[-.045em] lowercase text-display-light',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function EmptyState({ icon: Icon, title, hint, className }) {
  return (
    <div
      className={cn(
        'col-span-full grid justify-items-center gap-2.5 rounded-card border border-dashed border-border bg-surface px-6 py-14 text-center text-muted',
        className,
      )}
    >
      {Icon && <Icon className="size-7 text-green-bright" aria-hidden="true" />}
      <p className="font-ui text-sm font-bold tracking-[.12em] uppercase text-text">{title}</p>
      {hint && <p className="font-mono text-xs">{hint}</p>}
    </div>
  );
}
