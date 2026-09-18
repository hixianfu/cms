"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useState } from "react";
import type { Global, HeaderMegaMenuData, NavigationItem, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

type Props = {
  locale: Locale;
  global: Global | null;
  categories?: ProductCategory[];
  megaMenu: HeaderMegaMenuData;
};

export function SiteHeader({ locale, global, categories = [], megaMenu }: Props) {
  const [open, setOpen] = useState(false);
  const fallback = [
    { label: messages[locale].home, href: "/" },
    { label: messages[locale].about, href: "/about" },
    { label: messages[locale].products, href: "/products" },
    { label: messages[locale].blog, href: "/blog" },
    { label: messages[locale].contact, href: "/contact" },
  ];
  const items: NavigationItem[] = global?.navigation?.length ? global.navigation : fallback;
  const logo = resolveMediaUrl(global?.logo);

  const menuFor = (href: string) => {
    const path = href.split("?")[0].replace(/\/$/, "");
    if (path === "/products" && categories.length) return { kind: "products" as const, categories };
    if (path === "/solutions" && megaMenu.solutions.length) return { kind: "content" as const, path: "solutions" as const, items: megaMenu.solutions };
    if (path === "/scenarios" && megaMenu.scenarios.length) return { kind: "content" as const, path: "scenarios" as const, items: megaMenu.scenarios };
    if (path === "/cases" && megaMenu.cases.length) return { kind: "content" as const, path: "cases" as const, items: megaMenu.cases };
    return null;
  };

  return <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href={localizedHref(locale, "/")} className="flex items-center gap-3 text-brand-blue">
        {logo ? <img src={logo} alt={global?.logoAlt ?? global?.siteName ?? ""} className="h-10 w-auto" /> : <span className="text-lg font-bold">{global?.siteName ?? "Ameson"}</span>}
      </Link>
      <nav className="hidden items-stretch gap-7 self-stretch lg:flex" aria-label="Primary">
        {items.map((item, index) => {
          const menu = menuFor(item.href);
          if (!menu) return <Link key={`${item.href}-${index}`} className="flex items-center border-b-2 border-transparent text-sm font-semibold text-brand-ink transition hover:border-brand-blue hover:text-brand-blue" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>;
          return <div className="group flex items-center" key={`${item.href}-${index}`}>
            <Link className="inline-flex h-full items-center gap-1 border-b-2 border-transparent text-sm font-semibold text-brand-ink transition group-focus-within:border-brand-blue group-hover:border-brand-blue group-hover:text-brand-blue" href={localizedHref(locale, item.href)} aria-haspopup="true">
              {item.label}<ChevronDown size={15} className="transition group-focus-within:rotate-180 group-hover:rotate-180" />
            </Link>
            <MegaMenu locale={locale} menu={menu} />
          </div>;
        })}
        <Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className="my-auto rounded-lg p-2 text-brand-ink hover:bg-brand-teal/10 hover:text-brand-blue"><Search size={18} /></Link>
        <div className="my-auto"><LocaleSwitcher locale={locale} /></div>
      </nav>
      <div className="flex items-center gap-2 lg:hidden">
        <Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className="rounded-lg p-2 text-brand-blue"><Search size={20} /></Link>
        <LocaleSwitcher locale={locale} />
        <button type="button" className="rounded-lg p-2 text-brand-blue" onClick={() => setOpen(true)} aria-expanded={open} aria-label={messages[locale].menu}><Menu size={22} /></button>
      </div>
    </div>
    <MobileNav locale={locale} open={open} onClose={() => setOpen(false)} items={items} categories={categories} />
  </header>;
}
