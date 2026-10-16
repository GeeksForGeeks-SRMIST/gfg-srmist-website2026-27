import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useFocusTrap from '../../hooks/useFocusTrap';
import useScrollLock from '../../hooks/useScrollLock';
import { cn } from '../../lib/utils';
import { IconButton } from './primitives';

export default function Modal({ open, onClose, labelledBy, label, initialFocus, width = 920, tint = 'rgba(14,18,16,.78)', className, children }) {
  const dialogRef = useRef(null);
  useScrollLock(open);
  useFocusTrap(dialogRef, open, { onEscape: onClose, initialFocus });

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-200 grid place-items-center p-3 md:p-6 duration-300 ease-smooth',
        // opening: visible instantly (so focus can move in); closing: fade, then hide
        open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]',
      )}
      inert={!open}
    >
      <div className="absolute inset-0 bg-[rgba(10,14,12,.72)] backdrop-blur-[8px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
        style={{ width: `min(100%, ${width}px)`, backgroundColor: tint }}
        className={cn(
          'relative max-h-[calc(100dvh-48px)] overflow-auto overscroll-contain rounded-[20px] border border-border',
          'backdrop-blur-[16px] backdrop-saturate-[1.4] outline-none',
          'shadow-[0_40px_120px_-20px_rgba(0,0,0,.95),inset_0_1px_0_rgba(255,255,255,.05)]',
          'transition-[translate,scale] duration-450 ease-out-expo motion-reduce:transition-none',
          open ? 'translate-y-0 scale-100' : 'translate-y-[18px] scale-[.98]',
          className,
        )}
      >
        <IconButton className="absolute right-3.5 top-3.5 z-[2] text-text" onClick={onClose} aria-label="Close dialog">
          <X aria-hidden="true" />
        </IconButton>
        {children}
      </div>
    </div>,
    document.body,
  );
}
