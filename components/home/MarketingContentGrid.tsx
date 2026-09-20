import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, Faq, Locale, Scenario, Solution, Video } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

type Item = Solution | Scenario | CaseStudy | Video | Faq;
const titleOf = (item: Item) => "title" in item ? item.title : item.question;
const summaryOf = (item: Item) => "summary" in item ? item.summary : "description" in item ? item.description : "answer" in item ? item.answer : null;

export function MarketingContentGrid({ locale, items, kind, title, description }: { locale: Locale; items: Item[]; kind: "solutions" | "scenarios" | "cases" | "videos" | "faq"; title: string; description?: string }) {
  if (!items.length) return null;
  const path = kind === "faq" ? "faq" : kind;

  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mb-8 max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-teal">{kind === "faq" ? "FAQ" : kind}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-brand-muted">{description}</p> : null}
    </div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 6).map((item) => {
        const image = "cover" in item ? resolveMediaUrl(item.cover) : null;
        const itemTitle = titleOf(item);
        const summary = summaryOf(item);

        return <Link key={item.id} href={localizedHref(locale, `/${path}/${item.slug}`)} className="brand-card group overflow-hidden">
          {image ? <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
            <Image src={image} alt={("cover" in item && item.cover?.alternativeText) || itemTitle} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
          </div> : null}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-brand-ink">{itemTitle}</h3>
              <ArrowUpRight size={17} className="shrink-0 text-brand-teal transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            {summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{summary}</p> : null}
          </div>
        </Link>;
      })}
    </div>
  </section>;
}
