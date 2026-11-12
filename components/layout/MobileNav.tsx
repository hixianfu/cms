"use client";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { messages, localizedCategoryName } from "@/lib/i18n/messages";
import type { ContentCategory, HeaderContentItem, HeaderMegaMenuData, NavigationItem, ProductCategory } from "@/types/content";

function CategoryLink({ locale, category, onClose }: { locale: Locale; category: ProductCategory; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const name = localizedCategoryName(category.name, locale);
  return <li>
    <div className="flex items-center gap-1">
      <Link className="flex min-h-11 min-w-0 flex-1 items-center rounded px-3 py-2 text-sm text-brand-muted hover:bg-brand-teal/10 hover:text-brand-blue" href={localizedHref(locale, `/products?category=${encodeURIComponent(category.slug)}`)} onClick={onClose}>{name}</Link>
      {category.children?.length ? <button type="button" aria-label={locale === "zh" ? `${expanded ? "收起" : "展开"}${name}` : `${expanded ? "Collapse" : "Expand"} ${name}`} aria-expanded={expanded} aria-controls={id} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-brand-blue hover:bg-brand-teal/10" onClick={() => setExpanded((value) => !value)}><ChevronDown aria-hidden="true" size={18} className={expanded ? "rotate-180 transition" : "transition"} /></button> : null}
    </div>
    {category.children?.length ? <ul id={id} hidden={!expanded} className="ml-3 border-l border-brand-border pl-2">{expanded ? category.children.map((child) => <CategoryLink key={child.id} locale={locale} category={child} onClose={onClose} />) : null}</ul> : null}
  </li>;
}

export function MobileNav({ locale, open, onClose, items, categories = [], megaMenu }: { locale: Locale; open: boolean; onClose: () => void; items: NavigationItem[]; categories?: ProductCategory[]; megaMenu: HeaderMegaMenuData }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const body = document.body;
    const root = document.documentElement;
    const { scrollX, scrollY } = window;
    const properties = ["position", "top", "left", "width", "overflow"] as const;
    const styles = properties.map((key) => [key, body.style.getPropertyValue(key), body.style.getPropertyPriority(key)] as const);
    const overflow = root.style.overflow;
    const behavior = root.style.scrollBehavior;
    // Fix the body to prevent background touch scrolling, preserving its scroll position.
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, width: "100%", overflow: "hidden" });
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const controls = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((element) => !element.closest("[hidden]"));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panel.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    const resize = () => { if (window.innerWidth >= 1024) onClose(); };
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      for (const [key, value, priority] of styles) { if (value) body.style.setProperty(key, value, priority); else body.style.removeProperty(key); }
      root.style.overflow = overflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = behavior;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open, onClose]);
  if (!open) return null;

  const linkGroups = (path: string, entries: HeaderContentItem[] | undefined, categoryItems?: ContentCategory[]) => {
    const links = categoryItems?.length ? categoryItems.map((category) => ({ id: category.id, label: category.name, href: `/${path}?category=${encodeURIComponent(category.slug)}` })) : (entries ?? []).map((entry) => ({ id: entry.id, label: entry.title, href: `/${path}/${entry.slug}` }));
    return links.length ? <div className="ml-3 border-l-2 border-brand-lime pl-3">{links.map((link) => <Link key={link.id} className="block rounded px-3 py-2 text-sm text-brand-muted hover:text-brand-blue" href={localizedHref(locale, link.href)} onClick={onClose}>{link.label}</Link>)}</div> : null;
  };
  // The header's backdrop-filter must not constrain the fixed drawer.
  return createPortal(<div className="fixed inset-0 z-[100] h-dvh overflow-hidden overscroll-none bg-brand-ink/50 lg:hidden" onClick={onClose}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label={messages[locale].menu} className="ml-auto flex h-full min-h-0 w-[min(22rem,90vw)] flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex shrink-0 justify-end px-6 pb-2 pt-[max(1rem,env(safe-area-inset-top))]"><button ref={closeButton} type="button" className="grid h-11 w-11 place-items-center rounded-lg text-brand-blue hover:bg-brand-teal/10" onClick={onClose} aria-label={messages[locale].close}><X size={20} /></button></div>
      <nav className="min-h-0 flex-1 touch-pan-y space-y-2 overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]" aria-label={messages[locale].menu}>
        {items.map((item, index) => {
          const path = item.href.split(/[?#]/, 1)[0].replace(/\/$/, "");
          return <div key={`${item.href}-${index}`}>
            <Link className="block rounded-lg px-3 py-3 text-lg font-semibold text-brand-ink hover:bg-brand-teal/10" href={item.external ? item.href : localizedHref(locale, item.href)} onClick={onClose}>{item.label}</Link>
            {path === "/products" && categories.length ? <ul className="ml-3 border-l-2 border-brand-lime pl-3">{categories.map((category) => <CategoryLink key={category.id} locale={locale} category={category} onClose={onClose} />)}</ul> : null}
            {path === "/blog" ? linkGroups("blog", megaMenu.articles) : null}
            {path === "/videos" ? linkGroups("videos", megaMenu.videos, megaMenu.videoCategories) : null}
            {path === "/faq" ? linkGroups("faq", megaMenu.faqs, megaMenu.faqCategories) : null}
          </div>;
        })}
      </nav>
    </div>
  </div>, document.body);
}

