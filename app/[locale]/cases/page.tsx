import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cases/CaseCard";
import { CaseFilters } from "@/components/cases/CaseFilters";
import { getCaseStudies, getGlobal } from "@/lib/strapi/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";

type Params = { locale: string };
type Search = { q?: string; industry?: string; product?: string; scenario?: string };
const options = (items: Array<{ slug: string; name?: string; title?: string }>) => Array.from(new Map(items.filter((x) => x.slug).map((x) => [x.slug, { value: x.slug, label: x.name ?? x.title ?? x.slug }])).values());

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; const global = await getGlobal(locale); return createMetadata(null, { title: locale === "zh" ? "客户案例" : "Case studies", description: global?.siteDescription ?? undefined }); }

export default async function CasesPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const { q, industry, product, scenario } = await searchParams; const query = [q?.trim() ? `filters[title][$containsi]=${encodeURIComponent(q.trim())}` : "", industry ? `filters[industry][$eq]=${encodeURIComponent(industry)}` : "", product ? `filters[products][slug][$eq]=${encodeURIComponent(product)}` : "", scenario ? `filters[scenarios][slug][$eq]=${encodeURIComponent(scenario)}` : ""].filter(Boolean).join("&");
  const [cases, allCases] = await Promise.all([getCaseStudies(locale, query), getCaseStudies(locale)]);
  const industries = options(allCases.map((item) => ({ slug: item.industry ?? "", name: item.industry ?? "" })));
  const products = options(allCases.flatMap((item) => item.products ?? [])); const scenarios = options(allCases.flatMap((item) => item.scenarios ?? []));
  return <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><header className="relative overflow-hidden rounded-3xl bg-brand-ink px-6 py-14 text-white sm:px-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-lime">{locale === "zh" ? "客户案例" : "Customer cases"}</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{locale === "zh" ? "用更好的包装解决真实业务问题" : "Packaging solutions proven in the field"}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{locale === "zh" ? "了解不同行业如何借助艾美森提升保护、效率与交付体验。" : "See how teams across industries improve protection, efficiency, and delivery with Ameson."}</p></header><div className="mt-10"><CaseFilters locale={locale} q={q} industry={industry} product={product} scenario={scenario} industries={industries} products={products} scenarios={scenarios} /><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">{industry || (locale === "zh" ? "全部案例" : "All case studies")}</p><h2 className="mt-2 text-2xl font-semibold text-brand-ink sm:text-3xl">{q ? (locale === "zh" ? `搜索结果：“${q}”` : `Results for “${q}”`) : (locale === "zh" ? "精选案例" : "Featured case studies")}</h2></div><span className="text-sm text-brand-muted">{cases.length} {locale === "zh" ? "个案例" : "cases"}</span></div>{cases.length ? <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{cases.map((item) => <CaseCard key={item.id} caseStudy={item} locale={locale} />)}</div> : <div className="brand-panel p-12 text-center"><p className="text-brand-muted">{locale === "zh" ? "没有找到匹配的客户案例。" : "No case studies matched your filters."}</p><Link href={localizedHref(locale, "/cases")} className="brand-button-primary mt-5">{locale === "zh" ? "查看全部案例" : "View all cases"}</Link></div>}</div></section>;
}
