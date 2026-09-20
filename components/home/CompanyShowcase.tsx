"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
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

  return (
    <section ref={sectionRef} data-testid="company-showcase" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-brand-ink text-white">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={section.backgroundImage?.alternativeText ?? section.imageAlt ?? section.title}
          fill
          sizes="100vw"
          className="company-showcase-background object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,25,57,0.88)_0%,rgba(8,31,65,0.67)_48%,rgba(4,15,35,0.45)_100%)]" />
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[760px] lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="max-w-4xl">
            <h2 className="company-showcase-intro flex items-start gap-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span aria-hidden="true" className="mt-1 h-10 w-2 -skew-x-12 bg-white sm:h-12" />
              {section.title}
            </h2>
            {section.subtitle ? <p className="company-showcase-intro mt-5 text-xl font-medium leading-8 text-white/95 sm:text-2xl">{section.subtitle}</p> : null}
          </div>
          {articleHref && section.buttonLabel ? (
            <Link href={articleHref} className="company-showcase-intro group inline-flex w-fit items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold text-brand-ink shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {section.buttonLabel}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-blue text-white transition group-hover:bg-brand-teal"><ArrowRight size={19} /></span>
            </Link>
          ) : null}
        </div>

        {section.description ? <p className="company-showcase-intro mt-12 max-w-5xl text-base font-medium leading-8 text-white/85 sm:text-lg lg:mt-16">{section.description}</p> : null}

        {section.highlights?.length ? (
          <ul className="mt-auto grid max-w-3xl gap-7 pt-14 sm:gap-9">
            {section.highlights.map((highlight, index) => (
              <li key={highlight.id ?? `${highlight.text}-${index}`} onMouseEnter={(event) => animateHighlightLine(event, true)} onMouseLeave={(event) => animateHighlightLine(event, false)} className="company-showcase-highlight group relative border-b border-white/40 pb-5 text-base font-semibold text-white/90 sm:text-lg">
                <span>{highlight.text}</span>
                <span aria-hidden="true" className="company-showcase-line absolute -bottom-px left-0 h-0.5 w-28 bg-brand-blue" />
                <span aria-hidden="true" className="absolute -bottom-3 right-0 grid h-6 w-6 place-items-center rounded-full bg-brand-blue text-xs text-white">+</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
