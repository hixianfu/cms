import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/content/MediaGallery";
import { getCaseStudyBySlug } from "@/lib/strapi/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await getCaseStudyBySlug(slug, locale);
  return createMetadata(item?.seo, { title: item?.title ?? (locale === "zh" ? "客户案例" : "Case study"), description: item?.summary ?? undefined });
}

type Ref = { slug: string; name?: string; title?: string };
function RelatedLinks({ items, locale, path }: { items?: Ref[]; locale: string; path: string }) {
  return items?.map((item) => <Link key={item.slug} href={localizedHref(locale, `/${path}/${item.slug}`)} className="group flex items-center justify-between border-b border-brand-border py-3 text-sm font-semibold text-brand-ink last:border-0"><span>{item.name ?? item.title ?? item.slug}</span><ArrowUpRight size={15} className="text-brand-teal transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>);
}
function Section({ title, body }: { title: string; body?: string | null }) { return body ? <section><h2 className="text-2xl font-semibold text-brand-ink">{title}</h2><p className="mt-4 whitespace-pre-line text-base leading-8 text-brand-muted">{body}</p></section> : null; }

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getCaseStudyBySlug(slug, locale);
  if (!item) notFound();
  const cover = resolveMediaUrl(item.cover);
  return <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
    <Link href={localizedHref(locale, "/cases")} className="brand-link inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} />{locale === "zh" ? "返回客户案例" : "Back to case studies"}</Link>
    <header className="mx-auto mt-10 max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-teal">{item.industry ?? (locale === "zh" ? "客户案例" : "Case study")}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-ink sm:text-6xl">{item.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted">{item.summary}</p></header>
    {cover ? <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-3xl shadow-lg"><Image src={cover} alt={item.cover?.alternativeText ?? item.title} fill priority sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" /></div> : null}
    <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]"><div className="space-y-10"><Section title={locale === "zh" ? "客户问题" : "Customer challenge"} body={item.customerProblem} /><Section title={locale === "zh" ? "原包装方式" : "Original packaging"} body={item.originalPackaging} /><section><h2 className="text-2xl font-semibold text-brand-ink">{locale === "zh" ? "艾美森解决方案" : "Ameson solution"}</h2>{item.solution ? <div className="prose prose-slate mt-4 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{item.solution}</ReactMarkdown></div> : null}</section><Section title={locale === "zh" ? "实施效果" : "Results"} body={item.results} />{item.gallery?.length ? <section><h2 className="mb-5 text-2xl font-semibold text-brand-ink">{locale === "zh" ? "案例图片" : "Case media"}</h2><MediaGallery media={item.gallery} label={locale === "zh" ? "案例图片" : "Case gallery"} /></section> : null}</div>
      <aside className="space-y-6"><div className="brand-panel p-5"><h2 className="text-sm font-bold uppercase tracking-[0.16em] text-brand-teal">{locale === "zh" ? "相关内容" : "Related content"}</h2>{item.products?.length ? <div className="mt-4"><p className="mb-1 text-xs font-semibold text-brand-muted">{locale === "zh" ? "相关产品" : "Products"}</p><RelatedLinks items={item.products} locale={locale} path="products" /></div> : null}{item.solutions?.length ? <div className="mt-4"><p className="mb-1 text-xs font-semibold text-brand-muted">{locale === "zh" ? "相关方案" : "Solutions"}</p><RelatedLinks items={item.solutions} locale={locale} path="solutions" /></div> : null}{item.scenarios?.length ? <div className="mt-4"><p className="mb-1 text-xs font-semibold text-brand-muted">{locale === "zh" ? "应用场景" : "Scenarios"}</p><RelatedLinks items={item.scenarios} locale={locale} path="scenarios" /></div> : null}{item.articles?.length ? <div className="mt-4"><p className="mb-1 text-xs font-semibold text-brand-muted">{locale === "zh" ? "相关文章" : "Articles"}</p><RelatedLinks items={item.articles} locale={locale} path="blog" /></div> : null}</div><div className="rounded-2xl bg-brand-blue p-6 text-white"><h2 className="text-xl font-semibold">{locale === "zh" ? "需要类似方案？" : "Need a similar solution?"}</h2><p className="mt-3 text-sm leading-6 text-blue-100">{locale === "zh" ? "联系我们，获取适合你业务的包装建议。" : "Talk with our team about the right packaging approach for your operation."}</p><Link href={localizedHref(locale, "/contact")} className="brand-button-accent mt-5">{locale === "zh" ? "立即询盘" : "Start an inquiry"}<ArrowUpRight size={16} /></Link></div></aside>
    </div>
  </article>;
}
