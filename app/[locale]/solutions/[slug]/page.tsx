import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingDetail } from "@/components/marketing/MarketingDetail";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { getSolutionBySlug } from "@/lib/strapi/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const item = await getSolutionBySlug(slug, locale); return createMetadata(item?.seo, { title: item?.title ?? (locale === "zh" ? "解决方案" : "Solution"), description: item?.summary ?? undefined }); }
export default async function SolutionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const item = await getSolutionBySlug(slug, locale); if (!item) notFound(); return <MarketingDetail item={item} locale={locale} kind="solution" />; }
