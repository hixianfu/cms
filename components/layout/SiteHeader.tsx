"use client";
import Link from "next/link";
import { ChevronDown, Menu, Package } from "lucide-react";
import { useState } from "react";
import type { Global, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

export function SiteHeader({ locale, global, categories = [] }: { locale: Locale; global: Global | null; categories?: ProductCategory[] }) {
  const [open, setOpen] = useState(false);
  const items = global?.navigation?.length ? global.navigation : [{ label: messages[locale].home, href: "/" }, { label: messages[locale].about, href: "/about" }, { label: messages[locale].products, href: "/products" }, { label: messages[locale].blog, href: "/blog" }, { label: messages[locale].contact, href: "/contact" }];
  const logo = resolveMediaUrl(global?.logo);
  return <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href={localizedHref(locale, "/")} className="flex items-center gap-3 text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-teal">{logo ? <img src={logo} alt={global?.logoAlt ?? global?.siteName ?? ""} className="h-10 w-auto" /> : <span className="text-lg font-bold tracking-tight">{global?.siteName ?? "Ameson"}</span>}</Link><nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">{items.map((item, i) => item.href.includes("products") && categories.length ? <div className="group relative" key={`${item.href}-${i}`}><Link className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:text-brand-blue" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}<ChevronDown size={15} aria-hidden="true" /></Link><div className="invisible absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-xl border border-brand-border bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">{categories.map((category) => <Link key={category.id} href={localizedHref(locale, `/products?category=${category.slug}`)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-brand-ink hover:bg-brand-teal/10 hover:text-brand-blue"><Package size={15} className="text-brand-teal" />{category.name}</Link>)}</div></div> : <Link key={`${item.href}-${i}`} className="text-sm font-semibold text-brand-ink hover:text-brand-blue" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>)}<LocaleSwitcher locale={locale} /></nav><div className="flex items-center gap-2 lg:hidden"><LocaleSwitcher locale={locale} /><button className="rounded-lg p-2 text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-teal" onClick={() => setOpen(true)} aria-expanded={open} aria-label={messages[locale].menu}><Menu size={22} /></button></div></div><MobileNav locale={locale} open={open} onClose={() => setOpen(false)} items={items} categories={categories} /></header>;
}
