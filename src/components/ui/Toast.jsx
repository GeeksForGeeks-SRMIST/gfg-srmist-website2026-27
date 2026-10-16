import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef(0);

  const show = useCallback((text) => {
    setMsg(text);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 3800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'fixed bottom-6 left-1/2 z-[300] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 rounded-full',
          'border border-green-bright/40 bg-[rgba(10,14,12,.85)] px-5 py-3.5 text-sm backdrop-blur-[16px]',
          'shadow-[0_20px_60px_-20px_rgba(0,0,0,.9),0_0_30px_-10px_rgba(70,196,107,.45)] pointer-events-none',
          'transition-[opacity,translate] duration-350 ease-smooth',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          !msg && 'hidden',
        )}
      >
        <span className="size-2 shrink-0 rounded-full bg-neon shadow-[0_0_10px_var(--neon)]" aria-hidden="true" />
        <span>{msg}</span>
      </div>
    </ToastContext.Provider>
  );
}
