import Link from "next/link";
import { ArrowUpRight, BookOpenText, BriefcaseBusiness, CircleHelp, Compass, Layers3 } from "lucide-react";
import { localizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/types/content";

type RelatedItem = { title: string; slug: string };
type Groups = { solutions: RelatedItem[]; scenarios: RelatedItem[]; cases: RelatedItem[]; articles: RelatedItem[]; faqs: RelatedItem[] };

export function ProductRelatedContent({ groups, locale }: { groups: Groups; locale: Locale }) {
  const zh = locale === "zh";
  const sections = [
    { key: "solutions", title: zh ? "相关解决方案" : "Related solutions", path: "solutions", icon: Layers3, items: groups.solutions },
    { key: "scenarios", title: zh ? "相关应用场景" : "Related scenarios", path: "scenarios", icon: Compass, items: groups.scenarios },
    { key: "cases", title: zh ? "相关客户案例" : "Related case studies", path: "cases", icon: BriefcaseBusiness, items: groups.cases },
    { key: "articles", title: zh ? "相关文章" : "Related articles", path: "blog", icon: BookOpenText, items: groups.articles },
    { key: "faqs", title: zh ? "常见问题" : "FAQs", path: "faq", icon: CircleHelp, items: groups.faqs },
  ].filter((section) => section.items.length);

  if (!sections.length) return null;
  return <section className="mt-16 rounded-[1.75rem] border border-brand-border/80 bg-white/85 p-5 shadow-[0_18px_50px_rgba(18,50,74,0.06)] sm:p-8 lg:p-10" aria-labelledby="product-related-content-title">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-brand-border/80 pb-6">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{zh ? "延伸阅读" : "Explore more"}</p><h2 id="product-related-content-title" className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{zh ? "与本产品相关的内容" : "Related to this product"}</h2></div>
      <span className="text-sm text-brand-muted">{sections.reduce((sum, section) => sum + section.items.length, 0)} {zh ? "项内容" : "items"}</span>
    </header>
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">{sections.map((section) => { const Icon = section.icon; return <div key={section.key} className="min-w-0"><div className="mb-3 flex items-center gap-2 text-brand-teal"><Icon size={17} aria-hidden="true" /><h3 className="text-sm font-bold text-brand-ink">{section.title}</h3><span className="ml-auto rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs font-semibold">{section.items.length}</span></div><div className="divide-y divide-brand-border/70">{section.items.map((item) => <Link key={item.slug} href={localizedHref(locale, `/${section.path}/${item.slug}`)} className="group flex min-h-12 items-center justify-between gap-3 py-3 text-sm font-medium text-brand-muted transition hover:text-brand-blue"><span className="line-clamp-2">{item.title}</span><ArrowUpRight size={15} className="shrink-0 text-brand-teal transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>)}</div></div>; })}</div>
  </section>;
}
