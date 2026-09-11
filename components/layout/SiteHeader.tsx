"use client";
import Link from "next/link";
import { useState } from "react";
import type { Global } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { messages } from "@/lib/i18n/messages";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
export function SiteHeader({ locale, global }: { locale: Locale; global: Global | null }) { const [open, setOpen] = useState(false); const items = global?.navigation?.length ? global.navigation : [{ label: messages[locale].home, href: "/" }, { label: messages[locale].about, href: "/about" }, { label: messages[locale].products, href: "/products" }, { label: messages[locale].blog, href: "/blog" }, { label: messages[locale].contact, href: "/contact" }]; const logo = resolveMediaUrl(global?.logo); return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href={localizedHref(locale, "/")} className="flex items-center gap-3 font-semibold text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-600">{logo ? <img src={logo} alt={global?.logoAlt ?? global?.siteName ?? ""} className="h-9 w-auto" /> : global?.siteName ?? ""}</Link><nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">{items.map((item, i) => <Link key={`${item.href}-${i}`} className="text-sm text-slate-700 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-600" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>)}<LocaleSwitcher locale={locale} /></nav><div className="flex items-center gap-2 lg:hidden"><LocaleSwitcher locale={locale} /><button className="rounded p-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-600" onClick={() => setOpen(true)} aria-expanded={open} aria-label={messages[locale].menu}>☰</button></div></div><MobileNav locale={locale} open={open} onClose={() => setOpen(false)} items={items} /></header>; }
