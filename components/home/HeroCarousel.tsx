"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

const AUTOPLAY_DELAY = 6000;

export function HeroCarousel({ slides, locale }: { slides: HeroSlide[]; locale: Locale }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [failedVideos, setFailedVideos] = useState<Set<number>>(() => new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const count = slides.length;
  const zh = locale === "zh";

  const updateSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  useEffect(() => {
    if (!emblaApi || !isPlaying || isHovered || count < 2) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [count, emblaApi, isHovered, isPlaying]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === selectedIndex && isPlaying && !prefersReducedMotion) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [failedVideos, isPlaying, prefersReducedMotion, selectedIndex]);

  if (!count) return null;

  return (
    <section
      className="relative min-h-svh overflow-hidden bg-brand-ink text-white"
      aria-roledescription="carousel"
      aria-label={zh ? "首页轮播图" : "Homepage carousel"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") emblaApi?.scrollNext();
        if (event.key === "ArrowLeft") emblaApi?.scrollPrev();
      }}
    >
      <div ref={emblaRef} className="min-h-svh cursor-grab overflow-hidden active:cursor-grabbing">
        <div className="flex min-h-svh touch-pan-y">
          {slides.map((slide, index) => {
            const imageUrl = resolveMediaUrl(slide.image);
            const videoUrl = resolveMediaUrl(slide.video);
            const showVideo = Boolean(videoUrl && !failedVideos.has(index));
            const href = slide.linkUrl ?? slide.href;
            const ctaLabel = slide.linkLabel ?? slide.ctaLabel;

            return (
              <div
                key={`${slide.title}-${index}`}
                className="relative flex min-h-svh min-w-0 flex-[0_0_100%] items-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${count}`}
                aria-hidden={selectedIndex !== index}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={slide.imageAlt ?? slide.image?.alternativeText ?? ""}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : null}
                {showVideo ? (
                  <video
                    ref={(element) => { videoRefs.current[index] = element; }}
                    data-testid={`hero-video-${index}`}
                    src={videoUrl ?? undefined}
                    poster={imageUrl ?? undefined}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "auto" : "metadata"}
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setFailedVideos((current) => new Set(current).add(index))}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,30,45,0.9)_0%,rgba(8,30,45,0.72)_45%,rgba(8,30,45,0.2)_78%,rgba(8,30,45,0.08)_100%)]" />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-28 sm:px-8 lg:px-12 lg:pt-32">
                  <div className="max-w-3xl">
                    {slide.eyebrow ? <p className="mb-5 text-sm font-bold uppercase text-brand-lime">{slide.eyebrow}</p> : null}
                    <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-7xl">{slide.title}</h1>
                    {slide.description ? <p className="mt-6 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">{slide.description}</p> : null}
                    {href && ctaLabel ? (
                      <Link href={href.startsWith("http") ? href : localizedHref(locale, href)} tabIndex={selectedIndex === index ? undefined : -1} className="brand-button-accent mt-8 gap-2">
                        {ctaLabel}<ArrowRight size={17} />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 pb-7 sm:px-8 lg:px-12 lg:pb-10">
            <div className="flex items-center gap-2" aria-label={zh ? "选择轮播图" : "Choose slide"}>
              {slides.map((slide, index) => (
                <button
                  key={`${slide.title}-dot-${index}`}
                  type="button"
                  aria-label={zh ? `显示第 ${index + 1} 张` : `Show slide ${index + 1}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all ${selectedIndex === index ? "w-9 bg-brand-lime" : "w-5 bg-white/45 hover:bg-white/75"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="mr-2 min-w-12 text-center text-sm text-white/80" aria-live="polite">{selectedIndex + 1} / {count}</span>
              <button type="button" aria-label={zh ? "上一张" : "Previous slide"} onClick={() => emblaApi?.scrollPrev()} className="rounded-full border border-white/50 bg-brand-ink/25 p-2.5 backdrop-blur transition hover:bg-white/15">
                <ChevronLeft size={19} />
              </button>
              <button type="button" aria-label={zh ? "下一张" : "Next slide"} onClick={() => emblaApi?.scrollNext()} className="rounded-full border border-white/50 bg-brand-ink/25 p-2.5 backdrop-blur transition hover:bg-white/15">
                <ChevronRight size={19} />
              </button>
              <button type="button" aria-label={zh ? (isPlaying ? "暂停轮播图" : "播放轮播图") : (isPlaying ? "Pause carousel" : "Play carousel")} onClick={() => setIsPlaying((value) => !value)} className="rounded-full border border-white/50 bg-brand-ink/25 p-2.5 backdrop-blur transition hover:bg-white/15">
                {isPlaying ? <Pause size={17} /> : <Play size={17} />}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
