import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Article } from "@/types/content";

export function FeaturedArticles({ locale, articles, title }: { locale: Locale; articles: Article[]; title?: string | null }) {
  const items = articles.slice(0, 3);
  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-4"><h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title ?? (locale === "zh" ? "最新文章" : "Latest articles")}</h2><Link href={localizedHref(locale, "/blog")} className="text-sm font-semibold text-blue-700 hover:underline">{locale === "zh" ? "阅读博客" : "Read blog"}</Link></div>{items.length ? <div className="grid gap-6 md:grid-cols-3">{items.map((article) => { const image = resolveMediaUrl(article.cover); return <article key={article.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white"><Link href={localizedHref(locale, `/blog/${article.slug}`)} className="block focus-visible:outline-2 focus-visible:outline-blue-600">{image ? <div className="relative aspect-[16/9] bg-slate-100"><Image src={image} alt={article.cover?.alternativeText ?? article.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div> : null}<div className="p-5"><h3 className="text-lg font-semibold text-slate-950">{article.title}</h3>{article.description ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{article.description}</p> : null}</div></Link></article>; })}</div> : <p className="rounded-lg border border-dashed border-slate-300 p-8 text-slate-500">{locale === "zh" ? "暂无推荐文章" : "No featured articles yet"}</p>}</section>;
}
