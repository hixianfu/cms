import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleHelp,
  Compass,
  Layers3,
  MailSearch,
  Newspaper,
  Package,
  PlaySquare,
  Search,
} from "lucide-react";
import { notFound } from "next/navigation";
import {
  getArticles,
  getCaseStudies,
  getFaqs,
  getGlobal,
  getProducts,
  getScenarios,
  getSolutions,
  getVideos,
} from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { createMetadata } from "@/lib/seo/metadata";
import type { Locale, Media } from "@/types/content";

type SearchParams = { q?: string; type?: string };
type SearchItem = { id: number | string; slug: string; title?: string; name?: string; question?: string; summary?: string | null; description?: string | null; cover?: Media | null };
type Group = { key: string; label: string; path: string; items: SearchItem[] };

const labels = (zh: boolean) => ({ products: zh ? "产品" : "Products", solutions: zh ? "解决方案" : "Solutions", scenarios: zh ? "应用场景" : "Scenarios", cases: zh ? "客户案例" : "Case studies", videos: zh ? "视频" : "Videos", articles: zh ? "博客" : "Articles", faqs: "FAQ" });

function GroupIcon({ group }: { group: string }) {
  const props = { size: 18, strokeWidth: 1.8, "aria-hidden": true } as const;
  if (group === "products") return <Package {...props} />;
  if (group === "solutions") return <Layers3 {...props} />;
  if (group === "scenarios") return <Compass {...props} />;
  if (group === "cases") return <BriefcaseBusiness {...props} />;
  if (group === "videos") return <PlaySquare {...props} />;
  if (group === "articles") return <Newspaper {...props} />;
  return <CircleHelp {...props} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, { title: locale === "zh" ? "全站搜索" : "Site search", description: global?.siteDescription ?? undefined });
}

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale = locale as Locale;
  const { q, type } = await searchParams;
  const term = q?.trim() ?? "";
  const zh = locale === "zh";
  const names = labels(zh);
  let groups: Group[] = [];

  if (term) {
    const value = encodeURIComponent(term);
    const [products, solutions, scenarios, cases, videos, articles, faqs] = await Promise.all([
      getProducts(currentLocale, `filters[$or][0][name][$containsi]=${value}&filters[$or][1][summary][$containsi]=${value}`),
      getSolutions(currentLocale, `filters[$or][0][title][$containsi]=${value}&filters[$or][1][summary][$containsi]=${value}&filters[$or][2][industry][$containsi]=${value}`),
      getScenarios(currentLocale, `filters[$or][0][title][$containsi]=${value}&filters[$or][1][summary][$containsi]=${value}&filters[$or][2][industry][$containsi]=${value}`),
      getCaseStudies(currentLocale, `filters[$or][0][title][$containsi]=${value}&filters[$or][1][summary][$containsi]=${value}&filters[$or][2][industry][$containsi]=${value}`),
      getVideos(currentLocale, `filters[$or][0][title][$containsi]=${value}&filters[$or][1][description][$containsi]=${value}`),
      getArticles(currentLocale, `filters[$or][0][title][$containsi]=${value}&filters[$or][1][description][$containsi]=${value}`),
      getFaqs(currentLocale, `filters[$or][0][question][$containsi]=${value}&filters[$or][1][answer][$containsi]=${value}`),
    ]);
    groups = [
      { key: "products", label: names.products, path: "products", items: products },
      { key: "solutions", label: names.solutions, path: "solutions", items: solutions },
      { key: "scenarios", label: names.scenarios, path: "scenarios", items: scenarios },
      { key: "cases", label: names.cases, path: "cases", items: cases },
      { key: "videos", label: names.videos, path: "videos", items: videos },
      { key: "articles", label: names.articles, path: "blog", items: articles },
      { key: "faqs", label: names.faqs, path: "faq", items: faqs },
    ].filter((group) => !type || group.key === type).filter((group) => group.items.length);
  }

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const filterItems = [{ key: "", label: zh ? "全部内容" : "All content" }, ...Object.entries(names).map(([key, label]) => ({ key, label }))];

  return <article className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef5f7_0%,#f8fafb_32rem,#f8fafb_100%)]"><div aria-hidden="true" className="pointer-events-none absolute -right-48 top-16 h-[30rem] w-[30rem] rounded-full bg-brand-teal/10 blur-3xl" /><div className="relative mx-auto max-w-[1720px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-28">
    <nav aria-label={zh ? "面包屑导航" : "Breadcrumb navigation"} className="flex items-center gap-2 text-sm text-brand-muted"><Link href={localizedHref(currentLocale, "/")} className="transition hover:text-brand-blue">{zh ? "首页" : "Home"}</Link><ArrowRight size={14} className="text-brand-teal" aria-hidden="true" /><span aria-current="page" className="font-semibold text-brand-ink">{zh ? "全站搜索" : "Site search"}</span></nav>
    <header className="relative mt-10 overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-12 text-white shadow-[0_24px_70px_rgba(18,50,74,0.18)] sm:px-10 sm:py-16 lg:px-16 lg:py-20"><div aria-hidden="true" className="absolute -right-24 -top-36 h-[28rem] w-[28rem] rounded-full bg-brand-teal/25 blur-3xl" /><div aria-hidden="true" className="absolute -bottom-48 left-1/3 h-80 w-80 rounded-full bg-brand-blue/25 blur-3xl" /><div className="relative max-w-4xl"><p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal sm:text-sm"><MailSearch size={16} aria-hidden="true" />{zh ? "探索内容" : "Explore our content"}</p><h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{zh ? "找到你需要的包装信息" : "Find the packaging information you need"}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{zh ? "搜索产品、解决方案、应用场景、客户案例与行业内容。" : "Search products, solutions, scenarios, case studies, and industry insights."}</p><form method="get" className="mt-9 flex max-w-4xl flex-col gap-3 sm:flex-row"><label htmlFor="site-search" className="sr-only">{zh ? "搜索关键词" : "Search keywords"}</label><div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 text-brand-ink shadow-[0_10px_30px_rgba(0,0,0,0.12)]"><Search size={19} className="shrink-0 text-brand-teal" aria-hidden="true" /><input id="site-search" name="q" defaultValue={term} placeholder={zh ? "输入关键词搜索" : "Enter a keyword"} className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-slate-400" /></div><button type="submit" className="brand-button-accent min-h-12 justify-center gap-2 rounded-xl px-6"><Search size={16} aria-hidden="true" />{zh ? "搜索" : "Search"}</button></form></div></header>
    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{term ? (zh ? "搜索结果" : "Search results") : (zh ? "内容索引" : "Content index")}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{term ? (zh ? `“${term}”的相关内容` : `Results for “${term}”`) : (zh ? "从这里开始探索" : "Start exploring")}</h2></div>{term ? <p className="text-sm text-brand-muted">{total}{zh ? " 条结果" : total === 1 ? " result" : " results"}</p> : null}</div>
    {term ? <div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label={zh ? "搜索分类" : "Search categories"}>{filterItems.map((item) => { const active = type === item.key || (!type && !item.key); return <Link key={item.key} href={localizedHref(currentLocale, `/search?q=${encodeURIComponent(term)}${item.key ? `&type=${item.key}` : ""}`)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-brand-blue bg-brand-blue text-white shadow-sm" : "border-brand-border bg-white/80 text-brand-muted hover:border-brand-teal hover:text-brand-blue"}`}>{item.label}</Link>; })}</div> : null}
    <div className="mt-8">{total ? <div className="space-y-12">{groups.map((group) => <section key={group.key}><div className="mb-5 flex items-center justify-between border-b border-brand-border/80 pb-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal"><GroupIcon group={group.key} /></span><h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">{group.label}</h2></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-muted shadow-sm">{group.items.length}</span></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{group.items.map((item) => { const image = resolveMediaUrl(item.cover); return <Link key={item.id} href={localizedHref(currentLocale, `/${group.path}/${item.slug}`)} className="group flex min-h-40 flex-col overflow-hidden rounded-2xl border border-brand-border/80 bg-white/90 shadow-[0_12px_34px_rgba(18,50,74,0.05)] transition duration-300 hover:-translate-y-1 hover:border-brand-teal/50 hover:shadow-[0_18px_40px_rgba(18,50,74,0.1)]"><div className="relative aspect-[16/8] overflow-hidden bg-[linear-gradient(135deg,#edf5f6,#f8fbfc)]">{image ? <Image src={image} alt={item.cover?.alternativeText ?? item.title ?? item.name ?? item.question ?? group.label} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-xs font-medium text-brand-muted">{zh ? "暂无封面" : "No cover image"}</div>}<div className="absolute inset-0 bg-gradient-to-t from-brand-ink/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" /></div><div className="flex min-h-40 flex-1 flex-col p-5"><div className="flex items-start justify-between gap-4"><h3 className="line-clamp-2 font-semibold leading-6 text-brand-ink transition group-hover:text-brand-blue">{item.title ?? item.name ?? item.question}</h3><ArrowUpRight size={17} className="shrink-0 text-brand-teal transition group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" /></div>{item.summary || item.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{item.summary ?? item.description}</p> : null}<span className="mt-auto pt-5 text-xs font-semibold text-brand-teal">{zh ? "查看详情" : "View details"}<ArrowRight size={13} className="ml-1 inline transition group-hover:translate-x-1" aria-hidden="true" /></span></div></Link>; })}</div></section>)}</div> : <section className="relative overflow-hidden rounded-[1.75rem] border border-brand-border/80 bg-white/90 px-6 py-16 text-center shadow-[0_18px_50px_rgba(18,50,74,0.07)] sm:px-10 sm:py-24"><div aria-hidden="true" className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-teal/10 blur-3xl" /><span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal"><Search size={24} aria-hidden="true" /></span><h2 className="relative mt-5 text-2xl font-semibold text-brand-ink">{term ? (zh ? "没有找到匹配的内容" : "No matching content found") : (zh ? "输入关键词开始搜索" : "Enter a keyword to search")}</h2><p className="relative mx-auto mt-3 max-w-md leading-7 text-brand-muted">{term ? (zh ? "试试更换关键词，或从上方选择其他内容分类。" : "Try a different keyword or explore another content category.") : (zh ? "从产品、解决方案到行业资讯，快速找到你关心的内容。" : "Find products, solutions, and insights in one place.")}</p></section>}</div>
  </div></article>;
}
