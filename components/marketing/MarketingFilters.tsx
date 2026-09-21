import { ListingFilterPanel, type ActiveFilter } from "@/components/listing/ListingFilterPanel";
import type { Locale } from "@/types/content";

type Option = { value: string; label: string };

type MarketingFiltersProps = {
  locale: Locale;
  path: "solutions" | "scenarios";
  q?: string;
  category?: string;
  industry?: string;
  categories: Option[];
  industries: string[];
};

function clearFilterHref(
  path: MarketingFiltersProps["path"],
  values: Pick<MarketingFiltersProps, "q" | "category" | "industry">,
  omitted: "category" | "industry",
) {
  const query = new URLSearchParams();

  if (values.q) query.set("q", values.q);
  if (omitted !== "category" && values.category) {
    query.set("category", values.category);
  }
  if (omitted !== "industry" && values.industry) {
    query.set("industry", values.industry);
  }

  const serialized = query.toString();
  return `/${path}${serialized ? `?${serialized}` : ""}`;
}

export function MarketingFilters({
  locale,
  path,
  q,
  category,
  industry,
  categories,
  industries,
}: MarketingFiltersProps) {
  const solution = path === "solutions";
  const listingLocale = locale === "zh" ? "zh" : "en";
  const activeFilters: ActiveFilter[] = [];

  if (category) {
    activeFilters.push({
      name: "category",
      label: categories.find((option) => option.value === category)?.label ?? category,
      clearHref: clearFilterHref(path, { q, category, industry }, "category"),
    });
  }

  if (industry) {
    activeFilters.push({
      name: "industry",
      label: industry,
      clearHref: clearFilterHref(path, { q, category, industry }, "industry"),
    });
  }

  return (
    <ListingFilterPanel
      locale={listingLocale}
      search={{
        name: "q",
        value: q,
        label:
          locale === "zh"
            ? solution
              ? "搜索解决方案"
              : "搜索应用场景"
            : solution
              ? "Search solutions"
              : "Search scenarios",
        placeholder: locale === "zh" ? "输入标题关键词" : "Search by title",
      }}
      primaryFields={[
        {
          name: "category",
          label: locale === "zh" ? "分类" : "Category",
          value: category,
          allLabel: locale === "zh" ? "全部分类" : "All categories",
          options: categories,
        },
        {
          name: "industry",
          label: locale === "zh" ? "行业" : "Industry",
          value: industry,
          allLabel: locale === "zh" ? "全部行业" : "All industries",
          options: industries.map((value) => ({ value, label: value })),
        },
      ]}
      activeFilters={activeFilters}
      resetHref={`/${path}`}
    />
  );
}
