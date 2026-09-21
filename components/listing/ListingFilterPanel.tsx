import { Search, X } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { ListingFilterDrawer } from "./ListingFilterDrawer";

export type FilterOption = { value: string; label: string };

export type FilterField = {
  name: string;
  label: string;
  value?: string;
  allLabel: string;
  options: FilterOption[];
};

export type ActiveFilter = {
  name: string;
  label: string;
  clearHref: string;
};

export type ListingFilterSearch = {
  name: string;
  value?: string;
  label: string;
  placeholder: string;
};

type ListingFilterPanelProps = {
  locale: Locale;
  search: ListingFilterSearch;
  primaryFields: FilterField[];
  secondaryFields?: FilterField[];
  activeFilters: ActiveFilter[];
  resetHref: string;
};

function SearchField({ search }: { search: ListingFilterSearch }) {
  return (
    <label className="block min-w-0 flex-1 text-sm font-semibold text-brand-ink">
      {search.label}
      <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-brand-border bg-white px-3 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20">
        <Search aria-hidden="true" size={17} className="shrink-0 text-brand-teal" />
        <input
          type="search"
          name={search.name}
          defaultValue={search.value}
          placeholder={search.placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 outline-none"
        />
      </span>
    </label>
  );
}

function SelectField({ field }: { field: FilterField }) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-brand-ink">
      {field.label}
      <select
        name={field.name}
        defaultValue={field.value}
        className="mt-2 min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 font-normal outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
      >
        <option value="">{field.allLabel}</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormActions({ locale }: { locale: Locale }) {
  return (
    <button type="submit" className="brand-button-primary min-h-11 self-end">
      <Search aria-hidden="true" size={16} />
      {locale === "zh" ? "应用筛选" : "Apply filters"}
    </button>
  );
}

function ActiveFilters({
  locale,
  filters,
  resetHref,
}: {
  locale: Locale;
  filters: ActiveFilter[];
  resetHref: string;
}) {
  if (!filters.length) return null;

  const isChinese = locale === "zh";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={isChinese ? "已选筛选" : "Active filters"}>
      {filters.map((filter) => (
        <Link
          key={filter.name}
          href={localizedHref(locale, filter.clearHref)}
          aria-label={isChinese ? `移除${filter.label}筛选` : `Remove ${filter.label} filter`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-teal/10 px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-teal/20"
        >
          {filter.label}
          <X aria-hidden="true" size={14} />
        </Link>
      ))}
      <Link
        href={localizedHref(locale, resetHref)}
        aria-label={isChinese ? "清除全部筛选" : "Clear all filters"}
        className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-brand-blue hover:text-brand-teal"
      >
        {isChinese ? "清除全部" : "Clear all"}
      </Link>
    </div>
  );
}

function DesktopFilterForm({
  locale,
  search,
  primaryFields,
  secondaryFields,
  activeFilters,
  resetHref,
}: ListingFilterPanelProps) {
  const isChinese = locale === "zh";

  return (
    <div
      data-testid="listing-filter-panel-desktop"
      className="hidden rounded-2xl border border-brand-border bg-white p-5 shadow-sm lg:block"
    >
      <form method="get">
        <div className="grid gap-4 xl:grid-cols-[minmax(16rem,1.5fr)_repeat(2,minmax(10rem,1fr))_auto] xl:items-end">
          <SearchField search={search} />
          {primaryFields.map((field) => (
            <SelectField key={field.name} field={field} />
          ))}
          <FormActions locale={locale} />
        </div>
        {secondaryFields?.length ? (
          <details className="mt-4 border-t border-brand-border pt-4">
            <summary className="min-h-11 cursor-pointer py-2.5 text-sm font-semibold text-brand-blue">
              {isChinese ? "更多筛选" : "More filters"}
            </summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {secondaryFields.map((field) => (
                <SelectField key={field.name} field={field} />
              ))}
            </div>
          </details>
        ) : null}
      </form>
      <ActiveFilters locale={locale} filters={activeFilters} resetHref={resetHref} />
    </div>
  );
}

export function ListingFilterPanel(props: ListingFilterPanelProps) {
  const { locale, search, primaryFields, secondaryFields = [], activeFilters, resetHref } =
    props;

  return (
    <div>
      <DesktopFilterForm {...props} secondaryFields={secondaryFields} />
      <ListingFilterDrawer locale={locale} title={locale === "zh" ? "筛选" : "Filters"}>
        <form method="get" className="space-y-4">
          <SearchField search={search} />
          {[...primaryFields, ...secondaryFields].map((field) => (
            <SelectField key={field.name} field={field} />
          ))}
          <FormActions locale={locale} />
        </form>
        <ActiveFilters locale={locale} filters={activeFilters} resetHref={resetHref} />
      </ListingFilterDrawer>
    </div>
  );
}
