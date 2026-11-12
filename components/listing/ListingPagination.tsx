import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { listingPageHref, type Pagination } from "@/lib/listing-pagination";

export function ListingPagination({ locale, path, pagination, filters = {} }: {
  locale: Locale;
  path: string;
  pagination: Pagination;
  filters?: Record<string, string | undefined>;
}) {
  const { page, pageSize, pageCount, total } = pagination;
  if (pageCount <= 1) return null;
  const zh = locale === "zh";
  const href = (target: number) => localizedHref(locale, listingPageHref(path, target, filters));
  const pages = Array.from(new Set([1, pageCount, ...Array.from({ length: 5 }, (_, index) => page + index - 2)]))
    .filter((number) => number >= 1 && number <= pageCount).sort((a, b) => a - b);
  const linkClass = "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-brand-border bg-white px-3 text-sm text-brand-ink transition hover:border-brand-teal hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-teal";
  const disabledClass = "inline-flex min-h-10 items-center rounded-lg border border-brand-border px-3 text-sm text-brand-muted opacity-50";

  return <nav aria-label={zh ? "产品分页" : "Product pagination"} className="flex flex-col gap-4 border-t border-brand-border pt-6">
    <p className="text-sm text-brand-muted">
      {zh ? `共 ${total} 个产品，显示第 ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} 个，第 ${page} / ${pageCount} 页` : `${total} products, showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}, page ${page} of ${pageCount}`}
    </p>
    <div className="flex flex-wrap items-center gap-2">
      {page > 1 ? <Link href={href(page - 1)} rel="prev" className={linkClass}>{zh ? "上一页" : "Previous"}</Link> : <span aria-disabled="true" className={disabledClass}>{zh ? "上一页" : "Previous"}</span>}
      {pages.map((number, index) => <span key={number} className="inline-flex items-center gap-2">
        {index > 0 && number - pages[index - 1] > 1 ? <span aria-hidden="true" className="px-1 text-brand-muted">…</span> : null}
        {number === page ? <span aria-current="page" aria-label={zh ? `第 ${number} 页` : `Page ${number}`} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-brand-blue px-3 text-sm font-semibold text-white">{number}</span> : <Link href={href(number)} aria-label={zh ? `第 ${number} 页` : `Page ${number}`} className={linkClass}>{number}</Link>}
      </span>)}
      {page < pageCount ? <Link href={href(page + 1)} rel="next" className={linkClass}>{zh ? "下一页" : "Next"}</Link> : <span aria-disabled="true" className={disabledClass}>{zh ? "下一页" : "Next"}</span>}
    </div>
  </nav>;
}
