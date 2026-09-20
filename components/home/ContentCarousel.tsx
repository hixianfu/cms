"use client";

import { Children, useCallback, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type Columns = "features" | "products" | "articles" | "productCategories";

const slideWidths: Record<Columns, string> = {
  features: "md:flex-[0_0_50%] xl:flex-[0_0_25%]",
  products: "sm:flex-[0_0_50%] lg:flex-[0_0_25%]",
  articles: "md:flex-[0_0_33.333333%]",
  productCategories: "flex-[0_0_50%] sm:flex-[0_0_20%] lg:flex-[0_0_10%]",
};

export function ContentCarousel({ children, columns, locale, label }: { children: ReactNode; columns: Columns; locale: Locale; label: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const subscribe = useCallback((notify: () => void) => {
    if (!emblaApi) return () => undefined;
    emblaApi.on("select", notify);
    emblaApi.on("reInit", notify);
    return () => {
      emblaApi.off("select", notify);
      emblaApi.off("reInit", notify);
    };
  }, [emblaApi]);
  const getSnapshot = useCallback(() => (emblaApi?.canScrollPrev() ? 1 : 0) | (emblaApi?.canScrollNext() ? 2 : 0), [emblaApi]);
  const controls = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  const canScrollPrev = Boolean(controls & 1);
  const canScrollNext = Boolean(controls & 2);

  return <div aria-roledescription="carousel" aria-label={label} onKeyDown={(event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); emblaApi?.scrollPrev(); }
    if (event.key === "ArrowRight") { event.preventDefault(); emblaApi?.scrollNext(); }
  }}>
    <div ref={emblaRef} className="overflow-hidden touch-pan-y">
      <div className="-ml-6 flex">
        {Children.map(children, (child) => <div className={`min-w-0 flex-[0_0_100%] pl-6 ${slideWidths[columns]}`} role="group" aria-roledescription="slide">
          {child}
        </div>)}
      </div>
    </div>
    {canScrollPrev || canScrollNext ? <div className="mt-6 flex justify-end gap-2">
      <button type="button" aria-label={locale === "zh" ? "上一项" : "Previous item"} disabled={!canScrollPrev} onClick={() => emblaApi?.scrollPrev()} className="rounded-full border border-brand-border p-2.5 text-brand-ink transition hover:border-brand-teal hover:text-brand-teal disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={20} /></button>
      <button type="button" aria-label={locale === "zh" ? "下一项" : "Next item"} disabled={!canScrollNext} onClick={() => emblaApi?.scrollNext()} className="rounded-full border border-brand-border p-2.5 text-brand-ink transition hover:border-brand-teal hover:text-brand-teal disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={20} /></button>
    </div> : null}
  </div>;
}
