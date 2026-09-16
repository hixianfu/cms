import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingListing } from "@/components/marketing/MarketingListing";
import { isLocale } from "@/lib/i18n/config";
import { createMetadata } from "@/lib/seo/metadata";
import { getGlobal, getSolutions } from "@/lib/strapi/queries";

type Search = { q?: string; industry?: string };
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; const global = await getGlobal(locale); return createMetadata(null, { title: locale === "zh" ? "解决方案" : "Solutions", description: global?.siteDescription ?? undefined }); }

export default async function SolutionsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const { q, industry } = await searchParams;
  const query = [q?.trim() ? `filters[title][$containsi]=${encodeURIComponent(q.trim())}` : "", industry ? `filters[industry][$eq]=${encodeURIComponent(industry)}` : ""].filter(Boolean).join("&");
  const [items, allItems] = await Promise.all([getSolutions(locale, query), getSolutions(locale)]);
  return <MarketingListing locale={locale} kind="solutions" items={items} allItems={allItems} q={q} industry={industry} />;
}
