import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Media from '../../components/ui/Media';
import Modal from '../../components/ui/Modal';
import { EmptyState, IconButton, Pill } from '../../components/ui/primitives';
import { FILTERS, GALLERY } from './gallery.data';

const label = (cat) => FILTERS.find((f) => f.id === cat)?.label || cat;

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);  

  const visible = useMemo(
    () => GALLERY.map((item, i) => ({ ...item, i })).filter((it) => filter === 'all' || it.category === filter),
    [filter],
  );
  const count = visible.length;

  const show = (pos) => setOpen(((pos % count) + count) % count);
  const current = open === null ? null : visible[open];

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(open - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(open + 1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, count]);

  return (
    <>
      <PageHeader label="// 06 — Gallery" title="gallery" subtitle="Late nights, demo days and everything in between — the chapter, in frames." />

      <section aria-label="Photo gallery" className="pb-30 pt-18">
        <div className="container-site">
          <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Pill as="button" type="button" key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className="min-h-11 px-5">
                {f.label}
              </Pill>
            ))}
          </div>
          <p aria-live="polite" className="mb-7 mt-4.5 min-h-5 font-mono text-xs leading-relaxed tracking-widest uppercase text-muted">
            {count} photo{count === 1 ? '' : 's'}{filter === 'all' ? '' : ` in ${label(filter)}`}
          </p>

          {!GALLERY.length || !count ? (
            <EmptyState
              icon={ImageOff}
              title={GALLERY.length ? 'Nothing in this category yet' : 'No photos here yet'}
              hint={GALLERY.length ? '// try another filter' : '// add photos to GALLERY in gallery.data.js'}
            />
          ) : (
            <div className="gap-2.5 [columns:2_150px] md:gap-4 md:[columns:3_300px]">
              {visible.map((it, pos) => (
                <Reveal key={it.i} delay={(pos % 3) * 70} className="mb-2.5 break-inside-avoid md:mb-4">
                  <div className="group relative overflow-hidden rounded-card border border-border bg-bg-2">
                    <Media
                      src={it.src}
                      alt={it.caption}
                      label={it.caption}
                      ratio={it.ratio || '4/3'}
                      className="transition-transform duration-700 ease-smooth group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    />
                    <button
                      type="button"
                      aria-label={`Open photo: ${it.caption}`}
                      onClick={() => setOpen(pos)}
                      className="absolute inset-0 z-1 w-full cursor-pointer rounded-[inherit] focus-visible:outline-offset-[-3px]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/55 to-transparent to-45% p-3 opacity-0 transition-opacity duration-350 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        <span className="rounded-full border border-border bg-black/55 px-2.5 py-1.5 font-mono text-[10px] font-medium leading-none tracking-[.12em] uppercase text-green-bright">
                          {label(it.category)}
                        </span>
                        <span className="grid size-8 place-items-center rounded-full bg-black/55 text-text"><Maximize2 className="size-[15px]" /></span>
                      </span>
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={open !== null} onClose={() => setOpen(null)} label="Photo viewer" width={1100} tint="rgba(8,10,9,.85)" className="px-3 pb-4 pt-16 md:px-18 md:pb-6">
        {current && (
          <figure className="grid gap-4">
            <div className="grid place-items-center overflow-hidden rounded-card">
              {current.src ? (
                <Media src={current.src} alt={current.caption} eager className="mx-auto max-h-[calc(100dvh-220px)] w-auto max-w-full rounded-card object-contain" />
              ) : (
                <Media src="" alt={current.caption} label={current.caption} ratio={current.ratio || '4/3'} className="mx-auto max-h-[min(640px,calc(100dvh-220px))] rounded-card" />
              )}
            </div>
            <figcaption className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-13 text-[15px] md:px-0">
              <span className="font-mono text-xs font-medium tracking-[.12em] text-green-bright">
                {String(open + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <span>{current.caption}</span>
            </figcaption>
          </figure>
        )}
        <IconButton aria-label="Previous photo" onClick={() => show(open - 1)} className="absolute bottom-3 left-3.5 text-text md:bottom-auto md:top-1/2 md:-mt-[22px]">
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton aria-label="Next photo" onClick={() => show(open + 1)} className="absolute bottom-3 right-3.5 text-text md:bottom-auto md:top-1/2 md:-mt-[22px]">
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </Modal>
    </>
  );
}
