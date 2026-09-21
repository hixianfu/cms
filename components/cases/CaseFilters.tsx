import type { Locale } from "@/lib/i18n/config";
import { ListingFilterPanel, type ActiveFilter, type FilterField } from "@/components/listing/ListingFilterPanel";

type Option = { value: string; label: string };

function queryHref(values: Record<string, string | undefined>) {
  const query = Object.entries(values)
    .filter(([, value]) => value)
    .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value as string)}`)
    .join("&");
  return query ? `/cases?${query}` : "/cases";
}

export function CaseFilters({
  locale,
  q,
  category,
  industry,
  product,
  scenario,
  categories,
  industries,
  products,
  scenarios,
}: {
  locale: Locale;
  q?: string;
  category?: string;
  industry?: string;
  product?: string;
  scenario?: string;
  categories: Option[];
  industries: Option[];
  products: Option[];
  scenarios: Option[];
}) {
  const values = { q, category, industry, product, scenario };
  const labelFor = (name: string, value: string | undefined) =>
    value ? ({ category: categories, industry: industries, product: products, scenario: scenarios }[name] ?? []).find((option) => option.value === value)?.label ?? value : "";
  const activeFilters: ActiveFilter[] = ([
    ["q", q, q ? (locale === "zh" ? `搜索：${q}` : `Search: ${q}`) : ""],
    ["category", category, labelFor("category", category)],
    ["industry", industry, labelFor("industry", industry)],
    ["product", product, labelFor("product", product)],
    ["scenario", scenario, labelFor("scenario", scenario)],
  ] as Array<[string, string | undefined, string]>)
    .filter(([, value]) => value)
    .map(([name, , label]) => ({
      name,
      label,
      clearHref: queryHref(Object.fromEntries(Object.entries(values).filter(([key]) => key !== name))),
    }));

  const primaryFields: FilterField[] = [
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
      options: industries,
    },
  ];
  const secondaryFields: FilterField[] = [
    {
      name: "product",
      label: locale === "zh" ? "产品" : "Product",
      value: product,
      allLabel: locale === "zh" ? "全部产品" : "All products",
      options: products,
    },
    {
      name: "scenario",
      label: locale === "zh" ? "应用场景" : "Scenario",
      value: scenario,
      allLabel: locale === "zh" ? "全部场景" : "All scenarios",
      options: scenarios,
    },
  ];

  return (
    <ListingFilterPanel
      locale={locale}
      search={{
        name: "q",
        value: q,
        label: locale === "zh" ? "搜索案例" : "Search cases",
        placeholder: locale === "zh" ? "搜索案例标题" : "Search case titles",
      }}
      primaryFields={primaryFields}
      secondaryFields={secondaryFields}
      activeFilters={activeFilters}
      resetHref="/cases"
    />
  );
}
