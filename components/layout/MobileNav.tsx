"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { localizedHref } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";
import type { NavigationItem } from "@/types/content";
export function MobileNav({ locale, open, onClose, items }: { locale: Locale; open: boolean; onClose: () => void; items: NavigationItem[] }) { const first = useRef<HTMLAnchorElement>(null); useEffect(() => { if (open) first.current?.focus(); }, [open]); useEffect(() => { if (!open) return; const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [open, onClose]); if (!open) return null; return <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" role="presentation" onClick={onClose}><nav className="ml-auto flex h-full w-80 max-w-[90vw] flex-col gap-2 bg-white p-6 shadow-xl" aria-label={messages[locale].menu} onClick={(e) => e.stopPropagation()}><button className="self-end rounded p-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-600" onClick={onClose} aria-label={messages[locale].close}>×</button>{items.map((item, i) => <Link key={`${item.href}-${i}`} ref={i === 0 ? first : undefined} className="rounded px-3 py-3 text-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600" href={item.external ? item.href : localizedHref(locale, item.href)} onClick={onClose}>{item.label}</Link>)}</nav></div>; }
