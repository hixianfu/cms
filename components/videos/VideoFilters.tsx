import type { Locale } from "@/lib/i18n/config";
import { ListingFilterPanel, type ActiveFilter, type FilterField } from "@/components/listing/ListingFilterPanel";

type Option = { value: string; label: string };

function queryHref(values: Record<string, string | undefined>) {
  const query = Object.entries(values)
    .filter(([, value]) => value)
    .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value as string)}`)
    .join("&");
  return query ? `/videos?${query}` : "/videos";
}

export function VideoFilters({ locale, q, category, product, categories, products }: { locale: Locale; q?: string; category?: string; product?: string; categories: Option[]; products: Option[] }) {
  const values = { q, category, product };
  const labelFor = (name: string, value: string | undefined) =>
    value ? ({ category: categories, product: products }[name] ?? []).find((option) => option.value === value)?.label ?? value : "";
  const activeFilters: ActiveFilter[] = ([
    ["q", q, q ? (locale === "zh" ? `搜索：${q}` : `Search: ${q}`) : ""],
    ["category", category, labelFor("category", category)],
    ["product", product, labelFor("product", product)],
  ] as Array<[string, string | undefined, string]>)
    .filter(([, value]) => value)
    .map(([name, , label]) => ({
      name,
      label,
      clearHref: queryHref(Object.fromEntries(Object.entries(values).filter(([key]) => key !== name))),
    }));
  const primaryFields: FilterField[] = [{
    name: "category",
    label: locale === "zh" ? "视频分类" : "Category",
    value: category,
    allLabel: locale === "zh" ? "全部分类" : "All categories",
    options: categories,
  }];
  const secondaryFields: FilterField[] = [{
    name: "product",
    label: locale === "zh" ? "关联产品" : "Product",
    value: product,
    allLabel: locale === "zh" ? "全部产品" : "All products",
    options: products,
  }];

  return (
    <ListingFilterPanel
      locale={locale}
      search={{
        name: "q",
        value: q,
        label: locale === "zh" ? "搜索视频" : "Search videos",
        placeholder: locale === "zh" ? "搜索视频标题" : "Search video titles",
      }}
      primaryFields={primaryFields}
      secondaryFields={secondaryFields}
      activeFilters={activeFilters}
      resetHref="/videos"
    />
  );
}
