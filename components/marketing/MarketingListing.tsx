import { ListingEmptyState } from "@/components/listing/ListingEmptyState";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingPageShell, ListingSection } from "@/components/listing/ListingPageShell";
import { ListingResultHeader } from "@/components/listing/ListingResultHeader";
import { localizedHref } from "@/lib/i18n/routing";
import type { ContentCategory, Locale, Scenario, Solution } from "@/types/content";
import { MarketingCard } from "./MarketingCard";
import { MarketingFilters } from "./MarketingFilters";

type Kind = "solutions" | "scenarios";

export function MarketingListing({
  locale,
  kind,
  items,
  allItems,
  categories,
  q,
  category,
  industry,
}: {
  locale: Locale;
  kind: Kind;
  items: Array<Solution | Scenario>;
  allItems: Array<Solution | Scenario>;
  categories: ContentCategory[];
  q?: string;
  category?: string;
  industry?: string;
}) {
  const solution = kind === "solutions";
  const listingLocale = locale === "zh" ? "zh" : "en";
  const industries = Array.from(
    new Set(
      allItems
        .map((item) => item.industry)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();
  const copy =
    locale === "zh"
      ? solution
        ? {
            eyebrow: "解决方案",
            title: "针对业务挑战的专业包装方案",
            description:
              "从客户痛点、包装需求和使用环境出发，选择适合业务的整体方案。",
            all: "全部解决方案",
            featured: "精选解决方案",
            empty: "没有找到匹配的解决方案。",
          }
        : {
            eyebrow: "应用场景",
            title: "让包装能力适配每一个真实场景",
            description:
              "了解艾美森产品在生产、仓储、物流和行业现场中的实际应用。",
            all: "全部应用场景",
            featured: "精选应用场景",
            empty: "没有找到匹配的应用场景。",
          }
      : solution
        ? {
            eyebrow: "Solutions",
            title: "Packaging solutions for real business challenges",
            description:
              "Start with customer pain points, packaging needs, and operating conditions to find the right approach.",
            all: "All solutions",
            featured: "Featured solutions",
            empty: "No solutions matched your filters.",
          }
        : {
            eyebrow: "Application scenarios",
            title: "Packaging designed for every real-world scenario",
            description:
              "Explore how Ameson products support production, warehousing, logistics, and industry operations.",
            all: "All scenarios",
            featured: "Featured scenarios",
            empty: "No scenarios matched your filters.",
          };

  const activeCategory = categories.find((item) => item.slug === category)?.name;
  const sparse = items.length > 0 && items.length <= 2;

  return (
    <ListingPageShell>
      <ListingHero
        locale={listingLocale}
        variant={solution ? "immersive" : "compact"}
        motif={solution ? "solution" : "scenario"}
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        stat={
          solution
            ? {
                value: items.length,
                label: locale === "zh" ? "项" : "items",
              }
            : undefined
        }
      />
      <ListingSection>
        <div className="space-y-8">
          <MarketingFilters
            locale={locale}
            path={kind}
            q={q}
            category={category}
            industry={industry}
            categories={categories.map((item) => ({
              value: item.slug,
              label: item.name,
            }))}
            industries={industries}
          />
          <ListingResultHeader
            eyebrow={activeCategory || industry || copy.all}
            title={
              q
                ? locale === "zh"
                  ? `搜索结果：“${q}”`
                  : `Results for “${q}”`
                : copy.featured
            }
            count={items.length}
            countLabel={locale === "zh" ? "项" : "items"}
          />
          {items.length ? (
            <div
              className={`grid gap-7 md:grid-cols-2 ${sparse ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}
              data-sparse={sparse ? "true" : undefined}
              data-testid="marketing-listing-grid"
            >
              {items.map((item) => (
                <MarketingCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  path={kind}
                />
              ))}
            </div>
          ) : (
            <ListingEmptyState
              message={copy.empty}
              resetHref={localizedHref(locale, `/${kind}`)}
              resetLabel={locale === "zh" ? "查看全部" : "View all"}
            />
          )}
        </div>
      </ListingSection>
    </ListingPageShell>
  );
}
