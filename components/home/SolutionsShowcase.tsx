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
  const eyebrow = locale === "zh" ? "解决方案" : "Our solutions";

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

  return <section ref={sectionRef} data-testid="solutions-showcase" aria-label={section.title ?? (locale === "zh" ? "首页解决方案" : "Solutions")} className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-ink text-white">
    {backgroundImage ? <Image ref={backgroundRef} key={backgroundImage} data-testid="solution-category-background" src={backgroundImage} alt={active.imageAlt ?? active.backgroundImage?.alternativeText ?? section.imageAlt ?? section.backgroundImage?.alternativeText ?? titleOf(active)} fill sizes="100vw" className="object-cover object-center" /> : null}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,26,61,0.96)_0%,rgba(5,46,103,0.85)_49%,rgba(3,19,43,0.74)_100%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,15,34,0.55)_0%,transparent_52%)]" />
    <div aria-hidden="true" className="absolute -left-20 bottom-[-10rem] h-[32rem] w-[32rem] rounded-full bg-brand-blue/25 blur-3xl" />

    <div className="relative mx-auto grid min-h-[780px] max-w-[1720px] lg:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.85fr)] lg:gap-8 lg:px-8 lg:py-12 xl:gap-12 xl:px-12 xl:py-16">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-[clamp(2rem,4vw,5rem)] lg:py-12">
        <div ref={contentRef} key={active.id ?? active.category?.id ?? selectedIndex} data-testid="active-solution-category" className="max-w-[820px]">
          <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/65 sm:text-sm">
            <span aria-hidden="true" className="h-px w-10 bg-brand-teal" />
            {eyebrow}
          </div>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-5xl lg:text-6xl">{titleOf(active)}</h2>
          {descriptionOf(active) ? <p className="mt-7 max-w-[760px] border-l border-white/30 pl-5 text-base leading-8 text-white/75 sm:text-lg sm:leading-9 lg:pl-7">{descriptionOf(active)}</p> : null}
          {active.solutions?.length ? <ul className="mt-10 grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-2 sm:mt-12">
            {active.solutions.map((solution) => <li key={solution.id}>
              <Link href={localizedHref(locale, `/solutions/${solution.slug}`)} className="group flex min-h-16 items-center gap-4 rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base font-semibold leading-6 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-lg">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand-blue transition duration-300 group-hover:bg-brand-teal group-hover:text-white"><ChevronRight size={19} /></span><span>{solution.title}</span>
              </Link>
            </li>)}
          </ul> : null}
          {categoryHref ? <Link href={categoryHref} className="group mt-12 inline-flex w-fit items-center gap-5 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold text-brand-ink shadow-[0_14px_40px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:mt-14">
            {section.buttonLabel || (locale === "zh" ? "了解详情" : "Learn more")}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-blue text-white transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-brand-teal"><ArrowRight size={19} /></span>
          </Link> : null}
        </div>
      </div>
      <div className="flex flex-col border-y border-white/15 bg-[#061b39]/70 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-md lg:overflow-hidden lg:rounded-[1.75rem] lg:border">
        <div className="flex items-center justify-between border-b border-white/15 px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/55 sm:px-8">
          <span>{locale === "zh" ? "方案分类" : "Categories"}</span>
          <span>{String(entries.length).padStart(2, "0")}</span>
        </div>
        {entries.map((entry, index) => {
          const selected = active === entry;
          return <button key={entry.id ?? entry.category?.id ?? index} type="button" onMouseEnter={() => setSelectedIndex(index)} onFocus={() => setSelectedIndex(index)} onClick={() => setSelectedIndex(index)} aria-pressed={selected} className={`solution-category-option group relative flex min-h-36 flex-1 items-center justify-between gap-5 border-b border-white/15 px-6 py-7 text-left transition-all duration-300 last:border-b-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-8 lg:px-9 ${selected ? "bg-white text-brand-blue shadow-[0_12px_36px_rgba(0,0,0,0.14)]" : "text-white hover:bg-white/[0.09]"}`}>
            <span className="flex min-w-0 gap-4">
              <span className={`pt-1 text-xs font-semibold tracking-[0.18em] transition-colors ${selected ? "text-brand-teal" : "text-white/35 group-hover:text-white/60"}`}>{String(index + 1).padStart(2, "0")}</span>
              <span className="block max-w-lg">
                <span className="block text-lg font-semibold leading-7 sm:text-xl">{titleOf(entry)}</span>
                {descriptionOf(entry) ? <span className={`mt-2 block line-clamp-2 text-sm leading-6 transition-colors ${selected ? "text-brand-muted" : "text-white/65 group-hover:text-white/85"}`}>{descriptionOf(entry)}</span> : null}
              </span>
            </span>
            <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition duration-300 ${selected ? "rotate-45 border-brand-blue bg-brand-blue text-white" : "border-white/25 bg-white/10 text-white group-hover:border-white/45 group-hover:bg-white/15"}`}><Plus size={19} strokeWidth={1.7} /></span>
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
