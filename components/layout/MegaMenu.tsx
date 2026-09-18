import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { localizedCategoryName } from "@/lib/i18n/messages";
import type { HeaderContentItem, ProductCategory } from "@/types/content";

type ProductMenu = { kind: "products"; categories: ProductCategory[] };
type ContentMenu = { kind: "content"; path: "solutions" | "scenarios" | "cases" | "blog"; items: HeaderContentItem[] };
const labels = { solutions: { zh: "解决方案", en: "Solutions" }, scenarios: { zh: "应用场景", en: "Application scenarios" }, cases: { zh: "客户案例", en: "Case studies" }, blog: { zh: "博客", en: "Blog" } };
function allLabel(locale: Locale, label: string) { return locale === "zh" ? `查看全部${label}` : `View all ${label.toLowerCase()}`; }

function ProductMegaMenu({ locale, categories }: { locale: Locale; categories: ProductCategory[] }) {
  return <div className="grid grid-cols-2 gap-x-10 gap-y-9 lg:grid-cols-4 xl:grid-cols-5"><div><p className="text-xs font-bold uppercase text-brand-teal">{locale === "zh" ? "产品中心" : "Product center"}</p><Link href={localizedHref(locale, "/products")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-teal">{locale === "zh" ? "全部产品" : "All products"}<ArrowRight size={15} /></Link></div>{categories.map((category) => <div key={category.id}><Link href={localizedHref(locale, `/products?category=${category.slug}`)} className="font-semibold text-brand-ink hover:text-brand-blue">{localizedCategoryName(category.name, locale)}</Link>{category.children?.length ? <ul className="mt-4 space-y-2.5">{category.children.map((child) => <li key={child.id}><Link href={localizedHref(locale, `/products?category=${child.slug}`)} className="text-sm text-brand-muted hover:text-brand-blue">{localizedCategoryName(child.name, locale)}</Link></li>)}</ul> : null}</div>)}</div>;
}

function ContentMegaMenu({ locale, path, items }: { locale: Locale; path: ContentMenu["path"]; items: HeaderContentItem[] }) {
  const label = labels[path][locale === "zh" ? "zh" : "en"];
  const groups = Array.from(items.reduce((map, item) => { const name = item.category?.name || item.industry?.trim() || (locale === "zh" ? "其他" : "Other"); const slug = item.category?.slug; const key = slug ?? `industry:${name}`; const group = map.get(key) ?? { name, slug, items: [] as HeaderContentItem[] }; group.items.push(item); map.set(key, group); return map; }, new Map<string, { name: string; slug?: string; items: HeaderContentItem[] }>()));
  return <div className="grid grid-cols-2 gap-x-10 gap-y-9 lg:grid-cols-4 xl:grid-cols-5"><div><p className="text-xs font-bold uppercase text-brand-teal">{label}</p><Link href={localizedHref(locale, `/${path}`)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-teal">{allLabel(locale, label)}<ArrowRight size={15} /></Link></div>{groups.map(([key, group]) => <div key={key}><Link href={localizedHref(locale, `/${path}?${group.slug ? `category=${encodeURIComponent(group.slug)}` : `industry=${encodeURIComponent(group.name)}`}`)} className="font-semibold text-brand-ink hover:text-brand-blue">{group.name}</Link><ul className="mt-4 space-y-2.5">{group.items.map((item) => <li key={item.id}><Link href={localizedHref(locale, `/${path}/${item.slug}`)} className="text-sm text-brand-muted hover:text-brand-blue">{item.title}</Link></li>)}</ul></div>)}</div>;
}

export function MegaMenu({ locale, menu, open = true, onClose }: { locale: Locale; menu: ProductMenu | ContentMenu; open?: boolean; onClose?: () => void }) { return <div aria-hidden={!open} className={`absolute inset-x-0 top-full z-50 border-t border-brand-border bg-white shadow-[0_18px_40px_rgba(18,50,74,0.14)] transition duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`} onClick={onClose}><div className="mx-auto max-h-[70vh] max-w-7xl overflow-y-auto px-8 py-10">{menu.kind === "products" ? <ProductMegaMenu locale={locale} categories={menu.categories} /> : <ContentMegaMenu locale={locale} path={menu.path} items={menu.items} />}</div></div>; }
