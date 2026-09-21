import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Article } from "@/types/content";
import { ListingMediaPlaceholder } from "@/components/listing/ListingMediaPlaceholder";

const categoryLabels: Record<string, { zh: string; en: string }> = {
  "company-news": { zh: "公司新闻", en: "Company News" },
  "industry-news": { zh: "行业新闻", en: "Industry News" },
  charity: { zh: "爱心公益", en: "Charity & Public Welfare" },
  "public-notices": { zh: "公示信息", en: "Public Notices" },
};

export function articleCategoryName(
  slug: string,
  name: string | undefined,
  locale: Locale,
) {
  const baseSlug = slug.endsWith("-en") ? slug.slice(0, -3) : slug;
  return categoryLabels[baseSlug]?.[locale === "zh" ? "zh" : "en"] ?? name ?? slug;
}

export function isKnownArticleCategory(slug: string) {
  const baseSlug = slug.endsWith("-en") ? slug.slice(0, -3) : slug;
  return Boolean(categoryLabels[baseSlug]);
}

export function ArticleListingCard({
  article,
  locale,
  featured = false,
}: {
  article: Article;
  locale: Locale;
  featured?: boolean;
}) {
  const image = resolveMediaUrl(article.cover);
  const date = article.publishedAt
    ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
        dateStyle: "medium",
      }).format(new Date(article.publishedAt))
    : null;

  return (
    <article
      className="listing-card group h-full"
      data-featured={featured ? "true" : undefined}
    >
      <Link
        href={localizedHref(locale, `/blog/${article.slug}`)}
        className={`block h-full ${featured ? "md:grid md:grid-cols-2" : ""}`}
      >
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={article.cover?.alternativeText ?? article.title}
              fill
              sizes={featured ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingMediaPlaceholder motif="article" />
          )}
        </div>
        <div className="flex min-h-56 flex-col p-6 sm:p-7">
          {article.category ? (
            <p className="listing-eyebrow">
              {articleCategoryName(article.category.slug, article.category.name, locale)}
            </p>
          ) : null}
          <div className={`${article.category ? "mt-4" : ""} flex items-center gap-2 text-xs font-semibold uppercase text-brand-teal`}>
            <CalendarDays aria-hidden="true" size={14} />
            {date ?? (locale === "zh" ? "最新文章" : "Latest article")}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-brand-ink">{article.title}</h2>
          {article.description ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">
              {article.description}
            </p>
          ) : null}
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">
            {locale === "zh" ? "阅读文章" : "Read article"}
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
