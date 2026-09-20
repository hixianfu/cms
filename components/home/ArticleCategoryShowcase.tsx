"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Article, HomeArticleShowcase } from "@/types/content";

export function ArticleCategoryShowcase({ locale, section }: { locale: Locale; section: HomeArticleShowcase }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabsId = useId();
  const groups = section.groups ?? [];
  const active = groups[selectedIndex] ?? groups[0];
  if (!active) return null;

  const articles = (active.articles ?? []).slice(0, 4);
  const primary = articles[0];
  const secondary = articles.slice(1);

  return <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby={`${tabsId}-title`}>
    <header className="text-center">
      <h2 id={`${tabsId}-title`} className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">{section.title}</h2>
      <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 sm:gap-x-12" role="tablist" aria-label={locale === "zh" ? "文章分类" : "Article categories"}>
        {groups.map((group, index) => {
          const selected = index === selectedIndex;
          const label = group.label || group.category?.name || (locale === "zh" ? `分类 ${index + 1}` : `Category ${index + 1}`);
          return <button key={group.id ?? group.category?.id ?? index} id={`${tabsId}-tab-${index}`} type="button" role="tab" aria-selected={selected} aria-controls={`${tabsId}-panel`} onClick={() => setSelectedIndex(index)} className={`relative pb-3 text-base font-semibold transition-colors sm:text-lg ${selected ? "text-brand-blue" : "text-brand-muted hover:text-brand-blue"}`}>
            {label}
            <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-blue transition-transform duration-300 ${selected ? "scale-x-100" : "scale-x-0"}`} />
          </button>;
        })}
      </div>
    </header>

    <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${selectedIndex}`} className="mt-12">
      {primary ? <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-14">
        <PrimaryArticle article={primary} locale={locale} />
        <div className="divide-y divide-brand-border border-y border-brand-border">
          {secondary.map((article) => <SecondaryArticle key={article.id} article={article} locale={locale} />)}
        </div>
      </div> : <div className="brand-panel p-12 text-center text-brand-muted">{locale === "zh" ? "该分类暂未配置文章" : "No articles configured for this category"}</div>}
    </div>
  </section>;
}

function PrimaryArticle({ article, locale }: { article: Article; locale: Locale }) {
  const image = resolveMediaUrl(article.cover);
  return <article data-testid="primary-article" className="group min-w-0">
    <Link href={localizedHref(locale, `/blog/${article.slug}`)} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image ? <Image src={image} alt={article.cover?.alternativeText ?? article.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full bg-brand-teal/10" />}
      </div>
      <ArticleMeta article={article} locale={locale} className="mt-6" />
      <h3 className="mt-3 text-2xl font-semibold leading-tight text-brand-ink transition group-hover:text-brand-blue sm:text-3xl">{article.title}</h3>
      {article.description ? <p className="mt-4 line-clamp-3 text-base leading-7 text-brand-muted">{article.description}</p> : null}
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">{locale === "zh" ? "阅读文章" : "Read article"}<ArrowUpRight size={17} /></span>
    </Link>
  </article>;
}

function SecondaryArticle({ article, locale }: { article: Article; locale: Locale }) {
  const image = resolveMediaUrl(article.cover);
  return <article className="group py-6 first:pt-0 last:pb-0">
    <Link href={localizedHref(locale, `/blog/${article.slug}`)} className="grid gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal sm:grid-cols-[minmax(11rem,42%)_minmax(0,1fr)] sm:items-center">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {image ? <Image src={image} alt={article.cover?.alternativeText ?? article.title} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full bg-brand-teal/10" />}
      </div>
      <div className="min-w-0">
        <ArticleMeta article={article} locale={locale} />
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-7 text-brand-ink transition group-hover:text-brand-blue">{article.title}</h3>
        {article.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">{article.description}</p> : null}
      </div>
    </Link>
  </article>;
}

function ArticleMeta({ article, locale, className = "" }: { article: Article; locale: Locale; className?: string }) {
  const date = article.publishedAt ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "medium" }).format(new Date(article.publishedAt)) : null;
  if (!article.author?.name && !date) return null;
  return <p className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-brand-muted ${className}`}>
    {article.author?.name ? <span className="inline-flex items-center gap-1.5"><UserRound size={14} aria-hidden="true" />{article.author.name}</span> : null}
    {date ? <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />{date}</span> : null}
  </p>;
}
