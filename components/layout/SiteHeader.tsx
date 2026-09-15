"use client";
import Link from "next/link";
import { ChevronDown, Menu, Package, Search } from "lucide-react";
import { useState } from "react";
import type { Global, ProductCategory, NavigationItem } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages, localizedCategoryName } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

export function SiteHeader({ locale, global, categories = [] }: { locale: Locale; global: Global | null; categories?: ProductCategory[] }) {
  const [open, setOpen] = useState(false);
  const fallback = [{ label: messages[locale].home, href: "/" }, { label: messages[locale].about, href: "/about" }, { label: messages[locale].products, href: "/products" }, { label: messages[locale].blog, href: "/blog" }, { label: messages[locale].contact, href: "/contact" }];
  const items: NavigationItem[] = fallback;
  const logo = resolveMediaUrl(global?.logo);
  return <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href={localizedHref(locale, "/")} className="flex items-center gap-3 text-brand-blue">{logo ? <img src={logo} alt={global?.logoAlt ?? global?.siteName ?? ""} className="h-10 w-auto" /> : <span className="text-lg font-bold">{global?.siteName ?? "Ameson"}</span>}</Link><nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">{items.map((item, i) => item.href === "/products" && categories.length ? <div className="group relative py-3" key={`${item.href}-${i}`}><Link className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:text-brand-blue" href={localizedHref(locale, item.href)}>{item.label}<ChevronDown size={15} /></Link><div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100"><div className="rounded-xl border border-brand-border bg-white p-2 shadow-xl">{categories.map((category) => <Link key={category.id} href={localizedHref(locale, `/products?category=${category.slug}`)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-brand-ink hover:bg-brand-teal/10"><Package size={15} className="text-brand-teal" />{localizedCategoryName(category.name, locale)}</Link>)}</div></div></div> : <Link key={`${item.href}-${i}`} className="text-sm font-semibold text-brand-ink hover:text-brand-blue" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>)}<Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className="rounded-lg p-2 text-brand-ink hover:bg-brand-teal/10 hover:text-brand-blue"><Search size={18} /></Link><LocaleSwitcher locale={locale} /></nav><div className="flex items-center gap-2 lg:hidden"><Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className="rounded-lg p-2 text-brand-blue"><Search size={20} /></Link><LocaleSwitcher locale={locale} /><button type="button" className="rounded-lg p-2 text-brand-blue" onClick={() => setOpen(true)} aria-expanded={open} aria-label={messages[locale].menu}><Menu size={22} /></button></div></div><MobileNav locale={locale} open={open} onClose={() => setOpen(false)} items={items} categories={categories} /></header>;
}

