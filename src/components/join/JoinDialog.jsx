import { Users } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function JoinDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="join-title" width={520} tint="rgba(10,18,13,.96)">
      <div className="bg-[radial-gradient(ellipse_at_top,rgba(70,196,107,.15),transparent_65%)] px-6 py-10 text-center sm:p-12">
        <div aria-hidden="true" className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl border border-green-bright/30 bg-green/10 text-green-bright">
          <Users className="size-8" />
        </div>
        <p className="mb-4 font-mono text-[10px] tracking-[.18em] uppercase text-green-bright">Recruitment / Closed</p>
        <h2 id="join-title" className="font-display text-6xl font-semibold leading-none tracking-[-.05em] text-text sm:text-7xl">OOPS!</h2>
        <p className="mt-4 font-display text-2xl font-medium tracking-[-.02em] text-text">The crew is complete.</p>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          This year’s spots are all filled. Missed the invite? Your next chapter starts next year—come back for the next recruitment round.
        </p>
        <p className="mt-5 text-sm font-medium text-green-bright">Until then, stay curious. Keep building.</p>
        <Button onClick={onClose} className="mt-8 min-h-12">See you next year!</Button>
      </div>
    </Modal>
  );
}
