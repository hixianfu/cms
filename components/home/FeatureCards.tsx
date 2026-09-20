import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { HomeFeatureCard } from "@/types/content";
import { featureCardHref } from "@/lib/home-feature-links";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { ContentCarousel } from "./ContentCarousel";

export function FeatureCards({ locale, title, description, cards = [] }: { locale: Locale; title: string; description?: string | null; cards?: HomeFeatureCard[] }) {
  if (!cards.length) return null;
  return <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><header className="mb-10"><h2 className="flex items-center gap-3 text-3xl font-semibold text-brand-ink sm:text-4xl"><span className="h-10 w-2 -skew-x-6 bg-brand-blue" />{title}</h2>{description ? <p className="mt-3 max-w-3xl text-lg leading-8 text-brand-muted">{description}</p> : null}</header><ContentCarousel columns="features" locale={locale} label={title}>{cards.map((card, index) => { const target = cardTarget(card); const slug = target?.slug; const image = resolveMediaUrl(card.image); const href = slug ? featureCardHref(locale, card.targetType, slug) : null; const content = <><div className="relative aspect-[1.35] overflow-hidden bg-slate-100">{image ? <Image src={image} alt={card.image?.alternativeText ?? card.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" /><span className="absolute bottom-4 left-4 grid h-9 w-9 place-items-center rounded-full bg-brand-blue text-white transition group-hover:bg-white group-hover:text-brand-blue"><Plus size={19} /></span></div><div className="relative min-h-44 bg-white p-5"><span className="pointer-events-none absolute right-3 top-0 text-8xl font-semibold leading-none text-slate-100">{String(index + 1).padStart(2, "0")}</span><h3 className="relative text-lg font-semibold text-brand-ink">{card.title}</h3>{card.description ? <p className="relative mt-3 text-sm leading-6 text-brand-muted">{card.description}</p> : null}</div></>; return href ? <Link key={card.id ?? `${card.title}-${index}`} href={href} className="group block h-full overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-brand-teal">{content}</Link> : <article key={card.id ?? `${card.title}-${index}`} className="group h-full overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">{content}</article>; })}</ContentCarousel></section>;
}

function cardTarget(card: HomeFeatureCard) {
  switch (card.targetType) {
    case "product": return card.product;
    case "article": return card.article;
    case "solution": return card.solution;
    case "scenario": return card.scenario;
    case "case": return card.case;
  }
}
