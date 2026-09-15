import type { Product } from "@/types/content";

type ProductSpecificationsProps = {
  specifications?: Product["specifications"];
  locale: string;
};

export function ProductSpecifications({ specifications, locale }: ProductSpecificationsProps) {
  const items = (specifications ?? []).filter(
    (specification) => specification?.label?.trim() && specification?.value?.trim(),
  );

  if (!items.length) return null;

  return (
    <section className="mt-10" aria-labelledby="product-specifications-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
            {locale === "zh" ? "Technical data" : "Technical data"}
          </p>
          <h2 id="product-specifications-title" className="mt-1 text-xl font-semibold text-slate-950">
            {locale === "zh" ? "产品参数" : "Specifications"}
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {items.length} {locale === "zh" ? "项" : items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-2">
        {items.map((specification, index) => (
          <div
            key={`${specification.label}-${specification.value}-${index}`}
            className="min-w-0 bg-white px-5 py-4 transition-colors hover:bg-slate-50"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{specification.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold leading-6 text-slate-950">{specification.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
