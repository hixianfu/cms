import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import type { Cta } from "@/types/content";
export function CtaSection({ cta, locale }: { cta?: Cta | null; locale: Locale }) { if (!cta) return null; return <section className="bg-blue-700 text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><h2 className="text-3xl font-semibold">{cta.title}</h2>{cta.description ? <p className="mt-3 max-w-2xl text-blue-100">{cta.description}</p> : null}</div><Link href={cta.url.startsWith("http") ? cta.url : localizedHref(locale, cta.url)} className="inline-flex w-fit rounded-md bg-white px-5 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-white">{cta.label}</Link></div></section>; }
