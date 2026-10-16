import useInView from '../../hooks/useInView';
import useReducedMotion from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView({ skip: reduced });
  return (
    <Tag
      ref={ref}
      className={cn(
        'transition-[opacity,translate] duration-800 ease-out-expo',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
