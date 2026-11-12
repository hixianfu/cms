import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqFilters } from "@/components/faq/FaqFilters";
import { FaqList } from "@/components/faq/FaqList";
import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { ListingSidebar } from "@/components/listing/ListingSidebar";
import { getFaqs, getGlobal, getFaqCategories } from "@/lib/strapi/queries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/seo/metadata";
import { resolveListingBackground } from "@/lib/strapi/image";

type Search = { q?: string; category?: string; product?: string; solution?: string };
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; const global = await getGlobal(locale); return createMetadata(null, { title: locale === "zh" ? "常见问题" : "FAQ", description: global?.siteDescription ?? undefined }); }
export default async function FaqPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const currentLocale = locale as Locale; const { q, category, product, solution } = await searchParams; const [all, global, configuredCategories] = await Promise.all([getFaqs(currentLocale), getGlobal(currentLocale), getFaqCategories(currentLocale)]); const query = [q?.trim() ? `filters[question][$containsi]=${encodeURIComponent(q.trim())}` : "", category ? `filters[category][slug][$eq]=${encodeURIComponent(category)}` : "", product ? `filters[products][slug][$eq]=${encodeURIComponent(product)}` : "", solution ? `filters[solutions][slug][$eq]=${encodeURIComponent(solution)}` : ""].filter(Boolean).join("&"); const faqs = query ? await getFaqs(currentLocale, query) : all; const categories = configuredCategories.map((item) => ({ value: item.slug, label: item.name })); const products = Array.from(new Map(all.flatMap((f) => f.products ?? []).filter((x) => x.slug).map((x) => [x.slug, { value: x.slug, label: x.name ?? x.title ?? x.slug }])).values()); const solutions = Array.from(new Map(all.flatMap((f) => f.solutions ?? []).filter((x) => x.slug).map((x) => [x.slug, { value: x.slug, label: x.title ?? x.name ?? x.slug }])).values());
  const selectedCategory = categories.find((item) => item.value === category);
  const categoryTitle = selectedCategory?.label ?? (locale === "zh" ? "全部问题" : "All questions");
  const hasFilters = Boolean(q?.trim() || category || product || solution);

  return <ListingPageShell>
    <ListingHero locale={locale} variant="compact" motif="faq" backgroundImage={resolveListingBackground(global, "/faq")} eyebrow={locale === "zh" ? "知识中心" : "Knowledge center"} title={locale === "zh" ? "常见问题，快速找到答案" : "Clear answers to common questions"} description={locale === "zh" ? "按产品、方案和使用场景查找包装设备与材料的实用信息。" : "Find practical answers about packaging equipment and materials by product, solution, or use case."} stat={{ value: all.length, label: locale === "zh" ? "个常见问题" : "questions" }} />
    <ListingSection>
      <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <ListingSidebar locale={currentLocale} label={locale === "zh" ? "问题分类" : "FAQ categories"} allItem={{ href: "/faq", label: locale === "zh" ? "全部问题" : "All questions", active: !category }} items={categories.map((item) => ({ href: `/faq?${new URLSearchParams({ ...(q ? { q } : {}), ...(product ? { product } : {}), ...(solution ? { solution } : {}), category: item.value }).toString()}`, label: item.label, active: category === item.value }))} />
        <div className="min-w-0 space-y-8">
          <FaqFilters locale={currentLocale} q={q} category={category} product={product} solution={solution} categories={categories} products={products} solutions={solutions} />
          <ListingResultHeader eyebrow={categoryTitle} title={q ? (locale === "zh" ? `搜索“${q}”` : `Results for “${q}”`) : (locale === "zh" ? "常见问题" : "Frequently asked questions")} count={faqs.length} countLabel={locale === "zh" ? "个问题" : "questions"} />
          {faqs.length ? <FaqList items={faqs} locale={currentLocale} /> : <ListingEmptyState message={hasFilters ? (locale === "zh" ? "没有找到匹配的问题。" : "No questions matched your filters.") : (locale === "zh" ? "暂无常见问题。" : "No questions available yet.")} resetHref={localizedHref(currentLocale, "/faq")} resetLabel={locale === "zh" ? "查看全部问题" : "View all questions"} />}
        </div>
      </div>
    </ListingSection>
  </ListingPageShell>;
}
