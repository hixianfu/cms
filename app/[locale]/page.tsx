import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/home/CtaSection";
import { CompanyShowcase } from "@/components/home/CompanyShowcase";
import { FeatureCards } from "@/components/home/FeatureCards";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MarketingContentGrid } from "@/components/home/MarketingContentGrid";
import { RichTextRenderer } from "@/components/content/RichTextRenderer";
import { getGlobal, getHomePage } from "@/lib/strapi/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { splitHomeSections } from "@/lib/home-sections";
import type { HomeSection } from "@/types/content";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; const [home, global] = await Promise.all([getHomePage(locale), getGlobal(locale)]); return createMetadata(home?.seo ?? global?.defaultSeo, { title: global?.siteName ?? (locale === "zh" ? "企业官网" : "Corporate website"), description: global?.siteDescription ?? undefined }); }
function renderSection(section: HomeSection, locale: Locale, index: number) {
  const key = `${section.__component}-${index}`;
  switch (section.__component) {
    case "shared.home-hero": return section.slides?.length ? <HeroCarousel key={key} locale={locale} slides={section.slides} /> : null;
    case "shared.home-products": return <FeaturedProducts key={key} locale={locale} products={section.products ?? []} title={section.title} />;
    case "shared.home-articles": return <FeaturedArticles key={key} locale={locale} articles={section.articles ?? []} title={section.title} />;
    case "shared.home-solutions": return <MarketingContentGrid key={key} locale={locale} items={section.solutions ?? []} kind="solutions" title={section.title ?? (locale === "zh" ? "行业解决方案" : "Industry solutions")} description={locale === "zh" ? "从客户问题出发，找到适合业务的包装方式。" : "Start with the business challenge and find the right packaging approach."} />;
    case "shared.home-scenarios": return <MarketingContentGrid key={key} locale={locale} items={section.scenarios ?? []} kind="scenarios" title={section.title ?? (locale === "zh" ? "应用场景" : "Application scenarios")} />;
    case "shared.home-cases": return <MarketingContentGrid key={key} locale={locale} items={section.cases ?? []} kind="cases" title={section.title ?? (locale === "zh" ? "客户案例" : "Customer cases")} />;
    case "shared.home-videos": return <MarketingContentGrid key={key} locale={locale} items={section.videos ?? []} kind="videos" title={section.title ?? (locale === "zh" ? "精选视频" : "Featured videos")} />;
    case "shared.home-faqs": return <MarketingContentGrid key={key} locale={locale} items={section.faqs ?? []} kind="faq" title={section.title ?? (locale === "zh" ? "常见问题" : "Frequently asked questions")} />;
    case "shared.home-feature-cards": return <FeatureCards key={key} locale={locale} title={section.title} description={section.description} cards={section.cards} />;
    case "shared.home-company-showcase": return <CompanyShowcase key={key} locale={locale} section={section} />;
  }
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const home = await getHomePage(locale); const current = locale as Locale; const { heroSections, contentSections } = splitHomeSections(home?.sections); return <div>{heroSections.map((section, index) => renderSection(section, current, index))}{home?.introTitle || home?.intro ? <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"><h2 className="text-3xl font-semibold text-slate-950">{home.introTitle ?? (locale === "zh" ? "关于我们" : "About us")}</h2>{home.intro ? <p className="mt-4 text-lg leading-8 text-slate-600">{home.intro}</p> : null}</section> : null}{contentSections.map((section, index) => renderSection(section, current, heroSections.length + index))}<div className="mx-auto max-w-7xl px-4 sm:px-6">{home?.blocks?.length ? <section className="py-12"><RichTextRenderer blocks={home.blocks} /></section> : null}</div><CtaSection locale={current} cta={home?.cta} /></div>; }
