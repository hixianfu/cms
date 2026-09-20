"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { HomeCompanyShowcase } from "@/types/content";

gsap.registerPlugin(useGSAP);

export function CompanyShowcase({ locale, section }: { locale: Locale; section: HomeCompanyShowcase }) {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundImage = resolveMediaUrl(section.backgroundImage);
  const articleHref = section.article?.slug ? localizedHref(locale, `/blog/${section.article.slug}`) : null;
  const { contextSafe } = useGSAP({ scope: sectionRef });

  const animateHighlightLine = contextSafe((event: MouseEvent<HTMLLIElement>, expanded: boolean) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = event.currentTarget.querySelector<HTMLElement>(".company-showcase-line");
    if (!line) return;
    gsap.to(line, {
      width: expanded ? "100%" : "7rem",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  useGSAP(() => {
    const root = sectionRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(".company-showcase-background", { opacity: 0.72, scale: 1.04 });
    gsap.set(".company-showcase-intro", { opacity: 0, y: 18 });
    gsap.set(".company-showcase-highlight", { opacity: 0, y: 14 });
    gsap.set(".company-showcase-line", { scaleX: 0, transformOrigin: "left center" });

    const timeline = gsap.timeline({ paused: true })
      .to(".company-showcase-background", { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }, 0)
      .to(".company-showcase-intro", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.12)
      .to(".company-showcase-highlight", { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "power2.out" }, 0.38)
      .to(".company-showcase-line", { scaleX: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" }, 0.5);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      timeline.play();
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(root);

    return () => {
      observer.disconnect();
      timeline.kill();
    };
  }, { scope: sectionRef });

  const eyebrow = locale === "zh" ? "关于我们" : "About us";

  return (
    <section ref={sectionRef} data-testid="company-showcase" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-ink text-white">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={section.backgroundImage?.alternativeText ?? section.imageAlt ?? section.title}
          fill
          sizes="100vw"
          className="company-showcase-background object-cover object-center"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,21,47,0.96)_0%,rgba(5,30,61,0.86)_44%,rgba(4,20,43,0.46)_76%,rgba(3,14,31,0.25)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,16,37,0.78)_0%,transparent_48%)]" />
      <div aria-hidden="true" className="absolute -left-28 top-1/4 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />
      <div aria-hidden="true" className="absolute right-[8%] top-[12%] h-40 w-40 rounded-full border border-white/15" />
      <div aria-hidden="true" className="absolute right-[calc(8%+2rem)] top-[calc(12%+2rem)] h-40 w-40 rounded-full border border-white/10" />

      <div className="relative mx-auto flex min-h-[720px] max-w-[1720px] flex-col px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[820px] lg:px-8 lg:py-24 xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-4xl">
            <div className="company-showcase-intro mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-brand-teal" />
              {eyebrow}
            </div>
            <h2 className="company-showcase-intro max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-7xl">
              {section.title}
            </h2>
            {section.subtitle ? <p className="company-showcase-intro mt-6 max-w-3xl text-lg font-medium leading-8 text-white/90 sm:text-xl lg:text-2xl lg:leading-9">{section.subtitle}</p> : null}
          </div>
          {articleHref && section.buttonLabel ? (
            <Link href={articleHref} className="company-showcase-intro group inline-flex w-fit items-center gap-5 rounded-full border border-white/70 bg-white py-2 pl-6 pr-2 text-sm font-bold text-brand-ink shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {section.buttonLabel}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-blue text-white transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-brand-teal"><ArrowRight size={19} /></span>
            </Link>
          ) : null}
        </div>

        {section.description ? <p className="company-showcase-intro mt-10 max-w-3xl border-l border-white/35 pl-5 text-base leading-8 text-white/72 sm:text-lg lg:mt-14 lg:pl-7">{section.description}</p> : null}

        {section.highlights?.length ? (
          <ul className="mt-auto grid gap-4 pt-14 sm:grid-cols-2 lg:grid-cols-3 lg:pt-20">
            {section.highlights.map((highlight, index) => (
              <li key={highlight.id ?? `${highlight.text}-${index}`} onMouseEnter={(event) => animateHighlightLine(event, true)} onMouseLeave={(event) => animateHighlightLine(event, false)} className="company-showcase-highlight group relative min-h-40 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-6 pb-7 text-base font-semibold leading-7 text-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.1)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.13] sm:p-7 sm:text-lg">
                <span aria-hidden="true" className="mb-8 block text-xs font-semibold tracking-[0.24em] text-white/45">{String(index + 1).padStart(2, "0")}</span>
                <span className="block max-w-sm">{highlight.text}</span>
                <span aria-hidden="true" className="company-showcase-line absolute bottom-0 left-0 h-0.5 w-28 bg-brand-teal" />
                <span aria-hidden="true" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 group-hover:rotate-90 group-hover:border-brand-teal group-hover:bg-brand-teal"><Plus size={16} /></span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
