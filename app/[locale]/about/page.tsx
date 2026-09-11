import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { getAbout, getGlobal } from "@/lib/strapi/queries";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { resolveMediaUrl } from "@/lib/strapi/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; const [about, global] = await Promise.all([getAbout(locale), getGlobal(locale)]); return createMetadata(about?.seo, { title: about?.title ?? (locale === "zh" ? "关于我们" : "About us"), description: global?.siteDescription ?? undefined }); }
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const about = await getAbout(locale); if (!about) return <section className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-semibold">{locale === "zh" ? "关于我们" : "About us"}</h1><p className="mt-4 text-slate-600">{locale === "zh" ? "内容暂不可用" : "Content unavailable"}</p></section>; const cover = resolveMediaUrl(about.cover); return <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><header><h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{about.title}</h1>{cover ? <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-lg bg-slate-100"><Image src={cover} alt={about.coverAlt ?? about.cover?.alternativeText ?? about.title} fill priority sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" /></div> : null}</header><div className="mt-12 max-w-3xl"><RichTextRenderer blocks={about.blocks} /></div></article>; }
