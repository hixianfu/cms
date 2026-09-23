"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";

export type LightboxImage = { src: string; alt?: string };

export function ImageLightbox({ images, initialIndex = 0, className = "" }: { images: LightboxImage[]; initialIndex?: number; className?: string }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const active = images[activeIndex];

  const close = useCallback(() => { setOpen(false); setZoom(1); }, []);
  const previous = useCallback(() => { setActiveIndex((value) => (value - 1 + images.length) % images.length); setZoom(1); }, [images.length]);
  const next = useCallback(() => { setActiveIndex((value) => (value + 1) % images.length); setZoom(1); }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft" && images.length > 1) previous();
      if (event.key === "ArrowRight" && images.length > 1) next();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [close, images.length, next, open, previous]);

  if (!active) return null;
  return <>
    <button type="button" onClick={() => { setActiveIndex(initialIndex); setOpen(true); }} className={`group relative block w-full cursor-zoom-in text-left ${className}`} aria-label={active.alt ?? "Open image"}>
      <Image src={active.src} alt={active.alt ?? ""} fill sizes="100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"><ZoomIn size={16} aria-hidden="true" /></span>
    </button>
    {open && typeof document !== "undefined" ? createPortal(<div role="dialog" aria-modal="true" aria-label="Image preview" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={(event) => { if (event.target === event.currentTarget) close(); }} onWheel={(event) => { event.preventDefault(); setZoom((value) => Math.min(4, Math.max(1, value + (event.deltaY < 0 ? 0.2 : -0.2)))); }}>
      <button type="button" onClick={close} aria-label="Close image preview" className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X size={22} /></button>
      {images.length > 1 ? <><button type="button" onClick={previous} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"><ChevronLeft size={24} /></button><button type="button" onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"><ChevronRight size={24} /></button></> : null}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden"><Image src={active.src} alt={active.alt ?? ""} width={1800} height={1200} className="max-h-full max-w-full object-contain transition-transform duration-150" style={{ transform: `scale(${zoom})` }} priority /></div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-1 text-white"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} aria-label="Zoom out" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/20"><ZoomOut size={17} /></button><span className="min-w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(4, value + 0.25))} aria-label="Zoom in" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/20"><ZoomIn size={17} /></button></div>
    </div>, document.body) : null}
  </>;
}
