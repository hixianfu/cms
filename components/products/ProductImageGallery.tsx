"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Media } from "@/types/content";

type GalleryItem = { media: Media; url: string };

export function ProductImageGallery({ cover, gallery, locale, productName }: { cover?: Media | null; gallery?: Media[] | null; locale: string; productName: string }) {
  const items = useMemo(() => {
    const seen = new Set<string>();
    return [cover, ...(gallery ?? [])].flatMap((media): GalleryItem[] => {
      const url = resolveMediaUrl(media);
      if (!media || !url || seen.has(url)) return [];
      seen.add(url);
      return [{ media, url }];
    });
  }, [cover, gallery]);
  const [active, setActive] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const zh = locale === "zh";
  const current = items[active] ?? items[0];
  const showPrevious = () => setActive((value) => (value - 1 + items.length) % items.length);
  const showNext = () => setActive((value) => (value + 1) % items.length);

  useEffect(() => {
    if (!previewOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
      if (event.key === "ArrowLeft") setActive((value) => (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % items.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [previewOpen, items.length]);

  if (!current) return <div className="aspect-[4/3] rounded-2xl bg-slate-100" />;
  const updateZoomOrigin = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return <section aria-label={zh ? "产品图片" : "Product images"}>
    <button type="button" onClick={() => setPreviewOpen(true)} onMouseMove={updateZoomOrigin} onMouseLeave={() => setZoomOrigin("50% 50%")} className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-brand-border bg-slate-100 shadow-sm" aria-label={zh ? "查看大图" : "View larger image"}>
      <span className="relative block aspect-[4/3] overflow-hidden"><Image src={current.url} alt={current.media.alternativeText ?? productName} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain transition-transform duration-200 ease-out lg:group-hover:scale-[1.8]" style={{ transformOrigin: zoomOrigin }} /></span>
      <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-brand-ink/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur sm:opacity-0 sm:transition sm:group-hover:opacity-100"><Expand size={15} />{zh ? "查看大图" : "View larger"}</span>
    </button>
    {items.length > 1 ? <div className="mt-4 flex gap-3 overflow-x-auto pb-2">{items.map(({ media, url }, index) => <button type="button" key={url} onClick={() => setActive(index)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition ${index === active ? "border-brand-teal ring-2 ring-brand-teal/20" : "border-transparent hover:border-brand-border"}`} aria-label={`${zh ? "图片" : "Image"} ${index + 1}`} aria-current={index === active ? "true" : undefined}><Image src={url} alt={media.alternativeText ?? ""} fill sizes="80px" className="object-cover" /></button>)}</div> : null}
    {previewOpen ? <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={zh ? "产品图片预览" : "Product image preview"} onClick={() => setPreviewOpen(false)}><div className="relative h-[90vh] w-full max-w-7xl" onClick={(event) => event.stopPropagation()}><Image src={current.url} alt={current.media.alternativeText ?? productName} fill sizes="100vw" className="object-contain" /><button type="button" onClick={() => setPreviewOpen(false)} className="absolute right-2 top-2 rounded-full bg-white/90 p-3 text-brand-ink shadow-lg hover:bg-white" aria-label={zh ? "关闭预览" : "Close preview"}><X size={22} /></button>{items.length > 1 ? <><button type="button" onClick={showPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-brand-ink shadow-lg hover:bg-white" aria-label={zh ? "上一张" : "Previous image"}><ChevronLeft size={26} /></button><button type="button" onClick={showNext} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-brand-ink shadow-lg hover:bg-white" aria-label={zh ? "下一张" : "Next image"}><ChevronRight size={26} /></button></> : null}<p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">{active + 1} / {items.length}</p></div></div> : null}
  </section>;
}
