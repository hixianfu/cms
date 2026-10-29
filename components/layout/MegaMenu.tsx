"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { localizedCategoryName } from "@/lib/i18n/messages";
import type { HeaderContentItem, ProductCategory } from "@/types/content";

type ProductMenu = { kind: "products"; categories: ProductCategory[] };
type ContentMenu = { kind: "content"; path: "solutions" | "scenarios" | "cases" | "blog"; items: HeaderContentItem[] };
const labels = { solutions: { zh: "解决方案", en: "Solutions" }, scenarios: { zh: "应用场景", en: "Application scenarios" }, cases: { zh: "客户案例", en: "Case studies" }, blog: { zh: "博客", en: "Blog" } };
function allLabel(locale: Locale, label: string) { return locale === "zh" ? `查看全部${label}` : `View all ${label.toLowerCase()}`; }

function ProductMegaMenu({ locale, categories }: { locale: Locale; categories: ProductCategory[] }) {
  const [activeCategoryId, setActiveCategoryId] = useState<ProductCategory["id"] | null>(null);
  const [activeChildId, setActiveChildId] = useState<ProductCategory["id"] | null>(null);
  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? null;
  const activeChild = activeCategory?.children?.find((child) => child.id === activeChildId) ?? null;
  const activateCategory = (category: ProductCategory) => {
    setActiveCategoryId(category.id);
    setActiveChildId(null);
  };

  return <div
    className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]"
    onMouseLeave={() => { setActiveCategoryId(null); setActiveChildId(null); }}
  >
    <div className="border-r border-brand-border pr-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">{locale === "zh" ? "产品中心" : "Product center"}</p>
      <Link href={localizedHref(locale, "/products")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-teal">{locale === "zh" ? "全部产品" : "All products"}<ArrowRight size={15} /></Link>
      <ul className="mt-7 space-y-1">
        {categories.map((category) => <li key={category.id}>
          <Link
            href={localizedHref(locale, `/products?category=${category.slug}`)}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition ${activeCategoryId === category.id ? "bg-brand-teal/10 text-brand-blue" : "text-brand-ink hover:bg-slate-50 hover:text-brand-blue"}`}
            onMouseEnter={() => activateCategory(category)}
            onFocus={() => activateCategory(category)}
          >
            {localizedCategoryName(category.name, locale)}
            {category.children?.length ? <span aria-hidden="true" className="text-brand-muted">›</span> : null}
          </Link>
        </li>)}
      </ul>
    </div>
    {activeCategory?.children?.length ? <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">{localizedCategoryName(activeCategory.name, locale)}</p>
      <ul className="mt-4 grid gap-1 sm:grid-cols-2">
        {activeCategory.children.map((child) => <li key={child.id}>
          <Link
            href={localizedHref(locale, `/products?category=${child.slug}`)}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${activeChildId === child.id ? "bg-brand-teal/10 font-semibold text-brand-blue" : "text-brand-muted hover:bg-slate-50 hover:text-brand-blue"}`}
            onMouseEnter={() => setActiveChildId(child.id)}
            onFocus={() => setActiveChildId(child.id)}
          >
            {localizedCategoryName(child.name, locale)}
            {child.children?.length ? <span aria-hidden="true" className="text-brand-muted">›</span> : null}
          </Link>
        </li>)}
      </ul>
      {activeChild?.children?.length ? <div className="mt-7 border-t border-brand-border pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">{localizedCategoryName(activeChild.name, locale)}</p>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {activeChild.children.map((grandchild) => <li key={grandchild.id}>
            <Link href={localizedHref(locale, `/products?category=${grandchild.slug}`)} className="block rounded-lg px-3 py-2.5 text-sm text-brand-muted transition hover:bg-slate-50 hover:text-brand-blue">{localizedCategoryName(grandchild.name, locale)}</Link>
          </li>)}
        </ul>
      </div> : null}
    </div> : <div className="flex items-center text-sm text-brand-muted">{locale === "zh" ? "悬停分类查看子分类" : "Hover a category to explore"}</div>}
  </div>;
}

function ContentMegaMenu({ locale, path, items }: { locale: Locale; path: ContentMenu["path"]; items: HeaderContentItem[] }) {
  const label = labels[path][locale === "zh" ? "zh" : "en"];
  const groups = Array.from(items.reduce((map, item) => { const name = item.category?.name || item.industry?.trim() || (locale === "zh" ? "其他" : "Other"); const slug = item.category?.slug; const key = slug ?? `industry:${name}`; const group = map.get(key) ?? { name, slug, items: [] as HeaderContentItem[] }; group.items.push(item); map.set(key, group); return map; }, new Map<string, { name: string; slug?: string; items: HeaderContentItem[] }>()));
  return <div className="grid grid-cols-2 gap-x-10 gap-y-9 lg:grid-cols-4 xl:grid-cols-5"><div><p className="text-xs font-bold uppercase text-brand-teal">{label}</p><Link href={localizedHref(locale, `/${path}`)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-teal">{allLabel(locale, label)}<ArrowRight size={15} /></Link></div>{groups.map(([key, group]) => <div key={key}><Link href={localizedHref(locale, `/${path}?${group.slug ? `category=${encodeURIComponent(group.slug)}` : `industry=${encodeURIComponent(group.name)}`}`)} className="font-semibold text-brand-ink hover:text-brand-blue">{group.name}</Link><ul className="mt-4 space-y-2.5">{group.items.map((item) => <li key={item.id}><Link href={localizedHref(locale, `/${path}/${item.slug}`)} className="text-sm text-brand-muted hover:text-brand-blue">{item.title}</Link></li>)}</ul></div>)}</div>;
}

export function MegaMenu({ locale, menu, open = true, onClose }: { locale: Locale; menu: ProductMenu | ContentMenu; open?: boolean; onClose?: () => void }) { return <div aria-hidden={!open} className={`absolute inset-x-0 top-full z-50 border-t border-brand-border bg-white shadow-[0_18px_40px_rgba(18,50,74,0.14)] transition duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`} onClick={onClose}><div className="mx-auto max-h-[70vh] max-w-7xl overflow-y-auto px-8 py-10">{menu.kind === "products" ? <ProductMegaMenu locale={locale} categories={menu.categories} /> : <ContentMegaMenu locale={locale} path={menu.path} items={menu.items} />}</div></div>; }
