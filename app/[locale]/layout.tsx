import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGlobal, getProductCategories } from "@/lib/strapi/queries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { resolveMediaUrl } from "@/lib/strapi/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  const favicon = resolveMediaUrl(global?.favicon);
  return {
    icons: favicon ? { icon: [{ url: favicon, type: global?.favicon?.mime ?? undefined }] } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const [global, categories] = await Promise.all([getGlobal(locale), getProductCategories(locale)]); return <><SiteHeader locale={locale as Locale} global={global} categories={categories} /><main className="flex-1">{children}</main><SiteFooter locale={locale as Locale} global={global} categories={categories} /></>; }
