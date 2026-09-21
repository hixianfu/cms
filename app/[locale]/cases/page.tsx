import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cases/CaseCard";
import { CaseFilters } from "@/components/cases/CaseFilters";
import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { getCaseCategories, getCaseStudies, getGlobal } from "@/lib/strapi/queries";
import { createMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";

type Params = { locale: string };
type Search = { q?: string; category?: string; industry?: string; product?: string; scenario?: string };
const options = (items: Array<{ slug: string; name?: string; title?: string }>) =>
  Array.from(new Map(items.filter((item) => item.slug).map((item) => [item.slug, { value: item.slug, label: item.name ?? item.title ?? item.slug }])).values());

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const global = await getGlobal(locale);
  return createMetadata(null, { title: locale === "zh" ? "客户案例" : "Case studies", description: global?.siteDescription ?? undefined });
}

export default async function CasesPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { q, category, industry, product, scenario } = await searchParams;
  const query = [
    q?.trim() ? `filters[title][$containsi]=${encodeURIComponent(q.trim())}` : "",
    category ? `filters[category][slug][$eq]=${encodeURIComponent(category)}` : "",
    industry ? `filters[industry][$eq]=${encodeURIComponent(industry)}` : "",
    product ? `filters[products][slug][$eq]=${encodeURIComponent(product)}` : "",
    scenario ? `filters[scenarios][slug][$eq]=${encodeURIComponent(scenario)}` : "",
  ].filter(Boolean).join("&");
  const [cases, allCases, caseCategories] = await Promise.all([getCaseStudies(locale, query), getCaseStudies(locale), getCaseCategories(locale)]);
  const industries = options(allCases.map((item) => ({ slug: item.industry ?? "", name: item.industry ?? "" })));
  const products = options(allCases.flatMap((item) => item.products ?? []));
  const scenarios = options(allCases.flatMap((item) => item.scenarios ?? []));
  const categoryName = caseCategories.find((item) => item.slug === category)?.name;
  const unfiltered = !q && !category && !industry && !product && !scenario;
  const featuredCase = unfiltered && cases.length === 1 ? cases[0] : undefined;
  const remainingCases = featuredCase ? cases.slice(1) : cases;

  return (
    <ListingPageShell>
      <ListingHero
        locale={locale}
        variant="compact"
        motif="case"
        eyebrow={locale === "zh" ? "客户案例" : "Customer cases"}
        title={locale === "zh" ? "经过现场验证的包装解决方案" : "Packaging solutions proven in the field"}
        description={locale === "zh" ? "了解不同行业如何借助艾美森提升保护、效率与交付体验。" : "See how teams across industries improve protection, efficiency, and delivery with Ameson."}
      />
      <ListingSection>
        <div className="space-y-8">
          <CaseFilters locale={locale} q={q} category={category} industry={industry} product={product} scenario={scenario} categories={caseCategories.map((item) => ({ value: item.slug, label: item.name }))} industries={industries} products={products} scenarios={scenarios} />
          <ListingResultHeader
            eyebrow={categoryName ?? industry ?? (locale === "zh" ? "全部案例" : "All case studies")}
            title={q ? (locale === "zh" ? `搜索结果：“${q}”` : `Results for “${q}”`) : locale === "zh" ? "精选案例" : "Featured case studies"}
            count={cases.length}
            countLabel={locale === "zh" ? "个案例" : "cases"}
          />
          {cases.length ? (
            <div>
              {featuredCase ? <CaseCard key={featuredCase.id} caseStudy={featuredCase} locale={locale} featured /> : null}
              {remainingCases.length ? <div className={`grid gap-7 md:grid-cols-2 xl:grid-cols-3 ${featuredCase ? "mt-7" : ""}`}>{remainingCases.map((item) => <CaseCard key={item.id} caseStudy={item} locale={locale} />)}</div> : null}
            </div>
          ) : (
            <ListingEmptyState message={q ? (locale === "zh" ? `没有找到与“${q}”匹配的案例` : `No case studies matched “${q}”`) : locale === "zh" ? "没有找到匹配的客户案例。" : "No case studies matched your filters."} resetHref={localizedHref(locale, "/cases")} resetLabel={locale === "zh" ? "查看全部案例" : "View all cases"} />
          )}
        </div>
      </ListingSection>
    </ListingPageShell>
  );
}
