import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingDetail } from "@/components/marketing/MarketingDetail";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { getScenarioBySlug } from "@/lib/strapi/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const item = await getScenarioBySlug(slug, locale); return createMetadata(item?.seo, { title: item?.title ?? (locale === "zh" ? "应用场景" : "Application scenario"), description: item?.summary ?? undefined }); }
export default async function ScenarioPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const item = await getScenarioBySlug(slug, locale); if (!item) notFound(); return <MarketingDetail item={item} locale={locale} kind="scenario" />; }
