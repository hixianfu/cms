"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

export function HeroCarousel({ slides, locale }: { slides: HeroSlide[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count, paused]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % count);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + count) % count);
    };
    if (count > 1) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count]);
  if (!count) return null;
  const slide = slides[index];
  const imageUrl = resolveMediaUrl(slide.image);
  const href = slide.linkUrl ?? slide.href;
  return <section className="relative overflow-hidden bg-slate-950 text-white" aria-roledescription="carousel" aria-label={locale === "zh" ? "首页轮播图" : "Homepage carousel"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="mx-auto grid min-h-[32rem] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="relative z-10 max-w-xl">
        {slide.eyebrow ? <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">{slide.eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{slide.title}</h1>
        {slide.description ? <p className="mt-6 text-lg leading-8 text-slate-300">{slide.description}</p> : null}
        {href && (slide.linkLabel ?? slide.ctaLabel) ? <Link href={href.startsWith("http") ? href : localizedHref(locale, href)} className="mt-8 inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-300">{slide.linkLabel ?? slide.ctaLabel}</Link> : null}
      </div>
      {imageUrl ? <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-800"><Image src={imageUrl} alt={slide.imageAlt ?? slide.image?.alternativeText ?? ""} fill priority={index === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div> : null}
    </div>
    {count > 1 ? <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3"><button type="button" aria-label={locale === "zh" ? "上一张" : "Previous slide"} onClick={() => setIndex((current) => (current - 1 + count) % count)} className="rounded-full border border-white/50 px-3 py-1 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-300">←</button><span className="text-sm text-slate-300" aria-live="polite">{index + 1} / {count}</span><button type="button" aria-label={locale === "zh" ? "下一张" : "Next slide"} onClick={() => setIndex((current) => (current + 1) % count)} className="rounded-full border border-white/50 px-3 py-1 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-300">→</button></div> : null}
  </section>;
}
