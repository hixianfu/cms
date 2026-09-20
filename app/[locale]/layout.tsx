import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleCategories, getCaseCategories, getGlobal, getHeaderMegaMenu, getProductCategories, getScenarioCategories, getSolutionCategories } from "@/lib/strapi/queries";
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

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const current = locale as Locale; const [global, categories, megaMenu, solutionCategories, scenarioCategories, caseCategories, articleCategories] = await Promise.all([getGlobal(current), getProductCategories(current), getHeaderMegaMenu(current), getSolutionCategories(current), getScenarioCategories(current), getCaseCategories(current), getArticleCategories(current)]); return <><SiteHeader locale={current} global={global} categories={categories} megaMenu={megaMenu} /><main className="flex-1">{children}</main><SiteFooter locale={current} global={global} categories={categories} solutionCategories={solutionCategories} scenarioCategories={scenarioCategories} caseCategories={caseCategories} articleCategories={articleCategories} /></>; }
