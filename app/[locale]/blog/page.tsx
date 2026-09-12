import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getGlobal } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, { title: locale === "zh" ? "博客" : "Blog", description: global?.siteDescription ?? undefined });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = await getArticles(locale);
  return <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><header className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{locale === "zh" ? "博客" : "Blog"}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{locale === "zh" ? "来自现场的洞察" : "Insights from the field"}</h1></header>{articles.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => { const image = resolveMediaUrl(article.cover); return <article key={article.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><Link href={localizedHref(locale, `/blog/${article.slug}`)} className="block">{image ? <div className="relative aspect-[16/9] bg-slate-100"><Image src={image} alt={article.cover?.alternativeText ?? article.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" /></div> : null}<div className="p-6"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{article.author?.name ?? (locale === "zh" ? "Northstar 团队" : "Northstar team")}</p><h2 className="mt-2 text-xl font-semibold text-slate-950">{article.title}</h2>{article.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.description}</p> : null}</div></Link></article>; })}</div> : <p className="mt-12 rounded-lg border border-dashed border-slate-300 p-8 text-slate-500">{locale === "zh" ? "暂无文章" : "No articles yet"}</p>}</section>;
}
