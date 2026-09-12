import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { getArticleBySlug } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await getArticleBySlug(slug, locale);
  return createMetadata(article?.seo, { title: article?.title ?? (locale === "zh" ? "文章" : "Article"), description: article?.description ?? undefined });
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();
  const cover = resolveMediaUrl(article.cover);
  const date = article.publishedAt ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long" }).format(new Date(article.publishedAt)) : null;
  return <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"><header className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{article.category?.name ?? (locale === "zh" ? "博客" : "Blog")}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{article.title}</h1>{article.description ? <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">{article.description}</p> : null}<p className="mt-6 text-sm text-slate-500">{[article.author?.name, date].filter(Boolean).join(" · ")}</p></header>{cover ? <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-xl bg-slate-100"><Image src={cover} alt={article.cover?.alternativeText ?? article.title} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" /></div> : null}<div className="mx-auto mt-12 max-w-3xl"><RichTextRenderer blocks={article.blocks} /></div></article>;
}
