"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { HomeSolutionEntry, HomeSolutions } from "@/types/content";

gsap.registerPlugin(useGSAP);

export function SolutionsShowcase({ locale, section }: { locale: Locale; section: HomeSolutions }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const entries = section.entries?.length ? section.entries : groupLegacySolutions(section);
  const active = entries[selectedIndex] ?? entries[0];
  const titleOf = (entry: HomeSolutionEntry) => entry.title || entry.category?.name || "";
  const descriptionOf = (entry: HomeSolutionEntry) => entry.description || entry.category?.description || "";
  const backgroundImage = resolveMediaUrl(active?.backgroundImage ?? section.backgroundImage ?? active?.solutions?.[0]?.cover);
  const categoryHref = active?.category?.slug ? localizedHref(locale, `/solutions?category=${encodeURIComponent(active.category.slug)}`) : null;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".solution-category-option", {
      opacity: 0,
      x: 18,
      duration: 0.45,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "transform,opacity",
    });
  }, { scope: sectionRef });

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !active) return;
    if (backgroundRef.current) {
      gsap.fromTo(backgroundRef.current, { opacity: 0.25, scale: 1.025 }, { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out", clearProps: "transform,opacity" });
    }
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: "power2.out", clearProps: "transform,opacity" });
    }
  }, { scope: sectionRef, dependencies: [selectedIndex], revertOnUpdate: true });

  if (!active) return null;

  return <section ref={sectionRef} data-testid="solutions-showcase" aria-label={section.title ?? (locale === "zh" ? "首页解决方案" : "Solutions")} className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#174da8] text-white">
    {backgroundImage ? <Image ref={backgroundRef} key={backgroundImage} data-testid="solution-category-background" src={backgroundImage} alt={active.imageAlt ?? active.backgroundImage?.alternativeText ?? section.imageAlt ?? section.backgroundImage?.alternativeText ?? titleOf(active)} fill sizes="100vw" className="object-cover" /> : null}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,73,163,0.92)_0%,rgba(20,80,170,0.76)_47%,rgba(11,46,94,0.49)_100%)]" />
    <div className="relative mx-auto grid min-h-[740px] max-w-[1664px] lg:grid-cols-[60%_40%]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-[clamp(3rem,6vw,6.5rem)] lg:py-20">
        <div ref={contentRef} key={active.id ?? active.category?.id ?? selectedIndex} data-testid="active-solution-category" className="max-w-[800px]">
          <h2 className="text-4xl font-medium tracking-wide sm:text-5xl lg:leading-tight">{titleOf(active)}</h2>
          {descriptionOf(active) ? <p className="mt-8 max-w-[780px] text-lg font-medium leading-9 text-white/85 sm:text-[23px] sm:leading-[1.7]">{descriptionOf(active)}</p> : null}
          {active.solutions?.length ? <ul className="mt-14 space-y-5 sm:mt-16">
            {active.solutions.map((solution) => <li key={solution.id}>
              <Link href={localizedHref(locale, `/solutions/${solution.slug}`)} className="group inline-flex items-center gap-5 text-lg font-semibold hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[22px]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/55 text-brand-blue transition group-hover:bg-white"><ChevronRight size={20} /></span>{solution.title}
              </Link>
            </li>)}
          </ul> : null}
          {categoryHref ? <Link href={categoryHref} className="group mt-16 inline-flex w-fit items-center gap-5 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-bold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-20">
            {section.buttonLabel || (locale === "zh" ? "了解详情" : "Learn more")}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-blue text-white transition group-hover:bg-brand-teal"><ArrowRight size={19} /></span>
          </Link> : null}
        </div>
      </div>
      <div className="flex flex-col bg-[#0b2d59]/60 backdrop-blur-[1px]">
        {entries.map((entry, index) => {
          const selected = active === entry;
          return <button key={entry.id ?? entry.category?.id ?? index} type="button" onMouseEnter={() => setSelectedIndex(index)} onFocus={() => setSelectedIndex(index)} onClick={() => setSelectedIndex(index)} aria-pressed={selected} className={`solution-category-option group flex min-h-40 flex-1 items-center justify-between gap-5 border-b border-white/35 px-6 py-8 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-10 lg:px-12 ${selected ? "bg-[#e5ebf5] text-brand-blue" : "text-white hover:bg-[#e5ebf5] hover:text-brand-blue"}`}>
            <span className="block max-w-lg">
              <span className="block text-xl font-semibold tracking-wide sm:text-2xl">{titleOf(entry)}</span>
              {descriptionOf(entry) ? <span className={`mt-3 block line-clamp-3 text-sm font-medium leading-6 sm:text-base ${selected ? "text-brand-ink" : "text-white/85 group-hover:text-brand-ink"}`}>{descriptionOf(entry)}</span> : null}
            </span>
            <span aria-hidden="true" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors ${selected ? "bg-brand-blue text-white" : "bg-white text-brand-blue group-hover:bg-brand-blue group-hover:text-white"}`}><Plus size={24} strokeWidth={1.6} /></span>
          </button>;
        })}
      </div>
    </div>
  </section>;
}

function groupLegacySolutions(section: HomeSolutions): HomeSolutionEntry[] {
  const groups = new Map<string, HomeSolutionEntry>();
  for (const solution of section.solutions ?? []) {
    const category = solution.category;
    const key = String(category?.id ?? category?.slug ?? "uncategorized");
    const existing = groups.get(key);
    if (existing) {
      existing.solutions?.push(solution);
    } else {
      groups.set(key, {
        category,
        title: category?.name ?? section.title ?? solution.title,
        description: category?.description ?? solution.summary,
        backgroundImage: solution.cover,
        solutions: [solution],
      });
    }
  }
  return [...groups.values()];
}
