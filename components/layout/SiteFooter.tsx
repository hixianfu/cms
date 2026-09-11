import Link from "next/link";
import type { Global } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
export function SiteFooter({ locale, global }: { locale: Locale; global: Global | null }) { return <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8"><div className="flex flex-wrap gap-x-5 gap-y-2">{global?.footerLinks?.map((item, i) => <Link key={`${item.href}-${i}`} className="text-sm hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400" href={item.external ? item.href : localizedHref(locale, item.href)}>{item.label}</Link>)}</div><p className="text-sm">{global?.footerText ?? global?.siteName ?? ""}</p></div></footer>; }
