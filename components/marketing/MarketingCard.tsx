import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ListingMediaPlaceholder } from "@/components/listing/ListingMediaPlaceholder";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveMediaUrl } from "@/lib/strapi/image";
import type { Locale, Scenario, Solution } from "@/types/content";

function distinctValues(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))),
  );
}

export function MarketingCard({
  item,
  locale,
  path,
}: {
  item: Solution | Scenario;
  locale: Locale;
  path: "solutions" | "scenarios";
}) {
  const solution = path === "solutions";
  const image = resolveMediaUrl(item.cover);
  const taxonomy = distinctValues([item.category?.name, item.industry]);
  const metadata = solution
    ? distinctValues([
        (item as Solution).customerPain,
        (item as Solution).packagingNeeds,
      ]).slice(0, 2)
    : distinctValues(
        (item as Scenario).products?.map((product) => product.name ?? product.title) ?? [],
      ).slice(0, 2);
  const label = solution
    ? locale === "zh"
      ? "查看解决方案"
      : "View solution"
    : locale === "zh"
      ? "查看应用场景"
      : "View scenario";

  return (
    <article className="listing-card group h-full">
      <Link
        href={localizedHref(locale, `/${path}/${item.slug}`)}
        className="block h-full"
      >
        <div className="listing-card-media aspect-[16/9]">
          {image ? (
            <Image
              src={image}
              alt={item.cover?.alternativeText ?? item.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingMediaPlaceholder motif={solution ? "solution" : "scenario"} />
          )}
        </div>
        <div className="flex min-h-64 flex-col p-6 sm:p-7">
          {taxonomy.length ? (
            <p
              className="listing-eyebrow flex flex-wrap gap-x-2 gap-y-1"
              data-testid="marketing-card-taxonomy"
            >
              {taxonomy.map((value, index) => (
                <span key={value}>
                  {index ? <span aria-hidden="true">/ </span> : null}
                  {value}
                </span>
              ))}
            </p>
          ) : null}
          <h2 className={`${taxonomy.length ? "mt-4" : ""} text-xl font-semibold text-brand-ink`}>
            {item.title}
          </h2>
          {item.summary ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-muted">
              {item.summary}
            </p>
          ) : null}
          {metadata.length ? (
            <ul
              className="mt-5 flex flex-wrap gap-2"
              data-testid="marketing-card-metadata"
            >
              {metadata.map((value) => (
                <li
                  key={value}
                  className="max-w-full rounded-full bg-brand-teal/10 px-3 py-1.5 text-xs font-semibold text-brand-blue"
                >
                  <span className="line-clamp-1">{value}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">
            {label}
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
