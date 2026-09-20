import { Search, X } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";

export type PreservedSearchParams = Record<
  string,
  string | number | null | undefined
>;

export type ListingSearchBarProps = {
  locale: Locale;
  name: string;
  value?: string;
  label: string;
  placeholder: string;
  preserved?: PreservedSearchParams;
  clearHref?: string;
};

export function ListingSearchBar({
  locale,
  name,
  value,
  label,
  placeholder,
  preserved,
  clearHref,
}: ListingSearchBarProps) {
  const isChinese = locale === "zh";

  return (
    <form method="get" role="search" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {Object.entries(preserved ?? {}).map(([paramName, paramValue]) =>
        paramValue === undefined || paramValue === null || paramValue === "" ? null : (
          <input key={paramName} type="hidden" name={paramName} value={paramValue} />
        ),
      )}
      <label className="block min-w-0 flex-1 text-sm font-semibold text-brand-ink">
        {label}
        <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-brand-border bg-white px-3 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20">
          <Search aria-hidden="true" size={17} className="shrink-0 text-brand-teal" />
          <input
            type="search"
            name={name}
            defaultValue={value}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-2.5 outline-none"
          />
        </span>
      </label>
      <div className="flex gap-2">
        <button type="submit" className="brand-button-primary min-h-11">
          <Search aria-hidden="true" size={16} />
          {isChinese ? "搜索" : "Search"}
        </button>
        {clearHref ? (
          <Link
            href={localizedHref(locale, clearHref)}
            aria-label={isChinese ? "清除搜索" : "Clear search"}
            className="brand-button inline-flex min-h-11 items-center gap-2 border border-brand-border bg-white"
          >
            <X aria-hidden="true" size={16} />
            {isChinese ? "清除" : "Clear"}
          </Link>
        ) : null}
      </div>
    </form>
  );
}
