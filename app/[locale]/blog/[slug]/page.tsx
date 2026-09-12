import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { getArticleBySlug } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { createMetadata } from "@/lib/seo/metadata";
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const article = await getArticleBySlug(slug, locale); return createMetadata(article?.seo, { title: article?.title ?? "Article", description: article?.description ?? undefined }); }
export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const article = await getArticleBySlug(slug, locale); if (!article) notFound(); const cover = resolveMediaUrl(article.cover); const date = article.publishedAt ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long" }).format(new Date(article.publishedAt)) : null; return <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8"><Link href={localizedHref(locale, "/blog")} className="brand-link inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} />{locale === "zh" ? "返回博客" : "Back to blog"}</Link><header className="mx-auto mt-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-teal">{article.category?.name ?? (locale === "zh" ? "博客" : "Blog")}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">{article.title}</h1>{article.description ? <p className="mt-6 text-lg leading-8 text-brand-muted">{article.description}</p> : null}<p className="mt-6 inline-flex items-center gap-2 text-sm text-brand-muted"><CalendarDays size={15} />{[article.author?.name, date].filter(Boolean).join(" · ")}</p></header>{cover ? <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-3xl shadow-lg"><Image src={cover} alt={article.cover?.alternativeText ?? article.title} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" /></div> : null}<div className="mx-auto mt-14 max-w-3xl"><RichTextRenderer blocks={article.blocks} /></div></article>; }
