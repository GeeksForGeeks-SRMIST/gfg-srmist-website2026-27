import { useRef } from 'react';
import { cn } from '../../lib/utils';

export default function Tabs({ items, value, onChange, label, idPrefix = 'tabs', className }) {
  const refs = useRef({});
  const onKey = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = items[(i + 1) % items.length];
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = items[(i - 1 + items.length) % items.length];
    if (e.key === 'Home') next = items[0];
    if (e.key === 'End') next = items[items.length - 1];
    if (next) { e.preventDefault(); onChange(next.id); refs.current[next.id]?.focus(); }
  };

  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex flex-wrap gap-1 rounded-full p-1 glass', className)}>
      {items.map((t, i) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full px-[22px]',
              'font-ui text-[13px] font-bold leading-none tracking-[.12em] uppercase transition-[color,background-color,box-shadow] duration-250',
              on
                ? 'bg-green/22 text-white shadow-[inset_0_0_0_1px_rgba(70,196,107,.5),0_0_22px_-6px_rgba(70,196,107,.45)]'
                : 'text-muted hover:text-text',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="font-mono text-[11px] font-medium text-green-bright">{String(t.count).padStart(2, '0')}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
