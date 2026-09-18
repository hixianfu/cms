import Link from "next/link";
import { MarketingCard } from "./MarketingCard";
import { MarketingFilters } from "./MarketingFilters";
import { localizedHref } from "@/lib/i18n/routing";
import type { ContentCategory, Locale, Scenario, Solution } from "@/types/content";

type Kind = "solutions" | "scenarios";

export function MarketingListing({ locale, kind, items, allItems, categories, q, category, industry }: { locale: Locale; kind: Kind; items: Array<Solution | Scenario>; allItems: Array<Solution | Scenario>; categories: ContentCategory[]; q?: string; category?: string; industry?: string }) {
  const solution = kind === "solutions";
  const industries = Array.from(new Set(allItems.map((item) => item.industry).filter((value): value is string => Boolean(value)))).sort();
  const copy = locale === "zh"
    ? solution
      ? { eyebrow: "解决方案", title: "针对业务挑战的专业包装方案", description: "从客户痛点、包装需求和使用环境出发，选择适合业务的整体方案。", all: "全部解决方案", featured: "精选解决方案", empty: "没有找到匹配的解决方案。" }
      : { eyebrow: "应用场景", title: "让包装能力适配每一个真实场景", description: "了解艾美森产品在生产、仓储、物流和行业现场中的实际应用。", all: "全部应用场景", featured: "精选应用场景", empty: "没有找到匹配的应用场景。" }
    : solution
      ? { eyebrow: "Solutions", title: "Packaging solutions for real business challenges", description: "Start with customer pain points, packaging needs, and operating conditions to find the right approach.", all: "All solutions", featured: "Featured solutions", empty: "No solutions matched your filters." }
      : { eyebrow: "Application scenarios", title: "Packaging designed for every real-world scenario", description: "Explore how Ameson products support production, warehousing, logistics, and industry operations.", all: "All scenarios", featured: "Featured scenarios", empty: "No scenarios matched your filters." };

  const activeCategory = categories.find((item) => item.slug === category)?.name;
  return <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><header className="relative overflow-hidden rounded-3xl bg-brand-ink px-6 py-14 text-white sm:px-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-lime">{copy.eyebrow}</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{copy.description}</p></header><div className="mt-10"><MarketingFilters locale={locale} path={kind} q={q} category={category} industry={industry} categories={categories.map((item) => ({ value: item.slug, label: item.name }))} industries={industries} /><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">{activeCategory || industry || copy.all}</p><h2 className="mt-2 text-2xl font-semibold text-brand-ink sm:text-3xl">{q ? (locale === "zh" ? `搜索结果：“${q}”` : `Results for “${q}”`) : copy.featured}</h2></div><span className="text-sm text-brand-muted">{items.length} {locale === "zh" ? "项" : "items"}</span></div>{items.length ? <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <MarketingCard key={item.id} item={item} locale={locale} path={kind} />)}</div> : <div className="brand-panel p-12 text-center"><p className="text-brand-muted">{copy.empty}</p><Link href={localizedHref(locale, `/${kind}`)} className="brand-button-primary mt-5">{locale === "zh" ? "查看全部" : "View all"}</Link></div>}</div></section>;
}
