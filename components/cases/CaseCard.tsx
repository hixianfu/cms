import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, Locale } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { ListingMediaPlaceholder } from "@/components/listing/ListingMediaPlaceholder";

export function CaseCard({
  caseStudy,
  locale,
  featured = false,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  featured?: boolean;
}) {
  const image = resolveMediaUrl(caseStudy.cover);

  return (
    <article className="listing-card group h-full" data-featured={featured ? "true" : undefined}>
      <Link
        href={localizedHref(locale, `/cases/${caseStudy.slug}`)}
        className={`block h-full ${featured ? "md:grid md:grid-cols-2" : ""}`}
      >
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={caseStudy.cover?.alternativeText ?? caseStudy.title}
              fill
              sizes={featured ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingMediaPlaceholder motif="case" />
          )}
        </div>
        <div className="flex min-h-56 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">
            {caseStudy.category ? <span>{caseStudy.category.name}</span> : null}
            {caseStudy.industry ? <span>{caseStudy.industry}</span> : null}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-brand-ink">{caseStudy.title}</h2>
          {caseStudy.results ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{caseStudy.results}</p>
          ) : null}
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">
            {locale === "zh" ? "查看案例" : "View case study"}
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
