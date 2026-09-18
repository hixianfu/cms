import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, Locale } from "@/types/content";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";

export function CaseCard({ caseStudy, locale }: { caseStudy: CaseStudy; locale: Locale }) {
  const image = resolveMediaUrl(caseStudy.cover);
  const categoryLabel = caseStudy.category?.name ?? caseStudy.industry;
  return <article className="group brand-card overflow-hidden"><Link href={localizedHref(locale, `/cases/${caseStudy.slug}`)} className="block h-full"><div className="relative aspect-[16/9] overflow-hidden bg-slate-100">{image ? <Image src={image} alt={caseStudy.cover?.alternativeText ?? caseStudy.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-brand-muted">Ameson</div>}</div><div className="flex min-h-56 flex-col p-6">{categoryLabel ? <span className="w-fit rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-blue">{categoryLabel}</span> : null}<h2 className="mt-4 text-xl font-semibold text-brand-ink">{caseStudy.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">{caseStudy.summary}</p><span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">{locale === "zh" ? "查看案例" : "View case study"}<ArrowUpRight size={16} /></span></div></Link></article>;
}
