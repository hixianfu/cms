import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Locale } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";

type Option = { value: string; label: string };
export function FaqFilters({ locale, q, category, product, solution, categories, products, solutions }: { locale: Locale; q?: string; category?: string; product?: string; solution?: string; categories: Option[]; products: Option[]; solutions: Option[] }) {
  const zh = locale === "zh";
  const active = Boolean(q || category || product || solution);
  return <form method="get" className="brand-panel mb-8 grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto] xl:items-end">
    <label className="block text-sm font-semibold text-brand-ink">{zh ? "搜索问题" : "Search questions"}<span className="mt-2 flex items-center gap-2 rounded-lg border border-brand-border px-3"><Search size={16} className="text-brand-teal" /><input name="q" defaultValue={q} placeholder={zh ? "搜索 FAQ 问题" : "Search FAQ questions"} className="min-w-0 flex-1 bg-transparent py-2.5 outline-none" /></span></label>
    <label className="block text-sm font-semibold text-brand-ink">{zh ? "问题分类" : "Category"}<select name="category" defaultValue={category} className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 font-normal"><option value="">{zh ? "全部分类" : "All categories"}</option>{categories.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
    <label className="block text-sm font-semibold text-brand-ink">{zh ? "关联产品" : "Product"}<select name="product" defaultValue={product} className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 font-normal"><option value="">{zh ? "全部产品" : "All products"}</option>{products.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
    <label className="block text-sm font-semibold text-brand-ink">{zh ? "关联方案" : "Solution"}<select name="solution" defaultValue={solution} className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 font-normal"><option value="">{zh ? "全部方案" : "All solutions"}</option>{solutions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
    <div className="flex gap-2"><button type="submit" className="brand-button-primary"><Search size={16} />{zh ? "筛选" : "Filter"}</button>{active ? <Link href={localizedHref(locale, "/faq")} className="brand-button border border-brand-border"><X size={16} />{zh ? "清除" : "Clear"}</Link> : null}</div>
  </form>;
}
