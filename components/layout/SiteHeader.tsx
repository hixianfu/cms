"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Global, HeaderMegaMenuData, NavigationItem, ProductCategory } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { isLocalizedHomePath, localizedHref } from "@/lib/i18n/routing";
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const fallback = [
    { label: messages[locale].home, href: "/" },
    { label: messages[locale].about, href: "/about" },
    { label: messages[locale].products, href: "/products" },
    { label: messages[locale].blog, href: "/blog" },
    { label: messages[locale].contact, href: "/contact" },
  ];
  const items: NavigationItem[] = global?.navigation?.length ? global.navigation : fallback;
  const logo = resolveMediaUrl(global?.logo);
  const overlayHero = isLocalizedHomePath(pathname, locale);
  const inverseHeader = overlayHero && !isScrolled;
  const headerClass = overlayHero
    ? `fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${inverseHeader ? "border-white/20 bg-transparent text-white" : "border-brand-border/80 bg-white/95 text-brand-ink shadow-sm backdrop-blur"}`
    : "sticky top-0 z-40 border-b border-brand-border/80 bg-white/95 text-brand-ink shadow-sm backdrop-blur";

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 16);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const menuFor = (href: string) => {
    const path = href.split("?")[0].replace(/\/$/, "");
    if (path === "/products" && categories.length) return { kind: "products" as const, categories };
    if (path === "/solutions" && megaMenu.solutions.length) return { kind: "content" as const, path: "solutions" as const, items: megaMenu.solutions };
    if (path === "/scenarios" && megaMenu.scenarios.length) return { kind: "content" as const, path: "scenarios" as const, items: megaMenu.scenarios };
    if (path === "/cases" && megaMenu.cases.length) return { kind: "content" as const, path: "cases" as const, items: megaMenu.cases };
    if (path === "/blog" && megaMenu.articles.length) return { kind: "content" as const, path: "blog" as const, items: megaMenu.articles };
    return null;
  };

  return <header className={headerClass}>
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href={localizedHref(locale, "/")} className={`flex items-center gap-3 ${inverseHeader ? "text-white" : "text-brand-blue"}`}>
        {logo ? <img src={logo} alt={global?.logoAlt ?? global?.siteName ?? ""} className={`h-10 w-auto ${inverseHeader ? "brightness-0 invert" : ""}`} /> : <span className="text-lg font-bold">{global?.siteName ?? "Ameson"}</span>}
      </Link>
      <nav className="hidden items-stretch gap-7 self-stretch lg:flex" aria-label="Primary">
        {items.map((item, index) => {
          const menu = menuFor(item.href);
          const linkClass = inverseHeader
            ? "text-white hover:border-white hover:text-white/80"
            : "text-brand-ink hover:border-brand-blue hover:text-brand-blue";
          if (!menu) return <Link key={`${item.href}-${index}`} className={`flex items-center border-b-2 border-transparent text-sm font-semibold transition ${linkClass}`} href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>;
          return <div className="flex items-center" key={`${item.href}-${index}`} onMouseEnter={() => { cancelClose(); setOpenMenu(item.href); }} onMouseLeave={scheduleClose}>
            <Link className={`inline-flex h-full items-center gap-1 border-b-2 border-transparent text-sm font-semibold transition ${linkClass} ${openMenu === item.href ? (inverseHeader ? "border-white text-white" : "border-brand-blue text-brand-blue") : ""}`} href={localizedHref(locale, item.href)} aria-haspopup="true" aria-expanded={openMenu === item.href} onFocus={() => { cancelClose(); setOpenMenu(item.href); }} onClick={() => setOpenMenu(null)}>
              {item.label}<ChevronDown size={15} className="transition group-focus-within:rotate-180 group-hover:rotate-180" />
            </Link>
            <MegaMenu locale={locale} menu={menu} open={openMenu === item.href} onClose={() => setOpenMenu(null)} />
          </div>;
        })}
        <Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className={`my-auto rounded-lg p-2 transition ${inverseHeader ? "text-white hover:bg-white/10 hover:text-white/80" : "text-brand-ink hover:bg-brand-teal/10 hover:text-brand-blue"}`}><Search size={18} /></Link>
        <div className="my-auto"><LocaleSwitcher locale={locale} inverse={inverseHeader} /></div>
      </nav>
      <div className="flex items-center gap-2 lg:hidden">
        <Link href={localizedHref(locale, "/search")} aria-label={locale === "zh" ? "全站搜索" : "Site search"} className={`rounded-lg p-2 ${inverseHeader ? "text-white hover:bg-white/10" : "text-brand-blue"}`}><Search size={20} /></Link>
        <LocaleSwitcher locale={locale} inverse={inverseHeader} />
        <button type="button" className={`rounded-lg p-2 ${inverseHeader ? "text-white hover:bg-white/10" : "text-brand-blue"}`} onClick={() => setOpen(true)} aria-expanded={open} aria-label={messages[locale].menu}><Menu size={22} /></button>
      </div>
    </div>
    <MobileNav locale={locale} open={open} onClose={() => setOpen(false)} items={items} categories={categories} megaMenu={megaMenu} />
  </header>;
}
