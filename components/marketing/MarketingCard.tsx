import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Locale, Scenario, Solution } from "@/types/content";

export function MarketingCard({ item, locale, path }: { item: Solution | Scenario; locale: Locale; path: "solutions" | "scenarios" }) {
  const image = resolveMediaUrl(item.cover);
  const label = path === "solutions" ? (locale === "zh" ? "查看解决方案" : "View solution") : (locale === "zh" ? "查看应用场景" : "View scenario");
  const categoryLabel = item.category?.name ?? item.industry;
  return <article className="group brand-card overflow-hidden"><Link href={localizedHref(locale, `/${path}/${item.slug}`)} className="block h-full"><div className="relative aspect-[16/9] overflow-hidden bg-brand-teal/10">{image ? <Image src={image} alt={item.cover?.alternativeText ?? item.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm font-semibold text-brand-teal">AMESON</div>}</div><div className="flex min-h-56 flex-col p-6">{categoryLabel ? <span className="w-fit rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-blue">{categoryLabel}</span> : null}<h2 className="mt-4 text-xl font-semibold text-brand-ink">{item.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{item.summary}</p><span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">{label}<ArrowUpRight size={16} /></span></div></Link></article>;
}
