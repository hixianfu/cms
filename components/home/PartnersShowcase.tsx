"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { HomePartners } from "@/types/content";

export function PartnersShowcase({ locale, section }: { locale: Locale; section: HomePartners }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const partners = section.partners ?? [];
  if (!partners.length) return null;

  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label={section.title ?? (locale === "zh" ? "合作伙伴" : "Partners")}>
    {section.title ? <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">{section.title}</h2> : null}
    <div className="grid grid-cols-2 border-y border-brand-border bg-white sm:grid-cols-3 lg:grid-cols-5" onMouseLeave={() => setActiveIndex(null)}>
      {partners.map((partner, index) => {
        const image = resolveMediaUrl(partner.image);
        const muted = activeIndex !== null && activeIndex !== index;
        const active = activeIndex === index;
        const external = /^https?:\/\//.test(partner.href);
        const href = external ? partner.href : localizedHref(locale, partner.href);
        return <Link key={partner.id ?? `${partner.name}-${index}`} href={href} target={partner.openInNewTab ? "_blank" : undefined} rel={partner.openInNewTab ? "noreferrer" : undefined} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} className={`group flex min-h-32 items-center justify-center p-6 transition duration-300 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal sm:min-h-36 ${muted ? "scale-95 grayscale opacity-30" : active ? "relative z-10 scale-[1.04] grayscale-0 opacity-100" : "grayscale-0 opacity-100"}`}>
          {image ? <div className="relative h-14 w-full max-w-40 sm:h-16"><Image src={image} alt={partner.imageAlt ?? partner.image?.alternativeText ?? partner.name} fill sizes="(min-width: 1024px) 160px, (min-width: 640px) 30vw, 45vw" className="object-contain" /></div> : <span className="text-center text-lg font-semibold text-brand-ink">{partner.name}</span>}
        </Link>;
      })}
    </div>
  </section>;
}
